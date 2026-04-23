import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email, archetype, submissionId } = req.body;
  if (!email || !name) return res.status(400).json({ error: 'Name and email required' });

  try {
    await resend.emails.send({
      from: 'Called to Carry <noreply@awakeningdestiny.global>',
      to: 'will@awakeningdestiny.global',
      subject: `Advisory Inquiry — ${name}`,
      html: `<div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#021A35">New Advisory Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Archetype:</strong> ${archetype || '—'}</p>
        ${submissionId ? `<p><strong>Submission:</strong> ${submissionId}</p>` : ''}
        <p style="margin-top:24px"><a href="mailto:${email}?subject=Re: Advisory Inquiry"
          style="background:#021A35;color:white;padding:10px 20px;border-radius:4px;text-decoration:none">
          Reply to ${name}
        </a></p></div>`,
    });
    await resend.emails.send({
      from: 'Will Meier <will@awakeningdestiny.global>',
      to: email,
      subject: 'Your Advisory Inquiry — Received',
      html: `<div style="font-family:sans-serif;max-width:600px;color:#021A35">
        <p>Hi ${name},</p>
        <p>Your inquiry about the Advisory track came through. I will be in touch within 48 hours to discuss whether it is the right fit for where you are going.</p>
        <p>If anything urgent comes up in the meantime, reply directly to this email.</p>
        <br/><p>Walking with you,<br/><strong>Will Meier</strong><br/>Awakening Destiny Global</p>
      </div>`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Advisory inquiry error:', err);
    return res.status(500).json({ error: 'Failed to send' });
  }
}