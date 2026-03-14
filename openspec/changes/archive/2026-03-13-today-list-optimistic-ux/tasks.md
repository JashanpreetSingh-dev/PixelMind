## 1. Optimistic Toggle (TodayView)

- [x] 1.1 Replace `handleToggleComplete`'s `await + refetch()` with a `useMutation` that patches the `["days", start, end]` cache optimistically in `onMutate`, rolls back in `onError`, and invalidates in `onSettled`
- [x] 1.2 Capture a cache snapshot in `onMutate` and restore it in `onError` for automatic rollback
- [x] 1.3 Add `pendingUndo: { habitId: string; previousIds: string[] } | null` state to `TodayView`; set it in `onSuccess` of the completion mutation; clear it on undo or after 3s

## 2. Undo Toast

- [x] 2.1 Create `web/src/components/UndoToast.tsx` — fixed bottom-center bar, above bottom nav (`bottom: calc(56px + max(1rem, env(safe-area-inset-bottom)) + 0.5rem)`), with habit name, "Undo" button, and 3s auto-dismiss using `AnimatePresence`
- [x] 2.2 Render `<UndoToast>` in `TodayView`, passing `pendingUndo` and an `onUndo` callback that fires a second mutation restoring the previous completed IDs

## 3. HabitCard Fixes

- [x] 3.1 Add a `didLongPress` ref to `HabitCard`; set it `true` when the long-press timer fires, check and reset it at the top of `handleClick` to prevent the race condition
- [x] 3.2 Add swipe-right to complete: in `handleTouchEnd`, detect `delta < -60` and call `onToggleComplete(habit._id)` if not already completed

## 4. Animation Polish

- [x] 4.1 Split the `motion.div` transition in `HabitCard` so layout uses a spring (`{ type: "spring", stiffness: 300, damping: 30 }`) and the default (tap) uses `{ duration: 0.1 }`
- [x] 4.2 Wrap the `AnimatePresence` list in `TodayView` with a `<LayoutGroup>` for coordinated reorder animations
- [x] 4.3 Animate the checkmark circle in `HabitCard`: wrap the `✓` in `<AnimatePresence>` with `initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}` and a spring transition
