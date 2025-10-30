# Tasks: Add Centered Count Drill-down

**Change ID:** `add-centered-count-drilldown`

## Task Breakdown

### Phase 1: Count Display (Foundational)

1. **Add count aggregation logic**
   - [x] Create `groupRisksByCell()` helper in `visual.ts`
   - [x] Returns `Map<string, RiskPoint[]>` where key is `"L-C"` (e.g., `"3-2"`)
   - [x] Handle both residual and inherent risks (use residual position as primary)
   - [x] Add unit test for count aggregation with sample data

2. **Create count marker renderer**
   - [x] Add `renderCountMarker()` method in `visual.ts`
   - [x] Parameters: cellKey, count, position, color
   - [x] Render marker with count text centered inside
   - [x] Use larger marker size for count mode (e.g., 1.5x regular size)
   - [x] NO labels (as specified) - only count inside marker
   - [x] Add unit test for count marker rendering

3. **Update `renderCenteredLayout()` to use count markers**
   - [x] Call `groupRisksByCell()` to get aggregated data
   - [x] For each cell, render single count marker instead of individual markers
   - [x] Verify count displays correctly in different grid sizes (3x3, 5x5)
   - [x] Update integration test to verify count mode behavior

**Validation:** Centered mode shows count markers, no overlap, counts accurate

---

### Phase 2: Drill-down Interaction

4. **Add expanded cell state management**
   - [x] Add `private expandedCell: string | null = null;` to Visual class
   - [x] Add `setExpandedCell(cellKey: string | null)` method
   - [x] Clear expanded state in `update()` method (on data refresh)
   - [x] Add unit test for state management

5. **Add click handlers to count markers**
   - [x] Add click event listener to count marker
   - [x] On click: set `expandedCell = cellKey` and trigger re-render
   - [x] Prevent event bubbling to cell background
   - [ ] Add selection highlight to expanded marker (optional visual feedback)
   - [x] Add unit test for marker click handler

6. **Implement conditional rendering in centered mode**
   - [x] Check if current cell matches `expandedCell`
   - [x] If expanded: call `renderOrganizedCellOnly()` for that cell
   - [x] If not expanded: render count marker
   - [x] Ensure other cells remain as count markers
   - [x] Add integration test for expanded cell rendering

7. **Create `renderOrganizedCellOnly()` helper**
   - [x] Extract organized grid logic for single cell
   - [x] Reuse `organizeMarkersInCell()` calculation
   - [x] Render markers in organized grid within cell bounds
   - [ ] **UPDATED:** Preserve inherent→residual arrow animation if enabled
   - [x] Add cell background click handler for collapse
   - [ ] **UPDATED:** Add marker click handler for collapse (same as background click)
   - [x] Add unit test for single-cell organized rendering

8. **Add cell background click handler**
   - [x] Add click listener to cell background rect (in renderGrid or as overlay)
   - [x] On click: set `expandedCell = null` and trigger re-render
   - [x] Only active when a cell is expanded (to avoid interfering with other clicks)
   - [x] Add unit test for collapse interaction

9. **Add marker click handler in expanded cell**
   - [ ] Add click listener to each individual marker in expanded cell
   - [ ] On marker click: set `expandedCell = null` and trigger re-render (collapse)
   - [ ] Ensure marker click has same effect as cell background click
   - [ ] Prevent default marker selection behavior (or run collapse after selection)
   - [ ] Add unit test for marker-click collapse

10. **Implement fast expansion animation**
    - [ ] When expanding: start markers at center position
    - [ ] Animate markers from center to final organized positions
    - [ ] Use short animation duration (200-400ms total)
    - [ ] No delay before animation starts (immediate response)
    - [ ] Support sequential/staggered animation if desired
    - [ ] Respect global animation enable/disable setting
    - [ ] Add unit test for animation timing logic

11. **Add scrolling support for overflow in expanded cell**
    - [ ] Calculate if markers exceed visible grid (rows × columns)
    - [ ] If overflow: enable scrolling within expanded cell
    - [ ] Add scroll state tracking for expanded cell
    - [ ] Add mouse wheel event listener for cell scrolling
    - [ ] Render fade mask or scroll indicator when scrolled
    - [ ] Reset scroll position on collapse
    - [ ] Reuse existing scrolling logic from organized grid mode
    - [ ] Add unit test for overflow detection and scrolling

**Validation:** Click count marker → expands with fast animation; click marker or background → collapses; arrows animate; scrolling works for overflow

---

### Phase 3: Polish & Edge Cases

12. **Handle single-risk cells**
   - [x] If count = 1, still show "1" in marker (consistent behavior)
   - [x] Verify drill-down works for single-risk cells
   - [x] Add test case for single-risk cell

