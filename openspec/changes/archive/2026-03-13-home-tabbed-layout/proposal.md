## Why

The current home screen stacks the mosaic and habit cards vertically, creating two competing surfaces with no clear hierarchy — the mosaic pushes the actionable checklist down and the connection between each mosaic row and its habit card is invisible. Replacing this with a three-tab layout (Today / Mosaic / Tonight) gives each surface its own focused space, puts action first, and integrates the reflection entry point as a first-class tab rather than a footer banner.

## What Changes

- **Standalone mosaic strip removed** from the Today view — replaced by the Mosaic tab
- **Three-tab navigation** added to the home screen header area: Today, Mosaic, Tonight
- **Today tab**: habit cards only — action-first; completed habits animate to the bottom of the list; inline progress counter (`3 / 6 done`) in the header
- **Mosaic tab**: per-habit labeled rows (color dot + short name on the left, 30-day pixel grid scrolling right)
- **Tonight tab**: time-aware tab state — before 8pm the tab is visually dimmed/disabled; at or after 8pm the tab becomes active with a teal pulse; tapping the active tab shows an inline panel (prompt + mood + "Start writing" CTA) rather than navigating away; **stub for now** — panel content is placeholder copy, journal write functionality is out of scope for this change
- **Reflection bar removed** — its role is taken over by the Tonight tab state
- **Completed habits sink** — when a habit is marked complete it animates to the bottom of the Today list; uncompleting moves it back up

## Capabilities

### New Capabilities

- `home-tabbed-layout`: Three-tab home screen (Today / Mosaic / Tonight), tab switching, tab states, and the overall layout contract
- `today-tab`: Today tab content — habit list with progress counter, completed-sinks behavior, add-habit entry
- `mosaic-tab`: Mosaic tab content — labeled per-habit rows with 30-day scrollable grid
- `tonight-tab`: Tonight tab — locked/unlocked states, inline panel stub when unlocked

### Modified Capabilities

- `today-screen-redesign`: Reflection bar requirement superseded by the Tonight tab; standalone mosaic strip requirement superseded by the Mosaic tab

## Impact

- **Frontend**: `TodayView.tsx` restructured around tabs; mosaic grid extracted to a `MosaicTab.tsx` component; new `TonightTab.tsx` stub; `HabitCard.tsx` gains completed-sink animation
- **No backend changes** — all data contracts unchanged (`GET /habits`, `GET /days`, upsert day)
- **No new dependencies** expected — tab state is local React state; animation via existing `framer-motion`
