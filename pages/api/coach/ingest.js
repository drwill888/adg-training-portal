// pages/api/coach/ingest.js
// Admin-only endpoint to ingest a public-website document into the
// coach knowledge base. Protected by COACH_INGEST_TOKEN.

import { supabaseAdmin } from "@/lib/supabase";
import { chunkText } from "@/lib/chunking";
import { getEmbedding } from "@/lib/embeddings";

const ALLOWED_CATEGORIES = new Set([
  "about",
  "5c",
  "cohort",
  "coaching",
  "training",
  "events",
  "speaking",
  "faq",
  "blog",
  "general",
]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Database is not configured." });
  }

  const token = req.headers["x-coach-ingest-token"];
  if (!process.env.COACH_INGEST_TOKEN || token !== process.env.COACH_INGEST_TOKEN) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const { title, text, category, sourceUrl } = req.body || {};
    if (!title || !text) {
      return res.status(400).json({ error: "title and text are required." });
    }

    const safeCategory =
      category && ALLOWED_CATEGORIES.has(category) ? category : "general";

    const { data: doc, error: docErr } = await supabaseAdmin
      .from("coach_documents")
      .insert([
        {
          title,
          source_url: sourceUrl || null,
          category: safeCategory,
          status: "processing",
        },
      ])
      .select()
      .single();
    if (docErr) throw docErr;

    const chunks = chunkText(text, { targetSize: 1000, overlap: 150 });

    let stored = 0;
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk.content);
      const { error: chunkErr } = await supabaseAdmin
        .from("coach_chunks")
        .insert([
          {
            document_id: doc.id,
            chunk_index: chunk.chunkIndex,
            content: chunk.content,
            category: safeCategory,
            section_title: chunk.sectionTitle || null,
            embedding,
          },
        ]);
      if (chunkErr) throw chunkErr;
      stored++;
    }

    await supabaseAdmin
      .from("coach_documents")
      .update({ status: "ready", updated_at: new Date().toISOString() })
      .eq("id", doc.id);

    return res
      .status(200)
      .json({ success: true, documentId: doc.id, chunksCreated: stored });
  } catch (err) {
    console.error("coach/ingest error:", err);
    return res.status(500).json({ error: "Failed to ingest document." });
  }
}
