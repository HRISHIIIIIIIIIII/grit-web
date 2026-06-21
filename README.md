# GRIT — Web Frontend

Production web frontend for **GRIT**, a discipline / progress-tracking platform (habits,
goals, roadmaps, streaks, XP & levels, achievements, leaderboards, AI coaches, and
notifications). Built from the GRIT design files and wired to the
[GRIT FastAPI backend](../grit-backend).

Vite · React 18 · TypeScript · React Router v6 · TanStack Query · Zustand · CSS Modules ·
Vitest · Playwright.

---

## Requirements

- **Node 18+** and **npm**
- The **[GRIT backend](../grit-backend)** running (the app talks to it for all data)

---

## First-time setup

```bash
cd grit-web
npm install
cp .env.example .env          # VITE_API_BASE_URL — defaults to http://localhost:8010
```

Make sure the backend is running (see `../grit-backend/README.md` → "Quick start"). The
default `.env` points at **http://localhost:8010**; change it if your backend is elsewhere.

```bash
npm run dev                   # http://localhost:5173
```

Log in with the seeded demo account **`jordan@grit.app` / `GritDemo123!`**, or register a new
account and go through onboarding.

> Running e2e tests for the first time? Install the browser once:
> ```bash
> npx playwright install chromium
> ```

---

## Subsequent runs

```bash
npm run dev                   # start the dev server (http://localhost:5173)
```

That's it — as long as the backend is up.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Type-check (`tsc -b`) + production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Vitest component tests (ring %, level ladder, streak states, primitives) |
| `npm run e2e` | Playwright e2e (needs frontend **and** backend running) |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run gen:api` | Regenerate `src/api/schema.d.ts` from the backend's `/openapi.json` |

---

## Pointing at a different backend

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:8010
```

Whenever the backend API changes, regenerate the typed client (backend must be running):

```bash
npm run gen:api
# or explicitly:
npx openapi-typescript http://localhost:8010/openapi.json -o src/api/schema.d.ts
```

---

## Testing

```bash
npm run test                  # Vitest (jsdom) — no backend needed
npm run build                 # also type-checks the whole app

# e2e (start backend on :8010 and `npm run dev` on :5173 first)
npx playwright install chromium   # first time only
npm run e2e
```

The two Playwright flows cover: (1) register → onboarding → dashboard → check in a habit →
streak/XP update; (2) import a DSA-linked roadmap → toggle a topic → the linked habit is
credited on the dashboard.

---

## Project structure

```
src/
  styles/        tokens.css (design tokens) + global.css (reset, fonts, keyframes)
  components/
    primitives/  Button, Card, Badge, Input, Toggle, SegmentedControl, Checkbox,
                 Avatar, ProgressBar, Tooltip, Skeleton, Icon, Toast
    charts/      RingProgress, ContributionHeatmap, AreaChart, Donut, LevelLadder,
                 FlameHero, EvolutionStages, StreakCalendar, MentorCard, … (hand-rolled SVG)
  api/           client.ts (fetch + JWT refresh), schema.d.ts (generated), hooks/
  auth/          session store + route guards
  app/           AppShell (dark sidebar + top bar), ThemeSync (live accent)
  lib/           tokens helpers, category colors, coaches data
  pages/         dashboard, habits, goals, roadmaps, streaks, achievements, analytics,
                 community, coaches, profile, notifications, settings, onboarding, auth
e2e/             Playwright specs
```

## Highlights

- **Routed app shell** — dark sidebar + sticky top bar (streak / XP pills, notification bell),
  collapses to an icon rail below 1024px.
- **Optimistic updates** for check-ins, topic/milestone toggles, archive/restore.
- **Roadmap import** — paste markdown or **upload `.md` file(s)** (single → editor, multiple →
  bulk import). Feed a whole `docs/` folder of syllabi straight in.
- **AI coaches** — pick from 5 personas (ATLAS, RAZE, NOVA, SAGE, VESPER); the choice drives
  the mentor card voice and mentor tone.
- **Live theming** — switching the accent in Settings re-colors the whole app instantly via
  CSS variables on `:root`.
