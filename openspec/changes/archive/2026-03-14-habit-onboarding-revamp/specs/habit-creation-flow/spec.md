## ADDED Requirements

### Requirement: PATCH /habits/{id} accepts icon and rhythm updates
The backend `PATCH /habits/{id}` endpoint SHALL accept optional `icon` (string) and `rhythm` (object) fields in the update payload, in addition to the existing `name`, `color`, and `archived` fields. When provided, the backend SHALL persist these fields and return the updated habit document including all stored fields. When not provided, the existing values SHALL remain unchanged.

#### Scenario: Update with icon and rhythm
- **WHEN** the client sends `PATCH /habits/{id}` with `{ icon: "📚", rhythm: { type: "daily" } }`
- **THEN** the backend SHALL update the habit document with the new icon and rhythm values
- **AND** SHALL return the updated habit including `icon` and `rhythm` in the response

#### Scenario: Update without icon or rhythm leaves them unchanged
- **WHEN** the client sends `PATCH /habits/{id}` with only `{ name: "New name" }`
- **THEN** the backend SHALL update only the name
- **AND** the existing `icon` and `rhythm` values SHALL remain unchanged in the stored document
- **AND** SHALL be returned in the response

#### Scenario: Onboarding structured payload accepted
- **WHEN** the client sends `POST /onboarding` with `{ habits: [{ name: "Read 20 pages", color: "#38bdf8", icon: "📚" }], primary_feeling: "Calm" }`
- **THEN** the backend SHALL create a habit document with the provided `name`, `color`, and `icon`
- **AND** SHALL NOT override the color with a hardcoded value
- **AND** SHALL mark `onboarding_completed: true` on the user document
