// pages/api/mid-journey/generate-report.js
// Generates a Mid-Journey Blueprint Report for an authenticated user.
// Checks eligibility, tier, assembles data, calls Claude, saves to DB.

import { createClient } from '@supabase/supabase-js';
import { generateValidatedReport, REPORT_VALIDATION } from '../../../lib/ai/report';
import { assembleReportData, hasCompletedCapacity } from '../../../lib/mid-journey/data-assembly';
import { buildFullReportPrompt, buildLightReportPrompt } from '../../../lib/mid-journey/prompts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Premium (Opus-class) for full reports (Blueprint + Cohort), standard (Sonnet-class) for light (Self-Paced).
// Concrete model IDs live in lib/ai/config.js.
const REPORT_CONFIG = {
  full: { tier: 'premium', maxTokens: 5000, validation: REPORT_VALIDATION.midFull },
  light: { tier: 'standard', maxTokens: 2500, validation: REPORT_VALIDATION.midLight },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, force } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: 'userId and email required' });
  }

  try {
    // Eligibility: Capacity must be complete
    const capacityDone = await hasCompletedCapacity(userId);
    if (!capacityDone && !force) {
      return res.status(403).json({
        error: 'NOT_ELIGIBLE',
        message: 'Capacity module must be completed before the Mid-Journey Report unlocks.',
      });
    }

    // Idempotency: if a report already exists, return it (unless force=true)
    if (!force) {
      const { data: existing } = await supabase
        .from('mid_journey_reports')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        return res.status(200).json({
          status: 'existing',
          report: existing,
        });
      }
    }

    // Assemble all input data
    const payload = await assembleReportData({ userId, email });

    if (payload.error) {
      return res.status(400).json({
        error: payload.error,
        message: payload.message,
      });
    }

    // Build the appropriate prompt
    const prompt = payload.reportType === 'full'
      ? buildFullReportPrompt(payload)
      : buildLightReportPrompt(payload);

    const cfg = REPORT_CONFIG[payload.reportType];
    const { content, model, costUsd, check } = await generateValidatedReport({
      tier: cfg.tier,
      prompt,
      maxTokens: cfg.maxTokens,
      validation: cfg.validation,
    });

    if (!content || content.trim().length < 100) {
      console.error('Empty or too-short Claude response');
      return res.status(500).json({ error: 'AI returned an empty response.' });
    }
    if (!check.ok) console.warn('[mid-journey] saved with unresolved issues:', check.issues);

    // Save to DB — upsert on user_id
    const { data: saved, error: dbError } = await supabase
      .from('mid_journey_reports')
      .upsert(
        {
          user_id: userId,
          email,
          tier: payload.tier,
          report_type: payload.reportType,
          archetype_id: payload.archetype.id,
          archetype_office: payload.archetype.office,
          archetype_overlay: payload.archetype.overlay,
          content,
          input_payload: {
            firstName: payload.firstName,
            archetypeId: payload.archetype.id,
            modules: payload.modules,
            scoresPostByModule: payload.scoresPostByModule,
            topStrength: payload.topStrength,
            topGap: payload.topGap,
          },
          score_snapshot: payload.scoresPostByModule,
          generated_at: new Date().toISOString(),
          generation_cost_usd: costUsd,
          model_used: model,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (dbError) {
      console.error('DB error saving report:', dbError);
      return res.status(500).json({ error: 'Failed to save report.' });
    }

    return res.status(200).json({
      status: 'generated',
      report: saved,
    });
  } catch (err) {
    console.error('Generate report error:', err);
    return res.status(500).json({
      error: 'GENERATION_FAILED',
      message: err.message || 'An error occurred generating the report.',
    });
  }
}