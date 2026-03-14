## ADDED Requirements

### Requirement: Mosaic tab shows per-habit labeled rows with 30-day grid
The Mosaic tab SHALL display one row per non-archived habit. Each row SHALL have a fixed left column showing the habit's color dot and a truncated short name label. To the right of the label, the row SHALL show 30 pixel cells representing the last 30 calendar days (oldest left, today right). Each cell SHALL be colored with the habit's color when that habit was completed on that day, and SHALL render as a dark empty cell otherwise. The label column SHALL be fixed (non-scrolling) and the pixel grid column SHALL scroll horizontally when the 30 cells exceed the viewport width.

#### Scenario: Row with completion data
- **WHEN** the user views the Mosaic tab and a habit has completion data for some days in the last 30
- **THEN** that habit's row SHALL show colored cells on days it was completed
- **AND** SHALL show empty dark cells on days it was not completed
- **AND** the habit name and color dot SHALL be visible in the fixed left label column

#### Scenario: Row with no completion data
- **WHEN** the user views the Mosaic tab and a habit has no completions in the last 30 days
- **THEN** that habit's row SHALL still be displayed with 30 empty dark cells
- **AND** the label SHALL be visible

#### Scenario: Grid scrolls horizontally
- **WHEN** the 30-cell grid is wider than the viewport minus the label column
- **THEN** the grid SHALL scroll horizontally
- **AND** the label column SHALL remain fixed and visible during scroll

#### Scenario: Cells fade from dim to bright left to right
- **WHEN** the user views the Mosaic tab
- **THEN** completed cells on older dates (left) SHALL appear at lower opacity
- **AND** completed cells approaching today (right) SHALL appear at higher opacity
- **AND** today's cell SHALL be the brightest

### Requirement: Mosaic tab shows empty state when no habits exist
When the user has no habits, the Mosaic tab SHALL show a simple empty state message (e.g. "Add habits to see your mosaic") rather than an empty grid. It SHALL NOT show ghost cards.

#### Scenario: Empty mosaic state
- **WHEN** the user has zero habits and views the Mosaic tab
- **THEN** the system SHALL display a short message indicating no habits exist yet
- **AND** SHALL NOT show a grid or any habit rows

### Requirement: Today's pixel shows a sealed glow when the day is sealed
When today has been sealed via the journal ritual, today's pixel cell in the Mosaic tab SHALL render with a distinct visual treatment — a subtle teal outer glow or ring — in addition to any habit color fills. This glow SHALL only appear on today's cell and only when today is sealed. Past sealed days SHALL NOT show the glow (the glow is a "today is done" indicator, not a historical marker).

#### Scenario: Today sealed — glow visible
- **WHEN** the user views the Mosaic tab and today has been sealed
- **THEN** today's pixel cell SHALL display a teal glow or ring around it
- **AND** habit color fills inside the cell SHALL still be visible

#### Scenario: Today not sealed — no glow
- **WHEN** the user views the Mosaic tab and today has not been sealed
- **THEN** today's pixel cell SHALL NOT display any glow or ring
- **AND** the cell SHALL render normally (filled or empty based on habit completions)

#### Scenario: Past days — no glow regardless of seal status
- **WHEN** the user views any past day's pixel cell
- **THEN** no glow or ring SHALL be rendered regardless of whether that day was sealed
