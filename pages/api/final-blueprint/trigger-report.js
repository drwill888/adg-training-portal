// pages/api/final-blueprint/trigger-report.js
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, email, moduleId, stepNumber } = req.body;

  // Only fire on Commissioning (module 6) completion
  if (!userId || !email || moduleId !== 6 || stepNumber < 7) {
    return res.status(200).json({ skipped: true });
  }

  const { data: existing } = await supabase
    .from('final_blueprint_reports')
    .select('id').eq('user_id', userId).maybeSingle();

  if (existing) return res.status(200).json({ skipped: true, reason: 'report_exists' });

  // Respond immediately — generate in background
  res.status(200).json({ triggered: true });

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://5cblueprint.awakeningdestiny.global';
    const genRes = await fetch(`${baseUrl}/api/final-blueprint/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email }),
    });

    if (!genRes.ok) { console.error('Final blueprint generation failed:', await genRes.text()); return; }

    const { report } = await genRes.json();
    if (!report) return;

    const firstName = report.input_payload?.firstName || null;
    const greeting = firstName ? `${firstName},` : 'Leader,';

    await resend.emails.send({
      from: 'Awakening Destiny Global <info@awakeningdestiny.global>',
      to: email,
      subject: 'Your Final 5C Leadership Blueprint is Ready',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #021A35; color: #FDF8F0; padding: 40px 32px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="color: #C8A951; letter-spacing: 0.12em; font-size: 12px; text-transform: uppercase; font-family: sans-serif; margin: 0 0 8px;">Awakening Destiny Global</p>
            <h1 style="font-size: 28px; font-weight: 400; color: #FDF8F0; margin: 0;">Final 5C Leadership Blueprint</h1>
          </div>
          <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">${greeting}</p>
          <p style="font-size: 16px; line-height: 1.7; margin: 0 0 16px;">You have completed the full 5C Leadership Blueprint journey. Your Final Blueprint has been generated.</p>
          <p style="font-size: 16px; line-height: 1.7; margin: 0 0 32px;">This is your capstone document — a prophetic-strategic formation report that synthesizes everything you have walked through across all seven modules. It names who you have become, your full 5C profile, your assignment, and the road ahead.</p>
          <div style="text-align: center; margin-bottom: 32px;">
            <a href="https://5cblueprint.awakeningdestiny.global/final-blueprint"
               style="display: inline-block; background: #C8A951; color: #021A35; padding: 14px 32px; text-decoration: none; font-family: sans-serif; font-weight: 700; font-size: 15px; border-radius: 4px;">
              View My Final Blueprint →
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;" />
          <p style="font-size: 12px; color: rgba(253,248,240,0.4); text-align: center; font-family: sans-serif; margin: 0;">
            Awakening Destiny Global · awakeningdestiny.global
          </p>
        </div>
      `,
    });

    console.log(`Final Blueprint generated and email sent for ${email}`);
  } catch (err) {
    console.error('Final blueprint trigger error:', err);
  }
}
