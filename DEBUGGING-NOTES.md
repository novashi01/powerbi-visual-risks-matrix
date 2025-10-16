# DEBUGGING NOTES - Issues Found

## Issue #1: Border Settings
The code looks correct but might not be applying. Need to check if:
1. Settings are being saved properly in Power BI
2. Console shows any errors
3. The value is actually being read

**Debug Code to Add**:
```typescript
console.log("Border Color:", borderColor);
console.log("Border Width:", borderWidth);
console.log("Border Opacity:", borderOpacity);
```

## Issue #2: Scrolling Implementation Problems

### Current Issues:
1. **maxScroll calculation is wrong** - uses `cellBounds.height / markerRows` which doesn't account for actual content height
2. **Wheel event is on wrong element** - cellRect is added to gGrid, not part of the scrollable group
3. **Transform updates don't trigger re-render** - setAttribute might not work for dynamic updates

### Simpler Solution Needed:
Instead of complex wheel events, use:
1. Simple clipPath to hide overflow
2. Show scroll hint (arrow or text) when markers exceed n×n
3. Or just disable scrolling feature entirely and use "+X" indicator

### Recommended Fix:
Remove scrolling wheel events entirely, just use clipPath to enforce boundaries when setting is ON.

**Behavior**:
- **Scrolling OFF**: Show n×n markers + "+X" indicator
- **Scrolling ON**: Show ALL markers with original spacing, clipPath hides overflow (no mouse interaction)

This is simpler and won't have bugs.
