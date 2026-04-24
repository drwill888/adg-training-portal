// pages/api/final-blueprint/get-report.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  try {
    const { data: report } = await supabase
      .from('final_blueprint_reports')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return res.status(200).json({ report: report || null });
  } catch (err) {
    console.error('get-report error:', err);
    return res.status(500).json({ error: 'Failed to fetch report' });
  }
}