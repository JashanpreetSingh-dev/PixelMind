## Context

PixelMind uses Clerk for auth and a FastAPI backend with a `users` collection keyed by `clerk_user_id`. GET /me already bootstraps/returns the user document (`onboarding_completed`, `preferences`). The frontend links to `/app/settings` from the app shell and bottom nav, but no settings page exists. Preferences are only set during onboarding (`primary_feeling`); there is no way to edit them later or to expose theme/week-start. Profile (name, avatar) lives in Clerk and is not shown in-app. Design is minimal and mobile-first: one Settings screen, no sub-pages, touch-friendly.

## Goals / Non-Goals

**Goals:**
- One Settings page at `/app/settings` with Profile (Clerk), Preferences (primary feeling, theme, week start), and Sign out.
- Backend support to read and update current-user preferences (PATCH /me); GET /me unchanged.
- Minimal, mobile-first UX: full-width rows, 44px min tap targets, tap-to-edit (e.g. bottom sheet or inline picker), auto-save on change.
- Reuse existing theme tokens and list/card patterns; no new design system.

**Non-Goals:**
- Separate Profile page or route; profile is a block on Settings only.
- Storing name/avatar in our DB (Clerk remains source of truth for identity).
- Email/password management in-app (delegate to Clerk “Manage account”).
- New preferences (e.g. notifications, locale) in this change; only primary feeling, theme, week start.

## Decisions

**1. Single page for Settings (no /profile route)**  
One scrollable page with three blocks: You, Preferences, Sign out. Avoids extra navigation and matches “minimal” scope. Alternative: separate /app/profile and /app/settings; rejected to keep surface small and mobile-first.

**2. Profile from Clerk only; “Manage account” links out**  
Avatar and name come from Clerk (e.g. `useUser()`). No sync of profile into our DB for v1. “Manage account” opens Clerk’s account/profile UI (or UserButton menu). Alternative: mirror name/avatar in `users`; rejected to avoid sync and dual source of truth.

**3. PATCH /me for preferences; partial updates**  
Single endpoint accepts a JSON body (e.g. `preferences` object or subset). Backend merges into existing `preferences` (e.g. `$set` on nested keys). No separate “profile” PATCH; identity stays in Clerk. Alternative: PUT /me replacing full user doc; rejected to reduce payload and accidental overwrites.

**4. Preferences shape: primary_feeling, theme, week_starts_on**  
- `primary_feeling`: string, same set as onboarding (e.g. Calm, Energized, Proud, Grounded, Clear-headed); optional.  
- `theme`: string, one of `"light"` | `"dark"` | `"system"`; default `"system"` if absent.  
- `week_starts_on`: string, `"monday"` | `"sunday"`; default `"monday"`.  
Stored under `users.preferences`. Validation and defaults applied on PATCH.

**5. Frontend: fetchMe() and updatePreferences() (or single PATCH helper)**  
Settings page needs current user (for onboarding_completed and preferences). Add `fetchMe()` in api.ts (GET /me with auth). For updates, either a dedicated `updatePreferences(partial)` that PATCHes /me or a generic `patchMe(body)`; recommend one helper that sends only `preferences` to keep API contract clear.

**6. Tap-to-edit with immediate persist**  
User taps a preference row → bottom sheet or inline list of options → selects value → UI updates and request sent (PATCH /me). No “Save” button; each change is saved when chosen. Alternative: form with Save; rejected for minimal flow and fewer taps.

**7. Theme preference drives UI only on frontend**  
Backend stores `preferences.theme`; frontend reads it and applies class or data attribute for light/dark/system. No backend rendering of themes; no new API for “theme” beyond storing in preferences.

## Risks / Trade-offs

- **Theme not applied until Settings is loaded**  
  If theme is read only from /me, first paint may use default until fetch completes. Mitigation: optional cookie or localStorage cache for last theme; or accept brief default then switch. Can be refined later.

- **Clerk “Manage account” leaves the app**  
  User may not realize they’re in Clerk’s hosted UI. Mitigation: label clearly (“Manage account” / “Account settings”) and ensure return URL brings them back to app.

- **No optimistic UI for PATCH**  
  If we don’t implement optimistic updates, UI waits for PATCH response. Mitigation: keep PATCH fast; consider optimistic update in a later iteration if needed.

## Migration Plan

- No data migration: `preferences` already exists; new keys (`theme`, `week_starts_on`) are optional and defaulted on read or in PATCH handler.
- Deploy: backend first (PATCH /me), then frontend (Settings page + fetchMe + update helper). Nav already points to /app/settings; once the page exists, link is live.
- Rollback: remove or revert Settings page; PATCH /me can remain (no callers except Settings). No DB rollback needed.

## Open Questions

- Whether to add a small “Signed in as &lt;email&gt;” under the profile block for clarity (optional; can be deferred).
- Exact copy for “Manage account” vs “Account settings” and placement of UserButton if used (e.g. in header vs inside Profile block).
