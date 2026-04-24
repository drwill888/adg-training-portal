// pages/api/final-blueprint/generate-report.js
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { assembleFinalReportData, hasCompletedCommissioning } from '../../../lib/final-blueprint/data-assembly';
import { buildFullReportPrompt, buildLightReportPrompt } from '../../../lib/final-blueprint/prompts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY,
});

const MODEL_CONFIG = {
  full: { model: 'claude-opus-4-7', max_tokens: 4000 },
  light: { model: 'claude-sonnet-4-5', max_tokens: 1500 },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId, email, force } = req.body;
  if (!userId || !email) return res.status(400).json({ error: 'userId and email required' });

  try {
    const commissioningDone = await hasCompletedCommissioning(userId);
    if (!commissioningDone && !force) {
      return res.status(403).json({
        error: 'NOT_ELIGIBLE',
        message: 'Commissioning module must be completed before the Final Blueprint unlocks.',
      });
    }

    if (!force) {
      const { data: existing } = await supabase
        .from('final_blueprint_reports')
        .select('*').eq('user_id', userId).maybeSingle();
      if (existing) return res.status(200).json({ status: 'existing', report: existing });
    }

    const payload = await assembleFinalReportData({ userId, email });
    if (payload.error) return res.status(400).json({ error: payload.error, message: payload.message });

    const prompt = payload.reportType === 'full'
      ? buildFullReportPrompt(payload)
      : buildLightReportPrompt(payload);

    const modelConfig = MODEL_CONFIG[payload.reportType];
    const completion = await anthropic.messages.create({
      model: modelConfig.model,
      max_tokens: modelConfig.max_tokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = completion.content.filter(b => b.type === 'text').map(b => b.text).join('\n\n');
    if (!content || content.trim().length < 100) {
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }

    const inputTokens = completion.usage?.input_tokens || 0;
    const outputTokens = completion.usage?.output_tokens || 0;
    const isOpus = modelConfig.model.includes('opus');
    const costUsd = (inputTokens * (isOpus ? 15 : 3) / 1_000_000) + (outputTokens * (isOpus ? 75 : 15) / 1_000_000);

    const { data: saved, error: dbError } = await supabase
      .from('final_blueprint_reports')
      .upsert({
        user_id: userId,
        email,
        tier: payload.tier,
        report_type: payload.reportType,
        archetype_id: payload.archetype?.archetypeId,
        archetype_office: payload.archetype?.office,
        archetype_overlay: payload.archetype?.overlay,
        content,
        input_payload: {
          firstName: payload.firstName,
          archetypeId: payload.archetype?.archetypeId,
          modules: payload.modules,
          scoresPostByModule: payload.scoresPostByModule,
          topStrength: payload.topStrength,
          topGap: payload.topGap,
        },
        score_snapshot: payload.scoresPostByModule,
        generated_at: new Date().toISOString(),
        generation_cost_usd: Number(costUsd.toFixed(4)),
        model_used: modelConfig.model,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select().single();

    if (dbError) return res.status(500).json({ error: 'Failed to save report.' });

    return res.status(200).json({ status: 'generated', report: saved });
  } catch (err) {
    console.error('Final blueprint generate error:', err);
    return res.status(500).json({ error: 'GENERATION_FAILED', message: err.message });
  }
}