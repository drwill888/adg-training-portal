// lib/called-to-carry/email/templates.js
// Fetches email template from Supabase email_templates table
// and substitutes merge variables.
// Server-side only.

import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Fetch a template from the DB and substitute variables.
 *
 * @param {{ archetype: string, stepNumber: number, variant?: string }} opts
 * @param {{ firstName?: string, resultsUrl: string, unsubscribeUrl: string }} vars
 * @returns {Promise<{ subject: string, html: string, text: string, ctaLabel?: string, ctaUrl?: string }>}
 */
export async function getRenderedTemplate({ archetype, stepNumber, variant = 'v1' }, vars) {
  const supabase = getAdminClient();

  const { data: template, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('archetype', archetype)
    .eq('sequence_variant', variant)
    .eq('step_number', stepNumber)
    .eq('active', true)
    .single();

  if (error || !template) {
    throw new Error(`Template not found: ${archetype} / step ${stepNumber} / ${variant}`);
  }

  const greeting = vars.firstName ? `Hi ${vars.firstName},` : 'Hello,';

  function substitute(str) {
    if (!str) return str;
    return str
      .replace(/\{\{first_name\}\}/g, vars.firstName || 'friend')
      .replace(/\{\{greeting\}\}/g, greeting)
      .replace(/\{\{results_url\}\}/g, vars.resultsUrl || '')
      .replace(/\{\{unsubscribe_url\}\}/g, vars.unsubscribeUrl || '');
  }

  return {
    subject: substitute(template.subject),
    html: substitute(template.body_html),
    text: substitute(template.body_text),
    ctaLabel: template.cta_label,
    ctaUrl: template.cta_url,
  };
}
