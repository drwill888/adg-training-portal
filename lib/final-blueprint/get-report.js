// pages/api/final-blueprint/get-report.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid session' });

  let report = null;
  const { data: byId } = await supabase
    .from('final_blueprint_reports').select('*').eq('user_id', user.id).maybeSingle();
  report = byId;

  if (!report && user.email) {
    const { data: byEmail } = await supabase
      .from('final_blueprint_reports').select('*').eq('email', user.email).maybeSingle();
    report = byEmail;
  }

  return res.status(200).json({ report: report || null, userId: user.id });
}