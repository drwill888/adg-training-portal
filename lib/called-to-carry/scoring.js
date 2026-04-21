// lib/called-to-carry/scoring.js
// Pure scoring function — no side effects, no DB calls.
// Input: array of response objects from the assessment form.
// Output: { archetype, scores, confidence }
// Locked per called-to-carry-assessment-spec.md §2 + §6.2.

import { QUESTIONS } from './questions';
import { TIEBREAK_ORDER } from './archetypes';

/**
 * Score a completed assessment.
 *
 * @param {Array<{questionId: string, optionIds: string[], responseText?: string}>} responses
 *   - Single-select: optionIds = ['q1_a']
 *   - Multi-select:  optionIds = ['q5_a', 'q5_b']
 *   - Q10 open text: optionIds = [] (no points; responseText saved as private_signal)
 *
 * @returns {{ archetype: string, scores: object, confidence: number }}
 */
export function scoreAssessment(responses) {
  const scores = {
    misaligned_builder: 0,
    unreleased_voice: 0,
    threshold: 0,
    aligned_builder: 0,
  };

  for (const response of responses) {
    const question = QUESTIONS.find(q => q.id === response.questionId);
    if (!question) continue;
    if (question.type === 'open_text') continue; // Q10 scores no points

    for (const optionId of (response.optionIds || [])) {
      const option = question.options.find(o => o.id === optionId);
      if (!option) continue;
      scores.misaligned_builder += option.scores.misaligned_builder ?? 0;
      scores.unreleased_voice   += option.scores.unreleased_voice   ?? 0;
      scores.threshold          += option.scores.threshold          ?? 0;
      scores.aligned_builder    += option.scores.aligned_builder    ?? 0;
    }
  }

  // Rank archetypes: highest score first, ties broken by TIEBREAK_ORDER
  const ranked = Object.keys(scores).sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return TIEBREAK_ORDER.indexOf(a) - TIEBREAK_ORDER.indexOf(b);
  });

  // Special rule (spec §2): Aligned Builder only wins outright — never on tiebreaker.
  // If AB ties with any other archetype, route to the other archetype.
  let winner = ranked[0];
  if (winner === 'aligned_builder' && scores.aligned_builder === scores[ranked[1]]) {
    winner = ranked[1];
  }

  // Confidence: margin between #1 and #2 scores, normalised 0→1.
  // A 25% margin of the total = full confidence.
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const margin = scores[winner] - scores[ranked[1]];
  const confidence = Math.min(1, margin / (total * 0.25));

  return { archetype: winner, scores, confidence };
}

/**
 * Extract the Q10 private signal text from a responses array.
 * Returns null if Q10 was skipped or empty.
 *
 * @param {Array} responses
 * @returns {string|null}
 */
export function extractPrivateSignal(responses) {
  const q10 = responses.find(r => r.questionId === 'q10');
  if (!q10 || !q10.responseText) return null;
  const trimmed = q10.responseText.trim().slice(0, 500); // server-side 500-char cap
  return trimmed.length > 0 ? trimmed : null;
}
