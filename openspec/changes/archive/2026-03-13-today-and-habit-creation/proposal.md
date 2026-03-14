## Why

The home screen is a read-only week grid with no way to complete habits from Today or add habits after onboarding. Users need a focused "today" experience—habit cards with tap-to-complete, a glanceable 30-day mosaic, and a dedicated habit-creation flow that feels fast and delightful instead of form-like.

## What Changes

**Screen 1 — Today / Habit Checklist**
- Replace the week table with a **card-based Today** view: header with date and time-aware greeting (e.g. "Good morning, Jashan"), hero section with a **mini mosaic strip** (last 30 days across all habits, scrollable horizontally), and a **vertical list of habit cards** (color pill, name, current streak, tap to complete with animation, long-press for edit/skip/delete).
- Add **FAB** ("+") to add a new habit; **bottom CTA** "Start tonight's reflection" shown contextually (e.g. after 7pm only).
- Support **states**: empty (ghost cards / "Create your first habit"), partial (some done), all complete (celebration micro-animation). **Interactions**: tap to complete (persist via API), swipe left to skip for the day, pull to refresh.
- **Backend**: Ability to toggle today's completion per habit (or merge into existing POST /days); optional 30-day summary or reuse existing days range; streak derived client-side or via API.

**Screen 2 — Habit Creation Flow**
- **3-step modal sheet** (slides up, step transitions via swipe): (1) **Name it** — large input, optional AI-suggested habit names as you type; (2) **Color + icon** — curated palette (8–10 colors), optional emoji/icon picker, live preview; (3) **Rhythm** — daily (default), X times per week (stepper), or specific days (Mon–Sun pills), optional reminder toggle.
- **Entry**: FAB or explicit "Add habit" opens this flow (not onboarding).
- **Constraints**: Max 10 habits (MVP); at limit show "You're at capacity." Duplicate habit name warning inline (no blocking alert).
- **Backend**: Habit model may gain optional fields (e.g. icon/emoji, rhythm, reminder); enforce max habits on create; duplicate name check optional.

## Capabilities

### New Capabilities
- `today-screen`: Today/home screen UX—time-aware greeting, 30-day mosaic strip, habit cards with tap-to-complete and long-press actions, FAB, time-aware reflection CTA, empty/partial/complete states, pull-to-refresh. Includes contract for completion toggle and data for mosaic/streak.
- `habit-creation-flow`: Habit creation as a 3-step modal (name + optional AI suggestions, color + optional icon, rhythm + optional reminder). Entry from FAB or add-habit entry point. Max 10 habits, duplicate name warning. Includes API contract for creating habits with new optional fields and capacity enforcement.

### Modified Capabilities
- *(None.)*

## Impact

- **Frontend**: Home page becomes client-heavy or hybrid (server fetch + client Today view); new components for greeting, mosaic strip, habit cards, FAB, creation sheet (3 steps). Stack for this feature: TanStack Query (server state), Jotai (client state), shadcn/ui (Sheet, inputs), CSS Grid (mosaic layout), Motion/Framer (animations). Optional: GSAP (pixel burst), Lottie (celebration). New route or modal for habit creation.
- **Backend**: Possible new or extended endpoints (e.g. PATCH or POST for "toggle habit for today", or 30-day summary); habit create may accept optional icon, rhythm, reminder; enforce max 10 habits; optional duplicate-name validation.
- **Data**: Days and habits collections unchanged in shape unless we add habit fields (icon, rhythm, reminder); streak can be computed from existing days data or added as derived/cached value.
