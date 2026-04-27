// pages/api/called-to-carry/founders/apply.js
// Founders Cohort application — saves to Supabase, creates Stripe checkout at $497,
// emails Will + sends applicant confirmation via Resend.

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = 'https://5cblueprint.awakeningdestiny.global';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@awakeningdestiny.global';

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
      tier: 'founders',
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to save application.' });
  }

  // Notify Will
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: 'info@awakeningdestiny.global',
      subject: `New Founders Cohort Application — ${first_name} ${last_name}`,
      html: `
        <h2>New Founders Cohort Application</h2>
        <p><strong>Name:</strong> ${first_name} ${last_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>City:</strong> ${city || 'Not provided'}</p>
        <p><strong>Archetype:</strong> ${archetype || 'Not taken'}</p>
        <p><strong>Leadership Stage:</strong> ${leadership_stage}</p>
        <p><strong>Assignment:</strong> ${business_or_ministry}</p>
        <p><strong>Why Now:</strong> ${why_now}</p>
      `,
    });
  } catch (emailErr) {
    console.error('Resend notification error:', emailErr);
    // Don't block — continue to Stripe checkout
  }

  // Send applicant confirmation
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your Founders Cohort Application Was Received',
      html: `
        <h2>Application Received</h2>
        <p>Hi ${first_name},</p>
        <p>Your application for the Founders Cohort has been received. Will reviews each application personally and will be in touch within 48 hours.</p>
        <p>Once confirmed, you will receive a secure payment link to complete your enrollment at $497.</p>
        <p><em>The burden you carry was given to you on purpose.</em></p>
        <p>— Awakening Destiny Global</p>
      `,
    });
  } catch (emailErr) {
    console.error('Resend confirmation error:', emailErr);
    // Don't block — continue to Stripe checkout
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
            name: 'Founders Cohort',
            description: 'Eight-week apostolic formation cohort with Will Meier',
          },
          unit_amount: 49700,
        },
        quantity: 1,
      }],
      metadata: { application_id: app.id, type: 'founders_cohort' },
      success_url: `${BASE_URL}/called-to-carry/founders/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/called-to-carry/founders/apply`,
    });

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