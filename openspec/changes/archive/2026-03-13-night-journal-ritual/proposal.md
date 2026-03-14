## Why

PixelMind's core promise is connecting habits, feelings, and memories into one coherent loop — but right now there is no journaling experience at all. The Tonight tab is a stub that redirects to a blank page. Without the night journal ritual, the app is just a habit tracker, and the AI memory layer has nothing to learn from.

## What Changes

- The Tonight tab (currently a redirect stub) becomes a fully functional, stepped ritual flow — inline, no navigation away
- A mood selector (emoji + text, 6 options) is the entry point and minimum requirement to seal the day
- A daily rotating prompt (curated set of 15 questions) appears after mood selection; response is optional
- An optional free-write area follows the prompt
- A "Seal the day" CTA closes the ritual with an animation where the written text shrinks and flies into today's pixel, followed by a mood-color wash and fade back to the Today tab
- Today's pixel gains a distinct sealed glow/state
- The Tonight tab, once sealed, shows a read-only "Day sealed ✦" view of what was written
- No backfill: if a day is not sealed, that pixel stays unsealed forever
- The journal page (`/app/journal`) becomes the archive of sealed entries
- The API's journal endpoint is extended to store mood, prompt_id, prompt_response, free_text, and sealed state

## Capabilities

### New Capabilities

- `journal-ritual-flow`: The stepped Tonight tab ritual — mood selection, rotating prompt, optional free write, seal action
- `day-seal-animation`: The animation sequence where text collapses into the pixel and mood color washes the screen
- `sealed-day-state`: Pixel and Tonight tab visual state after sealing; read-only view of the sealed entry
- `journal-prompts`: Curated set of 15 rotating daily prompts with a deterministic daily selection algorithm

### Modified Capabilities

- `tonight-tab`: Tonight tab changes from a redirect stub to the full inline ritual host
- `mosaic-tab`: Mosaic needs to render a distinct sealed vs. unsealed pixel state

## Impact

- **API**: `POST /journal` payload extended (mood, prompt_id, prompt_response, free_text, sealed); `GET /journal` returns full fields; new `GET /journal/today` endpoint to check if today is sealed
- **Frontend**: `TonightTab.tsx` rebuilt from scratch; new `JournalRitualFlow` component; `MosaicTab.tsx` updated for sealed pixel rendering; `HabitCard`/Today view may show sealed state indicator
- **Data model**: Journal entry document gains mood, prompt_id, prompt_response, free_text, sealed fields
- **Prompts**: Static prompt list stored in frontend constants for now; prompt selection is `day_of_year % prompt_count`
