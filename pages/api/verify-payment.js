// pages/api/verify-payment.js
// Called on dashboard load when session_id is in the URL.
// Verifies the Stripe session and records the payment in Supabase.

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { session_id } = req.body || {};

    if (!session_id) {
      return res.status(400).json({ error: 'session_id required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const email = session.customer_email || session.customer_details?.email;

    if (!email) {
      return res.status(400).json({ error: 'No email on session' });
    }

    // Check if already recorded
    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('stripe_session_id', session_id)
      .limit(1);

    if (!existing || existing.length === 0) {
      await supabase.from('payments').insert({
        email,
        stripe_session_id: session_id,
        amount: session.amount_total,
        status: 'completed',
        created_at: new Date().toISOString(),
      });
    }

    return res.status(200).json({ ok: true, email });

  } catch (error) {
    console.error('Verify payment error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
