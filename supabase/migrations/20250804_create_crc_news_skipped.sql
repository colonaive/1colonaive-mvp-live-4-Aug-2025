-- Migration: Create CRC News Skipped Articles Table
-- Description: Create table to log skipped articles for admin review and feed quality monitoring
-- Date: 2025-08-04

-- Create the crc_news_skipped table
CREATE TABLE IF NOT EXISTS public.crc_news_skipped (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    link TEXT,
    source TEXT NOT NULL,
    skip_reason TEXT NOT NULL,
    raw_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_crc_news_skipped_created_at ON public.crc_news_skipped(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crc_news_skipped_source ON public.crc_news_skipped(source);
CREATE INDEX IF NOT EXISTS idx_crc_news_skipped_skip_reason ON public.crc_news_skipped(skip_reason);

-- Enable Row Level Security
ALTER TABLE public.crc_news_skipped ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access for admin functionality
CREATE POLICY "Allow public read access to skipped articles" ON public.crc_news_skipped
    FOR SELECT USING (true);

-- Allow service role to insert skipped articles
CREATE POLICY "Allow service role to insert skipped articles" ON public.crc_news_skipped
    FOR INSERT TO service_role WITH CHECK (true);

-- Allow authenticated users (admins) to read skipped articles  
CREATE POLICY "Allow authenticated users to read skipped articles" ON public.crc_news_skipped
    FOR SELECT TO authenticated USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.crc_news_skipped TO anon;
GRANT SELECT ON public.crc_news_skipped TO authenticated;
GRANT ALL ON public.crc_news_skipped TO service_role;

-- Add comment for documentation
COMMENT ON TABLE public.crc_news_skipped IS 'Stores articles that were skipped during RSS feed processing for admin review and feed quality monitoring';
COMMENT ON COLUMN public.crc_news_skipped.title IS 'Article title (may be null if not available)';
COMMENT ON COLUMN public.crc_news_skipped.link IS 'Article URL (may be null if not available)';
COMMENT ON COLUMN public.crc_news_skipped.source IS 'RSS feed source name';
COMMENT ON COLUMN public.crc_news_skipped.skip_reason IS 'Reason why article was skipped (validation failure, etc.)';
COMMENT ON COLUMN public.crc_news_skipped.raw_content IS 'Raw RSS item data for debugging (truncated)';
COMMENT ON COLUMN public.crc_news_skipped.created_at IS 'Timestamp when article was skipped';