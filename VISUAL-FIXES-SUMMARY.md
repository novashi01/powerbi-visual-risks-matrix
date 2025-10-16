# Visual Fixes Summary

## Date
December 2024

## Issues Fixed

### 1. Marker Border Customization
**Problem**: Markers had fixed border color, width, and no transparency control.

**Solution**: Added three new settings to `MarkersCardSettings`:
- `borderColor`: ColorPicker for border color (default: #111111)
- `borderWidth`: NumUpDown for border width (0-5, default: 1)
- `borderTransparency`: NumUpDown for border transparency percentage (0-100%, default: 100%)

**Files Modified**:
- `src/settings.ts`: Added border settings to MarkersCardSettings class
- `src/visual.ts`: 
  - Updated `renderSingleMarker()` to apply border settings
  - Updated `renderMarkerWithArrow()` to apply border settings for scatter/centered modes

**Usage**: Users can now customize marker borders via the "Markers" formatting card in Power BI.

---

### 2. Scrolling for Overflow Markers
**Problem**: When markers in a cell exceeded the n×n grid (e.g., 3×3 = 9 markers), excess markers were hidden with no way to view them.

**Solution**: Added scrolling/overflow handling feature:
- Added `enableScrolling` toggle setting (default: true)
- When enabled: All markers are positioned in grid, overflow markers extend beyond visible grid
- When disabled: Shows only first n×n markers and displays "+X" indicator for overflow count

**Files Modified**:
- `src/settings.ts`: Added `enableScrolling` toggle to RiskMarkersLayoutCardSettings
- `src/visual.ts`:
  - Updated `organizeMarkersInCell()` to mark overflow markers
  - Updated `renderOrganizedLayout()` to:
    - Skip rendering overflow markers when scrolling disabled
    - Add "+X" text indicator showing count of hidden markers
    - Position indicator next to last visible marker

**Usage**: 
- Enable "Enable scrolling when markers exceed grid" in "Risk Markers Layout" settings
- When disabled, a red "+X" text shows how many markers are hidden
- Increase "Marker rows" and "Marker columns" to show more markers per cell

---

### 3. Animation Sequence Order
**Problem**: Animation showed all elements (inherent, arrows, residual) simultaneously.

**Solution**: Implemented sequential animation timing:
1. **Inherent markers** appear FIRST (delay: 10ms)
2. **Arrows** appear SECOND (delay: animationDuration ms)
3. **Residual markers** appear LAST (delay: animationDuration × 2 ms)

**Files Modified**:
- `src/visual.ts`:
  - `renderSingleMarker()`: 
    - Inherent markers: 10ms delay
    - Residual markers: animationDuration × 2 delay
    - Labels: Same timing as residual markers
  - `renderOrganizedLayout()`: 
    - Arrows: animationDuration delay (between inherent and residual)

**Usage**: Enable "Enable animation" in "Animation" settings. The visual will now show:
1. Inherent risk positions fade in first
2. Movement arrows fade in next
3. Residual risk positions fade in last

---

## Technical Details

### Animation Timing Breakdown
```javascript
// Inherent markers
setTimeout(() => { element.setAttribute("opacity", "1"); }, 10);

// Arrows (in organized mode)
setTimeout(() => { element.setAttribute("opacity", "1"); }, animationDuration);

// Residual markers & labels
setTimeout(() => { element.setAttribute("opacity", "1"); }, animationDuration * 2);
```

### Border Settings Application
```javascript
const borderColor = this.formattingSettings.markersCard.borderColor.value.value || "#111111";
const borderWidth = this.formattingSettings.markersCard.borderWidth.value ?? 1;
const borderTransparency = this.formattingSettings.markersCard.borderTransparency.value ?? 100;
const borderOpacity = borderTransparency / 100;

circle.setAttribute("stroke", borderColor);
circle.setAttribute("stroke-width", String(borderWidth));
circle.setAttribute("stroke-opacity", String(borderOpacity));
```

### Overflow Marker Handling
```javascript
// Mark overflow markers during organization
organized.push({
    ...marker,
    organizedX: x,
    organizedY: y,
    isOverflow: index >= maxMarkers
});

// Skip rendering if scrolling disabled and marker is overflow
if (!enableScrolling && marker.isOverflow) return;

// Show overflow count
if (!enableScrolling && overflowCount > 0) {
    text.textContent = `+${overflowCount}`;
}
```

---

## Testing Recommendations

### 1. Border Customization
- Change border color to various colors
- Adjust border width from 0 to 5
- Test border transparency at different percentages
- Verify borders appear on both inherent and residual markers
- Test in all layout modes (organized, scatter, centered)

### 2. Scrolling Feature
- Create dataset with >9 risks in a single cell (for 3×3 grid)
- Toggle "Enable scrolling" on/off
- When off, verify "+X" indicator appears
- Increase marker rows/columns to verify more markers show
- Test with different cell sizes

### 3. Animation Sequence
- Enable animation
- Verify sequence: inherent → arrows → residual
- Adjust animation duration to see timing changes
- Test with and without inherent risks displayed
- Test in organized mode (with arrows) vs other modes

---

## Backward Compatibility

All changes are backward compatible:
- New settings have sensible defaults
- Existing visualizations will work without changes
- No breaking changes to data structure or capabilities

---

## Known Limitations

### Scrolling Feature
- Current implementation shows overflow indicators but doesn't provide interactive scrolling
- True scrolling (pan/zoom within cells) would require more complex viewport management
- Consider future enhancement: clickable "+X" to show list of hidden markers

### Animation
- Animation timing is relative to duration setting
- Very short durations (<300ms) may make sequence hard to observe
- Animation only works in organized mode for full sequence
- Scatter/centered modes don't have separate arrow animation

---

## Future Enhancements

1. **Interactive Scrolling**: Click on overflow indicator to see hidden markers in tooltip/panel
2. **Animation Easing**: Add different easing options (ease-in, ease-out, bounce, etc.)
3. **Border Patterns**: Add dashed/dotted border styles
4. **Per-Cell Overflow Counts**: Show individual counts for each overflowing cell
5. **Staggered Animation**: Add slight delay between individual markers for cascade effect

---

## Files Changed Summary

- `src/settings.ts`: Added 4 new settings (borderColor, borderWidth, borderTransparency, enableScrolling)
- `src/visual.ts`: Modified 3 methods (renderSingleMarker, renderOrganizedLayout, renderMarkerWithArrow)

Total lines added: ~80
Total lines modified: ~60
No files deleted
No breaking changes
