-- CEO Decision Memory table
-- Records action patterns from the CEO Action Center for proactive suggestions.

CREATE TABLE IF NOT EXISTS public.ceo_decision_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  entity TEXT,
  context_summary TEXT,
  outcome TEXT DEFAULT 'completed',
  confidence_score INTEGER DEFAULT 50,
  frequency INTEGER DEFAULT 1,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_decision_memory_action ON public.ceo_decision_memory (action_type);
CREATE INDEX IF NOT EXISTS idx_decision_memory_entity ON public.ceo_decision_memory (entity);
CREATE INDEX IF NOT EXISTS idx_decision_memory_score ON public.ceo_decision_memory (confidence_score DESC);

ALTER TABLE public.ceo_decision_memory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ceo_decision_memory" ON public.ceo_decision_memory FOR SELECT USING (true);
CREATE POLICY "Auth write ceo_decision_memory" ON public.ceo_decision_memory FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update ceo_decision_memory" ON public.ceo_decision_memory FOR UPDATE USING (true);
