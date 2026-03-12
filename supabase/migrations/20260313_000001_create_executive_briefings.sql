-- Executive Briefings table for CEO Cockpit Daily Briefing
CREATE TABLE IF NOT EXISTS public.executive_briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  content TEXT NOT NULL,
  sections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for fast lookup by date (latest first)
CREATE INDEX IF NOT EXISTS idx_executive_briefings_date
  ON public.executive_briefings (date DESC, created_at DESC);

-- Unique constraint: one briefing per date
CREATE UNIQUE INDEX IF NOT EXISTS idx_executive_briefings_unique_date
  ON public.executive_briefings (date);

-- RLS
ALTER TABLE public.executive_briefings ENABLE ROW LEVEL SECURITY;

-- Public read access (cockpit is already behind admin auth)
CREATE POLICY "Allow public read access to executive_briefings"
  ON public.executive_briefings FOR SELECT USING (true);

-- Authenticated insert/update (from Netlify functions via service role)
CREATE POLICY "Allow authenticated insert to executive_briefings"
  ON public.executive_briefings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update to executive_briefings"
  ON public.executive_briefings FOR UPDATE USING (true);
