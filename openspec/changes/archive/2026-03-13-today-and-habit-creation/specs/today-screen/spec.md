## ADDED Requirements

### Requirement: Today screen shows date and time-aware greeting
The Today screen SHALL display the current date and a time-aware greeting that includes the user's first name when available (e.g. "Good morning, Jashan"). The greeting SHALL reflect time of day (e.g. morning, afternoon, evening) based on the user's local time.

#### Scenario: Greeting with name in morning
- **WHEN** the user views the Today screen between 5:00 and 11:59 local time and the user's first name is available (e.g. from Clerk)
- **THEN** the system SHALL display a greeting such as "Good morning, &lt;name&gt;" with the current date
- **AND** SHALL use the appropriate time-of-day wording for morning

#### Scenario: Greeting without name
- **WHEN** the user views the Today screen and no first name is available
- **THEN** the system SHALL display a time-aware greeting that does not require a name (e.g. "Good morning" or "Today")
- **AND** SHALL still display the current date

### Requirement: Mini mosaic strip shows last 30 days
The Today screen SHALL include a hero section with a mini mosaic strip that represents the last 30 days of completion across all habits. The strip SHALL be scrollable horizontally and SHALL use color or fill to indicate completed habits per day. The system SHALL derive data for the strip from the same source as the rest of Today (e.g. GET /days for the last 30 days).

#### Scenario: Mosaic strip with completion data
- **WHEN** the user views the Today screen and has habit and day data for the last 30 days
- **THEN** the system SHALL display a horizontal strip of 30 day cells (or equivalent visual)
- **AND** each cell SHALL reflect completion state (e.g. filled/colored when at least one habit was completed that day)
- **AND** the strip SHALL be scrollable horizontally if it does not fit the viewport

#### Scenario: Mosaic strip with no or partial data
- **WHEN** the user has fewer than 30 days of data or no completions
- **THEN** the system SHALL still display the strip for the last 30 calendar days
- **AND** SHALL show empty or unfilled state for days with no completion data

### Requirement: Habit list is card-based with completion and streak
The Today screen SHALL display habits as a vertical list of cards. Each card SHALL show a color pill or icon on the left, the habit name, and the current streak (e.g. "3" or "3🔥"). Each card SHALL be tappable to mark the habit complete for today; completion SHALL be persisted (e.g. via existing days API). Completed cards SHALL be visually distinct (e.g. dimmed, checkmark). The system SHALL compute streak from consecutive days of completion including today when completed.

