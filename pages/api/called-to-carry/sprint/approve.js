// pages/api/called-to-carry/sprint/approve.js
// Will clicks the approve link → creates Stripe $997 checkout → emails applicant.

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

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token.');

  const { data: app, error } = await supabase
    .from('cohort_applications')
    .select('*')
    .eq('approval_token', token)
    .eq('tier', 'sprint')
    .single();

  if (error || !app) {
    return res.status(404).send('Application not found or already approved.');
  }

  if (app.approved_at) {
    return res.status(200).send(`Already approved. Payment link was sent to ${app.email}.`);
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'will@awakeningdestiny.global';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: app.email,
      line_items: [{
        price: process.env.STRIPE_SPRINT_PRICE_ID,
        quantity: 1,
      }],
      metadata: { application_id: app.id, tier: 'sprint' },
      allow_promotion_codes: true,
      success_url: `${BASE_URL}/dashboard`,
      cancel_url: `${BASE_URL}/called-to-carry/sprint/apply`,
    });

    await supabase
      .from('cohort_applications')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        stripe_session_id: session.id,
      })
      .eq('id', app.id);

    await resend.emails.send({
      from: fromEmail,
      to: app.email,
      subject: "You've been approved — complete your 21-Day Sprint enrollment",
      html: `
        <div style="background:#021A35;color:#FDF8F0;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
          <p style="color:#C8A951;text-transform:uppercase;letter-spacing:0.15em;font-size:0.75rem;">21-Day Sprint · You're Approved</p>
          <h1 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:400;color:#FDF8F0;">${app.first_name}, your seat is confirmed.</h1>
          <p style="color:rgba(253,248,240,0.85);line-height:1.75;">Will has reviewed your application and confirmed your fit for the 21-Day Sprint. Complete your enrollment below to secure your seat and begin the formation process.</p>
          <div style="margin:2rem 0;text-align:center;">
            <a href="${session.url}" style="display:inline-block;background:#C8A951;color:#021A35;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem;">
              Complete Enrollment — $997 →
            </a>
          </div>
          <p style="color:rgba(253,248,240,0.6);font-size:0.85rem;">This link is secure and unique to you. If you have questions, reply to this email.</p>
          <p style="color:#C8A951;margin-top:2rem;">— Will, Founder · Awakening Destiny Global</p>
        </div>
      `,
    });

    return res.status(200).send(`
      <html><body style="font-family:Georgia,serif;max-width:600px;margin:4rem auto;padding:2rem;background:#FDF8F0;color:#021A35;">
        <h2 style="color:#021A35;">✓ Approved</h2>
        <p>${app.first_name} ${app.last_name} has been approved for the 21-Day Sprint.</p>
        <p>A payment link for <strong>$997</strong> has been sent to <strong>${app.email}</strong>.</p>
        <p style="color:#C8A951;font-style:italic;">Once they pay, their portal access will be granted automatically.</p>
      </body></html>
    `);

  } catch (err) {
    console.error('Sprint approve error:', err);
    return res.status(500).send('Something went wrong. Check Vercel logs.');
  }
}