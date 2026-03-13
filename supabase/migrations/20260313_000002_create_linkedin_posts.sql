-- LinkedIn Post Intelligence table
-- Stores AI-generated LinkedIn post drafts from CRC news articles

CREATE TABLE IF NOT EXISTS linkedin_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  draft_content TEXT,
  hashtags TEXT,
  image_prompt TEXT,
  colonaiq_context BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'draft', 'posted')),
  relevance_score INTEGER,
  source_name TEXT,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for dedup lookups
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_source_url ON linkedin_posts (source_url);
-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_status ON linkedin_posts (status);
-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_created_at ON linkedin_posts (created_at DESC);

-- RLS
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (Netlify functions use service role key)
CREATE POLICY "Service role full access" ON linkedin_posts
  FOR ALL USING (true) WITH CHECK (true);
