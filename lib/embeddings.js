// lib/embeddings.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";

export async function getEmbedding(input) {
  const result = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input,
  });

  return result.data[0].embedding;
}

export async function getEmbeddings(inputs) {
  const result = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: inputs,
  });

  return result.data.map((d) => d.embedding);
}
