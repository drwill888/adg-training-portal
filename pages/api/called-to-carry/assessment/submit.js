// pages/api/called-to-carry/assessment/submit.js
// Receives completed assessment, scores it, writes to DB, starts email sequence.
// POST only. Server-side only — uses service role client.

import { createClient } from '@supabase/supabase-js';
import { scoreAssessment, extractPrivateSignal } from '../../../../lib/called-to-carry/scoring';
import { hashIp } from '../../../../lib/called-to-carry/auth/tokens';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, responses, referrer, utm } = req.body || {};

  // ── Basic validation ──────────────────────────────────────────────────────
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  if (!Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ error: 'responses array is required' });
  }

  const supabase = getAdminClient();
  const ip = getIp(req);
  const ipHash = hashIp(ip);
  const now = new Date().toISOString();

  // ── Rate limit: max 3 submissions per IP in 1 hour ────────────────────────
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('assessment_rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('submitted_at', oneHourAgo);

  if (count >= 3) {
    return res.status(429).json({ error: 'Too many submissions. Please try again later.' });
  }

  // ── Score ─────────────────────────────────────────────────────────────────
  const { archetype, scores, confidence } = scoreAssessment(responses);
  const privateSignal = extractPrivateSignal(responses);

  // ── Insert submission ─────────────────────────────────────────────────────
  const { data: submission, error: subError } = await supabase
    .from('assessment_submissions')
    .insert({
      email: email.toLowerCase().trim(),
      first_name: firstName?.trim() || null,
      last_name: lastName?.trim() || null,
      archetype,
      archetype_confidence: confidence,
      scores,
      private_signal: privateSignal,
      ip_hash: ipHash,
      referrer: referrer || null,
      utm_source: utm?.source || null,
      utm_medium: utm?.medium || null,
      utm_campaign: utm?.campaign || null,
      completed_at: now,
    })
    .select('id')
    .single();

  if (subError) {
    console.error('submission insert error:', subError.message);
    return res.status(500).json({ error: 'Failed to save submission' });
  }

  const submissionId = submission.id;

  // ── Insert individual responses ───────────────────────────────────────────
  const responseRows = responses
    .filter(r => r.questionId !== 'q10' || r.responseText)
    .map((r, i) => ({
      submission_id: submissionId,
      question_id: r.questionId,
      question_index: i + 1,
      response_option_id: Array.isArray(r.optionIds) && r.optionIds.length === 1
        ? r.optionIds[0]
        : null,
      response_option_ids: Array.isArray(r.optionIds) && r.optionIds.length > 1
        ? r.optionIds
        : null,
      response_text: r.responseText || null,
    }));

  if (responseRows.length > 0) {
    const { error: respError } = await supabase
      .from('assessment_responses')
      .insert(responseRows);
    if (respError) {
      console.error('responses insert error:', respError.message);
      // Non-fatal — submission is saved, continue
    }
  }

  // ── Create email sequence ─────────────────────────────────────────────────
  // next_send_at = now (welcome email goes immediately on next cron tick)
  const { error: seqError } = await supabase
    .from('email_sequences')
    .insert({
      submission_id: submissionId,
      email: email.toLowerCase().trim(),
      archetype,
      sequence_variant: 'v1',
      current_step: 0,
      next_send_at: now,
      status: 'active',
    });

  if (seqError) {
    console.error('sequence insert error:', seqError.message);
    // Non-fatal — we can backfill sequences manually if needed
  }

  // ── Send welcome email immediately ─────────────────────────────────────────
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email.toLowerCase().trim(),
      subject: 'Your Called to Carry Assessment Results',
      html: '<p>Hi ' + firstName + ',</p><p>Your archetype is <strong>' + archetype + '</strong>.</p><p><a href="https://calledtocarry.awakeningdestiny.global/assessment/results/' + submissionId + '">View Your Full Results</a></p><p>— Will Meier<br>Awakening Destiny Global</p>',
    });
  } catch (emailErr) {
    console.error('welcome email error:', emailErr.message);
  }

    // ── Log rate limit entry ──────────────────────────────────────────────────
  await supabase.from('assessment_rate_limits').insert({ ip_hash: ipHash });

  return res.status(200).json({ submissionId, archetype });
}
