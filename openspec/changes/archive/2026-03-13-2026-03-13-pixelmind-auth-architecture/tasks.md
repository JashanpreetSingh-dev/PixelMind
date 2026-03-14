## 1. Frontend app shell and routing

- [x] 1.1 Initialize Next.js app with PWA support and basic project structure
- [x] 1.2 Integrate Clerk into the Next.js app and configure `/sign-in` and `/sign-up` routes
- [x] 1.3 Implement public routes for landing and auth screens
- [x] 1.4 Implement protected `/app` route tree with shared layout and navigation
- [x] 1.5 Add onboarding flow under `/app/onboarding` and gate access to `/app/home` until onboarding is complete

## 2. Python backend and auth integration

- [x] 2.1 Scaffold Python backend service (e.g., FastAPI/Flask) with basic health check endpoint
- [x] 2.2 Implement Clerk token verification middleware using Clerk JWKS
- [x] 2.3 Create user bootstrap endpoint to create or fetch user document on first authenticated request
- [x] 2.4 Implement authenticated endpoints for habits (list, create, update, archive)
- [x] 2.5 Implement authenticated endpoints for days (get range, upsert completions and mood)
- [x] 2.6 Implement authenticated endpoints for journal entries (create, list by date range)
- [x] 2.7 Implement authenticated endpoints for insights (get by week, optional trigger generation placeholder)

## 3. MongoDB data model and persistence

- [x] 3.1 Configure MongoDB connection and environment-specific connection strings
- [x] 3.2 Define `users` collection schema keyed by `clerk_user_id`
- [x] 3.3 Define `habits` collection schema and indexes (e.g., `clerk_user_id`)
- [x] 3.4 Define `days` collection schema and indexes (`clerk_user_id` + date)
- [x] 3.5 Define `journal_entries` collection schema and indexes (`clerk_user_id` + date)
- [x] 3.6 Define `insights` collection schema and indexes (`clerk_user_id` + week identifier)

## 4. Wiring frontend to backend

- [x] 4.1 Configure Next.js to call the Python backend with Clerk tokens attached on authenticated requests
- [x] 4.2 Implement frontend API utilities for habits, days, journal entries, and insights
- [x] 4.3 Connect onboarding UI to backend endpoints for initial habits and preferences
- [x] 4.4 Connect home screen to backend to display current week’s pixel grid and habits
- [x] 4.5 Connect journal screen to backend to create and list entries
- [x] 4.6 Connect insights screen to backend to fetch weekly insights (stubbed if AI is not yet implemented)

