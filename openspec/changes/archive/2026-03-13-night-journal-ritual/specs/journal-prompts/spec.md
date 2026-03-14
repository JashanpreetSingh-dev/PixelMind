## ADDED Requirements

### Requirement: A curated set of 15 rotating daily prompts is available
The system SHALL maintain a static list of exactly 15 journal prompts. The prompt shown on a given day SHALL be selected deterministically using the formula `day_of_year % 15`, where `day_of_year` is the 1-based day number of the current calendar year. All users see the same prompt on the same day. The prompt list SHALL be stored as a frontend constant (no API call required).

The 15 prompts SHALL be:
1. "What's one moment from today you want to remember?"
2. "What felt hard today — and did you get through it?"
3. "How does your body feel right now?"
4. "What's one thing you did for yourself today?"
5. "What would you tell tomorrow-you?"
6. "What surprised you today?"
7. "Who made today better, even a little?"
8. "What did you let go of today?"
9. "What are you looking forward to tomorrow?"
10. "What's something you noticed today that you usually rush past?"
11. "If today had a title, what would it be?"
12. "What did you learn — about anything?"
13. "What do you wish had gone differently?"
14. "What made you smile today?"
15. "How did you show up for yourself today?"

#### Scenario: Prompt selection is deterministic
- **WHEN** two users open the Tonight tab on the same calendar date
- **THEN** both SHALL see the same prompt question

#### Scenario: Prompt cycles every 15 days
- **WHEN** 15 days have passed since a user first saw a prompt
- **THEN** the same prompt SHALL appear again (acceptable repetition for MVP)

### Requirement: The prompt question is displayed above the text input
In the ritual flow, the selected daily prompt SHALL be displayed as a visible question above the text input area. The text input placeholder SHALL be neutral (e.g. "Write your answer…") and SHALL NOT repeat the question.

#### Scenario: Prompt is visible
- **WHEN** the user has selected a mood and the prompt step is shown
- **THEN** the prompt question text SHALL be displayed in full above the text input

### Requirement: Prompt ID is stored with the sealed entry
When sealing a day, the system SHALL store the numeric prompt index (0–14) alongside the entry so the prompt question can be reconstructed when displaying the sealed view or journal archive.

#### Scenario: Prompt ID persisted
- **WHEN** the user seals a day
- **THEN** the API submission SHALL include the `prompt_id` (0-based index into the prompt list)
- **AND** the journal archive SHALL display the correct prompt question for each entry using the stored prompt_id
