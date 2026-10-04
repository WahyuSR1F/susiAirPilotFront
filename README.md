# Susi Air — Pilot App (Frontend)

Mobile-first web app for Susi Air pilots to check their duty schedule, track flight hours, and see how close they are to their regulatory limits. Built as the frontend half of the **Fullstack Developer Technical Test** (brief: *Susi Air — Pilot App — Nuxt 3 + NestJS*).

> This repository is the **frontend only**. The NestJS backend lives in a separate repository.

## Screens

| Screen | Route | Description |
| --- | --- | --- |
| Sign In | `/login` | Pilot login form, calls `POST /auth/login`, shows a clear error on bad credentials |
| Home | `/` | Header (greeting, name, total hours, avatar), Hours to Limit cards + rolling sum chart, My Documents list |
| Schedule | `/schedule` | Monthly calendar with prev/next navigation, duty-colored days, legend |
| Duty Detail | `/schedule/:date` | Detail view for a single date (extra, beyond brief) |
| Logbook | `/logbook` | Electronic logbook list (extra, beyond brief) |
| More | `/more` | Account info + sign out with confirmation modal (extra, beyond brief) |

## Tech Stack

- **Nuxt 4** (Vue 3, Composition API, `<script setup>`) — brief asks for Nuxt 3; Nuxt 4 is the current release of the same framework, API-compatible for everything used here
- **Pinia** — state management
- **SCSS** — design tokens + mixins (`assets/scss/`)
- **Chart.js** via `vue-chartjs` — flight hours trend chart
- **Lucide** — line icons
- TypeScript throughout

## Setup

```bash
# install dependencies
npm install

# copy env file and point it at your backend
cp .env.example .env

# start dev server on http://localhost:3001
npm run dev
```

Production build:

```bash
npm run build     # build
npm run preview   # preview production build
```

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NUXT_PUBLIC_API_BASE` | yes | `http://localhost:3000` | Base URL of the NestJS API |

`.env` is gitignored; `.env.example` is committed.

Demo account (from the brief): `johndoe` / `susiairtest`.

---

## Brief Compliance — Frontend

Checklist of the brief's frontend requirements against this codebase.

### Tech Stack

- [x] Nuxt with Composition API and `<script setup>` (Nuxt 4 — see note above)
- [x] Pinia for state management
- [x] SCSS for styling
- [x] TypeScript used throughout

### 1. Sign In Page

- [x] Pilot login form with username and password (`pages/login.vue`)
- [x] Clear message when the API returns a bad credentials error (error banner from API response)

### 2. Home Page

**Header**
- [x] Greeting, pilot name, total flight hours, and avatar (`components/home/HomeHeader.vue`)
- [x] Avatar fallback with pilot initials when no image is available

**Hours to Limit**
- [x] Four limit cards — Daily / Weekly / Monthly / Annual (`LimitCards.vue`)
- [x] Each card shows current hours, limit, and a visual indicator (progress bar + %)
- [x] Rolling sum chart fed from `/flight-hours/summary` (`TrendChart.vue`)
- [x] Toggle `1w / 1m / 3m / 6m / 1y`, defaults to `1w` (`RangeToggle.vue`)
- [x] Chart X axis = days, today centered (series provided by API, today marker rendered)
- [x] Red horizontal limit line at the limit value for the selected range
- [x] Y max follows the selected range (from API `yMax`)
- [x] Values above the limit render without breaking layout (over-limit points turn red + warning banner)
- [x] Future dates rendered as dashed segments, labelled "(Projected)" in tooltip
- [x] Rolling sum calculation runs **on the server** — frontend only renders what the API returns

**My Documents**
- [x] Document list with expiry date per item (`DocumentList.vue`, `DocumentItem.vue`)
- [x] Expiry badge colored by urgency: green = safe, amber = soon, red = expired
- [x] Badge state comes from the API (`status` field), not computed in the frontend
- [x] Drives the notification badge on the Home nav item

**Bottom Navigation**
- [x] Home, Schedule, Logbook, More (`components/ui/BottomNav.vue`)
- [x] Active state indicator + per-item badge count

### 3. Schedule Page

