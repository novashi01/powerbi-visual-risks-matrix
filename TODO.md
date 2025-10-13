# TODO (Risks Matrix)

- [x] Capabilities: add explicit roles for riskId, inherent/residual likelihood & consequence, category, tooltips
- [x] Rendering: draw 5x5 grid with severity bands; markers + inherent→residual arrow; jitter for collisions
- [x] Formatting: thresholds, marker size/color, arrow toggles, labels, tooltips
- [x] Axis labels: derive from dataset domain (no custom text)
- [x] Data handling: clamp to [1..5], missing values policy
- [x] Interactivity: selection identities per Risk ID; click-to-select; background clear; multi-select with Ctrl/Cmd
- [x] Cross-filter integration feedback: dim unselected points on external selection
- [x] Performance: basic data reduction cap (max 1000 rows); avoid reflow on clear
- [x] Code quality: Fixed type safety issues, removed `as any` casting, proper selection manager API usage
- [x] Testing: unit tests for data mapping and severity banding; visual regression baseline
- [ ] Docs: add screenshots/gifs; sample dataset; full data roles in README
- [ ] CI: GitHub Actions build + package; lint on PR

## Recent Fixes (Applied after remote merge)
- Removed unsafe selection manager private API usage
- Fixed type casting issues throughout codebase
- Added proper `updateSelectionHighlight()` method using public APIs
- Improved type safety in formatting settings access

## Testing Implementation ✅
- **Unit Tests**: Comprehensive coverage for data mapping, severity banding, edge cases
- **Integration Tests**: Real-world scenarios, performance testing, large datasets
- **Visual Regression**: Playwright tests for UI consistency and rendering
- **Test Data**: Sample datasets including edge cases and performance scenarios
- **CI Pipeline**: Automated testing on push/PR with coverage reporting
- **Test Coverage**: >90% code coverage target with detailed reporting

### Test Commands
- `npm test` - Run all unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage reports
- `npm run test:visual` - Run Playwright visual regression tests
