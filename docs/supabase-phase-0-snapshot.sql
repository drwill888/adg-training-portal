-- =====================================================================
-- Called to Carry — Phase 0.3 Pre-Work Snapshot
-- Run each block in Supabase SQL Editor. Save the output somewhere you can
-- retrieve it (plain text file, screenshot, anywhere outside the database).
-- These numbers become the baseline we verify against after Phase 5.10's
-- users-table alter. If anything doesn't match post-migration, roll back.
-- =====================================================================


-- ---------------------------------------------------------------------
-- BLOCK 1 — Row counts across every table that matters
-- ---------------------------------------------------------------------
select 'auth.users'       as tbl, count(*) as row_count from auth.users
union all
select 'public.payments',        count(*) from public.payments
union all
select 'public.assessments',     count(*) from public.assessments
union all
select 'public.user_profiles',   count(*) from public.user_profiles
union all
select 'public.user_progress',   count(*) from public.user_progress
order by tbl;


-- ---------------------------------------------------------------------
-- BLOCK 2 — Every table in public schema (so we know what exists)
-- ---------------------------------------------------------------------
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;


-- ---------------------------------------------------------------------
-- BLOCK 3 — Schema of auth.users (THIS IS WHAT PHASE 5.10 WILL ALTER)
-- ---------------------------------------------------------------------
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'auth' and table_name = 'users'
order by ordinal_position;


-- ---------------------------------------------------------------------
-- BLOCK 4 — Schema of public.payments (the Blueprint access gate)
-- ---------------------------------------------------------------------
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'payments'
order by ordinal_position;


-- ---------------------------------------------------------------------
-- BLOCK 5 — Schema of public.assessments (existing 5C diagnostic)
-- Useful for Phase 4.1 "what components are reusable"
-- ---------------------------------------------------------------------
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'assessments'
order by ordinal_position;


-- ---------------------------------------------------------------------
-- BLOCK 6 — RLS policies currently in place on the public schema
-- Baseline for post-migration comparison
-- ---------------------------------------------------------------------
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;


-- ---------------------------------------------------------------------
-- BLOCK 7 — Foreign keys pointing into or out of auth.users
-- Tells us what breaks if we mistakenly altered the wrong users table
-- ---------------------------------------------------------------------
select
  tc.table_schema || '.' || tc.table_name as from_table,
  kcu.column_name                          as from_column,
  ccu.table_schema || '.' || ccu.table_name as to_table,
  ccu.column_name                          as to_column
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema   = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
 and ccu.table_schema    = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and (ccu.table_schema = 'auth' and ccu.table_name = 'users')
order by from_table, from_column;


-- ---------------------------------------------------------------------
-- BLOCK 8 — Counts by payment status (how many paid Blueprint users today)
-- Phase 5.11 backfills access_tier='blueprint' for these users.
-- ---------------------------------------------------------------------
select status, count(*) as n
from public.payments
group by status
order by n desc;


-- ---------------------------------------------------------------------
-- BLOCK 9 — Any existing public.users table?
-- (The build plan's Phase 5.10 originally assumed one. Reality may be
-- different — if this returns 0 rows, we only have auth.users.)
-- ---------------------------------------------------------------------
select 'public.users exists' as check, count(*) as tbl_count
from information_schema.tables
where table_schema = 'public' and table_name = 'users';
