## 1. Responsive app shell structure

- [x] 1.1 Update app layout so the sidebar is hidden on viewports below the md breakpoint and main content is full width; on md and above, show the existing sidebar (or keep bottom nav only per design)
- [x] 1.2 Ensure main content area uses full available width on small viewports (no fixed sidebar consuming horizontal space)

## 2. Bottom navigation

- [x] 2.1 Add a bottom navigation bar component with links for Home (/app), Journal (/app/journal), Insights (/app/insights), and Settings (/app/settings), visible on viewports below md
- [x] 2.2 Style the bottom nav with theme tokens (e.g. bg-bg-surface, border, text) and ensure the active route is visually indicated

## 3. Touch targets and safe-area

- [x] 3.1 Size bottom nav items so tap targets are at least ~44px in the shorter dimension (min-height or padding)
- [x] 3.2 Apply safe-area insets to the bottom nav (e.g. padding-bottom with env(safe-area-inset-bottom)) and add viewport-fit=cover to viewport meta if required for safe-area env vars

## 4. Viewport and accessibility

- [x] 4.1 Confirm or add viewport meta (width=device-width, initial-scale=1) in root layout; add viewport-fit=cover if using safe-area
- [x] 4.2 Ensure bottom nav uses semantic nav and accessible labels so keyboard and screen reader users can reach Home, Journal, Insights, and Settings
