// pages/api/called-to-carry/mid-reflection.js
// Layer 3 — Claude call after Q5, brief prophetic mid-point reflection

import { MID_REFLECTION_SYSTEM } from '../../../lib/coaching-prompts';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { answers, firstName } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length < 5) {
    return res.status(400).json({ error: 'Invalid answers.' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[mid-reflection] ANTHROPIC_API_KEY not set.');
    return res.status(200).json({ reflection: getFallback(firstName) });
  }

  const userContent = `Leader's first name: ${firstName?.trim() || 'this leader'}

Their first five answers:
${answers
  .slice(0, 5)
  .map((a, i) => `Q${i + 1}: "${a.question}"\nAnswer: "${a.label || a.answer || a}"`)
  .join('\n\n')}

Write the mid-point reflection now.`;

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
        max_tokens: 150,
        system: MID_REFLECTION_SYSTEM,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[mid-reflection] Anthropic error:', JSON.stringify(data));
      return res.status(200).json({ reflection: getFallback(firstName) });
    }

    const reflection = data.content?.[0]?.text?.trim() || getFallback(firstName);
    return res.status(200).json({ reflection });
  } catch (err) {
    console.error('[mid-reflection] Server error:', err);
    return res.status(200).json({ reflection: getFallback(firstName) });
  }
}

function getFallback(firstName) {
  const name = firstName?.trim() || 'Leader';
  return `What I am seeing in ${name} so far: a leader who carries more than they have yet been given language for. The weight is real. The assignment is forming. Continue — the second half will bring it into clarity.`;
}
