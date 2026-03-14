## ADDED Requirements

### Requirement: Edit habit opens a single-pane bottom sheet
The system SHALL provide a single-pane edit sheet for modifying an existing habit. The sheet SHALL be triggered by the long-press edit action on a habit card in the Today screen (currently a no-op placeholder). The sheet SHALL display all editable fields — name, color, and rhythm — simultaneously in one view, without steps or navigation. The sheet SHALL pre-populate all fields with the habit's current values on open.

#### Scenario: Long-press edit opens the edit sheet
- **WHEN** the user long-presses a habit card and selects "Edit"
- **THEN** the system SHALL open the `HabitEditSheet` for that habit
- **AND** all fields SHALL be pre-populated with the habit's current name, color, and rhythm

#### Scenario: Sheet closes on cancel
- **WHEN** the user taps Cancel or dismisses the sheet without saving
- **THEN** the sheet SHALL close with no changes made to the habit
- **AND** the Today screen SHALL remain unchanged

### Requirement: Edit sheet allows changing name, color, and rhythm
The edit sheet SHALL include: a text input for habit name (pre-filled, same validation as creation — non-empty after trim), the HABIT_PALETTE color picker (pre-selected on current color), and rhythm options (Daily / X times per week / Specific days, pre-selected on current rhythm). The Save button SHALL be enabled when the name is non-empty. The system SHALL warn inline if the edited name duplicates another existing habit (case-insensitive, trimmed), but SHALL NOT block saving.

#### Scenario: Name can be changed
- **WHEN** the user edits the name field in the edit sheet
- **THEN** the Save button SHALL remain enabled as long as the name is non-empty after trim
- **AND** if the new name matches another habit's name (case-insensitive, trimmed), an inline warning SHALL appear

#### Scenario: Color can be changed
- **WHEN** the user selects a different color from the palette
- **THEN** the selected color SHALL be highlighted
- **AND** the change SHALL be applied to the habit when saved

#### Scenario: Rhythm can be changed
- **WHEN** the user changes the rhythm selection (Daily / times per week / specific days)
- **THEN** the new rhythm SHALL be reflected in the UI
- **AND** SHALL be sent to the backend on save

### Requirement: Save persists changes via PATCH /habits/{id}
When the user saves the edit sheet, the system SHALL call `PATCH /habits/{id}` with the updated name, color, icon, and/or rhythm. On success the sheet SHALL close and the Today screen SHALL refresh to reflect the updated habit (name and color updated in cards and mosaic). On failure an inline error SHALL be shown and the sheet SHALL remain open.

#### Scenario: Save updates habit and closes sheet
- **WHEN** the user taps Save with a valid name
- **THEN** the system SHALL call `PATCH /habits/{id}` with the updated fields
- **AND** on success SHALL close the sheet
- **AND** the Today screen SHALL display the updated habit name and color

#### Scenario: Save shows error on failure
- **WHEN** the `PATCH /habits/{id}` call fails
- **THEN** the system SHALL display an inline error message
- **AND** SHALL NOT close the sheet
- **AND** the user SHALL be able to retry or cancel

### Requirement: Edit sheet offers delete (archive) action
The edit sheet SHALL include a destructive "Delete habit" action (e.g. a secondary button or link styled in a muted/destructive color). Activating it SHALL archive the habit (same as the existing delete behavior: `PATCH /habits/{id}` with `archived: true`) after a confirmation step (e.g. a confirm dialog or second tap). The sheet SHALL close on successful deletion and the Today screen SHALL remove the habit.

#### Scenario: Delete requires confirmation
- **WHEN** the user taps "Delete habit" in the edit sheet
- **THEN** the system SHALL show a confirmation prompt (e.g. "Are you sure? This will remove the habit from your tracker.")
- **AND** SHALL NOT archive the habit until the user confirms

#### Scenario: Confirmed delete archives habit and closes sheet
- **WHEN** the user confirms deletion
- **THEN** the system SHALL call `PATCH /habits/{id}` with `{ archived: true }`
- **AND** on success SHALL close the sheet
- **AND** the habit SHALL no longer appear on the Today screen
