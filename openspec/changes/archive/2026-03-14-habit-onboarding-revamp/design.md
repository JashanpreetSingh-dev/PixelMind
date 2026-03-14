## Context

PixelMind's habit tracker is built around the idea that each habit has a distinct color — the pixel mosaic only makes visual sense if colors are meaningful from day one. The current onboarding bypasses this: three plain text inputs create habits with hardcoded colors (`#38bdf8`, `#a855f7`, `#f97316`) regardless of what the user wants. The backend `POST /onboarding` accepts `List[str]`, so even if the frontend collected colors there'd be no way to send them.

Additionally, `handleEdit` in `TodayView` is a no-op placeholder, making the long-press edit action silently do nothing. The backend `PATCH /habits/{id}` exists and supports name/color/archived, but `HabitUpdate` doesn't accept `icon` or `rhythm`, and there's no edit sheet component.

## Goals / Non-Goals

**Goals:**
- Onboarding shows predefined habit cards with colors; user taps to select, opens existing sheet for custom habits
- At least 1 habit required before continuing
- Colors selected in onboarding are persisted (structured API payload)
- Edit habit via single-pane sheet, wired to existing PATCH endpoint
- PATCH endpoint extended to accept `icon` and `rhythm`
- Re-entry guard on onboarding page

**Non-Goals:**
- Changing the HabitCreationSheet creation flow (unchanged)
- Notification/reminder scheduling (reminder preference storage is already there)
- Multi-language predefined habit names
- Drag-to-reorder habits

## Decisions

### Decision 1: Predefined habits as a frontend constant, not backend-driven

**Chosen**: `PREDEFINED_HABITS` array defined in the frontend (e.g. `lib/predefined-habits.ts`), each entry carrying `{ name, color, icon }`. No backend involvement.

**Alternatives considered**:
- Fetch predefined habits from API: adds a round-trip for static data, complicates the backend with zero benefit at this stage.

**Rationale**: The list is product-curated, not user-generated. It changes rarely. Keeping it in the frontend lets the UI team iterate quickly without API changes. It can be moved server-side later if personalisation is needed.

---

### Decision 2: Reuse HabitCreationSheet for custom habits in onboarding

**Chosen**: "Add your own" button in onboarding opens the existing `HabitCreationSheet`. The habit created through the sheet is held in local state as a selected habit (same shape as predefined selections) and submitted with the rest when the user continues.

**Alternatives considered**:
- Inline name + color row: simpler but loses the rhythm step, creating an inconsistency where onboarding habits have no rhythm.
- Separate stripped-down sheet: code duplication.

**Rationale**: The sheet already handles name/color/rhythm, validation, and duplicate warnings. Reusing it gives custom habits full parity with habits created post-onboarding.

---

### Decision 3: Single-pane edit sheet (not multi-step)

**Chosen**: `HabitEditSheet` is a single bottom sheet showing name input, color palette, and rhythm toggles all at once.

**Alternatives considered**:
- Reuse HabitCreationSheet in edit mode: the 3-step flow is good for discovery but creates friction when you just want to change a color. Users already know their habit; they don't need to be walked through all three steps again.

**Rationale**: Industry standard for edit flows (Notion, Linear, Streaks) is a compact single-pane form. The multi-step creation flow is optimised for the "I don't know what I want yet" moment; editing is the opposite.

---

### Decision 4: Structured onboarding payload — `List[{name, color, icon?}]`

**Chosen**: Update `OnboardingPayload` in the backend to accept `habits: List[OnboardingHabit]` where `OnboardingHabit` has `name`, `color`, and optional `icon`. The backend uses the provided color directly.

**Alternatives considered**:
- Keep `List[str]`, auto-assign colors from HABIT_PALETTE on backend: colors still wouldn't match what the user saw during onboarding.

**Rationale**: The whole point of the onboarding revamp is that colors are user-visible and meaningful. The backend must persist what the user chose.

---

### Decision 5: Onboarding re-entry guard on the page itself

**Chosen**: `onboarding/page.tsx` calls `GET /me` server-side on load; if `onboarding_completed: true`, redirects to `/app`.

**Rationale**: The guard already exists in `/app/page.tsx` (redirect to onboarding when not complete). The reverse guard is symmetric and keeps the two pages mutually exclusive. No new endpoint needed.

## Risks / Trade-offs

- **Predefined habit colors collide with HABIT_PALETTE**: If predefined habits use colors outside HABIT_PALETTE, the edit sheet's palette picker won't show the current color as selected. → Mitigation: ensure all predefined habit colors are drawn from HABIT_PALETTE.

- **Custom habit added in onboarding then abandoned**: If user opens HabitCreationSheet, creates a custom habit into local state, then closes the onboarding without submitting — the habit is discarded silently. This is acceptable (no partial data sent to server), but the UX should make it clear that nothing is saved until "Continue" is tapped.

- **`PATCH /habits/{id}` backward compat**: Adding optional `icon` and `rhythm` fields to `HabitUpdate` is additive and non-breaking. Clients that don't send these fields get the same behavior as before.

- **Streak data bounded by 30-day window**: `computeStreak` in `TodayView` silently caps at 30 days. This is a pre-existing issue, not introduced by this change. Out of scope here.
