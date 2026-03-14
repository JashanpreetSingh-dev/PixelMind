# onboarding-habit-selection Specification

## Purpose
TBD - created by archiving change habit-onboarding-revamp. Update Purpose after archive.
## Requirements
### Requirement: Onboarding shows predefined habit cards with colors
The onboarding screen SHALL display a grid of 6–8 predefined habit options. Each option SHALL be presented as a tappable card showing the habit name, a color swatch, and an optional icon. The predefined options SHALL be defined as a frontend constant (`PREDEFINED_HABITS`) where each entry carries `name`, `color` (hex, from HABIT_PALETTE), and optional `icon`. The user SHALL tap a card to select or deselect it; selected cards SHALL be visually distinct (e.g. filled border, checkmark, or highlighted background).

#### Scenario: Predefined habits displayed on load
- **WHEN** a first-time user arrives at the onboarding screen
- **THEN** the system SHALL display 6–8 predefined habit cards in a grid layout
- **AND** each card SHALL show the habit name, a color swatch matching the predefined color, and an optional icon
- **AND** all cards SHALL start in a deselected state

#### Scenario: Tapping a card selects it
- **WHEN** the user taps a deselected predefined habit card
- **THEN** the card SHALL change to a selected visual state (e.g. border highlight, checkmark overlay)
- **AND** the habit SHALL be added to the pending selection

#### Scenario: Tapping a selected card deselects it
- **WHEN** the user taps a selected predefined habit card
- **THEN** the card SHALL return to deselected state
- **AND** the habit SHALL be removed from the pending selection

### Requirement: At least one habit must be selected to continue
The onboarding Continue button SHALL remain disabled until the user has selected at least one habit (predefined or custom). Once at least one habit is selected the button SHALL become enabled. The UI SHOULD communicate the minimum requirement (e.g. "Select at least 1 habit to continue").

#### Scenario: Continue disabled with no selection
- **WHEN** the user has zero habits selected
- **THEN** the Continue button SHALL be disabled or visually inactive
- **AND** the user SHALL NOT be able to proceed to the app

#### Scenario: Continue enabled after first selection
- **WHEN** the user selects at least one habit (predefined or custom)
- **THEN** the Continue button SHALL become enabled
- **AND** the user SHALL be able to proceed

### Requirement: Custom habit creation from onboarding via existing sheet
The onboarding screen SHALL provide an "Add your own" button (or equivalent) that opens the existing `HabitCreationSheet`. When the user completes the habit creation flow in the sheet, the resulting habit (name, color, rhythm, icon) SHALL be added to the pending onboarding selection and displayed alongside the predefined options. The user SHALL be able to remove a custom habit from the selection before submitting.

#### Scenario: Add your own opens HabitCreationSheet
- **WHEN** the user taps "Add your own" (or equivalent) on the onboarding screen
- **THEN** the system SHALL open the `HabitCreationSheet` in creation mode
- **AND** the sheet SHALL behave identically to how it behaves from the Today screen

#### Scenario: Custom habit appears in selection after creation
- **WHEN** the user completes the HabitCreationSheet flow
- **THEN** the sheet SHALL close
- **AND** the new custom habit SHALL appear in the onboarding selection area as selected
- **AND** it SHALL count toward the minimum selection requirement

#### Scenario: Custom habit can be removed before submission
- **WHEN** the user has added a custom habit to the onboarding selection
- **THEN** the system SHALL provide a way to remove it (e.g. tap an X or deselect)
- **AND** removing it SHALL decrement the selection count

### Requirement: Onboarding submits structured habits with colors
When the user continues from onboarding, the system SHALL submit all selected habits (predefined and custom) as structured objects containing at minimum `name` and `color` to `POST /onboarding`. The backend SHALL create one habit document per entry using the provided color. The hardcoded color palette previously used by the backend SHALL no longer apply.

#### Scenario: Submission includes color for each habit
- **WHEN** the user taps Continue with one or more habits selected
- **THEN** the system SHALL send `POST /onboarding` with `{ habits: [{name, color, icon?}, ...], primary_feeling? }`
- **AND** the backend SHALL create a habit document for each entry using the provided `color`
- **AND** the backend SHALL NOT override the color with a hardcoded value

#### Scenario: Submission succeeds and redirects to home
- **WHEN** `POST /onboarding` returns a success response
- **THEN** the system SHALL set `onboarding_completed: true` for the user
- **AND** SHALL redirect the user to `/app` (the Today screen)

### Requirement: Onboarding re-entry guard
If a user who has already completed onboarding navigates to `/app/onboarding`, the system SHALL redirect them to `/app` without showing the onboarding screen. The check SHALL be performed server-side using `GET /me`.

#### Scenario: Already-onboarded user redirected
- **WHEN** a user with `onboarding_completed: true` visits `/app/onboarding`
- **THEN** the system SHALL redirect them to `/app`
- **AND** SHALL NOT render the onboarding UI

#### Scenario: New user sees onboarding normally
- **WHEN** a user with `onboarding_completed: false` visits `/app/onboarding`
- **THEN** the system SHALL render the onboarding screen normally

