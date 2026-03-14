## Why

The app shell and bottom nav already link to **Settings**, but no settings page exists (dead link). Users have no way to see who they're signed in as, change preferences after onboarding, or sign out from within the app. A minimal, mobile-first Settings experience fixes this and gives a single place for profile and app preferences.

## What Changes

- Add a **Settings page** at `/app/settings` with three blocks: **You** (profile from Clerk + link to manage account), **Preferences** (primary feeling, theme, week start), and **Sign out**.
- Expose **user preferences** via API: allow reading and updating the current user document (e.g. `GET /me` already exists; add **PATCH /me** for preferences). Frontend gains a way to fetch current user (e.g. `fetchMe()`) for the settings page.
- Keep the experience **minimal and mobile-first**: one scrollable screen, full-width tap targets (min 44px), tap-to-edit preferences (e.g. bottom sheet or inline picker), no sub-pages. Profile is read-only from Clerk with a single "Manage account" action.
- No change to onboarding flow; preferences set at onboarding remain editable on Settings.

## Capabilities

### New Capabilities
- `settings-page`: The Settings UI at `/app/settings`: single page with Profile block (avatar, name, "Manage account" via Clerk), Preferences list (primary feeling, theme, week starts on), and Sign out. Minimal, mobile-first layout and interactions.
- `user-preferences`: Backend support for current-user profile and preferences: document shape for `preferences` (e.g. `primary_feeling`, `theme`, `week_starts_on`), PATCH /me to update preferences, and any validation or defaults. GET /me remains the source of truth for the current user document.

### Modified Capabilities
- *(None.)*

## Impact

- **Frontend**: New page at `web/src/app/app/settings/page.tsx`; new or extended API helper (e.g. `fetchMe()`) and optional update helper for preferences; use of Clerk for profile (e.g. `useUser` or UserButton) and for "Manage account". Styling consistent with existing app (theme tokens, list/card patterns).
- **Backend**: New or extended endpoint (e.g. `PATCH /me`) in `api/main.py` to update user document preferences; reuse existing auth and `users` collection. No new collections.
- **Data**: User documents gain or clarify `preferences` fields: `primary_feeling`, `theme`, `week_starts_on`. Existing onboarding already sets `preferences.primary_feeling`; theme and week start are new keys.
