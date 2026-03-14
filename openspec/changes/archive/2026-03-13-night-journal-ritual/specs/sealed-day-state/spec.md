## ADDED Requirements

### Requirement: Tonight tab shows read-only sealed view after sealing
After today has been sealed, the Tonight tab SHALL display a read-only summary of the sealed entry instead of the ritual flow. The view SHALL show: the selected mood (emoji + label), the prompt question and response (if any), the free text (if any), and a "Day sealed ✦" heading. No editing controls SHALL be present.

#### Scenario: Sealed view content
- **WHEN** the user opens the Tonight tab after sealing today
- **THEN** the system SHALL display "Day sealed ✦" as a heading
- **AND** SHALL display the selected mood with its emoji and label
- **AND** SHALL display the prompt question and the user's response if a response was entered
- **AND** SHALL display the free text if it was entered
- **AND** SHALL NOT show any text input, mood selector, or "Seal the day" button

#### Scenario: Sealed with mood only
- **WHEN** the user sealed today with only a mood (no text)
- **THEN** the sealed view SHALL show the mood and "Day sealed ✦"
- **AND** SHALL NOT show empty prompt or free text sections

### Requirement: No backfill — past unsealed days cannot be sealed
The system SHALL NOT provide any UI affordance to seal a past day. If a calendar day passes without the user sealing it, that day's pixel remains unsealed permanently. The Tonight tab SHALL only ever operate on the current calendar day.

#### Scenario: Past day is not sealable
- **WHEN** the user views any past day in the journal archive
- **THEN** the system SHALL NOT show a "Seal" button or ritual flow for that day

#### Scenario: New day, Tonight tab resets
- **WHEN** the calendar date changes to a new day
- **THEN** the Tonight tab SHALL show the ritual flow (if after 8pm) or the locked state (if before 8pm) for the new day
- **AND** SHALL NOT show the previous day's sealed view

### Requirement: Journal archive shows all sealed entries
The `/app/journal` page SHALL display a reverse-chronological list of all sealed journal entries. Each entry SHALL show the date, mood (emoji + label), prompt question and response (if any), and free text (if any).

#### Scenario: Archive lists entries
- **WHEN** the user navigates to `/app/journal`
- **THEN** the system SHALL display all sealed entries for the user in reverse chronological order
- **AND** each entry SHALL show its date, mood, and any text content

#### Scenario: Empty archive
- **WHEN** the user has no sealed entries
- **THEN** the archive SHALL show an empty state message (e.g. "No entries yet — seal your first day tonight")
