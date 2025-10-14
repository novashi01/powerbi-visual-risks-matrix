# TODO (Risks Matrix)

- [x] Capabilities: add explicit roles for riskId, inherent/residual likelihood & consequence, category, tooltips
- [x] Rendering: draw 5x5 grid with severity bands; markers + inherent→residual arrow; jitter for collisions
- [x] Formatting: thresholds, marker size/color, arrow toggles, labels, tooltips
- [x] Axis labels: Customizable with text input, font sizing, and Y-axis orientation options
- [x] Arrow customization: Configurable arrow size (4-20px) and distance from markers (2-15px)
- [x] Data handling: clamp to [1..5], missing values policy
- [x] Interactivity: selection identities per Risk ID; click-to-select; background clear; multi-select with Ctrl/Cmd
- [x] Cross-filter integration feedback: dim unselected points on external selection
- [x] Performance: basic data reduction cap (max 1000 rows); avoid reflow on clear
- [x] Code quality: Fixed type safety issues, removed `as any` casting, proper selection manager API usage
- [x] Testing: unit tests for data mapping and severity banding; visual regression baseline; arrow customization tests
- [ ] Docs: add screenshots/gifs; sample dataset; full data roles in README
- [ ] CI: GitHub Actions build + package; lint on PR

## Recent Fixes (v1.2.0)
- Added configurable arrow size with dynamic SVG marker generation
- Implemented arrow distance controls to prevent marker overlap
- Fixed floating-point precision issues in test suite (toBeCloseTo vs exact equality)
- Enhanced arrow positioning algorithm with vector mathematics
- Added comprehensive arrow customization test suite (28 new tests)
- Updated capabilities.json and settings.ts for new arrow properties
- Incremented version to 1.2.0.0 across all configuration files

## Recent Fixes (Applied after remote merge)
- Removed unsafe selection manager private API usage
- Fixed type casting issues throughout codebase
- Added proper `updateSelectionHighlight()` method using public APIs
- Improved type safety in formatting settings access
- **FIXED: Axis labels now always show 1-5 regardless of data content**
- **NEW FEATURE: Customizable axis labels with text input, font sizing, and orientation**
- **FIXED: Floating point precision issues in test suite**

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
