## ADDED Requirements

### Requirement: Ritual flow has three ordered steps — mood, prompt, seal
The journal ritual SHALL proceed in order: (1) mood selection, (2) prompt + optional free write, (3) seal action. The user SHALL be able to proceed from mood selection directly to seal without engaging the prompt step. Steps SHALL be rendered inline within the Tonight tab with no full-page navigation.

#### Scenario: User completes minimum path (mood only)
- **WHEN** the user taps a mood option
- **THEN** the prompt step SHALL appear below
- **AND** a "Seal the day" button SHALL be visible and tappable immediately without entering any text

#### Scenario: User completes full path
- **WHEN** the user taps a mood, types a prompt response, optionally adds free text, then taps "Seal the day"
- **THEN** all fields SHALL be submitted together and the day SHALL be sealed

### Requirement: Mood selector shows 6 emoji+text options
The mood step SHALL display exactly 6 mood options, each with an emoji and a short label. The options SHALL be: 😌 calm, 😊 good, 🤩 energized, 😰 anxious, 😤 frustrated, 🥱 tired. Only one mood may be selected at a time. Tapping a selected mood SHALL deselect it.

#### Scenario: Mood selection
- **WHEN** the user taps a mood option
- **THEN** it SHALL appear visually selected (distinct highlight)
- **AND** all other mood options SHALL appear unselected
- **AND** the prompt step SHALL become visible

#### Scenario: Mood deselection
- **WHEN** the user taps the currently selected mood
- **THEN** it SHALL be deselected
- **AND** the prompt step SHALL collapse or remain visible (implementation choice)

### Requirement: Prompt response and free write are always optional
Neither the prompt response text area nor the free write area SHALL be required to proceed to seal. The "Seal the day" button SHALL be enabled as soon as a mood is selected, regardless of text input.

#### Scenario: Seal with empty prompt response
- **WHEN** the user has selected a mood and taps "Seal the day" without entering any text
- **THEN** the system SHALL seal the day with mood only and null prompt_response and free_text

#### Scenario: Seal with partial text
- **WHEN** the user enters text in the prompt response but not the free write area
- **THEN** the system SHALL seal the day storing only the prompt_response

### Requirement: Today can only be sealed once
Once the day is sealed, the ritual flow SHALL NOT be shown again for the same calendar date. The Tonight tab SHALL instead show the sealed read-only view.

#### Scenario: Revisit after sealing
- **WHEN** the user opens the Tonight tab after having already sealed today
- **THEN** the system SHALL display the sealed read-only view, not the ritual flow
