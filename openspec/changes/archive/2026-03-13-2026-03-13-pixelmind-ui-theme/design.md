# Midnight Mosaic — PixelMind UI Theme & Primary Flow

## 1. Design direction

- **Mood**: Calm, night-friendly, gentle. Avoid bright or triggering colors; prefer cool, muted tones.
- **Research alignment**: Cool palettes (blue/teal/green) support trust and retention; dark default supports evening use; one primary action per screen supports completion.
- **Scope**: Dark-only for MVP. Single accent for primary actions; habit palette reserved for the pixel grid and habit labels only.

---

## 2. Color tokens (Midnight Mosaic)

All values are specified so they can be implemented as CSS custom properties and/or Tailwind theme extension.

### 2.1 App theme (surfaces & text)

| Token            | Purpose                         | Recommended value (hex)   | Notes                                      |
|------------------|----------------------------------|---------------------------|--------------------------------------------|
| `--bg-app`       | Main app background             | `#0f1419` (dark blue-grey)| Slightly cooler than pure slate            |
| `--bg-surface`    | Cards, panels, sidebar          | `#1a2332`                 | Lighter than app bg, still dark             |
| `--border-default`| Borders, dividers               | `#2d3a4f`                 | Subtle, not harsh                           |
| `--text-primary` | Headings, primary body          | `#f0f4f8`                 | Off-white, not pure white                  |
| `--text-muted`   | Secondary text, labels          | `#94a3b8`                 | Readable but clearly secondary             |
| `--text-faint`   | Placeholders, hints             | `#64748b`                 | Lowest emphasis                            |
| `--accent`       | Primary CTA, focus, progress    | `#5eead4` (soft teal)     | Calm, high contrast on dark                |
| `--accent-hover` | Hover state for accent          | `#2dd4bf`                 | Slightly brighter teal                     |
| `--destructive`  | Errors, destructive actions     | `#f87171`                 | Soft red, avoid bright red                  |

### 2.2 Habit palette (pixel grid only)

Fixed set of 8 colors. Each habit is assigned one index (1–8). Colors are muted, distinguishable on dark, and safe for typical color vision.

| Index | Name (for UX/settings) | Hex       | Use case example   |
|-------|-------------------------|-----------|---------------------|
| 1     | Sage                    | `#86efac` | Green               |
| 2     | Sky                     | `#7dd3fc` | Light blue          |
| 3     | Lavender                | `#c4b5fd` | Purple              |
| 4     | Peach                   | `#fdba74` | Warm orange         |
| 5     | Rose                    | `#f9a8d4` | Pink                |
| 6     | Mint                    | `#99f6e4` | Teal                |
| 7     | Amber                   | `#fcd34d` | Yellow/gold         |
| 8     | Slate                   | `#cbd5e1` | Neutral light grey  |

- **Usage**: Grid cells for “completed” use the habit’s assigned color; “not completed” uses a neutral empty state (e.g. `--bg-surface` or a dimmer shade). Habit color picker in settings uses this palette only.
- **Accessibility**: Ensure sufficient contrast for small cells; pair with icon or label where needed. Avoid using habit colors for critical UI (e.g. success/error).

---

## 3. Typography

- **Font stack**: Geist Sans (already loaded) for UI and body; Geist Mono only where code or fixed-width is needed.
- **Body**: Use `--text-primary` for body; size and line-height comfortable for reading (e.g. 1rem base, line-height 1.6). Prefer `--text-muted` for secondary copy.
- **Headings**: Single scale (e.g. 1.5rem–2rem for page titles, 1rem–1.25rem for section titles). Avoid heavy all-caps except small labels (e.g. “PIXELMIND” in sidebar).
- **Contrast**: No pure white on pure black; use `--text-primary` on `--bg-app` / `--bg-surface`.

---

## 4. Primary flow sketch

Each main screen has **one main job** and **one dominant primary action** where applicable.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LANDING (/)                                                            │
│  Job: Explain value + get user to sign up or sign in.                    │
│  Primary CTA: "Get started" (sign up). Secondary: "I already have an     │
│  account" (sign in).                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  APP HOME (/app)                                                        │
│  Job: Show today’s context (week grid + habits) and start the night     │
│  ritual.                                                                │
│  Primary CTA: "Start tonight’s reflection" (or "Begin reflection")      │
│  → links to /app/journal with “new entry” or direct nightly flow.       │
│  Secondary: Grid is informational; tapping a cell can toggle habit      │
│  completion (if we support that from home).                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  NIGHT JOURNAL (/app/journal)                                           │
│  Job: Complete a short, guided 3–5 min reflection (mood → prompt →       │
│  optional free text → done).                                            │
│  Primary CTA: One per step—e.g. "Next" / "Save" at end. Linear flow;    │
│  no nested menus mid-ritual.                                            │
│  Secondary: List of past entries (read-only from this view).            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  INSIGHTS (/app/insights)                                                │
│  Job: Show one main insight card (narrative, not dashboard).             │
│  Primary CTA: None required; optional "Refresh" or "See more" if we     │
│  support multiple cards later.                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Onboarding**: Stays as-is structurally; apply same theme tokens and gentle copy. Primary CTA per step = “Continue” / “Finish setup.”
- **Settings**: Apply tokens; no single primary CTA—list of options and saves.

---

## 5. Component usage (guidelines)

- **Buttons**: Primary = `--accent` bg, dark text (or dark bg with accent text). Secondary = border only using `--border-default`, text `--text-primary`.
- **Cards / panels**: `--bg-surface`, border `--border-default`, rounded corners (e.g. 0.75rem).
- **Nav (sidebar)**: Same surface as app; active route indicated by accent underline or subtle accent bg, not only color.
- **Inputs**: Background slightly lighter than surface or same; border `--border-default`; focus ring `--accent`.
- **Feedback**: Success = accent or soft green; errors = `--destructive`; copy neutral and non-judgmental.

---

## 6. Out of scope for this design

- Light mode or theme toggle.
- Motion specs (can be “subtle, easing-based” by convention).
- Full wireframes or high-fidelity mockups; this document is the single source of truth for tokens, palette, and flow roles.
