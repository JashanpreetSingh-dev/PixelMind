## 1. Tab Shell — TodayView restructure

- [x] 1.1 Add `activeTab` state (`'today' | 'mosaic' | 'tonight'`) to `TodayView.tsx`, defaulting to `'today'`
- [x] 1.2 Render the three-tab pill/underline control below the header: Today, Mosaic, Tonight; active tab highlighted with teal accent
- [x] 1.3 Wire tab clicks — Today and Mosaic switch `activeTab` freely; Tonight click is a no-op before 8pm, switches tab at or after 8pm
- [x] 1.4 Render tab content conditionally based on `activeTab` (Today content inline, Mosaic via `MosaicTab`, Tonight via `TonightTab`)

## 2. Header — progress counter

- [x] 2.1 Compute `completedCount` (habits completed today) and `totalCount` (all non-archived habits) from existing state in `TodayView`
- [x] 2.2 Render `N / M done` below the greeting when `totalCount > 0` and not all complete
- [x] 2.3 Render `All done ✓` (teal) when `completedCount === totalCount && totalCount > 0`
- [x] 2.4 Hide counter when `totalCount === 0`

## 3. Tonight tab visual state

- [x] 3.1 Compute `isReflectionUnlocked` (hours >= 20) — already exists, reuse
- [x] 3.2 Style Tonight tab: dimmed (`opacity-40`, lock icon `🔒`) before 8pm; full opacity + teal pulsing dot at or after 8pm
- [x] 3.3 Ensure Tonight tab click does nothing when locked (no tab switch, no error)

## 4. Today tab — completed habits sink

- [x] 4.1 In `TodayView`, derive sorted habit list: `[...incompleteHabits, ...completedHabits]` via `useMemo` based on `completedToday`
- [x] 4.2 Add `layout` prop to the `motion.div` wrapping in `HabitCard.tsx` so Framer Motion animates position changes
- [x] 4.3 Wrap the habit list container in `<AnimatePresence>` (or use `layout` on the list) so sort changes animate smoothly
- [x] 4.4 Remove the standalone mosaic strip JSX from `TodayView` (the grid that currently renders above the habit cards)
- [x] 4.5 Remove the reflection bar JSX from `TodayView` (the teal-tinted bar at the bottom)

## 5. MosaicTab component

- [x] 5.1 Create `web/src/app/app/MosaicTab.tsx` accepting `habits`, `dates`, `daysByDate`, `todayIso` as props
- [x] 5.2 Render one row per habit: fixed left label column (color dot + truncated name), scrollable right pixel grid
- [x] 5.3 Use the same 10px cell rendering logic as the current mosaic strip, with left-to-right opacity fade for completed cells
- [x] 5.4 Wrap the pixel grid in `overflow-x-auto` while keeping the label column fixed (e.g. CSS grid or flex with `shrink-0` label)
- [x] 5.5 Render empty state message ("Add habits to see your mosaic") when `habits.length === 0`

## 6. TonightTab component

- [x] 6.1 Create `web/src/app/app/TonightTab.tsx` accepting `isUnlocked: boolean` as prop
- [x] 6.2 Render reflection prompt copy (e.g. "How did today go?") and a "Start writing →" link to `/app/journal`
- [x] 6.3 Add a note or muted subtext indicating the full experience is in the journal (stub state is acceptable)

## 7. Cleanup and wiring

- [x] 7.1 Pass `habits`, `dates`, `daysByDate`, `todayIso` to `MosaicTab` from `TodayView`
- [x] 7.2 Pass `isReflectionUnlocked` to `TonightTab` from `TodayView`
- [x] 7.3 Verify the `HabitCreationSheet` and `HabitEditSheet` still open correctly from the Today tab after restructure
- [x] 7.4 Verify pull-to-refresh (refresh button) still works and updates both Today and Mosaic tab data
