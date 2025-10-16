# Layout Settings Clarification

## 🎯 Two Distinct Layout Settings

The v1.3.0 release introduces **two separate and independent** layout configuration sections to avoid confusion:

### 1. 📊 Matrix Grid Settings
**Purpose**: Controls the overall risk matrix dimensions and viewport behavior

**Location**: Format Panel → "Matrix Grid"

**Settings**:
- **Grid rows (Risk levels)**: Number of consequence/impact levels (2-10, default: 3)
- **Grid columns (Risk levels)**: Number of likelihood levels (2-10, default: 3)  
- **Enable scrolling**: Allow matrix to exceed viewport with scrolling (default: true)

**Example**: 3×3 = 9 total risk cells, 5×5 = 25 total risk cells

### 2. 🎯 Risk Markers Layout Settings
**Purpose**: Controls how risk markers are positioned within each individual cell

**Location**: Format Panel → "Risk Markers Layout"

**Settings**:
- **Organized positioning**: Enable structured layout within cells (default: true)
- **Positioning mode**: Choose marker arrangement style:
  - `Organized grid`: Markers arrange in neat rows/columns within cell
  - `Random scatter`: Traditional jittered positioning (legacy mode)
  - `Centered`: All markers centered in cell (no jitter)
- **Marker spacing**: Padding between markers in organized mode (0-20px, default: 5px)

## 🔄 How They Work Together

### Matrix Grid (Macro Level)
```
┌───┬───┬───┐
│ 1 │ 2 │ 3 │  ← Grid determines number of cells
├───┼───┼───┤
│ 4 │ 5 │ 6 │  ← Each cell can hold multiple risks
├───┼───┼───┤
│ 7 │ 8 │ 9 │  ← 3×3 grid = 9 total cells
└───┴───┴───┘
```

### Risk Markers Layout (Micro Level)
```
Within cell #5 (medium risk):

Organized Grid:     Random Scatter:     Centered:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ ○ ○ ○       │    │   ○    ○    │    │      ○      │
│ ○ ○ ○       │    │ ○    ○   ○  │    │      ○      │
│ ○ ○         │    │    ○     ○  │    │      ○      │
└─────────────┘    └─────────────┘    └─────────────┘
```

## ✅ Configuration Examples

### Small Risk Portfolio (< 25 risks)
```json
{
  "matrixGrid": {
    "rows": 3,
    "columns": 3,
    "scrolling": true
  },
  "riskMarkersLayout": {
    "mode": "organized",
    "spacing": 8
  }
}
```

### Large Risk Portfolio (100+ risks)  
```json
{
  "matrixGrid": {
    "rows": 7,
    "columns": 7, 
    "scrolling": true
  },
  "riskMarkersLayout": {
    "mode": "organized",
    "spacing": 3
  }
}
```

### Legacy Compatibility
```json
{
  "matrixGrid": {
    "rows": 5,
    "columns": 5,
    "scrolling": false
  },
  "riskMarkersLayout": {
    "mode": "jittered",
    "spacing": 5
  }
}
```

## 🎯 Use Case Guidelines

### When to Adjust Matrix Grid
- **Add more risk levels**: Increase rows/columns for more granular risk assessment
- **Handle large datasets**: Enable scrolling for matrices larger than viewport
- **Compliance requirements**: Match organizational risk matrix standards

### When to Adjust Risk Markers Layout
- **Improve readability**: Use organized mode when cells have many risks
- **Dense visualizations**: Reduce spacing for compact display
- **Legacy reports**: Use random scatter for existing report consistency
- **Presentation mode**: Use centered for clean, minimal appearance

## 🚨 Common Misconceptions

### ❌ Wrong Understanding
- "Matrix Layout controls everything"
- "One setting affects both grid and markers"
- "Organized layout changes matrix dimensions"

### ✅ Correct Understanding
- **Matrix Grid**: Sets overall grid size (3×3, 5×5, etc.)
- **Risk Markers Layout**: Arranges multiple risks within each cell
- **Independent Control**: Each setting serves a different purpose
- **Complementary**: Both work together for optimal visualization

## 🔧 Troubleshooting

### Grid Too Small/Large
**Problem**: Not enough cells or too many empty cells  
**Solution**: Adjust Matrix Grid rows/columns

### Markers Overlapping  
**Problem**: Multiple risks in same cell are hard to distinguish  
**Solution**: Enable organized positioning in Risk Markers Layout

### Visual Too Cramped
**Problem**: Content doesn't fit in viewport  
**Solution**: Enable scrolling in Matrix Grid settings

### Inconsistent with Legacy Reports
**Problem**: New visualization looks different from existing reports  
**Solution**: Set Risk Markers Layout to "Random scatter" mode

## 📋 Migration Path

### From v1.2.0 to v1.3.0
1. **Matrix Grid**: Previous 5×5 matrix automatically becomes Matrix Grid settings
2. **Risk Markers Layout**: Default organized mode improves appearance  
3. **Opt-out**: Choose "Random scatter" for legacy behavior
4. **Enhancement**: Experiment with different grid sizes for better fit

---

**Key Takeaway**: Matrix Grid controls the overall structure, Risk Markers Layout controls marker arrangement within cells. These are separate, complementary settings for maximum flexibility.