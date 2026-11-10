// lib/ai/scripture.js
// Appended to every prompt that may quote Scripture. Mirrors the ADG authoring
// standard: NKJV only, quoted exactly, never fabricated.

export const SCRIPTURE_RULES = `SCRIPTURE RULES — follow all absolutely:
- Quote Scripture from the New King James Version (NKJV) only. Never ESV, NIV, KJV, NLT, MSG, or any other translation, and never a paraphrase presented as a quotation.
- Quote only verses you can reproduce word-for-word in NKJV. If you are not certain of the exact NKJV wording, cite the reference and describe its truth in your own words instead of quoting.
- Every quotation carries its reference (Book chapter:verse). Never invent or guess a reference.
- Do not stack more than two verses in a row; let the leader's own story carry the weight.`;
