## Why

The current habit UI is visually generic — cards show a small color square dot and no icon, and the Mosaic tab renders a single flat row of pixels per habit that reveals streaks but not day-of-week patterns. Users coming from apps like Habit Pixel or Streaks expect a richer, more personalized experience where each habit has visual character and the history view reveals behavioral patterns over time.

## What Changes

- **Habit creation sheet** gains an icon picker (28 emoji icons organized by category) and an expanded color palette (16 colors up from 8), with icon auto-suggestion when the user types a habit name
- **Habit edit sheet** gains the same icon picker and expanded color palette
- **HabitCard** replaces the 10px color square dot with the habit's emoji icon; the card background takes a subtle tint of the habit color to communicate identity
- **MosaicTab** is redesigned from single horizontal pixel rows to per-habit card blocks, each showing a 7-row × 12-week GitHub-style calendar grid with 4 cell states (completed, today-not-done, missed-past, future)
- **MosaicTab** owns its own lazy 90-day data fetch rather than relying on the 30-day range fetched for Today

## Capabilities

### New Capabilities

- `habit-icon-picker`: Icon selection UI used in creation and edit flows — 28 emoji icons in a categorized grid, auto-suggestion from habit name keyword, persisted to API `icon` field
- `habit-card-color-identity`: HabitCard visual redesign — emoji icon replaces color dot, habit color applied as subtle card background tint and border accent
- `mosaic-calendar-grid`: Per-habit 7×12 calendar grid replacing the single-row mosaic — 4-state cell rendering (completed, today-ring, missed-tinted, future-neutral), lazy 90-day fetch, streak shown in card header

### Modified Capabilities

- `habit-creation-flow`: Color step now uses 16-color palette (expanded from 8) and gains an icon selection section

## Impact

- `web/src/app/app/HabitCreationSheet.tsx` — add icon step/section, expand palette
- `web/src/app/app/HabitEditSheet.tsx` — add icon picker, expand palette
- `web/src/app/app/HabitCard.tsx` — replace color dot with emoji icon, add color tint bg
- `web/src/app/app/MosaicTab.tsx` — full redesign to calendar grid
- `web/src/lib/theme.ts` — expand `HABIT_PALETTE` from 8 to 16 entries
- `web/src/lib/predefined-habits.ts` — no change (icons already present)
- `api/main.py` — no change (icon field already supported)
