// lib/ai/claude.js
// Shared Anthropic client + a small `generate` helper used by every server-side
// Claude call in the portal.
import Anthropic from '@anthropic-ai/sdk';
import { MODELS, estimateCostUsd } from './config.js';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
  maxRetries: 3, // SDK backs off on 429 / 5xx / overloaded
  timeout: 90_000,
});

// If a reply was cut off by max_tokens, drop the dangling fragment so users
// never see a sentence that stops mid-thought.
export function trimToSentence(text) {
  const t = (text || '').trim();
  const m = t.match(/^[\s\S]*[.!?…]["'”’)*_]*/);
  return m ? m[0].trim() : t;
}

/**
 * generate({ tier, system, messages, maxTokens, cacheSystem })
 *  - tier: 'premium' | 'standard' | 'fast'
 *  - system: string. When cacheSystem is true it is marked cacheable so repeat
 *    calls with the same system prompt are cheaper and faster.
 *  - returns { text, usage, model, stopReason, costUsd }
 */
export async function generate({
  tier = 'standard',
  system,
  messages,
  maxTokens = 1024,
  cacheSystem = false,
}) {
  const model = MODELS[tier];
  const params = { model, max_tokens: maxTokens, messages };
  if (system) {
    params.system = cacheSystem
      ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }]
      : system;
  }

  const completion = await anthropic.messages.create(params);

  let text = completion.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n\n')
    .trim();

  if (!text) {
    console.error('[ai] empty text from model', {
      model,
      stop_reason: completion.stop_reason,
      blocks: completion.content.map((b) => b.type),
      usage: completion.usage,
    });
  }

  const truncated = completion.stop_reason === 'max_tokens';
  if (truncated) text = trimToSentence(text);

  return {
    text,
    model,
    usage: completion.usage,
    stopReason: completion.stop_reason,
    truncated,
    costUsd: estimateCostUsd(tier, completion.usage),
  };
}
