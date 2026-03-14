## 1. Theme and colors

- [x] 1.1 Add Today-specific CSS variables in globals.css: --today-bg #0d0f12, --today-card-bg #151821, --today-card-border #2a2d32, --today-accent #1D9E75, --today-completed-border #0d4d33, --today-completed-bg #0a1a12
- [x] 1.2 Expose variables to Tailwind (e.g. @theme or matching utility classes) so TodayView and HabitCard can use them
- [x] 1.3 Apply Today page background (#0d0f12) to the Today screen container (main or wrapper used by /app)

## 2. Header

- [x] 2.1 Update Today header to show a small muted date line (e.g. "Friday, Mar 13") using local date and muted text style
- [x] 2.2 Set greeting to large white text, time-aware (morning/afternoon/evening), with user first name when available; remove or repurpose refresh button if it clashes with layout, or keep it minimal

## 3. Per-habit mosaic strip

- [x] 3.1 Replace single-row mosaic with a grid: one row per habit, 30 columns (last 30 days); each cell is a small pixel (e.g. 10–12px)
- [x] 3.2 For each cell: if date > today show dark #151821; else if habit completed that day show habit color with opacity that increases from left (older) to right (today); else show dark or very muted cell for past uncompleted
- [x] 3.3 Wrap the strip in a horizontally scrollable container (overflow-x-auto) with fixed or min column width so it scrolls when needed
- [x] 3.4 When there are no habits, hide the mosaic or show a single row of 30 dark cells so layout stays consistent

## 4. Habit cards (layout and styling)

- [x] 4.1 Restyle HabitCard container: background #151821, 1px border #2a2d32, 14px border radius (use Today CSS variables)
- [x] 4.2 Left side: small colored square dot (habit color), habit name white font-weight 500, below it muted streak label "Start your streak" (streak 0) or "Day N streak" (N ≥ 1)
- [x] 4.3 Right side: add circular tap target (empty circle); keep whole card tappable for completion
- [x] 4.4 On completed state: circle fills with teal (#1D9E75) and white checkmark; card border #0d4d33, background #0a1a12
- [x] 4.5 Preserve long-press menu (edit, skip, delete) and swipe-left to skip on the card

## 5. Reflection bar

- [x] 5.1 Add a full-width bar at the bottom of Today content (above bottom nav), teal-tinted background
- [x] 5.2 Before 8pm local: show "Tonight's reflection unlocks at 8pm" and a small pulsing dot (CSS animation) on the left
- [x] 5.3 At or after 8pm local: show "Start tonight's reflection" (or equivalent) and link to /app/journal; hide or remove the pulse dot as appropriate

## 6. Empty state

- [x] 6.1 Replace current empty state (single card + Add habit button) with three ghost placeholder cards: same shape as habit cards (dark bg, border, 14px radius), no content
- [x] 6.2 Add CSS shimmer animation to the ghost cards (e.g. gradient or opacity animation)
- [x] 6.3 Add subtle "Add your first habit +" label that opens the existing habit creation sheet on click/tap
- [x] 6.4 Ensure no large empty white space; keep layout compact

## 7. Bottom navigation and add-habit

- [x] 7.1 Update BottomNav so the active tab uses teal (#1D9E75) for the active state (match --today-accent)
- [x] 7.2 When user has habits and is under max: show add-habit entry (compact FAB or "+ Add habit" link) that opens habit creation; when at max habits, hide or disable and show capacity message if user tries to add

## 8. Polish and preserved behavior

- [x] 8.1 Ensure pull-to-refresh (or equivalent) still refetches habits and days and updates mosaic and cards
- [x] 8.2 Ensure all-done celebration still triggers when the last habit is completed and dismisses correctly with the new layout
- [x] 8.3 Verify completion toggle, streak computation, and day upsert API usage are unchanged and work with the new card UI
