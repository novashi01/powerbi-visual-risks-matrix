## Proposal: Add matrix grid color configuration

### Why

Users currently cannot configure the matrix grid's severity color transparency or grid border color. The existing `dataColors` field is non-functional and causes confusion. Improving color configuration will make the visual easier to style and integrate with report themes.

### What changes

- Add new settings to allow configuring severity color transparency (alpha) and grid border color.
- Remove/describe deprecation of the `dataColors` setting since it's not working and should not be exposed to users.
- Consider how category data should influence visual appearance and document behavior.

### Impact

- Affected specs: `matrix-grid` (new/modified requirements)
- Affected code: `src/settings.ts`, `src/visual.ts` (apply alpha to severity fills, use configurable border color), documentation updates

### Success criteria

- Users can set severity color transparency and grid border color through visual settings.
- `dataColors` is removed from the settings UI or documented as deprecated and has no effect.
- Visual renders consistent with configured colors across themes.
