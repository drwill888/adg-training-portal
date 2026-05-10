// lib/coach/retrieval.js
import { supabaseAdmin } from "../supabase.js";

export async function matchCoachChunks(embedding, count = 6, category) {
  if (!supabaseAdmin) return [];

  const { data, error } = await supabaseAdmin.rpc("match_coach_chunks", {
    query_embedding: embedding,
    match_count: count,
    filter_category: category ?? null,
  });

  if (error) {
    console.error("matchCoachChunks error:", error);
    return [];
  }
  return data ?? [];
}
