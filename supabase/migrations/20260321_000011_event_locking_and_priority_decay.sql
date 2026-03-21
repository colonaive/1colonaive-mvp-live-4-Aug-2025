-- CTW-COCKPIT-02D.12: Event Locking + Priority Decay

-- Part 1: Event Locking fields on ceo_events
ALTER TABLE ceo_events
  ADD COLUMN IF NOT EXISTS event_lock_status text NOT NULL DEFAULT 'unlocked',
  ADD COLUMN IF NOT EXISTS event_locked_by text,
  ADD COLUMN IF NOT EXISTS event_locked_at timestamptz;

-- Part 2: Priority Decay — base_priority_score
ALTER TABLE ceo_events
  ADD COLUMN IF NOT EXISTS base_priority_score int;

-- Backfill: set base_priority_score = priority_score for existing rows
UPDATE ceo_events SET base_priority_score = priority_score WHERE base_priority_score IS NULL;

-- Part 3: Lock log table
CREATE TABLE IF NOT EXISTS ceo_event_lock_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES ceo_events(id) ON DELETE CASCADE,
  attempted_by text NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for querying lock logs by event
CREATE INDEX IF NOT EXISTS idx_ceo_event_lock_logs_event_id ON ceo_event_lock_logs(event_id);

-- Enable RLS (admin-only access pattern)
ALTER TABLE ceo_event_lock_logs ENABLE ROW LEVEL SECURITY;
