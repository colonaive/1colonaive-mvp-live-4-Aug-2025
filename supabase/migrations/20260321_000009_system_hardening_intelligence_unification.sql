-- CTW-COCKPIT-02D.10: System Hardening + Intelligence Unification

-- PART 2: Stale event detection
ALTER TABLE ceo_events ADD COLUMN IF NOT EXISTS is_stale boolean DEFAULT false;

-- PART 3: Execution tracking on predictions
ALTER TABLE ceo_predictions ADD COLUMN IF NOT EXISTS action_status text DEFAULT 'pending'
  CHECK (action_status IN ('pending', 'executed', 'ignored'));

-- PART 7: Source system tagging
ALTER TABLE ceo_events ADD COLUMN IF NOT EXISTS source_system text DEFAULT 'colonaive'
  CHECK (source_system IN ('colonaive', 'durmah', 'sciencehod', 'renovate'));
ALTER TABLE ceo_predictions ADD COLUMN IF NOT EXISTS source_system text DEFAULT 'colonaive'
  CHECK (source_system IN ('colonaive', 'durmah', 'sciencehod', 'renovate'));

-- PART 4: Unmatched predictions log (training dataset)
CREATE TABLE IF NOT EXISTS ceo_unmatched_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id uuid REFERENCES ceo_predictions(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  predicted_event_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ceo_unmatched_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ceo_unmatched_predictions" ON ceo_unmatched_predictions FOR SELECT USING (true);
CREATE POLICY "Auth insert ceo_unmatched_predictions" ON ceo_unmatched_predictions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- PART 6: Work Room execution logging
CREATE TABLE IF NOT EXISTS ceo_action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('event', 'prediction')),
  source_id uuid NOT NULL,
  action_type text NOT NULL,
  executed_at timestamptz DEFAULT now()
);

ALTER TABLE ceo_action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ceo_action_logs" ON ceo_action_logs FOR SELECT USING (true);
CREATE POLICY "Auth insert ceo_action_logs" ON ceo_action_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ceo_events_is_stale ON ceo_events(is_stale) WHERE is_stale = true;
CREATE INDEX IF NOT EXISTS idx_ceo_predictions_action_status ON ceo_predictions(action_status);
CREATE INDEX IF NOT EXISTS idx_ceo_events_source_system ON ceo_events(source_system);
CREATE INDEX IF NOT EXISTS idx_ceo_predictions_source_system ON ceo_predictions(source_system);
CREATE INDEX IF NOT EXISTS idx_ceo_action_logs_source ON ceo_action_logs(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_ceo_action_logs_executed_at ON ceo_action_logs(executed_at DESC);
