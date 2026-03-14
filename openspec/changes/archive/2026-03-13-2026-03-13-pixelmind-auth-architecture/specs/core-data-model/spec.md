## ADDED Requirements

### Requirement: User documents keyed by Clerk user ID
The system SHALL create and maintain a user document in MongoDB for each Clerk user, keyed by a `clerk_user_id` field that matches the identifier provided by Clerk.

#### Scenario: Creating a user document on first authenticated call
- **WHEN** the backend receives an authenticated request for user `U` and no existing MongoDB user document is found with `clerk_user_id` equal to `U`
- **THEN** the backend SHALL create a new user document with that `clerk_user_id` and default preference fields

#### Scenario: Reusing an existing user document
- **WHEN** the backend receives an authenticated request for user `U` and a user document already exists with `clerk_user_id` equal to `U`
- **THEN** the backend SHALL reuse that document and SHALL NOT create a duplicate record

### Requirement: Habit documents linked to users
The system SHALL store habits as separate documents in a `habits` collection, each associated with exactly one user via `clerk_user_id`.

#### Scenario: Creating a habit
- **WHEN** an authenticated user creates a new habit through the app
- **THEN** the backend SHALL create a habit document containing the habit name, color, and `clerk_user_id` of the owner

#### Scenario: Listing habits for a user
- **WHEN** the backend retrieves habits for an authenticated user
- **THEN** the backend SHALL query the habits collection by `clerk_user_id` equal to that user’s Clerk identifier

### Requirement: Day-level documents for completions and mood
The system SHALL represent each calendar day per user as a document in a `days` collection that can record completed habit identifiers and optional mood information.

#### Scenario: Recording completed habits for a day
- **WHEN** an authenticated user marks one or more habits as completed for a given date
- **THEN** the backend SHALL upsert a day document keyed by `clerk_user_id` and date
- **AND THEN** the day document SHALL include the set of completed habit identifiers for that date

#### Scenario: Retrieving days over a range
- **WHEN** the backend is asked for day data for a user over a date range
- **THEN** the backend SHALL return the corresponding day documents filtered by `clerk_user_id` and dates within the given range

### Requirement: Journal entry documents for reflections
The system SHALL store journal entries as separate documents in a `journal_entries` collection, each tied to a user and date.

#### Scenario: Storing a journal entry
- **WHEN** an authenticated user submits a journal entry for a date
- **THEN** the backend SHALL create a journal entry document containing the text, the date, and the user’s `clerk_user_id`

#### Scenario: Listing journal entries for a period
- **WHEN** the backend is requested to list journal entries for a user over a date range
- **THEN** it SHALL return entries whose `clerk_user_id` matches the user and whose dates fall within the requested range

### Requirement: Insight documents for weekly summaries
The system SHALL store AI-generated weekly insights in an `insights` collection, keyed by user and a week identifier (such as a week start date).

#### Scenario: Saving a weekly insight
- **WHEN** the backend generates a weekly insight for user `U` for a given week
- **THEN** it SHALL create or update a single insight document that includes `clerk_user_id` equal to `U` and the identifier of that week

#### Scenario: Retrieving weekly insights
- **WHEN** the frontend requests insights for a given week for user `U`
- **THEN** the backend SHALL return the corresponding insight document from the `insights` collection, if it exists, filtered by `clerk_user_id` and that week identifier

