-- CTW-COCKPIT-03B: Relationship Priority Engine
-- ceo_contacts table with deterministic scoring fields

CREATE TABLE IF NOT EXISTS public.ceo_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organisation TEXT,
  role TEXT NOT NULL DEFAULT 'other' CHECK (role IN ('investor', 'regulator', 'kol', 'clinician', 'partner', 'corporate', 'government', 'academic', 'other')),
  project_tags TEXT[] NOT NULL DEFAULT '{}',
  last_interaction_at TIMESTAMPTZ,
  responsiveness_score INTEGER NOT NULL DEFAULT 0 CHECK (responsiveness_score >= 0 AND responsiveness_score <= 20),
  strategic_value_score INTEGER NOT NULL DEFAULT 0 CHECK (strategic_value_score >= 0 AND strategic_value_score <= 40),
  recency_score INTEGER NOT NULL DEFAULT 0 CHECK (recency_score >= 0 AND recency_score <= 15),
  momentum_score INTEGER NOT NULL DEFAULT 0 CHECK (momentum_score >= 0 AND momentum_score <= 15),
  cross_project_score INTEGER NOT NULL DEFAULT 0 CHECK (cross_project_score >= 0 AND cross_project_score <= 10),
  total_score INTEGER NOT NULL DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 100),
  priority_level TEXT NOT NULL DEFAULT 'passive' CHECK (priority_level IN ('critical', 'active', 'warm', 'passive')),
  follow_up_action TEXT CHECK (follow_up_action IN ('follow_up', 'nurture', 'convert', 'hold')),
  follow_up_message_type TEXT CHECK (follow_up_message_type IN ('strategic', 'update', 'ask', 'relationship')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ceo_contacts_total_score ON public.ceo_contacts(total_score DESC);
CREATE INDEX idx_ceo_contacts_priority_level ON public.ceo_contacts(priority_level);
CREATE INDEX idx_ceo_contacts_project_tags ON public.ceo_contacts USING GIN(project_tags);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_ceo_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ceo_contacts_updated_at
  BEFORE UPDATE ON public.ceo_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_ceo_contacts_updated_at();

-- RLS
ALTER TABLE public.ceo_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to ceo_contacts"
  ON public.ceo_contacts FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert to ceo_contacts"
  ON public.ceo_contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update to ceo_contacts"
  ON public.ceo_contacts FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete from ceo_contacts"
  ON public.ceo_contacts FOR DELETE USING (true);
