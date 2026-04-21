// pages/api/called-to-carry/assessment/email-cron.js
// Called every 15 minutes by Vercel Cron.
// Secured with CRON_SECRET bearer token.

import { processEmailQueue } from '../../../../lib/called-to-carry/email/scheduler';

export default async function handler(req, res) {
  // Only allow GET (Vercel cron) or POST (manual trigger)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret
  const authHeader = req.headers.authorization;
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const results = await processEmailQueue();
    console.log('email-cron results:', results);
    return res.status(200).json({ ok: true, ...results });
  } catch (err) {
    console.error('email-cron fatal error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
