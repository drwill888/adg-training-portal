// pages/api/cohort/waitlist.js
// Saves waitlist email when cohort is closed
// Env var: COHORT_OPEN=true|false

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

  const { email, firstName } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // Save to waitlist table
  const { error: dbError } = await supabase
    .from('cohort_waitlist')
    .upsert([{
      email,
      first_name: firstName || null,
      created_at: new Date().toISOString(),
    }], { onConflict: 'email' });

  if (dbError) {
    console.error('Waitlist insert error:', dbError);
    return res.status(500).json({ error: 'Failed to join waitlist.' });
  }

  // Confirmation email
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Will @ ADG <will@awakeningdestiny.global>',
      to: email,
      subject: "You're on the waitlist — Called to Carry Cohort",
      html: `
        <div style="background:#021A35;color:#FDF8F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#C8A951;margin:0 0 1.5rem;">
            Called to Carry · Cohort Waitlist
          </p>
          <h1 style="font-size:2rem;font-weight:400;line-height:1.2;color:#FDF8F0;margin:0 0 1.5rem;">
            ${firstName ? `${firstName}, you` : 'You'}'re on the list.
          </h1>
          <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.8);line-height:1.75;margin:0 0 1.25rem;">
            The Called to Carry Cohort is currently full. When the next cohort opens,
            you will be the first to know.
          </p>
          <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.8);line-height:1.75;margin:0 0 2rem;">
            In the meantime, the Self-Paced Journey is available now at $67 —
            all 6 modules, your own pace, full portal access for 3 months.
          </p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://5cblueprint.awakeningdestiny.global'}/self-paced"
             style="display:inline-block;background:#C8A951;color:#021A35;font-family:sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:0.9rem 2rem;">
            Start the Self-Paced Journey →
          </a>
          <p style="font-size:0.9rem;color:#C8A951;margin:2rem 0 0;">— Will, Founder · Awakening Destiny Global</p>
          <hr style="border:none;border-top:1px solid rgba(200,169,81,0.2);margin:2.5rem 0 1.5rem;" />
          <p style="font-size:0.72rem;color:rgba(253,248,240,0.3);margin:0;">
            © ${new Date().getFullYear()} Awakening Destiny Global
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Waitlist email error:', emailErr);
  }

  return res.status(200).json({ success: true });
}
