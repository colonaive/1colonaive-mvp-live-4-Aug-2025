-- CTW-COCKPIT-02D.7 — Event Memory & Lifecycle System

-- PART 1: Add lifecycle fields to ceo_events
ALTER TABLE ceo_events
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_updated_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS recurrence_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;

-- Index for recurrence queries
CREATE INDEX IF NOT EXISTS idx_ceo_events_recurring ON ceo_events (is_recurring) WHERE is_recurring = true;

-- PART 2: Event History table — audit trail for event evolution
CREATE TABLE IF NOT EXISTS ceo_event_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES ceo_events(id) ON DELETE CASCADE,
  change_type text NOT NULL CHECK (change_type IN ('created', 'updated', 'resolved', 'status_change')),
  previous_state jsonb,
  new_state jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ceo_event_history_event ON ceo_event_history (event_id);
CREATE INDEX IF NOT EXISTS idx_ceo_event_history_type ON ceo_event_history (change_type);
