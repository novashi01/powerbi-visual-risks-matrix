# Proposal: Add Interactive Cell Scrolling

## Why

Currently, the `enableScrolling` setting renders all markers but clips overflow using SVG clipPath without providing any way to access hidden markers. Users cannot interact with overflow content, making clipped markers completely inaccessible.

## What Changes

- Add simple mouse wheel event handler to cells with overflow
- Wrap cell markers in a `<g class="scroll-container">` element
- Apply vertical transform on wheel scroll to reveal hidden markers
- Calculate and enforce scroll bounds inline (no complex state management)
- Update `enableScrolling` display name to reflect interactive capability

**Technical approach**: ~50 lines of inline code in `renderOrganizedLayout`, no new files, no classes.

## Impact

- **Affected specs**: `cell-scrolling` (new capability - simplified)
- **Affected code**: 
  - `src/visual.ts` - add scroll container wrapper and wheel listener in `renderOrganizedLayout` (~50 lines)
  - `src/settings.ts` - update `enableScrolling` display name (1 line)
- **User impact**: Users can wheel-scroll to access hidden markers; default behavior unchanged (scrolling off by default)

---

## Additional Context

### Scope (Simplified for V1)

#### In Scope
- Vertical mouse wheel scrolling within cells
- Inline scroll bounds calculation
- Transform on scroll-container group
- Update setting display name

#### Out of Scope (Can add later if needed)
- Drag-to-pan (keep simple, wheel only)
- Visual scroll indicators (not essential)
- Separate ScrollManager class (inline code instead)
- Horizontal scrolling (vertical only for simplicity)
- State persistence (scroll resets on update - acceptable)
- Animated transitions (instant scroll)

### Implementation Summary

Add ~50 lines to `renderOrganizedLayout`:
1. After rendering markers, wrap them in `<g class="scroll-container">`
2. Calculate max scroll based on content height vs cell height
3. Store scroll offset in closure variable
4. Add wheel event listener that updates offset and applies transform
5. Clamp offset to [maxScroll, 0] range

No new files, no classes, no complex state - just simple inline logic.

### Benefits

1. **Simple**: ~50 lines of code, easy to understand and maintain
2. **Low risk**: Minimal changes, fewer failure points
3. **Effective**: Solves core problem (access hidden markers)
4. **Extensible**: Can enhance later if needed (drag, indicators, etc.)

### Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wheel conflicts with Power BI | Medium | preventDefault on wheel events within cells only |
| Performance with many cells | Low | Browser-optimized wheel events, no custom throttling needed |
| Scroll resets on update | Low | Acceptable UX; document behavior |

### In Scope
- Wheel scrolling (vertical) within cells
- Drag-to-pan within cells (horizontal and vertical)
- Scroll offset state management per cell
- Scroll bounds constraints based on content size
- Visual indicators for scrollable cells
- Update `enableScrolling` display name to reflect interactive capability

### Out of Scope
- Touch/gesture support (Power BI Desktop primarily mouse-based)
- Animated scroll easing (start with instant scroll for simplicity)
- Horizontal-only or vertical-only scroll locks
- Custom scrollbar styling (use subtle indicators)
- Scroll position persistence across visual updates

## Benefits

1. **Accessibility**: Users can access all markers in cells with overflow, not just the first N
2. **Better UX**: Intuitive mouse interaction (wheel + drag) familiar to all users
3. **Space efficiency**: More markers visible in the same screen space without expanding cells
4. **Clarity**: Rename setting to accurately describe behavior

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance with many cells | High CPU on mouse move | Throttle mouse events, use requestAnimationFrame |
| Conflicts with Power BI drag-to-select | Users can't select visual | Add modifier key (Shift+drag) or short click threshold |
| Scroll state lost on data refresh | Confusing UX | Acceptable for v1; document behavior |

## Implementation Notes

- Use `transform: translate(x, y)` on marker container within each cellGroup
- Attach event listeners to cellGroup elements during `renderOrganizedLayout`
- Store scroll state in a Map keyed by cellKey (e.g., "3-4")
- Clear scroll state on visual update/redraw
- Add subtle visual cue (e.g., fade gradient at cell edges) when overflow exists

## Alternatives Considered

1. **Expand cells to fit all markers**: Rejected—breaks visual layout, cells become different sizes
2. **Pagination controls**: Rejected—requires UI space, less intuitive than scroll
3. **Tooltip with full marker list**: Rejected—doesn't solve visual access problem
4. **Keep current clipPath-only**: Not viable—user explicitly wants scrolling

## Related Work

- Existing change: `add-risk-id-marker-labels` (orthogonal, no conflicts expected)

## Success Criteria

1. Users can wheel-scroll to reveal hidden markers in any cell with overflow
2. Users can drag to pan markers within cell boundaries
3. Scroll indicators visible on cells with overflow content
4. No performance degradation with 20+ cells with overflow
5. All existing tests pass; new tests cover scroll logic

## Open Questions

1. Should scroll work when `enableScrolling = false`? **Proposal: No, keep toggle functional**
2. Should we add scroll reset button per cell? **Proposal: Not for v1, scroll resets on update anyway**
3. Should scroll state persist across data updates? **Proposal: No for v1, clear on each update**
