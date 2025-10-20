# Spec: cell-scrolling

This spec defines the "cell-scrolling" capability for the Risk Matrix visual.

## Purpose

Provide per-cell vertical scrolling for marker lists when their rendered height exceeds the visible cell area. This enables users to access clipped markers using the mouse wheel without changing cell sizes.

## Summary

Add simple vertical mouse-wheel scrolling for markers inside cells when content overflows the visible cell area. Scrolling is per-cell, implemented via a scroll-container group and transform updates. Behavior is inline and intentionally minimal for v1.
## Requirements
### Requirement: Wheel Scroll Reveals Hidden Markers

Users SHALL be able to use the mouse wheel while the pointer is over a cell with overflowed markers to translate the markers vertically and reveal hidden content.

#### Scenario: Scroll to reveal overflow
- **WHEN** the cell contains more markers than fit vertically and the user rotates the mouse wheel while hovering the cell
- **THEN** the marker container is translated vertically to reveal hidden markers until the top or bottom bound is reached

### Requirement: Enforce Scroll Bounds

The visual SHALL clamp scroll offsets so content cannot be translated beyond its visible extent.

#### Scenario: Scrolling stops at bounds
- **WHEN** the user continues scrolling after the last marker is visible
- **THEN** the marker container stops translating and further scroll input has no effect

### Requirement: No Scroll When Content Fits

The visual SHALL not apply any scrolling transform when the total marker height fits inside the cell.

#### Scenario: Wheel does nothing when content fits
- **WHEN** the user rotates the mouse wheel over a cell whose markers already fit entirely in view
- **THEN** no translate transform is applied and the default wheel behavior is not prevented

### Requirement: Prevent Default Wheel Inside Scrollable Cells

When a cell is scrollable, the visual SHALL prevent the browser's default wheel behavior for the event so the interaction remains scoped to the cell.

#### Scenario: Wheel prevented for scrollable cells
- **WHEN** the user scrolls over a cell with overflow
- **THEN** the visual prevents default on the wheel event while handling the scroll

### Requirement: Update Setting Display Name
The `enableScrolling` setting display name SHALL accurately describe the interactive scrolling capability.

#### Scenario: Setting name reflects interactive scroll
- **GIVEN** user opens format pane
- **WHEN** user views "Risk Markers Layout" card
- **THEN** toggle is labeled "Enable mouse wheel scrolling for overflow markers"

**Previous**: "Show all markers (overflow hidden by clipPath, no interactive scroll)"  
**New**: "Enable mouse wheel scrolling for overflow markers"

---

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

## Implementation notes

See change `add-interactive-cell-scrolling` proposal for details. Implementation will add inline wheel handler and wrapper `<g class="scroll-container">` in `renderOrganizedLayout` in `src/visual.ts`.
