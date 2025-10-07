# TODO (Risks Matrix)

- [x] Capabilities: add explicit roles for riskId, inherent/residual likelihood & consequence, category, tooltips
- [x] Rendering: draw 5x5 grid with severity bands; markers + inherent→residual arrow; jitter for collisions
- [ ] Formatting: thresholds, axis labels (custom text), marker size/color, arrow toggles, labels, tooltips
- [x] Data handling: clamp to [1..5], missing values policy
- [ ] Interactivity: selection identities per Risk ID; cross-filter integration
- [ ] Performance: data reduction for large datasets; avoid reflow on minor updates
- [ ] Testing: unit tests for data mapping and severity banding; visual regression baseline
- [ ] Docs: add screenshots/gifs; sample dataset; full data roles in README
- [ ] CI: GitHub Actions build + package; lint on PR
