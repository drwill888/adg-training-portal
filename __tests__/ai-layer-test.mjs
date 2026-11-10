// Run: ANTHROPIC_API_KEY=test node __tests__/ai-layer-test.mjs
import assert from 'node:assert/strict';
import { validateReport, correctionNote, countWords } from '../lib/ai/validate.js';
import { trimToSentence } from '../lib/ai/claude.js';
import { estimateCostUsd, MODELS } from '../lib/ai/config.js';
import { REPORT_VALIDATION } from '../lib/ai/report.js';
import { SCRIPTURE_RULES } from '../lib/ai/scripture.js';

// trimToSentence drops dangling fragments
assert.equal(trimToSentence('You carry weight. You were built for this. And yet the'), 'You carry weight. You were built for this.');
assert.equal(trimToSentence('Complete sentence.'), 'Complete sentence.');
assert.equal(trimToSentence('No terminal punctuation'), 'No terminal punctuation');

// validateReport: headings, length, lists, translations
const h = REPORT_VALIDATION.finalLight.headings;
const body = (n) => Array(n).fill('word').join(' ');
const good = h.map((x) => `## ${x}\n${body(80)}.`).join('\n\n');
assert.equal(validateReport(good, REPORT_VALIDATION.finalLight).ok, true);
const missing = good.replace('## Your Assignment in Brief', 'Your Assignment in Brief');
const r = validateReport(missing, REPORT_VALIDATION.finalLight);
assert.equal(r.ok, false);
assert.match(r.issues[0], /Your Assignment in Brief/);
assert.equal(validateReport('## A\nshort', { headings: ['A'], minWords: 50 }).ok, false);
assert.equal(validateReport(good + '\n- a\n- b\n- c', REPORT_VALIDATION.finalLight).ok, false);
// Two numbered scriptures are tolerated; three list lines are not
assert.equal(validateReport(good + '\n1. x\n2. y', REPORT_VALIDATION.finalLight).ok, true);
assert.equal(validateReport(good + ' (ESV)', REPORT_VALIDATION.finalLight).ok, false);
assert.equal(validateReport(good + ' *Psalm 23:1* NKJV', REPORT_VALIDATION.finalLight).ok, true);
// Mid-journey heading with an apostrophe
assert.equal(validateReport("## Who You've Become\nx", { headings: ["Who You've Become"] }).ok, true);
assert.match(correctionNote(['a', 'b']), /a; b/);

// config
assert.ok(MODELS.premium && MODELS.standard && MODELS.fast);
assert.ok(estimateCostUsd('standard', { input_tokens: 1_000_000, output_tokens: 0 }) > 0);
assert.match(SCRIPTURE_RULES, /NKJV/);
console.log('ai-layer tests passed; words helper:', countWords('a b c'));
