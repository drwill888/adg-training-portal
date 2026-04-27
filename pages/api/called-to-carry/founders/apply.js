// pages/api/called-to-carry/founders/apply.js
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

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'will@awakeningdestiny.global';

  try {
    await resend.emails.send({
      from: fromEmail,
      to: 'info@awakeningdestiny.global',
      replyTo: email,
      subject: `New Founders Cohort application: ${firstName} ${lastName}`,
      html: `<div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:2rem;background:#FDF8F0;color:#021A35;"><h2 style="color:#021A35;">${firstName} ${lastName}</h2><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Phone:</strong> ${phone}</p>${archetype ? `<p><strong>Archetype:</strong> ${archetype}</p>` : ''}${building ? `<p><strong>Building:</strong> ${building}</p>` : ''}${referral ? `<p><strong>Heard via:</strong> ${referral}</p>` : ''}<hr/><p><strong>Why now:</strong></p><p>${why}</p></div>`,
    });

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Your Founders Cohort application is received',
      html: `<div style="background:#021A35;color:#FDF8F0;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:3rem 2rem;"><p style="color:#C8A951;text-transform:uppercase;letter-spacing:0.15em;font-size:0.75rem;">Founders Cohort · Application Received</p><h1 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:400;color:#FDF8F0;">${firstName}, your application has been received.</h1><p style="color:rgba(253,248,240,0.85);line-height:1.75;">Will reviews every application personally — usually within 48 hours. He will reach out to you directly to talk through fit and next steps.</p><p style="color:rgba(253,248,240,0.85);line-height:1.75;">In the meantime, pay attention to what is stirring. The Spirit is doing something.</p><p style="color:#C8A951;">— Will, Founder · Awakening Destiny Global</p></div>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Founders application error:', err);
    return res.status(500).json({ error: 'Could not submit application. Please try again.' });
  }
}