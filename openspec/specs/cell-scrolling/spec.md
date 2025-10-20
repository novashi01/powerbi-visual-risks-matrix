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

Update the `enableScrolling` setting display name in `src/settings.ts` to clearly indicate interactive scrolling (e.g., "Enable interactive cell scrolling").

#### Scenario: Setting label updated

- **WHEN** a developer inspects the `enableScrolling` option in `src/settings.ts`
- **THEN** the display name string reflects interactive cell scrolling (for example: "Enable interactive cell scrolling")

## Implementation notes

See change `add-interactive-cell-scrolling` proposal for details. Implementation will add inline wheel handler and wrapper `<g class="scroll-container">` in `renderOrganizedLayout` in `src/visual.ts`.
