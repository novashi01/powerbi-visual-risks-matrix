# Spec: Centered Drill-down Capability

**Capability ID:** `centered-drilldown`  
**Status:** Draft  
**Version:** 1.0

## Overview

This capability extends the "Centered" positioning mode to display aggregated risk counts per grid cell and enable interactive drill-down to view individual risks within a cell without changing the global layout mode.

## ADDED Requirements

### Requirement: Display Risk Count in Centered Mode

When positioning mode is set to "Centered", the visual SHALL display one marker per grid cell containing risks, with the count of risks in that cell shown as text inside the marker.

#### Scenario: Single cell with multiple risks

**Given** the visual has positioning mode set to "Centered"  
**And** cell (L=2, C=3) contains 5 risks  
**When** the visual renders  
**Then** a single marker is displayed at the center of cell (2,3)  
**And** the marker contains the text "5" centered inside  
**And** no individual risk markers are shown  
**And** no risk labels are displayed

#### Scenario: Multiple cells with varying counts

**Given** the visual has positioning mode set to "Centered"  
**And** cell (1,1) contains 3 risks  
**And** cell (2,2) contains 1 risk  
**And** cell (3,3) contains 0 risks  
**When** the visual renders  
**Then** cell (1,1) shows a marker with "3" inside  
**And** cell (2,2) shows a marker with "1" inside  
**And** cell (3,3) shows no marker  
**And** all count markers use consistent styling

#### Scenario: Count text readability

**Given** a cell contains 99 risks  
**When** the count marker is rendered  
**Then** the marker size is sufficient to display "99" clearly  
**And** if count exceeds 99, display "99+"  
**And** the text color contrasts with the marker background

---

### Requirement: Drill-down on Count Marker Click

When a user clicks on a count marker in centered mode, the visual SHALL expand that cell to show an organized grid of individual risk markers within that cell only.

#### Scenario: Expand cell on count marker click

**Given** the visual is in centered mode  
**And** cell (2,3) shows a count marker with "5"  
**And** no cells are currently expanded  
**When** the user clicks the count marker  
**Then** cell (2,3) expands to show 5 individual risk markers in organized grid layout  
**And** the count marker is replaced with the organized grid  
**And** all other cells remain in count mode  
**And** other cells continue to show count markers

#### Scenario: Expanded cell uses organized grid rules

**Given** cell (2,3) is expanded showing individual risks  
**When** the cell renders in expanded state  
**Then** markers are positioned using the organized grid algorithm  
**And** markers respect the "Marker rows (per cell)" setting  
**And** markers respect the "Marker columns (per cell)" setting  
**And** markers respect cell padding settings  
**And** scrolling behavior follows cell scrolling spec if applicable

#### Scenario: Switch expanded cell

**Given** cell (2,3) is currently expanded  
**And** cell (4,1) shows a count marker with "8"  
**When** the user clicks the count marker in cell (4,1)  
**Then** cell (2,3) collapses back to count marker with "5"  
**And** cell (4,1) expands to show 8 individual markers  
**And** all other cells remain in count mode  
**And** only one cell is expanded at any time

---

### Requirement: Collapse Expanded Cell on Background Click

When a cell is expanded in centered mode, clicking on the cell background (not on a marker) SHALL collapse the cell back to count marker view.

#### Scenario: Collapse on cell background click

**Given** cell (2,3) is expanded showing 5 individual markers  
**When** the user clicks on the cell background (empty area within the cell)  
**Then** cell (2,3) collapses to count marker with "5"  
**And** all individual markers are hidden  
**And** the count marker is restored  
**And** all other cells remain unchanged

#### Scenario: Click on marker does not collapse

**Given** cell (2,3) is expanded showing individual markers  
**When** the user clicks on one of the individual risk markers  
**Then** the cell remains expanded  
**And** the marker selection behavior occurs (if selection is enabled)  
**And** the cell does not collapse

#### Scenario: Click outside any cell does nothing

**Given** cell (2,3) is expanded  
**When** the user clicks on the grid background (not within any cell)  
**Then** cell (2,3) remains expanded  
**And** no state changes occur  
**And** visual behavior follows existing background click rules

