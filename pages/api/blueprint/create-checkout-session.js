// pages/api/blueprint/create-checkout-session.js
// Stripe checkout for Blueprint — $997 one-time
// Called after Will confirms the application

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`;

  try {
    const priceData = process.env.STRIPE_BLUEPRINT_PRICE_ID
      ? { price: process.env.STRIPE_BLUEPRINT_PRICE_ID }
      : {
          price_data: {
            currency: 'usd',
            unit_amount: 49700, // $497.00
            product_data: {
              name: 'Called to Carry Blueprint',
              description: '21-day intensive. All 7 modules, 3 live group calls, private 30-min session with Will, Blueprint export, Certificate, lifetime portal access.',
            },
          },
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ ...priceData, quantity: 1 }],
      success_url: `${baseUrl}/blueprint/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/blueprint?canceled=true`,
      customer_email: req.body.email || undefined,
      metadata: {
        product: 'blueprint',
        source: 'called-to-carry',
      },
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return res.status(500).json({ error: err.message });
  }
}
