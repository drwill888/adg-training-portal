import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details.email;

    const { error } = await supabase
      .from('payments')
      .insert({
        email: email,
        stripe_session_id: session.id,
        amount: session.amount_total,
        status: 'completed',
      });

    if (error) {
      console.error('Supabase insert error:', error);
    }
  }

  res.status(200).json({ received: true });
}
```

Before you save — we need two things added to your `.env.local`:

1. **`SUPABASE_SERVICE_ROLE_KEY`** — find this in your Supabase dashboard under **Settings → API → Service Role Key** (the secret one, not the anon key)
2. **`STRIPE_WEBHOOK_SECRET`** — we'll get this in a minute when we set up the webhook in Stripe

So open `.env.local` and add these two lines (fill in what you have now, leave webhook blank for the moment):
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
STRIPE_WEBHOOK_SECRET=whsec_placeholder