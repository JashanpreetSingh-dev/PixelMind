## ADDED Requirements

### Requirement: Settings page exists at /app/settings
The system SHALL provide a Settings page at the route `/app/settings` for authenticated users. The page SHALL be reachable from the app shell navigation (sidebar and bottom nav). The page SHALL contain three distinct blocks: a Profile block (“You”), a Preferences block, and an Account action (Sign out).

#### Scenario: Settings route is accessible when signed in
- **WHEN** the user is authenticated and navigates to `/app/settings`
- **THEN** the system SHALL display the Settings page
- **AND** SHALL NOT redirect to sign-in

#### Scenario: Settings linked from app navigation
- **WHEN** the user is on any app route (e.g. /app, /app/journal)
- **THEN** the Settings link in the bottom nav and (if visible) sidebar SHALL point to `/app/settings`
- **AND** SHALL lead to the Settings page when selected

### Requirement: Profile block shows identity and manage account
The Settings page SHALL display a Profile block (“You”) that shows the current user’s avatar and name from Clerk. The block SHALL include a way to open “Manage account” (or equivalent) that directs the user to Clerk’s account/profile management. The system SHALL NOT require storing name or avatar in the backend; Clerk is the source of truth for identity display.

#### Scenario: Profile shows avatar and name
- **WHEN** the user views the Settings page
- **THEN** the Profile block SHALL display the user’s avatar (or a placeholder, e.g. initials)
- **AND** SHALL display the user’s name as provided by Clerk

#### Scenario: Manage account opens Clerk
- **WHEN** the user activates the “Manage account” (or equivalent) control in the Profile block
- **THEN** the system SHALL open Clerk’s account or profile management (e.g. hosted page or UserButton menu)
- **AND** the user SHALL be able to return to the app after managing account

### Requirement: Preferences block lists editable settings
The Settings page SHALL display a Preferences block that lists at least: Primary feeling, Theme, and Week starts on. Each preference SHALL be presented as a single row with a label and current value. Tapping or clicking a row SHALL allow the user to change the value (e.g. via bottom sheet or inline picker). The system SHALL persist the new value when the user selects it (auto-save); no separate “Save” button is required for preferences.

#### Scenario: Primary feeling is editable
- **WHEN** the user taps the “Primary feeling” row on the Settings page
- **THEN** the system SHALL present the same set of options as onboarding (e.g. Calm, Energized, Proud, Grounded, Clear-headed)
- **AND** when the user selects an option, the system SHALL update the displayed value and SHALL persist the choice (e.g. via PATCH /me)

#### Scenario: Theme is editable
- **WHEN** the user taps the “Theme” row on the Settings page
- **THEN** the system SHALL present options: Light, Dark, System
- **AND** when the user selects an option, the system SHALL update the displayed value and SHALL persist the choice
- **AND** the app SHALL apply the selected theme (light/dark/system) for the UI

#### Scenario: Week starts on is editable
- **WHEN** the user taps the “Week starts on” row on the Settings page
- **THEN** the system SHALL present options: Monday, Sunday
- **AND** when the user selects an option, the system SHALL update the displayed value and SHALL persist the choice

### Requirement: Sign out is available on Settings
The Settings page SHALL provide a Sign out control. Activating it SHALL sign the user out (via Clerk) and SHALL redirect or navigate the user to the appropriate post-sign-out experience (e.g. sign-in page or landing).

#### Scenario: Sign out clears session and redirects
- **WHEN** the user activates the Sign out control on the Settings page
- **THEN** the system SHALL sign the user out (Clerk session cleared)
- **AND** SHALL redirect or navigate the user to the sign-in flow or landing as configured

### Requirement: Settings page is minimal and mobile-first
The Settings page SHALL use a minimal, mobile-first layout: a single scrollable screen with no sub-pages or tabs. Interactive rows (preferences, manage account, sign out) SHALL have a minimum tap target height of approximately 44px where practicable. The layout and styling SHALL be consistent with the rest of the app (existing theme tokens, list/card patterns).

#### Scenario: Single scrollable screen
- **WHEN** the user views the Settings page on any viewport
- **THEN** all content (Profile, Preferences, Sign out) SHALL be available on one scrollable page
- **AND** SHALL NOT require navigation to another route or tab to access any of these blocks

#### Scenario: Touch-friendly targets
- **WHEN** the user interacts with preference rows or the Sign out control on a touch device
- **THEN** the effective tap target for each control SHALL be at least 44px in the smaller dimension where practicable
- **AND** SHALL be full-width or clearly tappable within the layout
