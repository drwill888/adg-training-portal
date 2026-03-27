-- Migration: Admin RLS Policies
-- Grants the admin user (meier.will@gmail.com) read access to all rows
-- across user_progress, user_profiles, assessments, and payments tables.
-- Also ensures regular users have proper CRUD policies on user_progress.

-- ============================================================
-- user_progress: admin read-all policy
-- ============================================================
DO $$ BEGIN
  CREATE POLICY "Admin can read all user_progress"
    ON public.user_progress FOR SELECT
    USING (
      auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'meier.will@gmail.com'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_progress: regular users read own rows
DO $$ BEGIN
  CREATE POLICY "Users can read own user_progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_progress: regular users insert own rows
DO $$ BEGIN
  CREATE POLICY "Users can insert own user_progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_progress: regular users update own rows
DO $$ BEGIN
  CREATE POLICY "Users can update own user_progress"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- user_profiles: admin read-all policy
-- ============================================================
DO $$ BEGIN
  CREATE POLICY "Admin can read all user_profiles"
    ON public.user_profiles FOR SELECT
    USING (
      auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'meier.will@gmail.com'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- assessments: admin read-all policy
-- ============================================================
DO $$ BEGIN
  CREATE POLICY "Admin can read all assessments"
    ON public.assessments FOR SELECT
    USING (
      auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'meier.will@gmail.com'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- payments: admin read-all policy
-- (RLS is assumed to be already enabled on this table)
-- ============================================================
DO $$ BEGIN
  CREATE POLICY "Admin can read all payments"
    ON public.payments FOR SELECT
    USING (
      auth.uid() IN (
        SELECT id FROM auth.users WHERE email = 'meier.will@gmail.com'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
