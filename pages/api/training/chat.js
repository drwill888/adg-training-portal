// pages/api/training/chat.js
import { getEmbedding } from "@/lib/embeddings";
import { matchTrainingChunks } from "@/lib/retrieval";
import { anthropic } from "@/lib/anthropic";
import { ADG_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { question, module } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
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
      userProfile: null, // Phase 2: pass actual user profile here
    });

    // 5. Call Claude
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: ADG_SYSTEM_PROMPT,
      messages: [
        { role: "user", content: userPrompt },
      ],
    });

    // 6. Extract text response
    const answer = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // 7. Return answer with source references
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