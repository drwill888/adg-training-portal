// pages/api/called-to-carry/prophetic-mirror.js
// Layer 4 — Claude call post-assessment, delivers personalised prophetic word
// Grounds output in written archetype data from lib/archetypes.js
// ARCHETYPES is a keyed object: ARCHETYPES['apostolic_builder']
// Properties: who (array), assignment (string)

import { PROPHETIC_MIRROR_SYSTEM } from '../../../lib/coaching-prompts';
import { ARCHETYPES } from '../../../lib/archetypes';

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

  // ── Look up archetype — object keyed by archetypeId ──────────────────────
  const archetypeId = `${archetype.office}_${archetype.overlay}`;
  const archetypeData = ARCHETYPES?.[archetypeId];

  const whoYouAre = Array.isArray(archetypeData?.who)
    ? archetypeData.who.join(' ')
    : archetypeData?.who || '';

  const yourAssignment = archetypeData?.assignment || '';
  const hasContent = whoYouAre.length > 20 || yourAssignment.length > 20;

  if (!hasContent) {
    console.warn(`[prophetic-mirror] No content for archetypeId=${archetypeId}`);
  }

  const archetypeName = archetype.displayName || archetypeId;

  const userContent = hasContent
    ? `Leader's first name: ${firstName?.trim() || 'this leader'}
Archetype: ${archetypeName}

── WHO THEY ARE ─────────────────────────────────────────────────────────────
${whoYouAre}

── THEIR ASSIGNMENT ─────────────────────────────────────────────────────────
${yourAssignment}

── THEIR 10 ANSWERS ─────────────────────────────────────────────────────────
${answers.map((a, i) => `Q${i + 1}: "${a.question}"\nAnswer: "${a.label || a.answer || a}"`).join('\n\n')}

Write the prophetic mirror now. Ground it in WHO THEY ARE and THEIR ASSIGNMENT. Personalise it through their answers.`
    : `Leader's first name: ${firstName?.trim() || 'this leader'}
Archetype: ${archetypeName}

${answers.map((a, i) => `Q${i + 1}: "${a.question}"\nAnswer: "${a.label || a.answer || a}"`).join('\n\n')}

Write the prophetic mirror now.`;

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

function getFallbackMirror(archetype, firstName) {
  const name = firstName?.trim() || 'Leader';
  const fallbacks = {
    apostolic: `${name}, you are built to pioneer. The weight you carry is not a burden to manage — it is the very assignment God has placed in your hands. You have been given the grace to enter territory others have not yet named, to build structures that outlast your season, and to carry others into what you have been given to see. Do not shrink from the scope of what you are carrying. The largeness is not pride — it is assignment. Step into the fullness of what you have been called to found.`,
    prophetic: `${name}, you see what others have not yet been given eyes for — and that sight is not a gift for your comfort, it is a commission. The weight you carry when you enter a room is the weight of your office. You are not called to manage what you perceive — you are called to speak it. What you are sensing in this season is directional. Lift your voice.`,
    evangelistic: `${name}, the people who are not yet gathered are never far from your heart — and that is not sentiment, it is your assignment. You carry a grace to reach those on the outside and draw people into something larger than themselves. There are people assigned to your voice who have not yet heard it. Go find them.`,
    pastoral: `${name}, the people entrusted to your care are not a distraction from your calling — they are the evidence of it. The grace on your life to notice who is struggling and move toward them is rare and irreplaceable. Guard the depth of your relational grace. It is your greatest asset and your primary offering.`,
    teaching: `${name}, the truth you carry has weight beyond what you currently know. The clarifying grace on your life — the ability to bring light to what has been confused — is not academic. It is apostolic. The world does not need more information. It needs truth that lands, that forms, that builds people into who they were made to be. That is your assignment.`,
  };
  return fallbacks[archetype?.office] || fallbacks.apostolic;
}