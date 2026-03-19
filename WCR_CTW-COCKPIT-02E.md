# WCR — CTW-COCKPIT-02E: Cross-Project Intelligence

**Window:** CTW-COCKPIT-02E
**Status:** CLOSED
**Date:** 2026-03-20
**Branch:** main

---

## Objective

Upgrade the CEO Cockpit from single-project (COLONAiVE-only) intelligence to cross-project intelligence spanning all four founder projects: COLONAiVE, Durmah.ai, ScienceHOD, and SG Renovate AI.

---

## What Was Built

### 1. Project Signal Model (`src/lib/projectSignals.ts`)

New module providing:

- **`ProjectSignal`** type — individual signal with id, title, description, type (risk/opportunity/blocker/milestone/info), severity (critical/high/medium/low)
- **`ProjectIntelligence`** type — per-project aggregate with signals, risks, opportunities, and urgency_score
- **`GlobalPriority`** type — cross-project ranked priority item
- **`CrossProjectBriefing`** type — full briefing output

Four project signal sources:
- `getColonAiVESignals()` — HSA renewal, India CDSCO, Angsana validation, KTPH study, Philippines GTM, cockpit status
- `getDurmahSignals()` — DCI stability, login routes, Resend SMTP, LNAT funnel, entity name
- `getScienceHODSignals()` — revenue pipeline, content engine
- `getSGRenovateSignals()` — v3 routing, market wedge, escrow architecture

### 2. Signal Aggregation Engine

`aggregateAllSignals()` — combines all four project signal sources into a unified array of `ProjectIntelligence` objects. Each project gets an urgency score computed from:
- Severity weights (critical=40, high=25, medium=12, low=5)
- Type weights (blocker=35, risk=25, opportunity=15, milestone=10, info=3)
- Critical/high risk boosters

### 3. Cross-Project Prioritization

`getGlobalPriorities(limit)` — extracts actionable signals (risks, blockers, high-severity opportunities) from all projects, scores them by urgency + impact + project urgency, and returns the top N ranked globally.

### 4. Founder Briefing Extension

`generateCrossProjectBriefing()` — produces a full `CrossProjectBriefing` with:
- Top project identification with reason
- Focus shift advice based on urgency gap analysis
- Global priorities ranked across all projects
- Per-project summaries

Extended `generateFounderBriefing()` in `founderBriefing.ts`:
- Added `crossProjectIntelligence` field to `FounderBriefing` interface
- Executive summary now includes cross-project focus leader
- Cross-project briefing generated alongside existing radar/competitive intelligence

### 5. UI Integration (CEOCockpit.tsx)

New "Global Intelligence" section added between Founder Intelligence and Chief-of-Staff sections:

- **Top Project Banner** — highlights which project needs attention now, with reason
- **Focus Shift Advice** — urgency-gap-based recommendation on how to split attention
- **Top Cross-Project Actions** — ranked priorities with score badges and colour-coded project tags
- **Portfolio Health** — per-project urgency bars with signal/risk/opportunity counts

Colour scheme per project:
- COLONAiVE: teal
- Durmah: blue
- ScienceHOD: purple
- SG Renovate: orange

---

## Guardrails Maintained

- Existing cockpit sections untouched — no breaking changes
- No hard-selling logic introduced
- COLONAiVE doctrine preserved (IFU guardrails, clinical claims language)
- System is fully explainable — rule-based scoring with visible weights, no black box
- All cross-project intelligence is supplementary (silent fail on error)

---

## Files Changed

| File | Action |
|------|--------|
| `src/lib/projectSignals.ts` | **NEW** — Cross-project signal model, aggregation, prioritisation, briefing |
| `src/lib/founderBriefing.ts` | MODIFIED — Added crossProjectIntelligence to briefing output |
| `src/pages/admin/CEOCockpit.tsx` | MODIFIED — Added Global Intelligence section UI |

---

## Deployment

- Build: `npm run build` — passed
- Pushed to `main` — Netlify auto-deploy triggered
- Production: https://colonaive.com

---

## Future Iterations

- Replace static project signals with live Supabase queries per project
- Add cross-project decision memory (which project gets attention correlates with outcomes)
- Enable real-time signal injection from Durmah/ScienceHOD/SGRenovate backends
- Add bandwidth allocation tracking against 60/25/15 target split
