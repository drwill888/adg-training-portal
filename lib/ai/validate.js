// lib/ai/validate.js
// Structural checks for long-form reports so a malformed generation is caught
// (and retried once) instead of being saved and shown to a leader.

export function countWords(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

export function validateReport(content, { headings = [], minWords = 0, maxWords = Infinity } = {}) {
  const issues = [];
  const text = content || '';

  for (const h of headings) {
    const re = new RegExp(`^##\\s+${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'im');
    if (!re.test(text)) issues.push(`missing the section heading "## ${h}"`);
  }

  const words = countWords(text);
  if (words < minWords) issues.push(`too short (${words} words; minimum ${minWords})`);
  if (words > maxWords) issues.push(`too long (${words} words; maximum ${maxWords})`);

  // Voice rules forbid lists and these translations
  const listLines = (text.match(/^\s*([-*•]|\d+\.)\s+/gm) || []).length;
  if (listLines >= 3) issues.push('contains bullet or numbered lists (prose only)');
  if (/\b(ESV|NIV|NLT|NASB|KJV|MSG)\b/.test(text)) issues.push('references a non-NKJV Bible translation');

  return { ok: issues.length === 0, issues, words };
}

export function correctionNote(issues) {
  return `Your previous draft had these problems: ${issues.join('; ')}. Rewrite the complete report now, fixing every one of them, keeping the same voice rules. Output only the report.`;
}
