# WCR — CTW-COCKPIT-02F: Proactive Intelligence Engine

**Window:** CTW-COCKPIT-02F
**Status:** CLOSED
**Date:** 2026-03-20
**Branch:** main

---

## Objective

Upgrade the CEO Cockpit from passive intelligence display to proactive founder nudging — detecting overdue actions, ignored high-priority signals, stale opportunities, and unaddressed risks, then surfacing them as actionable nudges with suppression logic.

---

## What Was Built

### 1. Proactive Engine (`src/lib/proactiveEngine.ts`)

**Nudge Detection — four signal types:**

| Type | Trigger | Severity |
|------|---------|----------|
| `overdue` | Accepted action not completed after 72h | urgent (>7d) / attention |
| `ignored` | Ignored action with priority score >= 70 | urgent (>=85) / attention |
| `stale` | Suggested action with score >= 50, no activity for 72h | info |
| `risk` | Cross-project priority (from 02E) with score >= 70 | urgent (>=85) / attention |

**Suppression Logic:**
- Each nudge gets a unique ID based on type + source
- Once shown, a nudge is suppressed for 24 hours (in-memory tracking)
- `dismissNudge(id)` allows manual suppression from UI
- Low-priority signals (score < 50) are excluded
- Maximum 5 nudges displayed at any time

**Time Intelligence — `getTodayFocus()`:**
- Top 3 global priorities (from 02E cross-project engine)
- Active proactive nudges (max 5, sorted by severity)
- Upcoming action count (accepted actions in last 48h)

### 2. Today's Focus Panel (CEOCockpit.tsx)

New top-of-cockpit section — first thing the founder sees:

**Top Priorities Row:**
- 3-column card grid showing the highest-scoring global priorities
- Each card shows rank badge (colour-coded: red #1, amber #2, grey #3), project tag, title, and reason snippet

**Proactive Nudges:**
- Colour-coded nudge cards:
  - Red = urgent (overdue >7d, ignored score >=85, cross-project risk >=85)
  - Amber = attention needed
  - Grey = informational
- Each nudge shows: severity dot, message, recommended action
- Dismiss button (X) suppresses nudge for 24h

**Footer Stats:**
- Active nudge count
- Upcoming action count (48h window)

---

## Suppression Rules

1. **No repeat within 24h** — once shown or dismissed, same nudge won't reappear for 24 hours
2. **No low-priority signals** — only actions with score >= 50 generate stale nudges
3. **Max 5 visible** — sorted by severity (urgent → attention → info), excess trimmed
4. **Severity-first ordering** — urgent items always appear before informational ones

---

## Integration Points

| System | Integration |
|--------|------------|
| Action History (02D) | Queries `ceo_action_history` for overdue/ignored/stale detection |
| Cross-Project Intelligence (02E) | Uses `getGlobalPriorities()` for risk detection and top priorities |
| Decision Loop (02D) | Reads action statuses (accepted, ignored, suggested, completed) |
| Cockpit UI | New section at top of dashboard, before Action Center |

---

## Files Changed

| File | Action |
|------|--------|
| `src/lib/proactiveEngine.ts` | **NEW** — Nudge detection, suppression, time intelligence |
| `src/pages/admin/CEOCockpit.tsx` | MODIFIED — Added Today's Focus panel at top of cockpit |

---

## Deployment

- Build: `npm run build` — passed
- Pushed to `main` — Netlify auto-deploy triggered
- Production: https://colonaive.com

---

## Future Iterations

- Persist suppression state in Supabase (currently in-memory, resets on page reload)
- Add nudge analytics (which nudges lead to action vs dismissal)
- Email/notification delivery for urgent nudges when founder isn't in cockpit
- Time-of-day awareness (morning briefing vs evening wrap-up nudge tone)
- Integration with calendar for deadline-aware nudging
