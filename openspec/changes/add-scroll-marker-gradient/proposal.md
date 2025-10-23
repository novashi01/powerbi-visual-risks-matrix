## Why
Residual marker lists currently appear to cut off abruptly when scrolling hides items at the top or bottom of a cell. Users asked for a visual affordance that conveys overflow while keeping the scroll interaction lightweight.

## What Changes
- Add a configurable gradient fade at the top and bottom edges of scrollable marker stacks.
- Surface a format pane control to adjust (or disable) the fade depth for the effect.
- Update organized layout rendering to apply reusable SVG masks so markers ease out near the clip boundary.

## Impact
- Affected specs: cell-scrolling
- Affected code: src/visual.ts, src/settings.ts, capabilities.json
