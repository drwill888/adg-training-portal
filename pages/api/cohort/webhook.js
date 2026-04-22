// pages/api/cohort/webhook.js
// Stripe webhook for cohort purchase completion.
// Triggered by: checkout.session.completed
// Actions:
//   1. Creates Supabase auth user (or finds existing)
//   2. Inserts row into cohort_members table (access granted)
//   3. Updates cohort_applications status to 'paid' if application exists
//   4. Fires Resend welcome email with magic link login
//
// Required env vars:
//   STRIPE_WEBHOOK_SECRET_COHORT  — webhook signing secret (separate from 5C webhook)
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   RESEND_API_KEY
//   RESEND_FROM_EMAIL
//   NEXT_PUBLIC_SITE_URL

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { buffer } from 'micro';

// Disable Next.js body parsing — Stripe needs the raw body to verify signature
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_COHORT;

  let event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Only process cohort purchases
    if (session.metadata?.product !== 'called-to-carry-cohort') {
      return res.status(200).json({ received: true });
    }

    const email = session.customer_email || session.customer_details?.email;

    if (!email) {
      console.error('No email found in session');
      return res.status(200).json({ received: true });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://5cblueprint.awakeningdestiny.global';

    try {
      // ── 1. Create or find Supabase user ──────────────────────────────────
      let userId;

      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === email);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            cohort_member: true,
            source: 'cohort-purchase',
          },
        });

        if (createError) {
          console.error('Error creating user:', createError);
        } else {
          userId = newUser.user.id;
        }
      }

      // ── 2. Insert into cohort_members table ──────────────────────────────
      if (userId) {
        const { error: memberError } = await supabase
          .from('cohort_members')
          .upsert([
            {
              user_id: userId,
              email,
              stripe_session_id: session.id,
              stripe_customer_id: session.customer || null,
              amount_paid: session.amount_total ? session.amount_total / 100 : 497,
              currency: session.currency || 'usd',
              status: 'active',
              cohort: 'founder',
              paid_at: new Date().toISOString(),
            },
          ], { onConflict: 'email' });

        if (memberError) {
          console.error('Error inserting cohort member:', memberError);
        }
      }

      // ── 3. Update application status if exists ───────────────────────────
      await supabase
        .from('cohort_applications')
        .update({
          status: 'paid',
          stripe_session_id: session.id,
          paid_at: new Date().toISOString(),
        })
        .eq('email', email);

      // ── 4. Generate magic link for instant portal access ─────────────────
      let magicLink = `${siteUrl}/dashboard`;

      try {
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: {
            redirectTo: `${siteUrl}/dashboard`,
          },
        });

        if (!linkError && linkData?.properties?.action_link) {
          magicLink = linkData.properties.action_link;
        }
      } catch (linkErr) {
        console.error('Magic link generation error:', linkErr);
        // Non-fatal — fall back to dashboard URL
      }

      // ── 5. Send welcome email ─────────────────────────────────────────────
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Will @ ADG <will@awakeningdestiny.global>',
        to: email,
        subject: 'You\'re in — Welcome to the Called to Carry Cohort',
        html: `
          <div style="background:#021A35;color:#FDF8F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
            <p style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#C8A951;margin:0 0 1.5rem;">
              Called to Carry · Called to Carry Cohort
            </p>
            <h1 style="font-size:2rem;font-weight:400;line-height:1.2;color:#FDF8F0;margin:0 0 1.5rem;">
              You're in. Welcome to the cohort.
            </h1>
            <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.85);line-height:1.75;margin:0 0 1.25rem;">
              Your investment is confirmed. Your seat is secured. What you carry was placed
              there on purpose — and this cohort exists to help you build with it.
            </p>
            <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.85);line-height:1.75;margin:0 0 2rem;">
              Click below to access your portal and begin the formation process.
            </p>
            <a href="${magicLink}"
               style="display:inline-block;background:#C8A951;color:#021A35;font-family:sans-serif;font-weight:700;font-size:0.9rem;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:1rem 2.5rem;margin-bottom:2rem;">
              Access Your Portal →
            </a>
            <p style="font-size:0.85rem;font-weight:300;color:rgba(253,248,240,0.5);line-height:1.7;margin:0 0 1.25rem;">
              This link logs you in directly — no password needed. If the button doesn't work,
              copy and paste this URL into your browser:<br/>
              <span style="color:#C8A951;word-break:break-all;">${magicLink}</span>
            </p>
            <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.85);line-height:1.75;margin:2rem 0 0;">
              More details about your cohort start date and first session are coming within 24 hours.
              Stay ready.
            </p>
            <p style="font-size:0.9rem;color:#C8A951;margin:2rem 0 0;">
              — Will, Founder · Awakening Destiny Global
            </p>
            <hr style="border:none;border-top:1px solid rgba(200,169,81,0.2);margin:2.5rem 0 1.5rem;" />
            <p style="font-size:0.72rem;color:rgba(253,248,240,0.3);margin:0;">
              © ${new Date().getFullYear()} Awakening Destiny Global · awakeningdestiny.global
            </p>
          </div>
        `,
      });

      console.log(`Cohort member activated: ${email}`);
      return res.status(200).json({ received: true });

    } catch (err) {
      console.error('Cohort webhook processing error:', err);
      // Still return 200 to prevent Stripe from retrying
      return res.status(200).json({ received: true, error: err.message });
    }
  }

  return res.status(200).json({ received: true });
}
