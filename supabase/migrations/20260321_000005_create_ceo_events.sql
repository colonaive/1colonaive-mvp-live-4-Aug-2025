-- CEO Event Consolidation Layer — CTW-COCKPIT-02D.6
-- Converts fragmented email/task/risk signals into unified CEO-level events.

CREATE TABLE IF NOT EXISTS ceo_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  event_type text NOT NULL DEFAULT 'general'
    CHECK (event_type IN ('logistics', 'investor', 'regulatory', 'product', 'clinical', 'partnership', 'general')),
  priority_score integer NOT NULL DEFAULT 50
    CHECK (priority_score >= 0 AND priority_score <= 100),
  risk_level text NOT NULL DEFAULT 'low'
    CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved')),

  -- Traceability: linked source IDs
  related_email_ids jsonb DEFAULT '[]'::jsonb,
  related_task_ids jsonb DEFAULT '[]'::jsonb,
  related_risk_ids jsonb DEFAULT '[]'::jsonb,

  -- CEO-facing fields
  summary text,
  next_action text,
  risk_summary text,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for cockpit queries
CREATE INDEX IF NOT EXISTS idx_ceo_events_status ON ceo_events (status);
CREATE INDEX IF NOT EXISTS idx_ceo_events_priority ON ceo_events (priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_ceo_events_type ON ceo_events (event_type);
CREATE INDEX IF NOT EXISTS idx_ceo_events_risk ON ceo_events (risk_level);
