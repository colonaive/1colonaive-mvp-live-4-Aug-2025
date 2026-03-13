# Chief-of-Staff Intelligence Layer — Architecture

## Overview

The Chief-of-Staff layer is the central operational intelligence platform inside the COLONAiVE Antigravity environment. It transforms the CEO Cockpit from a passive dashboard into an active intelligence and coordination system.

## Module Structure

```
src/chief-of-staff/
  index.ts                          — Barrel export for all submodules
  tasks/taskEngine.ts               — Development task management
  roadmap/roadmapEngine.ts          — Product roadmap & milestones
  research/researchDigest.ts        — Research intelligence digest
  investors/investorGenerator.ts    — Investor materials generation
  operations/operationsEngine.ts    — System health & alerting
  projects/projectRegistry.ts       — Multi-project coordination
  strategy/strategyDigest.ts        — Weekly strategy brief generator
```

## Modules

### 1. Task Engine (`tasks/taskEngine.ts`)
Tracks development tasks with states: `pending → in-progress → blocked → completed → verified`.
- Assigns tasks to AI agents
- Monitors deploy verification status
- Provides aggregate statistics for dashboard

### 2. Roadmap Engine (`roadmap/roadmapEngine.ts`)
Maintains the product feature roadmap with priority ranking (P0–P3).
- Milestone tracking (Q1 2026, Q2 2026)
- Status management: planned, in-progress, completed, deferred
- Pre-populated with current roadmap entries

### 3. Research Digest (`research/researchDigest.ts`)
Integrates with existing intelligence modules:
- **CRC Research Radar** — `radarService`
- **Competitive Intelligence Radar** — `competitiveIntelligenceService`
- **Early Signal Engine** — early warning signals

Generates weekly research briefs with sections:
- Top Research Signals
- Technology Trends
- Early Warning Alerts
- Screening Policy Insights

### 4. Investor Generator (`investors/investorGenerator.ts`)
Produces investor-ready materials sourced from knowledgebase data:
- Pitch decks
- Market summaries
- Technology explainers
- Financial narratives

### 5. Operations Engine (`operations/operationsEngine.ts`)
Monitors platform health across five systems:
- Netlify Deploy
- Supabase Database
- Supabase Edge Functions
- Netlify Functions (cron jobs)
- Outlook Integration

Features:
- System health tracking (healthy/degraded/down)
- Alert creation and resolution workflow
- Auto-alerting on status degradation

### 6. Project Registry (`projects/projectRegistry.ts`)
Registers all connected projects across Chandra's three strategic tiers:
- **Tier 1:** COLONAiVE (Healthcare)
- **Tier 2:** Durmah.ai (AI/EdTech)
- **Tier 3:** SG Renovate AI (Governance Tech)

Tracks: status, active agents, last sync, domain.

### 7. Strategy Digest (`strategy/strategyDigest.ts`)
Generates a comprehensive weekly strategy brief with sections:
- Product Roadmap Progress
- Operational Status
- Development Tasks
- Connected Projects
- Investor Readiness

Each section includes a RAG (Red/Amber/Green) health indicator.

## Scheduled Automations

| Cron Job | Schedule | Function |
|----------|----------|----------|
| Weekly Strategy Digest | Monday 07:00 SGT | `cron_weekly_strategy_digest.ts` |
| Weekly Research Brief | Monday 08:00 SGT | `cron_weekly_research_brief.ts` |
| Daily Operations Check | Daily 06:00 SGT | `cron_daily_operations_check.ts` |

## CEO Cockpit Integration

The Chief-of-Staff adds 6 new widget cards to the CEO Cockpit dashboard:
1. **Weekly Strategy Digest** — full-width RAG-coded strategy overview
2. **Chief-of-Staff Tasks** — task stats (in-progress, completed, blocked)
3. **Product Roadmap** — feature list with priority and milestone
4. **Operations Status** — system health indicators with alert count
5. **Investor Materials** — material list with financial summary
6. **Connected Projects** — multi-project registry with tier and agent count

## Data Flow

```
Research Radar → Research Digest → Strategy Digest
Competitive Intel → Research Digest → Strategy Digest
Operations Engine → Strategy Digest
Task Engine → Strategy Digest
Project Registry → Strategy Digest
Investor Generator → Strategy Digest
                  → CEO Cockpit Dashboard
```

## Agent Workflow Integration

The dev-cycle workflow (`agent/workflows/dev-cycle.md`) includes a Chief-of-Staff review step before completion, ensuring:
- Task states are updated in the Task Engine
- Operations health is confirmed
- Roadmap status is updated when features ship

## Project Memory

Chief-of-Staff records are stored in `project-memory/` as Window Closure Records:
- `WCR-strategy-update` — strategy digest snapshots
- `WCR-roadmap-change` — roadmap modifications
- `WCR-research-alert` — significant research detections
