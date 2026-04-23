// pages/api/mid-journey/get-report.js
// Returns the user's report. Uses session token for auth — bypasses RLS.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Verify the token and get the user
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid session' });

  // Try by user_id first
  let report = null;
  const { data: byId } = await supabase
    .from('mid_journey_reports')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  report = byId;

  // Fallback: match by email
  if (!report && user.email) {
    const { data: byEmail } = await supabase
      .from('mid_journey_reports')
      .select('*')
      .eq('email', user.email)
      .maybeSingle();
    report = byEmail;
  }

  return res.status(200).json({ report: report || null, userId: user.id });
}