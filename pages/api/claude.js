// pages/api/claude.js
// Generates the per-module Leadership Blueprint summary (ModuleTemplate.js).
//
// Security: the system prompt is fixed server-side. The browser can only send
// the user-level `prompt` (or a short `messages` history), so this endpoint
// cannot be used as a general-purpose AI proxy.
import { enforceAiRateLimit } from "../../lib/ratelimit";
import { generate } from "../../lib/ai/claude";
import { ADG_SYSTEM_PROMPT } from "../../lib/prompts";
import { SCRIPTURE_RULES } from "../../lib/ai/scripture";

const MAX_PROMPT_CHARS = 20000;

const FORMAT_PRECEDENCE = `FORMAT PRECEDENCE: When the user's request specifies an exact output structure (labelled sections, a divider line, bullet lists, word counts), follow that structure exactly. It overrides the plain-text style rules above. Never add preamble, salutations, or commentary outside the requested structure.`;

const SYSTEM = [ADG_SYSTEM_PROMPT, SCRIPTURE_RULES, FORMAT_PRECEDENCE].join("\n\n");

function cleanMessages(body) {
  if (Array.isArray(body.messages)) {
    const msgs = body.messages
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content }))
      .slice(-12);
    return msgs.length && msgs[0].role === "user" ? msgs : null;
  }
  if (typeof body.prompt === "string" && body.prompt.trim()) {
    return [{ role: "user", content: body.prompt }];
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rl = await enforceAiRateLimit(req);
  if (!rl.ok) {
    res.setHeader("Retry-After", String(rl.retryAfter));
    return res.status(429).json({
      error: "Too many requests. Please slow down.",
      retryAfter: rl.retryAfter,
    });
  }

  const messages = cleanMessages(req.body || {});
  if (!messages) return res.status(400).json({ error: "A prompt is required." });
  if (messages.reduce((n, m) => n + m.content.length, 0) > MAX_PROMPT_CHARS) {
    return res.status(413).json({ error: "Request too large." });
  }

  try {
    const { text } = await generate({
      tier: "standard",
      system: SYSTEM,
      cacheSystem: true,
      maxTokens: 4000, // ceiling only; prompts set the real length
      messages,
    });

    if (!text) return res.status(502).json({ error: "The AI returned an empty response." });
    return res.status(200).json({ response: text });
  } catch (error) {
    console.error("[api/claude] generation failed:", error?.message || error);
    return res.status(502).json({ error: "Summary unavailable right now." });
  }
}
