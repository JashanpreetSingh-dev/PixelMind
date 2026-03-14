## ADDED Requirements

### Requirement: Habit toggle updates UI instantly without waiting for server
When the user taps a habit card to complete or uncomplete it, the UI SHALL reflect the new state within the same frame as the tap — no loading delay, no spinner. The server call SHALL happen in the background. If the server call fails, the UI SHALL revert to its previous state automatically.

#### Scenario: Tap to complete — instant feedback
- **WHEN** the user taps an incomplete habit card
- **THEN** the checkmark circle SHALL fill and the card tint SHALL update to the completed style immediately (same frame)
- **AND** the card SHALL animate to the bottom of the list with a spring transition
- **AND** the server shall be updated in the background without blocking the UI

#### Scenario: Server error — rollback
- **WHEN** the server call fails after an optimistic toggle
- **THEN** the habit card SHALL revert to its previous state (completed → incomplete or vice versa)
- **AND** the card SHALL animate back to its original position

#### Scenario: Undo toast appears on completion
- **WHEN** the user taps an incomplete habit card and it is marked complete
- **THEN** a toast SHALL appear at the bottom of the screen with an "Undo" action
- **AND** the toast SHALL auto-dismiss after 3 seconds if not acted on

#### Scenario: Undo reverses the completion
- **WHEN** the undo toast is visible and the user taps "Undo"
- **THEN** the habit SHALL be marked incomplete again
- **AND** the card SHALL animate back to the incomplete section
- **AND** the toast SHALL dismiss immediately

### Requirement: Checkmark circle animates on state change
The checkmark circle on each habit card SHALL animate when transitioning between complete and incomplete states. On completion, the circle SHALL scale in with a spring animation. On un-completion, it SHALL scale out.

#### Scenario: Checkmark springs in on completion
- **WHEN** a habit transitions from incomplete to complete
- **THEN** the checkmark mark (✓) SHALL animate in with a scale spring (not an instant appear)

#### Scenario: Checkmark scales out on un-completion
- **WHEN** a habit transitions from complete to incomplete
- **THEN** the checkmark mark SHALL animate out before the circle reverts to its empty state

### Requirement: Swipe-right gesture completes a habit
The habit card SHALL support a right-swipe gesture to mark a habit complete, mirroring the existing left-swipe to skip.

#### Scenario: Right swipe completes an incomplete habit
- **WHEN** the user swipes right on an incomplete habit card (delta ≥ 60px)
- **THEN** the habit SHALL be marked complete with the same optimistic behavior as a tap

#### Scenario: Right swipe on already-complete habit is a no-op
- **WHEN** the user swipes right on a habit that is already complete
- **THEN** nothing SHALL happen

### Requirement: Long press opens context menu without triggering toggle
The long-press context menu SHALL open without also firing the tap-to-toggle action.

#### Scenario: Long press opens menu only
- **WHEN** the user holds down on a habit card for 500ms or more
- **THEN** the context menu SHALL open
- **AND** the habit completion state SHALL NOT change
