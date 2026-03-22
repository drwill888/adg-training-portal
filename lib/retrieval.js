// lib/retrieval.js
import { supabaseAdmin } from "./supabase.js";

export async function matchTrainingChunks(embedding, count = 6, module) {
  const { data, error } = await supabaseAdmin.rpc("match_training_chunks", {
    query_embedding: embedding,
    match_count: count,
    filter_module: module ?? null,
  });

  if (error) throw error;
  return data ?? [];
}
