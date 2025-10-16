# Development Context & Troubleshooting Guide - v1.3.1

## 🎯 Project Overview
**Project**: Power BI Custom Visual - Risks Matrix  
**Current Version**: 1.3.1.0  
**Last Updated**: December 2024  
**Status**: Ready for testing and deployment

---

## 📋 Development Process Summary

### v1.3.0 → v1.3.1 Journey

#### Initial Goals (v1.3.0)
1. ✅ Configurable matrix grid (2-10 × 2-10)
2. ✅ Three positioning modes (Organized Grid, Scatter, Centered)
3. ✅ Organized grid layout with n×n markers per cell
4. ✅ Inherent → Residual visualization

#### v1.3.1 Enhancements
1. ✅ Arrow distance max increased to 50px
2. ✅ Arrow color picker
3. ✅ Arrow transparency control
4. ✅ Inherent marker transparency (customizable)
5. ✅ Inherent marker animation
6. ✅ Auto-fit viewport (removed scrolling)

---

## ⚠️ Key Issues Encountered & Solutions

### Issue 1: Duplicate `slices` Declaration
**Problem**: TypeScript error - Duplicate identifier 'slices' at line 330  
**Location**: `src/settings.ts`  
**Root Cause**: Added `inherentTransparency` to slices array but accidentally duplicated the entire slices declaration  
**Solution**: Removed duplicate slices array, kept only one with all properties including `inherentTransparency`

```typescript
// ❌ WRONG (duplicate)
slices: Array<FormattingSettingsSlice> = [...items];
slices: Array<FormattingSettingsSlice> = [...items]; // duplicate

// ✅ CORRECT
slices: Array<FormattingSettingsSlice> = [
    this.layoutMode,
    this.markerRows,
    this.markerColumns,
    this.cellPadding,
    this.showInherentInOrganized,
    this.inherentTransparency,  // new item added
    this.organizedArrows
];
```

### Issue 2: Inherent Markers in Wrong Cell
**Problem**: Inherent markers were appearing in the same cell as residual markers  
**Root Cause**: Using residual position (lRes, cRes) instead of inherent position (lInh, cInh)  
**Solution**: Updated `renderOrganizedLayout()` to use correct coordinates:
- Inherent markers use: `d.lInh, d.cInh` (original risk position)
- Residual markers use: `d.lRes ?? d.lInh, d.cRes ?? d.cInh` (current position)

### Issue 3: Arrow Direction Incorrect
**Problem**: Arrows pointing from residual to inherent (backwards)  
**Root Cause**: Arrow start/end parameters reversed  
**Solution**: Ensured `calculateArrowPosition()` called with:
```typescript
calculateArrowPosition(
    positions.inherent,  // START at inherent
    positions.residual,  // END at residual
    arrowDistance
)
```

### Issue 4: Scrolling Not Removed
**Problem**: Matrix still showed scrollbars after "removing scrolling"  
**Root Cause**: Multiple references to scrollContainer and enableScrolling  
**Solution**: 
1. Removed `scrollContainer` from constructor
2. Removed `enableScrolling` from settings
3. Removed scroll calculations in `renderGrid()` and `renderData()`
4. Changed to use `vp.width` and `vp.height` directly

