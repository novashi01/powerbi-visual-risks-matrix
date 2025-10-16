# Release Notes - Version 1.3.2

**Release Date**: December 2024  
**Version**: 1.3.2.0

---

## 🎉 What's New

Version 1.3.2 brings three major visual enhancements that give you more control over marker appearance, better handling of crowded cells, and improved animation sequencing.

---

## ✨ New Features

### 1. Customizable Marker Borders

You now have complete control over marker borders!

**New Settings** (in Markers card):
- **Border Color**: Choose any color for marker borders (default: #111111)
- **Border Width**: Adjust border thickness from 0 to 5 pixels (default: 1)
- **Border Transparency**: Control border opacity from 0% (invisible) to 100% (fully opaque)

**Benefits**:
- Make markers stand out against similar background colors
- Create subtle or bold marker styles
- Match your organization's color scheme
- Improve readability on projected screens

**Example Use Cases**:
- Use thick white borders for dark-themed reports
- Set thin gray borders for subtle, professional look
- Use transparent borders for minimalist designs
- Match border colors to your corporate branding

---

### 2. Smart Overflow Handling

Never lose track of risks in crowded cells!

**New Setting** (in Risk Markers Layout card):
- **Enable scrolling when markers exceed grid**: Toggle to show/hide overflow markers

**How It Works**:
- **When Enabled** (default): All markers are positioned in the grid, even if they extend beyond the n×n grid capacity
- **When Disabled**: Shows only the first n×n markers and displays a red **"+X"** indicator showing how many markers are hidden

**Benefits**:
- Know exactly how many risks are in overcrowded cells
- Choose between seeing all markers or keeping clean grid boundaries
- Visual indicator helps identify cells that need attention
- Increase marker grid size to accommodate more markers

**Example**:
- 3×3 grid (9 marker capacity) with 15 risks in one cell
- With scrolling disabled: Shows 9 markers plus "+6" in red
- With scrolling enabled: All 15 markers are displayed

---

### 3. Sequential Animation

Animations now tell the story of risk movement!

**New Animation Sequence**:
1. **Inherent markers** fade in FIRST (original risk positions)
2. **Arrows** fade in SECOND (showing movement direction)
3. **Residual markers** fade in LAST (current risk positions)

**Benefits**:
- Clear visual narrative of risk mitigation
- Easier to understand risk movement patterns
- More engaging presentations
- Highlights the effectiveness of risk treatments

**Animation Timing**:
- Inherent markers: Immediate (10ms)
- Arrows: After inherent markers (duration delay)
- Residual markers: After arrows (2× duration delay)

**How to Use**:
- Enable "Enable animation" in Animation settings
- Adjust "Duration (ms)" to control animation speed
- Shorter duration (300ms) = quick, snappy
- Longer duration (1500ms) = slow, dramatic

---

## 🔧 Settings Reference

### Markers Card
```
├─ Marker size: 6 (default)
├─ Marker color override: (optional)
├─ Border color: #111111 (NEW)
├─ Border width: 1 (NEW, 0-5)
└─ Border transparency: 100% (NEW, 0-100%)
```

### Risk Markers Layout Card
```
├─ Positioning mode: Organized Grid
├─ Marker rows (per cell): 3
├─ Marker columns (per cell): 3
├─ Cell padding: 5
├─ Enable scrolling when markers exceed grid: true (NEW)
├─ Show inherent risks: true
├─ Inherent transparency: 50%
└─ Show arrows in organized mode: true
```

### Animation Card
```
├─ Enable animation: true
└─ Duration (ms): 800
```

---

## 📋 Usage Examples

### Example 1: Professional Corporate Style
```
Markers:
- Border color: #333333 (dark gray)
- Border width: 1
- Border transparency: 100%

Result: Clean, subtle borders perfect for executive dashboards
```

### Example 2: High Contrast Presentation
```
Markers:
- Border color: #FFFFFF (white)
- Border width: 3
- Border transparency: 100%

Result: Bold, easy-to-see markers for large screen presentations
```

### Example 3: Minimalist Design
```
Markers:
- Border color: #CCCCCC (light gray)
- Border width: 1
- Border transparency: 30%

Result: Barely-there borders for clean, modern look
```

### Example 4: Managing Crowded Cells
```
Risk Markers Layout:
- Marker rows: 4
- Marker columns: 4
- Enable scrolling: false

With 20 risks in one cell:
- Shows 16 markers (4×4)
- Displays "+4" indicator in red
- Increase grid to 5×5 to show all 20
```

### Example 5: Engaging Presentation
```
Animation:
- Enable animation: true
- Duration: 1000ms

Results in:
- Inherent markers fade in at 10ms
- Arrows fade in at 1000ms
- Residual markers fade in at 2000ms
- Total presentation time: ~2 seconds
```

---

## 🐛 Bug Fixes

- Fixed marker borders not applying custom settings in scatter/centered modes
- Improved overflow marker positioning accuracy
- Corrected animation timing conflicts

---

## 🔄 Improvements

- Unified border rendering across all layout modes
- Optimized marker rendering performance
- Enhanced animation smoothness
- Better visual feedback for overflow conditions

---

## 📦 Installation

1. Download `risksMatrix.1.3.2.0.pbiviz` from the release
2. Open Power BI Desktop
3. Click Insert → More visuals → Import a visual from a file
4. Select the downloaded `.pbiviz` file
5. Click Import

---

## 🔄 Upgrading from v1.3.1

**Breaking Changes**: None! All changes are backward compatible.

**What Happens**:
- Existing visuals will use default border settings (#111111, width 1, 100% opacity)
- Scrolling will be enabled by default (existing behavior maintained)
- Animation sequence will automatically improve (no action needed)

**Recommended Actions**:
1. Review marker border settings - customize if needed
2. Check cells with many markers - adjust grid size or enable/disable scrolling
3. Enable animation to see the new sequential effect

---

## 🧪 Testing Checklist

Before deploying to production, test these scenarios:

### Border Customization
- [ ] Change border color to various colors
- [ ] Adjust border width (0, 1, 3, 5)
- [ ] Test border transparency at 0%, 50%, 100%
- [ ] Verify borders appear on both inherent and residual markers
- [ ] Test in all layout modes (organized, scatter, centered)

### Overflow Handling
- [ ] Create a cell with >9 risks (for 3×3 grid)
- [ ] Toggle "Enable scrolling" on/off
- [ ] Verify "+X" indicator appears when scrolling is off
- [ ] Increase marker rows/columns to show more markers
- [ ] Test with different matrix sizes (3×3, 5×5, etc.)

### Animation Sequence
- [ ] Enable animation
- [ ] Verify sequence: inherent → arrows → residual
- [ ] Test with different animation durations (300ms, 800ms, 1500ms)
- [ ] Test with and without inherent risks displayed
- [ ] Test in organized mode vs scatter/centered modes

### General
- [ ] Verify existing reports still work
- [ ] Check performance with large datasets (>100 risks)
- [ ] Test on different screen sizes
- [ ] Verify tooltips still work
- [ ] Test selection/highlighting functionality

---

## 📊 Performance

- **Marker Rendering**: Optimized, no performance impact
- **Animation**: Smooth transitions with CSS hardware acceleration
- **Overflow Handling**: Minimal overhead, efficient counting

---

## 🔗 Links

- **GitHub Repository**: https://github.com/novashi01/powerbi-visual-risks-matrix
- **Issues**: https://github.com/novashi01/powerbi-visual-risks-matrix/issues
- **Documentation**: See QUICK-DEV-MENU.md and DEV-CONTEXT-MENU.md

---

## 🆘 Troubleshooting

### Borders not visible
- Check border color isn't same as marker color
- Verify border transparency isn't 0%
- Ensure border width > 0

### "+X" indicator not showing
- Enable "Enable scrolling when markers exceed grid" must be OFF
- Cell must have more markers than grid capacity
- Try reducing marker rows/columns to force overflow

### Animation not working
- Enable "Enable animation" in Animation settings
- Check animation duration isn't 0
- Verify browser supports CSS transitions
- Test in Power BI Desktop (not all browsers in Power BI Service support animations)

### Markers overlapping
- Increase "Marker rows" and "Marker columns"
- Reduce "Marker size"
- Increase "Cell padding"
- Consider using larger matrix size

---

## 👥 Credits

Developed by the Power BI Visuals team with feedback from the risk management community.

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🎯 What's Next?

Future enhancements under consideration:
- Interactive overflow viewer (click "+X" to see list)
- More animation easing options
- Dashed/dotted border patterns
- Per-cell overflow count display
- Staggered marker animation (cascade effect)

Stay tuned for v1.4.0!

---

**Version**: 1.3.2.0  
**Released**: December 2024  
**Stability**: Stable  
**Recommended**: Yes
