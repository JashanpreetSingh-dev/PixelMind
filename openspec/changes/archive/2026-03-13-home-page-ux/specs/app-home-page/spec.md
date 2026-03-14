## ADDED Requirements

### Requirement: Home page content order and primary CTA placement
The app home page SHALL present content in a fixed order so that the primary action is visible above the fold on typical mobile viewports: first a today summary line, then the primary CTA to start the night reflection, then the week habit grid. The primary CTA SHALL be the single dominant call-to-action on the page (e.g. one accent-styled button linking to the journal or reflection flow).

#### Scenario: Primary CTA above the fold on mobile
- **WHEN** the user views the app home on a viewport with height typical of a mobile device (e.g. 600px–800px)
- **THEN** the primary CTA (e.g. "Start tonight's reflection" or "Reflect tonight") SHALL be visible without vertical scrolling, or after at most a single short summary line
- **AND** SHALL be styled as the main action (e.g. single accent button)

#### Scenario: Single primary CTA on home
- **WHEN** the user views the app home page
- **THEN** there SHALL be exactly one primary CTA that starts the night reflection (no duplicate primary CTAs elsewhere on the same page)

### Requirement: Today summary line
The app home page SHALL display a short today summary line at or near the top. The summary SHALL include at least a prompt to reflect tonight (e.g. "Reflect tonight"); it MAY optionally include a count of today’s habit completions (e.g. "X of Y habits done • Reflect tonight") when the user has habits and the data is available.

#### Scenario: Summary line visible
- **WHEN** the user views the app home page
- **THEN** a today summary line SHALL be visible at or near the top of the main content
- **AND** SHALL include text that directs the user toward the night reflection (e.g. "Reflect tonight")

#### Scenario: Optional habit count in summary
- **WHEN** the user has at least one habit and today’s completion data is available
- **THEN** the summary line MAY display today’s habit completion count (e.g. "2 of 3 habits done • Reflect tonight")
- **AND** when no habits exist or data is unavailable, the summary SHALL still show the reflection prompt

### Requirement: Week grid day labels and today column
The week habit grid on the app home page SHALL use recognizable day labels for the seven columns (e.g. weekday names such as Mon, Tue, or numeric dates) instead of generic placeholders (e.g. D1–D7). The column that represents the current day ("today") SHALL be visually distinguished (e.g. by border, background, or a "Today" label).

#### Scenario: Day labels in grid header
- **WHEN** the user views the week habit grid on the app home page
- **THEN** each of the seven columns SHALL have a header label that identifies the day (e.g. Mon, Tue, Wed or 10, 11, 12)
- **AND** SHALL NOT use only generic labels such as D1, D2, D3 without day or date meaning

#### Scenario: Today column highlighted
- **WHEN** the displayed week range includes the current date
- **THEN** the column corresponding to the current day SHALL be visually highlighted (e.g. distinct border or background or "Today" label)
- **AND** when the current date is not within the displayed week range, no column SHALL be marked as today
