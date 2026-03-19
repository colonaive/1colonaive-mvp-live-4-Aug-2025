-- CEO Action History — CTW-COCKPIT-02D Decision Loop Engine
CREATE TABLE IF NOT EXISTS public.ceo_action_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('radar', 'early_warning', 'strategy', 'email', 'manual', 'linkedin', 'task')),
  priority_score INTEGER NOT NULL DEFAULT 50 CHECK (priority_score >= 0 AND priority_score <= 100),
  status TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'accepted', 'ignored', 'completed')),
  outcome TEXT CHECK (outcome IN ('success', 'partial', 'failed', 'unknown')),
  source_action_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_ceo_action_history_status ON public.ceo_action_history(status);
CREATE INDEX IF NOT EXISTS idx_ceo_action_history_source ON public.ceo_action_history(source);
CREATE INDEX IF NOT EXISTS idx_ceo_action_history_created ON public.ceo_action_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ceo_action_history_priority ON public.ceo_action_history(priority_score DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_ceo_action_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ceo_action_history_updated_at
  BEFORE UPDATE ON public.ceo_action_history
  FOR EACH ROW
  EXECUTE FUNCTION update_ceo_action_history_updated_at();

-- RLS
ALTER TABLE public.ceo_action_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on ceo_action_history"
  ON public.ceo_action_history FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on ceo_action_history"
  ON public.ceo_action_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on ceo_action_history"
  ON public.ceo_action_history FOR UPDATE
  USING (true)
  WITH CHECK (true);
