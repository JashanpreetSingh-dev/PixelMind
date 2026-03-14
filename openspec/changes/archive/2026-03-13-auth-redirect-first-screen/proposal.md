## Why

After sign-in or sign-up, users are currently sent to the landing page (/) and see the same "Get started" / "Sign in" content. Signed-in users who visit / also see the public landing. The app does not define a single, clear "first screen" for authenticated users. We need post-auth redirects and landing behavior so that signed-in users go straight into the app and see either onboarding (new users) or home (returning users) without an extra step.

## What Changes

- Configure Clerk so that after sign-in and sign-up, users are redirected to `/app` (fallback when no `redirect_url` is present), instead of the default `/`.
- Update the landing page (/) so that when the user is already authenticated, the system redirects them to `/app`. Unauthenticated visitors continue to see the public landing.
- No changes to the existing /app logic: the app home page continues to fetch `/me` and redirect to `/app/onboarding` when `onboarding_completed === false`; otherwise it shows the home screen. The "first screen" for signed-in users remains either onboarding or home, decided by /app.

## Capabilities

### New Capabilities
- `auth-redirect-and-landing`: Defines where users go after sign-in/sign-up (Clerk redirect to `/app`) and how the landing page (/) behaves when the user is already signed in (redirect to `/app`). Frontend-only; no backend or API changes.

### Modified Capabilities
- *(None — no existing main specs in openspec/specs/; app-shell behavior is extended by this change but we are not changing a published app-shell spec.)*

## Impact

- **Frontend**: Clerk component props or environment variables for sign-in/sign-up redirect URLs; landing page (/) gains an auth check and redirect to `/app` when `userId` is present. No new routes; no backend or API changes.
