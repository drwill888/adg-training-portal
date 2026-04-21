// Phase 3 scoring integrity test — run with: node __tests__/scoring-test.mjs
// Tests all 4 archetypes + 2 tiebreaker edge cases against the actual scoring spec.

const TIEBREAK_ORDER = ['misaligned_builder', 'unreleased_voice', 'threshold', 'aligned_builder'];

function scoreAssessment(responses, QUESTIONS) {
  const scores = { misaligned_builder: 0, unreleased_voice: 0, threshold: 0, aligned_builder: 0 };
  for (const response of responses) {
    const question = QUESTIONS.find(q => q.id === response.questionId);
    if (!question || question.type === 'open_text') continue;
    for (const optionId of (response.optionIds || [])) {
      const option = question.options.find(o => o.id === optionId);
      if (!option) continue;
      scores.misaligned_builder += option.scores.misaligned_builder ?? 0;
      scores.unreleased_voice   += option.scores.unreleased_voice   ?? 0;
      scores.threshold          += option.scores.threshold          ?? 0;
      scores.aligned_builder    += option.scores.aligned_builder    ?? 0;
    }
  }
  const ranked = Object.keys(scores).sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return TIEBREAK_ORDER.indexOf(a) - TIEBREAK_ORDER.indexOf(b);
  });
  let winner = ranked[0];
  if (winner === 'aligned_builder' && scores.aligned_builder === scores[ranked[1]]) winner = ranked[1];
  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const margin = scores[winner] - scores[ranked[1]];
  const confidence = Math.min(1, margin / (total * 0.25));
  return { archetype: winner, scores, confidence: Math.round(confidence * 100) + '%' };
}

const QUESTIONS = [
  { id:'q1', type:'single_select', options:[
    { id:'q1_a', scores:{ misaligned_builder:3, unreleased_voice:2, threshold:2, aligned_builder:0 } },
    { id:'q1_b', scores:{ misaligned_builder:2, unreleased_voice:2, threshold:1, aligned_builder:0 } },
    { id:'q1_c', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:1, aligned_builder:1 } },
    { id:'q1_d', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:0, aligned_builder:3 } },
  ]},
  { id:'q2', type:'single_select', options:[
    { id:'q2_a', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:0, aligned_builder:4 } },
    { id:'q2_b', scores:{ misaligned_builder:2, unreleased_voice:1, threshold:1, aligned_builder:1 } },
    { id:'q2_c', scores:{ misaligned_builder:3, unreleased_voice:1, threshold:2, aligned_builder:0 } },
    { id:'q2_d', scores:{ misaligned_builder:3, unreleased_voice:2, threshold:2, aligned_builder:0 } },
    { id:'q2_e', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:4, aligned_builder:0 } },
  ]},
  { id:'q3', type:'single_select', options:[
    { id:'q3_a', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:0, aligned_builder:3 } },
    { id:'q3_b', scores:{ misaligned_builder:4, unreleased_voice:0, threshold:1, aligned_builder:0 } },
    { id:'q3_c', scores:{ misaligned_builder:3, unreleased_voice:2, threshold:1, aligned_builder:0 } },
    { id:'q3_d', scores:{ misaligned_builder:0, unreleased_voice:4, threshold:1, aligned_builder:0 } },
    { id:'q3_e', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:3, aligned_builder:0 } },
  ]},
  { id:'q4', type:'single_select', options:[
    { id:'q4_a', scores:{ misaligned_builder:3, unreleased_voice:1, threshold:1, aligned_builder:0 } },
    { id:'q4_b', scores:{ misaligned_builder:2, unreleased_voice:1, threshold:1, aligned_builder:1 } },
    { id:'q4_c', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:1, aligned_builder:2 } },
    { id:'q4_d', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:0, aligned_builder:3 } },
  ]},
  { id:'q5', type:'multi_select', options:[
    { id:'q5_a', scores:{ misaligned_builder:1, unreleased_voice:0, threshold:1, aligned_builder:0 } },
    { id:'q5_b', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:2, aligned_builder:0 } },
    { id:'q5_c', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:1, aligned_builder:0 } },
    { id:'q5_d', scores:{ misaligned_builder:1, unreleased_voice:0, threshold:2, aligned_builder:0 } },
    { id:'q5_e', scores:{ misaligned_builder:1, unreleased_voice:2, threshold:1, aligned_builder:0 } },
    { id:'q5_f', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:1, aligned_builder:0 } },
    { id:'q5_g', scores:{ misaligned_builder:1, unreleased_voice:2, threshold:1, aligned_builder:1 } },
  ]},
  { id:'q6', type:'single_select', options:[
    { id:'q6_a', scores:{ misaligned_builder:1, unreleased_voice:4, threshold:2, aligned_builder:0 } },
    { id:'q6_b', scores:{ misaligned_builder:1, unreleased_voice:3, threshold:2, aligned_builder:0 } },
    { id:'q6_c', scores:{ misaligned_builder:2, unreleased_voice:1, threshold:2, aligned_builder:0 } },
    { id:'q6_d', scores:{ misaligned_builder:1, unreleased_voice:2, threshold:1, aligned_builder:0 } },
    { id:'q6_e', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:0, aligned_builder:4 } },
  ]},
  { id:'q7', type:'single_select', options:[
    { id:'q7_a', scores:{ misaligned_builder:2, unreleased_voice:3, threshold:3, aligned_builder:0 } },
    { id:'q7_b', scores:{ misaligned_builder:0, unreleased_voice:1, threshold:1, aligned_builder:3 } },
    { id:'q7_c', scores:{ misaligned_builder:1, unreleased_voice:2, threshold:2, aligned_builder:1 } },
    { id:'q7_d', scores:{ misaligned_builder:1, unreleased_voice:0, threshold:0, aligned_builder:1 } },
  ]},
  { id:'q8', type:'single_select', options:[
    { id:'q8_a', scores:{ misaligned_builder:4, unreleased_voice:1, threshold:1, aligned_builder:0 } },
    { id:'q8_b', scores:{ misaligned_builder:1, unreleased_voice:4, threshold:1, aligned_builder:0 } },
    { id:'q8_c', scores:{ misaligned_builder:3, unreleased_voice:1, threshold:2, aligned_builder:0 } },
    { id:'q8_d', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:4, aligned_builder:0 } },
    { id:'q8_e', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:0, aligned_builder:4 } },
  ]},
  { id:'q9', type:'multi_select', options:[
    { id:'q9_a', scores:{ misaligned_builder:3, unreleased_voice:0, threshold:1, aligned_builder:0 } },
    { id:'q9_b', scores:{ misaligned_builder:0, unreleased_voice:4, threshold:1, aligned_builder:0 } },
    { id:'q9_c', scores:{ misaligned_builder:1, unreleased_voice:1, threshold:3, aligned_builder:0 } },
    { id:'q9_d', scores:{ misaligned_builder:2, unreleased_voice:2, threshold:2, aligned_builder:0 } },
    { id:'q9_e', scores:{ misaligned_builder:0, unreleased_voice:0, threshold:0, aligned_builder:4 } },
  ]},
  { id:'q10', type:'open_text', options:[] },
];

