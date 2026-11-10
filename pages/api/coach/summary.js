import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import { anthropic } from "@/lib/ai/claude";
import { MODELS } from "@/lib/ai/config";

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const FIVE_CS = ["Calling", "Connection", "Competency", "Capacity", "Convergence"];

const SUMMARY_TOOL = {
  name: "record_summary",
  description: "Record the structured summary of this ADG website coaching conversation.",
  input_schema: {
    type: "object",
    properties: {
      summary: { type: "string", description: "2-3 sentence summary of the visitor's situation and interests." },
      primary_5c: { type: "string", enum: FIVE_CS, description: "The 5C dimension most relevant to the visitor." },
      recommended_next_step: { type: "string", description: "The single best next step (e.g. Book a Discovery Conversation)." },
    },
    required: ["summary", "primary_5c", "recommended_next_step"],
  },
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ALLOWED_ORIGINS = [
  "https://awakeningdestiny.global",
  "https://www.awakeningdestiny.global",
];

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Vary", "Origin");
  }
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { conversationId, sendVisitorEmail = false, sendTeamEmail = false } = req.body;
  if (!conversationId) return res.status(400).json({ error: "conversationId is required" });
  if (!supabaseAdmin) return res.status(500).json({ error: "Database is not configured" });

  try {
    const { data: conversation } = await supabaseAdmin
      .from("coach_conversations")
      .select("*, coach_leads(*)")
      .eq("id", conversationId)
      .single();

    const { data: messages } = await supabaseAdmin
      .from("coach_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!messages?.length) {
      return res.status(200).json({ summary: "No messages to summarize." });
    }

    const transcript = messages
      .map((m) => `${m.role === "user" ? "Visitor" : "ADG Guide"}: ${m.content}`)
      .join("\n\n");

    // Forced tool call = guaranteed-valid structured output (no JSON parsing needed)
    let parsed = { summary: null, primary_5c: null, recommended_next_step: null };
    try {
      const completion = await anthropic.messages.create({
        model: MODELS.fast,
        max_tokens: 1000,
        system:
          "You analyze ADG website coaching conversations for the Awakening Destiny Global team. Be concrete and faithful to what the visitor actually said. Do not invent details.",
        tools: [SUMMARY_TOOL],
        tool_choice: { type: "tool", name: SUMMARY_TOOL.name },
        messages: [{ role: "user", content: transcript }],
      });
      const block = completion.content.find((b) => b.type === "tool_use");
      if (block?.input) parsed = block.input;
    } catch (aiErr) {
      console.error("Summary generation error:", aiErr?.message || aiErr);
      return res.status(502).json({ error: "Failed to generate summary" });
    }

    await supabaseAdmin
      .from("coach_conversations")
      .update({
        summary: parsed.summary,
        primary_5c: parsed.primary_5c,
        recommended_next_step: parsed.recommended_next_step,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    const lead = conversation?.coach_leads;
    if (resend && lead?.email) {
      const from = process.env.RESEND_FROM_EMAIL || "noreply@awakeningdestiny.global";
      const teamTo = process.env.COACH_TEAM_EMAIL;

      if (sendVisitorEmail) {
        await resend.emails
          .send({
            from,
            to: lead.email,
            subject: "Your ADG Coaching Conversation Summary",
            html: `<p>Hi ${esc(lead.first_name || "there")},</p>
<p>Here's a summary of your coaching conversation with the ADG Guide:</p>
<p><strong>Summary:</strong> ${esc(parsed.summary)}</p>
<p><strong>Primary growth area:</strong> ${esc(parsed.primary_5c)}</p>
<p><strong>Recommended next step:</strong> ${esc(parsed.recommended_next_step)}</p>
<p>Ready to go deeper? Visit <a href="https://awakeningdestiny.global">awakeningdestiny.global</a> to book a Discovery Conversation with our team.</p>
<p>— The ADG Team</p>`,
          })
          .catch(console.error);
      }

      if (sendTeamEmail && teamTo) {
        await resend.emails
          .send({
            from,
            to: teamTo,
            subject: `New ADG Website Lead: ${lead.first_name || ""} <${lead.email}>`,
            html: `<p><strong>New lead from the website coaching agent:</strong></p>
<p>Name: ${esc(lead.first_name || "Unknown")}<br>Email: ${esc(lead.email)}<br>Interest: ${esc(lead.interest || "Not specified")}</p>
<p><strong>Summary:</strong> ${esc(parsed.summary)}</p>
<p><strong>Primary 5C:</strong> ${esc(parsed.primary_5c)}</p>
<p><strong>Recommended next step:</strong> ${esc(parsed.recommended_next_step)}</p>`,
          })
          .catch(console.error);
      }
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Summary error:", err);
    return res.status(500).json({ error: "Failed to generate summary" });
  }
}
