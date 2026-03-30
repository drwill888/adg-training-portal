-- Feedback pulse: star ratings at specific module steps
create table if not exists public.feedback_ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  module_id integer not null,
  step_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamptz default now(),
  unique(user_id, module_id, step_id)
);

alter table public.feedback_ratings enable row level security;

create policy "Users can insert own ratings" on public.feedback_ratings
  for insert with check (auth.uid() = user_id);

create policy "Users can update own ratings" on public.feedback_ratings
  for update using (auth.uid() = user_id);

create policy "Users can read own ratings" on public.feedback_ratings
  for select using (auth.uid() = user_id);

create policy "Admin can read all ratings" on public.feedback_ratings
  for select using (auth.jwt() ->> 'email' = 'meier.will@gmail.com');

-- Time tracking: per step/module
create table if not exists public.time_tracking (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  module_id integer not null,
  step_id text not null,
  seconds_spent integer not null default 0,
  updated_at timestamptz default now(),
  unique(user_id, module_id, step_id)
);

alter table public.time_tracking enable row level security;

create policy "Users can upsert own time" on public.time_tracking
  for all using (auth.uid() = user_id);

create policy "Admin can read all time" on public.time_tracking
  for select using (auth.jwt() ->> 'email' = 'meier.will@gmail.com');

-- Testimony table for gating certificate download
create table if not exists public.testimonies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null unique,
  question_1 text,
  question_2 text,
  question_3 text,
  permission_to_share boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.testimonies enable row level security;

create policy "Users can manage own testimony" on public.testimonies
  for all using (auth.uid() = user_id);

create policy "Admin can read all testimonies" on public.testimonies
  for select using (auth.jwt() ->> 'email' = 'meier.will@gmail.com');
