# TODO (Risks Matrix)

- Capabilities: add explicit roles for riskId, inherent/residual likelihood & consequence, category, tooltips
- Rendering: draw 5x5 grid with severity bands; markers + inherent→residual arrow; jitter for collisions
- Formatting: thresholds, axis labels (custom text), marker size/color, arrow toggles, labels, tooltips
- Data handling: clamp to [1..5], missing values policy, CE-derived residual (optional)
- Interactivity: selection identities per Risk ID; cross-filter integration
- Performance: data reduction for large datasets; avoid reflow on minor updates
- Testing: unit tests for data mapping and severity banding; visual regression baseline
- Docs: add screenshots/gifs; sample dataset; full data roles in README
- CI: GitHub Actions build + package; lint on PR
