-- Create assessments table to persist diagnostic results
CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb NOT NULL DEFAULT '{}',
  dimension_scores jsonb NOT NULL DEFAULT '{}',
  total_score integer,
  max_possible integer,
  taken_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Users can only read/insert their own assessments
CREATE POLICY "Users can insert own assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own assessments"
  ON public.assessments FOR SELECT
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS assessments_user_id_idx ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS assessments_taken_at_idx ON public.assessments(taken_at DESC);
