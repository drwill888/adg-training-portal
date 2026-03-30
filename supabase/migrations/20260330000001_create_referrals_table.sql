-- Referrals table: tracks who invited whom
create table if not exists public.referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references auth.users(id),
  referrer_email text not null,
  referrer_name text,
  referred_email text not null,
  referred_name text,
  module_context text,
  created_at timestamptz default now()
);

-- RLS
alter table public.referrals enable row level security;

-- Users can insert their own referrals
create policy "Users can insert own referrals" on public.referrals
  for insert with check (auth.uid() = referrer_id);

-- Users can read their own referrals
create policy "Users can read own referrals" on public.referrals
  for select using (auth.uid() = referrer_id);

-- Admin can read all referrals
create policy "Admin can read all referrals" on public.referrals
  for select using (
    auth.jwt() ->> 'email' = 'meier.will@gmail.com'
  );
