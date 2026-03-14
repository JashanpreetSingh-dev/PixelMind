## ADDED Requirements

### Requirement: MosaicTab renders a per-habit calendar grid card
The MosaicTab SHALL render one card per habit. Each card SHALL contain a header row (icon, habit name, streak) and a 7-row × 12-column grid where rows represent days of the week (Monday–Sunday) and columns represent the 12 most recent calendar weeks (oldest left, most recent right). Each cell represents one calendar day.

#### Scenario: Card header shows icon, name, and streak
- **WHEN** the user views the Mosaic tab and a habit exists
- **THEN** each habit card SHALL display the habit's emoji icon, the habit name, and the current streak as 🔥 N in the header row

#### Scenario: Grid has 7 rows and 12 columns
- **WHEN** the user views a habit's calendar grid
- **THEN** the grid SHALL have exactly 7 rows labeled Mo Tu We Th Fr Sa Su on the left
- **AND** SHALL have 12 columns representing the 12 most recent calendar weeks

#### Scenario: Most recent week is rightmost
- **WHEN** the user views the calendar grid
- **THEN** the rightmost column SHALL contain the current week
- **AND** columns to the left SHALL represent progressively older weeks

### Requirement: Calendar grid cells render in four distinct visual states
Each cell in the calendar grid SHALL render in one of four states based on the date it represents and whether the habit was completed on that date.

#### Scenario: Completed cell
- **WHEN** a cell represents a past date (before today) on which the habit was completed
- **THEN** the cell SHALL be filled with the habit's color
- **AND** cells closer to today SHALL appear at higher opacity than older cells (left-to-right opacity fade from ~35% to 100%)

#### Scenario: Today cell — not yet done
- **WHEN** a cell represents today's date and the habit has not been completed today
- **THEN** the cell SHALL render as transparent with a 1px border in the habit color at ~60% opacity

#### Scenario: Missed cell — past, not done
- **WHEN** a cell represents a past date on which the habit was not completed
- **THEN** the cell SHALL be filled with the habit color at approximately 12% opacity (tinted, not neutral grey)

#### Scenario: Future cell
- **WHEN** a cell represents a date after today
- **THEN** the cell SHALL be filled with a neutral white at approximately 8% opacity

### Requirement: MosaicTab fetches its own 90-day data range lazily
The MosaicTab SHALL issue its own data fetch for the last 90 calendar days when the Mosaic tab is first opened. It SHALL NOT rely on the 30-day range fetched by TodayView. A skeleton loading state SHALL be shown while the fetch is in progress.

#### Scenario: First open triggers fetch
- **WHEN** the user switches to the Mosaic tab for the first time in a session
- **THEN** the system SHALL fetch day data for the last 90 days
- **AND** a skeleton/loading state SHALL be shown until the fetch completes

#### Scenario: Subsequent opens use cache
- **WHEN** the user switches away from Mosaic and returns to it in the same session
- **THEN** the previously fetched data SHALL be displayed immediately (React Query cache)
- **AND** no visible loading state SHALL appear

### Requirement: MosaicTab shows empty state when no habits exist
When the user has no habits, the Mosaic tab SHALL show a short empty state message rather than any grid.

#### Scenario: Empty mosaic
- **WHEN** the user views the Mosaic tab and has zero habits
- **THEN** the system SHALL display a message such as "Add habits to see your mosaic"
- **AND** no grid or card SHALL be shown