// Profile 1: Misaligned Builder — pick highest MB option each question
const profileMB = [
  { questionId:'q1', optionIds:['q1_a'] },  // MB:3 UV:2 TH:2 AB:0
  { questionId:'q2', optionIds:['q2_c'] },  // MB:3 UV:1 TH:2 AB:0
  { questionId:'q3', optionIds:['q3_b'] },  // MB:4 UV:0 TH:1 AB:0
  { questionId:'q4', optionIds:['q4_a'] },  // MB:3 UV:1 TH:1 AB:0
  { questionId:'q5', optionIds:['q5_a'] },  // MB:1 UV:0 TH:1 AB:0
  { questionId:'q6', optionIds:['q6_c'] },  // MB:2 UV:1 TH:2 AB:0
  { questionId:'q7', optionIds:['q7_a'] },  // MB:2 UV:3 TH:3 AB:0
  { questionId:'q8', optionIds:['q8_a'] },  // MB:4 UV:1 TH:1 AB:0
  { questionId:'q9', optionIds:['q9_a'] },  // MB:3 UV:0 TH:1 AB:0
  { questionId:'q10', optionIds:[], responseText:'test' },
];

// Profile 2: Unreleased Voice — pick highest UV option each question
const profileUV = [
  { questionId:'q1', optionIds:['q1_a'] },  // UV:2
  { questionId:'q2', optionIds:['q2_d'] },  // UV:2
  { questionId:'q3', optionIds:['q3_d'] },  // UV:4
  { questionId:'q4', optionIds:['q4_a'] },  // UV:1
  { questionId:'q5', optionIds:['q5_e'] },  // UV:2
  { questionId:'q6', optionIds:['q6_a'] },  // UV:4
  { questionId:'q7', optionIds:['q7_a'] },  // UV:3
  { questionId:'q8', optionIds:['q8_b'] },  // UV:4
  { questionId:'q9', optionIds:['q9_b'] },  // UV:4
  { questionId:'q10', optionIds:[], responseText:'test' },
];

