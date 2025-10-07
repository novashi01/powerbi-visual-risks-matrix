# Risks Matrix (Power BI Custom Visual)

A Power BI custom visual that plots risks on a 5x5 matrix (Likelihood × Consequence) and, when available, shows the shift from inherent to residual risk with an arrow.

## Features
- 5x5 risk matrix with severity band coloring (configurable thresholds)
- Inherent and residual positions per Risk ID with arrow between them
- Tooltips, selection, and cross-filtering integration
- Marker size and color options; jitter to avoid overlap

## Data fields
- Required: Risk ID, Likelihood (1–5), Consequence (1–5)
- Optional: Inherent Likelihood/Consequence, Residual Likelihood/Consequence, Category, extra Tooltip fields

## Quick start
- Prereqs: Node LTS, powerbi-visuals-tools (pbiviz)
- Install deps: npm install
- Dev server: npm run start (opens localhost for Power BI service/dev tools)
- Package: npm run package (creates .pbiviz in dist)

## Usage in Power BI
1) Import the packaged .pbiviz
2) Map fields as above
3) Configure colors, bands, labels, and arrow in Format pane

## Roadmap / To-do
See TODO.md for prioritized tasks.

## Contributing
PRs welcome. Please open an issue first for large changes.

## License
MIT
