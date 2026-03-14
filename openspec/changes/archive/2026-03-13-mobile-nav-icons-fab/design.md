## Context

Mobile navigation currently uses `BottomNav.tsx` — a fixed bottom bar with 4 text-only links and no icons. The habit creation entry point is a text link inside `TodayView` content. The layout renders `BottomNav` at the app shell level (`layout.tsx`) and `TodayView` manages its own creation entry point.

## Goals / Non-Goals

**Goals:**
- Replace text labels in `BottomNav` with Lucide icons, keeping 44px touch targets
- Add a `HabitFAB` component as the single creation entry point on the home route
- Remove creation entry points from `TodayView` content

**Non-Goals:**
- Desktop sidebar changes — stays as-is
- Hamburger/drawer navigation — icons-only bottom nav is the chosen approach
- Animated tab transitions or custom icon sets

## Decisions

### lucide-react for icons

**Decision**: Install `lucide-react` as the icon library.

**Rationale**: Already implied by the shadcn/ui setup in the project. Provides `House`, `BookOpen`, `BarChart2`, `Settings`, and `Plus` — exactly what's needed. Tree-shakeable, consistent stroke style.

**Alternative considered**: Inline SVGs. Rejected — more verbose, harder to maintain, no consistency guarantee.

### FAB uses `creationSheetOpenAtom`

**Decision**: `HabitFAB` imports and sets `creationSheetOpenAtom` (Jotai atom already defined in `TodayView.tsx`) to open the habit creation sheet.

**Rationale**: `HabitCreationSheet` is already mounted in `TodayView` and listens to this atom. The FAB just needs to flip it — no prop drilling, no new state.

**Note**: `creationSheetOpenAtom` should be moved to a shared module (e.g. `lib/atoms.ts`) so `HabitFAB` can import it without depending on `TodayView`. Currently it's defined inside `TodayView.tsx`.

### FAB rendered in layout, not TodayView

**Decision**: `HabitFAB` is rendered in `app/layout.tsx` alongside `BottomNav`, using `usePathname()` to show only on `/app`.

**Rationale**: The FAB is a navigation-level element (like the bottom nav), not a content element. Placing it in layout ensures it appears above the bottom nav consistently and doesn't get unmounted on tab switches within TodayView.

### FAB hidden at habit capacity

**Decision**: FAB is hidden (not just disabled) when the user has 10 habits. The FAB fetches habit count via React Query (same `["habits"]` cache already populated by TodayView).

**Rationale**: Showing a disabled `+` with no explanation is confusing. Hiding it entirely is cleaner since `TodayView` already communicates capacity via the habit list.

## Risks / Trade-offs

- **`creationSheetOpenAtom` move** → Moving to `lib/atoms.ts` requires updating the import in `TodayView.tsx`. Low risk, straightforward refactor.
- **FAB z-index** → FAB must render above bottom nav (z-20 vs z-10). Needs careful layering to avoid clipping by the nav bar.
- **Safe area inset** → FAB bottom position must account for `env(safe-area-inset-bottom)` on iOS, same as the bottom nav. Use `bottom: calc(56px + max(1rem, env(safe-area-inset-bottom)))` to float above the nav.