---

### Requirement: Clear Expanded State on Data Refresh

When the visual receives a data update (Power BI update() call), any expanded cell SHALL be collapsed automatically.

#### Scenario: Data refresh collapses expanded cell

**Given** cell (2,3) is expanded showing individual markers  
**When** the visual receives a data update from Power BI  
**Then** cell (2,3) collapses to count mode  
**And** the expanded cell state is cleared  
**And** all cells render in count mode initially  
**And** the user can expand cells again after the refresh

#### Scenario: Expanded cell key no longer exists after refresh

**Given** cell (2,3) is expanded  
**When** data updates and cell (2,3) now contains 0 risks  
**Then** the expanded state is cleared  
**And** cell (2,3) shows no marker (empty)  
**And** no errors occur  
**And** other cells render normally

---

### Requirement: Count Marker Styling

Count markers in centered mode SHALL have distinct styling to indicate they are interactive and different from regular risk markers.

#### Scenario: Count marker size

**Given** the visual is in centered mode  
**And** regular marker size setting is 6  
**When** count markers render  
**Then** count markers are larger than regular markers (e.g., 1.5x size)  
**And** the size is sufficient to display count text clearly  
**And** the size adapts to marker size settings

#### Scenario: Count marker color

**Given** a cell contains risks with mixed severity levels  
**When** the count marker renders  
**Then** the marker color reflects the highest severity in the cell  
**Or** uses a configurable count marker color  
**And** the color provides sufficient contrast for the count text

#### Scenario: Count text styling

**Given** a count marker displays "5"  
**When** the marker renders  
**Then** the text is centered horizontally and vertically  
**And** the font size is readable (proportional to marker size)  
**And** the text color contrasts with the marker background  
**And** the text font weight is bold for emphasis

---

### Requirement: No Labels in Count Mode

When positioned in centered count mode, the visual SHALL NOT display risk ID labels for count markers.

#### Scenario: Count markers have no labels

**Given** the visual is in centered mode  
**And** "Show labels" setting is enabled  
**And** cell (2,3) shows a count marker  
**When** the cell renders  
**Then** no risk ID labels are displayed for the count marker  
**And** only the count number is shown inside the marker  
**And** individual risk markers in expanded cells may show labels per existing rules

#### Scenario: Expanded cell respects label settings

**Given** cell (2,3) is expanded to show individual markers  
**And** "Show labels" setting is enabled  
**When** the expanded cell renders  
**Then** individual risk markers show labels per existing label settings  
**And** label behavior follows existing label spec  
**And** labels are positioned correctly in organized grid layout

---

### Requirement: Preserve Inherent→Residual Arrow Animation

When a cell is expanded to show individual risks, the visual SHALL preserve and display the inherent→residual arrow animation if animation is enabled.

#### Scenario: Expanded cell shows animated arrows

**Given** the visual has animation enabled  
**And** cell (2,3) contains risks with both inherent and residual positions  
**And** cell (2,3) is expanded to show individual markers  
**When** the expanded cell renders  
**Then** markers with both inherent and residual positions show animated arrows  
**And** arrows animate from inherent to residual position  
**And** animation behavior matches the behavior in organized grid mode  
**And** animation timing respects the global animation duration setting

#### Scenario: Count mode has no arrows

**Given** the visual is in centered count mode  
**And** cells show count markers  
**When** cells render  
**Then** no arrows are displayed for count markers  
**And** arrows only appear when a cell is expanded

---

### Requirement: Marker Click in Expanded Cell Collapses Cell

When a cell is expanded to show individual risk markers, clicking on any individual marker SHALL collapse the cell back to count marker view (same behavior as clicking cell background).

#### Scenario: Click individual marker collapses cell

**Given** cell (2,3) is expanded showing 5 individual markers  
**When** the user clicks on any of the individual risk markers  
**Then** cell (2,3) collapses to count marker with "5"  
**And** all individual markers are hidden  
**And** the count marker is restored  
**And** the cell background click and marker click have identical collapse behavior

#### Scenario: Consistent click-to-collapse behavior

