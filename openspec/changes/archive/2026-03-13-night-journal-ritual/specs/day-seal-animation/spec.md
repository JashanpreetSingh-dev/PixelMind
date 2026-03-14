## ADDED Requirements

### Requirement: Seal animation collapses text into today's pixel
When the user taps "Seal the day", the system SHALL play a multi-phase animation: (1) the journal text content (or a visual representation of it) SHALL animate by scaling down and translating toward the screen position of today's pixel in the mosaic; (2) a full-screen overlay in the selected mood's color SHALL briefly wash over the screen at low opacity; (3) the overlay SHALL fade out and the app SHALL transition to the Today tab. The entire animation SHALL complete within 1.5 seconds.

#### Scenario: Seal animation plays on tap
- **WHEN** the user taps "Seal the day"
- **THEN** the text SHALL visually shrink and move toward today's pixel position
- **AND** a mood-colored wash SHALL briefly appear full-screen
- **AND** the animation SHALL complete and resolve to the Today tab within 1.5 seconds

#### Scenario: Pixel position not measurable (fallback)
- **WHEN** today's pixel DOM element cannot be measured at seal time (e.g. Mosaic tab not rendered)
- **THEN** the text SHALL animate toward the bottom-center of the screen as a fallback
- **AND** the mood wash and transition SHALL still occur normally

### Requirement: Today's pixel shows a sealed glow after sealing
After the seal animation completes, today's pixel cell in the Mosaic tab (and in any per-habit history strips on the Today tab) SHALL render with a distinct visual treatment — a subtle teal glow or ring — to indicate the day has been sealed. This state persists for as long as today is "today".

#### Scenario: Sealed pixel appearance
- **WHEN** the user views the Mosaic tab after sealing today
- **THEN** today's pixel column SHALL have a visible glow or ring distinct from unsealed days
- **AND** completed habit cells SHALL still show their habit color inside the glow

#### Scenario: Non-sealed day has no glow
- **WHEN** the user views any past day's pixel that was not sealed
- **THEN** no glow or ring SHALL appear on that day's cells

### Requirement: Seal animation is not skippable but is fast
The seal animation SHALL not have a skip button. It SHALL be brief enough (≤1.5s) that skipping is unnecessary. API submission SHALL happen in the background during the animation so the user is not waiting for a network response.

#### Scenario: API call during animation
- **WHEN** the user taps "Seal the day"
- **THEN** the API submission SHALL be fired immediately
- **AND** the animation SHALL play concurrently without waiting for the API response
- **AND** on API failure, the system SHALL show an error toast after the animation completes and allow the user to retry
