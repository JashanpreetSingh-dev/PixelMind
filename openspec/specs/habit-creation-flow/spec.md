# habit-creation-flow Specification

## Purpose
Defines the habit creation flow — a three-step sheet (Name → Appearance → Rhythm) with icon selection, 16-color palette, and API persistence of icon and rhythm fields.

## Requirements
### Requirement: PATCH /habits/{id} accepts icon and rhythm updates
The backend `PATCH /habits/{id}` endpoint SHALL accept optional `icon` (string) and `rhythm` (object) fields in the update payload, in addition to the existing `name`, `color`, and `archived` fields. When provided, the backend SHALL persist these fields and return the updated habit document including all stored fields. When not provided, the existing values SHALL remain unchanged.

#### Scenario: Update with icon and rhythm
- **WHEN** the client sends `PATCH /habits/{id}` with `{ icon: "📚", rhythm: { type: "daily" } }`
- **THEN** the backend SHALL update the habit document with the new icon and rhythm values
- **AND** SHALL return the updated habit including `icon` and `rhythm` in the response

#### Scenario: Update without icon or rhythm leaves them unchanged
- **WHEN** the client sends `PATCH /habits/{id}` with only `{ name: "New name" }`
- **THEN** the backend SHALL update only the name
- **AND** the existing `icon` and `rhythm` values SHALL remain unchanged in the stored document
- **AND** SHALL be returned in the response

### Requirement: Habit creation uses a three-step flow with an Appearance step
The habit creation sheet SHALL use a three-step flow: **Name** → **Appearance** → **Rhythm**. The Appearance step SHALL combine icon selection and color selection on a single screen. The color palette SHALL contain 16 colors. The step title SHALL read "New habit — Appearance" on step 2.

#### Scenario: Appearance step shows icon grid and color swatches
- **WHEN** the user advances from the Name step to the Appearance step
- **THEN** the sheet SHALL display the icon picker grid (28 icons, categorized) above a visual divider
- **AND** SHALL display 16 color swatches below the divider
- **AND** one icon SHALL be pre-selected (auto-suggested or default ⭐)
- **AND** one color SHALL be pre-selected (first palette color or previously selected)

#### Scenario: User can change both icon and color on the same step
- **WHEN** the user is on the Appearance step
- **THEN** tapping an icon SHALL select it without advancing the step
- **AND** tapping a color swatch SHALL select it without advancing the step
- **AND** the user SHALL tap "Next" to proceed to Rhythm

#### Scenario: Color palette contains 16 colors
- **WHEN** the color swatches are displayed
- **THEN** exactly 16 color options SHALL be shown
- **AND** the 8 original palette colors (Sage, Sky, Lavender, Peach, Rose, Mint, Amber, Slate) SHALL be present
- **AND** 8 new colors (Coral, Violet, Teal, Gold, Lilac, Ocean, Crimson, Forest) SHALL be added

#### Scenario: Onboarding structured payload accepted
- **WHEN** the client sends `POST /onboarding` with `{ habits: [{ name: "Read 20 pages", color: "#38bdf8", icon: "📚" }], primary_feeling: "Calm" }`
- **THEN** the backend SHALL create a habit document with the provided `name`, `color`, and `icon`
- **AND** SHALL NOT override the color with a hardcoded value
- **AND** SHALL mark `onboarding_completed: true` on the user document

