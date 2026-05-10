-- =================================================================
-- Website Coaching Agent — KB, Leads, Conversations Schema
-- Migration: 20260510000001_website_coach_schema.sql
-- Run in Supabase SQL Editor.
-- All tables are additive — separate from training_* tables so the
-- public website coach KB and the in-portal C-Help KB stay isolated.
-- =================================================================

begin;

create extension if not exists vector;

-- -----------------------------------------------------------------
-- coach_documents
-- One row per public-website document (FAQ, 5C overview, cohort
-- description, blog post, page copy, etc.).
-- -----------------------------------------------------------------
create table if not exists public.coach_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text,
  category text check (category in (
    'about', '5c', 'cohort', 'coaching', 'training',
    'events', 'speaking', 'faq', 'blog', 'general'
  )) default 'general',
  status text check (status in ('processing', 'ready', 'archived')) default 'processing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_coach_documents_category
  on public.coach_documents (category);

-- -----------------------------------------------------------------
-- coach_chunks
-- pgvector-backed retrieval index for the website coach.
-- -----------------------------------------------------------------
create table if not exists public.coach_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.coach_documents(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  category text,
  section_title text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create index if not exists idx_coach_chunks_document
  on public.coach_chunks (document_id);
create index if not exists idx_coach_chunks_category
  on public.coach_chunks (category);
create index if not exists idx_coach_chunks_embedding
  on public.coach_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Retrieval RPC — mirrors match_training_chunks pattern.
create or replace function public.match_coach_chunks (
  query_embedding vector(1536),
  match_count int default 6,
  filter_category text default null
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  category text,
  section_title text,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.document_id,
    c.content,
    c.category,
    c.section_title,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.coach_chunks c
  where filter_category is null or c.category = filter_category
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

-- -----------------------------------------------------------------
-- coach_leads
-- One row per unique visitor (by email). Updated as we learn more.
-- -----------------------------------------------------------------
create table if not exists public.coach_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  last_name text,
  phone text,

  -- Interest signal — what brought them in
  interest text check (interest in (
    'leadership', 'coaching', '5c', 'cohort',
    'prophetic', 'apostolic', 'speaking', 'training', 'other'
  )),
  interest_notes text,

  -- Attribution
  source_url text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  -- Privacy — hashed IP, never raw
  ip_hash text,
  consent_marketing boolean not null default true,

  -- Lifecycle
  last_seen_at timestamptz not null default now(),
  next_step text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_coach_leads_email
  on public.coach_leads (email);
create index if not exists idx_coach_leads_interest
  on public.coach_leads (interest);
create index if not exists idx_coach_leads_created_at
  on public.coach_leads (created_at desc);

-- -----------------------------------------------------------------
-- coach_conversations
-- One row per chat session. Soft-linked to a lead once captured.
-- -----------------------------------------------------------------
create table if not exists public.coach_conversations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.coach_leads(id) on delete set null,

  -- Anonymous session tracking (cookie/localStorage UUID)
  session_id text not null,

  -- Free-question gate counter (Phase 5 hook — still present here so
  -- we don't need a follow-up migration).
  free_questions_used int not null default 0,

  -- Conversation summary (generated server-side on demand)
  summary text,
  recommended_next_step text,
  primary_5c text check (primary_5c in (
    'calling', 'connection', 'competency', 'capacity', 'convergence'
  )),

  -- Attribution at session start
  source_url text,
  referrer text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_coach_conversations_session
  on public.coach_conversations (session_id);
create index if not exists idx_coach_conversations_lead
  on public.coach_conversations (lead_id);
create index if not exists idx_coach_conversations_created_at
  on public.coach_conversations (created_at desc);

-- -----------------------------------------------------------------
-- coach_messages
-- Every user/assistant turn. Retained for admin review and summary.
-- -----------------------------------------------------------------
create table if not exists public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.coach_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_coach_messages_conversation
  on public.coach_messages (conversation_id, created_at);

-- -----------------------------------------------------------------
-- RLS — keep everything server-side via service role.
-- No public/anon access; the API routes proxy reads/writes.
-- -----------------------------------------------------------------
alter table public.coach_documents enable row level security;
alter table public.coach_chunks enable row level security;
alter table public.coach_leads enable row level security;
alter table public.coach_conversations enable row level security;
alter table public.coach_messages enable row level security;

commit;
