# Today Screen Redesign

## Why

The Today screen should feel focused, dense, and visually consistent: a single place to see recent history (per-habit mosaic), act on today’s habits (clear cards and tap targets), and be reminded of the nightly reflection. The current layout uses a single aggregate mosaic row, generic card styling, and a reflection CTA that only appears after 7pm, which underuses the space and doesn’t match the intended dark, teal-accented visual language. We’re redesigning the Today screen to match a concrete vision: stronger hierarchy, per-habit history strip, refined cards with explicit tap targets and completed-state styling, an always-visible reflection bar (with unlock time), and a no-empty-space empty state with ghost cards and shimmer.

## What Changes

- **Header**: Muted date line (e.g. "Friday, Mar 13") and a large white greeting ("Good afternoon, Jashan"). No functional change to greeting logic; visual hierarchy and typography updated.
- **Mosaic strip**: Replace the single aggregate row with a **per-habit** horizontal strip: one row per habit, each cell a small colored pixel for that habit; past days fade from dim (left) to bright (right) toward today; future days render as dark (#151821) squares; strip scrolls horizontally.
- **Habit cards**: Redesign with fixed dark background (#151821), 1px border (#2a2d32), 14px radius; left = small colored dot + habit name (white, 500 weight) + muted streak line ("Start your streak" or "Day N streak"); right = circular tap target. On complete: circle fills teal (#1D9E75) with white checkmark, card border → #0d4d33, background → #0a1a12. Long-press / swipe behavior preserved (edit, skip, delete) per existing capability.
- **Reflection bar**: Add a persistent bottom bar (above nav) with teal tint, copy "Tonight's reflection unlocks at 8pm" and a small pulsing dot when before unlock; after 8pm, bar shows actionable CTA (e.g. "Start tonight's reflection") and links to journal. Unlock time is 8pm (product decision for this redesign).
- **Empty state**: Replace single centered card + "Add habit" button with three ghost placeholder cards with shimmer animation and a subtle "Add your first habit +" label that opens habit creation. No large empty white space.
- **Page and shell**: Today screen background #0d0f12. Bottom nav (Home, Journal, Insights, Settings) unchanged in structure; active tab uses teal (#1D9E75) for consistency with the new accent on Today.
- **FAB**: Remove or repurpose the floating "+" when the empty state uses "Add your first habit +"; when user has habits, keep a clear way to add more (e.g. inline or small link) so add-habit remains discoverable.

## Capabilities

### New Capabilities

- **today-screen-redesign**: Covers the redesigned Today screen: header, per-habit mosaic strip, habit cards (layout and completed state), reflection bar (unlock at 8pm), empty state (ghost cards + shimmer), and Today-specific colors. Contract for completion toggle, mosaic data, and streak unchanged from existing APIs.

### Modified Capabilities

- None. Existing `today-screen` behavior is superseded by this change’s scope; the new spec defines the target behavior for the Today screen.

## Impact

- **Frontend**: `TodayView.tsx`, `HabitCard.tsx`, and any shared layout/wrapper for the Today route; new or updated CSS variables/classes for Today-specific palette (#0d0f12, #151821, #2a2d32, #1D9E75, #0d4d33, #0a1a12).
- **Bottom nav**: `BottomNav.tsx` — active tab color updated to teal (#1D9E75) so Today (and other tabs) match the new accent.
- **Data**: No API changes; existing `GET /days`, `GET /habits`, and day upsert used as-is. Mosaic uses same 30-day range and `completed_habit_ids`; streak logic unchanged.
- **Reflection time**: Product rule for "reflection unlocks at" changes from 7pm to 8pm for this screen; reflection bar copy and visibility driven by 8pm.
