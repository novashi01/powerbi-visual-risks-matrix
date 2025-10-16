# Matrix Layout Implementation

## Overview
Implemented organized matrix layout with configurable dimensions and scrolling to fix the random positioning issue of markers and labels.

## New Features Added

### 1. Matrix Layout Settings
- **Matrix Rows**: Configurable number of rows (2-10, default: 3)
- **Matrix Columns**: Configurable number of columns (2-10, default: 3)  
- **Enable Scrolling**: Allow content to exceed viewport with scrolling (default: true)
- **Organized Layout**: Use structured positioning instead of random jitter (default: true)
- **Cell Padding**: Spacing within each cell (0-20px, default: 5px)

### 2. Organized Marker Positioning
- **Problem Solved**: Markers were randomly positioned using jitter, causing poor organization
- **Solution**: Markers within each risk cell are now organized in a sub-grid pattern
- **Multiple Markers**: When multiple risks fall in same cell, they arrange in orderly rows/columns
- **Fallback**: Original jittered layout available as option for backward compatibility

### 3. Scrolling Support  
- **Viewport Management**: Content can exceed visual boundaries
- **Scroll Container**: Wrapped SVG in scrollable div container
- **Dynamic Sizing**: SVG expands based on matrix dimensions and content requirements
- **Minimum Sizes**: Ensures adequate space for readability

### 4. Improved Grid Rendering
- **Dynamic Dimensions**: Grid adapts to matrix row/column settings
- **Label Safety**: Handles cases where custom labels exceed matrix dimensions
- **Responsive Scaling**: Maintains proportions across different sizes

## Technical Changes

### Settings.ts
- Added `LayoutCardSettings` class with matrix configuration options
- Added layout card to main formatting model
- Proper validation ranges for all settings

### Capabilities.json  
- Added "layout" object with matrix properties
- Enables Power BI property panel integration

### Visual.ts
- Added `scrollContainer` HTML div wrapper
- Implemented `organizeMarkersInCell()` method for structured positioning
- Updated `renderData()` to support both organized and jittered layouts
- Enhanced `renderGrid()` with dynamic matrix dimensions
- Updated `clamp()` method to work with variable matrix sizes
- Modified constructor to use scroll container
- Enhanced `resize()` method for proper viewport management

## Benefits

1. **Better Organization**: Markers are no longer randomly scattered
2. **Scalability**: Matrix can expand beyond default 5x5 to accommodate more data points  
3. **User Control**: Complete control over layout dimensions and behavior
4. **Backward Compatibility**: Existing reports continue to work with optional organized layout
5. **Improved UX**: Scrolling prevents cramped displays with large matrices

## Usage Guidelines

- **Small Datasets**: Use 3x3 or 4x4 matrix with organized layout
- **Large Datasets**: Enable scrolling and increase matrix dimensions  
- **Dense Cells**: Adjust cell padding for optimal marker spacing
- **Legacy Reports**: Keep organized layout disabled for existing behavior

## Configuration Recommendations

| Scenario | Matrix Size | Organized Layout | Scrolling | Cell Padding |
|----------|-------------|------------------|-----------|--------------|
| Small risks (< 25) | 3x3 or 4x4 | ✓ Enabled | ✓ Enabled | 5-8px |
| Medium risks (25-50) | 5x5 or 6x6 | ✓ Enabled | ✓ Enabled | 3-5px |  
| Large risks (50+) | 7x7 or larger | ✓ Enabled | ✓ Required | 2-3px |
| Legacy compatibility | 5x5 | ✗ Disabled | Optional | 5px |