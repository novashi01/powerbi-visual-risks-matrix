# Axis Orientation - Current vs Expected

## Current Implementation ✅ CORRECT

**X-Axis (Horizontal)** = Likelihood
- Bottom of the chart
- Labels: xLabel1 through xLabel5
- Data field: "Inherent Likelihood" / "Residual Likelihood"
- Variable: `L` in code

**Y-Axis (Vertical)** = Consequence  
- Left side of the chart
- Labels: yLabel1 through yLabel5
- Data field: "Inherent Consequence" / "Residual Consequence"
- Variable: `C` in code

## Visual Layout

```
       Consequence (Y-axis)
           ↑
         5 |  [cells]
         4 |  [cells]
         3 |  [cells]
         2 |  [cells]
         1 |  [cells]
           └──────────────→ Likelihood (X-axis)
              1  2  3  4  5
```

## If User Says It's Wrong

### Possibility 1: Data Fields Swapped in Power BI
Check if the user has:
- Likelihood data in the "Inherent **Consequence**" field ❌
- Consequence data in the "Inherent **Likelihood**" field ❌

**Solution**: Tell user to swap the fields in Power BI

### Possibility 2: User Expects Different Orientation
Some risk matrices show:
- X-axis = Consequence (horizontal)
- Y-axis = Likelihood (vertical)

This is a different standard!

**Solution**: Swap the fields in the code

### Possibility 3: Confusion About Field Names
The field names in Power BI Desktop show as:
- "Inherent Likelihood"
- "Inherent Consequence"  
- "Residual Likelihood"
- "Residual Consequence"

**Solution**: Add axis title labels to clarify

## Recommendation

Add axis title text to make it obvious:
- Add "Likelihood →" at bottom
- Add "Consequence ↑" on left side

This will make it clear to users what each axis represents.
