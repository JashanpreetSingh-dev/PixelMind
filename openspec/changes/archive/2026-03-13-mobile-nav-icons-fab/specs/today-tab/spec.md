## REMOVED Requirements

### Requirement: Today tab shows empty state when no habits exist
**Reason**: The "Add your first habit +" button in the empty state is replaced by the FAB. The shimmer ghost cards empty state is retained but without the creation button.
**Migration**: Habit creation is now exclusively via the FAB (`HabitFAB` component).

### Requirement: Today tab provides add-habit entry when user has habits
**Reason**: The `+ Add habit` inline text link below the habit list is replaced by the FAB.
**Migration**: Habit creation is now exclusively via the FAB (`HabitFAB` component).

## ADDED Requirements

### Requirement: Today tab empty state shows ghost cards without a creation button
When the user has no habits, the Today tab SHALL display three shimmer ghost placeholder cards. It SHALL NOT include an inline creation button — creation is handled by the FAB.

#### Scenario: Empty state renders ghost cards only
- **WHEN** the user has zero habits and views the Today tab
- **THEN** three shimmer ghost cards SHALL be displayed
- **AND** no inline "Add your first habit" button or link SHALL appear in the Today tab content
