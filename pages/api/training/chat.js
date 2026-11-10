// pages/api/training/chat.js
import { getEmbedding } from "@/lib/embeddings";
import { matchTrainingChunks } from "@/lib/retrieval";
import { ADG_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { enforceAiRateLimit } from "@/lib/ratelimit";
import { generate } from "@/lib/ai/claude";
import { SCRIPTURE_RULES } from "@/lib/ai/scripture";

const SYSTEM = ADG_SYSTEM_PROMPT + "\n\n" + SCRIPTURE_RULES;
const MAX_QUESTION_CHARS = 2000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rl = await enforceAiRateLimit(req);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return res.status(429).json({ error: "Too many requests. Please slow down." });
  }

  try {
    const { question, module } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required." });
    }
    if (question.length > MAX_QUESTION_CHARS) {
      return res.status(400).json({ error: "Question is too long." });
    }

    // 1. Embed the question
    const queryEmbedding = await getEmbedding(question);

    // 2. Retrieve relevant training chunks
    const matches = await matchTrainingChunks(queryEmbedding, 6, module);

    // 3. Build grounded context from retrieved chunks
    const context = matches
      .map((m, i) => {
        const label = `[Source ${i + 1}]`;
        const moduleLine = m.module ? `Module: ${m.module}` : "";
        const sectionLine = m.section_title ? `Section: ${m.section_title}` : "";
        const meta = [moduleLine, sectionLine].filter(Boolean).join(" | ");
        return `${label}${meta ? ` (${meta})` : ""}\n${m.content}`;
      })
      .join("\n\n---\n\n");

    // 4. Build the user prompt
    const userPrompt = buildUserPrompt({
      question,
      context: context || "No relevant training content was found for this question.",
      userProfile: null,
    });

    // 5. Generate the answer with Claude (system prompt cached across calls)
    const { text: answer } = await generate({
      tier: "standard",
      system: SYSTEM,
      cacheSystem: true,
      maxTokens: 3000, // ceiling only; the system prompt keeps answers short
      messages: [{ role: "user", content: userPrompt }],
    });

    // 6. Return answer with source references
    return res.status(200).json({
      answer,
      sources: matches.map((m) => ({
        chunkId: m.id,
        documentId: m.document_id,
        module: m.module,
        sectionTitle: m.section_title,
        similarity: m.similarity,
        preview: m.content.slice(0, 200) + (m.content.length > 200 ? "..." : ""),
      })),
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Failed to process your question." });
  }
}
