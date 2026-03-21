-- Predictive Intelligence Layer — CTW-COCKPIT-02D.8
-- Stores predicted events based on recurring pattern analysis

CREATE TABLE IF NOT EXISTS ceo_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('logistics', 'investor', 'regulatory', 'product', 'clinical', 'partnership', 'general')),
  predicted_event_name text NOT NULL,
  predicted_date date NOT NULL,
  confidence_score integer NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
  source_event_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'occurred', 'expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for fast cockpit queries
CREATE INDEX idx_ceo_predictions_status ON ceo_predictions (status);
CREATE INDEX idx_ceo_predictions_predicted_date ON ceo_predictions (predicted_date);
CREATE INDEX idx_ceo_predictions_confidence ON ceo_predictions (confidence_score DESC);

-- RLS
ALTER TABLE ceo_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read predictions"
  ON ceo_predictions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert predictions"
  ON ceo_predictions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update predictions"
  ON ceo_predictions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
