-- CTW-COCKPIT-02D.4 — Verified Facts Correction

-- Add linked_to and is_locked columns
ALTER TABLE ceo_verified_facts
  ADD COLUMN IF NOT EXISTS linked_to text,
  ADD COLUMN IF NOT EXISTS is_locked boolean NOT NULL DEFAULT false;

-- Correct SCRS definition
UPDATE ceo_verified_facts
SET correct_definition = 'Society of Colorectal Surgeons (Singapore)',
    source = 'founder_verified',
    is_locked = true,
    updated_at = now()
WHERE entity = 'SCRS';

-- Update SMILES with linked_to and founder_verified
UPDATE ceo_verified_facts
SET source = 'founder_verified',
    linked_to = 'Dr Parameswara',
    is_locked = true,
    updated_at = now()
WHERE entity = 'SMILES';

-- Lock all master_brain entries (founder-level protection)
UPDATE ceo_verified_facts
SET is_locked = true
WHERE source = 'master_brain';
