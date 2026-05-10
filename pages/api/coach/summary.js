// pages/api/coach/summary.js
// Generate a structured summary of a coach conversation and (optionally)
// email it to the visitor and to Will. Persists the summary back onto
// the coach_conversations row.

import { supabaseAdmin } from "@/lib/supabase";
import { COACH_SUMMARY_PROMPT } from "@/lib/coach/prompt";
import { sendEmail } from "@/lib/called-to-carry/email/resend";

const SUMMARY_MODEL = process.env.COACH_SUMMARY_MODEL || "gpt-4.1-mini";

function safeJsonParse(text) {
  if (!text) return null;
  // Strip code fences if the model added them despite instructions.
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fall back to extracting the first {...} block.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

const ALLOWED_5C = new Set([
  "calling",
  "connection",
  "competency",
  "capacity",
  "convergence",
]);
const ALLOWED_INTERESTS = new Set([
  "leadership",
  "coaching",
  "5c",
  "cohort",
  "prophetic",
  "apostolic",
  "speaking",
  "training",
  "other",
]);

function buildVisitorEmail({ firstName, summary, nextStep }) {
  const greeting = firstName ? `Hi ${firstName},` : "Hi friend,";
  const ns = nextStep ? `\n\nRecommended next step:\n${nextStep}` : "";
  return [
    `${greeting}`,
    "",
    "Here is a quick summary of our conversation on the Awakening Destiny Global site:",
    "",
    summary,
    ns,
    "",
    "If you would like to talk further, just reply to this email and Will or someone from the team will be in touch.",
    "",
    "— The Awakening Destiny Global team",
  ].join("\n");
}

function buildTeamEmail({ lead, summary, nextStep, primary5c, interest, transcript }) {
  return [
    `New website coach conversation`,
    ``,
    `Name: ${[lead?.first_name, lead?.last_name].filter(Boolean).join(" ") || "—"}`,
    `Email: ${lead?.email || "—"}`,
    `Phone: ${lead?.phone || "—"}`,
    `Stated interest: ${interest || lead?.interest || "—"}`,
    `Primary 5C: ${primary5c || "—"}`,
    ``,
    `Summary:`,
    summary,
    ``,
    `Recommended next step:`,
    nextStep || "—",
    ``,
    `Transcript:`,
    transcript,
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Database is not configured." });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI is not configured." });
  }

  try {
    const { conversationId, sendVisitorEmail, sendTeamEmail } = req.body || {};
    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required." });
    }

    const { data: conversation, error: convoErr } = await supabaseAdmin
      .from("coach_conversations")
      .select("*")
      .eq("id", conversationId)
      .single();
    if (convoErr || !conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    const { data: messages, error: msgErr } = await supabaseAdmin
      .from("coach_messages")
      .select("role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (msgErr) throw msgErr;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Conversation has no messages." });
    }

    const transcript = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: SUMMARY_MODEL,
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: COACH_SUMMARY_PROMPT },
          { role: "user", content: `Transcript:\n${transcript}` },
        ],
      }),
    });

    const data = await oaRes.json();
    if (!oaRes.ok) {
      console.error("OpenAI summary error:", JSON.stringify(data));
      return res.status(502).json({ error: "Failed to generate summary." });
    }

    const parsed = safeJsonParse(data.choices?.[0]?.message?.content) || {};
    const summary = typeof parsed.summary === "string" ? parsed.summary : "";
    const nextStep =
      typeof parsed.recommended_next_step === "string"
        ? parsed.recommended_next_step
        : null;
    const primary5c =
      typeof parsed.primary_5c === "string" && ALLOWED_5C.has(parsed.primary_5c)
        ? parsed.primary_5c
        : null;
    const interest =
      typeof parsed.interest === "string" && ALLOWED_INTERESTS.has(parsed.interest)
        ? parsed.interest
        : null;

    await supabaseAdmin
      .from("coach_conversations")
      .update({
        summary: summary || conversation.summary,
        recommended_next_step: nextStep || conversation.recommended_next_step,
        primary_5c: primary5c || conversation.primary_5c,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    let lead = null;
    if (conversation.lead_id) {
      const { data: l } = await supabaseAdmin
        .from("coach_leads")
        .select("*")
        .eq("id", conversation.lead_id)
        .maybeSingle();
      lead = l || null;
      if (lead && interest && !lead.interest) {
        await supabaseAdmin
          .from("coach_leads")
          .update({ interest, updated_at: new Date().toISOString() })
          .eq("id", lead.id);
      }
    }

    // Email sending is best-effort — never fail the request if Resend
    // isn't configured.
    const emailResults = { visitor: null, team: null };
    if (sendVisitorEmail && lead?.email && summary && process.env.RESEND_API_KEY) {
      try {
        const text = buildVisitorEmail({
          firstName: lead.first_name,
          summary,
          nextStep,
        });
        const result = await sendEmail({
          to: lead.email,
          subject: "Your summary from Awakening Destiny Global",
          html: `<pre style="font-family: -apple-system, sans-serif; white-space: pre-wrap;">${text}</pre>`,
          text,
        });
        emailResults.visitor = result.id;
      } catch (err) {
        console.error("visitor email error:", err);
      }
    }
    if (sendTeamEmail && summary && process.env.RESEND_API_KEY) {
      const teamTo = process.env.COACH_TEAM_EMAIL || process.env.RESEND_REPLY_TO;
      if (teamTo) {
        try {
          const text = buildTeamEmail({
            lead,
            summary,
            nextStep,
            primary5c,
            interest,
            transcript,
          });
          const result = await sendEmail({
            to: teamTo,
            subject: `Website coach — new lead${lead?.email ? `: ${lead.email}` : ""}`,
            html: `<pre style="font-family: -apple-system, sans-serif; white-space: pre-wrap;">${text}</pre>`,
            text,
          });
          emailResults.team = result.id;
        } catch (err) {
          console.error("team email error:", err);
        }
      }
    }

    return res.status(200).json({
      success: true,
      summary,
      recommendedNextStep: nextStep,
      primary5c,
      interest,
      emailResults,
    });
  } catch (err) {
    console.error("coach/summary error:", err);
    return res.status(500).json({ error: "Failed to generate summary." });
  }
}
