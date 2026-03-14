## Context

The app currently stores `icon` and `color` on habits but only exposes `color` in the UI (as a 10px square dot on HabitCard). The `HABIT_PALETTE` in `theme.ts` has 8 colors. The MosaicTab renders a single horizontal row of 30 pixels per habit — adequate for streak visibility but unable to reveal day-of-week patterns. The HabitCreationSheet has a 3-step flow (Name → Color → Rhythm) with no icon step.

## Goals / Non-Goals

**Goals:**
- Expose icon selection in habit creation and edit flows
- Make HabitCard visually distinctive per habit using icon + color tint
- Redesign MosaicTab as a per-habit 7-row × 12-week calendar grid (GitHub/Habit Pixel style)
- Expand HABIT_PALETTE to 16 colors
- Keep the creation flow at 3 steps (merge icon + color into one Appearance step)

**Non-Goals:**
- Custom color input (hex picker) — palette only
- Custom emoji upload — fixed curated set of 28
- Push notifications or reminders (reminder checkbox is a stub)
- Backend changes — `icon` field already supported

## Decisions

### Icon + Color merged into one Appearance step

**Decision**: Keep the creation sheet at 3 steps (Name → Appearance → Rhythm) by showing the icon grid and color swatches on the same step.

**Rationale**: 4 steps would feel long for a mobile bottom sheet. Icon and color are both "personality" decisions — presenting them together lets the user build a mental picture of the habit in one step. The icon grid sits above the color swatches with a divider.

**Alternative considered**: Separate icon step (4 steps total). Rejected because the flow already has a rhythm step that requires thought; adding a 4th step increases abandonment risk.

### Icon auto-suggestion from habit name

**Decision**: When the user types a habit name on Step 1, pre-select an icon on the Appearance step using a keyword → icon map (e.g. "run" → 🏃, "water" → 💧, "read" → 📚).

**Rationale**: Reduces friction — most users pick the obvious icon anyway. The pre-selection is overridable; it just sets a sensible default so the Appearance step feels pre-filled rather than blank.

**Implementation**: A static `ICON_SUGGESTIONS: Record<string, string>` map in a new `predefined-icons.ts` file. Keywords are prefix-matched against the lowercased habit name.

### MosaicTab fetches its own 90-day range lazily

**Decision**: MosaicTab owns a `useQuery` for a 90-day date range (`getLast90DaysRange`). TodayView continues to fetch 30 days. The 90-day fetch fires only when the Mosaic tab is first opened.

**Rationale**: Today tab initial load is the critical path. 90 days = 3× more data that most users on a given session may never need. React Query caches after first open, making subsequent tab switches instant.

**Alternative considered**: Always fetch 90 days globally in TodayView. Rejected — slows initial render and wastes bandwidth for users who never open Mosaic.

### 4-state cell rendering in the calendar grid

**Decision**: Each cell in the 7×12 grid renders one of four states:
- **Completed**: `backgroundColor: habit.color`, full opacity with left→right opacity fade (0.35→1.0 across weeks)
- **Today (not yet done)**: transparent background + 1px border in `habit.color` at 60% opacity
- **Missed (past, not done)**: `backgroundColor: habit.color` at 12% opacity
- **Future**: `backgroundColor: white` at 8% opacity (neutral grey-ish)

**Rationale**: Tinting missed cells with the habit color (rather than a neutral grey) keeps each habit card visually cohesive — the card reads as "a field of this color with lit-up cells". Future cells use a neutral because they carry no habit-specific meaning.

### HabitCard color identity via background tint

**Decision**: The card `background-color` becomes `habit.color` at 8% opacity when incomplete, 14% when complete. The border becomes `habit.color` at 30% (incomplete) / 40% (complete). The 10px color square dot is removed; the emoji icon replaces it at ~20px.

**Rationale**: Ambient color identity is more readable at a glance than a small color dot, and avoids the visual noise of showing both icon and dot. The tint is subtle enough not to clash with text legibility on the dark background.

### HABIT_PALETTE expansion to 16 colors

**Decision**: Add 8 new colors to `theme.ts` HABIT_PALETTE (Coral, Violet, Teal, Gold, Lilac, Ocean, Crimson, Forest). Keep existing 8 at the same indices to avoid breaking stored color values.

**Rationale**: 8 colors is limiting for users with 6-10 habits who want each to feel distinct. 16 covers the realistic maximum with room to spare.

## Risks / Trade-offs

- **Existing habits have no icon** → Show a fallback (e.g. ⭐ or the first letter of the habit name) when `habit.icon` is null. After this change, new habits always get an icon.
- **Color tint legibility** → Dark text on a tinted dark background must maintain contrast. Using 8-14% opacity on the app's dark background (`#0f1117` or similar) keeps tint subtle enough. Test with lightest palette color (Sage `#86efac`).
- **90-day fetch latency on first Mosaic open** → Show a skeleton loader (3 ghost rows) while fetching. Loading state is only visible once per session.
- **Calendar grid alignment** → The 7-row grid must start on Monday and align columns to calendar weeks. `getDay()` is 0=Sunday; offset needed to make Monday = row 0.

## Open Questions

- Should the icon be editable from the HabitCard long-press menu directly, or only through the edit sheet? → Edit sheet only for now (keep menu minimal).
- Should the Mosaic card header show the current streak count alongside the habit name? → Yes, show streak as `🔥 N` in the card header (reuse `computeStreak` from TodayView).
