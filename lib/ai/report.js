// lib/ai/report.js
// Generate a long-form report, validate its structure, and retry once with a
// targeted correction if it comes back malformed.
import { generate } from './claude.js';
import { validateReport, correctionNote } from './validate.js';

export async function generateValidatedReport({ tier, prompt, maxTokens, validation }) {
  const messages = [{ role: 'user', content: prompt }];
  let result = await generate({ tier, messages, maxTokens });
  let check = validateReport(result.text, validation);
  let costUsd = result.costUsd;
  let attempts = 1;

  if (!check.ok && result.text.length > 100) {
    console.warn('[report] validation issues, retrying once:', check.issues);
    const retry = await generate({
      tier,
      maxTokens,
      messages: [
        ...messages,
        { role: 'assistant', content: result.text },
        { role: 'user', content: correctionNote(check.issues) },
      ],
    });
    attempts = 2;
    costUsd += retry.costUsd;
    const retryCheck = validateReport(retry.text, validation);
    // Keep whichever draft has fewer problems
    if (retryCheck.issues.length <= check.issues.length) {
      result = retry;
      check = retryCheck;
    }
  }

  return { content: result.text, model: result.model, costUsd: Number(costUsd.toFixed(4)), check, attempts };
}

export const REPORT_VALIDATION = {
  finalFull: {
    headings: ['Who You Have Become', 'Your Formation Journey', 'Your Strengths Profile', 'Your Formation Edges', 'Your Assignment', 'The Road Ahead', 'Scripture for This Season'],
    minWords: 1300, maxWords: 2400,
  },
  finalLight: {
    headings: ['Who You Have Become', 'Your Strongest Dimension', 'Your Deepest Formation Edge', 'Your Assignment in Brief', 'Scripture for This Season'],
    minWords: 330, maxWords: 650,
  },
  midFull: {
    headings: ["Who You've Become", 'What the Modules Have Surfaced', 'Your Formation Edges', 'The Work Ahead', 'Scripture for This Stretch'],
    minWords: 750, maxWords: 1500,
  },
  midLight: {
    headings: ['Your Archetype in Brief', 'Your Top Strength', 'Your Top Gap', 'Scripture Anchor'],
    minWords: 250, maxWords: 520,
  },
};
