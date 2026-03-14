## ADDED Requirements

### Requirement: authFetch retries once on 403 with a fresh token
When an authenticated API request receives a 403 response, `authFetch` SHALL obtain a fresh Clerk token (bypassing the cache) and retry the request exactly once before propagating the error.

#### Scenario: Stale token causes 403, fresh token succeeds
- **WHEN** `authFetch` sends a request and the server returns 403
- **THEN** `authFetch` calls `getToken({ skipCache: true })` to obtain a fresh token
- **AND** retries the original request with the new token
- **AND** returns the successful response

#### Scenario: 403 persists after token refresh
- **WHEN** `authFetch` retries with a fresh token and the server returns 403 again
- **THEN** `authFetch` throws an error (does not retry a second time)

#### Scenario: Non-403 error is not retried
- **WHEN** the server returns any status other than 403 (e.g., 401, 500, 404)
- **THEN** `authFetch` returns the response as-is without retrying

#### Scenario: Token is null after forced refresh
- **WHEN** `getToken({ skipCache: true })` returns null
- **THEN** `authFetch` throws "Not authenticated" without making a second request
