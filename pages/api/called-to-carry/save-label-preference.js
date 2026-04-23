// pages/api/called-to-carry/save-label-preference.js
// Saves the user's selected office label preference

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { archetypeId, customLabel } = req.body;

  if (!archetypeId || !customLabel) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Update the most recent submission for this archetype
  // (in production, you'd link this to the logged-in user)
  const { error } = await supabase
    .from('called_to_carry_submissions')
    .update({
      custom_label: customLabel,
      label_preference: 'custom',
    })
    .eq('archetype_id', archetypeId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Save preference error:', error);
    return res.status(500).json({ error: 'Failed to save preference.' });
  }

  return res.status(200).json({ success: true });
}
