## Context

`TodayView.tsx` currently renders in a single vertical scroll: header → mosaic strip → habit cards → add button → reflection bar. The mosaic strip (a CSS grid of 10px cells) and the habit checklist compete for the same vertical space, and the connection between mosaic rows and habit cards is invisible to the user.

The active `today-screen-redesign` change already specifies the dark card styling, teal accent, and reflection bar. This change supersedes the standalone mosaic strip and reflection bar from that spec, replacing them with a three-tab structure built on top of the same data layer.

## Goals / Non-Goals

**Goals:**
- Three tabs on the home screen: Today (action), Mosaic (history), Tonight (reflection entry)
- Completed habits animate to the bottom of the Today list
- Progress counter inline in header (`N / M done`)
- Mosaic tab with labeled rows and 30-day scrollable grid
- Tonight tab with locked/unlocked state driven by 8pm threshold
- Tonight tab unlocked state shows an inline panel stub (no journal write yet)

**Non-Goals:**
- Journal write functionality in the Tonight panel (out of scope; panel is a stub)
- Notification scheduling for the reflection reminder
- Changing any backend APIs or data contracts
- Drag-to-reorder habits

## Decisions

### Decision 1: Tab state is local React state, not URL-driven

**Chosen**: `useState<'today' | 'mosaic' | 'tonight'>` inside `TodayView`. No URL params, no router changes.

**Rationale**: The home screen is a single route (`/app`). Tab state is ephemeral UI state — the user always lands on Today on fresh load, which is the correct default. URL-driven tabs would complicate back-navigation and add no value at this stage.

---

### Decision 2: Mosaic extracted to `MosaicTab.tsx`, Tonight to `TonightTab.tsx`

**Chosen**: Each tab's content is its own component imported by `TodayView`. The Today content stays inline in `TodayView` since it shares the most state (habits, days, completion handlers).

**Rationale**: `TodayView` is already long. Extracting Mosaic and Tonight keeps concerns separated without needing to lift more state — both receive data as props from `TodayView`.

---

### Decision 3: Completed habits sort to the bottom via `useMemo`, not `useEffect` mutation

**Chosen**: The sorted habit list is derived: `[...incomplete, ...complete]` computed in a `useMemo`. Framer Motion's `layout` prop on each `HabitCard` animates the reorder automatically.

**Alternatives considered**:
- Separate `useState` for order: requires manual sync when habits or completions change.
- CSS-only reorder: not animatable without JS.

**Rationale**: `useMemo` keeps the sort always in sync with completions with no manual bookkeeping. Framer Motion `layout` animations are already used in `HabitCard` so no new dependency.

---

### Decision 4: Tonight tab locked state — visual dim only, tap is a no-op

**Chosen**: Before 8pm the Tonight tab renders with `opacity-40` and `cursor-not-allowed`. Tapping it does nothing (no tooltip, no error). The label reads "Tonight" with a lock icon.

**Rationale**: The user asked to keep the locked state simple for now while habit tracking is the focus. A tooltip or snackbar can be added later. The dimmed visual is self-explanatory in context.

---

### Decision 5: Progress counter format — `N / M done` inline in header

**Chosen**: A small muted line below the greeting: `3 / 6 done` with `M` being the number of non-completed habits. Disappears (or shows `All done ✓`) when all complete.

**Rationale**: Gives immediate orientation when opening the app without requiring the user to scan all cards. Small enough not to compete with the greeting.

## Risks / Trade-offs

- **Framer Motion layout animations with sort reorder**: If a habit's key changes (it shouldn't — keys are `_id`), the animation breaks. Mitigation: ensure `key={habit._id}` is stable.
- **Tonight tab stub could mislead users**: An active-looking "Tonight" tab with placeholder content might frustrate users who try to write. Mitigation: panel copy should be clear it's coming soon, or link to `/app/journal` as a fallback until the full panel is built.
- **Tab state lost on page refresh**: Users always land on Today tab. This is intentional, not a bug.
