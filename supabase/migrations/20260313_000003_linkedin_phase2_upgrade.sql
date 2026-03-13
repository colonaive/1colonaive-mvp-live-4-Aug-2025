-- LinkedIn Intelligence Phase 2 — Publishing Engine upgrade

-- Add image and LinkedIn URL columns to linkedin_posts
ALTER TABLE linkedin_posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE linkedin_posts ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Performance tracking table
CREATE TABLE IF NOT EXISTS linkedin_post_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES linkedin_posts(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  last_checked TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id)
);

ALTER TABLE linkedin_post_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON linkedin_post_performance
  FOR ALL USING (true) WITH CHECK (true);
