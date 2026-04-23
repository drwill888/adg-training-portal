// pages/api/called-to-carry/submit-archetype.js
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

  const { firstName, email, office, overlay, archetypeId, officeScores, overlayScores } = req.body;

  if (!email || !firstName || !archetypeId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Save to Supabase — return id so frontend can redirect to /assessment/results/[id]
  const { data, error: dbError } = await supabase
    .from('called_to_carry_submissions')
    .upsert([{
      email,
      first_name: firstName,
      office,
      overlay,
      archetype_id: archetypeId,
      office_scores: officeScores,
      overlay_scores: overlayScores,
      label_preference: 'functional',
      updated_at: new Date().toISOString(),
    }], { onConflict: 'email' })
    .select('id')
    .single();

  if (dbError) {
    console.error('DB error:', dbError);
    return res.status(500).json({ error: 'Failed to save results.' });
  }

  const submissionId = data.id;
  const resultsUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/called-to-carry/assessment/results/${submissionId}`;

  // Send results email
  try {
    const officeLabel = capitalize(office);
    const overlayLabel = formatOverlay(overlay);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Will @ ADG <will@awakeningdestiny.global>',
      to: email,
      subject: `${firstName}, here's your Called to Carry archetype`,
      html: `
        <div style="background:#021A35;color:#FDF8F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
          <p style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#C8A951;margin:0 0 1.5rem;">
            Called to Carry · Your Archetype
          </p>
          <h1 style="font-size:2.25rem;font-weight:400;line-height:1.2;color:#FDF8F0;margin:0 0 1rem;">
            ${firstName}, you are<br/>
            <em style="color:#C8A951;">${officeLabel} ${overlayLabel}</em>
          </h1>
          <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.8);line-height:1.75;margin:1.5rem 0;">
            This is the grace on your leadership and the way you were built to
            carry your assignment. Read your full archetype profile and choose
            your preferred office label on your results page.
          </p>
          <a href="${resultsUrl}"
             style="display:inline-block;background:#C8A951;color:#021A35;font-family:sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:0.9rem 2rem;margin:1rem 0;">
            View Your Full Archetype →
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
    console.error('Email error:', emailErr);
    // Don't fail the request if email fails
  }

  return res.status(200).json({ success: true, archetypeId, submissionId });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatOverlay(s) {
  return s.split('_').map(capitalize).join(' ');
}