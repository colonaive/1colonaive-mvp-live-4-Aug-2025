-- Competitive Intelligence Radar tables

-- Competitor entities
CREATE TABLE IF NOT EXISTS public.competitor_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ticker TEXT,
  technology TEXT,
  products TEXT,
  headquarters TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_competitor_entities_name ON public.competitor_entities (name);

-- Competitor signals
CREATE TABLE IF NOT EXISTS public.competitor_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.competitor_entities(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  source_link TEXT,
  signal_score INTEGER DEFAULT 0,
  signal_type TEXT DEFAULT 'news',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_competitor_signals_score ON public.competitor_signals (signal_score DESC);
CREATE INDEX IF NOT EXISTS idx_competitor_signals_company ON public.competitor_signals (company_name);

-- Technology trends
CREATE TABLE IF NOT EXISTS public.technology_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trend_name TEXT NOT NULL,
  trend_score INTEGER DEFAULT 0,
  description TEXT,
  evidence_count INTEGER DEFAULT 1,
  first_detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_technology_trends_name ON public.technology_trends (trend_name);

-- Early warning signals
CREATE TABLE IF NOT EXISTS public.early_warning_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_link TEXT,
  pubmed_id TEXT,
  confidence_score INTEGER DEFAULT 50,
  signal_category TEXT DEFAULT 'research',
  analysis TEXT,
  market_implication TEXT,
  recommended_action TEXT,
  in_media BOOLEAN DEFAULT false,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_early_warning_confidence ON public.early_warning_signals (confidence_score DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_early_warning_link ON public.early_warning_signals (source_link);

-- Strategy implications
CREATE TABLE IF NOT EXISTS public.strategy_implications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID,
  signal_title TEXT NOT NULL,
  analysis TEXT,
  market_implication TEXT,
  recommended_action TEXT,
  priority TEXT DEFAULT 'monitor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS policies
ALTER TABLE public.competitor_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technology_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.early_warning_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategy_implications ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read competitor_entities" ON public.competitor_entities FOR SELECT USING (true);
CREATE POLICY "Public read competitor_signals" ON public.competitor_signals FOR SELECT USING (true);
CREATE POLICY "Public read technology_trends" ON public.technology_trends FOR SELECT USING (true);
CREATE POLICY "Public read early_warning_signals" ON public.early_warning_signals FOR SELECT USING (true);
CREATE POLICY "Public read strategy_implications" ON public.strategy_implications FOR SELECT USING (true);

-- Authenticated write
CREATE POLICY "Auth insert competitor_entities" ON public.competitor_entities FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update competitor_entities" ON public.competitor_entities FOR UPDATE USING (true);
CREATE POLICY "Auth insert competitor_signals" ON public.competitor_signals FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update competitor_signals" ON public.competitor_signals FOR UPDATE USING (true);
CREATE POLICY "Auth insert technology_trends" ON public.technology_trends FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update technology_trends" ON public.technology_trends FOR UPDATE USING (true);
CREATE POLICY "Auth insert early_warning_signals" ON public.early_warning_signals FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update early_warning_signals" ON public.early_warning_signals FOR UPDATE USING (true);
CREATE POLICY "Auth insert strategy_implications" ON public.strategy_implications FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update strategy_implications" ON public.strategy_implications FOR UPDATE USING (true);

-- Seed competitor entities
INSERT INTO public.competitor_entities (name, ticker, technology, products, headquarters) VALUES
  ('Guardant Health', 'GH', 'Liquid biopsy, ctDNA', 'Guardant360, Shield', 'Redwood City, CA'),
  ('Exact Sciences', 'EXAS', 'Stool DNA + FIT', 'Cologuard, Oncotype DX', 'Madison, WI'),
  ('Freenome', NULL, 'Multiomics blood test', 'Freenome CRC screening (development)', 'South San Francisco, CA'),
  ('Grail (Illumina)', NULL, 'cfDNA methylation', 'Galleri (multi-cancer)', 'Menlo Park, CA'),
  ('Delfi Diagnostics', NULL, 'Fragmentomics', 'FirstLook Lung, CRC (development)', 'Baltimore, MD'),
  ('Natera', 'NTRA', 'ctDNA, SNP-based', 'Signatera (MRD monitoring)', 'Austin, TX')
ON CONFLICT (name) DO NOTHING;
