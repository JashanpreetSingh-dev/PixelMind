## 1. Setup

- [x] 1.1 Install `lucide-react` package in `web/`
- [x] 1.2 Move `creationSheetOpenAtom` from `TodayView.tsx` to `web/src/lib/atoms.ts` and update the import in `TodayView.tsx`

## 2. Bottom Nav Icons

- [x] 2.1 Replace text-only links in `BottomNav.tsx` with Lucide icon buttons (`House`, `BookOpen`, `BarChart2`, `Settings` at 22px)
- [x] 2.2 Apply teal accent color (`today-accent`) to active icon and muted color to inactive icons
- [x] 2.3 Ensure each nav button has a minimum 44×44px touch target

## 3. HabitFAB Component

- [x] 3.1 Create `web/src/components/HabitFAB.tsx` — circular `+` button fixed bottom-right, sets `creationSheetOpenAtom` on tap
- [x] 3.2 Position FAB above bottom nav and safe area: `bottom: calc(56px + max(1rem, env(safe-area-inset-bottom)))` with `z-20`
- [x] 3.3 Hide FAB when user has 10 habits (fetch habit count via React Query `["habits"]` cache)
- [x] 3.4 Render `HabitFAB` in `web/src/app/app/layout.tsx` alongside `BottomNav`, visible only when `pathname === "/app"`

## 4. TodayView Cleanup

- [x] 4.1 Remove the `+ Add habit` inline text link from the bottom of the habit list in `TodayView.tsx`
- [x] 4.2 Remove the `Add your first habit +` button from the empty state in `TodayView.tsx` (keep shimmer ghost cards)
