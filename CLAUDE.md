# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

COLONAiVE is a public-facing healthcare awareness portal for Singapore's colorectal cancer screening movement. It is **not** a Next.js app — it is a **Vite + React 18 SPA** deployed on Netlify, with Supabase as the backend and Netlify Functions for server-side logic.

Production domain: `https://colonaive.com` (also `colonaive.ai`)

## Commands

```bash
npm run dev               # Start Vite dev server (port 5173, opens browser)
npm run build             # Production build → dist/ (runs typecheck:functions first via prebuild)
npm run preview           # Preview production build locally (port 4173)
npm run lint              # ESLint (flat config, TS + React rules)
npm run typecheck         # Type-check frontend (src/)
npm run typecheck:functions  # Type-check Netlify functions (netlify/functions/)
npm run typecheck:all     # Type-check both frontend and functions
npm run dev:clean         # Nuke node_modules + lockfile, reinstall, then dev
```

There is no test runner configured. No unit/integration test commands exist.

**Pre-deploy workflow:** `npm run build` automatically runs `typecheck:functions` via the `prebuild` hook. This ensures all Netlify function TypeScript errors are caught before deployment. When editing functions, always run `npm run typecheck:functions` to verify before committing.

## Architecture

### Frontend (Vite + React SPA)

- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx` → `src/routes.tsx`
- **Routing:** `react-router-dom` v6 with `BrowserRouter`. All routes defined in `src/routes.tsx` (single flat file, ~390 lines). SPA fallback handled by Netlify `_redirects` and `netlify.toml`.
- **State:** Zustand stores in `src/stores/` (authStore, championStore). Auth context via `src/contexts/AuthContext.tsx`.
- **Styling:** Tailwind CSS 3 with custom brand colors defined in `tailwind.config.js`. Dark mode via `class` strategy.
- **Path alias:** `@/` maps to `src/` (configured in `vite.config.ts`).
- **Supabase client:** `src/supabase.ts` — exports `supabase` client, `authApi`, `profileApi`, and TypeScript interfaces for all user types.

### User Types & Auth

Six user types: `champion`, `corporate_contact`, `gpclinic`, `specialist`, `admin`, `super_admin`. Auth is Supabase email/password. Role-based route protection via `<ProtectedRoute>` and `<ProtectedAdminRoute>` components.

### Netlify Functions (serverless backend)

Located in `netlify/functions/`. These run at deploy time on Netlify, NOT locally via `npm run dev` (dev server proxies `/api` to Supabase Edge Functions instead).

Key functions:
- `fetch_crc_news.ts` — Scheduled every 5 min (`*/5 * * * *`). Fetches CRC news from RSS feeds + PubMed, filters for relevance, stores in Supabase `crc_news_feed` table.
- `list_crc_news.ts` — API endpoint to query stored news.
- `backfill_crc_news.ts` / `backfill_crc_news_category.ts` — One-off backfill utilities.
- `india_lead.ts` — India market lead capture.
- `notify-admin.js` — Admin notification emails.

### Supabase

- Edge Functions in `supabase/functions/` (chatbot, fetch_rss, send-contact-email, send-referral-email).
- Migrations in `supabase/migrations/` — SQL migration history.
- Config in `supabase/config.toml`.
- Frontend client config in `src/config/supabase.ts` and `src/supabase.ts`.

### Content Structure

- `src/pages/` — Page components, organized by feature (education/, admin/, auth/, markets/, seo/, pillars/, etc.).
- `src/components/` — Shared UI components. Notable: `Header.tsx`, `Footer.tsx`, `ProtectedRoute.tsx`, `chat/`, `news/`, `ui/`.
- `src/data/` — Static data (clinic database, education content, pillars).
- `src/services/` — Service modules (clinic schema, CRC news feed).
- `content/stories.json` — Patient stories content.

### Multi-Market Pages

India market pages under `src/pages/markets/in/` with routes at `/in/*`. SEO landing pages for Singapore, India, Philippines, Japan, Australia under `src/pages/seo/`.

## Environment Variables

Frontend (build-time, must start with `VITE_`):
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Serverless functions (runtime, set in Netlify Dashboard):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `GOOGLE_CSE_ID`, `GOOGLE_API_KEY`, `PUBMED_EMAIL`

See `.env.example` for the full list.

## Deployment

Pushes to `main` trigger Netlify auto-deploy. Build command: `npm run build`, publish dir: `dist/`. API routes (`/api/*`) redirect to `/.netlify/functions/:splat`. All other routes fall through to `index.html` for SPA routing.

## Key Conventions

- This is a healthcare site — never overstate clinical claims. ColonAiQ IFU guardrails: positive result does not equal diagnosis, negative does not rule out CRC.
- Production validation on the live deployed site, not localhost.
- Branch discipline: work on `main` branch only.
- Manual chunks configured in Vite: `react-vendor` bundle splits React/ReactDOM/react-router-dom.
