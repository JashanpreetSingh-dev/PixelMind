## ADDED Requirements

### Requirement: Public and private route structure
The system SHALL expose a set of public routes for unauthenticated visitors and a set of private routes under a common app path that require an authenticated user session.

#### Scenario: Public routes accessible without login
- **WHEN** a visitor navigates to a public route such as the landing page or the Clerk sign-in/sign-up pages
- **THEN** the system SHALL render the corresponding public content without requiring an authenticated session

#### Scenario: Private routes require authentication
- **WHEN** a visitor attempts to access a private app route such as onboarding, home, journal, insights, or settings
- **THEN** the system SHALL verify that a valid user session exists
- **AND THEN** SHALL render the private route only if the session is valid
- **AND THEN** SHALL redirect to the sign-in/sign-up flow if no valid session is present

### Requirement: Onboarding-first flow for new users
The system SHALL route newly registered users who have not completed onboarding to an onboarding experience before allowing access to the main app home.

#### Scenario: New user completes signup
- **WHEN** a user completes signup successfully and has no onboarding completion flag in their user record
- **THEN** the system SHALL route the user to the onboarding flow rather than directly to the home screen

#### Scenario: Onboarding completion unlocks home
- **WHEN** a user completes the onboarding flow
- **THEN** the system SHALL persist an onboarding completion indicator in the backend
- **AND THEN** subsequent visits to the app root SHALL route the user to the app home instead of onboarding

### Requirement: Consistent app layout for private routes
The system SHALL provide a consistent layout for private routes, including shared navigation and context (such as user identity and current day) across home, journal, insights, and settings screens.

#### Scenario: Navigating between private sections
- **WHEN** an authenticated user navigates between home, journal, insights, and settings
- **THEN** the system SHALL preserve the overall app layout and navigation shell
- **AND THEN** only the content area specific to each section SHALL change

