## ADDED Requirements

### Requirement: Post-auth redirect to app
The system SHALL redirect the user to `/app` after successful sign-in or sign-up when no other redirect URL is specified (e.g. when the user arrived at sign-in or sign-up directly, or when the auth provider does not supply a return URL).

#### Scenario: After sign-in with no return URL
- **WHEN** the user completes sign-in and Clerk has no `redirect_url` (or equivalent) to use
- **THEN** the system SHALL redirect the user to `/app`

#### Scenario: After sign-up with no return URL
- **WHEN** the user completes sign-up and Clerk has no `redirect_url` (or equivalent) to use
- **THEN** the system SHALL redirect the user to `/app`

### Requirement: Landing redirect when authenticated
The system SHALL redirect authenticated users from the landing page to the app.

#### Scenario: Authenticated user visits landing
- **WHEN** an authenticated user (valid session present) requests the landing page (/)
- **THEN** the system SHALL redirect the user to `/app`
- **AND** SHALL NOT render the public landing content for that request

#### Scenario: Unauthenticated visitor visits landing
- **WHEN** an unauthenticated visitor requests the landing page (/)
- **THEN** the system SHALL render the public landing content (e.g. value proposition and links to sign-up and sign-in)
- **AND** SHALL NOT redirect to `/app`
