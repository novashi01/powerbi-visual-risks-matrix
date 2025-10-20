# Specification: Cell Scrolling (Simplified)

## ADDED Requirements

### Requirement: Wheel Scroll in Cells
The system SHALL allow users to scroll markers within cells using the mouse wheel when scrolling is enabled and cell has overflow content.

#### Scenario: Wheel scroll reveals hidden markers
- **GIVEN** a cell with 15 markers in a 3×3 grid (9 visible, 6 hidden below)
- **AND** scrolling is enabled
- **WHEN** user scrolls mouse wheel down over the cell
- **THEN** markers translate upward revealing previously clipped markers

#### Scenario: Scroll bounds prevent over-scrolling
- **GIVEN** a cell scrolled to show bottom markers
- **WHEN** user continues scrolling down
- **THEN** scroll offset is clamped at maximum
- **AND** markers do not scroll beyond content bounds

#### Scenario: No scroll when no overflow
- **GIVEN** a cell with 5 markers and 3×3 grid capacity
- **WHEN** user scrolls mouse wheel over the cell
- **THEN** no transform is applied
- **AND** markers remain at original position

---

### Requirement: Scroll Container Structure
The system SHALL wrap cell markers in a scroll-container group element to enable efficient transform-based scrolling.

#### Scenario: Markers wrapped in scroll container
- **GIVEN** a cell with overflow markers
- **AND** scrolling is enabled
- **WHEN** the cell is rendered
- **THEN** a `<g class="scroll-container">` element exists inside the cellGroup
- **AND** all markers are children of the scroll-container
- **AND** the cellGroup still has clipPath applied

#### Scenario: Transform applied to container
- **GIVEN** a cell scrolled by 20 pixels
- **WHEN** the transform is applied
- **THEN** the scroll-container has attribute `transform="translate(0, -20)"`
- **AND** all child markers move together

---

### Requirement: Scroll Bounds Calculation
The system SHALL calculate scroll bounds based on cell dimensions and content extent to prevent scrolling beyond content.

#### Scenario: Calculate max scroll for vertical overflow
- **GIVEN** a cell with height 60px
- **AND** content extends from y=10 to y=110 (total height: 100px)
- **WHEN** scroll bounds are calculated
- **THEN** maxScroll = -(100 - 60) = -40
- **AND** scroll offset is clamped to range [-40, 0]

#### Scenario: No scroll when content fits
- **GIVEN** a cell with height 100px
- **AND** content height is 60px
- **WHEN** scroll bounds are calculated
- **THEN** maxScroll = 0
- **AND** scrolling is effectively disabled

---

### Requirement: Prevent Default Wheel Behavior
The system SHALL prevent default browser scroll behavior when wheel events occur over scrollable cells.

#### Scenario: Wheel event prevented in cell
- **GIVEN** a cell with scrolling enabled
- **WHEN** user scrolls mouse wheel over the cell
- **THEN** event.preventDefault() is called
- **AND** page/container does not scroll
- **AND** only cell markers scroll

---

## MODIFIED Requirements

### Requirement: Update Setting Display Name
The `enableScrolling` setting display name SHALL accurately describe the interactive scrolling capability.

#### Scenario: Setting name reflects interactive scroll
- **GIVEN** user opens format pane
- **WHEN** user views "Risk Markers Layout" card
- **THEN** toggle is labeled "Enable mouse wheel scrolling for overflow markers"

**Previous**: "Show all markers (overflow hidden by clipPath, no interactive scroll)"  
**New**: "Enable mouse wheel scrolling for overflow markers"

---

## Implementation Notes

- Scroll offset stored in closure variable (per cell, no global state)
- Bounds calculated inline: `maxScroll = Math.min(0, cellHeight - contentHeight)`
- Transform applied directly: `scrollContainer.setAttribute('transform', 'translate(0, ' + offsetY + ')')`
- Wheel listener: `cellGroup.addEventListener('wheel', (e) => { /* inline logic */ })`
- ~50 lines total in `renderOrganizedLayout`
- No new files, no classes, no complex state management

---

## Out of Scope (V1)

The following are explicitly NOT included in this version:
- Drag-to-pan interaction (wheel only)
- Horizontal scrolling (vertical only)
- Visual scroll indicators/gradients
- Animated scroll transitions
- Scroll state persistence across updates
- Separate ScrollManager class

These can be added in future versions if user feedback indicates they're needed.

---

## Testing Requirements

### Unit Tests
- N/A (inline logic, tested via integration tests)

### Integration Tests
- Test wheel event applies transform
- Test scroll bounds clamping
- Test no scroll when content fits
- Test scroll resets on visual update

### Manual Test Scenarios
1. Cell with 20 markers (3×3 grid): wheel scroll reveals all
2. Scroll to bottom: verify stops at bounds
3. Cell with 5 markers: verify no scroll effect
4. Toggle scrolling off: verify no handlers attached
5. Update data while scrolled: verify resets to top

---

## Success Criteria

- [ ] Users can wheel-scroll vertically in cells with overflow
- [ ] Scroll stops at calculated bounds (no over-scroll)
- [ ] ClipPath remains effective during scroll
- [ ] Setting display name updated
- [ ] ~50 lines of code added (no new files)
- [ ] All existing tests pass
- [ ] Performance smooth with 20+ overflow cells
