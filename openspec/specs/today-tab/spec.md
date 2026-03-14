## ADDED Requirements

### Requirement: Today tab shows habit cards sorted by completion state
The Today tab SHALL display the user's habit cards with incomplete habits at the top and completed habits at the bottom. When a habit is marked complete, it SHALL animate to the bottom of the list using a spring transition. When a habit is uncompleted, it SHALL animate back to its position among the incomplete habits. The sort SHALL be derived from completion state — no manual reordering by the user is required. The reorder animation SHALL be visually distinct from the tap-scale animation (spring layout transition, not a linear 0.1s ease).

#### Scenario: Completed habit moves to bottom
- **WHEN** the user taps a habit card that is not yet completed for today
- **THEN** the habit SHALL be marked complete optimistically (same frame as tap)
- **AND** the habit card SHALL animate to the bottom of the list with a spring layout transition
- **AND** the animation SHALL be visually smooth and distinct from a linear jump

#### Scenario: Uncompleted habit returns to top group
- **WHEN** the user taps a completed habit card to uncomplete it
- **THEN** the habit SHALL be marked incomplete
- **AND** the habit card SHALL animate back to the top group (among incomplete habits)

#### Scenario: All complete — all cards at bottom
- **WHEN** the user completes the last remaining habit
- **THEN** all cards SHALL be in the completed (bottom) section
- **AND** the existing all-done celebration SHALL trigger as before

### Requirement: Today tab empty state shows ghost cards without a creation button
When the user has no habits, the Today tab SHALL display three shimmer ghost placeholder cards. It SHALL NOT include an inline creation button — creation is handled by the FAB.

#### Scenario: Empty state renders ghost cards only
- **WHEN** the user has zero habits and views the Today tab
- **THEN** three shimmer ghost cards SHALL be displayed
- **AND** no inline "Add your first habit" button or link SHALL appear in the Today tab content
