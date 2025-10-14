# Power BI Risk Matrix - Axis Improvements Implementation Plan

## Current Status Analysis

### ✅ Implemented Features
1. **Customizable Axis Labels**: Text input for X/Y axis labels (1-5)
2. **Font Size Controls**: 8px-24px range for both axes
3. **Y-Axis Orientation**: Horizontal/Vertical text display
4. **Show/Hide Controls**: Independent axis visibility toggles
5. **Fixed Grid Display**: Always shows 1-5 regardless of data content

### 🔧 Identified Issues

#### 1. Floating Point Precision in Tests
**Issue**: Test expects `189.2` but receives `189.20000000000002`
```javascript
// Expected: 189.2
// Received: 189.20000000000002
```
**Solution**: Use `toBeCloseTo()` matcher instead of exact equality

#### 2. Arrow Customization Missing
**Current**: Fixed arrow size and positioning
**Required**: Configurable arrow size and distance from markers

#### 3. Test Coverage Gaps
**Current**: Some tests failing due to precision and type issues
**Required**: Robust test suite with proper floating-point handling

## Enhancement Roadmap

### Phase 1: Fix Current Issues ⚡

#### A. Test Precision Fixes
```javascript
// Replace exact equality with floating-point tolerance
expect(yPositions).toEqual([77.2, 189.2, 301.2, 413.2, 525.2]);
// WITH
yPositions.forEach((pos, index) => {
  expect(pos).toBeCloseTo(expectedPositions[index], 10);
});
```

#### B. Arrow Customization Settings
Add to `settings.ts`:
```typescript
class ArrowCardSettings extends FormattingSettingsCard {
    // Arrow Size Control
    arrowSize = new formattingSettings.NumUpDown({
        name: "arrowSize",
        displayName: "Arrow size", 
        value: 8,
        options: { 
            minValue: { value: 4, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 20, type: powerbi.visuals.ValidatorType.Max }
        }
    });
    
    // Distance from markers
    arrowDistance = new formattingSettings.NumUpDown({
        name: "arrowDistance",
        displayName: "Distance from markers",
        value: 5,
        options: {
            minValue: { value: 2, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 15, type: powerbi.visuals.ValidatorType.Max }
        }
    });
}
```

### Phase 2: Enhanced Arrow Features 🏹

