## ADDED Requirements

### Requirement: Today tab shows habit cards sorted by completion state
The Today tab SHALL display the user's habit cards with incomplete habits at the top and completed habits at the bottom. When a habit is marked complete, it SHALL animate to the bottom of the list. When a habit is uncompleted, it SHALL animate back to its position among the incomplete habits. The sort SHALL be derived from completion state — no manual reordering by the user is required.

#### Scenario: Completed habit moves to bottom
- **WHEN** the user taps a habit card that is not yet completed for today
- **THEN** the habit SHALL be marked complete (via existing toggle logic)
- **AND** the habit card SHALL animate to the bottom of the list, below all incomplete habits
- **AND** the animation SHALL use a smooth layout transition (not an instant jump)

#### Scenario: Uncompleted habit returns to top group
- **WHEN** the user taps a completed habit card to uncomplete it
- **THEN** the habit SHALL be marked incomplete
- **AND** the habit card SHALL animate back to the top group (among incomplete habits)

#### Scenario: All complete — all cards at bottom
- **WHEN** the user completes the last remaining habit
- **THEN** all cards SHALL be in the completed (bottom) section
- **AND** the existing all-done celebration SHALL trigger as before

### Requirement: Today tab shows empty state when no habits exist
When the user has no habits, the Today tab SHALL display the existing ghost card empty state (three shimmer placeholder cards and an "Add your first habit +" label). The empty state SHALL NOT show a mosaic strip or progress counter.

#### Scenario: Empty state rendered
- **WHEN** the user has zero habits and views the Today tab
- **THEN** the system SHALL display three ghost placeholder cards with shimmer animation
- **AND** SHALL display an "Add your first habit +" label that opens the habit creation sheet

### Requirement: Today tab provides add-habit entry when user has habits
When the user has at least one habit and is under the 10-habit limit, the Today tab SHALL display a compact add-habit control (e.g. `+ Add habit` link or small button) below the habit card list. At capacity the control SHALL be hidden or disabled with appropriate messaging.

#### Scenario: Add habit available
- **WHEN** the user has between 1 and 9 habits and views the Today tab
- **THEN** a compact add-habit control SHALL be visible below the habit list
- **AND** activating it SHALL open the habit creation sheet

#### Scenario: At capacity
- **WHEN** the user has 10 habits
- **THEN** the add-habit control SHALL be hidden or disabled
