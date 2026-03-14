## ADDED Requirements

### Requirement: Responsive navigation for app shell
The system SHALL provide navigation for the authenticated app (Home, Journal, Insights, Settings) that adapts to viewport size. On small viewports (below the medium breakpoint), the system SHALL use a bottom navigation bar and SHALL NOT show a fixed sidebar that reduces the main content width. On medium-and-up viewports, the system MAY show a bottom navigation bar or an optional sidebar; the main content area SHALL use the available width appropriately.

#### Scenario: Small viewport navigation
- **WHEN** the user views any app route (e.g. /app, /app/journal) on a viewport below the medium breakpoint (e.g. width &lt; 768px)
- **THEN** the system SHALL display a bottom navigation bar containing links or controls for Home, Journal, Insights, and Settings
- **AND** SHALL NOT display a fixed left sidebar that occupies horizontal space on the same viewport

#### Scenario: Full-width main content on small viewport
- **WHEN** the user views any app route on a small viewport
- **THEN** the main content area SHALL occupy the full width of the viewport (minus any bottom nav and safe-area padding)
- **AND** SHALL NOT be constrained by a persistent sidebar on the same viewport

#### Scenario: Navigation accessible on medium-and-up viewport
- **WHEN** the user views any app route on a medium or larger viewport
- **THEN** the system SHALL provide access to Home, Journal, Insights, and Settings (e.g. via bottom nav or sidebar)
- **AND** the main content area SHALL use the remaining width for the selected section

### Requirement: Touch-friendly navigation targets
The system SHALL size primary navigation items and key action targets so that their tappable or clickable area is at least approximately 44px in the smaller dimension where practicable, to support reliable use on touch devices.

#### Scenario: Bottom nav tap target size
- **WHEN** the user interacts with an item in the bottom navigation bar on a touch device
- **THEN** the effective tap target for each nav item SHALL be at least 44px in height (or the smaller dimension of the control)
- **AND** SHALL be sufficient to avoid accidental activation of adjacent items

### Requirement: Safe-area insets for installed PWA
The system SHALL respect safe-area insets (e.g. notch, home indicator) when the application is displayed in a mode that can overlap system UI (e.g. standalone PWA). The bottom navigation and any full-bleed layout SHALL use safe-area padding so that content and controls are not obscured by system UI.

#### Scenario: Bottom nav above system home indicator
- **WHEN** the app is running in a context where safe-area insets are provided (e.g. standalone PWA on a device with a home indicator)
- **THEN** the bottom navigation bar SHALL be positioned or padded so that it is not drawn under the home indicator (e.g. using env(safe-area-inset-bottom))
- **AND** interactive elements in the bottom nav SHALL remain fully tappable

#### Scenario: Viewport and safe-area configuration
- **WHEN** the app is loaded
- **THEN** the viewport meta (or equivalent) SHALL be set so that layout scales appropriately on mobile (e.g. width=device-width, initial-scale=1)
- **AND** if safe-area insets are used, the viewport SHALL be configured to allow them (e.g. viewport-fit=cover where supported)
