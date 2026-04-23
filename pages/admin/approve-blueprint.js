import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);
const PORTAL = process.env.NEXT_PUBLIC_SITE_URL || 'https://5cblueprint.awakeningdestiny.global';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { applicationId, action, notes } = req.body;
  if (!applicationId || !['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid request' });

  const { data: app, error } = await supabase.from('blueprint_applications').select('*').eq('id', applicationId).single();
  if (error || !app) return res.status(404).json({ error: 'Not found' });

  const status = action === 'approve' ? 'approved' : 'rejected';
  await supabase.from('blueprint_applications').update({ status, notes: notes || app.notes, updated_at: new Date().toISOString() }).eq('id', applicationId);

  if (action === 'approve') {
    await supabase.from('blueprint_members').upsert({
      email: app.email, stripe_session_id: app.stripe_session_id || null,
      amount_paid: 997.00, status: 'active',
      paid_at: app.paid_at || new Date().toISOString(),
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    try {
      await resend.emails.send({
        from: 'Will Meier <will@awakeningdestiny.global>',
        to: app.email,
        subject: "You're In — Called to Carry Blueprint",
        html: `<div style="font-family:sans-serif;max-width:600px;color:#021A35">
          <h2>Welcome to the Called to Carry Blueprint, ${app.first_name}.</h2>
          <p>Your application has been reviewed and approved. You now have full access to the portal.</p>
          ${notes ? `<p style="background:#F0F9FF;padding:16px;border-radius:8px;border-left:4px solid #0172BC">${notes}</p>` : ''}
          <p><a href="${PORTAL}/login"
            style="background:#021A35;color:#FDD20D;padding:14px 28px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
            Access Your Portal →
          </a></p>
          <p style="margin-top:32px">Walking with you,<br/><strong>Will Meier</strong><br/>Awakening Destiny Global</p>
        </div>`,
      });
    } catch (e) { console.error('Email error:', e); }
  } else {
    try {
      await resend.emails.send({
        from: 'Will Meier <will@awakeningdestiny.global>',
        to: app.email,
        subject: 'Your Called to Carry Blueprint Application',
        html: `<div style="font-family:sans-serif;max-width:600px;color:#021A35">
          <p>Hi ${app.first_name},</p>
          <p>Thank you for applying. After review, we are not moving forward with your application at this time.</p>
          ${notes ? `<p style="background:#F8F8F8;padding:16px;border-radius:8px">${notes}</p>` : ''}
          <p>This does not mean the door is permanently closed. Walking with you,<br/><strong>Will Meier</strong></p>
        </div>`,
      });
    } catch (e) { console.error('Email error:', e); }
  }

  return res.status(200).json({ success: true, status });
}