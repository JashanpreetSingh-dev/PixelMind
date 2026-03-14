## Context

`TodayView` toggles habit completion by: (1) awaiting `upsertDayClient`, then (2) calling `refetch()` which invalidates queries and triggers a server round-trip. The UI only updates after the server responds — typically 100–300ms after the tap. `sortedHabits` re-derives from the fresh data, causing the card to visually jump position rather than animate. There is no rollback path if the server call fails.

`HabitCard` has a secondary bug: `handlePointerDown` starts a 500ms long-press timer, but on release the `onClick` fires synchronously. Because React state updates (`setMenuOpen(true)`) are batched, the `menuOpen` flag is still `false` when `handleClick` runs, so the toggle fires alongside the menu opening.

## Goals / Non-Goals

**Goals:**
- Tap a card → checkmark and card tint change within one frame (no server wait)
- Card reorders to completed section with a spring animation that is visually distinct from the 0.1s tap-scale
- Long press opens the context menu without also firing a toggle
- Swipe right completes a habit (mirrors swipe left = skip)
- A 3-second undo toast appears after completion; dismissing it or waiting cancels any pending undo

**Non-Goals:**
- Server-side optimistic locking or conflict resolution (single user, no concurrency issue)
- Offline queue / sync — we still require a network connection, just don't block the UI on it
- Animated undo (card doesn't animate back from completed section on undo, just refetches)

## Decisions

### React Query `useMutation` with `onMutate` for optimistic update

**Decision**: Replace the manual `await + refetch()` pattern with `useMutation`. In `onMutate`, directly set the `["days", start, end]` cache entry to reflect the toggled state. In `onError`, roll back using the snapshot captured at mutation start. In `onSettled`, invalidate to sync with server truth.

**Rationale**: This is the canonical React Query pattern for optimistic UI. It keeps the optimistic state co-located with the mutation that produces it, and rollback is automatic without extra state.

**Alternative considered**: `useOptimistic` (React 19 hook). Rejected — project uses React Query as the data layer; mixing in React's built-in optimistic hook creates two sources of truth for the same cache slice.

### Committed-intent flag to fix long-press/click race

**Decision**: Add a `didLongPress` ref to `HabitCard`. Set it to `true` when the long-press timer fires. In `handleClick`, bail out if `didLongPress.current` is true, then reset it. This decouples the click handler from React state timing.

**Rationale**: `menuOpen` is React state — its update is deferred. A `useRef` is synchronous and readable in the same event tick, making it race-proof.

**Alternative considered**: `e.preventDefault()` on `pointerDown`. Rejected — this breaks accessibility and prevents the browser's default focus behavior.

### Separate `layoutTransition` from tap transition

**Decision**: Pass an explicit `layout` transition to `motion.div` using the `transition` prop's `layout` sub-key:
```tsx
transition={{
  layout: { type: "spring", stiffness: 300, damping: 30 },
  default: { duration: 0.1 },
}}
```
This gives the reorder a distinct spring feel while keeping the tap-scale snappy.

**Rationale**: Framer Motion applies the top-level `transition` to all animation types including `layout`. Splitting them is supported via the `layout` sub-key.

### Checkmark spring animation

**Decision**: Wrap the checkmark circle in a `motion.div` with `initial={{ scale: 0 }} animate={{ scale: 1 }}` triggered by the `completed` prop change. Use `AnimatePresence` on the `✓` character itself with a scale+opacity entrance.

**Rationale**: A sub-200ms spring on the checkmark is the single most satisfying micro-interaction in habit trackers (Streaks, Habitify both do this). It costs nothing to implement with Framer Motion already in the tree.

### Undo toast

**Decision**: Build a minimal `UndoToast` component in `web/src/components/UndoToast.tsx` — a fixed bottom-center bar that appears above the bottom nav (`bottom: calc(56px + max(1rem, env(safe-area-inset-bottom)) + 0.5rem)`), auto-dismisses after 3s, and has an "Undo" button. `TodayView` manages `pendingUndo: { habitId, previousIds } | null` state; undo fires a second mutation that restores the previous state.

**Rationale**: No sonner/toast library is currently installed. The undo toast is simple enough (one instance at a time) that a bespoke component is less overhead than installing a new dependency.

**Alternative considered**: Install `sonner`. Rejected for now — adds a dependency for a single use case. Can be revisited if toast use spreads.

### Swipe-right to complete

**Decision**: Extend the existing `touchStart`/`touchEnd` handler in `HabitCard`. Currently `delta > 60` (left swipe) = skip. Add: `delta < -60` (right swipe, i.e. negative delta) = complete. Guard: if already completed, right swipe is a no-op (or could uncomplete — keep it as no-op to avoid confusion).

**Rationale**: Symmetrical gestures are learnable. Skip left, complete right mirrors common mobile list patterns (e.g., iOS Mail swipe actions).

## Risks / Trade-offs

- **Optimistic flicker on error** → `onError` rolls back the cache snapshot and React Query re-renders. The card will visually snap back. This is acceptable — server errors are rare and the user is shown the reverted state.
- **Undo + server race** → If the user taps undo before `onSettled` fires, the mutation and the undo mutation could interleave. Mitigation: disable undo while the mutation is `isPending`.
- **`LayoutGroup` requirement** → For Framer Motion layout animations to coordinate across the list (preventing overlap during reorder), the list needs to be wrapped in `<LayoutGroup>`. This is a minor addition to `TodayView`.
