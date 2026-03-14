## ADDED Requirements

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
