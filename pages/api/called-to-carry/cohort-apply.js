import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    first_name, last_name, email, phone, city,
    archetype, leadership_stage, business_or_ministry,
    why_now, commitment_confirmed,
  } = req.body;

  if (!first_name || !last_name || !email || !leadership_stage || !business_or_ministry || !why_now) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  // Save application to Supabase
  const { data: app, error } = await supabase
    .from('cohort_applications')
    .insert({
      first_name, last_name, email,
      phone: phone || null,
      city: city || null,
      archetype: archetype || 'unknown',
      leadership_stage,
      business_or_ministry,
      why_now,
      commitment_confirmed: !!commitment_confirmed,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to save application.' });
  }

  // Create Stripe checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Called to Carry Cohort',
            description: 'Six-week apostolic formation cohort with Will Meier',
          },
          unit_amount: 49700,
        },
        quantity: 1,
      }],
      metadata: { application_id: app.id, type: 'called_to_carry_cohort' },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cohort/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cohort/apply`,
    });

    // Update application with Stripe session ID
    await supabase
      .from('cohort_applications')
      .update({ stripe_session_id: session.id })
      .eq('id', app.id);

    return res.status(200).json({ checkoutUrl: session.url });
  } catch (stripeError) {
    console.error('Stripe error:', stripeError);
    return res.status(500).json({ error: 'Failed to create checkout session.' });
  }
}