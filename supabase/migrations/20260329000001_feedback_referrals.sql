-- Learner feedback (captured every 2 modules: after Connection=2, Capacity=4, Commissioning=6)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL,
  doing_well TEXT,
  need_help TEXT,
  improvement TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can read all feedback" ON feedback
  FOR SELECT USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'meier.will@gmail.com'
  );

-- Friend referrals (captured at midpoint=module 3 and end=module 6)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referring_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_name TEXT NOT NULL,
  referee_email TEXT NOT NULL,
  source_module INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_user ON referrals(referring_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_created ON referrals(created_at DESC);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referring_user_id);

CREATE POLICY "Admin can read all referrals" ON referrals
  FOR SELECT USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'meier.will@gmail.com'
  );
