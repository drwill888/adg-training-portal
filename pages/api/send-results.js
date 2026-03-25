// pages/api/send-results.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ════════════════════════════════════════
// SCORING HELPERS
// ════════════════════════════════════════
function getDimStatus(score) {
  if (score >= 20) return { label: 'Strong', color: '#16a34a' };
  if (score >= 14) return { label: 'Developing', color: '#b45309' };
  return { label: 'Misaligned', color: '#dc2626' };
}

function getOverallStatus(total) {
  if (total >= 100) return 'Blueprint Ready — Deploy Now';
  if (total >= 70) return 'Blueprint Positioned — Build the Gaps';
  return 'Blueprint Essential — This Is Your Foundation';
}

function getNextStep(gapId) {
  const steps = {
    calling: 'Your first work is clarity — not strategy. Before you can build with authority, you need to know precisely what you were built to build. The Calling module will give you the language, the framework, and the prophetic anchoring to name your assignment with confidence.',
    connection: 'The relational architecture around your leadership needs attention. Whether you\'re isolated at the top, carrying misaligned relationships, or leading from a place of approval-seeking — the Connection module will help you build the covenant community your assignment demands.',
    competency: 'Your gift is real, but your execution needs sharpening. The Competency module will help you align your skills directly to your assignment — closing the gap between your anointing and the excellence required to sustain it.',
    capacity: 'You may be running on empty while calling it faithfulness. The Capacity module confronts the rhythms, margins, and structural realities that either hold your next level or hand it off to someone who prepared better.',
    convergence: 'You\'re close — but not yet fully aligned. The Convergence module helps you identify where momentum is leaking and how to move from scattered activity into focused, integrated Kingdom impact.',
  };
  return steps[gapId] || '';
}

const DIMENSIONS = [
  { id: 'calling',     name: 'Calling',     sub: 'Identity & Assignment' },
  { id: 'connection',  name: 'Connection',  sub: 'Relationships & Identity Security' },
  { id: 'competency',  name: 'Competency',  sub: 'Skill & Execution' },
  { id: 'capacity',    name: 'Capacity',    sub: 'Strength & Sustainability' },
  { id: 'convergence', name: 'Convergence', sub: 'Alignment & Flow' },
];

