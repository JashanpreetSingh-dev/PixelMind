## Why

PixelMind is intended to be used mostly on a phone (PWA, night journal, habit check-in). The current app shell uses a fixed sidebar (224px) that is always visible; on a typical phone width (~375px) this leaves too little space for content and makes the app feel broken. We need a mobile-first layout so the primary experience is single-column, full-width content with navigation suited to small screens, while still working well on larger viewports.

## What Changes

- Replace the always-visible sidebar with a **responsive navigation** pattern: on small viewports (mobile-first), use a **bottom navigation bar** for the main app sections (Home, Journal, Insights, Settings); on medium-and-up viewports, optionally show a sidebar or keep bottom nav for consistency.
- Ensure the **main content area** is full width on small screens (no fixed sidebar consuming horizontal space).
- Apply **touch-friendly** sizing for navigation and primary actions (minimum ~44px tap targets where applicable).
- Add **viewport** and **safe-area** considerations so the app behaves correctly when installed as a PWA (notch, home indicator).
- No changes to routes, backend, or feature logic; only layout, navigation UX, and responsive behavior.

## Capabilities

### New Capabilities
- `mobile-first-app-shell`: Defines responsive app layout and navigation—bottom nav on small viewports, full-width main content, touch-friendly targets, and safe-area handling. App-shell structure (which routes exist) is unchanged; only how navigation is presented and how the shell adapts to viewport size.

### Modified Capabilities
- *(None — no existing main specs in openspec/specs/ for app-shell that we are modifying.)*

## Impact

- **Frontend**: App layout component(s) in Next.js; responsive breakpoints (e.g. default = mobile, md+ = optional sidebar or adjusted nav); new or refactored nav component (bottom bar + optional sidebar); viewport meta if not already set; CSS for safe-area insets. No backend or API changes.