### Issue 5: Arrow Marker Not Using Color
**Problem**: Arrows always appeared in default color (#333) despite color setting  
**Root Cause**: `createArrowMarker()` had hardcoded fill color  
**Solution**: Added `arrowColor` parameter to method signature and used it for path fill

---

## 🏗️ Architecture Overview

### File Structure
```
myVisual/
├── src/
│   ├── visual.ts           # Main visual logic (1000+ lines)
│   ├── settings.ts         # Formatting settings definitions
│   └── types.ts            # TypeScript interfaces
├── capabilities.json       # Power BI capabilities definition
├── pbiviz.json            # Visual metadata
├── package.json           # NPM dependencies
├── tsconfig.json          # TypeScript configuration
├── test/                  # Jest unit tests
└── dist/                  # Built packages
```

### Key Classes

#### `Visual` (visual.ts)
Main visual implementation with methods:
- `constructor()` - Initialize SVG structure
- `update()` - Main render cycle
- `resize()` - Handle viewport changes
- `renderGrid()` - Draw matrix cells and labels
- `renderData()` - Draw risk markers
- `renderOrganizedLayout()` - Organized grid positioning
- `renderMarkerWithArrow()` - Scatter/centered positioning
- `createArrowMarker()` - SVG arrow marker definition
- `calculateArrowPosition()` - Arrow offset calculation

#### Settings Classes (settings.ts)
- `DataPointCardSettings` - Data field mappings
- `SeverityCardSettings` - Risk severity colors
- `ThresholdsCardSettings` - Risk level thresholds
- `AxesCardSettings` - Axis labels and fonts
- `MarkersCardSettings` - Marker size and color
- `ArrowsCardSettings` - Arrow configuration
- `LabelsCardSettings` - Marker labels
- `TooltipsCardSettings` - Tooltip configuration
- `AnimationCardSettings` - Animation settings
- `MatrixGridCardSettings` - Matrix dimensions
- `RiskMarkersLayoutCardSettings` - Positioning mode
- `VisualFormattingSettingsModel` - Main model containing all cards

---

## 🔧 Common Development Patterns

### Adding a New Setting

**Step 1: Add to settings.ts**
```typescript
export class MyCardSettings extends FormattingSettingsCard {
    myNewSetting = new formattingSettings.NumUpDown({
        name: "myNewSetting",
        displayName: "My New Setting",
        value: 10,
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    name: string = "myCard";
    displayName: string = "My Card";
    slices: Array<FormattingSettingsSlice> = [
        this.myNewSetting
    ];
}

// Add to model
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    myCard = new MyCardSettings();
    
    cards = [
        // ... existing cards
        this.myCard
    ];
}
```

**Step 2: Add to capabilities.json**
```json
{
  "objects": {
    "myCard": {
      "displayName": "My Card",
      "properties": {
        "myNewSetting": {
          "displayName": "My New Setting",
          "type": { "numeric": true }
        }
      }
    }
  }
}
```

**Step 3: Use in visual.ts**
```typescript
const myValue = this.formattingSettings?.myCard?.myNewSetting?.value || 10;
```

### Adding Animation
```typescript
// Set initial state
element.setAttribute("opacity", "0");

// Trigger animation
setTimeout(() => {
    element.style.transition = `opacity ${duration}ms ease-in`;
    element.setAttribute("opacity", "1");
}, 10);
```

### SVG Element Creation Pattern
```typescript
const element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
element.setAttribute("cx", String(x));
element.setAttribute("cy", String(y));
element.setAttribute("r", String(radius));
element.setAttribute("fill", color);
this.gPoints.appendChild(element);
```

---

## 🐛 Debugging Tips

### TypeScript Compilation Errors
```bash
# Check for errors
npx tsc --noEmit

# Common issues:
# - Duplicate identifiers (check for copy-paste errors)
# - Missing parameters (check method signatures)
# - Type mismatches (use proper type casting)
```

### Testing
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode during development
npm run test:watch
```

### Packaging
```bash
# Create package
npm run package

# Check for issues
pbiviz package --no-minify

# Output location
dir dist\*.pbiviz
```

### ESLint Issues
```bash
# Check linting
npm run lint

# Common fixes:
# - Add eslint-disable comments for necessary violations
# - Fix non-literal fs paths in utility scripts
# - Use powerbi-visuals rules appropriately
```

---

## 📝 Settings Reference Card

### Quick Settings Lookup

| Card | Setting | Type | Default | Range/Options |
|------|---------|------|---------|---------------|
| **Arrows** | show | toggle | true | - |
| | arrowSize | number | 8 | 4-20 |
| | arrowDistance | number | 5 | 2-50 |
| | arrowColor | color | #666666 | - |
| | arrowTransparency | number | 100 | 0-100 |
| **Matrix Grid** | matrixRows | number | 3 | 2-10 |
| | matrixColumns | number | 3 | 2-10 |
| **Risk Markers Layout** | layoutMode | dropdown | organized | organized/scatter/centered |
| | markerRows | number | 3 | 1-10 |
| | markerColumns | number | 3 | 1-10 |
| | cellPadding | number | 5 | 0-20 |
| | showInherentInOrganized | toggle | true | - |
| | inherentTransparency | number | 50 | 0-100 |
| | organizedArrows | toggle | true | - |
| **Markers** | size | number | 6 | 2-20 |
| | color | color | "" | (auto) |
| **Labels** | show | toggle | false | - |
| | fontSize | number | 10 | 6-20 |
| **Animation** | enabled | toggle | false | - |
| | durationMs | number | 1000 | 100-5000 |

---

## 🚀 Development Workflow

### Standard Development Cycle

```bash
# 1. Make changes to source files
# Edit src/visual.ts, src/settings.ts, capabilities.json, etc.

# 2. Check TypeScript
npx tsc --noEmit

# 3. Run tests
npm test

# 4. Check linting (optional)
npm run lint

# 5. Create package
npm run package

# 6. Test in Power BI Desktop
# Import the .pbiviz from dist/ folder

# 7. Iterate
# Fix any issues and repeat
```

### Quick Verification Script
```bash
# Run the verification batch file
VERIFY-V1.3.0.bat

# This runs:
# 1. TypeScript compilation
# 2. Unit tests
# 3. Package creation
```

---

## 📚 Code Examples

### Example 1: Accessing Settings in Methods
```typescript
private myMethod() {
    // Always use optional chaining and provide defaults
    const rows = this.formattingSettings?.matrixGridCard?.matrixRows?.value || 5;
    const color = this.formattingSettings?.arrowsCard?.arrowColor?.value.value || "#666666";
    const enabled = this.formattingSettings?.animationCard?.enabled?.value ?? false;
}
```

### Example 2: Creating SVG with Animation
```typescript
private createAnimatedMarker(x: number, y: number, color: string) {
    const animationEnabled = this.formattingSettings.animationCard.enabled.value ?? false;
    const animationDuration = this.formattingSettings.animationCard.durationMs.value || 1000;
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", "6");
    circle.setAttribute("fill", color);
    
    if (animationEnabled) {
        circle.setAttribute("opacity", "0");
        setTimeout(() => {
            circle.style.transition = `opacity ${animationDuration}ms ease-in`;
            circle.setAttribute("opacity", "1");
        }, 10);
    }
    
    this.gPoints.appendChild(circle);
}
```

### Example 3: Color and Transparency
```typescript
private renderWithTransparency(x: number, y: number) {
    const color = "#FF0000";
    const transparency = this.formattingSettings?.myCard?.transparency?.value || 100;
    const opacity = transparency / 100; // Convert percentage to 0-1
    
    const element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    element.setAttribute("cx", String(x));
    element.setAttribute("cy", String(y));
    element.setAttribute("r", "5");
    element.setAttribute("fill", color);
    element.setAttribute("fill-opacity", String(opacity));
    
    this.gPoints.appendChild(element);
}
```

---

## 🎨 Visual Rendering Pipeline

```
update() called
    ↓
1. Get formattingSettings
    ↓
2. Update arrow marker (createArrowMarker)
    ↓
3. resize() - Set SVG dimensions
    ↓
4. renderGrid() - Draw matrix cells and labels
    ↓
5. mapData() - Transform DataView to RiskPoint[]
    ↓
6. renderData() - Main rendering logic
    ↓
    ├─ If layoutMode === "organized"
    │   └─ renderOrganizedLayout()
    │       ├─ Organize markers in cells
    │       ├─ Render inherent markers (if enabled)
    │       ├─ Render residual markers
    │       └─ Render arrows (if enabled)
    │
    └─ If layoutMode === "scatter" or "centered"
        └─ For each risk:
            └─ renderMarkerWithArrow()
                ├─ Calculate positions
                ├─ Render arrow (if needed)
                ├─ Render inherent marker (if exists)
                ├─ Render residual marker
                └─ Render label (if enabled)
```

---

## 🔍 Troubleshooting Checklist

### Visual Not Rendering
- [ ] Check browser console for errors
- [ ] Verify data is loaded (check DataView)
- [ ] Check required fields are mapped
- [ ] Verify SVG elements are created
- [ ] Check viewport dimensions

### Settings Not Appearing
- [ ] Verify capabilities.json has the property
- [ ] Check settings.ts has the setting defined
- [ ] Ensure setting is in slices array
- [ ] Verify card is in model.cards array
- [ ] Clear Power BI cache and reload

### Compilation Errors
- [ ] Run `npx tsc --noEmit`
- [ ] Check for duplicate identifiers
- [ ] Verify all imports are correct
- [ ] Check method signatures match
- [ ] Ensure types are properly defined

### Package Errors
- [ ] Check node_modules are installed
- [ ] Verify pbiviz.json version matches package.json
- [ ] Run `npm install` to update dependencies
- [ ] Check for ESLint errors
- [ ] Ensure certificate is valid

---

## 📞 Quick Reference Commands

```bash
# Development
npm start                  # Start dev server with live reload
npm run package           # Create production package
npm test                  # Run all tests
npm run lint             # Check code quality

# TypeScript
npx tsc --noEmit         # Check for compilation errors
npx tsc --watch          # Watch mode

# Debugging
node --inspect-brk       # Debug node scripts
npm test -- --verbose    # Verbose test output

# Clean
rm -rf node_modules      # Remove dependencies
rm -rf dist             # Remove built packages
npm install             # Reinstall dependencies
```

---

## 🎯 Next Development Tasks (Future)

### Potential Enhancements
1. **Export Feature**: Export matrix as PNG/SVG
2. **Risk Grouping**: Group risks by category with color coding
3. **Drill-through**: Click marker to open detailed report
4. **Risk Trend**: Show risk movement over time
5. **Custom Shapes**: Allow different marker shapes (circle, square, diamond)
6. **Risk Heat Map**: Gradient background instead of solid colors
7. **Collision Detection**: Prevent marker overlap in scatter mode
8. **Zoom/Pan**: For large matrices with many risks

### Known Limitations
- Maximum ~1000 risks for smooth performance
- No built-in export functionality
- Limited to 2D matrix (no 3D view)
- Animation performance varies by device

---

## 📖 Additional Documentation

- **User Guide**: RELEASE-NOTES-v1.3.1.md
- **Version Info**: VERSION-1.3.1.md
- **Improvements**: V1.3.0-IMPROVEMENTS-APPLIED.md
- **Test Plan**: RELEASE-TEST-PLAN-v1.3.0.md
- **This File**: DEV-CONTEXT-MENU.md

---

## 🆘 Getting Help

1. Check this document first
2. Review error messages carefully
3. Search GitHub issues
4. Check Power BI community forums
5. Review Power BI Custom Visuals documentation

---

**Last Updated**: December 2024  
**For**: v1.3.1 Development  
**Maintainer**: Development Team