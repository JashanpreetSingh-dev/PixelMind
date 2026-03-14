## Why

Authenticated API requests intermittently return 403 Forbidden because concurrent React Query fetches on page mount call `getToken()` simultaneously, sometimes receiving a stale or mid-refresh Clerk JWT that the server rejects. This also affects mid-session scenarios where a long-lived token expires. React Query retries succeed, but the silent failures create noise in server logs and brief loading gaps in the UI.

## What Changes

- `authFetch` in `web/src/lib/api-client.ts` gains a single-retry on 403: if the server returns 403, force a fresh token via `getToken({ skipCache: true })` and retry the request once before propagating the error.

## Capabilities

### New Capabilities

- `auth-fetch-retry`: Retry logic within the shared `authFetch` helper that handles stale/expired Clerk tokens by transparently refreshing and retrying on 403.

### Modified Capabilities

<!-- No existing spec-level behavior changes -->

## Impact

- `web/src/lib/api-client.ts` — `authFetch` function modified
- All API calls that go through `authFetch` benefit automatically (habits, days, journal, insights, onboarding)
- No backend changes required
- No breaking changes
