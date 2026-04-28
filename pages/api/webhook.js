// pages/api/webhook.js
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: { bodyParser: false },
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const email = session.customer_email || session.customer_details?.email;
    const amount = session.amount_total;
    const sessionId = session.id;
    const tier = session.metadata?.tier || 'self-paced';
    const applicationId = session.metadata?.application_id || null;

    if (email) {
      // Record payment
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          email,
          stripe_session_id: sessionId,
          amount,
          status: 'completed',
          tier,
          created_at: new Date().toISOString(),
        });

      if (paymentError) {
        console.error('Payment insert error:', paymentError);
      }

      // If Founders or Sprint — update application status
      if (applicationId) {
        const { error: appError } = await supabase
          .from('cohort_applications')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('id', applicationId);

        if (appError) {
          console.error('Application update error:', appError);
        }
      }

      console.log(`Payment recorded — ${email} — ${tier} — $${amount / 100}`);
    } else {
      console.error('No email found in checkout session');
    }
  }

  return res.status(200).json({ received: true });
}