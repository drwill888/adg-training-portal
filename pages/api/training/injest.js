// pages/api/training/ingest.js
import { supabaseAdmin } from "@/lib/supabase";
import { chunkText } from "@/lib/chunking";
import { getEmbedding } from "@/lib/embeddings";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, text, module, contentType } = req.body;

    if (!title || !text) {
      return res.status(400).json({ error: "Title and text are required." });
    }

    const validModules = [
      "introduction", "calling", "connection",
      "competency", "capacity", "convergence",
      "commissioning", "general",
    ];
    const safeModule = module && validModules.includes(module) ? module : "general";

    // 1. Create document record
    const { data: doc, error: docError } = await supabaseAdmin
      .from("training_documents")
      .insert([{
        title,
        module: safeModule,
        content_type: contentType || "curriculum",
        status: "processing",
      }])
      .select()
      .single();

    if (docError) throw docError;

    // 2. Chunk with section awareness
    const chunks = chunkText(text, { targetSize: 1000, overlap: 150 });

    // 3. Embed and store each chunk
    let stored = 0;
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk.content);

      const { error: chunkError } = await supabaseAdmin
        .from("training_chunks")
        .insert([{
          document_id: doc.id,
          chunk_index: chunk.chunkIndex,
          content: chunk.content,
          module: safeModule,
          section_title: chunk.sectionTitle || null,
          embedding,
        }]);

      if (chunkError) throw chunkError;
      stored++;
    }

    // 4. Mark document as ready
    await supabaseAdmin
      .from("training_documents")
      .update({ status: "ready" })
      .eq("id", doc.id);

    return res.status(200).json({
      success: true,
      documentId: doc.id,
      chunksCreated: stored,
      module: safeModule,
    });
  } catch (error) {
    console.error("Ingest error:", error);
    return res.status(500).json({ error: "Failed to ingest training content." });
  }
}