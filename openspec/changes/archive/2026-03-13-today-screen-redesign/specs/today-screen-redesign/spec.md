## ADDED Requirements

### Requirement: Today screen header shows muted date and large greeting
The Today screen SHALL display a header with a small muted date line (e.g. "Friday, Mar 13") and a large greeting in white (e.g. "Good afternoon, Jashan"). The greeting SHALL be time-aware (morning / afternoon / evening) and SHALL include the user's first name when available. The date SHALL use the user's local date.

#### Scenario: Header with name
- **WHEN** the user views the Today screen and the user's first name is available
- **THEN** the system SHALL display the current date in a muted style (e.g. small, low-contrast)
- **AND** SHALL display a large white greeting that includes the name (e.g. "Good afternoon, Jashan")

#### Scenario: Header without name
- **WHEN** the user views the Today screen and no first name is available
- **THEN** the system SHALL display the muted date line
- **AND** SHALL display the large white time-aware greeting without a name (e.g. "Good afternoon")

### Requirement: Per-habit mosaic strip for last 30 days
The Today screen SHALL display a horizontal mosaic strip showing the last 30 calendar days. The strip SHALL have one row per habit; each cell SHALL be a small colored pixel for that habit's completion on that day. Days in the past SHALL fade from dim (left) to bright (right) as they approach today. Future days SHALL render as dark squares (#151821). The strip SHALL scroll horizontally when content exceeds the viewport.

