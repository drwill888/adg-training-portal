// pages/api/webhook.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Supabase admin client (uses service role key to bypass RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Stripe sends raw body — Next.js must NOT parse it
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const email = session.customer_email || session.customer_details?.email;
    const amount = session.amount_total; // in cents
    const sessionId = session.id;

    if (email) {
      const { error } = await supabase
        .from('payments')
        .insert({
          email: email,
          stripe_session_id: sessionId,
          amount: amount,
          status: 'completed',
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Supabase insert error:', error);
      } else {
        console.log(`Payment recorded for ${email}`);
      }
    } else {
      console.error('No email found in checkout session');
    }
  }

  res.status(200).json({ received: true });
}