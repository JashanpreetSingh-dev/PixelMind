## Why

Tapping a habit card shows no immediate feedback — the UI waits for a full server round-trip before the card moves or the checkmark appears, making the list feel broken. Combined with a long-press/click race condition and a near-invisible reorder animation, the today list falls short of the satisfying, responsive feel a habit tracker needs to build daily use.

## What Changes

- Replace fire-and-forget toggle with React Query `useMutation` + optimistic cache update so the UI responds instantly on tap
- Add rollback on server error so accidental state corruption is impossible
- Separate the layout reorder animation from the tap animation (currently both share a 0.1s transition, making the sort feel invisible)
- Animate the checkmark circle (scale in with spring on completion)
- Add swipe-right gesture to complete a habit (mirrors existing swipe-left to skip)
- Fix long-press / click race condition in `HabitCard` (menu open can race with the click handler)
- Add a 3-second undo toast when a habit is completed (allows accidental-tap recovery)

## Capabilities

### New Capabilities

- `habit-toggle-optimistic`: Optimistic toggle UX — instant visual feedback on tap, server sync in background, rollback on failure, undo toast

### Modified Capabilities

- `today-tab`: Reorder animation is now spring-based and visually distinct from the tap animation; swipe-right completes a habit in addition to swipe-left skipping

## Impact

- `web/src/app/app/TodayView.tsx` — replace `handleToggleComplete` with `useMutation` + optimistic update
- `web/src/app/app/HabitCard.tsx` — checkmark spring animation, swipe-right gesture, fix long-press/click race
- `web/src/components/UndoToast.tsx` — new toast component (or reuse shadcn `Sonner` if available)
- No API or schema changes — same `upsertDay` endpoint, just called via mutation
