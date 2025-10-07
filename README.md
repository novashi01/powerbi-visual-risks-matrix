# Risks Matrix (Power BI Custom Visual)

A Power BI custom visual that plots risks on a 5x5 matrix (Likelihood × Consequence) and, when available, shows the shift from inherent to residual risk with an arrow.

## Features
- 5x5 risk matrix with severity band coloring (configurable thresholds)
- Default severity colors: Low=#388e3c (green), Moderate=#fbc02d (yellow), High=#f57c00 (orange), Extreme=#d32f2f (red)
- Inherent and residual positions per Risk ID with arrow and optional animation (increasing/decreasing/new/static)
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
3) Configure colors, bands, labels, and arrow/animation in Format pane

## Animation history states
- Increasing: residual severity > inherent; animated arrow forward
- Decreasing: residual severity < inherent; animated arrow backward/green accent
- Static: equal severity; pulse/fade minimal
- New: no inherent; fade-in at residual position

## Roadmap / To-do
See TODO.md for prioritized tasks.

## Contributing
PRs welcome. Please open an issue first for large changes.

## License
MIT