#### A. Dynamic Arrow Sizing
Update marker creation in `visual.ts`:
```typescript
private createArrowMarker(settings: ArrowCardSettings) {
    const arrowSize = settings.arrowSize.value || 8;
    
    // Remove existing marker
    const existingMarker = this.svg.querySelector('#arrow');
    if (existingMarker) existingMarker.remove();
    
    // Create new marker with custom size
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrow");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerWidth", String(arrowSize));
    marker.setAttribute("markerHeight", String(arrowSize)); 
    marker.setAttribute("refX", String(arrowSize));
    marker.setAttribute("refY", String(arrowSize/2));
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M0,0 L${arrowSize},${arrowSize/2} L0,${arrowSize} Z`);
    path.setAttribute("fill", "#333");
    
    marker.appendChild(path);
    return marker;
}
```

#### B. Configurable Arrow Distance
```typescript
private calculateArrowPosition(start: Point, end: Point, distance: number): Point {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Adjust start and end points by distance
    const unitX = dx / length;
    const unitY = dy / length;
    
    return {
        start: {
            x: start.x + unitX * distance,
            y: start.y + unitY * distance
        },
        end: {
            x: end.x - unitX * distance,
            y: end.y - unitY * distance
        }
    };
}
```

### Phase 3: Version Management 📦

#### A. Update Package Version
Current: `1.1.0.0` → New: `1.2.0.0`

Update in:
1. `package.json` 
2. `pbiviz.json`
3. `capabilities.json` (if needed)

#### B. Release Notes
Create `RELEASE-NOTES-v1.2.0.md` with:
- Fixed floating-point precision in tests
- Added arrow size customization
- Added arrow distance controls
- Enhanced test coverage

### Phase 4: Testing Improvements 🧪

#### A. Fix Precision Issues
Update `customizable-axis-labels.test.ts`:
```javascript
test('should calculate correct Y-axis label positions', () => {
  const mockViewport = { width: 800, height: 600 };
  const margins = { l: 40, r: 10, t: 10, b: 30 };
  const rows = 5;
  const cellHeight = (mockViewport.height - margins.t - margins.b) / rows;
  
  const yPositions = Array.from({ length: rows }, (_, y) => {
    return margins.t + (y + 0.6) * cellHeight;
  });
  
  const expectedPositions = [77.2, 189.2, 301.2, 413.2, 525.2];
  yPositions.forEach((pos, index) => {
    expect(pos).toBeCloseTo(expectedPositions[index], 1); // 1 decimal precision
  });
});
```

#### B. Arrow Testing
Add `arrow-customization.test.ts`:
```javascript
describe('Arrow Customization', () => {
  test('should create arrows with custom size', () => {
    const arrowSize = 12;
    const marker = createArrowMarker({ arrowSize: { value: arrowSize } });
    
    expect(marker.getAttribute('markerWidth')).toBe('12');
    expect(marker.getAttribute('markerHeight')).toBe('12');
  });
  
  test('should calculate correct arrow positions with distance', () => {
    const start = { x: 100, y: 100 };
    const end = { x: 200, y: 200 };
    const distance = 10;
    
    const adjusted = calculateArrowPosition(start, end, distance);
    
    // Verify arrows don't overlap markers
    expect(adjusted.start.x).toBeGreaterThan(start.x);
    expect(adjusted.end.x).toBeLessThan(end.x);
  });
});
```

## Implementation Steps

### Step 1: Create Testing Branch
```bash
git checkout -b testing-improvements
```

### Step 2: Fix Test Precision Issues
- Update `customizable-axis-labels.test.ts`
- Use `toBeCloseTo()` for floating-point comparisons
- Verify all tests pass

### Step 3: Implement Arrow Customization
- Add `ArrowCardSettings` to settings.ts
- Update capabilities.json with new properties
- Implement dynamic arrow creation
- Add arrow positioning logic

### Step 4: Update Documentation
- Update README.md with new features
- Create comprehensive test documentation
- Update TODO.md with completed items

### Step 5: Version and Package
- Increment version numbers
- Test packaging process
- Verify Power BI import works
- Create release documentation

## Success Criteria

### ✅ All Tests Pass
- No TypeScript compilation errors
- All Jest tests pass with proper precision handling
- Visual regression tests maintain baselines

### ✅ Arrow Customization Works
- Users can adjust arrow size (4-20px)
- Users can set distance from markers (2-15px)
- Changes reflect immediately in visual

### ✅ Package Successfully
- `npm run package` completes without errors
- .pbiviz file imports into Power BI
- All features work in Power BI Service

### ✅ Documentation Complete
- README updated with new features
- Test documentation explains precision fixes
- Release notes detail all changes

## Risk Mitigation

### Low Risk ✅
- Test precision fixes (well-documented issue)
- Arrow size customization (straightforward implementation)
- Version updates (standard process)

### Medium Risk ⚠️
- Power BI packaging compatibility
- Visual rendering performance with custom arrows
- Cross-browser SVG marker support

### Mitigation Strategies
1. **Incremental Testing**: Test each change individually
2. **Rollback Plan**: Maintain working branch as backup
3. **Performance Monitoring**: Verify arrow rendering doesn't impact performance
4. **Browser Testing**: Test in multiple browsers/Power BI environments

## Timeline Estimate

- **Step 1-2** (Test Fixes): 2-3 hours
- **Step 3** (Arrow Features): 4-6 hours  
- **Step 4** (Documentation): 1-2 hours
- **Step 5** (Packaging/Testing): 2-3 hours

**Total: 9-14 hours** for complete implementation and testing

## Next Actions

1. **Immediate**: Fix test precision issues to get clean test run
2. **Short-term**: Implement arrow customization features  
3. **Medium-term**: Complete documentation and packaging
4. **Long-term**: Monitor usage and gather user feedback

This plan addresses all current issues while adding the requested arrow customization features in a systematic, testable manner.