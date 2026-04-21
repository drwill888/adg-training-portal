-- =================================================================
-- Called to Carry — Assessment & Email Schema
-- Migration: 20260420000001_called_to_carry_schema.sql
-- Run in Supabase SQL Editor during Phase 4 of the build plan.
-- All tables are additive — nothing existing is modified.
-- Run the entire block inside a transaction (begin / commit).
-- =================================================================

begin;

-- -----------------------------------------------------------------
-- assessment_submissions
-- One row per completed (or in-progress) assessment.
-- -----------------------------------------------------------------
create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  last_name text,

  -- Timing (supports save-and-resume — completed_at null = abandoned)
  started_at timestamptz not null default now(),
  completed_at timestamptz,

  -- Result
  archetype text check (archetype in (
    'misaligned_builder', 'unreleased_voice', 'threshold', 'aligned_builder'
  )),
  archetype_confidence numeric,  -- 0.0 to 1.0
  scores jsonb,                  -- { "misaligned_builder": 14, ... }

  -- Q10 private signal — Will reviews before discovery calls
  private_signal text,

  -- Attribution
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  -- Privacy — hashed IP, never raw
  ip_hash text,
  consent_marketing boolean not null default true,

  -- Downstream conversion
  converted_to text check (
    converted_to in ('blueprint','cohort','intensive','advisory')
    or converted_to is null
  ),
  converted_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_submissions_email
  on public.assessment_submissions (email);
create index if not exists idx_submissions_archetype
  on public.assessment_submissions (archetype);
create index if not exists idx_submissions_completed_at
  on public.assessment_submissions (completed_at desc);

alter table public.assessment_submissions enable row level security;

create policy "service_role_full_access_submissions"
  on public.assessment_submissions
  for all using (auth.role() = 'service_role');

-- -----------------------------------------------------------------
-- assessment_responses
-- One row per question answered — allows re-scoring if model changes.
-- -----------------------------------------------------------------
create table if not exists public.assessment_responses (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.assessment_submissions(id) on delete cascade,
  question_id text not null,          -- 'q1' through 'q10'
  question_index int not null,         -- 1 through 10
  response_option_id text,             -- single-select
  response_option_ids text[],          -- multi-select
  response_text text,                  -- Q10 open text
  created_at timestamptz not null default now()
);

create index if not exists idx_responses_submission
  on public.assessment_responses (submission_id);

alter table public.assessment_responses enable row level security;

create policy "service_role_full_access_responses"
  on public.assessment_responses
  for all using (auth.role() = 'service_role');

-- -----------------------------------------------------------------
-- email_sequences
-- One row per leader per archetype journey.
-- Unsubscribe = set status = 'unsubscribed' (no separate table).
-- -----------------------------------------------------------------
create table if not exists public.email_sequences (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null
    references public.assessment_submissions(id) on delete cascade,
  email text not null,

  archetype text not null,
  sequence_variant text not null default 'v1',

  current_step int not null default 0,
  next_send_at timestamptz,

  status text not null default 'active' check (status in (
    'active','paused','completed','converted','unsubscribed','bounced'
  )),

  paused_until timestamptz,   -- set for 72 hrs when leader replies to an email
  converted_to text,
  converted_at timestamptz,
  unsubscribed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sequences_active_next_send
  on public.email_sequences (next_send_at)
  where status = 'active';

create index if not exists idx_sequences_email
  on public.email_sequences (email);

alter table public.email_sequences enable row level security;

create policy "service_role_full_access_sequences"
  on public.email_sequences
  for all using (auth.role() = 'service_role');

-- -----------------------------------------------------------------
-- email_sends
-- One row per individual email dispatched.
-- -----------------------------------------------------------------
create table if not exists public.email_sends (
  id uuid primary key default gen_random_uuid(),
  sequence_id uuid not null
    references public.email_sequences(id) on delete cascade,
  submission_id uuid not null
    references public.assessment_submissions(id),

  step_number int not null,
  template_id text not null,

  resend_message_id text,

  status text not null default 'queued' check (status in (
    'queued','sent','delivered','opened','clicked','bounced','failed','skipped'
  )),

  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  click_url text,
  error text,

  created_at timestamptz not null default now()
);

create index if not exists idx_sends_sequence
  on public.email_sends (sequence_id);
create index if not exists idx_sends_status
  on public.email_sends (status);

alter table public.email_sends enable row level security;

create policy "service_role_full_access_sends"
  on public.email_sends
  for all using (auth.role() = 'service_role');

-- -----------------------------------------------------------------
-- email_templates
-- Editable copy — Will can update without a code deploy.
-- id is a human-readable string: 'misaligned_builder_step_1' etc.
-- -----------------------------------------------------------------
create table if not exists public.email_templates (
  id text primary key,

  archetype text not null,
  sequence_variant text not null default 'v1',
  step_number int not null,
  delay_days_from_previous int not null,

  subject text not null,
  preheader text,
  body_html text not null,
  body_text text not null,

  cta_label text,
  cta_url text,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (archetype, sequence_variant, step_number)
);

alter table public.email_templates enable row level security;

create policy "service_role_full_access_templates"
  on public.email_templates
  for all using (auth.role() = 'service_role');

-- -----------------------------------------------------------------
-- assessment_rate_limits
-- Tracks recent submissions per hashed IP for abuse throttling.
-- -----------------------------------------------------------------
create table if not exists public.assessment_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists idx_ratelimit_lookup
  on public.assessment_rate_limits (ip_hash, submitted_at desc);

alter table public.assessment_rate_limits enable row level security;

create policy "service_role_full_access_ratelimits"
  on public.assessment_rate_limits
  for all using (auth.role() = 'service_role');

-- -----------------------------------------------------------------
-- Admin read-all policies for meier.will@gmail.com
-- Follows existing pattern from 20260327000002_admin_rls_policies.sql
-- -----------------------------------------------------------------
do $$ begin
  create policy "Admin can read all assessment_submissions"
    on public.assessment_submissions for select
    using (auth.uid() in (
      select id from auth.users where email = 'meier.will@gmail.com'
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admin can read all email_sequences"
    on public.email_sequences for select
    using (auth.uid() in (
      select id from auth.users where email = 'meier.will@gmail.com'
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admin can read all email_sends"
    on public.email_sends for select
    using (auth.uid() in (
      select id from auth.users where email = 'meier.will@gmail.com'
    ));
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Admin can read all email_templates"
    on public.email_templates for select
    using (auth.uid() in (
      select id from auth.users where email = 'meier.will@gmail.com'
    ));
exception when duplicate_object then null;
end $$;

commit;
-- =================================================================
-- After running this migration, verify with:
--   select table_name from information_schema.tables
--   where table_schema = 'public' and table_name like '%assessment%'
--   or table_name like '%email_%'
--   order by table_name;
-- Expected: assessment_rate_limits, assessment_responses,
--           assessment_submissions, email_sends,
--           email_sequences, email_templates
-- =================================================================
