-- Email Intelligence tables for CEO Cockpit
-- CTW-COCKPIT-02D.1 — Email Intelligence → Founder Brief Fix

-- ceo_emails: Ingested emails with classification
CREATE TABLE IF NOT EXISTS ceo_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  graph_id text UNIQUE,
  sender_name text,
  sender_email text,
  subject text NOT NULL,
  body_preview text,
  received_at timestamptz NOT NULL,
  is_read boolean DEFAULT false,
  classification text NOT NULL DEFAULT 'unclassified'
    CHECK (classification IN ('take_action', 'investigate', 'informational', 'ignore', 'unclassified')),
  classification_reason text,
  keyword_matches text[] DEFAULT '{}',
  ingested_at timestamptz DEFAULT now()
);

-- ceo_tasks: Extracted tasks from emails and other sources
CREATE TABLE IF NOT EXISTS ceo_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type text NOT NULL DEFAULT 'email'
    CHECK (source_type IN ('email', 'radar', 'manual', 'system')),
  source_id uuid,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'done', 'dismissed')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ceo_risks: Extracted risks from emails and intelligence
CREATE TABLE IF NOT EXISTS ceo_risks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type text NOT NULL DEFAULT 'email'
    CHECK (source_type IN ('email', 'radar', 'early_warning', 'manual')),
  source_id uuid,
  title text NOT NULL,
  description text,
  severity text NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'mitigated', 'resolved', 'accepted')),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ceo_emails_classification ON ceo_emails (classification);
CREATE INDEX IF NOT EXISTS idx_ceo_emails_received_at ON ceo_emails (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_ceo_emails_graph_id ON ceo_emails (graph_id);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_priority ON ceo_tasks (priority);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_status ON ceo_tasks (status);
CREATE INDEX IF NOT EXISTS idx_ceo_risks_severity ON ceo_risks (severity);
CREATE INDEX IF NOT EXISTS idx_ceo_risks_status ON ceo_risks (status);
