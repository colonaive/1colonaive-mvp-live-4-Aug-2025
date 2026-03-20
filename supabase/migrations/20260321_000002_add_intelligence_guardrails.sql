-- CTW-COCKPIT-02D.3 — Intelligence Guardrail Layer

-- Add source_origin to ceo_emails
ALTER TABLE ceo_emails
  ADD COLUMN IF NOT EXISTS source_origin text NOT NULL DEFAULT 'direct_email'
    CHECK (source_origin IN ('direct_email', 'manual_entry', 'inferred_ai')),
  ADD COLUMN IF NOT EXISTS confidence_level text NOT NULL DEFAULT 'high'
    CHECK (confidence_level IN ('high', 'medium', 'low'));

-- Add source_origin to ceo_tasks
ALTER TABLE ceo_tasks
  ADD COLUMN IF NOT EXISTS source_origin text NOT NULL DEFAULT 'direct_email'
    CHECK (source_origin IN ('direct_email', 'manual_entry', 'inferred_ai')),
  ADD COLUMN IF NOT EXISTS confidence_level text NOT NULL DEFAULT 'high'
    CHECK (confidence_level IN ('high', 'medium', 'low'));

-- Add source_origin to ceo_risks
ALTER TABLE ceo_risks
  ADD COLUMN IF NOT EXISTS source_origin text NOT NULL DEFAULT 'direct_email'
    CHECK (source_origin IN ('direct_email', 'manual_entry', 'inferred_ai')),
  ADD COLUMN IF NOT EXISTS confidence_level text NOT NULL DEFAULT 'high'
    CHECK (confidence_level IN ('high', 'medium', 'low'));

-- Verified Facts table — overrides AI inference
CREATE TABLE IF NOT EXISTS ceo_verified_facts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  entity text NOT NULL UNIQUE,
  correct_definition text NOT NULL,
  source text NOT NULL DEFAULT 'manual',
  verified_by text DEFAULT 'founder',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed verified facts for known entities
INSERT INTO ceo_verified_facts (entity, correct_definition, source) VALUES
  ('SCRS', 'Singapore Cancer Registry Society', 'master_brain'),
  ('SMILES', 'SMILES Multi-Centre Study', 'master_brain'),
  ('KTPH', 'Khoo Teck Puat Hospital', 'master_brain'),
  ('HSA', 'Health Sciences Authority (Singapore)', 'master_brain'),
  ('CDSCO', 'Central Drugs Standard Control Organisation (India)', 'master_brain'),
  ('NMPA', 'National Medical Products Administration (China)', 'master_brain'),
  ('ColonAiQ', 'Blood-based colorectal cancer screening test by Singlera Genomics', 'master_brain'),
  ('COLONAiVE', 'National CRC screening movement for Singapore', 'master_brain'),
  ('IVDR', 'In Vitro Diagnostic Regulation (EU)', 'master_brain'),
  ('IVDD', 'In Vitro Diagnostic Directive (EU, legacy)', 'master_brain'),
  ('CRC', 'Colorectal Cancer', 'master_brain'),
  ('FCA', 'Free Carrier (Incoterms)', 'master_brain'),
  ('EXW', 'Ex Works (Incoterms)', 'master_brain')
ON CONFLICT (entity) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ceo_verified_facts_entity ON ceo_verified_facts (entity);
CREATE INDEX IF NOT EXISTS idx_ceo_emails_source_origin ON ceo_emails (source_origin);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_source_origin ON ceo_tasks (source_origin);
CREATE INDEX IF NOT EXISTS idx_ceo_risks_source_origin ON ceo_risks (source_origin);
