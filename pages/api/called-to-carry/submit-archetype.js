// pages/api/called-to-carry/submit-archetype.js
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || 'Will @ ADG <will@awakeningdestiny.global>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, email, office, overlay, archetypeId, officeScores, overlayScores } = req.body;

  if (!email || !firstName || !archetypeId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Save to Supabase
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
  const journeyUrl = `${SITE_URL}/called-to-carry`;
  const archetypeName = `${capitalize(office)} ${formatOverlay(overlay)}`;

  // ─── Email 1: Send archetype result immediately ───────────────────────────
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your archetype is in. This is who you are, ${firstName}.`,
      html: emailOneHtml({ firstName, archetypeName, journeyUrl }),
    });
  } catch (emailErr) {
    console.error('Email 1 error:', emailErr);
  }

  // ─── Drip Queue: Schedule Emails 2, 3, 4 ─────────────────────────────────
  const today = new Date();
  const day3  = addDays(today, 3);
  const day7  = addDays(today, 7);
  const day14 = addDays(today, 14);

  try {
    // Clear any existing unsent drip rows for this email (re-enrollment)
    await supabase
      .from('drip_queue')
      .delete()
      .eq('email', email)
      .is('sent_at', null)
      .eq('stopped', false);

    // Insert fresh drip rows
    await supabase.from('drip_queue').insert([
      { email, first_name: firstName, archetype_name: archetypeName, email_number: 2, scheduled_for: day3.toISOString().split('T')[0] },
      { email, first_name: firstName, archetype_name: archetypeName, email_number: 3, scheduled_for: day7.toISOString().split('T')[0] },
      { email, first_name: firstName, archetype_name: archetypeName, email_number: 4, scheduled_for: day14.toISOString().split('T')[0] },
    ]);
  } catch (queueErr) {
    console.error('Drip queue error:', queueErr);
  }

  return res.status(200).json({ success: true, archetypeId, submissionId });
}

// ─── Date helper ─────────────────────────────────────────────────────────────
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ─── String helpers ───────────────────────────────────────────────────────────
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatOverlay(s) {
  return s.split('_').map(capitalize).join(' ');
}

// ─── Shared email wrapper ─────────────────────────────────────────────────────
function emailWrapper(content) {
  return `
    <div style="background:#021A35;color:#FDF8F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
      <p style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#C8A951;margin:0 0 2rem;">
        Called to Carry · Awakening Destiny Global
      </p>
      ${content}
      <hr style="border:none;border-top:1px solid rgba(200,169,81,0.2);margin:3rem 0 1.5rem;" />
      <p style="font-size:0.9rem;color:#C8A951;margin:0 0 0.5rem;">— Will Meier, Founder · Awakening Destiny Global</p>
      <p style="font-size:0.72rem;color:rgba(253,248,240,0.3);margin:0.5rem 0 0;">
        © ${new Date().getFullYear()} Awakening Destiny Global · You received this because you completed the Called to Carry assessment.
      </p>
    </div>
  `;
}

function ctaButton(href, label) {
  return `
    <a href="${href}"
       style="display:inline-block;background:#C8A951;color:#021A35;font-family:sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:0.9rem 2rem;margin:1.5rem 0;">
      ${label}
    </a>
  `;
}

function bodyText(text) {
  return `<p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.85);line-height:1.85;margin:1rem 0;">${text}</p>`;
}

function heading(text) {
  return `<h1 style="font-size:1.85rem;font-weight:400;line-height:1.3;color:#FDF8F0;margin:0 0 1rem;">${text}</h1>`;
}

function scripture(text) {
  return `<p style="font-size:0.95rem;font-style:italic;color:#C8A951;border-left:2px solid #C8A951;padding-left:1rem;margin:1.5rem 0;">${text}</p>`;
}

// ─── Email 1 HTML ─────────────────────────────────────────────────────────────
function emailOneHtml({ firstName, archetypeName, journeyUrl }) {
  return emailWrapper(`
    ${heading(`Your archetype is in. This is who you are, ${firstName}.`)}
    ${bodyText(`You just completed something most people never do.`)}
    ${bodyText(`You stopped long enough to ask the question that changes everything — not <em>what am I doing</em>, but <em>what am I built to carry?</em>`)}
    ${bodyText(`That's not curiosity. That's a Kingdom instinct.`)}
    <p style="font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#C8A951;margin:2rem 0 0.5rem;">Your Archetype</p>
    <h2 style="font-size:2.25rem;font-weight:400;color:#C8A951;margin:0 0 1.5rem;font-style:italic;">${archetypeName}</h2>
    ${bodyText(`This isn't a personality label. It's a functional identity — the shape of the grace on your life, the weight you were fashioned to bear.`)}
    ${scripture(`The Hebrew word <em>nasa</em> means to lift, to carry, to bear a burden with authority. It's the same word used when God placed His name upon His people. What you carry isn't incidental. It's assigned.`)}
    ${bodyText(`Your archetype tells us how you're wired to build, lead, influence, and serve in this season. But an archetype without formation is a blueprint without a builder.`)}
    ${bodyText(`That's why Called to Carry exists.`)}
    ${ctaButton(journeyUrl, 'Enter the Journey →')}
    ${bodyText(`There's nothing to buy yet. Just the next step.`)}
  `);
}