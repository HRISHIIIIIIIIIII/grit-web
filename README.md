# GRIT — Web Frontend

The production web frontend for **GRIT**, a discipline / progress-tracking platform
(habits, goals, roadmaps, streaks, XP & levels, achievements, leaderboards, an AI mentor
called **ATLAS**, and notifications).

Built as a faithful, routed, state-driven React app from the GRIT design files and wired to
the [GRIT FastAPI backend](../grit-backend).

## Stack

| Concern | Choice |
| --- | --- |
| Build | Vite + React 18 + TypeScript |
| Routing | React Router v6 (nested layout route for the app shell) |
| Server state | TanStack Query (optimistic check-ins, topic/milestone toggles, archive/restore) |
| Client state | Zustand (auth session) + in-memory access token |
| Styling | CSS custom properties + CSS Modules (design tokens, no Tailwind) |
| Forms | react-hook-form + zod |
| API types | `openapi-typescript`, generated from the backend's `/openapi.json` |
| Fonts | Space Grotesk · Hanken Grotesk · JetBrains Mono (Google Fonts) |
| Tests | Vitest + React Testing Library; Playwright e2e |

## Project structure

```
src/
  styles/        tokens.css (all design tokens) + global.css (reset, fonts, keyframes)
  components/
    primitives/  Button, Card, Badge, Input, Toggle, SegmentedControl, Checkbox,
                 Avatar, ProgressBar, Tooltip, Skeleton, Icon (SVG set), Toast
    charts/      RingProgress, ContributionHeatmap, WeeklyBarChart, AreaChart, Donut,
                 LevelLadder, FlameHero, EvolutionStages, StreakCalendar, MilestoneTrack,
                 TimeOfDayBars, VelocityBars, MentorCard  (hand-rolled SVG)
  api/           client.ts (fetch + JWT refresh interceptor), schema.d.ts (generated),
                 types.ts, keys.ts, hooks/ (one file per resource)
  auth/          session store + route guards (RequireAuth / RequireOnboarding)
  app/           AppShell (dark sidebar + sticky top bar), ThemeSync (live accent)
  pages/         dashboard, habits, goals, roadmaps, streaks, achievements, analytics,
                 community, profile, notifications, settings, onboarding, auth
  router.tsx     route table
e2e/             Playwright specs
```

## Getting started

### 1. Run the backend first

This app talks to the GRIT FastAPI backend. From `../grit-backend`, with Postgres+Redis (or
SQLite for local dev), run it and seed the demo user. For a quick local run on **port 8010**
(port 8000 is often taken):

```bash
cd ../grit-backend
export GRIT_DATABASE_URL="sqlite+aiosqlite:////tmp/grit.db"
export GRIT_SYNC_DATABASE_URL="sqlite:////tmp/grit.db"
export GRIT_CORS_ORIGINS="http://localhost:5173"
export GRIT_SECRET_KEY="dev-secret"
uv run alembic upgrade head
uv run python -m scripts.seed              # demo user: jordan@grit.app / GritDemo123!
uv run uvicorn app.main:app --port 8010
```

### 2. Run the frontend

```bash
npm install
cp .env.example .env          # set VITE_API_BASE_URL to your backend (default :8010 here)
npm run dev                   # http://localhost:5173
```

Log in with the seeded demo account **`jordan@grit.app` / `GritDemo123!`**, or register a new
account and go through onboarding.

### Point at a different backend

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:8010
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run preview` | Preview the production build |
| `npm run test` | Vitest component tests (ring %, level ladder, streak states, primitives) |
| `npm run e2e` | Playwright e2e (needs frontend + backend running) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run gen:api` | Regenerate `src/api/schema.d.ts` from the backend's `/openapi.json` |

### Regenerating API types

Whenever the backend's API changes:

```bash
# backend running on :8010
npx openapi-typescript http://localhost:8010/openapi.json -o src/api/schema.d.ts
```

## Design system

All tokens are extracted verbatim from the GRIT design files into `src/styles/tokens.css`:
the accent ramp (Emerald default + Amber/Indigo/Crimson, switchable live via `[data-accent]`),
the ink/neutral scale, semantic + gamification colors, radii (7/11/16/22), the 4-step
elevation set, motion curves, and the 3-font type scale. Changing the accent in **Settings**
re-themes the whole app instantly by swapping the CSS variables on `:root`.

## Testing

- **Vitest** (`src/**/*.test.tsx`): gamification UI — ring percentage/dashoffset, level ladder
  "you are here", evolution stages for a given streak, streak-calendar day glyphs — plus
  primitive behavior (button disabled, progress clamp, toggle a11y).
- **Playwright** (`e2e/`): two critical flows —
  1. register → onboarding (6 steps) → dashboard → check in a habit → streak/XP update;
  2. import a DSA-linked roadmap → toggle a topic → the linked DSA habit is credited on the dashboard.

Run e2e against the live stack (override hosts with `E2E_BASE_URL` / `E2E_API_URL`):

```bash
# frontend on :5173 and backend on :8010 both running
npx playwright install chromium    # first time
npm run e2e
```

## Accessibility

Real `<button>`/`<a>` elements, `focus-visible` accent-soft rings, `aria-label`s on icon-only
controls, and keyboard-operable toggles, tabs, checkboxes and checklists.
