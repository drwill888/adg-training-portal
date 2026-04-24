// lib/final-blueprint/data-assembly.js
// Gathers all 7 modules of data for the Final Blueprint Report.

import { createClient } from '@supabase/supabase-js';
import { ARCHETYPES } from '../called-to-carry/archetypes';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MODULE_NAMES = {
  0: 'introduction',
  1: 'calling',
  2: 'connection',
  3: 'competency',
  4: 'capacity',
  5: 'convergence',
  6: 'commissioning',
};

const MODULE_DISPLAY = {
  calling: 'Calling',
  connection: 'Connection',
  competency: 'Competency',
  capacity: 'Capacity',
  convergence: 'Convergence',
};

export async function getUserTier(email) {
  if (!email) return null;
  const { data: blueprint } = await supabase
    .from('blueprint_members').select('id').eq('email', email).eq('status', 'active').maybeSingle();
  if (blueprint) return 'blueprint';
  const { data: cohort } = await supabase
    .from('cohort_members').select('id').eq('email', email).eq('status', 'active').maybeSingle();
  if (cohort) return 'cohort';
  const { data: selfPaced } = await supabase
    .from('self_paced_access').select('id').eq('email', email).eq('status', 'active').maybeSingle();
  if (selfPaced) return 'self_paced';
  return null;
}

export async function hasCompletedCommissioning(userId) {
  const { data } = await supabase
    .from('user_progress')
    .select('current_step')
    .eq('user_id', userId)
    .eq('module_id', 6)
    .maybeSingle();
  return data?.current_step >= 7;
}

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
  return { ...archetype, archetypeId: data.archetype_id, office: data.office, overlay: data.overlay, firstNameFromCtC: data.first_name };
}

export async function getAllModuleData(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('module_id, pre_scores, post_scores, reflections, commitments, ai_summary')
    .eq('user_id', userId)
    .in('module_id', [0, 1, 2, 3, 4, 5, 6]);

  if (error || !data) return {};

  const result = {};
  for (const row of data) {
    const name = MODULE_NAMES[row.module_id];
    if (!name) continue;
    const preTotal = sumScores(row.pre_scores);
    const postTotal = sumScores(row.post_scores);
    result[name] = {
      reflections: row.reflections || {},
      commitments: row.commitments || {},
      preScore: preTotal,
      postScore: postTotal,
      delta: postTotal != null && preTotal != null ? postTotal - preTotal : null,
      aiSummary: row.ai_summary || '',
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

export function computeStrengthAndGap(moduleData) {
  const entries = ['calling', 'connection', 'competency', 'capacity', 'convergence']
    .map(name => ({
      name: MODULE_DISPLAY[name],
      score: moduleData[name]?.postScore ?? moduleData[name]?.preScore,
    }))
    .filter(e => typeof e.score === 'number');
  if (entries.length === 0) {
    return { topStrength: { name: 'Unknown', score: null }, topGap: { name: 'Unknown', score: null } };
  }
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  return { topStrength: sorted[0], topGap: sorted[sorted.length - 1] };
}

export async function assembleFinalReportData({ userId, email }) {
  const [archetype, modules, tier] = await Promise.all([
    getArchetype(email),
    getAllModuleData(userId),
    getUserTier(email),
  ]);

  if (!tier) return { error: 'NO_TIER', message: 'User is not an active member.' };

  const { topStrength, topGap } = computeStrengthAndGap(modules);
  const firstName = archetype?.firstNameFromCtC || null;

  const scoresPostByModule = {};
  for (const name of ['calling', 'connection', 'competency', 'capacity', 'convergence']) {
    scoresPostByModule[name] = modules[name]?.postScore ?? modules[name]?.preScore ?? null;
  }

  return {
    tier,
    reportType: tier === 'self_paced' ? 'light' : 'full',
    firstName,
    archetype,
    modules,
    scoresPostByModule,
    topStrength,
    topGap,
  };
}