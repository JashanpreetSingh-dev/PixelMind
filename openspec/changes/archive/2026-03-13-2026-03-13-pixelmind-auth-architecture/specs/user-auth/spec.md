## ADDED Requirements

### Requirement: Clerk-managed authentication
The system SHALL use Clerk as the sole authentication provider for PixelMind user accounts, handling signup, login, logout, and session management without storing or validating passwords in the Python backend.

#### Scenario: Successful signup
- **WHEN** a visitor completes the Clerk signup flow with valid credentials
- **THEN** Clerk SHALL create a new auth user
- **AND THEN** the frontend SHALL call the backend to create or fetch a corresponding user document keyed by the Clerk user ID

#### Scenario: Successful login
- **WHEN** a returning user completes the Clerk login flow
- **THEN** Clerk SHALL establish a valid session for that user
- **AND THEN** the frontend SHALL include the Clerk session token or JWT in subsequent authenticated API calls to the backend

#### Scenario: Logout
- **WHEN** a signed-in user initiates logout from the app
- **THEN** Clerk SHALL terminate the user’s session
- **AND THEN** the frontend SHALL clear any local app state tied to that user and redirect to a public route

### Requirement: Authenticated API access via Clerk tokens
The system SHALL require a valid Clerk-issued token for all API endpoints that operate on user-specific data, and SHALL reject any request that fails token verification.

#### Scenario: Valid token grants access
- **WHEN** the frontend calls an authenticated backend endpoint with a valid Clerk token for user `U`
- **THEN** the backend SHALL verify the token using Clerk’s public keys
- **AND THEN** the backend SHALL treat the Clerk user ID from the token as the identity for all data access within that request

#### Scenario: Missing or invalid token is rejected
- **WHEN** a request to an authenticated backend endpoint is made without a token or with an invalid/expired token
- **THEN** the backend SHALL respond with an authentication error status
- **AND THEN** the frontend SHALL redirect the user toward the Clerk sign-in flow or show an appropriate error state

### Requirement: Public vs private route separation
The system SHALL separate public routes (including marketing shell and auth screens) from private routes that require an authenticated Clerk session.

#### Scenario: Accessing private route while signed out
- **WHEN** a visitor navigates directly to a private route (such as the app home) without a valid Clerk session
- **THEN** the frontend routing layer or middleware SHALL prevent the private view from rendering
- **AND THEN** the visitor SHALL be redirected to the Clerk sign-in or sign-up flow

