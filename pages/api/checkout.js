// pages/api/checkout.js
// Creates a Stripe checkout session and returns the redirect URL
// Called by the Unlock Full Access button in the dashboard

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, pathway } = req.body;
  // pathway: 'individual' (default) or 'cohort'
  // Price IDs come from your Stripe dashboard — add both to .env.local

  const priceId = pathway === 'cohort'
    ? process.env.STRIPE_PRICE_COHORT      // $297
    : process.env.STRIPE_PRICE_INDIVIDUAL; // $79.99

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // ─── SUCCESS → back to dashboard ───────────────────────────
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      metadata: {
        pathway: pathway || 'individual',
        email: email || '',
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}