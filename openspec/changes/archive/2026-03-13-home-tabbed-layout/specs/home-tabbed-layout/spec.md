## ADDED Requirements

### Requirement: Home screen displays three tabs below the header
The home screen SHALL display three tabs — Today, Mosaic, and Tonight — rendered as pill-style or underline-style tab controls directly below the greeting header. The tabs SHALL be horizontally laid out and SHALL always be visible regardless of scroll position within the active tab's content. The Today tab SHALL be active by default on every fresh page load.

#### Scenario: Default tab on load
- **WHEN** the user navigates to the home screen (`/app`)
- **THEN** the Today tab SHALL be active
- **AND** the Today tab content SHALL be visible
- **AND** the Mosaic and Tonight tabs SHALL be visible but inactive

#### Scenario: Switching tabs
- **WHEN** the user taps the Mosaic tab
- **THEN** the Mosaic tab SHALL become active
- **AND** the Mosaic tab content SHALL replace the Today content in the content area
- **AND** the Today tab SHALL appear inactive

#### Scenario: Tab state is not persisted across navigation
- **WHEN** the user leaves the home screen and returns
- **THEN** the Today tab SHALL be active again (tab state resets to default)

### Requirement: Header shows inline progress counter
The home screen header SHALL display a progress counter of the form `N / M done` (where N is completed habits today and M is total non-archived habits) below the greeting. When all habits are complete the counter SHALL show `All done ✓` or equivalent celebratory copy. When the user has no habits, the counter SHALL be hidden.

#### Scenario: Partial completion
- **WHEN** the user has M habits and N are completed for today (0 < N < M)
- **THEN** the header SHALL display `N / M done` in a muted style below the greeting

#### Scenario: All complete
- **WHEN** all habits are completed for today
- **THEN** the header SHALL display `All done ✓` (or equivalent) instead of the `N / M done` counter

#### Scenario: No habits
- **WHEN** the user has zero habits
- **THEN** the progress counter SHALL NOT be displayed

### Requirement: Standalone mosaic strip and reflection bar are removed
The standalone per-habit mosaic strip that previously appeared between the header and habit cards SHALL be removed from the Today tab content. The reflection bar that previously appeared at the bottom of the content SHALL be removed. Their roles are fulfilled by the Mosaic tab and Tonight tab respectively.

#### Scenario: Today tab has no mosaic strip
- **WHEN** the user views the Today tab
- **THEN** no mosaic grid SHALL appear above or within the habit card list
- **AND** no reflection bar banner SHALL appear below the habit card list
