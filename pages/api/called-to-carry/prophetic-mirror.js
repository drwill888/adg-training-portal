// pages/api/called-to-carry/prophetic-mirror.js
// Layer 4 — Claude call post-assessment, delivers personalised prophetic word
// Grounds output in written archetype data from lib/archetypes.js

import { PROPHETIC_MIRROR_SYSTEM } from '../../../lib/coaching-prompts';
import ARCHETYPES from '../../../lib/archetypes';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { archetype, answers, firstName } = req.body;

  if (!archetype?.office || !archetype?.overlay) {
    return res.status(400).json({ error: 'Missing archetype data.' });
  }

  if (!Array.isArray(answers) || answers.length < 10) {
    return res.status(400).json({ error: 'Incomplete answers.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[prophetic-mirror] ANTHROPIC_API_KEY not set.');
    return res.status(200).json({ mirror: getFallbackMirror(archetype, firstName) });
  }

  // ── Look up written archetype data from lib/archetypes.js ───────────────
  // NOTE: The free reveal uses "Who You Are" + "Your Assignment" as Claude's
  // foundation. Strength, Temptation, and Scripture stay locked — they live
  // in the paid portal only. This creates the legitimate "there is more" pull.
  const archetypeData = Array.isArray(ARCHETYPES)
    ? ARCHETYPES.find(
        (a) => a.office === archetype.office && a.overlay === archetype.overlay
      )
    : null;

  // Support multiple property name conventions in archetypes.js
  const whoYouAre =
    archetypeData?.whoYouAre ||
    archetypeData?.who_you_are ||
    archetypeData?.identity ||
    archetypeData?.sections?.whoYouAre ||
    '';

  const yourAssignment =
    archetypeData?.yourAssignment ||
    archetypeData?.your_assignment ||
    archetypeData?.assignment ||
    archetypeData?.sections?.yourAssignment ||
    '';

  const hasContent = whoYouAre.length > 20 || yourAssignment.length > 20;

  if (!hasContent) {
    console.warn(
      `[prophetic-mirror] Archetype content not found for office=${archetype.office}, overlay=${archetype.overlay}. ` +
        `Check lib/archetypes.js property names. Falling back to improvise mode.`
    );
  }

  // ── Build user content ───────────────────────────────────────────────────
  const archetypeName = archetype.displayName || `${archetype.office} / ${archetype.overlay}`;

  const userContent = hasContent
    ? `Leader's first name: ${firstName?.trim() || 'this leader'}
Archetype: ${archetypeName}

── WRITTEN FOUNDATION (your anchor — ground the mirror here) ───────────────

WHO THEY ARE:
${whoYouAre}

THEIR ASSIGNMENT:
${yourAssignment}

── THEIR ANSWERS (personalise the mirror through this lens) ─────────────────

${answers.map((a, i) => `Q${i + 1}: "${a.question}"\nAnswer: "${a.label || a.answer || a}"`).join('\n\n')}

Write the prophetic mirror now. Ground it in the written foundation. Personalise it through their answers.`
    : `Leader's first name: ${firstName?.trim() || 'this leader'}
Archetype: ${archetypeName} (Office: ${archetype.office}, Overlay: ${archetype.overlay})

${answers.map((a, i) => `Q${i + 1}: "${a.question}"\nAnswer: "${a.label || a.answer || a}"`).join('\n\n')}

Write the prophetic mirror now.`;

  // ── Claude API call ──────────────────────────────────────────────────────
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: PROPHETIC_MIRROR_SYSTEM,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[prophetic-mirror] Anthropic error:', JSON.stringify(data));
      return res.status(200).json({ mirror: getFallbackMirror(archetype, firstName) });
    }

    const mirror = data.content?.[0]?.text?.trim() || getFallbackMirror(archetype, firstName);
    return res.status(200).json({ mirror });
  } catch (err) {
    console.error('[prophetic-mirror] Server error:', err);
    return res.status(200).json({ mirror: getFallbackMirror(archetype, firstName) });
  }
}

// ── Per-office fallback mirrors (no API call needed) ────────────────────────
function getFallbackMirror(archetype, firstName) {
  const name = firstName?.trim() || 'Leader';
  const fallbacks = {
    apostolic: `${name}, you are built to pioneer. The weight you carry is not a burden to manage — it is the very assignment God has placed in your hands. You have been given the grace to enter territory others have not yet named, to build structures that outlast your season, and to carry others into what you have been given to see. Do not shrink from the scope of what you are carrying. The largeness is not pride — it is assignment. Step into the fullness of what you have been called to found.`,
    prophetic: `${name}, you see what others have not yet been given eyes for — and that sight is not a gift for your comfort, it is a commission. The weight you carry when you enter a room, when you sense the spiritual atmosphere before a word is spoken, is the weight of your office. You are not called to manage what you perceive — you are called to speak it with courage and covenant. What you are sensing in this season is not random. It is directional. Lift your voice.`,
    evangelistic: `${name}, the people who are not yet gathered are never far from your heart — and that is not sentiment, it is your assignment. You carry a grace to reach those on the outside, to make the invisible feel seen, and to draw people into something larger than themselves. The urgency you feel is not anxiety — it is the pull of your calling. There are people assigned to your voice who have not yet heard it. Go find them.`,
    pastoral: `${name}, the people entrusted to your care are not a distraction from your calling — they are the evidence of it. The grace on your life to notice who is struggling, to move toward the one on the edge, to hold people through seasons they cannot hold themselves through — this is rare and it is irreplaceable. You are not just a leader. You are a keeper. Guard the depth of your relational grace. It is your greatest asset and your primary offering.`,
    teaching: `${name}, the truth you carry has weight beyond what you currently know. The clarifying grace on your life — the ability to bring light to what has been confused, to explain what others have only sensed — is not academic. It is apostolic. The world does not need more information. It needs truth that lands, truth that forms, truth that builds people into who they were made to be. That is your assignment. Go deep. Go long. Build what lasts.`,
  };
  return fallbacks[archetype?.office] || fallbacks.apostolic;
}
