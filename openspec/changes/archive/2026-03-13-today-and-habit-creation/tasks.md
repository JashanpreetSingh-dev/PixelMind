## 1. Setup — dependencies and stack

- [x] 1.0 Add and wire stack for this feature: TanStack Query v5 (habits/days fetch and cache), Jotai (client state), shadcn/ui (Sheet, Button, Card, Input — install and theme), Motion (Framer) v11 (sheet and animations). Use CSS Grid for mosaic layout. Optional: GSAP, Lottie. Ensure Next.js app has QueryClient provider and any shadcn theme tokens.

## 2. Backend — completion, limits, and habit fields

- [x] 2.1 Ensure POST /days supports upsert for today: client can send completed_habit_ids for today's date and backend merges or replaces; document behavior for "toggle" (client merges and POSTs)
- [x] 2.2 Add max-habit enforcement: in POST /habits, reject with 400/403 when user already has 10 non-archived habits; return clear error body
- [x] 2.3 Extend POST /habits to accept optional icon (string) and rhythm (e.g. daily or object); persist and return in GET /habits
- [x] 2.4 Optional: add duplicate-habit-name check in POST /habits (warn or reject); if not in backend, rely on client-side duplicate warning only

## 3. Today screen — data and layout

- [x] 3.1 Add server-side fetch for Today: habits + GET /days for last 30 days and today; pass to client Today view component
- [x] 3.2 Implement time-aware greeting: date + "Good morning/afternoon/evening, &lt;name&gt;" using Clerk first name and local time
- [x] 3.3 Build mini mosaic strip: horizontal scrollable strip of 30 cells, each cell derived from days data (filled/unfilled per day); use existing days range response
- [x] 3.4 Replace week table with habit cards: vertical list, each card shows color pill, habit name, and streak (compute streak client-side from days)
- [x] 3.5 Add FAB "+" that opens habit creation; hide or disable FAB when user has 10 habits and show "You're at capacity" in empty state when at limit

## 4. Today screen — interactions and states

- [x] 4.1 Implement tap-to-complete: on card tap, merge habit id into today's completed_habit_ids and call POST /days; update UI and optional animation/haptic
- [x] 4.2 Implement long-press on card: show options menu (edit, skip, delete); wire edit to existing edit flow or placeholder, skip to mark skipped for today, delete to archive or remove
- [x] 4.3 Implement swipe left to skip habit for the day (persist skip state or leave uncompleted per design)
- [x] 4.4 Show "Start tonight's reflection" CTA only when local time >= 7pm; hide or show alternative before 7pm
- [x] 4.5 Empty state: when zero habits, show "Create your first habit" nudge and single action to open creation flow; no mosaic or cards
- [x] 4.6 All-complete celebration: when last habit is completed and count > 0, trigger short micro-animation (e.g. Framer Motion); auto-dismiss or skippable, non-blocking
- [x] 4.7 Pull-to-refresh: re-fetch habits and 30-day days range and update mosaic, cards, and completion state; show loading feedback

## 5. Habit creation — sheet and steps

- [x] 5.1 Add habit creation as modal sheet: slides up from bottom (e.g. Framer Motion); entry from FAB or empty-state CTA; 3 steps with swipe or next/back
- [x] 5.2 Step 1 — Name it: large autofocused text input; require non-empty name to proceed; optional static suggestions keyed by prefix (e.g. "read" → "Read 20 pages")
- [x] 5.3 Step 2 — Color + icon: palette of 8–10 colors (use HABIT_PALETTE); require one selection; optional emoji/icon picker; live preview of habit pixel/card
- [x] 5.4 Step 3 — Rhythm: daily (default), optional X times per week (stepper), optional specific days (Mon–Sun pills); optional reminder toggle (store only); allow proceed with default
- [x] 5.5 On submit: call POST /habits with name, color, and optional icon/rhythm; on success close sheet and refresh Today; on failure show error and keep sheet open
- [x] 5.6 Duplicate name: before submit, check existing habit names (client); show inline warning if duplicate, allow user to change or submit anyway
- [x] 5.7 At capacity: when user has 10 habits, do not open sheet from FAB; from empty state show "You're at capacity" and no primary create action

## 6. Polish and optional

- [x] 6.1 Add Framer Motion (or chosen lib) for sheet, card tap feedback, and celebration; optional haptic on complete/skip
- [ ] 6.2 Filter Today habit list by rhythm when rhythm is implemented (e.g. show only habits "due" today for specific-days or X-per-week)
