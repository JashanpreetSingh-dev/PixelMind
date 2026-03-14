## MODIFIED Requirements

### Requirement: Habit creation uses a three-step flow with an Appearance step
The habit creation sheet SHALL use a three-step flow: **Name** → **Appearance** → **Rhythm**. The Appearance step SHALL combine icon selection and color selection on a single screen. The color palette SHALL contain 16 colors. The step title SHALL read "New habit — Appearance" on step 2.

#### Scenario: Appearance step shows icon grid and color swatches
- **WHEN** the user advances from the Name step to the Appearance step
- **THEN** the sheet SHALL display the icon picker grid (28 icons, categorized) above a visual divider
- **AND** SHALL display 16 color swatches below the divider
- **AND** one icon SHALL be pre-selected (auto-suggested or default ⭐)
- **AND** one color SHALL be pre-selected (first palette color or previously selected)

#### Scenario: User can change both icon and color on the same step
- **WHEN** the user is on the Appearance step
- **THEN** tapping an icon SHALL select it without advancing the step
- **AND** tapping a color swatch SHALL select it without advancing the step
- **AND** the user SHALL tap "Next" to proceed to Rhythm

#### Scenario: Color palette contains 16 colors
- **WHEN** the color swatches are displayed
- **THEN** exactly 16 color options SHALL be shown
- **AND** the 8 original palette colors (Sage, Sky, Lavender, Peach, Rose, Mint, Amber, Slate) SHALL be present
- **AND** 8 new colors (Coral, Violet, Teal, Gold, Lilac, Ocean, Crimson, Forest) SHALL be added