// Profile 3: Threshold — pick highest TH option each question
const profileTH = [
  { questionId:'q1', optionIds:['q1_a'] },  // TH:2
  { questionId:'q2', optionIds:['q2_e'] },  // TH:4
  { questionId:'q3', optionIds:['q3_e'] },  // TH:3
  { questionId:'q4', optionIds:['q4_c'] },  // TH:1
  { questionId:'q5', optionIds:['q5_b'] },  // TH:2
  { questionId:'q6', optionIds:['q6_b'] },  // TH:2
  { questionId:'q7', optionIds:['q7_a'] },  // TH:3
  { questionId:'q8', optionIds:['q8_d'] },  // TH:4
  { questionId:'q9', optionIds:['q9_c'] },  // TH:3
  { questionId:'q10', optionIds:[], responseText:'test' },
];

// Profile 4: Aligned Builder — must win OUTRIGHT (not via tiebreaker)
const profileAB = [
  { questionId:'q1', optionIds:['q1_d'] },  // AB:3
  { questionId:'q2', optionIds:['q2_a'] },  // AB:4
  { questionId:'q3', optionIds:['q3_a'] },  // AB:3
  { questionId:'q4', optionIds:['q4_d'] },  // AB:3
  { questionId:'q5', optionIds:['q5_g'] },  // AB:1
  { questionId:'q6', optionIds:['q6_e'] },  // AB:4
  { questionId:'q7', optionIds:['q7_b'] },  // AB:3
  { questionId:'q8', optionIds:['q8_e'] },  // AB:4
  { questionId:'q9', optionIds:['q9_e'] },  // AB:4
  { questionId:'q10', optionIds:[], responseText:'test' },
];

// Tiebreaker: MB vs UV exact tie — spec says MB wins
const profileMBvsUV = [
  { questionId:'q1', optionIds:['q1_b'] },  // MB:2 UV:2
  { questionId:'q2', optionIds:['q2_d'] },  // MB:3 UV:2
  { questionId:'q3', optionIds:['q3_c'] },  // MB:3 UV:2
  { questionId:'q4', optionIds:['q4_a'] },  // MB:3 UV:1
  { questionId:'q5', optionIds:[] },
  { questionId:'q6', optionIds:['q6_a'] },  // MB:1 UV:4
  { questionId:'q7', optionIds:['q7_c'] },  // MB:1 UV:2
  { questionId:'q8', optionIds:['q8_a'] },  // MB:4 UV:1
  { questionId:'q9', optionIds:['q9_d'] },  // MB:2 UV:2
  { questionId:'q10', optionIds:[] },
];

// AB tiebreaker: AB ties with another — spec says AB must NOT win via tiebreaker
const profileABTie = [
  { questionId:'q1', optionIds:['q1_d'] },  // AB:3
  { questionId:'q2', optionIds:['q2_a'] },  // AB:4
  { questionId:'q3', optionIds:['q3_a'] },  // AB:3
  { questionId:'q4', optionIds:['q4_d'] },  // AB:3
  { questionId:'q5', optionIds:[] },        // AB:0
  { questionId:'q6', optionIds:['q6_a'] },  // AB:0, UV:4, MB:1, TH:2
  { questionId:'q7', optionIds:['q7_a'] },  // AB:0, UV:3, MB:2, TH:3
  { questionId:'q8', optionIds:['q8_b'] },  // AB:0, UV:4
  { questionId:'q9', optionIds:['q9_b'] },  // AB:0, UV:4
  { questionId:'q10', optionIds:[] },
];

const profiles = [
  { name: 'PROFILE 1 — misaligned_builder', expected: 'misaligned_builder', responses: profileMB },
  { name: 'PROFILE 2 — unreleased_voice',   expected: 'unreleased_voice',   responses: profileUV },
  { name: 'PROFILE 3 — threshold',           expected: 'threshold',           responses: profileTH },
  { name: 'PROFILE 4 — aligned_builder',     expected: 'aligned_builder',     responses: profileAB },
  { name: 'TIEBREAKER — MB beats UV on tie', expected: 'misaligned_builder', responses: profileMBvsUV },
  { name: 'AB TIE — AB must not win on tie', expected: (a) => a !== 'aligned_builder', responses: profileABTie },
];

let allPassed = true;
for (const p of profiles) {
  const result = scoreAssessment(p.responses, QUESTIONS);
  const pass = typeof p.expected === 'function'
    ? p.expected(result.archetype)
    : result.archetype === p.expected;
  if (!pass) allPassed = false;
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${p.name}`);
  console.log(`       result: ${result.archetype} (confidence ${result.confidence})`);
  console.log(`       scores: MB=${result.scores.misaligned_builder} UV=${result.scores.unreleased_voice} TH=${result.scores.threshold} AB=${result.scores.aligned_builder}`);
}
console.log('\n' + (allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'));
