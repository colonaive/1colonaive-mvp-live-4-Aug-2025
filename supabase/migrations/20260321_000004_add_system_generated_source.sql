-- CTW-COCKPIT-02D.5 — Self-Referential Noise Filter

-- Add system_generated to source_origin enum
ALTER TABLE ceo_emails DROP CONSTRAINT IF EXISTS ceo_emails_source_origin_check;
ALTER TABLE ceo_emails ADD CONSTRAINT ceo_emails_source_origin_check
  CHECK (source_origin IN ('direct_email', 'manual_entry', 'inferred_ai', 'system_generated'));

-- Add is_system flag
ALTER TABLE ceo_emails ADD COLUMN IF NOT EXISTS is_system boolean NOT NULL DEFAULT false;

-- Mark existing system emails
UPDATE ceo_emails
SET classification = 'ignore',
    source_origin = 'system_generated',
    is_system = true,
    classification_reason = 'System-generated email (self-referential noise filter)'
WHERE sender_email LIKE '%@colonaive.ai'
   OR sender_email LIKE '%@durmah.ai'
   OR sender_name ILIKE '%Founder Intelligence%'
   OR subject ILIKE '%Daily Executive Briefing%'
   OR subject ILIKE '%Founder Brief%';

-- Delete tasks/risks from system emails
DELETE FROM ceo_tasks WHERE source_id IN (
  SELECT id FROM ceo_emails WHERE is_system = true
);
DELETE FROM ceo_risks WHERE source_id IN (
  SELECT id FROM ceo_emails WHERE is_system = true
);

-- Index
CREATE INDEX IF NOT EXISTS idx_ceo_emails_is_system ON ceo_emails (is_system);
