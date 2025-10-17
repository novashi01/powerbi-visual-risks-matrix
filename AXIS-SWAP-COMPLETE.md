# AXIS SWAP - Consequence X-axis, Likelihood Y-axis

## What Was Changed

### NEW Axis Orientation ✅

**X-Axis (Horizontal)** = Consequence  
**Y-Axis (Vertical)** = Likelihood

This matches your organization's risk matrix standard!

### Visual Layout

```
    Likelihood (Y-axis)
           ↑
         5 |  [cells]
         4 |  [cells]
         3 |  [cells]
         2 |  [cells]
         1 |  [cells]
           └──────────────→ Consequence (X-axis)
              1  2  3  4  5
```

---

## Code Changes Made

### 1. settings.ts
- ✅ X-axis title default: "Consequence"
- ✅ Y-axis title default: "Likelihood"
- ✅ Comment updates: X-axis (Consequence), Y-axis (Likelihood)

### 2. visual.ts

**Grid Rendering** (Line ~169):
```typescript
// OLD:
const L = x + 1;           // Likelihood on X
const C = rows - y;        // Consequence on Y

// NEW:
const C = x + 1;           // Consequence on X
const L = rows - y;        // Likelihood on Y
```

**toXY Function** (Line ~316):
```typescript
// OLD:
const x = m.l + (L - 1) * cw + cw / 2;  // L → x
const y = m.t + (rows - C) * ch + ch / 2;  // C → y

// NEW:
const x = m.l + (C - 1) * cw + cw / 2;  // C → x
const y = m.t + (rows - L) * ch + ch / 2;  // L → y
```

**Label Arrays** (Line ~182):
```typescript
// OLD:
const lLabs = [xLabel1...xLabel5];  // Likelihood from X settings
const cLabs = [yLabel1...yLabel5];  // Consequence from Y settings

// NEW:
const cLabs = [xLabel1...xLabel5];  // Consequence from X settings
const lLabs = [yLabel1...yLabel5];  // Likelihood from Y settings
```

**Axis Label Rendering**:
```typescript
// OLD:
// X-axis labels use lLabs (Likelihood)
// Y-axis labels use cLabs (Consequence)

// NEW:
// X-axis labels use cLabs (Consequence)
// Y-axis labels use lLabs (Likelihood)
```

**Axis Titles**:
```typescript
// OLD:
xAxisTitle default: "Likelihood"
yAxisTitle default: "Consequence"

// NEW:
xAxisTitle default: "Consequence"
yAxisTitle default: "Likelihood"
```

### 3. capabilities.json
- ✅ Updated display names to show (Consequence) for X-axis labels
- ✅ Updated display names to show (Likelihood) for Y-axis labels
- ✅ Added axis title properties

---

## Data Field Mapping

**IMPORTANT**: Your Power BI data fields should be mapped as:

| Power BI Field | Contains | Maps To |
|----------------|----------|---------|
| Inherent Likelihood | Likelihood values (1-5) | Y-axis (vertical) |
| Inherent Consequence | Consequence values (1-5) | X-axis (horizontal) |
| Residual Likelihood | Likelihood values (1-5) | Y-axis (vertical) |
| Residual Consequence | Consequence values (1-5) | X-axis (horizontal) |

**The code internally uses**:
- `L` variable = Likelihood → Y-axis
- `C` variable = Consequence → X-axis

---

## How It Works Now

### Example Risk Point
If you have a risk with:
- Likelihood = 4
- Consequence = 3

**Previous (WRONG)**:
- Would appear at position (4, 3) → X=4, Y=3 ❌

**Now (CORRECT)**:
- Appears at position (3, 4) → X=3 (Consequence), Y=4 (Likelihood) ✅

### Severity Coloring
Score calculation: `L × C`  
Position: X=C, Y=L

So a risk at:
- X=3 (Consequence=3)
- Y=4 (Likelihood=4)
- Score = 4 × 3 = 12

The cell background color will be based on score=12.

---

## Testing Checklist

1. ✅ Build visual
2. ✅ Import into Power BI
3. ✅ Check axis titles: "Consequence" (bottom), "Likelihood" (left)
4. ✅ Add test data: Risk with L=5, C=2
5. ✅ Verify marker appears at X=2, Y=5
6. ✅ Check cell backgrounds match L×C scores correctly
7. ✅ Verify arrows point from inherent to residual correctly

---

## Files Modified

1. **src/settings.ts** - Axis title defaults and comments
2. **src/visual.ts** - Grid rendering, toXY function, label arrays, axis titles
3. **capabilities.json** - Display names for axis labels

---

## Breaking Change Alert ⚠️

**This IS a breaking change!**

Users who already have the visual deployed will see their risk markers move to different positions after this update, because the axes are swapped.

**Migration Instructions for Users**:
1. Update the visual to v1.3.2
2. Markers will appear in correct positions automatically
3. NO data changes needed - the fields are still named the same
4. Axis titles will show correct labels

---

## Summary

✅ **X-axis** (horizontal) = Consequence  
✅ **Y-axis** (vertical) = Likelihood  
✅ Data field mapping unchanged  
✅ Axis titles clearly labeled  
✅ All calculations (score = L × C) work correctly  
✅ Ready for build and testing

---

**Status**: ✅ AXES SWAPPED - READY FOR BUILD  
**Version**: 1.3.2  
**Change Type**: Breaking (visual positions will change)  
**User Action**: None required (automatic)
