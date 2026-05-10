// pages/api/coach/chat.js
// Public website coaching agent — main chat endpoint.
//
// Flow:
//  1. Upsert a coach_conversations row keyed by session_id (anon cookie).
//  2. Embed the question and pull top-k coach_chunks from Supabase pgvector.
//  3. Call OpenAI Responses API with system prompt + retrieved context.
//  4. Persist user + assistant turns to coach_messages.

import { getEmbedding } from "@/lib/embeddings";
import { matchCoachChunks } from "@/lib/coach/retrieval";
import { COACH_SYSTEM_PROMPT, buildCoachUserPrompt } from "@/lib/coach/prompt";
import {
  getOrCreateConversation,
  appendMessage,
  loadRecentMessages,
  incrementFreeQuestions,
} from "@/lib/coach/session";
import { supabaseAdmin } from "@/lib/supabase";

const COACH_MODEL = process.env.COACH_MODEL || "gpt-4.1-mini";
const FREE_QUESTION_LIMIT = parseInt(process.env.COACH_FREE_QUESTION_LIMIT || "5", 10);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI is not configured." });
  }

  try {
    const { question, sessionId, sourceUrl, referrer, category } = req.body || {};

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required." });
    }
    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const conversation = await getOrCreateConversation({
      sessionId,
      sourceUrl,
      referrer,
    });

    // Free-question gate (Phase 5 hook). Counted only when we have a row.
    if (conversation) {
      const used = conversation.free_questions_used ?? 0;
      if (used >= FREE_QUESTION_LIMIT && !conversation.lead_id) {
        return res.status(200).json({
          gated: true,
          answer:
            "We have covered a lot together so far. To keep going with personalized guidance, share your name and email and I will send you a summary plus the best next step. Will Meier or someone from the Awakening Destiny Global team can also follow up directly if you would like.",
          sources: [],
          conversationId: conversation.id,
          freeQuestionsUsed: used,
          freeQuestionLimit: FREE_QUESTION_LIMIT,
        });
      }
    }

    // Retrieval — best-effort. If the KB is empty or pgvector RPC errors,
    // we still respond using the system prompt.
    let matches = [];
    try {
      const queryEmbedding = await getEmbedding(question);
      matches = await matchCoachChunks(queryEmbedding, 6, category);
    } catch (err) {
      console.error("coach retrieval error:", err);
    }

    const context = matches
      .map((m, i) => {
        const label = `[Source ${i + 1}]`;
        const catLine = m.category ? `Category: ${m.category}` : "";
        const secLine = m.section_title ? `Section: ${m.section_title}` : "";
        const meta = [catLine, secLine].filter(Boolean).join(" | ");
        return `${label}${meta ? ` (${meta})` : ""}\n${m.content}`;
      })
      .join("\n\n---\n\n");

    // Pull recent turns so the model has short-term memory of the conversation.
    const recent = conversation
      ? await loadRecentMessages(conversation.id, 10)
      : [];

    // Lookup attached lead (if any) for personalization.
    let lead = null;
    if (conversation?.lead_id && supabaseAdmin) {
      const { data: l } = await supabaseAdmin
        .from("coach_leads")
        .select("first_name, email, interest")
        .eq("id", conversation.lead_id)
        .maybeSingle();
      if (l) lead = { firstName: l.first_name, email: l.email, interest: l.interest };
    }

    const groundedUserMessage = buildCoachUserPrompt({
      question,
      context,
      lead,
      session: { sourceUrl, referrer },
    });

    const messages = [
      { role: "system", content: COACH_SYSTEM_PROMPT },
      ...recent.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: groundedUserMessage },
    ];

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: COACH_MODEL,
        temperature: 0.5,
        max_tokens: 900,
        messages,
      }),
    });

    const data = await oaRes.json();

    if (!oaRes.ok) {
      console.error("OpenAI error:", JSON.stringify(data));
      return res.status(502).json({ error: "Failed to generate response." });
    }

    const answer = data.choices?.[0]?.message?.content?.trim() || "";

    const sources = matches.map((m) => ({
      chunkId: m.id,
      documentId: m.document_id,
      category: m.category,
      sectionTitle: m.section_title,
      similarity: m.similarity,
    }));

    // Persist turns + bump free-question counter.
    if (conversation) {
      await appendMessage({
        conversationId: conversation.id,
        role: "user",
        content: question,
      });
      await appendMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: answer,
        sources,
      });
      await incrementFreeQuestions(conversation.id);
    }

    return res.status(200).json({
      answer,
      sources,
      conversationId: conversation?.id ?? null,
      freeQuestionsUsed: (conversation?.free_questions_used ?? 0) + 1,
      freeQuestionLimit: FREE_QUESTION_LIMIT,
    });
  } catch (err) {
    console.error("coach/chat error:", err);
    return res.status(500).json({ error: "Failed to process your question." });
  }
}
