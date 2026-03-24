// pages/api/training/chat.js
import { getEmbedding } from "@/lib/embeddings";
import { matchTrainingChunks } from "@/lib/retrieval";
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
      userProfile: null,
    });

    // 5. Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1500,
        messages: [
          { role: "system", content: ADG_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      console.error("OpenAI error:", JSON.stringify(data));
      return res.status(500).json({ error: "Failed to generate response." });
    }

    const answer = data.choices?.[0]?.message?.content || "";

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
