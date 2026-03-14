# Design: Today Screen Redesign

## Context

The app’s Today screen lives in `TodayView.tsx` and uses `HabitCard.tsx` for each habit. Data comes from existing APIs: habits list, last-30-days days (with `completed_habit_ids`), and optional user first name for the greeting. The current UI uses a single-row 30-day mosaic (aggregate completion), generic card styling via shadcn Card, a 7pm-only reflection CTA, and an empty state that is a single card with an "Add habit" button. The redesign introduces a strict visual system (hex colors, per-habit mosaic, circular tap target, reflection bar, ghost empty state) and changes reflection unlock from 7pm to 8pm on this screen. Tech stack: Next.js app router, React, Tailwind, existing CSS variables in `globals.css`, Framer Motion already used for celebration and animations.

## Goals / Non-Goals

**Goals:**

- Implement the described layout and visuals: header (muted date + large greeting), per-habit mosaic strip with dim→bright fade and dark future cells, habit cards with dot/name/streak/circle tap target and completed-state styling, reflection bar (teal-tinted, 8pm unlock copy + pulse, then CTA), empty state (3 ghost cards + shimmer + "Add your first habit +").
- Apply the specified color palette on the Today screen (and active nav): #0d0f12 page bg, #151821 card/future pixels, #2a2d32 card border, #1D9E75 teal accent (check + active tab), #0d4d33 / #0a1a12 completed card border/background.
- Preserve existing behavior: completion toggle, streak computation, long-press menu (edit/skip/delete), swipe-to-skip, pull-to-refresh, all-done celebration; no API or data-model changes.

**Non-Goals:**

- Changing backend APIs, habit limit, or journal/reflection backend behavior.
- Global theme change beyond what’s needed for Today and bottom nav active state (e.g. other screens keep current theme unless we later align).
- Timezone or “reflection unlock time” user preference (use 8pm local time only).

## Decisions

### 1. Where to define Today-specific colors

**Decision:** Add Today (and nav accent) colors as CSS variables in `globals.css` (e.g. `--today-bg`, `--today-card-bg`, `--today-card-border`, `--today-accent`, `--today-completed-border`, `--today-completed-bg`) and use them in TodayView and HabitCard. Optionally alias `--accent` to the new teal for the app shell so BottomNav and any shared CTAs use it consistently.

**Rationale:** Keeps palette in one place, avoids magic hex strings in components, and makes it easy to switch to a full theme later. Alternative was inline styles or Tailwind arbitrary values; variables are easier to maintain and override.

### 2. Mosaic: one row per habit, fade and future cells

**Decision:** Render a horizontal scrollable grid: `rows = habits.length` (or 0 when no habits), `cols = 30`. For each cell (habit, date): if `date > todayIso` → render a dark square (#151821); else if habit completed that day → colored pixel using habit color with opacity that increases from left (e.g. 0.35) to right (1) by day index; else (past day, not completed) → same dark square or a very muted variant so “empty” is distinguishable from “future.” Use a single scroll container (e.g. `overflow-x-auto`) and fixed or min column width (e.g. 10–12px) so the strip scrolls horizontally.

**Rationale:** Matches the vision of “each habit gets its own row” and “pixels fade dim to bright”; future as dark squares is explicit. Alternatives: keep single row (rejected per proposal); use a single row with multiple colors per cell (harder to read per-habit history).

### 3. Habit card tap target: circle only vs whole card

**Decision:** Keep the whole card tappable for completion; the circle on the right is the primary visual affordance and updates to filled teal + check when completed. No need to restrict tap to the circle only—accessibility and touch targets are better when the full card toggles.

**Rationale:** Spec says “circular tap target” for the control; making the whole card tappable is consistent with current behavior and avoids a small hit area. Long-press and swipe still apply to the card.

### 4. Reflection bar placement and content

**Decision:** A single bar fixed at the bottom of the Today content area (above the bottom nav), full width, teal-tinted background. Before 8pm local: text “Tonight’s reflection unlocks at 8pm” and a small pulsing dot (CSS animation). At/after 8pm: replace with “Start tonight’s reflection” (or same CTA text as today) and link to `/app/journal`; dot can be removed or kept as a subtle indicator. Use client-side time (e.g. `new Date().getHours() >= 20` for 8pm) for unlock.

**Rationale:** Always-visible bar meets “no empty space” and sets expectation; 8pm is the product rule for this change. No backend change for unlock time.

### 5. Empty state: ghost cards and “Add your first habit +”

**Decision:** When `habits.length === 0`, show three placeholder “cards” with the same dimensions and border radius as real habit cards, background #151821 (or slightly transparent), border #2a2d32, and a CSS shimmer (e.g. moving gradient overlay). Below or among them, a single subtle text/link: “Add your first habit +” that opens the existing habit creation sheet. No FAB in empty state; when there are habits, keep an explicit “add habit” entry point (e.g. a small “+ Add habit” link or a compact FAB) so the flow is still discoverable.

**Rationale:** Matches the vision of three ghost cards and avoids a big empty box. Reusing the existing creation sheet keeps behavior consistent.

### 6. FAB when user has habits

**Decision:** When the user has at least one habit, keep a clear way to add another: either a small “+ Add habit” text link below the list or a compact FAB. Prefer a compact FAB or inline link that doesn’t dominate the screen, to align with the denser layout.

**Rationale:** Proposal says “keep a clear way to add more”; FAB is already used elsewhere. Choosing a compact FAB or inline link is an implementation detail; design accepts either.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Two “accent” colors (current #5eead4 vs new #1D9E75) if only Today is updated | Use new teal for Today and for BottomNav active state; consider updating `--accent` globally so the app feels consistent, or document that accent is “Today teal” for this release. |
| Mosaic row count (many habits) makes strip tall | Limit to a reasonable max height (e.g. 5–8 rows visible) with vertical scroll or cap display; or keep one row per habit and allow vertical scroll of the strip. Product can cap habits at 10. |
| Shimmer performance on low-end devices | Use CSS-only animation (e.g. `background-position` or `opacity`), avoid heavy JS; restrict to empty state only. |
| 8pm vs 7pm elsewhere (e.g. backend or copy) | All reflection-unlock copy on the Today screen uses 8pm; any other screen or backend rule stays as-is unless changed separately. |

## Migration Plan

- Frontend-only change: deploy updated `TodayView.tsx`, `HabitCard.tsx`, `BottomNav.tsx`, and any new CSS variables.
- No data migration or feature flags required. Rollback: revert the frontend commit.
- If we later move to a full theme, replace Today-specific variables with global theme tokens in a follow-up.

## Open Questions

- None at design time. Optional: whether to expose “reflection unlock time” (e.g. 8pm) as a constant in one file for easier product changes later.
