## Context

PixelMind uses Clerk for authentication. Today, Clerk's default post-auth redirect sends users to `/`. The landing page (/) does not check auth and always shows the public marketing content. To reach the app, users must navigate to `/app`. The app layout guards `/app/*` and redirects unauthenticated users to `/sign-in`. The app home page fetches `/me` and redirects to `/app/onboarding` when the user has not completed onboarding; otherwise it shows the home screen. This change only adjusts where users land after auth and how (/) behaves when already signed in; it does not change the app's internal routing or onboarding logic.

## Goals / Non-Goals

**Goals:**
- After sign-in or sign-up, send users to `/app` by default (when Clerk has no `redirect_url` from the flow).
- When an authenticated user visits the landing page (/), redirect them to `/app` so the app can show onboarding or home as appropriate.
- Keep a single, predictable "first screen" for signed-in users: either `/app/onboarding` or `/app` (home), as determined by existing /app logic.

**Non-Goals:**
- Changing onboarding content or flow; changing /app home content; adding new routes; backend or API changes; supporting a "welcome" or interstitial page.

## Decisions

1. **Use Clerk fallback redirect to `/app`**
   - **Decision:** Configure Clerk so the fallback redirect after sign-in and sign-up is `/app` (e.g. via `fallbackRedirectUrl` on the SignIn/SignUp components or via Clerk environment variables such as `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`).
   - **Rationale:** Sends users directly into the app; the app home page already decides onboarding vs home. Avoids showing the landing page to users who just signed in.
   - **Alternatives considered:** Leaving default (/) and only changing landing redirect — then signed-in users who go to / would be redirected to /app, but users coming from Clerk would still land on / first. Using a dedicated welcome route — adds complexity without need given current flow.

2. **Landing page: redirect signed-in users to `/app`**
   - **Decision:** In the landing page (/) route, check for an authenticated user (e.g. via `auth()` from `@clerk/nextjs/server`). If the user is signed in, redirect to `/app`. Otherwise render the existing public landing content.
   - **Rationale:** Ensures a single rule: "signed in ⇒ app." Prevents signed-in users from seeing "Get started" / "Sign in" on the root URL.
   - **Alternatives considered:** Showing different landing content when signed in (e.g. "Welcome back") — adds two versions of the page; redirect is simpler and matches the desired mental model.

## Risks / Trade-offs

- **Clerk redirect configuration:** If misconfigured, users might still land on / or on an unexpected URL. Mitigation: Use documented Clerk props or env vars and verify in the app that after sign-in/sign-up the browser ends up on /app (or /app/onboarding when applicable).
- **Landing no longer viewable when signed in:** Signed-in users cannot see the marketing landing at /. Acceptable for MVP; a future "marketing" or "about" route could be added if needed.
