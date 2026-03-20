// lib/db.js
// Supabase data helpers for 5C Leadership Blueprint

import { supabase } from './supabase'

// ─── LOAD USER PROGRESS FOR DASHBOARD ───────────────────────
export async function loadUserProgress(userId) {
  const { data, error } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', userId)
    .order('module_id')

  if (error) return null
  return data || []
}

// ─── LOAD AI SUMMARIES FOR DASHBOARD ────────────────────────
export async function loadAiSummaries(userId) {
  const { data, error } = await supabase
    .from('ai_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('module_id')

  if (error) return null
  return data || []
}

// ─── SAVE MODULE PROGRESS ────────────────────────────────────
export async function saveModuleProgress(userId, moduleId, moduleTitle, updates) {
  const { data, error } = await supabase
    .from('module_progress')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      module_title: moduleTitle,
      updated_at: new Date().toISOString(),
      ...updates,
    }, { onConflict: 'user_id,module_id' })
    .select()

  if (error) console.error('saveModuleProgress error:', error)
  return data
}

// ─── SAVE AI SUMMARY ─────────────────────────────────────────
export async function saveAiSummary(userId, moduleId, moduleTitle, summaryText) {
  const { data, error } = await supabase
    .from('ai_summaries')
    .upsert({
      user_id: userId,
      module_id: moduleId,
      module_title: moduleTitle,
      summary_text: summaryText,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,module_id' })
    .select()

  if (error) console.error('saveAiSummary error:', error)
  return data
}

// ─── CALCULATE DASHBOARD STATS ───────────────────────────────
export function calcDashboardStats(progressRows, totalModules = 5) {
  const completed = progressRows.filter(r => r.status === 'completed').map(r => r.module_id)
  const inProgress = progressRows.filter(r => r.status === 'in_progress').map(r => r.module_id)
  const completionPct = Math.round((completed.length / totalModules) * 100)
  const currentModule = inProgress.length > 0 ? inProgress[0] : (completed.length < totalModules ? completed.length + 1 : totalModules)

  const moduleScores = progressRows
    .filter(r => r.pre_score > 0)
    .map(r => ({
      module: r.module_id,
      pre: r.pre_score,
      post: r.post_score || null,
      delta: r.post_score ? r.post_score - r.pre_score : null,
    }))

  return { completed, inProgress, completionPct, currentModule, moduleScores }
}