#### Scenario: Tap to complete habit
- **WHEN** the user taps a habit card that is not yet completed for today
- **THEN** the system SHALL update the completion state for that habit for today (e.g. add habit id to today's completed_habit_ids and call POST /days)
- **AND** SHALL update the card to completed state (e.g. checkmark, dimmed)
- **AND** SHALL provide feedback (e.g. animation or haptic) on success

#### Scenario: Completed habit shows as done
- **WHEN** the user views the Today screen and a habit is already completed for today
- **THEN** that habit's card SHALL be shown in a completed state (e.g. checkmark, dimmed)
- **AND** SHALL NOT allow duplicate completion for the same day

#### Scenario: Streak displayed on card
- **WHEN** the user views a habit card
- **THEN** the card SHALL display the current streak for that habit (consecutive days including today if completed)
- **AND** streak SHALL be computed from the same day/completion data used for the mosaic

### Requirement: Long-press on habit card shows options
The system SHALL support long-press (or equivalent) on a habit card to reveal options such as edit, skip for the day, or delete. The exact set of options is implementation-defined; at least one of edit, skip, or delete SHALL be available.

#### Scenario: Long-press opens options
- **WHEN** the user long-presses a habit card
- **THEN** the system SHALL display a menu or list of actions (e.g. edit, skip, delete)
- **AND** the user SHALL be able to dismiss without choosing

### Requirement: Swipe left to skip habit for the day
The system SHALL support a swipe-left gesture on a habit card to "skip" that habit for the day (i.e. not count as complete and not break streak, or mark as explicitly skipped per product rule). Skip state SHALL be persisted or reflected in today's data where applicable.

#### Scenario: Swipe left skips habit
- **WHEN** the user swipes left on a habit card
- **THEN** the system SHALL treat that habit as skipped for today (implementation may store skip or simply leave uncompleted)
- **AND** the card SHALL update to reflect skipped or inactive state for today

### Requirement: FAB opens habit creation
The Today screen SHALL display a floating action button (FAB), e.g. "+", that opens the habit creation flow (modal or sheet). The FAB SHALL be visible when the user is not at the maximum number of habits (e.g. 10); when at maximum, the FAB SHALL be hidden or disabled and the user SHALL see a "You're at capacity" or equivalent message when attempting to add a habit.

#### Scenario: FAB visible when under limit
- **WHEN** the user has fewer than the maximum allowed habits (e.g. 10)
- **THEN** the Today screen SHALL show the FAB
- **AND** activating the FAB SHALL open the habit creation flow

#### Scenario: At capacity
- **WHEN** the user already has the maximum number of non-archived habits
- **THEN** the system SHALL NOT offer the FAB or SHALL disable it
- **AND** SHALL show "You're at capacity" or equivalent if the user tries to add a habit (e.g. from empty state)

### Requirement: Reflection CTA is time-aware
The bottom CTA "Start tonight's reflection" (or equivalent) SHALL be shown only after a configured time (e.g. 7pm local). Before that time, the CTA SHALL be hidden or replaced with different copy. The system SHALL use the user's local time; timezone preference is out of scope for this requirement.

#### Scenario: CTA visible after 7pm
- **WHEN** the user views the Today screen and local time is 7:00 PM or later
- **THEN** the system SHALL display the "Start tonight's reflection" CTA (or equivalent)
- **AND** the CTA SHALL link to or trigger the reflection/journal flow

#### Scenario: CTA hidden before 7pm
- **WHEN** the user views the Today screen and local time is before 7:00 PM
- **THEN** the system SHALL NOT display the reflection CTA or SHALL show alternative copy
- **AND** the primary focus SHALL remain on the habit list and mosaic

### Requirement: Empty state encourages first habit
When the user has no habits, the Today screen SHALL show an empty state that includes a nudge to create the first habit (e.g. ghost cards or "Create your first habit" with a clear action). The empty state SHALL NOT show the mosaic strip or habit cards; it SHALL offer a single clear path to the habit creation flow.

#### Scenario: Empty state with nudge
- **WHEN** the user has zero habits and views the Today screen
- **THEN** the system SHALL display an empty state with copy such as "Create your first habit"
- **AND** SHALL provide a control (e.g. button or ghost card) that opens the habit creation flow

### Requirement: All-complete state shows celebration
When all habits for today are completed (and there is at least one habit), the system SHALL display a short celebration micro-animation (e.g. confetti or highlight). The celebration SHALL be non-blocking and SHALL auto-dismiss or be skippable; it SHALL not trap focus or prevent the user from continuing to use the app.

#### Scenario: Celebration when all done
- **WHEN** the user completes the last remaining habit for today and there is at least one habit
- **THEN** the system SHALL trigger a short celebration animation
- **AND** the animation SHALL end or be dismissible within a few seconds without requiring mandatory user action

### Requirement: Pull to refresh syncs data
The Today screen SHALL support pull-to-refresh (or equivalent) to re-fetch habits and days data and update the mosaic, cards, and completion state. After refresh, the UI SHALL reflect the latest data from the backend.

#### Scenario: Pull to refresh updates list
- **WHEN** the user performs a pull-to-refresh gesture on the Today screen
- **THEN** the system SHALL re-fetch the data needed for Today (habits and days for the relevant range)
- **AND** SHALL update the mosaic strip, habit cards, and completion state with the new data
- **AND** SHALL provide visual feedback (e.g. spinner) during refresh
