// pages/api/called-to-carry/founders/apply.js
// Receives Founders Cohort applications.
// Sends notification email to info@awakeningdestiny.global.
// Sends confirmation email to applicant.

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, archetype, why, building, referral } = req.body;

  if (!firstName || !lastName || !email || !phone || !why) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Will @ ADG <will@awakeningdestiny.global>';
  const adminEmail = 'info@awakeningdestiny.global';

  try {
    // ── 1. Notify ADG admin ──────────────────────────────────────────────
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `New Founders Cohort application: ${firstName} ${lastName}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:2rem;background:#FDF8F0;color:#021A35;">
          <p style="font-size:0.78rem;letter-spacing:0.15em;text-transform:uppercase;color:#C8A951;margin:0 0 0.5rem;font-weight:600;">New Application · Founders Cohort</p>
          <h1 style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:600;margin:0 0 1.5rem;">${firstName} ${lastName}</h1>

          <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">
            <tr><td style="padding:0.5rem 0;font-weight:600;width:140px;">Email:</td><td><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:0.5rem 0;font-weight:600;">Phone:</td><td>${phone}</td></tr>
            ${archetype ? `<tr><td style="padding:0.5rem 0;font-weight:600;">Archetype:</td><td>${archetype}</td></tr>` : ''}
            ${referral ? `<tr><td style="padding:0.5rem 0;font-weight:600;">Heard via:</td><td>${referral}</td></tr>` : ''}
          </table>

          <hr style="border:none;border-top:1px solid rgba(2,26,53,0.15);margin:1.5rem 0;" />

          <p style="font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:#C8A951;font-weight:600;margin:0 0 0.5rem;">Why this cohort, why now?</p>
          <p style="font-size:1rem;line-height:1.7;white-space:pre-wrap;margin:0 0 1.5rem;">${why.replace(/</g, '&lt;')}</p>

          ${building ? `
            <p style="font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:#C8A951;font-weight:600;margin:0 0 0.5rem;">Currently building / leading</p>
            <p style="font-size:1rem;line-height:1.7;white-space:pre-wrap;margin:0 0 1.5rem;">${building.replace(/</g, '&lt;')}</p>
          ` : ''}

          <hr style="border:none;border-top:1px solid rgba(2,26,53,0.15);margin:1.5rem 0;" />
          <p style="font-size:0.78rem;color:#666;font-style:italic;margin:0;">Reply to this email to respond to ${firstName} directly. Submitted ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}.</p>
        </div>
      `,
    });

    // ── 2. Confirm to applicant ───────────────────────────────────────────
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Your Founders Cohort application is received',
      html: `
        <div style="background:#021A35;color:#FDF8F0;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#C8A951;margin:0 0 1.5rem;">Founders Cohort · Application Received</p>
          <h1 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:400;line-height:1.2;color:#FDF8F0;margin:0 0 1.5rem;">${firstName}, your application has been received.</h1>
          <p style="font-size:1rem;line-height:1.75;color:rgba(253,248,240,0.85);margin:0 0 1.25rem;">
            Will reviews every Founders Cohort application personally — usually within 48 hours. He will reach out to you directly to talk through fit, timing, and what walking the cohort together would look like.
          </p>
          <p style="font-size:1rem;line-height:1.75;color:rgba(253,248,240,0.85);margin:0 0 1.25rem;">
            This is intentional. The cohort is a relational commitment, not a transaction. The application is the beginning of a conversation — not the end of one.
          </p>
          <p style="font-size:1rem;line-height:1.75;color:rgba(253,248,240,0.85);margin:0 0 2rem;">
            In the meantime, sit with what was stirred when you took the assessment. Notice what is rising. The Spirit is doing something. Pay attention.
          </p>
          <hr style="border:none;border-top:1px solid rgba(200,169,81,0.2);margin:2rem 0;" />
          <p style="font-size:0.9rem;color:#C8A951;margin:0 0 0.5rem;">— Will, Founder · Awakening Destiny Global</p>
          <p style="font-size:0.72rem;color:rgba(253,248,240,0.4);margin:1.5rem 0 0;">
            Questions? Reply to this email.<br/>
            © ${new Date().getFullYear()} Awakening Destiny Global · awakeningdestiny.global
          </p>
        </div>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Founders application error:', err);
    return res.status(500).json({ error: 'Could not submit application. Please try again or email info@awakeningdestiny.global directly.' });
  }
}