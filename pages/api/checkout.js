// pages/api/checkout.js
// Creates a Stripe checkout session and returns the redirect URL
// Called by the Unlock Full Access button in the dashboard

import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { email, pathway } = req.body || {};

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: '5C Leadership Blueprint — Self-Paced',
            description: 'Formation-based leadership training across five Kingdom pillars.',
          },
          unit_amount: 14900,  // $149.00
        },
        quantity: 1,
      }],
      allow_promotion_codes: true,
      success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      metadata: {
        pathway: pathway || 'individual',
        email: email || '',
      },
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
}