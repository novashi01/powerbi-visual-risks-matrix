# Spec: cell-scrolling


This spec defines the "cell-scrolling" capability for the Risk Matrix visual.

## Purpose

Provide per-cell vertical scrolling for marker lists when their rendered height exceeds the visible cell area. This enables users to access clipped markers using the mouse wheel without changing cell sizes.

## Summary

Add simple vertical mouse-wheel scrolling for markers inside cells when content overflows the visible cell area. Scrolling is per-cell, implemented via a scroll-container group and transform updates. Behavior is inline and intentionally minimal for v1.

## Requirements

- Wheel scroll inside cells with overflow should translate marker container vertically to reveal hidden markers.
- Scroll bounds must be computed and enforced so content cannot be scrolled beyond its extent.
- No scrolling behavior when content fits inside the cell.
- Prevent default wheel behavior on wheel events inside scrollable cells.
- The `enableScrolling` setting display name should be updated to reflect interactive behavior.

### Requirement: Update Setting Display Name

- Update the `enableScrolling` setting display name in `src/settings.ts` to clearly indicate interactive scrolling (e.g., "Enable interactive cell scrolling").

#### Scenario: Setting label updated

- **WHEN** a developer inspects the `enableScrolling` option in `src/settings.ts`
- **THEN** the display name string reflects interactive cell scrolling (for example: "Enable interactive cell scrolling")

## Implementation notes

See change `add-interactive-cell-scrolling` proposal for details. Implementation will add inline wheel handler and wrapper `<g class="scroll-container">` in `renderOrganizedLayout` in `src/visual.ts`.
