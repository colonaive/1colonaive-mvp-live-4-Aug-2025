-- CTW-COCKPIT-02D.13: Action Outcome Feedback (Learning Loop)
-- Adds feedback columns to ceo_action_logs for tracking action usefulness

ALTER TABLE ceo_action_logs
  ADD COLUMN IF NOT EXISTS outcome_feedback text CHECK (outcome_feedback IN ('useful', 'not_useful', 'modified')),
  ADD COLUMN IF NOT EXISTS feedback_notes text;

-- Allow authenticated users to update their feedback
CREATE POLICY "Auth update ceo_action_logs" ON ceo_action_logs
  FOR UPDATE USING (true) WITH CHECK (auth.role() = 'authenticated');

-- Index for querying feedback patterns
CREATE INDEX IF NOT EXISTS idx_ceo_action_logs_outcome_feedback
  ON ceo_action_logs(outcome_feedback) WHERE outcome_feedback IS NOT NULL;
