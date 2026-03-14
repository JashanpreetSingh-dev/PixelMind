## Context

The app home (/app) already has a defined job: show today's context (week grid + habits) and start the night ritual, with "Start tonight's reflection" as the primary CTA. Currently the CTA sits in an aside below the week grid; the grid uses D1–D7 with no indication of which column is "today." On mobile this makes the primary action easy to miss. The proposal is to reorder and clarify so the home is intuitive at a glance: summary line, CTA first, then grid with real day labels and today highlighted.

## Goals / Non-Goals

**Goals:**
- Place the primary CTA (Start tonight's reflection) above the fold on typical mobile viewports, after at most a one-line today summary.
- Add a today summary line at the top (e.g. "Reflect tonight" or "X of Y habits done • Reflect tonight") using existing data where possible.
- Replace D1–D7 in the week grid with recognizable day labels (e.g. Mon–Sun or numeric dates) and visually highlight the column that represents "today."
- Keep the week grid as the mosaic context below the CTA; no removal of the grid.

**Non-Goals:**
- Implementing tap-to-toggle habit completion from the home page (can be a follow-up); no new API endpoints or backend changes.

## Decisions

1. **Order: summary line, then CTA, then grid**
   - **Decision:** Render (1) a short today summary line at the top, (2) the primary CTA button, (3) the week grid. Remove or repurpose the current "What's next" aside so the CTA is not duplicated and is the single accent action on the page.
   - **Rationale:** Matches the "one dominant CTA" principle and ensures the action is visible without scrolling on typical phone heights.
   - **Alternatives considered:** CTA only at bottom (sticky) — keeps grid first but CTA can feel secondary; grid first with CTA in a sticky bar — viable but adds UI complexity.

2. **Today summary content**
   - **Decision:** Show at minimum "Reflect tonight" or equivalent; optionally "X of Y habits done • Reflect tonight" when habits exist, derived from current week's days and completed_habit_ids for today (or the last day in the range that is today).
   - **Rationale:** Gives a one-line answer to "what's my status?" without requiring a new API; optional count reinforces the habit mosaic.
   - **Alternatives considered:** No summary — simpler but less informative; summary with streak — deferred to keep scope small.

3. **Grid day labels and today column**
   - **Decision:** Use weekday abbreviations (Mon, Tue, …) or numeric dates (e.g. 10, 11, 12) for the seven columns; compute which column index corresponds to "today" from the week range and apply a distinct style (e.g. border, background, or "Today" label) to that column only.
   - **Rationale:** D1–D7 are ambiguous; real labels and a highlighted column make "today" obvious.
   - **Alternatives considered:** Today column first on mobile — improves scannability but reorders columns; can be a later enhancement.

4. **Single CTA, no duplicate aside**
   - **Decision:** One "Start tonight's reflection" (or "Reflect tonight") CTA on the home page, placed after the summary line. Remove the current aside block that repeats the same CTA and explanatory text, or replace it with non-action content (e.g. a short tip or link to insights) so there is only one primary button.
   - **Rationale:** Avoids two identical CTAs and keeps the page focused.
   - **Alternatives considered:** Keeping the aside with different copy — still risks diluting the primary action.

## Risks / Trade-offs

- **Today column when week range is Mon–Sun:** If the backend returns a fixed week (e.g. Mon–Sun), "today" might fall outside the range on Sunday or Monday depending on how the range is computed. Mitigation: Compute week range and today's date in the same timezone; highlight the column whose date equals today, or show no highlight when today is outside the displayed week (edge case).
- **Summary count accuracy:** "X of Y habits done" depends on having today's day document; if the user hasn't triggered a day record yet, count might be 0. Mitigation: Treat "no day document for today" as 0 completed; acceptable for MVP.

## Migration Plan

Frontend-only; deploy updated home page. Rollback: revert home page component to previous version.

## Open Questions

- Whether to show numeric date (e.g. 13) under the weekday in the grid header for extra clarity; low cost, can be added during implementation if desired.
