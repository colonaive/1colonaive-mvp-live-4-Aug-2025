-- CTW-COCKPIT-02D.11: Global Event Identity Layer
-- Prevents duplicate events across systems. One real-world issue = one global event.

-- PART 1: Event fingerprint for cross-system deduplication
ALTER TABLE ceo_events ADD COLUMN IF NOT EXISTS event_fingerprint text;
CREATE INDEX IF NOT EXISTS idx_ceo_events_fingerprint ON ceo_events(event_fingerprint) WHERE event_fingerprint IS NOT NULL;

-- PART 3: Convert source_system from text to jsonb array
-- Drop the old CHECK constraint and column, replace with jsonb array
ALTER TABLE ceo_events DROP CONSTRAINT IF EXISTS ceo_events_source_system_check;
ALTER TABLE ceo_events ALTER COLUMN source_system SET DEFAULT '["colonaive"]';
ALTER TABLE ceo_events ALTER COLUMN source_system TYPE jsonb USING to_jsonb(ARRAY[source_system]);

-- Same for predictions
ALTER TABLE ceo_predictions DROP CONSTRAINT IF EXISTS ceo_predictions_source_system_check;
ALTER TABLE ceo_predictions ALTER COLUMN source_system SET DEFAULT '["colonaive"]';
ALTER TABLE ceo_predictions ALTER COLUMN source_system TYPE jsonb USING to_jsonb(ARRAY[source_system]);
