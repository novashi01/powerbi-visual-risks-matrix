# Risk Matrix Axis Labels Issue

## 🐛 Problem Description

The risk matrix X,Y axis labels (1,2,3,4,5) are not fixed and show incorrect values when there is missing data in the fields.

### Current Behavior ❌
- Axis labels are **dynamically generated** from actual data values
- When data is missing or incomplete, shows wrong numbers or null
- Labels change based on what data is present in the dataset
- Inconsistent axis display across different data scenarios

### Expected Behavior ✅
- Axis labels should **always show 1,2,3,4,5** regardless of data
- X-axis (Likelihood): Always 1,2,3,4,5 from left to right
- Y-axis (Consequence): Always 1,2,3,4,5 from bottom to top  
- Fixed labels provide consistent risk matrix framework

## 🔍 Root Cause Analysis

### Problem Code Location
**File**: `src/visual.ts`  
**Lines**: 163-177 (in `renderGrid` method)

### Issue 1: Dynamic Label Generation
```typescript
// PROBLEMATIC CODE:
let lLabs = ["1","2","3","4","5"] as string[];
let cLabs = ["1","2","3","4","5"] as string[];
const cat = view && view.categorical as DataViewCategorical;
if (cat && cat.categories && cat.categories.length) {
    // This code tries to derive labels from actual data values
    const lVals = (cat.values || []).find(v=>v.source.roles && (v.source.roles as any)["likelihoodRes"])?.values
               || (cat.values || []).find(v=>v.source.roles && (v.source.roles as any)["likelihoodInh"])?.values;
    const cVals = (cat.values || []).find(v=>v.source.roles && (v.source.roles as any)["consequenceRes"])?.values
               || (cat.values || []).find(v=>v.source.roles && (v.source.roles as any)["consequenceInh"])?.values;
    if (lVals) lLabs = uniq(lVals).sort((a,b)=>Number(a)-Number(b)); // ❌ WRONG
    if (cVals) cLabs = uniq(cVals).sort((a,b)=>Number(a)-Number(b)); // ❌ WRONG
    lLabs = lLabs.slice(0,5); cLabs = cLabs.slice(0,5);
}
```

### Issue 2: Data-Dependent Axis Display
- **Problem**: Labels change based on available data values
- **Scenarios that break**:
  - Dataset only has risks with likelihood 2,3,4 → X-axis shows "2,3,4"
  - Dataset missing consequence 1 → Y-axis shows "2,3,4,5"
  - Empty dataset → Shows undefined/null labels
  - Filtered data → Axis changes dynamically

### Issue 3: Inconsistent Risk Framework
- **Risk Matrix Standard**: 5×5 grid with fixed 1-5 scale
- **Current Implementation**: Variable grid based on data
- **Impact**: Users can't rely on consistent risk positioning

## ✅ Solution Implementation

### Fix 1: Force Fixed Axis Labels
```typescript
// FIXED CODE - Always use 1,2,3,4,5:
private renderGrid(vp: IViewport, view?: DataView) {
    // ... grid rendering code ...
    
    // FIXED: Always use static 1-5 labels regardless of data
    const lLabs = ["1", "2", "3", "4", "5"];
    const cLabs = ["1", "2", "3", "4", "5"];
    
    // Remove the dynamic label generation code entirely
    // No more data-dependent label calculation
    
    // Render X-axis labels (Likelihood: 1-5)
    for (let x = 0; x < cols; x++) {
        const tx = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tx.setAttribute("x", String(m.l + (x + 0.5) * cw));
        tx.setAttribute("y", String(vp.height - 8));
        tx.setAttribute("text-anchor", "middle");
        tx.setAttribute("font-size", "10");
        tx.textContent = lLabs[x]; // Always "1", "2", "3", "4", "5"
        this.gGrid.appendChild(tx);
    }
    
    // Render Y-axis labels (Consequence: 5-1 from top to bottom)
    for (let y = 0; y < rows; y++) {
        const ty = document.createElementNS("http://www.w3.org/2000/svg", "text");
        ty.setAttribute("x", "12");
        ty.setAttribute("y", String(m.t + (y + 0.6) * ch));
        ty.setAttribute("text-anchor", "start");
        ty.setAttribute("font-size", "10");
        ty.textContent = cLabs[rows - y - 1]; // Always "5", "4", "3", "2", "1"
        this.gGrid.appendChild(ty);
    }
}
```

