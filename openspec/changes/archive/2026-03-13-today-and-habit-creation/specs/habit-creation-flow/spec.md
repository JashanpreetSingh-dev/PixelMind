## ADDED Requirements

### Requirement: Habit creation is a 3-step flow in a modal sheet
The system SHALL provide a habit creation flow that is presented as a modal sheet (or full-screen overlay) that slides up from the bottom. The flow SHALL have exactly three steps: (1) Name it, (2) Color and optional icon, (3) Rhythm and optional reminder. Step transitions SHALL be achievable by horizontal swipe or explicit next/back controls. The sheet SHALL close on successful creation or cancel.

#### Scenario: Sheet opens from FAB
- **WHEN** the user activates the FAB (or "Add habit") on the Today screen and is under the habit limit
- **THEN** the system SHALL open the habit creation sheet
- **AND** SHALL show step 1 (Name it) first

#### Scenario: Step transition
- **WHEN** the user completes step 1 and proceeds (e.g. swipe or "Next")
- **THEN** the system SHALL show step 2 (Color + icon)
- **AND** the user SHALL be able to go back to step 1
- **AND** the same SHALL apply between step 2 and step 3

#### Scenario: Create persists habit and closes sheet
- **WHEN** the user completes step 3 and confirms creation
- **THEN** the system SHALL send the new habit data to the backend (e.g. POST /habits)
- **AND** on success SHALL close the sheet and SHALL refresh or update the Today view so the new habit appears
- **AND** on failure SHALL display an error and SHALL NOT close the sheet until the user retries or cancels

### Requirement: Step 1 — Name it with optional suggestions
Step 1 SHALL present a large, prominent text input for the habit name, with autofocus when the step is shown. The system MAY suggest habit names as the user types (e.g. typing "read" suggests "Read 20 pages", "Read before bed"). Suggestions are optional for MVP; if provided, they SHALL be selectable to fill the name field. The "Create" or "Next" action for step 1 SHALL be enabled once at least one character is entered (after trim).

#### Scenario: Name input required
- **WHEN** the user is on step 1
- **THEN** the system SHALL display a text input for the habit name
- **AND** SHALL focus the input when the step is shown
- **AND** SHALL not allow proceeding to step 2 with an empty or whitespace-only name

#### Scenario: Suggestions when typing (optional)
- **WHEN** the user types in the name field and the system supports suggestions
- **THEN** the system MAY display suggested habit names (e.g. based on prefix)
- **AND** the user MAY select a suggestion to populate the name field

### Requirement: Step 2 — Color and optional icon with live preview
Step 2 SHALL offer a curated color palette (8–10 colors) for the habit; the user SHALL select one color. The system MAY offer an optional emoji or icon picker. The selection SHALL have a live preview of how the habit will appear in the mosaic (e.g. a sample pixel or card). The existing HABIT_PALETTE or equivalent SHALL be used for the color set.

#### Scenario: Color selection required
- **WHEN** the user is on step 2
- **THEN** the system SHALL display a set of 8–10 curated colors
- **AND** the user SHALL select one color before proceeding (or a default SHALL be pre-selected)
- **AND** the selected color SHALL be reflected in a live preview

#### Scenario: Icon optional
- **WHEN** the system supports an icon or emoji picker on step 2
- **THEN** the user MAY optionally choose an icon or emoji for the habit
- **AND** the habit MAY be created without an icon (icon is optional in the API)

### Requirement: Step 3 — Rhythm and optional reminder
Step 3 SHALL allow the user to set the habit rhythm: Daily (default, one tap), X times per week (via a stepper), or specific days (pill toggles for Mon–Sun). The system MAY offer an optional reminder toggle; full reminder scheduling (time, notification) is out of scope for this requirement. The user SHALL be able to proceed with default "Daily" without changing anything.

#### Scenario: Daily default
- **WHEN** the user reaches step 3
- **THEN** the system SHALL show "Daily" as the default rhythm
- **AND** the user SHALL be able to create the habit without changing rhythm
- **AND** SHALL be able to select "X times per week" or "Specific days" if the UI supports it

#### Scenario: Reminder toggle optional
- **WHEN** the system supports a reminder toggle on step 3
- **THEN** the user MAY turn on a reminder (stored as a preference or boolean)
- **AND** the system is NOT required to send notifications in this change; storing the preference is sufficient

### Requirement: Max 10 habits enforced
The system SHALL allow at most 10 non-archived habits per user. When the user already has 10 non-archived habits, the backend SHALL reject a new habit creation request (e.g. 400 or 403 with a clear message). The frontend SHALL prevent opening the creation flow when at capacity (e.g. hide or disable FAB) and SHALL display "You're at capacity" or equivalent if the user attempts to add a habit at the limit.

#### Scenario: Creation rejected at limit
- **WHEN** the user already has 10 non-archived habits and attempts to create another (e.g. via API)
- **THEN** the backend SHALL reject the request with an appropriate status and message
- **AND** the frontend SHALL show a message such as "You're at capacity" and SHALL NOT add the habit

#### Scenario: Under limit can create
- **WHEN** the user has fewer than 10 non-archived habits
- **THEN** the user SHALL be able to open the creation flow and SHALL be able to create a new habit until the count reaches 10

### Requirement: Duplicate name warning inline
The system SHALL warn the user inline (e.g. under the name field) when the entered habit name duplicates an existing habit name (case-insensitive, trimmed). The warning SHALL NOT block submission (user MAY submit anyway); it SHALL be informational. The warning SHALL appear when the name matches an existing habit and SHALL disappear when the user changes the name to a non-duplicate.

#### Scenario: Duplicate name shows warning
- **WHEN** the user enters a habit name that matches an existing habit's name (after case-insensitive trim)
- **THEN** the system SHALL display an inline warning (e.g. "You already have a habit with this name")
- **AND** SHALL NOT prevent the user from proceeding; the user MAY still create the habit
- **AND** SHALL clear the warning when the name is changed to a non-duplicate

#### Scenario: No warning for unique name
- **WHEN** the user enters a name that does not match any existing habit
- **THEN** the system SHALL NOT show the duplicate name warning
- **AND** the user SHALL be able to proceed normally

### Requirement: New habit accepts optional icon and rhythm in API
The backend SHALL accept optional fields for habit creation (e.g. POST /habits): `icon` (string, optional) and `rhythm` (optional; shape is implementation-defined, e.g. daily or object with times_per_week or days). Required fields SHALL remain at least name and color. The backend SHALL persist these fields when provided and SHALL return them in GET /habits so the Today screen and mosaic can use them.

#### Scenario: Create with optional fields
- **WHEN** the client sends POST /habits with name, color, and optional icon and rhythm
- **THEN** the backend SHALL create the habit and SHALL store the optional fields when present
- **AND** SHALL return the created habit including those fields in the response
- **AND** GET /habits SHALL include the stored icon and rhythm for each habit

#### Scenario: Create with required only
- **WHEN** the client sends POST /habits with only name and color
- **THEN** the backend SHALL create the habit successfully
- **AND** SHALL treat icon and rhythm as absent or default (e.g. daily)
