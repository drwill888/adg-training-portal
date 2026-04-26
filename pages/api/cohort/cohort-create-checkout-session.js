// pages/api/cohort/create-checkout-session.js
// Creates a Stripe Checkout session for the Founder Cohort.
// Env vars required (already set in Vercel):
//   STRIPE_SECRET_KEY       — your live Stripe secret key
//   STRIPE_COHORT_PRICE_ID  — price ID from Stripe dashboard (create once, reuse)
//   NEXT_PUBLIC_SITE_URL    — e.g. https://calledtocarry.awakeningdestiny.global

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    `https://${req.headers.host}`;

  try {
    // Option A: Use a pre-created Price ID (recommended for production)
    // Set STRIPE_COHORT_PRICE_ID in your Vercel env vars.
    // Option B: Inline price (fallback for development / first deploy)
    const priceData = process.env.STRIPE_COHORT_PRICE_ID
      ? { price: process.env.STRIPE_COHORT_PRICE_ID }
      : {
          price_data: {
            currency: 'usd',
            unit_amount: 49700, // $497.00
            product_data: {
              name: 'Called to Carry — Founder Cohort',
              description:
                '8-week live formation cohort for Kingdom leaders. Includes 5C portal access, prophetic business coaching, Blueprint export, and Founder community.',
              images: [
                // Replace with your actual product image URL once available
                `${baseUrl}/images/cohort-og.jpg`,
              ],
            },
          },
        };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          ...priceData,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/cohort/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cohort?canceled=true`,
      // Collect email so you can trigger Resend onboarding email on success
      customer_email: req.body.email || undefined,
      metadata: {
        product: 'founder-cohort',
        source: 'called-to-carry',
      },
      // Stripe will collect billing address — useful for records
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return res.status(500).json({ error: err.message });
  }
}
