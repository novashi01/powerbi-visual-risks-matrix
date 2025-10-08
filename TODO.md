# TODO (Risks Matrix)

- [x] Capabilities: add explicit roles for riskId, inherent/residual likelihood & consequence, category, tooltips
- [x] Rendering: draw 5x5 grid with severity bands; markers + inherent→residual arrow; jitter for collisions
- [x] Formatting: thresholds, marker size/color, arrow toggles, labels, tooltips
- [x] Axis labels: derive from dataset domain (no custom text)
- [x] Data handling: clamp to [1..5], missing values policy
- [x] Interactivity: selection identities per Risk ID; click-to-select; background clear; multi-select with Ctrl/Cmd
- [x] Cross-filter integration feedback: dim unselected points on external selection
- [x] Performance: basic data reduction cap (max 1000 rows); avoid reflow on clear
- [ ] Testing: unit tests for data mapping and severity banding; visual regression baseline
- [ ] Docs: add screenshots/gifs; sample dataset; full data roles in README
- [ ] CI: GitHub Actions build + package; lint on PR
