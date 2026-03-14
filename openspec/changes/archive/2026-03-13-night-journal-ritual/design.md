## Context

The Tonight tab currently renders a static card with a "Start writing →" link that navigates to `/app/journal`, which is a read-only list of past entries. There is no way to create a journal entry from the UI. The API already has `POST /journal` and `GET /journal` endpoints, but they only handle `date` and `text` fields. The new ritual must live entirely inside the Tonight tab (no navigation away), extend the data model, and produce a visually satisfying seal animation that bridges the journal and the mosaic pixel.

## Goals / Non-Goals

**Goals:**
- Replace the Tonight tab stub with a real stepped ritual flow (mood → prompt → optional free write → seal)
- Implement the day seal animation: text collapses into today's pixel, mood-color screen wash, fade to Today tab
- Render a distinct sealed glow on today's pixel in the Mosaic tab
- Show a read-only sealed view when the user revisits the Tonight tab after sealing
- Extend the API journal document to store mood, prompt_id, prompt_response, free_text, sealed
- Provide `GET /journal/today` to check if today is already sealed on app load

**Non-Goals:**
- Voice input (future)
- AI-generated prompts (future)
- Backfill / editing sealed entries
- Social sharing of entries
- Push notifications / reminders (separate feature)

## Decisions

### Decision: Ritual lives entirely inside the Tonight tab — no navigation
The original stub navigated to `/app/journal` for writing. We keep writing inline in the Tonight tab to eliminate the context switch and reduce friction. `/app/journal` becomes a read-only archive only.

**Alternative considered**: Keep journal page as the write surface, deep-link from Tonight tab.
**Why rejected**: Every extra tap and navigation adds drop-off risk for a nightly ritual. Inline = zero friction.

### Decision: Mood tap alone is sufficient to seal
A user can tap a mood and immediately tap "Seal the day" without writing anything. Prompt response and free text are always optional.

**Alternative considered**: Require at least one sentence of text.
**Why rejected**: On hard days, forcing text creates the exact burden we're designing against. A mood-only entry is still valuable data for the AI memory layer.

### Decision: Prompt selected by `day_of_year % prompt_count` (deterministic, client-side)
All users see the same prompt on the same day. No API call needed. Simple and consistent.

**Alternative considered**: Per-user random prompt stored server-side.
**Why rejected**: Over-engineered for MVP. Same-prompt-for-everyone creates a subtle shared-journal feeling without any infrastructure cost. AI personalization comes later.

### Decision: Day seal animation uses Framer Motion with pixel position measurement
The text-flies-into-pixel animation requires knowing the pixel's screen coordinates at seal time. We measure the pixel DOM element's `getBoundingClientRect()` at the moment the user taps "Seal the day" and animate the text container toward those coordinates using Framer Motion's `animate` with absolute positioning.

**Alternative considered**: Pure CSS transition.
**Why rejected**: CSS transitions can't target dynamic coordinates. Framer Motion's layout animations are the right tool.

### Decision: `GET /journal/today` endpoint for sealed-state check
On app load, the Tonight tab needs to know if today is already sealed to show the read-only view vs. the ritual flow. A dedicated endpoint avoids the client parsing through a date-range response.

**Alternative considered**: Client checks `GET /journal?start=today&end=today`.
**Why rejected**: More fragile — requires client date logic to match server date logic. Explicit endpoint is cleaner.

### Decision: No backfill
If a day passes without sealing, that pixel stays unsealed forever. The app never prompts for yesterday.

**Rationale**: Backfill undermines the ritual's honesty and the pixel mosaic's meaning as a truthful record. The constraint makes the daily habit more valuable.

## Risks / Trade-offs

- **Animation coordinate timing** → The pixel may not be in the DOM or may be off-screen when Tonight tab is active (different tab). Mitigation: animate toward a fixed fallback position (screen center bottom) if the pixel element is not measurable. Or briefly flash to Today tab, measure, then animate.
- **8pm time-gate correctness** → Client clock can be wrong or manipulated. Mitigation: time gate is client-side only for now; no server enforcement needed for MVP. Edge case (user travels timezones) is acceptable.
- **Prompt set staleness** → 15 prompts cycle every 15 days. After a month, users see repeats. Mitigation: acceptable for MVP. AI prompts are the planned upgrade path.
- **Mosaic pixel sealed state** → Requires fetching today's journal status to render the sealed glow. Adds one extra API call on Mosaic tab load. Mitigation: `GET /journal/today` is lightweight; cache in React state.

## Open Questions

- Should the mood-color screen wash use the selected mood's color or the user's habit palette average? (Suggest: mood color for clarity.)
- After the seal animation completes, should the app auto-switch to the Today tab, or stay on Tonight (showing the read-only sealed view)?
