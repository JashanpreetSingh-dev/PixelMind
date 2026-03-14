## ADDED Requirements

### Requirement: A floating action button opens habit creation on the home route
A circular `+` FAB SHALL be rendered fixed to the bottom-right of the screen on the `/app` home route only. It SHALL open the habit creation sheet when tapped. It SHALL float above the bottom navigation bar with sufficient clearance for safe area insets.

#### Scenario: FAB visible on home route
- **WHEN** the user navigates to `/app`
- **THEN** the FAB SHALL be visible in the bottom-right corner above the bottom nav
- **AND** tapping it SHALL open the habit creation sheet

#### Scenario: FAB not visible on other routes
- **WHEN** the user is on any route other than `/app` (e.g. `/app/journal`, `/app/settings`)
- **THEN** the FAB SHALL NOT be rendered

#### Scenario: FAB hidden at habit capacity
- **WHEN** the user already has 10 habits
- **THEN** the FAB SHALL NOT be rendered
- **AND** no disabled button SHALL be shown in its place

#### Scenario: FAB clears bottom nav and safe area
- **WHEN** the FAB is rendered on a device with a home indicator (iOS safe area)
- **THEN** the FAB SHALL be positioned above the bottom nav bar and above the safe area inset
- **AND** SHALL NOT be obscured by the navigation bar
