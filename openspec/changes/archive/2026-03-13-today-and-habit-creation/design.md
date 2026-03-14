## Context

PixelMind's home page is currently a server-rendered week grid (habits × 7 days); completion is stored via POST /days with full `completed_habit_ids` but there is no tap-to-complete UI on the home screen. Habits are created only during onboarding (three text inputs); there is no post-onboarding "add habit" flow. The app uses Next.js (App Router), Clerk for auth, and a FastAPI backend with MongoDB (habits, days collections). Existing theme includes HABIT_PALETTE (8 colors). This change introduces a card-based Today screen and a 3-step habit creation modal.

## Tech stack for this feature

- **Server state & caching:** TanStack Query v5 — fetch habits and days (including last 30 days), cache and invalidate after POST /days (complete) and POST /habits (create); supports pull-to-refresh and refetch-on-focus.
- **Client state:** Jotai — sheet open/step index, optimistic or local completion state, creation form state; atoms map well to "today completion", "creation step", "long-press menu".
- **Layout:** CSS Grid — 30-day mosaic strip as a single row of cells; native layout, no library. Tailwind v4 for cards, FAB, and sheet styling.
- **Components:** shadcn/ui — Sheet/Dialog for habit creation flow, Button, Card, Input (and optional Select) for accessible, themed UIs; customize to match app theme.
- **Animation:** Motion (Framer) v11 — sheet open/close and step transitions, card tap/complete feedback, all-complete celebration; optional GSAP for pixel-burst effect, optional Lottie for celebration asset.
- **Foundation:** React 19, Next.js App Router (server component for initial data fetch, client component for Today view and sheet), TypeScript 5.

## Goals / Non-Goals

**Goals:**
- Today screen: time-aware greeting, 30-day mosaic strip, habit cards with tap-to-complete and long-press actions, FAB, time-aware reflection CTA, empty/partial/complete states, pull-to-refresh.
- Habit creation: 3-step sheet (name + optional AI suggestions, color + optional icon, rhythm + optional reminder), entry from FAB, max 10 habits, duplicate name warning.
- Backend support: toggle or merge today's completion, data for 30-day strip and streak; habit create with optional icon/rhythm/reminder and capacity enforcement.

**Non-Goals:**
- Full reminder/notification implementation (optional toggle can be stored only in this change).
- AI habit suggestions backend (can be static list or deferred).
- Replacing or removing the existing week grid elsewhere (e.g. keep it on a different tab or remove only from home—design choice left to implementation).

## Decisions

**1. Today data: reuse GET /days range for 30-day strip**  
Fetch last 30 days via existing GET /days (start_date, end_date). Client computes mosaic pixels and per-habit streak from that response. Alternative: dedicated "mosaic summary" endpoint; rejected for MVP to avoid new API surface.

**2. Toggle today: client merges and POST /days**  
No new PATCH endpoint for "toggle one habit." Client fetches or holds today's `completed_habit_ids`, adds or removes the habit id, and calls existing POST /days (upsert) with the merged list. Keeps API simple. Alternative: PATCH /days/today with add/remove; can add later if needed.

**3. Streak: client-side from days**  
Streak is computed on the client from the same days data (consecutive days including today when completed). No new backend field or endpoint for streak in MVP.

**4. Home page: server fetch + client Today view**  
Server component fetches habits and last 30 days (and today's day doc); passes data to a client component that renders greeting, mosaic strip, habit cards, FAB, and handles tap-to-complete (merge + POST /days), pull-to-refresh, and navigation to creation. Preserves SSR for initial load and keeps interactivity in one client tree.

**5. Time-aware CTA: client-only**  
"Start tonight's reflection" visibility or copy is driven by client-side time (e.g. show only after 7pm local). No timezone preference in this change; use local time only.

**6. Habit creation: modal sheet on same route**  
Creation is a bottom sheet (or full-screen overlay) opened from the FAB, not a separate route. Sheet has 3 steps with horizontal swipe or buttons; on success close sheet and refresh Today (or invalidate cache). Entry point: FAB on Today screen; optional "Add habit" in empty state.

**7. Max 10 habits: enforce in backend and UI**  
Backend POST /habits returns 403 or 400 with a clear code when user already has 10 non-archived habits; frontend disables FAB or shows "You're at capacity" when at limit. Count uses existing habits collection (archived excluded).

**8. Habit fields: optional icon and rhythm in API**  
Accept optional `icon` (string, e.g. emoji or icon id) and `rhythm` (e.g. daily | { times_per_week: N } | { days: ["monday", ...] }) on POST /habits. Existing name and color remain required. Reminder can be a boolean or placeholder; full reminder scheduling is out of scope.

**9. Duplicate name: client-side check first**  
Before submit, client checks existing habit names (case-insensitive trim). If duplicate, show inline warning and allow user to change name or submit anyway; backend may optionally reject duplicate names for consistency.

**10. Animations: Motion (Framer) v11**  
Use Framer Motion for sheet, card tap, and celebration (per tech stack). GSAP optional for pixel-burst on tap; Lottie optional for celebration. Haptics: Vibration API or Capacitor when available; no-op otherwise.

## Risks / Trade-offs

- **30-day fetch size** — Returning 30 days of day docs per user may be acceptable for small habit counts; if slow, add a summary endpoint later. Mitigation: ensure date range query is indexed; limit to 30 days.
- **AI suggestions** — Proposal mentions "AI suggests habit names." May require backend + LLM or third-party; MVP can use a static list keyed by typed prefix (e.g. "read" → "Read 20 pages", "Read before bed"). Mitigation: implement static suggestions first; document extension point for real AI.
- **Rhythm and "today" list** — If habits have rhythm (e.g. only Mon/Wed/Fri), the Today view should show only habits that are "due" today. Adds logic to filter habits by current day. Mitigation: implement daily-only first; add rhythm filtering when rhythm field is implemented.
- **Celebration and accessibility** — Micro-animation on all-complete must not be required to dismiss; prefer short auto-dismiss or skip. Mitigation: ensure animation is decorative and doesn’t trap focus.

## Migration Plan

- No DB migration required if new habit fields are optional and backward-compatible. Deploy backend first (optional fields, max-habit check), then frontend. Rollback: hide new Today view behind a flag or revert to week grid; creation sheet can be removed without data loss.
- Existing users keep existing habits and days; new UI only changes how they interact.

## Open Questions

- Whether to keep the week grid anywhere (e.g. "Week" tab) or remove it once Today cards are live.
- Exact shape of `rhythm` in API (flat vs nested) and how "due today" is computed for X-per-week and specific-days.
- Whether reminder is stored as a boolean only or with time; if time, schema for future use.
