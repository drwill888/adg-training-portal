// pages/api/blueprint/submit-application.js
// Saves Blueprint application to Supabase + fires confirmation emails

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    firstName, lastName, email, phone, city,
    archetype, stage, prevExperience,
    businessOrMinistry, whyNow, commitment,
  } = req.body;

  if (!firstName || !lastName || !email || !archetype || !stage || !businessOrMinistry || !whyNow) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  const fullName = `${firstName} ${lastName}`;

  // ── 1. Save to Supabase ──────────────────────────────────────────────────
  const { error: dbError } = await supabase
    .from('blueprint_applications')
    .insert([{
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      city,
      archetype,
      leadership_stage: stage,
      prev_experience: prevExperience,
      business_or_ministry: businessOrMinistry,
      why_now: whyNow,
      commitment_confirmed: commitment,
      status: 'pending',
      created_at: new Date().toISOString(),
    }]);

  if (dbError) {
    console.error('Supabase insert error:', dbError);
    return res.status(500).json({ error: 'Failed to save application. Please try again.' });
  }

  // ── 2. Confirmation email to applicant ──────────────────────────────────
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Will @ ADG <will@awakeningdestiny.global>',
      to: email,
      subject: 'Your Blueprint Application — Received',
      html: `
        <div style="background:#010F1E;color:#FDF8F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#C8A951;margin:0 0 1.5rem;">
            Called to Carry · Blueprint
          </p>
          <h1 style="font-size:2rem;font-weight:400;line-height:1.2;color:#FDF8F0;margin:0 0 1.5rem;">
            ${firstName}, your application is in.
          </h1>
          <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.8);line-height:1.75;margin:0 0 1.25rem;">
            Thank you for applying to the Called to Carry Blueprint. Every application
            is reviewed personally — you will hear back within 3–5 business days.
          </p>
          <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.8);line-height:1.75;margin:0 0 2rem;">
            Ten seats. One cohort. If this is your season — stay ready.
          </p>
          <p style="font-size:0.9rem;color:#C8A951;margin:0;">— Will, Founder · Awakening Destiny Global</p>
          <hr style="border:none;border-top:1px solid rgba(200,169,81,0.2);margin:2.5rem 0 1.5rem;" />
          <p style="font-size:0.72rem;color:rgba(253,248,240,0.3);margin:0;">
            © ${new Date().getFullYear()} Awakening Destiny Global
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Resend confirmation error:', emailErr);
  }

  // ── 3. Internal notification to Will ────────────────────────────────────
  try {
    await resend.emails.send({
      from: 'Called to Carry <noreply@awakeningdestiny.global>',
      to: process.env.NOTIFICATION_EMAIL || 'meier.will@gmail.com',
      subject: `New Blueprint Application — ${fullName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:2rem;">
          <h2 style="margin:0 0 1rem;">New Blueprint Application</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:0.5rem;font-weight:bold;">Name</td><td style="padding:0.5rem;">${fullName}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">Email</td><td style="padding:0.5rem;">${email}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">Phone</td><td style="padding:0.5rem;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">City</td><td style="padding:0.5rem;">${city}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">Archetype</td><td style="padding:0.5rem;">${archetype}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">Stage</td><td style="padding:0.5rem;">${stage}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">Prev Experience</td><td style="padding:0.5rem;">${prevExperience}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">Assignment</td><td style="padding:0.5rem;">${businessOrMinistry}</td></tr>
            <tr><td style="padding:0.5rem;font-weight:bold;">Why Now</td><td style="padding:0.5rem;">${whyNow}</td></tr>
          </table>
        </div>
      `,
    });
  } catch (notifErr) {
    console.error('Resend notification error:', notifErr);
  }

  return res.status(200).json({ success: true });
}
