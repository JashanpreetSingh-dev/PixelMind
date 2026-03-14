## Why

The current onboarding is three plain text inputs with hardcoded colors — it doesn't reflect the color-per-habit identity that is core to PixelMind, and gives new users no sense of what they're building. This change rebuilds onboarding end-to-end: predefined habit suggestions with colors, custom habit creation via the existing sheet, and a structured API that persists user-chosen colors. It also closes the edit-habit gap (currently a no-op) so the full habit lifecycle works.

## What Changes

- **Onboarding screen** replaced with a visual grid of ~8 predefined habit cards, each carrying a color; users tap to select/deselect, with a "+ Add your own" option that opens the existing `HabitCreationSheet`
- **Minimum 1 habit** required before the user can continue; the Continue button is disabled until at least one is selected
- **Primary feeling** selector kept as a second section below the habit grid
- **`POST /onboarding` API** updated to accept structured habits `[{name, color, icon?}]` instead of plain strings, so user-chosen colors are persisted
- **`PATCH /habits/{id}` API** extended to support `icon` and `rhythm` in updates
- **`HabitEditSheet`** new single-pane edit sheet (name + color palette + rhythm), wired to the existing patch endpoint; replaces the no-op `handleEdit` in `TodayView`
- **Onboarding re-entry guard** added: visiting `/app/onboarding` when already onboarded redirects to `/app`

## Capabilities

### New Capabilities

- `onboarding-habit-selection`: Redesigned onboarding screen — predefined habit cards with colors, custom habit creation via existing sheet, structured submission to backend
- `habit-edit`: Edit-habit sheet for modifying name, color, and rhythm of an existing habit

### Modified Capabilities

- `habit-creation-flow`: `PATCH /habits/{id}` gains `icon` and `rhythm` update support (backend model change); no frontend creation flow changes

## Impact

- **Frontend**: `web/src/app/app/onboarding/page.tsx` (full rewrite), new `HabitEditSheet.tsx`, `TodayView.tsx` (wire `handleEdit`)
- **Backend**: `api/main.py` — `OnboardingPayload` model changed to structured habits; `HabitUpdate` model gains `icon` and `rhythm` fields
- **No new API routes**: all changes are to existing endpoints
- **No breaking changes to `/habits` or `/days`**
