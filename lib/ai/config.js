// lib/ai/config.js
// Single source of truth for which Claude model powers which kind of output.
// Override any tier per-environment in Vercel without a code change:
//   AI_MODEL_PREMIUM, AI_MODEL_STANDARD, AI_MODEL_FAST

export const MODELS = {
  // Capstone, identity-defining writing (Final Blueprint, Mid-Journey full report)
  premium: process.env.AI_MODEL_PREMIUM || 'claude-opus-5-5',
  // Personal, voice-sensitive writing and coaching conversation
  standard: process.env.AI_MODEL_STANDARD || 'claude-sonnet-5-5',
  // Classification, extraction, summaries
  fast: process.env.AI_MODEL_FAST || 'claude-haiku-5-5',
};

// USD per 1M tokens, used ONLY for the generation_cost_usd estimate stored with reports.
// Premium/standard defaults are the rates the portal already used; the fast-tier
// default is a placeholder. Confirm current pricing at https://www.anthropic.com/pricing
// and set the AI_PRICE_* env vars to keep estimates accurate.
const RATES = {
  premium: {
    in: parseFloat(process.env.AI_PRICE_PREMIUM_IN_PER_M || '15'),
    out: parseFloat(process.env.AI_PRICE_PREMIUM_OUT_PER_M || '75'),
  },
  standard: {
    in: parseFloat(process.env.AI_PRICE_STANDARD_IN_PER_M || '3'),
    out: parseFloat(process.env.AI_PRICE_STANDARD_OUT_PER_M || '15'),
  },
  fast: {
    in: parseFloat(process.env.AI_PRICE_FAST_IN_PER_M || '1'),
    out: parseFloat(process.env.AI_PRICE_FAST_OUT_PER_M || '5'),
  },
};

export function estimateCostUsd(tier, usage = {}) {
  const r = RATES[tier] || RATES.standard;
  const input =
    (usage.input_tokens || 0) +
    (usage.cache_creation_input_tokens || 0) +
    (usage.cache_read_input_tokens || 0);
  const output = usage.output_tokens || 0;
  return Number(((input * r.in) / 1e6 + (output * r.out) / 1e6).toFixed(4));
}
