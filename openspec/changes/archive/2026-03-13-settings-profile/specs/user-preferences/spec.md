## ADDED Requirements

### Requirement: User document includes a preferences object
The backend SHALL store user preferences in a `preferences` object on the user document in the `users` collection. The document SHALL support at least the following keys under `preferences`: `primary_feeling` (optional string), `theme` (optional string), `week_starts_on` (optional string). The backend SHALL allow other keys to be stored for future use but SHALL validate and apply defaults for the known keys when reading or updating.

#### Scenario: New user has empty preferences
- **WHEN** a new user document is created (e.g. via GET /me bootstrap)
- **THEN** the user document SHALL include a `preferences` field
- **AND** `preferences` MAY be an empty object `{}` or MAY contain any of the supported keys

#### Scenario: Known preference keys have allowed values
- **WHEN** the backend stores or validates `preferences.theme`
- **THEN** allowed values SHALL be `"light"`, `"dark"`, or `"system"` (or equivalent); invalid values SHALL be rejected or normalized
- **AND** when `preferences.week_starts_on` is stored or validated, allowed values SHALL be `"monday"` or `"sunday"` (or equivalent)

### Requirement: GET /me returns current user with preferences
The existing GET /me endpoint SHALL return the current user document for the authenticated Clerk user. The response SHALL include the `preferences` object (or an empty object if none). The response SHALL NOT include sensitive credentials; it SHALL include at least `_id`, `clerk_user_id`, `onboarding_completed`, and `preferences`.

#### Scenario: Authenticated user receives own document
- **WHEN** a client sends a valid request to GET /me with the Clerk JWT
- **THEN** the backend SHALL return the user document associated with that Clerk user id
- **AND** the response SHALL include the `preferences` object as stored (or `{}` if absent)

### Requirement: PATCH /me updates preferences
The backend SHALL provide a PATCH /me (or equivalent) endpoint that accepts a JSON body containing a partial or full `preferences` object. The endpoint SHALL require the same authentication as GET /me. The backend SHALL merge the provided preferences into the existing user document’s `preferences` (e.g. shallow or deep merge of keys) and SHALL validate known keys (`primary_feeling`, `theme`, `week_starts_on`). Unknown keys MAY be stored or ignored as defined by implementation. The response SHALL return the updated user document or a success indicator.

#### Scenario: PATCH updates preferences for authenticated user
- **WHEN** a client sends a valid PATCH request to /me with body e.g. `{ "preferences": { "theme": "dark" } }`
- **THEN** the backend SHALL update the current user’s document so that `preferences.theme` is `"dark"`
- **AND** SHALL leave other `preferences` keys unchanged unless they are included in the request body
- **AND** SHALL return a success response and optionally the updated user document

#### Scenario: PATCH rejects invalid preference values
- **WHEN** a client sends a PATCH request to /me with an invalid value for a known key (e.g. `theme: "invalid"`)
- **THEN** the backend SHALL reject the request with an appropriate error (e.g. 400)
- **AND** SHALL NOT update the user document for that key

### Requirement: Defaults for theme and week_starts_on
When the client or backend reads preferences for display or behavior, `theme` MAY default to `"system"` if absent, and `week_starts_on` MAY default to `"monday"` if absent. The backend MAY apply these defaults when returning the user document (GET /me) or when applying PATCH; the spec does not mandate where defaults are applied as long as the effective behavior is consistent.

#### Scenario: Missing theme is treated as system
- **WHEN** the user document has no `preferences.theme` or it is empty
- **THEN** the system (frontend or backend) SHALL treat the effective theme as `"system"` (or equivalent) for UI behavior
- **AND** GET /me MAY return `preferences.theme` as `"system"` or omit it

#### Scenario: Missing week_starts_on is treated as monday
- **WHEN** the user document has no `preferences.week_starts_on` or it is empty
- **THEN** the system SHALL treat the effective week start as Monday for grids and insights
- **AND** GET /me MAY return `preferences.week_starts_on` as `"monday"` or omit it
