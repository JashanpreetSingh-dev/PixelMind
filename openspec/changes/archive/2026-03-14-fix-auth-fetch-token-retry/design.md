## Context

All authenticated API calls in the frontend go through a single `authFetch` helper in `web/src/lib/api-client.ts`. It calls Clerk's `getToken()`, attaches the JWT as a Bearer header, and fetches. When the page mounts, React Query fires multiple queries concurrently — all calling `getToken()` at nearly the same instant. Clerk's token cache can be in a transitional state (near-expiry or mid-refresh) at that moment, causing some requests to carry a token the server rejects with 403. The same scenario can occur mid-session when a long-lived token expires.

Currently `authFetch` makes no attempt to recover from a 403 — the error propagates immediately.

## Goals / Non-Goals

**Goals:**
- Transparently recover from a 403 caused by a stale Clerk token in `authFetch`
- Fix both the page-mount race and mid-session token expiry in one place
- Zero changes required to individual query call sites

**Non-Goals:**
- Retrying on any other error codes (401, 5xx, network errors)
- Changing how React Query is configured
- Adding `enabled: isLoaded && isSignedIn` guards (these would only solve the startup case)

## Decisions

### Decision: Retry in `authFetch`, not at the query layer

**Chosen**: Intercept 403 inside `authFetch`, force a fresh token with `getToken({ skipCache: true })`, and retry the original request once.

**Alternative considered**: Add `enabled: isLoaded && isSignedIn` to every `useQuery` call.
- Rejected: only prevents the startup race; doesn't help when a token expires mid-session. Also requires every future query to remember the guard.

**Alternative considered**: Custom React Query `retry` callback that refreshes the token.
- Rejected: React Query retries fire with a delay and the existing token, not a forced-fresh one. Requires changes at every `useQuery` site.

### Decision: Retry exactly once on 403

A single retry is sufficient — if the fresh token also results in a 403, the user has a genuine authorization problem and the error should surface. Unlimited retries would mask real auth failures.

### Decision: Use `getToken({ skipCache: true })`

Clerk's `getToken` accepts `{ skipCache: true }` to bypass the internal token cache and force a refresh. This ensures the retry uses a genuinely fresh JWT, not the same potentially-stale one.

## Risks / Trade-offs

- **Double request on 403**: Every legitimate 403 (e.g., a misconfigured endpoint) will now fire two requests instead of one. Mitigation: 403s on correct endpoints only happen during the startup window or after token expiry — not a normal-path concern.
- **`skipCache` API availability**: Must verify `{ skipCache: true }` is supported in the installed version of `@clerk/nextjs`. If not available, a plain `getToken()` retry still helps in most cases since Clerk will have refreshed internally between the failed call and the retry.

## Migration Plan

- Single file change: `web/src/lib/api-client.ts`
- No backend or database changes
- No deployment coordination needed — purely frontend
- Rollback: revert the `authFetch` function to its current form