### Fix 2: Add Axis Label Configuration
```typescript
// Optional: Add configuration for axis labels in capabilities.json
"axes": {
  "displayName": "Axis Configuration",
  "properties": {
    "showLabels": { 
      "displayName": "Show axis labels", 
      "type": { "bool": true } 
    },
    "labelSize": { 
      "displayName": "Label font size", 
      "type": { "formatting": { "fontSize": true } } 
    }
  }
}
```

### Fix 3: Add Validation Comments
```typescript
// Add clear documentation about fixed axis behavior
/**
 * Renders the 5x5 risk matrix grid with fixed 1-5 axis labels
 * X-axis (Likelihood): Always shows 1,2,3,4,5 from left to right
 * Y-axis (Consequence): Always shows 5,4,3,2,1 from top to bottom
 * Labels are intentionally FIXED regardless of data to maintain
 * consistent risk assessment framework
 */
private renderGrid(vp: IViewport, view?: DataView) {
    // Implementation...
}
```

## 🧪 Test Cases for Validation

### Test Scenario 1: Complete Data
```csv
Risk ID,Likelihood,Consequence
RISK-001,1,1
RISK-002,3,3  
RISK-003,5,5
```
**Expected**: Axis shows 1,2,3,4,5 on both axes ✅

### Test Scenario 2: Partial Data Range
```csv
Risk ID,Likelihood,Consequence
RISK-001,2,2
RISK-002,3,4
```
**Expected**: Axis still shows 1,2,3,4,5 (not just 2,3,4) ✅

### Test Scenario 3: Empty Dataset
```csv
Risk ID,Likelihood,Consequence
(no data)
```
**Expected**: Grid shows with 1,2,3,4,5 labels ✅

### Test Scenario 4: Out-of-Range Data
```csv
Risk ID,Likelihood,Consequence
RISK-001,0,6
RISK-002,7,2
```
**Expected**: Labels still 1,2,3,4,5, data gets clamped to valid positions ✅

## 📋 Implementation Checklist

### Phase 1: Core Fix
- [ ] Remove dynamic label generation code (lines 167-177)
- [ ] Replace with fixed 1-5 labels
- [ ] Test with various data scenarios
- [ ] Verify axis consistency

### Phase 2: Enhanced Implementation  
- [ ] Add axis configuration options
- [ ] Add font size controls
- [ ] Add show/hide axis labels option
- [ ] Update documentation

### Phase 3: Validation
- [ ] Test with empty data
- [ ] Test with partial data ranges
- [ ] Test with out-of-range data
- [ ] Test with filtered data
- [ ] Verify user experience consistency

## 💡 Additional Improvements

### Enhancement 1: Axis Titles
```typescript
// Add axis titles for clarity
const xAxisTitle = "Likelihood";
const yAxisTitle = "Consequence";
```

### Enhancement 2: Grid Line Consistency  
```typescript
// Ensure grid lines always represent 1-5 scale
// regardless of data distribution
```

### Enhancement 3: User Documentation
- Update README with axis behavior explanation
- Add data mapping guidelines
- Clarify that all values are clamped to 1-5 range

## 🎯 Expected Results After Fix

### Before Fix (Current Issues) ❌
- Axis shows: "2,3,4" when data only has those values
- Inconsistent risk positioning framework
- Confusing user experience with changing axes

### After Fix (Expected Behavior) ✅  
- Axis always shows: "1,2,3,4,5"
- Consistent risk matrix framework
- Predictable risk positioning
- Professional, standardized appearance

## 🚀 Priority: HIGH

This issue affects the **fundamental usability** of the risk matrix visual. Users expect a consistent 1-5 risk assessment framework, and dynamic axes break this expectation.

**Recommended Action**: Implement Fix 1 immediately to ensure consistent axis behavior.