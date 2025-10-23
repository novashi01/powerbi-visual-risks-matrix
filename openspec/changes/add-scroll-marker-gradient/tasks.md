## 1. Specification
- [x] 1.1 Extend `cell-scrolling` spec with a requirement covering fade overlays and configuration.

## 2. Implementation
- [x] 2.1 Add a `scrollFadeDepth` formatting control under `Risk Markers Layout` and expose it in `capabilities.json`.
- [x] 2.2 Update organized layout rendering to apply reusable SVG masks that fade markers near the clipped edges when scrolling is enabled and overflow exists.
- [x] 2.3 Ensure inherent and residual marker stacks both respect the fade configuration and avoid leaving stale defs entries when disabled.

## 3. Validation
- [x] 3.1 Add or update automated coverage as feasible for the new formatting behavior.
- [x] 3.2 Run lint and test suites, then capture results for review.
