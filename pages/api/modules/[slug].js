// pages/api/modules/[slug].js
//
// Serves paid-module content (diagnostic questions, principles, teaching
// text, etc.) only after verifying, server-side, that the requesting user
// has a completed payment on file. This replaces the previous approach of
// shipping every module's full content in the client JS bundle for every
// visitor and hiding it behind a CSS/React "LOCKED" screen — that content
// was extractable from the page source/network tab by anyone, paid or not.
//
// The five paid modules' content now lives under lib/module-content/,
// which is imported ONLY here (server-side) — never from a page component
// — so it never ships to a browser that hasn't been authorized.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Introduction and Calling are free — they're not served through this
// route at all (their content stays inline in their page files, same as
// before). Listing them here just lets us return a clear error if
// something ever calls this route for them by mistake.
const FREE_SLUGS = new Set(['introduction', 'calling']);

const PAID_MODULE_LOADERS = {
  connection: () => import('../../../lib/module-content/connection.js'),
  competency: () => import('../../../lib/module-content/competency.js'),
  capacity: () => import('../../../lib/module-content/capacity.js'),
  convergence: () => import('../../../lib/module-content/convergence.js'),
  commissioning: () => import('../../../lib/module-content/commissioning.js'),
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { slug } = req.query;

  if (FREE_SLUGS.has(slug)) {
    return res.status(400).json({ error: 'This module is free and is not served through this route.' });
  }

  const loader = PAID_MODULE_LOADERS[slug];
  if (!loader) return res.status(404).json({ error: 'Unknown module' });

  // Verify the session token server-side — never trust a client-supplied
  // user id or email for the payment check below.
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid session' });

  // Authoritative payment check — service-role client bypasses RLS, so
  // this is the real gate, not just a UI hint. Same completed-payment
  // definition used elsewhere (usePaymentStatus.js) for consistency.
  const { data: payment } = await supabase
    .from('payments')
    .select('id')
    .eq('email', user.email)
    .eq('status', 'completed')
    .limit(1)
    .maybeSingle();

  if (!payment) {
    return res.status(403).json({ error: 'Payment required' });
  }

  try {
    const mod = await loader();
    return res.status(200).json({ config: mod.default });
  } catch (err) {
    console.error(`Failed to load module content for "${slug}":`, err);
    return res.status(500).json({ error: 'Failed to load module content' });
  }
}
