## 1. API — Extend Journal Data Model

- [x] 1.1 Update `JournalCreatePayload` in `main.py` to include `mood`, `prompt_id`, `prompt_response`, `free_text`, and `sealed` fields (all optional except `date`)
- [x] 1.2 Update `POST /journal` handler to store all new fields in MongoDB
- [x] 1.3 Update `GET /journal` handler to return all new fields in responses
- [x] 1.4 Add `GET /journal/today` endpoint that returns today's sealed entry (or null if not sealed), using the authenticated user's local date passed as a query param

## 2. Frontend — Prompts Constant

- [x] 2.1 Create `lib/journal-prompts.ts` with the array of 15 prompt strings and a `getTodayPrompt()` utility using `day_of_year % 15`
- [x] 2.2 Export a `PROMPT_LIST` constant and `getPromptById(id: number)` helper for use in the archive view

## 3. Frontend — Journal Ritual Flow Component

- [x] 3.1 Create `components/JournalRitualFlow.tsx` with three visual steps: mood selector, prompt + free write, seal button
- [x] 3.2 Implement the 6-option mood selector (😌 calm, 😊 good, 🤩 energized, 😰 anxious, 😤 frustrated, 🥱 tired) with single-select toggle behavior
- [x] 3.3 Show the today's rotating prompt question and a textarea for response after mood is selected
- [x] 3.4 Show an optional free-write textarea below the prompt response
- [x] 3.5 Enable "Seal the day" button as soon as a mood is selected (regardless of text input)
- [x] 3.6 On "Seal the day" tap: fire `POST /journal` immediately in the background, then trigger the seal animation

## 4. Frontend — Day Seal Animation

- [x] 4.1 Add Framer Motion dependency if not already present (`npm install framer-motion`)
- [x] 4.2 Implement animation phase 1: text content scales down and translates toward today's pixel screen coordinates (measure via `getBoundingClientRect` or fallback to bottom-center)
- [x] 4.3 Implement animation phase 2: full-screen mood-color overlay fades in then out
- [x] 4.4 After animation completes (~1.5s), switch active tab to Today
- [x] 4.5 On API failure during animation: show error toast after animation completes with a retry option

## 5. Frontend — Sealed Day State

- [x] 5.1 Create `components/SealedJournalView.tsx` — read-only view showing "Day sealed ✦", mood, prompt question + response, free text
- [x] 5.2 Hide empty sections (no prompt response section if prompt_response is null, no free text section if free_text is null)
- [x] 5.3 Add `GET /journal/today` call in `TonightTab` on mount to check if today is already sealed
- [x] 5.4 Render `SealedJournalView` instead of `JournalRitualFlow` when today is already sealed

## 6. Frontend — Tonight Tab Rebuild

- [x] 6.1 Replace the current `TonightTab.tsx` stub content with the `JournalRitualFlow` component (when unlocked and not sealed)
- [x] 6.2 Update Tonight tab button in `BottomNav` / home tab switcher to show ✦ or checkmark when today is sealed (no pulse)
- [x] 6.3 Remove the pulsing indicator when today is sealed; keep it when unlocked and not yet sealed

## 7. Frontend — Mosaic Sealed Pixel Glow

- [x] 7.1 In `MosaicTab.tsx`, fetch today's sealed status via `GET /journal/today` on mount
- [x] 7.2 Apply a teal glow/ring CSS class to today's pixel cell only when today is sealed
- [x] 7.3 Ensure the glow does not appear on past days regardless of their sealed status

## 8. Frontend — Journal Archive Update

- [x] 8.1 Update `app/journal/page.tsx` to display all fields from sealed entries: date, mood (emoji + label), prompt question (from prompt_id), prompt response, free text
- [x] 8.2 Add an empty state message: "No entries yet — seal your first day tonight"
- [x] 8.3 Remove the "Creating and editing entries will be wired up next" placeholder copy
