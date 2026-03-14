## Context

PixelMind is being built as a PWA with a Next.js frontend, Clerk for authentication, a Python backend service, and MongoDB as the primary data store. Currently there is no shared notion of an authenticated user space, and no common API or data model for habits, days, journals, or insights. This design introduces the first cross-cutting architecture: how clients authenticate, how requests flow through the system, and how core entities are stored in MongoDB.

At this stage we care about a clean separation between:
- **Public experience** (marketing shell and auth screens)
- **Private app** (onboarding, home, journal, insights, settings)
- **Backend boundary** (Python API that trusts Clerk and talks to MongoDB)

The design should support future additions like AI insights and richer journaling without reworking auth or data foundations.

## Goals / Non-Goals

**Goals:**
- Provide a **secure, managed auth flow** using Clerk for signup, login, logout, and session management.
- Define a **Next.js route and layout structure** that clearly distinguishes public from private routes and uses Clerk to guard the app area.
- Introduce a **Python backend service** that validates Clerk-issued tokens and exposes a small, coherent set of APIs for user, habit, day, journal, and insight data.
- Establish **MongoDB collections and identity strategy** (Clerk user ID as the stable key) for core PixelMind entities.
- Keep the system **AI-ready** by defining where weekly insight generation will plug into the backend, without over-specifying the AI implementation.

**Non-Goals:**
- Implement detailed AI behavior, prompts, or insight algorithms (these will come in a later change).
- Design the complete visual language or UI polish for every screen; this focuses on flows and structure, not styling.
- Introduce multi-tenant admin dashboards, analytics, or complex operational tooling.
- Support social or collaborative features (shared journals, friend feeds).

## Decisions

1. **Use Clerk as the single source of identity**
   - **Decision:** All user identity and authentication is handled by Clerk. The app does not store passwords or implement its own login system.
   - **Rationale:** Clerk provides secure, battle-tested auth flows (including social login, session management, and device handling) and lets us move quickly without building auth in-house.
   - **Alternatives considered:** Rolling our own JWT-based auth in Python; using different managed auth providers (Auth0, Supabase Auth). Clerk aligns well with Next.js and keeps the backend simpler.

2. **Split app into public and private route trees in Next.js**
   - **Decision:** Next.js exposes public routes like `/`, `/sign-in`, `/sign-up` and a protected `/app` subtree for the authenticated experience (`/app/onboarding`, `/app/home`, `/app/journal`, `/app/insights`, `/app/settings`).
   - **Rationale:** This makes it obvious which surfaces require identity and allows us to apply Clerk’s protection primitives (`SignedIn` components, middleware) at the `/app` boundary.
   - **Alternatives considered:** Mixing public and private pages under a shared tree with per-page checks, which becomes harder to reason about as the app grows.

3. **Treat the Python backend as the single API gateway**
   - **Decision:** All stateful operations (creating habits, marking completions, saving journals, reading insights) go through a Python service that verifies Clerk tokens and talks to MongoDB.
   - **Rationale:** Centralizing access through one backend simplifies authorization logic, allows future reuse (e.g., CLI tools, other clients), and keeps MongoDB off the public internet.
   - **Alternatives considered:** Having Next.js talk directly to MongoDB or using serverless functions in multiple languages. A single Python gateway keeps the system conceptually simple.

4. **Use Clerk user ID as the primary identity key across collections**
   - **Decision:** Each MongoDB document that belongs to a user stores `clerk_user_id` as a string field, and queries filter by this field rather than an internal numeric user ID.
   - **Rationale:** This avoids extra joins or mapping tables and keeps user scoping straightforward. It also makes it easy to support multiple environments without conflicting integer IDs.
   - **Alternatives considered:** Introducing an internal `user_id` and mapping Clerk IDs to it; that could be added later if needed but is not required initially.

5. **Define minimal core collections up front**
   - **Decision:** Create collections: `users`, `habits`, `days`, `journal_entries`, and `insights`, each with clear ownership and minimal indexes (e.g., `clerk_user_id` + date).
   - **Rationale:** These mirror the conceptual model of PixelMind (people, habits, day-level state, reflections, and weekly summaries) and give future features a stable base.
   - **Alternatives considered:** A more generic event log structure for everything; overkill for an MVP and harder to reason about for basic queries.

6. **Call AI from the backend, not the client**
   - **Decision:** Any future calls to Claude (for weekly insights or recall) originate from the Python backend, which aggregates data, builds prompts, and persists the results in `insights`.
   - **Rationale:** This keeps API keys and prompt logic off the client, and allows us to cache and reuse AI results per user/week.
   - **Alternatives considered:** Direct client-to-AI calls, which would complicate security and make data aggregation harder.

## Risks / Trade-offs

- **Vendor lock-in to Clerk**
  - *Risk:* Deep integration with Clerk’s SDK and token format makes it harder to switch auth providers later.
  - *Mitigation:* Isolate Clerk-specific logic behind a small auth module in the frontend and a token verification module in the backend so a provider swap primarily touches those boundaries.

- **Python backend as a single point of failure**
  - *Risk:* If the backend is down, no authenticated functionality works even if the PWA loads.
  - *Mitigation:* Keep the backend stateless and simple at first, with health checks and basic monitoring; design endpoints to be idempotent where possible.

- **MongoDB schema drift over time**
  - *Risk:* Evolving document shapes can lead to inconsistent data if not carefully managed.
  - *Mitigation:* Document expected shapes clearly in specs, use migration scripts for major changes, and treat `clerk_user_id` + `date` patterns as stable keys.

- **Over-scoping initial data model**
  - *Risk:* Adding too many fields or relationships up front could constrain future UX decisions.
  - *Mitigation:* Start with minimal fields needed for auth, habits, day state, and journal text; defer more complex metadata until real usage informs it.

