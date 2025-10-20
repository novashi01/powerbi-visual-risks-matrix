# Interactive Cell Scrolling - Simplified Implementation

## ✅ Proposal Complete and Validated

**Status**: Ready for approval  
**Change ID**: `add-interactive-cell-scrolling`  
**Validation**: PASSED (strict mode)

---

## Summary

### Problem
The current `enableScrolling` feature renders all markers but clips overflow with SVG clipPath. Users **cannot access** the hidden markers - they're rendered but invisible and unreachable.

### Solution (Simplified)
Add **mouse wheel scrolling** within cells - ~50 lines of inline code, no new files, no classes.

**Key Design Decision**: Keep it simple!
- ✅ Wheel scroll only (no drag - can add later)
- ✅ Vertical only (most common case)
- ✅ Inline logic (no separate class)
- ✅ Closure variables (no global state)
- ✅ Instant scroll (no animation complexity)

---

## Implementation Overview

```typescript
// In renderOrganizedLayout, after rendering markers:
if (enableScrolling && hasOverflow) {
    // 1. Wrap in scroll container
    const scrollContainer = createElementNS("g");
    // Move markers into container
    
    // 2. Calculate bounds
    const contentHeight = calculateContentHeight(markers);
    const maxScroll = Math.min(0, cellHeight - contentHeight);
    
    // 3. Add wheel listener (closure variable)
    let offsetY = 0;
    cellGroup.addEventListener('wheel', (e) => {
        e.preventDefault();
        offsetY = clamp(offsetY - e.deltaY * 0.5, maxScroll, 0);
        scrollContainer.setAttribute('transform', `translate(0, ${offsetY})`);
    });
}
```

**That's it!** ~50 lines total.

---

## Files Changed

### Modified Files
- `src/visual.ts` - add scroll logic (~50 lines)
- `src/settings.ts` - update display name (1 line)

### New Files
- **NONE** ✓

---

## Effort Estimate

- **Implementation**: 2 hours
- **Testing**: 1-2 hours  
- **Documentation**: 30 minutes
- **Total**: ~4 hours (half day)

---

## Requirements Summary

### Core Requirements (5)
1. **Wheel Scroll** - Mouse wheel scrolls markers vertically
2. **Scroll Container** - Markers wrapped in `<g class="scroll-container">`
3. **Bounds Calculation** - Inline calculation prevents over-scroll
4. **Prevent Default** - Stop page scroll when wheeling over cells
5. **Update Setting Name** - Display name reflects interactive capability

### Modified Requirements (1)
- Setting display name: "Enable mouse wheel scrolling for overflow markers"

---

## Testing Plan

### Integration Tests
- Wheel event applies transform ✓
- Scroll clamping at bounds ✓
- No scroll when no overflow ✓
- Toggle off disables feature ✓

### Manual Testing
1. Cell with 20 markers (3×3 grid) → wheel reveals all
2. Scroll to bottom → stops at bounds
3. Cell with 5 markers → no scroll effect
4. Toggle scrolling off → no handlers
5. Data update → scroll resets

---

## Out of Scope (Can add later)

- Drag-to-pan interaction
- Horizontal scrolling
- Visual scroll indicators
- Animated transitions
- State persistence
- ScrollManager class

---

## Next Steps

1. **Get approval** for this proposal
2. **Implement** following tasks.md checklist
3. **Test** thoroughly (unit + manual)
4. **Package** as v1.3.5
5. **Deploy** and gather feedback

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Wheel conflicts with Power BI | Low | Medium | preventDefault only in cells |
| Performance issues | Very Low | Low | Browser-optimized events |
| Code bugs | Low | Low | Simple logic, easy to debug |
| User confusion | Very Low | Low | Clear setting name |

**Overall Risk**: **LOW** ✅

---

## Why This Approach?

**Original proposal**: 500+ lines, new class, complex state management, drag, indicators, etc.  
**User feedback**: "keep simple, not too many functions"  
**Result**: 50 lines, inline code, wheel only - **10x simpler!**

Benefits of simplicity:
- ✅ Faster to implement
- ✅ Easier to maintain
- ✅ Fewer bugs
- ✅ Easy to understand
- ✅ Can enhance later if needed

---

## Approval Needed

Please review and approve this simplified proposal before implementation begins.

**Questions?** See full proposal in `openspec/changes/add-interactive-cell-scrolling/`
