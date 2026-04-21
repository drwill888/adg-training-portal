// lib/called-to-carry/email/scheduler.js
// Queue logic for the email cron handler.
// Called by pages/api/called-to-carry/assessment/email-cron.js every 15 min.
// Server-side only.

import { createClient } from '@supabase/supabase-js';
import { getRenderedTemplate } from './templates';
import { sendEmail } from './resend';
import { buildUnsubscribeUrl } from '../auth/tokens';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Process all sequences that are due to send.
 * Returns a summary { processed, sent, skipped, errors }.
 */
export async function processEmailQueue() {
  const supabase = getAdminClient();
  const now = new Date().toISOString();

  const { data: sequences, error } = await supabase
    .from('email_sequences')
    .select('*, assessment_submissions(first_name, email, id)')
    .eq('status', 'active')
    .lte('next_send_at', now)
    .or(`paused_until.is.null,paused_until.lte.${now}`);

  if (error) throw new Error(`Failed to fetch sequences: ${error.message}`);
  if (!sequences || sequences.length === 0) return { processed: 0, sent: 0, skipped: 0, errors: 0 };

  const results = { processed: sequences.length, sent: 0, skipped: 0, errors: 0 };

  for (const seq of sequences) {
    try {
      const nextStep = seq.current_step + 1;

      // Fetch the next template
      let template;
      try {
        template = await getRenderedTemplate(
          { archetype: seq.archetype, stepNumber: nextStep, variant: seq.sequence_variant },
          {
            firstName: seq.assessment_submissions?.first_name,
            resultsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/assessment/results/${seq.submission_id}`,
            unsubscribeUrl: buildUnsubscribeUrl(seq.id),
          }
        );
      } catch {
        // No more templates — sequence complete
        await supabase
          .from('email_sequences')
          .update({ status: 'completed', updated_at: now })
          .eq('id', seq.id);
        results.skipped++;
        continue;
      }

      // Send
      const { id: resendMessageId } = await sendEmail({
        to: seq.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      // Log the send
      await supabase.from('email_sends').insert({
        sequence_id: seq.id,
        submission_id: seq.submission_id,
        step_number: nextStep,
        template_id: `${seq.archetype}_step_${nextStep}`,
        resend_message_id: resendMessageId,
        status: 'sent',
        sent_at: now,
      });

      // Advance the sequence
      const nextSendAt = computeNextSendAt(template.delayDaysFromPrevious);
      await supabase
        .from('email_sequences')
        .update({
          current_step: nextStep,
          next_send_at: nextSendAt,
          updated_at: now,
        })
        .eq('id', seq.id);

      results.sent++;
    } catch (err) {
      console.error(`Sequence ${seq.id} failed:`, err.message);
      await supabase.from('email_sends').insert({
        sequence_id: seq.id,
        submission_id: seq.submission_id,
        step_number: seq.current_step + 1,
        template_id: 'unknown',
        status: 'failed',
        error: err.message,
        created_at: now,
      }).catch(() => {});
      results.errors++;
    }
  }

  return results;
}

/**
 * Compute next_send_at: next occurrence of 7:15 AM ET
 * that is at least `delayDays` calendar days from now.
 */
function computeNextSendAt(delayDays) {
  const now = new Date();
  const target = new Date(now);
  target.setDate(target.getDate() + (delayDays || 0));

  // Set to 7:15 AM ET (UTC-5 standard / UTC-4 daylight)
  // Simple approach: store as UTC 12:15 (covers both EST and EDT with minimal drift)
  // Production improvement: use a proper timezone library (e.g. date-fns-tz)
  target.setUTCHours(12, 15, 0, 0);

  // If that time has already passed today, advance one day
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return target.toISOString();
}
