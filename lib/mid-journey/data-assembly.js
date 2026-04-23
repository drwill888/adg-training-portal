// lib/mid-journey/data-assembly.js
// Gathers all input data needed to generate a Mid-Journey Blueprint Report.
// Inputs: userId + email (from portal). Output: structured payload ready for prompts.

import { createClient } from '@supabase/supabase-js';
import { ARCHETYPES } from '../called-to-carry/archetypes';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Module ID → name mapping (matches 5C Blueprint curriculum)
const MODULE_NAMES = {
  0: 'introduction',
  1: 'calling',
  2: 'connection',
  3: 'competency',
  4: 'capacity',
  5: 'convergence',
  6: 'commissioning',
};

// Reverse mapping for display
const MODULE_DISPLAY = {
  calling: 'Calling',
  connection: 'Connection',
  competency: 'Competency',
  capacity: 'Capacity',
};

/**
 * Check which tier a user belongs to. Returns 'blueprint' | 'cohort' | 'self_paced' | null.
 */
export async function getUserTier(email) {
  if (!email) return null;

  const { data: blueprint } = await supabase
    .from('blueprint_members')
    .select('id')
    .eq('email', email)
    .eq('status', 'active')
    .maybeSingle();
  if (blueprint) return 'blueprint';

  const { data: cohort } = await supabase
    .from('cohort_members')
    .select('id')
    .eq('email', email)
    .eq('status', 'active')
    .maybeSingle();
  if (cohort) return 'cohort';

  const { data: selfPaced } = await supabase
    .from('self_paced_access')
    .select('id')
    .eq('email', email)
    .eq('status', 'active')
    .maybeSingle();
  if (selfPaced) return 'self_paced';

  return null;
}

/**
 * Check whether the user has completed Capacity (module_id = 4).
 */
export async function hasCompletedCapacity(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('current_step, post_scores')
    .eq('user_id', userId)
    .eq('module_id', 4)
    .maybeSingle();

  if (error || !data) return false;
  // current_step = 7 = completed in this schema
  return data.current_step >= 7;
}

/**
 * Fetch Called to Carry archetype for a user by email.
 * Returns the full archetype object from ARCHETYPES, or null if no submission.
 */
export async function getArchetype(email) {
  if (!email) return null;

  const { data } = await supabase
    .from('called_to_carry_submissions')
    .select('archetype_id, office, overlay, first_name')
    .eq('email', email)
    .maybeSingle();

  if (!data) return null;

  const archetype = ARCHETYPES[data.archetype_id];
  if (!archetype) return null;

  return {
    ...archetype,
    archetypeId: data.archetype_id,
    office: data.office,
    overlay: data.overlay,
    firstNameFromCtC: data.first_name,
  };
}

/**
 * Pull all module data for modules 1-4 for a user.
 * Returns { calling, connection, competency, capacity } each with reflections/commitments/scores.
 */
export async function getModuleData(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_id, pre_scores, post_scores, reflections, commitments, ai_summary')
    .eq('user_id', userId)
    .in('module_id', [1, 2, 3, 4]);

  if (error || !data) return {};

  const result = {};
  for (const row of data) {
    const name = MODULE_NAMES[row.module_id];
    if (!name) continue;

    // pre_scores/post_scores are jsonb — sum numeric values for total
    const preTotal = sumScores(row.pre_scores);
    const postTotal = sumScores(row.post_scores);

    result[name] = {
      reflections: row.reflections || {},
      commitments: row.commitments || {},
      preScore: preTotal,
      postScore: postTotal,
      delta: postTotal != null && preTotal != null ? postTotal - preTotal : null,
    };
  }
  return result;
}

function sumScores(scores) {
  if (!scores || typeof scores !== 'object') return null;
  const values = Object.values(scores).filter(v => typeof v === 'number');
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0);
}

/**
 * Identify the top strength and top gap across Calling/Connection/Competency/Capacity.
 * Uses post-score. Returns { topStrength: {name, score}, topGap: {name, score} }.
 */
export function computeStrengthAndGap(moduleData) {
  const entries = ['calling', 'connection', 'competency', 'capacity']
    .map(name => ({
      name: MODULE_DISPLAY[name],
      score: moduleData[name]?.postScore ?? moduleData[name]?.preScore,
    }))
    .filter(e => typeof e.score === 'number');

  if (entries.length === 0) {
    return {
      topStrength: { name: 'Unknown', score: null },
      topGap: { name: 'Unknown', score: null },
    };
  }

  const sorted = [...entries].sort((a, b) => b.score - a.score);
  return {
    topStrength: sorted[0],
    topGap: sorted[sorted.length - 1],
  };
}

/**
 * Master assembler — returns the complete payload for either full or light report.
 */
export async function assembleReportData({ userId, email }) {
  const [archetype, moduleData, tier] = await Promise.all([
    getArchetype(email),
    getModuleData(userId),
    getUserTier(email),
  ]);

  if (!archetype) {
    return { error: 'NO_ARCHETYPE', message: 'User has no Called to Carry submission matching their email.' };
  }

  if (!tier) {
    return { error: 'NO_TIER', message: 'User is not an active member of any tier.' };
  }

  const { topStrength, topGap } = computeStrengthAndGap(moduleData);

  // First name preference: the one they used in CtC assessment
  const firstName = archetype.firstNameFromCtC || null;

  // Post-score map for quick reference in light prompt
  const scoresPostByModule = {};
  for (const name of ['calling', 'connection', 'competency', 'capacity']) {
    scoresPostByModule[name] = moduleData[name]?.postScore ?? moduleData[name]?.preScore ?? null;
  }

  return {
    tier,
    reportType: tier === 'self_paced' ? 'light' : 'full',
    firstName,
    archetype,
    modules: moduleData,
    scoresPostByModule,
    topStrength,
    topGap,
    // strengthsFinder intentionally omitted — not yet captured
  };
}