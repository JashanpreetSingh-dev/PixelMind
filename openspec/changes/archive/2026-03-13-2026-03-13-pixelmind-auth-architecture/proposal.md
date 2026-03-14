## Why

PixelMind needs a solid foundation for **identity, security, and app structure** before any habit tracking, journaling, or AI features can be truly useful. Right now there is no authenticated space for a user’s private data or a clear separation between the public shell and the “logged-in” experience. This change introduces a cohesive login/signup flow plus the initial architectural setup that will support the rest of the product.

## What Changes

- Introduce **managed authentication via Clerk** so users can securely sign up, log in, and manage sessions across devices.
- Define the **front-end application shell in Next.js** with a clear split between public routes (landing, auth) and private routes (onboarding, home, journal, insights, settings).
- Establish a **Python backend service** that trusts Clerk-issued identities, exposes authenticated APIs, and persists data in MongoDB.
- Define the **core data model** for users, habits, daily state, journal entries, and insights in MongoDB, keyed by the Clerk user ID.
- Introduce the concept of a **weekly insights pipeline** in the backend (AI-ready but not necessarily fully implemented in this change).
- Create initial **capabilities specs** for user authentication, app shell/routing, and persistence of core day-level data, so later changes (AI, journaling, insights) build on a stable contract.

## Capabilities

### New Capabilities
- `user-auth`: Handles user identity using Clerk, including signup, login, logout, session validation, and mapping Clerk users into the app’s own user records.
- `app-shell`: Defines the Next.js app structure, including public vs. private routes, protected app layout, and navigation between login, onboarding, home, journal, insights, and settings.
- `core-data-model`: Describes how user, habit, daily completion, journal entry, and insight data are represented and persisted in MongoDB, including the use of Clerk user IDs as the primary identity key.
- `backend-api-gateway`: Specifies the Python backend’s responsibility as the trusted API layer that verifies Clerk tokens, enforces per-user access, and exposes endpoints for auth-guarded app operations (without yet defining AI behavior).

### Modified Capabilities
- *(None yet – this is the first foundational auth and architecture change, so there are no existing capabilities whose requirements are changing.)*

## Impact

- **Frontend**: Requires introducing Clerk’s SDK into the Next.js app, adding auth-specific routes (`/sign-in`, `/sign-up`) and a protected `/app` area for logged-in users. Routing and layout decisions here will shape all future UI work.
- **Backend**: Introduces a Python service (e.g., FastAPI/Flask) that all authenticated data operations go through, including token verification against Clerk’s JWKS and enforcement of per-user access.
- **Database**: Establishes MongoDB collections and indexing strategy for users, habits, daily state, journal entries, and insights, setting constraints that later features must respect.
- **AI integration**: Creates an “AI-ready” interface (weekly insights pipeline and related data contracts) that later changes can implement using Claude without redesigning auth or storage.
- **Ops & configuration**: Adds dependency on Clerk (API keys, redirect URLs) and MongoDB connection configuration, which must be managed consistently across environments (local, staging, production).

