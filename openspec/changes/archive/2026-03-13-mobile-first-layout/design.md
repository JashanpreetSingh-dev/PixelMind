## Context

PixelMind is a PWA aimed at phone-first use (habit tracking, night journal). The current app layout uses a fixed left sidebar (w-56, ~224px) for navigation; on a ~375px viewport this leaves only ~151px for main content, making the app effectively unusable on small screens. The proposal calls for a mobile-first shell: full-width content by default and navigation suited to touch devices (e.g. bottom nav), with optional adaptation for larger viewports.

## Goals / Non-Goals

**Goals:**
- On small viewports (mobile-first default), show a single-column layout with full-width main content and a bottom navigation bar for Home, Journal, Insights, and Settings. No fixed sidebar consuming horizontal space.
- Ensure navigation and primary CTAs have touch-friendly tap targets (minimum effective size ~44px where applicable).
- Respect safe-area insets (notch, home indicator) when the app is installed as a PWA so content is not obscured.
- On medium and larger viewports, either keep the bottom nav for consistency or show a sidebar; the design choice is documented below.
- Set or confirm viewport meta so layout and font scaling behave correctly on mobile.

**Non-Goals:**
- Changing routes, backend, or feature logic; redesigning the content of home/journal/insights/settings; adding new app sections; changing PWA manifest beyond what is needed for display/safe-area.

## Decisions

1. **Bottom navigation on small viewports, optional sidebar on md+**
   - **Decision:** Use a bottom navigation bar as the primary nav on viewports below the `md` breakpoint (e.g. &lt; 768px). On `md` and above, either retain the bottom bar or show a left sidebar; recommend retaining bottom bar for consistency unless product prefers a desktop-style sidebar at md+.
   - **Rationale:** Bottom nav is thumb-friendly and familiar on mobile; it avoids the cramped layout of a fixed sidebar on narrow screens. Keeping one nav pattern (bottom bar) across breakpoints simplifies implementation and mental model.
   - **Alternatives considered:** Hamburger/drawer — saves space but hides nav behind a tap; bottom nav is more direct. Sidebar only at md+ — acceptable if product wants a more “desktop app” feel on large screens; can be added later.

2. **Touch-friendly targets**
   - **Decision:** Size bottom nav items and other primary tappable controls so their clickable area is at least ~44px in the shorter dimension (e.g. min-height or padding so effective target ≥ 44px).
   - **Rationale:** Aligns with common accessibility and mobile UX guidance (e.g. Apple HIG, Material) and reduces mis-taps.
   - **Alternatives considered:** Relying on default link/button size — often too small on mobile; explicit min sizing is low cost and high benefit.

3. **Safe-area insets**
   - **Decision:** Apply `env(safe-area-inset-bottom)` (and optionally `env(safe-area-inset-top)`) to the bottom nav and any full-bleed layout so content is not drawn under the home indicator or notch when running as an installed PWA. Use `viewport-fit=cover` in the viewport meta if needed for the safe-area env vars to be applied.
   - **Rationale:** PWAs on iOS/Android can run in standalone mode where system UI overlaps the viewport; safe-area padding prevents overlap.
   - **Alternatives considered:** Ignoring safe areas — leads to clipped or hard-to-tap UI on notched devices.

4. **Viewport meta**
   - **Decision:** Ensure the root layout or document includes a viewport meta that allows proper scaling on mobile (e.g. `width=device-width, initial-scale=1`). Next.js provides a default; if overridden, preserve mobile-friendly scaling and add `viewport-fit=cover` only if using safe-area insets.
   - **Rationale:** Prevents zoom or layout issues on small screens; required for reliable mobile-first layout.
   - **Alternatives considered:** No viewport meta — not recommended; Next.js default is sufficient unless custom needs exist.

## Risks / Trade-offs

- **Bottom nav on desktop:** Some users may prefer a sidebar on large screens. Mitigation: Implement bottom nav first; add optional sidebar at md+ in a follow-up if needed.
- **Keyboard and screen readers:** Bottom nav must remain focusable and announced correctly. Mitigation: Use semantic nav and links/buttons; ensure focus order and labels.
- **Very small phones:** On very narrow or short viewports, bottom nav plus content may feel tight. Mitigation: Use compact but still touch-friendly nav; test on minimum target viewport (e.g. 320px width).

## Migration Plan

- Frontend-only change: deploy updated app layout and nav components. No data or API migration. Rollback: revert layout/nav components to previous version if issues arise.

## Open Questions

- Whether to introduce a sidebar at `md` and above in this change or in a later iteration (recommendation: bottom nav only in this change for simplicity).
