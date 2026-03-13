-- CEO Chat Transcripts table
-- Stores Action Center conversations for persistence and audit
CREATE TABLE IF NOT EXISTS ceo_chat_transcripts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp timestamptz DEFAULT now(),
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary text,
  context_tags text[] DEFAULT '{}',
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Email Activity table
-- Tracks emails drafted, sent, and received through the cockpit
CREATE TABLE IF NOT EXISTS email_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  direction text NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  to_address text,
  cc_address text,
  subject text NOT NULL,
  body text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'sent', 'failed', 'received')),
  context_source text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_ceo_chat_transcripts_archived ON ceo_chat_transcripts (archived);
CREATE INDEX IF NOT EXISTS idx_email_activity_status ON email_activity (status);
CREATE INDEX IF NOT EXISTS idx_email_activity_created_at ON email_activity (created_at DESC);
