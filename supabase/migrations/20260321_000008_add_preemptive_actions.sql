-- CTW-COCKPIT-02D.9: Add pre-emptive action columns to ceo_predictions
ALTER TABLE ceo_predictions
  ADD COLUMN IF NOT EXISTS recommended_action text,
  ADD COLUMN IF NOT EXISTS action_generated_at timestamptz;