#### Scenario: Mosaic with habits
- **WHEN** the user has at least one habit and views the Today screen
- **THEN** the system SHALL display one row per habit in the strip
- **AND** each cell for a past or today date SHALL show that habit's color when completed for that day, with opacity or brightness increasing from left (older) to right (today)
- **AND** cells for dates after today SHALL be dark (#151821)

#### Scenario: Mosaic horizontal scroll
- **WHEN** the mosaic strip is wider than the viewport
- **THEN** the strip SHALL be scrollable horizontally (e.g. overflow-x-auto)

#### Scenario: Mosaic with no habits
- **WHEN** the user has no habits
- **THEN** the mosaic strip MAY be hidden or SHALL show a single row of 30 dark cells; the empty state (ghost cards) SHALL be the primary focus

### Requirement: Habit cards use specified layout and styling
Each habit SHALL be displayed as a card with: background #151821, 1px border #2a2d32, 14px border radius. The card SHALL contain on the left a small colored square dot (the habit's color), the habit name in white with font weight 500, and below it a small muted streak label ("Start your streak" when streak is 0, or "Day N streak" when N ≥ 1). On the right, the card SHALL show a circular tap target. The overall page background SHALL be #0d0f12.

#### Scenario: Card layout and streak label
- **WHEN** the user views a habit card with no current streak
- **THEN** the card SHALL display the habit color dot, name, and the muted text "Start your streak"
- **AND** SHALL display the circular tap target on the right

#### Scenario: Card with streak
- **WHEN** the user views a habit card with a current streak of N (N ≥ 1)
- **THEN** the streak label SHALL show "Day N streak" (or "Day 1 streak" for N=1) in muted style

### Requirement: Completed habit card and tap target state
When a habit is completed for today, the card's circular tap target SHALL fill with teal (#1D9E75) and display a white checkmark. The card border SHALL change to #0d4d33 and the card background SHALL change to #0a1a12. Tapping the card (or the circle) SHALL toggle completion for today and SHALL persist via the existing days API.

#### Scenario: Tap to complete
- **WHEN** the user taps a habit card that is not completed for today
- **THEN** the system SHALL mark that habit complete for today (e.g. upsert day with habit id in completed_habit_ids)
- **AND** the circle SHALL fill teal (#1D9E75) with a white checkmark
- **AND** the card border SHALL become #0d4d33 and background #0a1a12

#### Scenario: Tap to uncomplete
- **WHEN** the user taps a habit card that is already completed for today
- **THEN** the system SHALL remove that habit from today's completed list
- **AND** the card SHALL return to the default state (empty circle, default border and background)

### Requirement: Long-press and swipe on habit card preserved
The system SHALL support long-press on a habit card to reveal options (e.g. edit, skip for the day, delete). The system SHALL support swipe-left on a habit card to skip that habit for the day. Behavior SHALL match existing today-screen contract (persist skip/uncomplete where applicable).

#### Scenario: Long-press opens menu
- **WHEN** the user long-presses a habit card
- **THEN** the system SHALL display a menu with at least one of: edit, skip, delete
- **AND** the user SHALL be able to dismiss without choosing

#### Scenario: Swipe left skips
- **WHEN** the user swipes left on a habit card
- **THEN** the system SHALL treat that habit as skipped for today and SHALL update the card state accordingly

### Requirement: Reflection bar is always visible with unlock copy or CTA
The Today screen SHALL display a contextual bar at the bottom of the content (above the bottom navigation). The bar SHALL have a teal-tinted background. Before 8pm local time, the bar SHALL show the text "Tonight's reflection unlocks at 8pm" and a small pulsing dot on the left. At or after 8pm local time, the bar SHALL show an actionable CTA (e.g. "Start tonight's reflection") and SHALL link to the journal (e.g. /app/journal). Unlock time SHALL be determined by the user's local time (8pm = 20:00).

#### Scenario: Bar before 8pm
- **WHEN** the user views the Today screen and local time is before 8:00 PM
- **THEN** the bar SHALL display "Tonight's reflection unlocks at 8pm"
- **AND** SHALL display a small pulsing dot (e.g. CSS animation) on the left

#### Scenario: Bar at or after 8pm
- **WHEN** the user views the Today screen and local time is 8:00 PM or later
- **THEN** the bar SHALL display an actionable CTA (e.g. "Start tonight's reflection")
- **AND** SHALL link to or navigate to the journal/reflection flow (e.g. /app/journal)

### Requirement: Empty state shows ghost cards and add-habit prompt
When the user has no habits, the Today screen SHALL NOT show a single large empty card with one button. The screen SHALL display three ghost placeholder cards with a shimmer animation and a subtle "Add your first habit +" label. Activating that label SHALL open the existing habit creation flow (e.g. sheet or modal). No large empty white space SHALL be left unused.

#### Scenario: Empty state ghost cards
- **WHEN** the user has zero habits and views the Today screen
- **THEN** the system SHALL display three placeholder (ghost) cards with the same general shape as habit cards (e.g. dark background, border, radius)
- **AND** SHALL apply a shimmer animation to the ghost cards
- **AND** SHALL display a subtle "Add your first habit +" label that opens habit creation when activated

### Requirement: Add-habit entry when user has habits
When the user has at least one habit, the Today screen SHALL provide a clear way to add another habit (e.g. a compact FAB or an "Add habit" / "+ Add habit" link). Activating it SHALL open the same habit creation flow as the empty-state label. The FAB or link SHALL be hidden or disabled when the user is at the maximum number of habits (e.g. 10), with capacity messaging as in the existing today-screen behavior.

#### Scenario: Add habit available
- **WHEN** the user has at least one habit and is under the maximum habit limit
- **THEN** the Today screen SHALL show an add-habit control (FAB or link)
- **AND** activating it SHALL open the habit creation flow

#### Scenario: At capacity
- **WHEN** the user has the maximum number of habits
- **THEN** the add-habit control SHALL be hidden or disabled
- **AND** the system SHALL show or allow "You're at capacity" (or equivalent) if the user attempts to add a habit

### Requirement: Bottom navigation active tab uses teal
The bottom navigation (Home, Journal, Insights, Settings) SHALL use teal (#1D9E75) for the active tab indicator or label so it matches the Today screen accent.

#### Scenario: Active tab styling
- **WHEN** the user is on a tab (e.g. Home)
- **THEN** that tab's label or indicator in the bottom nav SHALL be styled with the teal color (#1D9E75)

### Requirement: Pull-to-refresh and all-done celebration preserved
The Today screen SHALL support pull-to-refresh (or equivalent) to re-fetch habits and days and update the mosaic and cards. When all habits for today are completed and there is at least one habit, the system SHALL show the existing short celebration and SHALL auto-dismiss or allow dismiss without changing the above layout or styling requirements.

#### Scenario: Refresh updates data
- **WHEN** the user performs pull-to-refresh on the Today screen
- **THEN** the system SHALL re-fetch habits and days for the relevant range
- **AND** SHALL update the mosaic strip, habit cards, and completion state

#### Scenario: Celebration when all done
- **WHEN** the user completes the last remaining habit for today and there is at least one habit
- **THEN** the system SHALL trigger the existing celebration behavior
- **AND** SHALL not conflict with the new card and bar layout
