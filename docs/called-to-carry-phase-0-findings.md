# Phase 0.5 Findings — Existing Blueprint Integration Surface

**Captured:** 2026-04-20
**Purpose:** Document how the existing 5C Blueprint grants and checks payment access, so Phase 5 (Cohort) can integrate without breaking current behavior.

---

## Payment flow (current)

1. User clicks *Unlock Full Access* on the dashboard → `POST /api/checkout`
2. `pages/api/checkout.js` creates a Stripe Checkout Session using `STRIPE_PRICE_ID` (singular — Blueprint has one product). Success URL: `/dashboard?session_id={CHECKOUT_SESSION_ID}`.
3. Stripe completes → redirects user to dashboard with `?session_id=`.
4. **Two paths write the payment row, creating redundancy:**
   - `pages/api/webhook.js` receives `checkout.session.completed` event, verifies signature, inserts into `payments` table.
   - `pages/api/verify-payment.js` is called from the dashboard on load, retrieves the session from Stripe, and inserts into `payments` if no row exists for the `stripe_session_id`.

## Access-gating check (current)

`lib/usePaymentStatus.js` is the React hook the dashboard + modules use. It:

1. Gets the current Supabase auth session (magic-link email).
2. Queries `payments` table: `.eq('email', session.user.email).eq('status', 'completed').limit(1)`.
3. Returns `{ paid: true }` if any row matches.

**Key observation:** access is keyed by **email match between `auth.users` and `payments.email`** — there is currently no `users.access_tier` column, and no link between `auth.users.id` and `payments`.

## `payments` table (inferred shape)

Columns written by webhook/verify-payment:
- `email` (string)
- `stripe_session_id` (string)
- `amount` (integer, cents)
- `status` ('completed')
- `created_at` (timestamp)

RLS note: `payments` has an admin-read-all policy for `meier.will@gmail.com` (per `supabase/migrations/20260327000002_admin_rls_policies.sql`). Regular-user RLS on `payments` is not visible in the migration set — likely permissive or managed outside these migrations.

---

## Issues identified (not blocking Phase 0)

1. **Webhook has no idempotency check.** If Stripe retries (which it does with exponential backoff), duplicate `payments` rows can be created. Phase 5.9.c explicitly adds idempotency via `cohort_applications.stripe_session_id` for Cohort — we should also patch the Blueprint path to check existence before insert. Safe fix: `upsert` keyed on `stripe_session_id`.
2. **Verify-payment has the same issue under concurrency.** Both handlers check `stripe_session_id` existence before insert, but the check+insert is not a transaction. Concurrent arrival of webhook + redirect verification can still race. Not a new problem — leave for a later cleanup; not Phase 5 scope.
3. **Webhook does not branch on `price_id`.** Every `checkout.session.completed` is treated as a Blueprint purchase. Before Phase 5 goes live, the webhook must branch:
   - Blueprint price → existing `payments` write (unchanged behavior).
   - Cohort founder/standard prices → Cohort-specific handling (cohort_applications + cohort_members + access_tier).
   - Unknown price → log + 200 (prevent Stripe retries on unknown events).

## Phase 5 integration plan (informed by above)

- **Discriminator:** `session.line_items.data[0].price.id`, matched against env vars `STRIPE_PRICE_ID` (existing Blueprint), `STRIPE_PRICE_ID_COHORT_FOUNDER`, `STRIPE_PRICE_ID_COHORT_STANDARD`.
- **Existing Blueprint handler stays byte-identical.** We wrap the existing insert in the Blueprint branch and leave behavior unchanged. Any refactor of the Blueprint path happens in its own commit.
- **Cohort branch** writes to `cohort_applications` (status → `paid`), `cohort_members`, and `users.access_tier` (after Phase 5.10 column add). Idempotency via `cohort_applications.stripe_session_id` unique index.
- **After Phase 5.10 column add**, the dashboard's access check becomes a two-source OR: `payments.status='completed'` (legacy, still the truth for existing users) OR `users.access_tier IN ('blueprint','cohort','intensive','advisory')` (new). We backfill `access_tier='blueprint'` for existing paid users in Phase 5.11, then over time the `users.access_tier` check becomes primary.

## Files touched or referenced in Phase 5

- `pages/api/webhook.js` — edited (add price-id branching + idempotency)
- `pages/api/called-to-carry/cohort/apply.js` — new
- `pages/api/called-to-carry/cohort/approve.js` — new (admin-triggered, generates Stripe checkout link for approved application)
- `lib/usePaymentStatus.js` — extended (check access_tier OR payments.status)
- Supabase schema — `cohort_cohorts`, `cohort_applications`, `cohort_members`, `inquiries` (new); `users.access_tier`, `users.cohort_id` (altered in Phase 5.10)
