// lib/chunking.js

/**
 * Section-aware chunking for ADG 5C curriculum content.
 *
 * Instead of naive character splitting, this:
 * 1. Splits on double-newlines (paragraph boundaries) first
 * 2. Groups paragraphs into chunks of target size
 * 3. Never cuts mid-paragraph
 * 4. Preserves overlap between chunks for context continuity
 */

const SECTION_HEADER_PATTERNS = [
  /^#{1,3}\s+.+$/m,
  /^(MODULE|LESSON|CHAPTER|PART|SECTION|WEEK)\s+\d/im,
  /^(CALLING|CONNECTION|COMPETENCY|CAPACITY|CONVERGENCE)/im,
  /^(INTRODUCTION|COMMISSIONING)/im,
  /^(DECLARATION|PRAYER|DECREE|ACTIVATION|REFLECTION)/im,
  /^(EPISODE\s+\d)/im,
];

function detectSectionTitle(text) {
  const firstLine = text.trim().split("\n")[0].trim();

  for (const pattern of SECTION_HEADER_PATTERNS) {
    if (pattern.test(firstLine)) {
      return firstLine.replace(/^#+\s*/, "").trim();
    }
  }

  return undefined;
}

export function chunkText(text, options) {
  const targetSize = options?.targetSize ?? 1000;
  const overlap = options?.overlap ?? 150;

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  if (paragraphs.length === 0) return [];

  const chunks = [];
  let currentParagraphs = [];
  let currentLength = 0;
  let currentSection = undefined;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const detectedSection = detectSectionTitle(paragraph);
    if (detectedSection) {
      currentSection = detectedSection;
    }

    const paragraphLength = paragraph.length;

    if (currentLength + paragraphLength > targetSize && currentParagraphs.length > 0) {
      const content = currentParagraphs.join("\n\n");
      chunks.push({
        content,
        chunkIndex,
        sectionTitle: currentSection,
      });
      chunkIndex++;

      const overlapParagraphs = [];
      let overlapLength = 0;
      for (let i = currentParagraphs.length - 1; i >= 0; i--) {
        if (overlapLength + currentParagraphs[i].length > overlap) break;
        overlapParagraphs.unshift(currentParagraphs[i]);
        overlapLength += currentParagraphs[i].length;
      }

      currentParagraphs = overlapParagraphs;
      currentLength = overlapLength;
    }

    currentParagraphs.push(paragraph);
    currentLength += paragraphLength;
  }

  if (currentParagraphs.length > 0) {
    chunks.push({
      content: currentParagraphs.join("\n\n"),
      chunkIndex,
      sectionTitle: currentSection,
    });
  }

  return chunks;
}
