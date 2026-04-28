import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const QUESTIONS = [
  "What injustice, gap, or brokenness in the world makes you angry in a way others around you don't seem to feel as deeply?",
  "What have people repeatedly come to you for — even before you considered yourself qualified to help?",
  "What kind of work makes you lose track of time and feel most fully like yourself?",
  "What do you want to become on the inside — not what you want to do, but who you are being shaped into?",
  "Where have you been trusted with responsibility, leadership, or influence before you felt fully prepared for it?",
  "Who are the specific people you feel an unexplainable pull toward — to serve, speak into, or fight for?",
  "What vision, idea, or assignment has stayed with you for years — one you've tried to set down but couldn't?",
  "Twenty years from now, what do you want to have built, changed, or made possible for the next generation?",
  "What is the most persistent lie you believe about yourself that has slowed your assignment down the most?",
  "Looking back across your life — what single word, image, or theme keeps showing up in your most significant moments?"
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, userId } = req.body;

  if (!answers || !Array.isArray(answers) || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Require at least 7 of 10 answered
  const filledCount = answers.filter(a => a && a.trim().length > 0).length;
  if (filledCount < 7) {
    return res.status(400).json({ error: 'Please answer at least 7 questions.' });
  }

  // Format answers for the AI prompt
  const formattedAnswers = QUESTIONS.map((q, i) =>
    `Question ${i + 1}: ${q}\nAnswer: ${answers[i]?.trim() || '(skipped)'}`
  ).join('\n\n');

  const systemPrompt = `You are a Kingdom leadership formation guide with deep apostolic and prophetic insight. 
Your role is to read someone's purpose-finding answers and identify the threads — the patterns, recurring assignments, and divine marks — woven through their responses.

You write with directness, warmth, and spiritual authority. You are specific, not generic. 
Every sentence should feel like it was written for this person alone — referencing their actual words and images, not spiritual platitudes.
You speak in second person ("you"). You do not flatter. You illuminate.`;

  const userPrompt = `Read these purpose-finding answers carefully. Then write a Purpose Threads Report structured exactly as follows:

---

**THE THREAD I SEE IN YOU**
Write 2-3 sentences. Open with a prophetic declaration that names the core of what you see across all their answers. Be bold. Name what they may not have named for themselves.

**YOUR THREE PURPOSE THREADS**

Thread 1 — [Give it a name, 2-4 words]
Explain this thread in 2-3 sentences. Reference specific things they said. Name what this reveals about their assignment.

Thread 2 — [Give it a name, 2-4 words]
Same structure. Different thread.

Thread 3 — [Give it a name, 2-4 words]
Same structure. Third thread.

**YOUR ASSIGNED PEOPLE**
In 1-2 sentences, name exactly who they are built to serve based on what showed up in their answers. Be specific.

**YOUR CALLING DECLARATION**
Write one powerful sentence that names their calling. This is something they can anchor to, return to, and speak aloud.

---

Here are their answers:

${formattedAnswers}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
      ]
    });

    const report = message.content[0].text;

    // Save to Supabase — upsert so they can regenerate
    const { error: saveError } = await supabase
      .from('purpose_threads')
      .upsert(
        {
          user_id: userId,
          answers: answers,
          report: report,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );

    if (saveError) {
      // Log but don't fail — still return the report
      console.error('Supabase save error:', saveError);
    }

    return res.status(200).json({ report });

  } catch (error) {
    console.error('Purpose threads API error:', error);
    return res.status(500).json({ error: 'Failed to generate your report. Please try again.' });
  }
}
