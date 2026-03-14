## ADDED Requirements

### Requirement: Tonight tab is visually locked before 8pm
Before 8:00 PM local time, the Tonight tab SHALL appear visually dimmed (e.g. reduced opacity) and SHALL use a lock icon or equivalent visual indicator. Tapping the Tonight tab before 8pm SHALL be a no-op — the tab SHALL NOT become active and no content SHALL be shown. The Today tab SHALL remain active.

#### Scenario: Tonight tab locked before 8pm
- **WHEN** the user views the home screen and local time is before 8:00 PM
- **THEN** the Tonight tab SHALL appear dimmed (e.g. opacity-40) with a lock icon
- **AND** tapping the Tonight tab SHALL NOT switch the active tab
- **AND** the Today tab SHALL remain active and visible

### Requirement: Tonight tab is active and pulsing at or after 8pm
At or after 8:00 PM local time, the Tonight tab SHALL become fully visible and interactive. It SHALL display a teal pulsing dot or glow to indicate something is ready. Tapping it SHALL make it the active tab and SHALL display the Tonight panel content.

#### Scenario: Tonight tab unlocked at 8pm
- **WHEN** the user views the home screen and local time is 8:00 PM or later
- **THEN** the Tonight tab SHALL appear at full opacity with a teal pulsing indicator
- **AND** tapping it SHALL make Tonight the active tab
- **AND** the Tonight panel SHALL be displayed in the content area

### Requirement: Tonight panel shows a stub with reflection prompt and journal link
When the Tonight tab is active, the content area SHALL display a panel with: a short reflection prompt or welcome copy (e.g. "How did today go?"), a placeholder mood or note area, and a "Start writing" button or link that navigates to `/app/journal`. The panel content is a stub — it links out to the journal route rather than providing inline write functionality.

#### Scenario: Tonight panel content
- **WHEN** the user taps the Tonight tab (unlocked) and the panel is shown
- **THEN** the panel SHALL display a short reflection prompt
- **AND** SHALL display a "Start writing" button or link
- **AND** activating "Start writing" SHALL navigate to `/app/journal`

#### Scenario: Tonight panel stub — no inline write
- **WHEN** the user views the Tonight panel
- **THEN** the system SHALL NOT provide an inline text editor or voice input in this panel (those are in `/app/journal`)
- **AND** the panel SHALL clearly direct the user to the journal route for writing
