## 1. Theme — expand color palette

- [x] 1.1 Add 8 new colors to `HABIT_PALETTE` in `web/src/lib/theme.ts`: Coral `#fb7185`, Violet `#a78bfa`, Teal `#2dd4bf`, Gold `#f59e0b`, Lilac `#e879f9`, Ocean `#38bdf8`, Crimson `#f43f5e`, Forest `#4ade80`
- [x] 1.2 Verify existing 8 palette entries remain at the same indices (no breaking change to stored colors)

## 2. Icon library

- [x] 2.1 Create `web/src/lib/habit-icons.ts` exporting `HABIT_ICONS` — array of 28 emoji with category labels (Physical, Wellness, Mind/Work, Habits) as defined in the spec
- [x] 2.2 Export `ICON_SUGGESTIONS: Record<string, string>` — keyword → emoji map for auto-suggestion (run→🏃, water→💧, read→📚, sleep→🌙, meditate→🧘, walk→🚶, exercise→💪, journal→✍️, focus→🎯, music→🎵, yoga→🤸, swim→🌊, bike→🚴, stretch→🤸, diet→🥗, vitamins→💊, gratitude→🙏, clean→🧹, finance→💰, garden→🌱)
- [x] 2.3 Export `suggestIcon(name: string): string` helper that prefix-matches name against `ICON_SUGGESTIONS` and returns ⭐ as fallback

## 3. HabitCard — icon + color tint

- [x] 3.1 Update `HabitCard` to accept `icon?: string` on the `Habit` type (already in DB, just thread it through)
- [x] 3.2 Replace the 10px color square `div` with a `<span>` rendering `habit.icon ?? "⭐"` at ~20px (text-xl)
- [x] 3.3 Apply color tint to card: incomplete → `backgroundColor: habit.color` at 8% opacity + border at 30%; completed → 14% bg + 40% border (use inline styles with hex + alpha or `rgba`)
- [x] 3.4 Remove the hard-coded `border-today-card-border` / `bg-today-card-bg` / `border-today-completed-border` / `bg-today-completed-bg` classes from the card wrapper (replaced by inline color tint)

## 4. HabitCreationSheet — Appearance step

- [x] 4.1 Add `icon` state to the sheet (default from `suggestIcon(name)` when advancing from Name step)
- [x] 4.2 Rename step label: `STEP_NAMES[1]` changes from `"Color"` to `"Appearance"`
- [x] 4.3 On Step 1 (Appearance): render icon picker above a divider — category label + icon grid per category, teal ring on selected icon
- [x] 4.4 On Step 1 (Appearance): render color swatches below divider — now 16 colors from expanded `HABIT_PALETTE`, 4-per-row or 8-per-row grid
- [x] 4.5 Include `icon` in the `handleSubmit` payload (both API path and `onCollect` path)
- [x] 4.6 Include `icon` in the `reset()` function (clear back to `suggestIcon("")` or ⭐)

## 5. HabitEditSheet — icon picker + expanded palette

- [x] 5.1 Add `icon` state to `HabitEditSheet`, initialized from `habit.icon ?? "⭐"`
- [x] 5.2 Render the same icon picker grid (reuse component or inline same structure) in the edit sheet
- [x] 5.3 Update color swatches in edit sheet to use expanded 16-color palette
- [x] 5.4 Include `icon` in the `PATCH /habits/{id}` payload on save

## 6. OnboardingContent — icon in predefined habits

- [x] 6.1 Verify `PREDEFINED_HABITS` in `predefined-habits.ts` has icons for all 8 entries (already present — confirm no change needed)
- [x] 6.2 Pass `icon` through `onCollect` in `HabitCreationSheet` when used from onboarding (already in `CollectedHabit` type — confirm)

## 7. MosaicTab — calendar grid redesign

- [x] 7.1 Add `getLast90DaysRange()` helper in MosaicTab (or a shared util) returning start/end ISO strings and a `dates` array of 90 entries
- [x] 7.2 Add a `useQuery` inside `MosaicTab` for the 90-day range using `fetchDaysClient` — show skeleton (3 ghost cards) while loading
- [x] 7.3 Build `buildCalendarGrid(dates: string[], todayIso: string): { weekIndex: number; dayOfWeek: number; dateIso: string }[]` — maps each date to its row (0=Mon … 6=Sun) and column (week index, 0=oldest)
- [x] 7.4 Render one card per habit: header row with `habit.icon ?? "⭐"`, `habit.name`, and `🔥 N` streak (reuse `computeStreak` logic — accept as prop or inline)
- [x] 7.5 Render the 7×12 cell grid: fixed left column with day labels (Mo–Su), scrollable right area with the pixel cells
- [x] 7.6 Implement 4-state cell rendering: completed (habit color + opacity fade), today-not-done (transparent + habit color border), missed (habit color at 12%), future (white at 8%)
- [x] 7.7 Remove old single-row rendering logic from MosaicTab entirely
- [x] 7.8 Pass `streak` computation into MosaicTab from TodayView (or accept `daysByDate` as prop and compute inline — already passed)

## 8. TodayView — thread icon through

- [x] 8.1 Ensure `Habit` type in `TodayView.tsx` includes `icon?: string` so it flows down to `HabitCard`
- [x] 8.2 Confirm `HabitCard` receives `habit` with `icon` field (no structural change needed if `habit` object is passed whole)
