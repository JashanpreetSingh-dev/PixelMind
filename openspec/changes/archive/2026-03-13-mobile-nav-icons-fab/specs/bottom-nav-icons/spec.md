## ADDED Requirements

### Requirement: Bottom nav displays icons instead of text labels
The mobile bottom navigation bar SHALL display a Lucide icon for each destination instead of text labels. The four icons SHALL be: `House` (Home), `BookOpen` (Journal), `BarChart2` (Insights), `Settings` (Settings). Each icon SHALL be 22px. No text label SHALL be visible.

#### Scenario: Icons render for all four destinations
- **WHEN** the user views any page within the app on a mobile viewport
- **THEN** the bottom nav SHALL display four icon buttons with no text labels
- **AND** each icon SHALL correspond to its destination (House=Home, BookOpen=Journal, BarChart2=Insights, Settings=Settings)

#### Scenario: Active destination highlighted in teal
- **WHEN** the user is on a given route
- **THEN** the corresponding nav icon SHALL be rendered in the teal accent color (`today-accent`)
- **AND** all other icons SHALL render in the muted text color

#### Scenario: Touch targets are at least 44px
- **WHEN** the user taps a nav icon
- **THEN** the tappable area SHALL be at least 44×44px regardless of icon visual size
