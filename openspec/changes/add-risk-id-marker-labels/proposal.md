## Why

Risk consumers often need to identify individual risks quickly on the matrix. The visual currently optionally shows risk labels adjacent to markers but lacks an option to render the risk ID inside the marker "button" with alignment control and sensible sizing.

Adding an embedded Risk ID label (inside the marker) improves readability and reduces clutter when many markers are present. It also enables the marker to act like a compact button where label placement and padding are customizable.

## What Changes

- Add a new formatting option in the Markers card to enable/disable an in-marker Risk ID label.
- New formatting settings: showRiskIdLabel (toggle), riskIdLabelFontSize (number), riskIdLabelAlignment (enum: left|center|right), riskIdLabelPadding (number), riskIdLabelTruncate (toggle), riskIdLabelMinMarkerSize (number / 'auto'), and riskIdLabelColor (color picker).
- Rendering changes in `src/visual.ts`:
  - Render a text element inside each marker when enabled.
  - Ensure markers respect the label: buttons may expand to accommodate label width OR label is truncated/ellipsized based on settings.
  - Support text alignment (left, center, right) inside markers and vertical centering.
  - Ensure accessibility: title attribute and readable contrast for label color.
  - Maintain performance and existing animation/selection behavior.
- Update `capabilities.json` and `src/settings.ts` to expose new formatting options in the Power BI format pane.
- Add unit tests for label rendering, alignment, size behavior, and truncation.
- Update documentation and release notes for v1.3.4.

**BREAKING?** No. New formatting options are additive and default to off or conservative defaults.

## Impact

- Affected specs/capabilities: `markers` capability (new fields added). See delta in `openspec/changes/add-risk-id-marker-labels/specs/markers/spec.md`.
- Affected code:
  - `src/visual.ts` (rendering logic and helper functions)
  - `src/settings.ts` (formatting model)
  - `capabilities.json` (capabilities definition)
  - Unit tests in `src/*.test.ts` (new tests and small updates)
  - Documentation files: release notes and user guide

## Rollout Plan

1. Create the spec delta and get proposal approved.
2. Implement settings and rendering changes with tests.
3. Run full test suite, package `.pbiviz`, and validate sample report manually.
4. Release as v1.3.4 with notes describing the new marker label options.
