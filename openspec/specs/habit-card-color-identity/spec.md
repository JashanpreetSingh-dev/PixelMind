## ADDED Requirements

### Requirement: HabitCard displays the habit's emoji icon
The HabitCard component SHALL display the habit's `icon` field as an emoji in place of the current 10px color square dot. When `icon` is null or empty (legacy habits created before this change), the card SHALL display a fallback of ⭐.

#### Scenario: Habit has an icon
- **WHEN** a habit card is rendered and the habit has a non-empty `icon` field
- **THEN** the emoji icon SHALL be displayed at approximately 20px size in the left area of the card

#### Scenario: Habit has no icon (legacy)
- **WHEN** a habit card is rendered and the habit's `icon` field is null or empty
- **THEN** the card SHALL display ⭐ as the fallback icon

### Requirement: HabitCard background is tinted with the habit's color
The HabitCard SHALL apply a subtle tint of the habit's color to the card background and border to communicate habit identity without the explicit color dot. The tint SHALL be subtle enough to preserve text legibility.

#### Scenario: Incomplete habit card tint
- **WHEN** a habit card is rendered and the habit is not completed for today
- **THEN** the card background SHALL use the habit color at approximately 8% opacity
- **AND** the card border SHALL use the habit color at approximately 30% opacity

#### Scenario: Completed habit card tint
- **WHEN** a habit card is rendered and the habit is completed for today
- **THEN** the card background SHALL use the habit color at approximately 14% opacity
- **AND** the card border SHALL use the habit color at approximately 40% opacity

#### Scenario: Tint does not override text legibility
- **WHEN** any habit card is rendered regardless of color
- **THEN** the habit name text and streak text SHALL remain legible (sufficient contrast against the tinted background)
