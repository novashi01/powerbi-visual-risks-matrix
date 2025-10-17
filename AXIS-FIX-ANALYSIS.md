# Axis Fix Documentation

## Current Problem

**Expected**:
- X-axis (horizontal) = Likelihood
- Y-axis (vertical) = Consequence

**Current Behavior**:
The axes are correct in the code, but the variable names and comments may be confusing.

## Code Analysis

### Data Mapping (Line 262-270)
```typescript
const LInh = colByRole("likelihoodInh"), CInh = colByRole("consequenceInh");
const LRes = colByRole("likelihoodRes"), CRes = colByRole("consequenceRes");
// ...
rp.lInh = this.clamp(LInh?.values?.[i]); 
rp.cInh = this.clamp(CInh?.values?.[i]);
rp.lRes = this.clamp(LRes?.values?.[i]); 
rp.cRes = this.clamp(CRes?.values?.[i]);
```

This is CORRECT:
- `l` = Likelihood
- `c` = Consequence

### Grid Rendering (Line 167-178)
```typescript
for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
        const L = x + 1;           // L based on x (columns)
        const C = rows - y;        // C based on y (rows)
        const score = L * C;
```

This seems backwards! Let me check if this is the issue...

### toXY Function (Line 316-320)
```typescript
const toXY = (L: number, C: number) => {
    const x = m.l + (L - 1) * cw + cw / 2;  // L maps to x
    const y = m.t + (rows - C) * ch + ch / 2;  // C maps to y
    return { x, y };
};
```

This is CORRECT:
- L (Likelihood) → x (horizontal)
- C (Consequence) → y (vertical)

## THE REAL ISSUE

The problem is that when we call `toXY(L, C)` from the data, we're passing:
- First parameter: `d.lRes` or `d.lInh` (Likelihood)
- Second parameter: `d.cRes` or `d.cInh` (Consequence)

And `toXY` correctly maps:
- First parameter (L/Likelihood) → x-coordinate
- Second parameter (C/Consequence) → y-coordinate

So the code is actually CORRECT!

## What Needs to Change

The confusion is in the COMMENTS and LABELS. The X-axis labels say "Likelihood" and Y-axis labels say "Consequence", which is correct.

BUT - if the user is saying the data is wrong, it means either:
1. The data fields are being swapped in Power BI
2. The labels in capabilities.json are wrong
3. The user's understanding of which field is which is different

## Solution

Check if the user has:
- Likelihood data in the "Inherent Likelihood" field
- Consequence data in the "Inherent Consequence" field

If they have them swapped in Power BI, the visual will show them swapped!