- [x] Monthly calendar with previous / next month buttons (`pages/schedule/index.vue`)
- [x] Every month change calls `/schedules?year=YYYY&month=MM`
- [x] Days colored by duty type using `base_color` from the API (`CalendarDay.vue`)
- [x] Text color auto-adjusts (light/dark) based on the duty color's luminance
- [x] Duty status indicator: tick when `count_logbooks === count_schedules`, otherwise the remaining duty count
- [x] Legend below the calendar, rendered from the API's legend payload (`Legend.vue`)
- [x] Tapping a date opens a detail page
- [x] Loading skeleton, error state with retry

### Design Direction

- [x] Minimalist, clean, mobile-first, operational — airline ops tool, not consumer travel app
- [x] Color palette matches the brief exactly (`assets/scss/_tokens.scss`): navy `#0E2138`, red `#E63757`, bg `#F5F6F8`, success `#1FBF8F`, warning `#F59E0B`, chart accent `#22C5E8`
- [x] Plus Jakarta Sans from Google Fonts, bold weights on numeric data
- [x] Rounded corners 12–16px on cards, pill shape on primary buttons
- [x] Subtle card shadows
- [x] Line icons (Lucide)
- [x] Susi Air logo from the brand asset (`public/susi-air-logo.png`)

### Data & API

- [x] No mock data in the three brief screens — everything fetched from the API
- [x] Auth token sent as `Bearer` header, persisted in cookie + localStorage
- [x] Global 401 handling redirects to `/login` and clears the token
- [x] Route middleware guards protected pages (`middleware/auth.global.ts`)
- [x] "Today" is treated as **15 May 2026** — hardcoded as the default in stores, and the API returns the authoritative `today` value; no `new Date()` used to represent today
- [x] API responses are typed in `types/api.ts`, errors normalized in `composables/useApi.ts`

### Extras (beyond the brief)

- [x] Logbook screen (brief only lists it as a nav destination)
- [x] Duty detail page with stats and progress (brief asked only for a placeholder)
- [x] Logout confirmation modal (`components/ui/ConfirmModal.vue`)
- [x] Reusable logo badge component (`components/ui/LogoBadge.vue`)
- [x] Skeleton loading states and error/retry states throughout

### Not covered (frontend)

- [ ] Live deployment (Vercel/Netlify) — not set up in this repo
- [ ] Logbook screen still uses local mock data; the brief defines no `/logbook` endpoint

---

## Main Choices & Reasons

- **Pinia stores per domain** (`auth`, `pilot`, `flightHours`, `documents`, `schedule`) instead of one store — each screen owns its data and loading/error state, which keeps components presentational.
- **Server-driven chart and limits.** The frontend never computes rolling sums, limits, or Y-max; it renders `series`, `cards`, `limit`, and `yMax` from `/flight-hours/summary`. This follows the brief's requirement that the rolling sum runs on the server, and keeps one source of truth when the range toggles.
- **`ssr: false`** — the app is an authenticated mobile web app behind a token; disabling SSR avoids server-side cookie/token handling complexity and matches how it will be deployed as a static SPA.
- **Design tokens in SCSS** (`_tokens.scss`) mirror the brief's palette exactly, so brand colors are referenced by name rather than repeated hex values.
- **Race-condition guard** in the flight hours store (`activeRequestId`) so fast range toggling can't render a stale response.

## What I'd Change With More Time

- Add E2E tests (Playwright) for login → home → schedule flow, and unit tests for stores.
- Integrate a real `/logbook` endpoint and drop the mock data on that screen.
- Prefetch the next month's schedule on hover/idle for instant calendar navigation.
- Offline caching / request retry with backoff for poor connectivity in the field.
- Stricter a11y pass: focus trapping in the modal, full keyboard navigation on the calendar grid.
- Set up CI (typecheck + build) and the Vercel deployment for the frontend.

## Project Structure

```
assets/scss/        design tokens, mixins, global styles
components/
  home/             header, limit cards, trend chart, documents
  schedule/         calendar grid, day cell, month switcher, legend
  ui/               buttons, modal, logo badge, bottom nav, skeleton...
composables/        useApi (fetch wrapper, auth header, 401 handling)
layouts/            default (app shell), auth (login)
middleware/         auth.global.ts (route guard)
pages/              login, index (home), schedule, logbook, more
stores/             Pinia stores: auth, pilot, flightHours, documents, schedule
types/              API response typings
public/             logo assets
```
