// pages/api/self-paced/webhook.js
// Stripe webhook for Self-Paced Journey purchase.
// Triggered by: checkout.session.completed
// Actions:
//   1. Creates Supabase auth user (or finds existing)
//   2. Inserts row into self_paced_access table with 3-month expiry
//   3. Fires Resend welcome email with magic link

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { buffer } from 'micro';

export const config = {
  api: { bodyParser: false },
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
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_SELF_PACED;

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

    if (session.metadata?.product !== 'self-paced-journey') {
      return res.status(200).json({ received: true });
    }

    const email = session.customer_email || session.customer_details?.email;

    if (!email) {
      return res.status(200).json({ received: true });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://5cblueprint.awakeningdestiny.global';

    // Calculate 3-month expiry
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    try {
      // ── 1. Create or find Supabase user ──────────────────────────────────
      let userId;
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === email);

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            self_paced_member: true,
            source: 'self-paced-purchase',
          },
        });

        if (createError) {
          console.error('Error creating user:', createError);
        } else {
          userId = newUser.user.id;
        }
      }

      // ── 2. Insert into self_paced_access table ───────────────────────────
      if (userId) {
        const { error: accessError } = await supabase
          .from('self_paced_access')
          .upsert([
            {
              user_id: userId,
              email,
              stripe_session_id: session.id,
              stripe_customer_id: session.customer || null,
              amount_paid: session.amount_total ? session.amount_total / 100 : 67,
              status: 'active',
              expires_at: expiresAt.toISOString(),
              paid_at: new Date().toISOString(),
            },
          ], { onConflict: 'email' });

        if (accessError) {
          console.error('Error inserting self-paced access:', accessError);
        }
      }

      // ── 3. Generate magic link ────────────────────────────────────────────
      let magicLink = `${siteUrl}/dashboard`;

      try {
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email,
          options: { redirectTo: `${siteUrl}/dashboard` },
        });

        if (!linkError && linkData?.properties?.action_link) {
          magicLink = linkData.properties.action_link;
        }
      } catch (linkErr) {
        console.error('Magic link error:', linkErr);
      }

      // ── 4. Send welcome email ─────────────────────────────────────────────
      const expiryFormatted = expiresAt.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Will @ ADG <will@awakeningdestiny.global>',
        to: email,
        subject: "Your journey begins now — Called to Carry",
        html: `
          <div style="background:#021A35;color:#FDF8F0;font-family:'Georgia',serif;max-width:600px;margin:0 auto;padding:3rem 2rem;">
            <p style="font-size:0.75rem;letter-spacing:0.18em;text-transform:uppercase;color:#C8A951;margin:0 0 1.5rem;">
              Called to Carry · Self-Paced Journey
            </p>
            <h1 style="font-size:2rem;font-weight:400;line-height:1.2;color:#FDF8F0;margin:0 0 1.5rem;">
              Your journey begins now.
            </h1>
            <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.85);line-height:1.75;margin:0 0 1.25rem;">
              Your access is confirmed. You have 3 months — until ${expiryFormatted} —
              to complete all six modules at your own pace.
            </p>
            <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.85);line-height:1.75;margin:0 0 2rem;">
              Click below to access your portal and begin with the Introduction module.
            </p>
            <a href="${magicLink}"
               style="display:inline-block;background:#C8A951;color:#021A35;font-family:sans-serif;font-weight:700;font-size:0.9rem;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:1rem 2.5rem;margin-bottom:2rem;">
              Begin the Journey →
            </a>
            <p style="font-size:0.85rem;font-weight:300;color:rgba(253,248,240,0.5);line-height:1.7;margin:0 0 1.25rem;">
              This link logs you in directly. If it doesn't work, copy and paste:<br/>
              <span style="color:#C8A951;word-break:break-all;">${magicLink}</span>
            </p>
            <p style="font-size:1rem;font-weight:300;color:rgba(253,248,240,0.85);line-height:1.75;margin:2rem 0 0;">
              If you want to go deeper with live community and direct coaching,
              the Called to Carry Cohort is your next step.
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

      console.log(`Self-paced access granted: ${email} — expires ${expiresAt.toISOString()}`);
      return res.status(200).json({ received: true });

    } catch (err) {
      console.error('Self-paced webhook error:', err);
      return res.status(200).json({ received: true, error: err.message });
    }
  }

  return res.status(200).json({ received: true });
}
