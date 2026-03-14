## 1. Backend – PATCH /me and preferences

- [x] 1.1 Add PATCH /me endpoint in api/main.py: accept JSON body with optional `preferences` object, merge into current user document, require same Clerk auth as GET /me
- [x] 1.2 Validate preference keys in PATCH /me: allow `primary_feeling` (string), `theme` ("light" | "dark" | "system"), `week_starts_on` ("monday" | "sunday"); reject invalid values with 400
- [x] 1.3 Ensure GET /me response includes `preferences` (default to {} if missing) and serialize _id to string

## 2. Frontend API helpers

- [x] 2.1 Add fetchMe() in web/src/lib/api.ts: GET /me with auth, return user document (for use on Settings page)
- [x] 2.2 Add updatePreferences(partial) or patchMe(body) in api.ts: PATCH /me with preferences payload, use auth token

## 3. Settings page – structure and profile block

- [x] 3.1 Create web/src/app/app/settings/page.tsx: single scrollable page with title "Settings", three sections (You, Preferences, Sign out)
- [x] 3.2 Implement Profile block ("You"): show avatar (from Clerk or initials placeholder) and name from Clerk; use useUser() or equivalent for Clerk data
- [x] 3.3 Add "Manage account" control in Profile block that opens Clerk account/profile (e.g. link to Clerk or UserButton); ensure 44px min tap target

## 4. Settings page – preferences and sign out

- [x] 4.1 Add Preferences block: list rows for Primary feeling, Theme, Week starts on; each row shows label and current value, full-width tap target (min 44px)
- [x] 4.2 Implement tap-to-edit for Primary feeling: open picker (bottom sheet or inline) with options Calm, Energized, Proud, Grounded, Clear-headed; on select call updatePreferences and refresh/update UI
- [x] 4.3 Implement tap-to-edit for Theme: options Light, Dark, System; on select call updatePreferences and apply theme in app (e.g. class or data attribute)
- [x] 4.4 Implement tap-to-edit for Week starts on: options Monday, Sunday; on select call updatePreferences and update UI
- [x] 4.5 Add Sign out control: trigger Clerk sign-out and redirect to sign-in or landing; full-width, clear tap target

## 5. Apply preferences in app (optional follow-up)

- [x] 5.1 Use stored theme preference (light/dark/system) for app shell and pages; read from fetchMe or context after load
- [x] 5.2 Use week_starts_on preference for home grid and any week-based views (default Monday if absent)
