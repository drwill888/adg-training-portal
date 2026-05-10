# Website Coaching Agent

Public-facing chat guide for awakeningdestiny.global and coaching4impact.com.
Distinct from the in-portal C-Help bot (`components/TrainingChat.js` →
`/api/training/chat`), which is for logged-in students.

This document covers the **Phase 1 + 2 + 3 scaffold**: chat, KB retrieval,
lead capture, conversation summary, and email handoff.

## Pieces

- `components/WebsiteCoach.js` — floating widget, lead form, summary button.
- `pages/coach-preview.js` — preview page to test before embedding.
- `pages/api/coach/chat.js` — main chat endpoint (OpenAI + pgvector retrieval).
- `pages/api/coach/lead.js` — upsert visitor contact info into `coach_leads`.
- `pages/api/coach/summary.js` — JSON summary + optional email send.
- `pages/api/coach/ingest.js` — admin endpoint to add docs to the KB.
- `lib/coach/prompt.js` — system + summary prompts.
- `lib/coach/retrieval.js` — pgvector RPC wrapper.
- `lib/coach/session.js` — conversation + message helpers.
- `supabase/migrations/20260510000001_website_coach_schema.sql` — KB, leads,
  conversations, messages, RLS, and the `match_coach_chunks` RPC.
- `scripts/seed-coach-kb.js` — seed the KB with starter docs.

## Setup

1. **Run the migration** in Supabase SQL editor:
   `supabase/migrations/20260510000001_website_coach_schema.sql`.
2. **Set env vars** (see `.env.local.example`):
   `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, optional
   `COACH_MODEL`, `COACH_FREE_QUESTION_LIMIT`, `COACH_INGEST_TOKEN`,
   `RESEND_API_KEY`, `COACH_TEAM_EMAIL`.
3. **Seed the KB**:
   ```bash
   COACH_INGEST_URL=https://yoursite.com/api/coach/ingest \
   COACH_INGEST_TOKEN=... \
   node scripts/seed-coach-kb.js
   ```
4. **Preview the widget** at `/coach-preview`.

## Behavior

- Anonymous session UUID is stored in `localStorage` under `adg_coach_session`
  and sent on every request so the server can stitch turns.
- Each visitor question is embedded with `text-embedding-3-small`, matched
  against `coach_chunks` via `match_coach_chunks`, then sent to OpenAI with
  the system prompt, retrieved context, and the last 10 turns of the
  conversation.
- After 2 substantive exchanges, the widget surfaces a soft lead form
  (first name, email, interest area). The form is dismissible.
- A hard gate kicks in at `COACH_FREE_QUESTION_LIMIT` questions (default 5)
  if no lead is attached.
- "Email summary" button generates a structured JSON summary, persists it
  to `coach_conversations`, and (if a lead is captured and Resend is
  configured) sends two emails: one to the visitor, one to
  `COACH_TEAM_EMAIL`.

## Embedding on WordPress

Render `<WebsiteCoach />` from any Next.js page on the same deploy that
serves WordPress traffic, or expose a minimal `/coach-embed` route and
load it from WordPress via `<iframe>` (set
`bottom: 0; right: 0; width: 480px; height: 700px; border: none;`).
A standalone embed script can ship in a later phase.

## What's deliberately not here yet

- Stripe paywall after the free-question gate (Phase 5).
- Admin reporting dashboard (Phase 6).
- File-search retrieval directly against OpenAI (we use Supabase pgvector
  to keep the KB inside your database).
