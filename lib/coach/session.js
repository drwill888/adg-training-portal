// lib/coach/session.js
// Helpers for upserting a coach_conversations row + appending messages.
// All callers must run server-side (uses supabaseAdmin).

import { supabaseAdmin } from "../supabase.js";

export async function getOrCreateConversation({ sessionId, sourceUrl, referrer }) {
  if (!supabaseAdmin || !sessionId) return null;

  const { data: existing } = await supabaseAdmin
    .from("coach_conversations")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabaseAdmin
    .from("coach_conversations")
    .insert([
      {
        session_id: sessionId,
        source_url: sourceUrl || null,
        referrer: referrer || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("getOrCreateConversation error:", error);
    return null;
  }
  return data;
}

export async function appendMessage({ conversationId, role, content, sources }) {
  if (!supabaseAdmin || !conversationId) return;

  const { error } = await supabaseAdmin.from("coach_messages").insert([
    {
      conversation_id: conversationId,
      role,
      content,
      sources: sources ?? null,
    },
  ]);

  if (error) console.error("appendMessage error:", error);
}

export async function loadRecentMessages(conversationId, limit = 12) {
  if (!supabaseAdmin || !conversationId) return [];

  const { data, error } = await supabaseAdmin
    .from("coach_messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("loadRecentMessages error:", error);
    return [];
  }

  return (data ?? []).reverse();
}

export async function incrementFreeQuestions(conversationId) {
  if (!supabaseAdmin || !conversationId) return null;

  const { data, error } = await supabaseAdmin
    .from("coach_conversations")
    .select("free_questions_used")
    .eq("id", conversationId)
    .single();

  if (error) {
    console.error("incrementFreeQuestions read error:", error);
    return null;
  }

  const next = (data?.free_questions_used ?? 0) + 1;

  const { error: updateError } = await supabaseAdmin
    .from("coach_conversations")
    .update({ free_questions_used: next, updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  if (updateError) console.error("incrementFreeQuestions update error:", updateError);
  return next;
}

export async function attachLeadToConversation(conversationId, leadId) {
  if (!supabaseAdmin || !conversationId || !leadId) return;
  const { error } = await supabaseAdmin
    .from("coach_conversations")
    .update({ lead_id: leadId, updated_at: new Date().toISOString() })
    .eq("id", conversationId);
  if (error) console.error("attachLeadToConversation error:", error);
}