**Given** cell (2,3) is expanded  
**When** the user clicks the cell background  
**Or** the user clicks any individual marker in the cell  
**Then** both actions produce the same result: cell collapses  
**And** no difference in behavior between marker click and background click  
**And** tooltip may still appear briefly on marker hover before collapse

---

### Requirement: Fast Expansion Animation

When a cell is expanded from count marker to individual markers, the visual SHALL immediately show markers animating from the center position to their final organized positions without delay.

#### Scenario: Immediate expansion animation on click

**Given** cell (2,3) shows a count marker at center  
**And** the cell contains 5 risks  
**When** the user clicks the count marker  
**Then** the count marker disappears immediately  
**And** 5 individual markers appear at the center position  
**And** markers animate to their final organized grid positions  
**And** animation duration is short (e.g., 200-400ms)  
**And** no long delay or pause occurs before animation starts

#### Scenario: Animation uses sequential timing

**Given** cell (2,3) is expanding to show markers  
**When** markers animate from center to positions  
**Then** markers may animate sequentially (staggered start times)  
**Or** markers may animate simultaneously  
**And** total animation completes within 500ms  
**And** animation feels responsive and immediate  
**And** animation respects global animation enable/disable setting

#### Scenario: No animation when animations disabled

**Given** the visual has animation disabled in settings  
**And** cell (2,3) shows a count marker  
**When** the user clicks the count marker  
**Then** individual markers appear immediately at final positions  
**And** no animation occurs  
**And** markers are instantly in organized grid layout

---

### Requirement: Scrolling for Overflow in Expanded Cell

When an expanded cell contains more markers than can fit within the cell bounds (based on marker rows and columns settings), the visual SHALL enable scrolling within that cell similar to the organized grid scrolling behavior.

#### Scenario: Expanded cell with overflow enables scrolling

**Given** marker rows per cell = 3 and marker columns per cell = 3 (max 9 visible)  
**And** cell (2,3) contains 12 risks  
**And** cell (2,3) is expanded  
**When** the cell renders  
**Then** the first 9 markers are visible in a 3x3 grid  
**And** the remaining 3 markers are hidden (scrolled off)  
**And** a scroll indicator or fade mask appears at the bottom edge  
**And** the user can scroll within the cell to view hidden markers

#### Scenario: Mouse wheel scrolling in expanded cell

**Given** cell (2,3) is expanded with 12 markers (9 visible, 3 hidden)  
**And** the user hovers over cell (2,3)  
**When** the user scrolls the mouse wheel down  
**Then** markers scroll vertically within the cell  
**And** previously hidden markers become visible  
**And** scrolling is constrained to the cell bounds  
**And** scrolling behavior matches the organized grid scrolling spec

#### Scenario: Scroll position resets on collapse

**Given** cell (2,3) is expanded and scrolled to show hidden markers  
**When** the user collapses the cell (click marker or background)  
**Then** the scroll position is reset  
**And** when the cell is expanded again, it starts at the top (scroll position = 0)  
**And** no scroll state is preserved between expand/collapse cycles

#### Scenario: Small cell count does not enable scrolling

**Given** marker rows per cell = 3 and marker columns per cell = 3 (max 9 visible)  
**And** cell (2,3) contains 6 risks  
**And** cell (2,3) is expanded  
**When** the cell renders  
**Then** all 6 markers are visible in organized grid  
**And** no scrolling is enabled  
**And** no scroll indicators appear  
**And** the cell behaves as a simple organized grid

---

## MODIFIED Requirements

None (this is a new capability, no existing requirements modified)

## REMOVED Requirements

None

## Dependencies

- **cell-scrolling**: If enabled, expanded cells in organized grid SHALL respect scrolling settings
- Existing **marker-layout** capability: Reuses organized grid positioning logic
- Existing **selection** capability: Individual markers in expanded cells support selection

## Future Enhancements

- Animation transition between count and expanded views
- Persistent expanded state across minor data updates (if cell key remains valid)
- Multi-cell expansion (allow expanding multiple cells simultaneously)
- Hover preview (show count details on hover before click)
- Configurable count marker styling in Format panel
