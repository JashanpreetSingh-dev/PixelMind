## MODIFIED Requirements

### Requirement: Tonight tab is visually locked before 8pm
Before 8:00 PM local time, the Tonight tab SHALL appear visually dimmed (e.g. reduced opacity) and SHALL use a lock icon or equivalent visual indicator. Tapping the Tonight tab before 8pm SHALL be a no-op — the tab SHALL NOT become active and no content SHALL be shown. The Today tab SHALL remain active.

#### Scenario: Tonight tab locked before 8pm
- **WHEN** the user views the home screen and local time is before 8:00 PM
- **THEN** the Tonight tab SHALL appear dimmed (e.g. opacity-40) with a lock icon
- **AND** tapping the Tonight tab SHALL NOT switch the active tab
- **AND** the Today tab SHALL remain active and visible

### Requirement: Tonight tab is active and pulsing at or after 8pm
At or after 8:00 PM local time, and when today has NOT yet been sealed, the Tonight tab SHALL become fully visible and interactive. It SHALL display a teal pulsing dot or glow to indicate something is ready. Tapping it SHALL make it the active tab and SHALL display the journal ritual flow.

#### Scenario: Tonight tab unlocked at 8pm (not yet sealed)
- **WHEN** the user views the home screen, local time is 8:00 PM or later, and today is not sealed
- **THEN** the Tonight tab SHALL appear at full opacity with a teal pulsing indicator
- **AND** tapping it SHALL make Tonight the active tab
- **AND** the journal ritual flow SHALL be displayed in the content area

### Requirement: Tonight tab shows sealed state after sealing, with no pulse
After the user seals today, the Tonight tab SHALL remain active and tappable but SHALL no longer show the pulsing indicator. Tapping it SHALL show the read-only sealed view. The tab icon or label SHALL show a subtle ✦ or checkmark to indicate completion.

#### Scenario: Tonight tab after sealing
- **WHEN** the user has sealed today and views the home screen
- **THEN** the Tonight tab SHALL appear at full opacity without the pulsing dot
- **AND** SHALL show a subtle completion indicator (✦ or checkmark)
- **AND** tapping it SHALL display the read-only sealed view

## REMOVED Requirements

### Requirement: Tonight panel shows a stub with reflection prompt and journal link
**Reason**: Replaced by the full inline journal ritual flow. The Tonight tab now hosts the complete ritual; navigation to `/app/journal` is no longer the write path.
**Migration**: `/app/journal` becomes a read-only archive. All write functionality is inline in the Tonight tab.