13. **Handle empty cells**
    - [x] No count marker if count = 0
    - [x] Verify no rendering errors for empty cells
    - [x] Add test case for empty cell

14. **Handle multi-cell click scenarios**
    - [x] Clicking another count marker: collapse first, expand second
    - [x] Ensure only one cell expanded at a time
    - [x] Add test case for switching between expanded cells

15. **Update count marker styling**
    - [x] Ensure count text is readable (font size, contrast)
    - [x] Add fallback for very large counts (e.g., "99+" if > 99)
    - [x] Test with different marker shapes (round, rectangle, rounded rectangle)
    - [ ] Add visual regression test (optional)

**Validation:** Edge cases handled gracefully, no visual glitches

---

### Phase 4: Documentation & Testing

16. **Add comprehensive tests**
    - [x] Test count aggregation with various data shapes
    - [x] Test drill-down state transitions
    - [x] Test collapse behavior (both background and marker click)
    - [x] Test data refresh clears expanded state
    - [ ] **NEW:** Test arrow animation preservation in expanded cells
    - [ ] **NEW:** Test fast expansion animation timing
    - [ ] **NEW:** Test scrolling behavior with overflow (>9 markers in 3x3)
    - [ ] **NEW:** Test scroll position reset on collapse
    - [x] Ensure all existing tests still pass (156 tests)

17. **Update documentation**
    - [ ] Add feature description to README.md
    - [ ] Document centered count mode behavior
    - [ ] **NEW:** Document animation behavior (fast expansion, arrow preservation)
    - [ ] **NEW:** Document scrolling in expanded cells
    - [ ] Add screenshots/examples if available
    - [ ] Update RELEASE-NOTES with feature description

18. **Manual testing checklist**
    - [ ] Test in Power BI Desktop with sample data
    - [ ] Verify counts match actual risk counts
    - [ ] Test drill-down interaction (click, expand, collapse)
    - [ ] **NEW:** Test marker click collapses (same as background click)
    - [ ] **NEW:** Verify fast animation on expand (no delay)
    - [ ] **NEW:** Verify arrow animation in expanded cells
    - [ ] **NEW:** Test scrolling with overflow (e.g., 15 markers in 3x3 grid)
    - [ ] Test with different grid sizes (3x3, 5x5, 10x10)
    - [ ] Test with different marker shapes
    - [ ] Test with high-density cells (20+ risks)
    - [ ] Test with sparse data (many empty cells)

**Validation:** All tests pass, documentation complete, feature ready for review

---

## Dependencies

- **Task 1-3** → Required before Task 4-11 (count rendering before interaction)
- **Task 4** → Required for Task 5-11 (state management before handlers)
- **Task 7** → Depends on existing `organizeMarkersInCell()` function and arrow rendering logic
- **Task 10** → Animation task depends on existing animation system
- **Task 11** → Scrolling depends on existing scroll logic from organized grid mode
- **Task 16** → Can run in parallel with Task 15 (polish)

## Estimated Effort

- Phase 1: ~2-3 hours (count aggregation + rendering)
- Phase 2: ~5-7 hours (interaction logic + state management + animation + scrolling)
- Phase 3: ~1-2 hours (edge cases + polish)
- Phase 4: ~2-3 hours (testing + documentation)

**Total:** ~10-15 hours (increased from 7-11 due to animation and scrolling features)

## Success Metrics

- Zero regressions in existing 156 tests
- New tests cover count aggregation (>90% coverage)
- New tests cover drill-down interaction (>90% coverage)
- **NEW:** Animation tests verify fast expansion and arrow preservation
- **NEW:** Scrolling tests verify overflow handling and scroll reset
- Manual testing confirms feature works in Power BI Desktop
- Code review approved
- Feature documented in README and release notes

---

## Dependencies

- **Task 1-3** → Required before Task 4-8 (count rendering before interaction)
- **Task 4** → Required for Task 5-8 (state management before handlers)
- **Task 7** → Depends on existing `organizeMarkersInCell()` function
- **Task 13** → Can run in parallel with Task 12 (polish)

## Estimated Effort

- Phase 1: ~2-3 hours (count aggregation + rendering)
- Phase 2: ~3-4 hours (interaction logic + state management)
- Phase 3: ~1-2 hours (edge cases + polish)
- Phase 4: ~1-2 hours (testing + documentation)

**Total:** ~7-11 hours

## Success Metrics

- Zero regressions in existing 140 tests
- New tests cover count aggregation (>90% coverage)
- New tests cover drill-down interaction (>90% coverage)
- Manual testing confirms feature works in Power BI Desktop
- Code review approved
- Feature documented in README and release notes
