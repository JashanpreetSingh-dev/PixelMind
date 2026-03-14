## 1. Backend — Structured Onboarding Payload

- [x] 1.1 Add `OnboardingHabit` Pydantic model to `api/main.py` with fields `name: str`, `color: str`, `icon: Optional[str]`
- [x] 1.2 Update `OnboardingPayload.habits` from `List[str]` to `List[OnboardingHabit]`
- [x] 1.3 Update `POST /onboarding` handler to use `habit.color` (and `habit.icon`) from payload instead of hardcoded palette
- [x] 1.4 Verify `POST /onboarding` still marks `onboarding_completed: True` and stores `primary_feeling`

## 2. Backend — Extend PATCH /habits/{id}

- [x] 2.1 Add `icon: Optional[str]` and `rhythm: Optional[dict]` to `HabitUpdate` Pydantic model
- [x] 2.2 Update `PATCH /habits/{id}` handler to include `icon` and `rhythm` in `update_doc` when present
- [x] 2.3 Verify updated habit document is returned with all fields including `icon` and `rhythm`

## 3. Frontend — Predefined Habits Constant

- [x] 3.1 Create `web/src/lib/predefined-habits.ts` exporting `PREDEFINED_HABITS` array (6–8 entries, each `{ name, color, icon }` using colors from `HABIT_PALETTE`)

## 4. Frontend — Onboarding Screen Redesign

- [x] 4.1 Add server-side re-entry guard to `onboarding/page.tsx`: call `fetchMe()`, redirect to `/app` if `onboarding_completed === true`
- [x] 4.2 Replace the three text inputs with a grid of predefined habit cards; each card shows name, color swatch, and icon; tap toggles selected state
- [x] 4.3 Add local state for selected predefined habits and custom habits; track combined selection count
- [x] 4.4 Add "Add your own" button that opens `HabitCreationSheet`; on sheet close with a created habit, add it to local custom-habits state as selected
- [x] 4.5 Allow removing a custom habit from the selection (e.g. tap X on its card)
- [x] 4.6 Disable the Continue button when total selected count is 0; enable when ≥ 1
- [x] 4.7 Update `handleSubmit` to send `habits: [{name, color, icon?}, ...]` structured payload to `POST /onboarding`
- [x] 4.8 Keep the primary feeling selector section below the habit grid (unchanged behavior)

## 5. Frontend — HabitEditSheet Component

- [x] 5.1 Create `web/src/app/app/HabitEditSheet.tsx` as a single-pane bottom sheet accepting a `habit` prop and `open`/`onOpenChange`/`onSaved`/`onDeleted` callbacks
- [x] 5.2 Add name input pre-filled with `habit.name`; same non-empty validation and duplicate-name warning as creation sheet
- [x] 5.3 Add HABIT_PALETTE color picker pre-selected on `habit.color`
- [x] 5.4 Add rhythm selector (Daily / X times per week / Specific days) pre-selected on `habit.rhythm` (default to Daily if absent)
- [x] 5.5 Add Save button: calls `PATCH /habits/{id}` with updated fields; on success closes sheet and calls `onSaved`; on failure shows inline error
- [x] 5.6 Add "Delete habit" button with confirmation step (confirm dialog or second-tap); on confirm calls `PATCH /habits/{id}` with `{ archived: true }`; on success calls `onDeleted`

## 6. Frontend — Wire Edit into TodayView

- [x] 6.1 Import and render `HabitEditSheet` in `TodayView.tsx`
- [x] 6.2 Add `editingHabit` state (`Habit | null`) to control which habit is open in the edit sheet
- [x] 6.3 Replace the no-op `handleEdit` with a function that sets `editingHabit` to the tapped habit
- [x] 6.4 On `onSaved` callback: close sheet, clear `editingHabit`, invalidate `["habits"]` query
- [x] 6.5 On `onDeleted` callback: close sheet, clear `editingHabit`, invalidate `["habits"]` and `["days"]` queries
