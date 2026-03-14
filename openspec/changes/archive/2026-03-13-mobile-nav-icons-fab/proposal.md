## Why

The current mobile bottom nav uses text-only labels which consume vertical space and look dated compared to modern PWA conventions. There is no clear primary action affordance for creating habits — the `+ Add habit` text link is buried inside the Today tab content. Replacing labels with icons and adding a floating action button (FAB) brings the navigation in line with native mobile patterns.

## What Changes

- Install `lucide-react` icon library (new dependency)
- `BottomNav` redesigned: icons only (no text labels), teal accent on active item, using Lucide icons (`House`, `BookOpen`, `BarChart2`, `Settings`)
- New `FAB` component: floating `+` button fixed bottom-right, renders only on the `/app` home route, taps to open the habit creation sheet via `creationSheetOpenAtom`
- Remove the inline `+ Add habit` text link from `TodayView` (Today tab content)
- Remove the `Add your first habit +` button from the empty state in `TodayView` (FAB handles all creation entry points)

## Capabilities

### New Capabilities

- `bottom-nav-icons`: Icon-only bottom navigation bar — 4 destinations with Lucide icons, active state in teal accent, 44px touch targets
- `habit-creation-fab`: Floating action button fixed bottom-right on the home route — renders above bottom nav, opens habit creation sheet, hidden at capacity (10 habits)

### Modified Capabilities

- `today-tab`: Inline add-habit controls removed; creation is now exclusively via FAB

## Impact

- `web/package.json` — add `lucide-react`
- `web/src/components/BottomNav.tsx` — full redesign to icon-only
- `web/src/components/HabitFAB.tsx` — new component
- `web/src/app/app/layout.tsx` — render `HabitFAB` alongside `BottomNav`
- `web/src/app/app/TodayView.tsx` — remove `+ Add habit` link and empty state button
