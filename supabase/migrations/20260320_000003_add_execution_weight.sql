-- CTW-COCKPIT-03B.1: Execution Weight Upgrade
-- Adds execution_weight (0–20) to scoring formula, raises total_score max to 120

ALTER TABLE public.ceo_contacts ADD COLUMN IF NOT EXISTS execution_weight INTEGER NOT NULL DEFAULT 0 CHECK (execution_weight >= 0 AND execution_weight <= 20);

-- Raise total_score ceiling from 100 to 120
ALTER TABLE public.ceo_contacts DROP CONSTRAINT IF EXISTS ceo_contacts_total_score_check;
ALTER TABLE public.ceo_contacts ADD CONSTRAINT ceo_contacts_total_score_check CHECK (total_score >= 0 AND total_score <= 120);
