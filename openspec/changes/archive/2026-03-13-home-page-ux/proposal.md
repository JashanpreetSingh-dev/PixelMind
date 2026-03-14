## Why

The app home page currently buries the primary action ("Start tonight's reflection") below the week grid and uses vague labels (D1–D7) with no clear "today." On mobile, users don't get an immediate answer to "what should I do?" or "what's my status?" We need a clear hierarchy and today-centric framing so the home feels intuitive: one visible primary CTA, obvious "today" in the grid, and optional one-line status.

## What Changes

- Reorder the home page so the **primary CTA** ("Start tonight's reflection" or equivalent) appears above the fold (e.g. after a short today summary or as the first content block), not below the grid.
- Add a **today summary line** (e.g. "Reflect tonight" or "X of Y habits done • Reflect tonight") at the top so status and next action are obvious at a glance.
- Improve the **week grid**: use real day labels (e.g. Mon–Sun or dates) instead of D1–D7, and **visually highlight the "today" column** so users know which day is current.
- Keep the grid as the "mosaic" context below the CTA; optionally prepare for **tap-to-toggle** habit completion for today in a follow-up (this change does not require implementing tap-to-toggle, only the layout and labels).
- No new routes or backend contract changes; only the structure, order, and presentation of the existing app home.

## Capabilities

### New Capabilities
- `app-home-page`: Defines the app home (/app) content hierarchy, today summary, primary CTA placement, and week grid presentation (day labels, today column highlight). Frontend-only; uses existing habits and days API.

### Modified Capabilities
- *(None.)*

## Impact

- **Frontend**: App home page component(s); reorder sections (summary + CTA first, grid below); grid header and column styling for day names and today highlight; optional derivation of "today's completion count" from existing data. No backend or API changes.
