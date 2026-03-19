# WCR — CTW-COCKPIT-02D: Decision Loop Engine

**Window:** CTW-COCKPIT-02D
**Status:** CLOSED
**Date:** 2026-03-19
**Commit:** 35164a3

---

## Objective

Upgrade the CEO Cockpit from action recommendation to action learning. Track founder decisions on recommended actions, learn from behaviour patterns, and surface a founder behaviour profile.

---

## Database Schema

### Table: `ceo_action_history`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, gen_random_uuid() |
| action_text | TEXT | NOT NULL |
| source | TEXT | CHECK: radar, early_warning, strategy, email, manual, linkedin, task |
| priority_score | INTEGER | 0-100 |
| status | TEXT | CHECK: suggested, accepted, ignored, completed |
| outcome | TEXT | CHECK: success, partial, failed, unknown (nullable) |
| source_action_id | TEXT | Nullable reference |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | Auto-updated via trigger |

**Indexes:** status, source, created_at DESC, priority_score DESC
**RLS:** Public read, authenticated insert/update
**Migration:** `20260319_000001_create_ceo_action_history.sql` (applied to production)

---

## Functions Created

### `src/lib/actionFeedback.ts`

| Function | Purpose |
|----------|---------|
| `trackAction(text, source, score, sourceId?)` | Insert suggested action into history |
| `markActionAccepted(id)` | Update status to accepted |
| `markActionIgnored(id)` | Update status to ignored |
| `markActionCompleted(id, outcome)` | Update status to completed with outcome |
| `getActionHistory(limit)` | Fetch recent action history |
| `getAdjustedPriorityScore(rawScore, source, text)` | Learning layer: adjust score based on historical patterns |
| `getFounderProfile()` | Build founder behaviour profile from history |

---

## Learning Layer (V1 — Rule-Based)

`getAdjustedPriorityScore` adjusts raw priority scores using:

1. **Source acceptance ratio:** If >60% of actions from this source were accepted/completed, boost +10. If >40%, boost +5. If >60% ignored, reduce -10. If >40% ignored, reduce -5.
2. **Success bonus:** If source has >3 successful completions, boost +5.
3. **Keyword similarity:** If 3+ significant words match previously accepted action texts, boost +5. If 1+, boost +2.

No ML model — pure rule-based adjustments bounded to 0-100.

---

## Founder Behaviour Profile

`getFounderProfile()` returns:

- **totalActions** — count of tracked actions
- **acceptedPercent** — % of actions accepted
- **completedPercent** — % of actions completed
- **ignoredPercent** — % of actions ignored
- **preferredSources** — ranked list of sources the founder acts on most
- **avgCompletionScore** — average priority score of completed actions
- **successRate** — % of outcomes that were successful

---

## UI Changes

### CEOCockpit.tsx — Founder Intelligence Section

1. **Recommended Next Moves cards** now include:
   - Accept button (green) — marks action as accepted
   - Ignore button (gray) — marks action as ignored
   - Complete button (blue, appears after Accept) — marks action as completed with success
   - Status labels: Accepted, Completed, Ignored
   - Visual state: accepted = green border, completed = blue border, ignored = dimmed

2. **Founder Behaviour Profile widget** added below recommended actions:
   - Total Actions, Accepted %, Completed %, Success Rate
   - Preferred sources with counts
   - Purple gradient background, grid layout

3. **Auto-tracking:** When briefing loads, recommended actions are automatically inserted into `ceo_action_history` with status `suggested`.

---

## Verification

- [x] Build passes: `npm run build` — zero errors
- [x] Typecheck passes: functions + frontend
- [x] Migration applied to production Supabase
- [x] Committed and pushed to main (triggers Netlify deploy)
- [ ] Production QA: verify action buttons appear on cockpit
- [ ] Production QA: verify status updates persist in Supabase
- [ ] Production QA: verify founder profile populates after actions taken
