# Axis Labels Added - v1.3.2

## What Was Added

### Axis Title Labels
The visual now shows clear axis titles to indicate which axis is which:

**X-Axis Title** (bottom, horizontal): "Likelihood" (default)  
**Y-Axis Title** (left, vertical): "Consequence" (default)

### New Settings

In "Axis Labels" section:
1. **Show axis titles** (toggle) - Default: ON
2. **X-axis title** (text) - Default: "Likelihood"
3. **Y-axis title** (text) - Default: "Consequence"

### Visual Appearance

```
  C
  o       ┌──────────────┐
  n     5 |              |
  s     4 |    MATRIX    |
  e     3 |     GRID     |
  q     2 |              |
  u     1 |              |
  e       └──────────────┘
  n          1  2  3  4  5
  c       
  e          Likelihood
```

---

## Current Axis Mapping ✅ CORRECT

**X-Axis (Horizontal)** = Likelihood
- Data field: "Inherent Likelihood" / "Residual Likelihood"
- Appears at bottom of matrix
- Now labeled: "Likelihood"

**Y-Axis (Vertical)** = Consequence
- Data field: "Inherent Consequence" / "Residual Consequence"
- Appears on left side of matrix
- Now labeled: "Consequence"

---

## If User Says Axes Are Wrong

### Check 1: Data Fields in Power BI
Verify the user has mapped data correctly in Power BI Desktop:

**Correct Mapping**:
- "Inherent Likelihood" field → Should contain Likelihood values (1-5)
- "Inherent Consequence" field → Should contain Consequence values (1-5)
- "Residual Likelihood" field → Should contain Likelihood values (1-5)
- "Residual Consequence" field → Should contain Consequence values (1-5)

**Incorrect Mapping** (swapped):
- If Likelihood data is in Consequence field ❌
- If Consequence data is in Likelihood field ❌
- **Solution**: Swap the fields in Power BI

### Check 2: Different Standards
Some organizations use:
- X-axis = Consequence (horizontal)
- Y-axis = Likelihood (vertical)

This is the OPPOSITE of our implementation!

**If this is the case**, the user needs to:
1. Change axis titles: X-axis title = "Consequence", Y-axis title = "Likelihood"
2. Swap their data fields in Power BI

---

## How to Customize

Users can change the axis titles to match their organization's terminology:

**Example 1: Probability/Impact**
- X-axis title: "Probability"
- Y-axis title: "Impact"

**Example 2: Different Language**
- X-axis title: "Probabilité"
- Y-axis title: "Conséquence"

**Example 3: Swapped Axes** (if organization uses different standard)
- X-axis title: "Consequence"
- Y-axis title: "Likelihood"
- AND swap the data fields in Power BI

---

## Code Changes

### settings.ts
- Added `xAxisTitle` setting (default: "Likelihood")
- Added `yAxisTitle` setting (default: "Consequence")
- Added `showAxisTitles` toggle (default: true)

### visual.ts
- Renders X-axis title at bottom center
- Renders Y-axis title on left side (rotated 90°)
- Titles are bold and slightly larger than axis labels
- Titles only show when toggle is ON

---

## Benefits

1. ✅ **Clarity**: Users immediately see which axis is which
2. ✅ **Customizable**: Can change titles to match organization standards
3. ✅ **Multilingual**: Support for different languages
4. ✅ **Flexibility**: Can hide titles if not needed
5. ✅ **Professional**: Makes the visual self-documenting

---

## Testing

1. Build visual
2. Import into Power BI
3. Check axis titles appear: "Likelihood" (bottom) and "Consequence" (left)
4. Try changing titles in settings
5. Try toggling "Show axis titles" OFF/ON
6. Verify titles are bold and centered

---

## Files Modified

- **src/settings.ts**: Added 3 new axis title settings
- **src/visual.ts**: Added axis title rendering code

---

**Status**: ✅ READY FOR BUILD  
**Version**: 1.3.2  
**Feature**: Axis titles for clarity
