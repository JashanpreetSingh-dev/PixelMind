## ADDED Requirements

### Requirement: Habit creation and edit flows include an icon picker
The habit creation sheet and habit edit sheet SHALL each include a grid of 28 emoji icons organized into 4 categories (Physical, Wellness, Mind/Work, Habits). The user SHALL be able to select exactly one icon. The selected icon SHALL be persisted to the habit's `icon` field via the API. A selected icon SHALL remain highlighted with a teal accent ring.

#### Scenario: Icon grid is displayed
- **WHEN** the user reaches the Appearance step in habit creation or opens the edit sheet
- **THEN** a grid of 28 emoji icons SHALL be displayed, organized by category
- **AND** one icon SHALL be pre-selected (either auto-suggested from the habit name or a default)

#### Scenario: User selects an icon
- **WHEN** the user taps an icon in the grid
- **THEN** that icon SHALL become selected
- **AND** a teal accent ring SHALL appear around the selected icon
- **AND** any previously selected icon SHALL be deselected

#### Scenario: Icon is saved with the habit
- **WHEN** the user completes habit creation or saves the edit sheet
- **THEN** the selected icon emoji SHALL be included in the API payload as the `icon` field

### Requirement: Icon is auto-suggested from the habit name
When the user has typed a habit name on the Name step, the Appearance step SHALL pre-select an icon based on keyword matching against the name. If no keyword matches, a default icon (⭐) SHALL be pre-selected.

#### Scenario: Name matches a known keyword
- **WHEN** the habit name contains a recognized keyword (e.g. "run", "water", "read", "sleep", "meditate", "walk", "exercise", "journal", "focus")
- **THEN** the Appearance step SHALL open with the corresponding icon pre-selected (e.g. 🏃, 💧, 📚, 🌙, 🧘, 🚶, 💪, ✍️, 🎯)

#### Scenario: Name does not match any keyword
- **WHEN** the habit name does not contain any recognized keyword
- **THEN** the Appearance step SHALL open with ⭐ pre-selected as the default icon

### Requirement: The icon set contains 28 curated emoji organized by category
The system SHALL use a fixed curated set of 28 emoji icons grouped into 4 named categories. The categories and icons SHALL be:
- **Physical**: 🏃 🚶 💪 🧘 🚴 🤸 🌊 ⚽
- **Wellness**: 💧 🌙 😴 💊 🥗 🍎 🛁 🍵
- **Mind/Work**: 🎯 🧠 ✍️ 📚 🎨 🎵 🌱 🙏
- **Habits**: ☀️ 📱 🧹 💰 🌿 ⭐ 🔥 📖

#### Scenario: All 28 icons are visible
- **WHEN** the icon picker is displayed
- **THEN** all 28 icons SHALL be visible without scrolling (or with minimal scroll within the picker section)
- **AND** category labels SHALL be shown above each group
