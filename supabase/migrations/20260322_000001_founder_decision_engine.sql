-- AG-FOUNDER-BRIEF-02: Founder Decision Engine
-- Adds tracked_entities table for operational watch items (shipments, regulatory, etc.)

-- Tracked Entities — state-aware operational items the founder needs to monitor
CREATE TABLE IF NOT EXISTS tracked_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('shipment', 'regulatory', 'reply_expected', 'dependency', 'milestone', 'custom')),
  entity_key TEXT,                        -- e.g. tracking number, submission reference
  title TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'created',  -- e.g. created, dispatched, customs_hold, customs_cleared, delivered
  state_updated_at TIMESTAMPTZ DEFAULT now(),
  source_type TEXT DEFAULT 'manual',      -- manual, email, system
  source_ref TEXT,                        -- reference to source (email ID, etc.)
  owner_project TEXT DEFAULT 'colonaive',
  stakeholder_names TEXT[],               -- who needs updates
  expected_next_state TEXT,               -- what state we expect next
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  requires_update_to TEXT,                -- stakeholder who needs an update
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for active entity queries
CREATE INDEX IF NOT EXISTS idx_tracked_entities_active ON tracked_entities (is_active, state_updated_at);
CREATE INDEX IF NOT EXISTS idx_tracked_entities_type ON tracked_entities (entity_type, is_active);

-- Enable RLS
ALTER TABLE tracked_entities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (admin-only table)
CREATE POLICY "Admin access to tracked_entities"
  ON tracked_entities FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
