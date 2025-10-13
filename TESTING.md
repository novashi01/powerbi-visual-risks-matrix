# Testing Documentation

This document describes the comprehensive testing setup for the Risk Matrix Power BI Visual.

## Test Architecture

### Unit Tests (`*.test.ts`)
- **Data Mapping Tests**: Validate data transformation and edge cases
- **Severity Banding Tests**: Ensure correct color assignment based on risk scores
- **Settings Tests**: Verify formatting model behavior
- **Edge Case Handling**: Null values, NaN, out-of-range data

### Integration Tests (`*.integration.test.ts`)  
- **Real Data Scenarios**: Test with realistic risk datasets
- **Performance Tests**: Validate handling of large datasets (1000+ items)
- **Full Update Cycle**: Complete visual lifecycle testing
- **Jitter Consistency**: Stable positioning across updates

### Visual Regression Tests (`*.spec.ts`)
- **Rendering Validation**: Screenshot comparison for UI consistency
- **Grid Structure**: 5×5 matrix with proper severity coloring
- **Responsive Behavior**: Viewport size adaptations
- **Empty State Handling**: Graceful degradation with no data

## Test Data

### Sample Data (`test-data.ts`)
```typescript
const sampleRiskData = [
  { id: 'RISK-001', lInh: 3, cInh: 4, lRes: 2, cRes: 3, category: 'Operational' },
  // ... more realistic risk scenarios
];
```

### Edge Cases
- Missing inherent/residual values
- Out-of-range values (0, 6+, negative)
- Null, undefined, NaN values
- Large dataset performance testing

### Severity Test Cases
Validates color assignment for all risk score ranges:
- Low (1-4): Green `#388e3c`
- Moderate (5-9): Yellow `#fbc02d`  
- High (10-16): Orange `#f57c00`
- Extreme (17+): Red `#d32f2f`

## Running Tests

### Local Development
```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# Visual regression tests
npm run test:visual
```

### CI/CD Pipeline
- Automated testing on all pushes and pull requests
- Multi-Node.js version testing (18.x, 20.x)
- Coverage reporting with Codecov integration
- Visual regression baseline management
- Build artifact generation

## Coverage Targets

- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## Test File Structure

```
src/
├── visual.test.ts              # Core visual functionality tests
├── visual.integration.test.ts  # Integration scenarios
├── settings.test.ts           # Formatting settings tests
└── test-data.ts              # Shared test data and utilities

visual.spec.ts                 # Playwright visual regression tests
jest.config.js                # Jest configuration
jest.setup.js                 # Test environment setup
playwright.config.ts          # Playwright configuration
```

## Mocking Strategy

### Power BI API Mocks
- Selection Manager with public API methods
- Visual Host with builder patterns
- Data View structures with categorical data
- SVG DOM elements for rendering tests

### Performance Considerations
- Data reduction cap testing (1000 items max)
- Rendering performance benchmarks
- Memory usage validation for large datasets

## Visual Regression Baselines

Playwright captures reference screenshots for:
- Empty visual state
- Basic risk matrix rendering
- Different viewport sizes
- Various data scenarios

Baselines are stored in version control and updated as needed for legitimate UI changes.

## Debugging Tests

### Failed Unit Tests
```bash
# Run specific test file
npm test -- visual.test.ts

# Run with verbose output
npm test -- --verbose

# Debug mode
npm test -- --detectOpenHandles
```

### Failed Visual Tests
```bash
# Update visual baselines (when changes are intentional)
npx playwright test --update-snapshots

# View test report
npx playwright show-report
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Realistic Data**: Use representative risk datasets
3. **Edge Case Coverage**: Test boundary conditions and error states
4. **Performance Awareness**: Validate efficiency with large datasets
5. **Visual Consistency**: Maintain regression test baselines
6. **Continuous Integration**: All tests must pass before merge