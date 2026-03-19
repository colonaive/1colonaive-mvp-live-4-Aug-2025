# WCR — CTW-COCKPIT-03A: LinkedIn Relationship Intelligence Layer

**Window:** CTW-COCKPIT-03A
**Status:** COMPLETE
**Date:** 2026-03-20
**Commit:** 85706ac

---

## Objective

Build a LinkedIn Relationship Intelligence System — manual-input, AI-assisted message drafts, compliance-safe (no auto-sending, no scraping).

---

## What Was Built

### 1. Database Schema (Supabase Migration)

**Table: `linkedin_contacts`**
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | auto-generated |
| name | TEXT | required |
| role | TEXT | professor / investor / clinician / regulator / partner / other |
| organisation | TEXT | nullable |
| project | TEXT | colonaive / durmah / sciencehod / sgrenovate |
| status | TEXT | new / contacted / replied / warm / advisor / inactive |
| last_contact_date | TIMESTAMPTZ | auto-updated on activity log |
| next_followup_date | TIMESTAMPTZ | used by follow-up engine |
| notes | TEXT | free-form, supports paste |
| created_at | TIMESTAMPTZ | auto |
| updated_at | TIMESTAMPTZ | auto via trigger |

**Table: `linkedin_activity_log`**
| Field | Type | Notes |
|---|---|---|
| id | UUID PK | auto-generated |
| contact_id | UUID FK | cascading delete |
| activity_type | TEXT | connect / message / reply / followup / meeting |
| summary | TEXT | nullable |
| created_at | TIMESTAMPTZ | auto |

- RLS enabled on both tables (authenticated users only)
- `updated_at` trigger on contacts
- Indexes on project, status, next_followup_date, contact_id

### 2. LinkedIn Engine (`src/lib/linkedinEngine.ts`)

**Contact CRUD:**
- `createContact()`, `updateContact()`, `deleteContact()`, `fetchContacts(filters)`
- `fetchContactWithActivities(id)` — returns contact + activity history

**Activity Logging:**
- `logActivity(contact_id, type, summary)` — logs activity and updates last_contact_date

**Follow-up Engine:**
- `getUpcomingFollowups(days)` — contacts with follow-ups in next N days
- `getOverdueFollowups()` — contacts past their follow-up date
- `scheduleFollowup(contact_id, date)` — set next follow-up

**High-Value Contacts:**
- `getHighValueContacts()` — warm + advisor status contacts

**Message Draft Engine:**
- `generateLinkedInMessage(contact, messageType, context?)` — generates draft text
- Types: first_outreach, follow_up, reminder_after_delay, advisory_board_invitation
- Returns draft only — no sending capability

**Stats:**
- `getRelationshipStats()` — totals, overdue, upcoming, high-value, by-project, by-status

### 3. Proactive Engine Integration (`src/lib/proactiveEngine.ts`)

Three new nudge types added:
- `linkedin_overdue` — overdue follow-ups (urgent after 7d)
- `linkedin_followup` — upcoming follow-ups in next 3 days (info)
- `linkedin_warm` — warm/advisor contacts not contacted in 14+ days (urgent after 30d)

All integrated into `generateProactiveSignals()` with suppression logic.

### 4. Relationship Intelligence Page (`src/pages/admin/RelationshipIntelligence.tsx`)

Full-page UI at `/admin/relationship-intelligence`:
- Stats strip: total contacts, overdue, upcoming, high-value
- Sections: Overdue Follow-ups, Upcoming Follow-ups, High-Value Contacts, All Contacts
- Filters by project and status
- Contact cards with avatar initials, role/status badges, dates
- Quick actions: Draft Message, Log Activity, Schedule Follow-up, Edit, Delete

**Modals:**
- Add/Edit Contact — full form with all fields
- Message Draft — type selector, context input, editable draft, copy to clipboard
- Log Activity — type selector, summary, auto-updates last_contact_date

### 5. Cockpit Widget (`CEOCockpit.tsx`)

New "Relationship Intelligence" section in CEO Cockpit dashboard:
- Stats: Total Contacts, Overdue, Upcoming, High-Value
- Overdue contacts preview (top 3)
- Upcoming contacts preview (top 3)
- "Open Relationships" button → navigates to full page

### 6. Route

`/admin/relationship-intelligence` — protected admin route

---

## Guardrails

- No auto-sending of messages
- No LinkedIn scraping
- All messages are drafts requiring manual copy + paste
- Manual approval required for all actions
- Compliance-safe design throughout

---

## Files Changed

| File | Action |
|---|---|
| `src/lib/linkedinEngine.ts` | Created — engine |
| `src/lib/proactiveEngine.ts` | Modified — LinkedIn nudges |
| `src/pages/admin/RelationshipIntelligence.tsx` | Created — full page |
| `src/pages/admin/CEOCockpit.tsx` | Modified — widget + state |
| `src/routes.tsx` | Modified — route added |
| Supabase migration | Applied — 2 tables + indexes + RLS |

---

## Build Verification

- `npm run build` — PASS (0 errors)
- `npm run typecheck:functions` — PASS
- Deployed via push to main

---

## What's Next

- Add contact import from CSV/paste
- Activity timeline view per contact
- Message template customization
- Integration with LinkedIn post scheduler (existing LinkedInIntelligence page)
