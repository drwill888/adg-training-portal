// pages/api/coach/lead.js
// Capture a website visitor's contact info and attach it to their
// current coach_conversations row. Idempotent on email.

import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { attachLeadToConversation } from "@/lib/coach/session";

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

function hashIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  const ip = (typeof fwd === "string" ? fwd.split(",")[0] : "").trim() ||
    req.socket?.remoteAddress ||
    "";
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Database is not configured." });
  }

  try {
    const {
      sessionId,
      conversationId,
      email,
      firstName,
      lastName,
      phone,
      interest,
      interestNotes,
      sourceUrl,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      consentMarketing,
    } = req.body || {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "A valid email is required." });
    }

    const safeInterest =
      interest && ALLOWED_INTERESTS.has(interest) ? interest : null;
    const ipHash = hashIp(req);

    // Upsert by email — keep the existing lead row if we have one.
    const { data: existing } = await supabaseAdmin
      .from("coach_leads")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    let lead;
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from("coach_leads")
        .update({
          first_name: firstName ?? existing.first_name,
          last_name: lastName ?? existing.last_name,
          phone: phone ?? existing.phone,
          interest: safeInterest ?? existing.interest,
          interest_notes: interestNotes ?? existing.interest_notes,
          source_url: sourceUrl ?? existing.source_url,
          referrer: referrer ?? existing.referrer,
          utm_source: utmSource ?? existing.utm_source,
          utm_medium: utmMedium ?? existing.utm_medium,
          utm_campaign: utmCampaign ?? existing.utm_campaign,
          consent_marketing:
            typeof consentMarketing === "boolean"
              ? consentMarketing
              : existing.consent_marketing,
          ip_hash: existing.ip_hash || ipHash,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      lead = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("coach_leads")
        .insert([
          {
            email: email.toLowerCase(),
            first_name: firstName || null,
            last_name: lastName || null,
            phone: phone || null,
            interest: safeInterest,
            interest_notes: interestNotes || null,
            source_url: sourceUrl || null,
            referrer: referrer || null,
            utm_source: utmSource || null,
            utm_medium: utmMedium || null,
            utm_campaign: utmCampaign || null,
            consent_marketing:
              typeof consentMarketing === "boolean" ? consentMarketing : true,
            ip_hash: ipHash,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      lead = data;
    }

    // Attach to the current conversation, if we have one.
    let resolvedConversationId = conversationId || null;
    if (!resolvedConversationId && sessionId) {
      const { data: convo } = await supabaseAdmin
        .from("coach_conversations")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle();
      resolvedConversationId = convo?.id || null;
    }

    if (resolvedConversationId) {
      await attachLeadToConversation(resolvedConversationId, lead.id);
    }

    return res.status(200).json({
      success: true,
      leadId: lead.id,
      conversationId: resolvedConversationId,
    });
  } catch (err) {
    console.error("coach/lead error:", err);
    return res.status(500).json({ error: "Failed to save lead." });
  }
}