// ════════════════════════════════════════
// EMAIL TEMPLATES
// ════════════════════════════════════════
function buildLeaderEmail({ firstName, scores, totalScore, strongest, gap }) {
  const dimRows = DIMENSIONS.map(dim => {
    const s = scores[dim.id];
    const st = getDimStatus(s);
    return `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-family:'Georgia',serif;font-size:15px;color:#021A35;">${dim.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:700;color:#021A35;">${s}/25</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px;font-weight:600;color:${st.color};">${st.label}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;">

        <div style="background:#021A35;padding:32px 40px;text-align:center;">
          <div style="font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#ffffff;margin-bottom:4px;">5C Leadership Blueprint</div>
          <div style="font-size:12px;color:#FDD20D;letter-spacing:0.15em;text-transform:uppercase;">Awakening Destiny Global</div>
        </div>
        <div style="height:4px;background:#FDD20D;"></div>

        <div style="padding:40px;">
          <p style="font-family:'Georgia',serif;font-size:24px;font-weight:700;color:#021A35;margin:0 0 8px;">${firstName},</p>
          <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 28px;">
            Your 5C Leadership Profile is ready. Here is an honest picture of where you stand across the five dimensions of Kingdom leadership — and what it means for your next step.
          </p>

          <div style="background:#021A35;padding:24px;text-align:center;margin-bottom:28px;">
            <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#FDD20D;font-weight:700;margin-bottom:6px;">Overall Readiness</div>
            <div style="font-family:'Georgia',serif;font-size:20px;font-weight:700;color:#ffffff;">${getOverallStatus(totalScore)}</div>
            <div style="font-size:13px;color:#9ca3af;margin-top:4px;">Total Score: ${totalScore} / 125</div>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
            <thead>
              <tr>
                <th style="text-align:left;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">Dimension</th>
                <th style="text-align:center;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">Score</th>
                <th style="text-align:right;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;padding-bottom:8px;border-bottom:2px solid #e5e7eb;">Status</th>
              </tr>
            </thead>
            <tbody>${dimRows}</tbody>
          </table>

          <div style="border-left:4px solid #FDD20D;padding:20px 24px;background:#fffbeb;margin-bottom:28px;">
            <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#b45309;font-weight:700;margin-bottom:12px;">Your Blueprint Insight</div>
            <div style="margin-bottom:12px;">
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:3px;">Strongest Dimension</div>
              <div style="font-family:'Georgia',serif;font-size:16px;font-weight:700;color:#021A35;">${strongest.name} — ${strongest.sub}</div>
            </div>
            <div style="margin-bottom:12px;">
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:3px;">Greatest Gap</div>
              <div style="font-family:'Georgia',serif;font-size:16px;font-weight:700;color:#021A35;">${gap.name} — ${gap.sub}</div>
            </div>
            <div>
              <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px;">Your Next Step</div>
              <div style="font-size:14px;line-height:1.7;color:#374151;font-style:italic;">${getNextStep(gap.id)}</div>
            </div>
          </div>

          <div style="text-align:center;padding:28px;background:#021A35;">
            <div style="font-family:'Georgia',serif;font-size:20px;font-weight:700;color:#ffffff;margin-bottom:8px;">The Blueprint Is Built for This Moment</div>
            <p style="font-size:14px;line-height:1.7;color:#9ca3af;margin:0 0 20px;">Your results reveal exactly what the 5C Blueprint addresses. Book a discovery call and let's talk about your specific next step.</p>
            <a href="https://link.createassistants.ai/widget/booking/oBN5QzfslWc8BLBaKQpH"
              style="display:inline-block;background:#FDD20D;color:#021A35;padding:14px 36px;font-weight:700;font-size:14px;letter-spacing:0.08em;text-decoration:none;text-transform:uppercase;">
              Book Your Discovery Call
            </a>
          </div>
        </div>

        <div style="padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
          <div style="font-size:12px;color:#9ca3af;">Awakening Destiny Global · 5cblueprint.awakeningdestiny.global</div>
          <div style="font-size:11px;color:#d1d5db;margin-top:4px;">© 2025 Awakening Destiny Global · All Rights Reserved</div>
        </div>

      </div>
    </body>
    </html>
  `;
}

function buildNotificationEmail({ firstName, lastName, email, scores, totalScore, strongest, gap }) {
  const scoresSummary = DIMENSIONS.map(d => `${d.name}: ${scores[d.id]}/25`).join(' &nbsp;|&nbsp; ');
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:40px;">
        <div style="background:#021A35;padding:20px 24px;margin-bottom:24px;">
          <div style="font-family:'Georgia',serif;font-size:18px;font-weight:700;color:#FDD20D;">New Assessment Completed</div>
          <div style="font-size:12px;color:#9ca3af;margin-top:4px;">5C Leadership Blueprint · Awakening Destiny Global</div>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;width:140px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;font-weight:600;color:#021A35;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#0172BC;">${email}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Total Score</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;font-weight:700;color:#021A35;">${totalScore} / 125 — ${getOverallStatus(totalScore)}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Strongest</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#16a34a;font-weight:600;">${strongest.name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Greatest Gap</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#dc2626;font-weight:600;">${gap.name}</td></tr>
          <tr><td style="padding:10px 0;font-size:13px;color:#6b7280;vertical-align:top;">Scores</td><td style="padding:10px 0;font-size:13px;color:#374151;">${scoresSummary}</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#fffbeb;border-left:4px solid #FDD20D;font-size:13px;color:#374151;line-height:1.6;">
          <strong>Next step:</strong> ${getNextStep(gap.id)}
        </div>
      </div>
    </body>
    </html>
  `;
}

// ════════════════════════════════════════
// HANDLER
// ════════════════════════════════════════
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, scores, totalScore, strongest, gap } = req.body;

  if (!firstName || !email || !scores || !strongest || !gap) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1 — Send results to the leader
    await resend.emails.send({
      from: 'assessment@5cblueprint.awakeningdestiny.global',
      to: [email],
      subject: `${firstName}, Your 5C Leadership Profile Is Ready`,
      html: buildLeaderEmail({ firstName, scores, totalScore, strongest, gap }),
    });

    // 2 — Send notification to Will
    await resend.emails.send({
      from: 'assessment@5cblueprint.awakeningdestiny.global',
      to: ['info@awakeningdestiny.global'],
      subject: `New Assessment: ${firstName} ${lastName} — ${totalScore}/125`,
      html: buildNotificationEmail({ firstName, lastName, email, scores, totalScore, strongest, gap }),
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}