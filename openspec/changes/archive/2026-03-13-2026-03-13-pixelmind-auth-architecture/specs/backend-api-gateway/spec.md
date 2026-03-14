## ADDED Requirements

### Requirement: Backend verifies Clerk tokens on authenticated endpoints
The backend API gateway SHALL verify Clerk-issued tokens on all authenticated endpoints before executing any business logic or accessing user data.

#### Scenario: Request with valid token
- **WHEN** an authenticated request reaches the backend with a valid Clerk token in the expected header
- **THEN** the backend SHALL validate the token using Clerk’s public keys
- **AND THEN** SHALL extract the Clerk user ID and attach it to the request context for downstream handlers

#### Scenario: Request with invalid or missing token
- **WHEN** a request reaches an authenticated endpoint without a token or with an invalid/expired token
- **THEN** the backend SHALL reject the request with an appropriate authentication error status

### Requirement: Per-user scoping of data access
The backend API gateway SHALL scope all data operations to the authenticated user by using the Clerk user ID from the verified token.

#### Scenario: Fetching user-specific data
- **WHEN** a client requests habits, days, journal entries, or insights through an authenticated endpoint
- **THEN** the backend SHALL query MongoDB collections filtered by `clerk_user_id` equal to the authenticated user’s ID

#### Scenario: Preventing cross-user access
- **WHEN** an authenticated user attempts to access resources that belong to a different user by guessing or supplying another identifier
- **THEN** the backend SHALL deny access and SHALL NOT return or modify data associated with another user’s `clerk_user_id`

### Requirement: Stable API surface for core app flows
The backend API gateway SHALL expose a stable set of endpoints for core app flows including onboarding, habit management, day updates, journal entry storage, and insight retrieval.

#### Scenario: Onboarding data submission
- **WHEN** an authenticated user submits onboarding data such as initial habits and preferences
- **THEN** the backend SHALL persist the data via its API and mark onboarding as complete for that user

#### Scenario: Weekly insight retrieval
- **WHEN** an authenticated user opens the insights view for a given week
- **THEN** the backend SHALL return the corresponding insight document for that user and week if it exists
- **AND THEN** the backend MAY initiate insight generation if no insight is yet stored for that period

