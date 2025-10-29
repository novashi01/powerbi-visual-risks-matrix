# Proposal: Add Centered Count Drill-down

**Change ID:** `add-centered-count-drilldown`  
**Status:** Draft  
**Created:** 2025-10-30  
**Branch:** `feat/centered-count-drilldown`

## Summary

Add interactive drill-down capability to "Centered" positioning mode: display aggregated risk count per grid cell as a single marker (no labels), and on click, expand to "Organized Grid" view within that cell. Clicking outside markers returns to centered count view.

## Motivation

Currently, the "Centered" layout mode shows all risks stacked at cell centers with no visual indication of risk density. Users cannot easily see:
- **How many risks** are in each cell
- **Individual risk details** without switching layout modes globally

This proposal enhances the centered mode by:
1. **Showing risk count** in a marker shape (e.g., "5" displayed in the marker)
2. **Enabling drill-down**: Click a marker to see organized grid of risks in that cell
3. **Maintaining context**: Other cells remain in count view; click outside to collapse

This creates a progressive disclosure pattern that scales better for high-density cells while preserving the clean overview that centered mode provides.

## User Impact

### Before
- Centered mode shows overlapping markers at cell center
- No count indication
- Must switch to "Organized Grid" globally to see individual risks

### After
- Centered mode shows **one marker per cell with count label** (e.g., "5")
- Click marker → see organized grid **within that cell only**
- Click cell background → return to count view
- Other cells remain unchanged during drill-down

## Scope

### In Scope
- Display risk count in centered mode markers
- Click handler on count markers to expand to organized grid
- Click handler on cell background to collapse back to count view
- State management for which cell is expanded
- Smooth transition between count and organized views

### Out of Scope
- Changes to "Organized Grid" or "Scatter" modes
- Multi-cell expansion (only one cell drills down at a time)
- Persistent drill-down state across data updates
- Animation of drill-down transition (can be added later)

## Technical Approach

### High-Level Design
1. **Count Aggregation**: Group risks by cell in centered mode, calculate count per cell
2. **Count Marker Rendering**: Render single marker per cell with count text overlay
3. **Click State**: Track `expandedCell: string | null` (e.g., `"3-2"` for L=3, C=2)
4. **Conditional Rendering**:
   - If cell is expanded → render organized grid for that cell only
   - If cell not expanded → render count marker
5. **Click Handlers**:
   - Marker click → set `expandedCell = cellKey`, re-render
   - Cell background click → set `expandedCell = null`, re-render

### Implementation Phases
1. Add count calculation logic to `renderCenteredLayout()`
2. Create `renderCountMarker()` helper for count display
3. Add expanded cell state and click handlers
4. Integrate expanded cell organized grid rendering
5. Add tests for count aggregation and drill-down behavior

## Dependencies

- Existing `renderOrganizedLayout()` logic (reuse for expanded cell)
- Existing `organizeMarkersInCell()` grid calculation
- Click event handling infrastructure already in place

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Count label too small on small markers | Low readability | Make marker size configurable, min size for count mode |
| Click target too small | Poor UX | Increase marker size in count mode, add larger click area |
| State confusion during data refresh | Expanded cell may not exist after update | Clear expanded state on data refresh |
| Performance with many cells | Slower rendering | Only render organized grid for one cell at a time |

## Alternatives Considered

1. **Hover to expand** instead of click
   - Rejected: Less intentional, harder on mobile, accidental triggers
2. **Show count as separate label** outside marker
   - Rejected: Takes more space, less compact
3. **Multi-cell expansion**
   - Deferred: Adds complexity, single cell is sufficient for MVP

## Success Criteria

- [ ] Count correctly displayed in centered mode
- [ ] Click on count marker expands to organized grid
- [ ] Click on cell background collapses to count view
- [ ] Only one cell expands at a time
- [ ] No labels shown in count mode (as specified)
- [ ] All existing tests pass
- [ ] New tests cover count aggregation and drill-down interaction

## Related Changes

None (self-contained feature)

## Open Questions

1. ~~Should count marker have different styling than regular markers?~~ → Yes, use distinct size/style
2. ~~What happens if user clicks another count marker while one is expanded?~~ → Collapse first, expand second
3. ~~Should expanded state persist across data refreshes?~~ → No, clear on refresh for simplicity
