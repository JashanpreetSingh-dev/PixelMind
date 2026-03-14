# Tasks: PixelMind UI Theme (Midnight Mosaic)

- [x] **Define design tokens** — Add CSS custom properties (and/or Tailwind theme) in `globals.css` / Tailwind config for `--bg-app`, `--bg-surface`, `--border-default`, `--text-primary`, `--text-muted`, `--text-faint`, `--accent`, `--accent-hover`, `--destructive`. Map to the hex values in design.md.
- [x] **Define habit palette** — Add the 8 habit colors (Sage, Sky, Lavender, Peach, Rose, Mint, Amber, Slate) as tokens or a shared constant (e.g. `habitColors[1..8]`) for use in the pixel grid and any habit color picker.
- [x] **Apply theme to app shell** — Update app layout (sidebar, main, nav links, borders) to use the new tokens instead of raw slate classes. Ensure active nav state uses accent (e.g. underline or subtle bg).
- [x] **Apply theme to landing** — Update landing page background, text, and CTAs to use theme tokens; primary CTA uses `--accent`.
- [x] **Wire habit palette to home grid** — Replace single “filled” color (e.g. slate-50) with the habit’s assigned palette color for completed cells; empty cells use neutral empty state from theme.
- [x] **Typography** — Ensure Geist Sans is applied via CSS (body or root); remove Arial fallback from globals. Optionally add a small type scale (headings vs body) using theme tokens.
- [x] **Primary CTA on app home** — Add or emphasize “Start tonight’s reflection” (or equivalent) as the main CTA linking to journal flow, styled with accent.
