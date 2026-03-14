## Why

PixelMind’s current UI uses ad hoc Tailwind classes (slate-950, slate-800, etc.) with no shared design tokens, no habit color palette, and no clear visual or UX direction. To feel cohesive and aligned with research on wellness and journaling apps—calm, trustworthy, night-friendly—we need a defined **theme** and **primary flow** so every screen has a clear role and the app reads as one product.

## What Changes

- Introduce a **named visual theme (“Midnight Mosaic”)** with semantic design tokens: app background, surface, accent, text, muted text, and a fixed **habit palette** (6–8 colors) for the pixel grid.
- Align typography and contrast with accessibility and “gentle” mood: off-white text on dark, comfortable line-height, single accent color for primary actions.
- Define a **primary flow** for the app: home screen and night journal ritual each have one main job and one dominant CTA, reducing cognitive load and matching research on guided, short rituals.
- Document these choices in a design so implementation (CSS variables, Tailwind theme, component usage) can be done consistently in a follow-up change.

## Capabilities

### New Capabilities
- `ui-theme`: Defines the PixelMind visual system—design tokens (colors, typography), habit palette, and usage rules for surfaces, accents, and text. No new routes or backend; frontend-only.

### Modified Capabilities
- `app-shell`: Layout and shell will use the new theme tokens for background, sidebar, and nav so the app feels consistent with the defined aesthetic.

## Impact

- **Frontend**: New or extended CSS variables and/or Tailwind theme; globals and app layout updated to use tokens. Habit grid and any habit color selectors use the defined palette. Landing and auth surfaces can optionally adopt the same theme for cohesion.
- **Design doc**: Single source of truth for “Midnight Mosaic” colors, type scale, and primary flow sketch; no backend or API changes.

## Non-Goals

- Implementing light mode or theme switching in this change (dark-only for MVP).
- Full visual redesign of every screen; focus is on tokens, habit palette, and flow clarity.
- New features (e.g. new journal steps); only clarifying the existing flow on paper and in design.
