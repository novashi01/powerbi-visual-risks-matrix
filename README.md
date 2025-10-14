# Risks Matrix v1.2.0 (Power BI Custom Visual)

A Power BI custom visual that plots risks on a 5x5 matrix (Likelihood × Consequence) and, when available, shows the shift from inherent to residual risk with an arrow. **Now with fully customizable axis labels and arrow controls!**

## ✨ What's New in v1.2.0
- **🏹 Configurable Arrow Size**: Adjust arrow size from 4px to 20px
- **📏 Arrow Distance Controls**: Set distance between arrows and markers (2px-15px)
- **🔧 Enhanced Arrow Settings**: Dedicated arrow customization panel
- **🐛 Bug Fixes**: Resolved floating-point precision issues in tests
- **🧪 Enhanced Testing**: 88 comprehensive tests with excellent coverage

## Features
- 5x5 risk matrix with severity band coloring (configurable thresholds)
- **v1.1.0**: Customizable axis labels with font controls and orientation options
- **v1.2.0 NEW**: Configurable arrow size and distance from markers
- Default severity colors: Low=#388e3c (green), Moderate=#fbc02d (yellow), High=#f57c00 (orange), Extreme=#d32f2f (red)
- Inherent and residual positions per Risk ID with arrow and optional animation (increasing/decreasing/new/static)
- Tooltips, selection, and cross-filtering integration
- Marker size and color options; jitter to avoid overlap
- Individual show/hide controls for X and Y axes

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
