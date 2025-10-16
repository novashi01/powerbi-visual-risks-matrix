# Release Notes - v1.3.1

## 🎉 What's New in v1.3.1

### Enhanced Arrow Customization
- **Arrow Distance**: Now adjustable up to 50px (previously limited to 15px)
- **Arrow Color**: Choose any color to match your report theme
- **Arrow Transparency**: Control opacity from 0-100% for subtle or prominent arrows

### Improved Inherent Risk Display
- **Configurable Transparency**: Adjust inherent marker opacity (0-100%, default 50%)
- **Smooth Animation**: Inherent markers fade in elegantly
- **Correct Positioning**: Inherent markers appear in their ORIGINAL risk cells, residual markers in CURRENT cells
- **Visual Risk Journey**: Arrows clearly show risk movement across the matrix

### Better Viewport Handling
- **Auto-Fit Layout**: Matrix automatically scales to fill available space
- **No Scrolling**: Removed scroll bars for cleaner presentation
- **Responsive**: Adapts to any report size seamlessly

---

## 🚀 Major Features from v1.3.0

### Configurable Matrix Grid
- Adjust matrix from 2×2 to 10×10 (default: 3×3)
- Perfect for any risk portfolio size
- Previously fixed at 5×5

### Three Positioning Modes
1. **Organized Grid** ⭐ NEW
   - Neat rows and columns within each cell
   - Configurable marker grid (1×1 to 10×10 per cell)
   - Cell padding control
   
2. **Random Scatter** (Legacy)
   - Traditional jittered positioning
   - Backward compatible

3. **Centered** ⭐ NEW
   - Clean, minimal centered positioning

### Inherent → Residual Visualization
- Show both inherent and residual risk markers
- Animated arrows connecting them
- See the impact of risk treatments at a glance
- Toggle on/off as needed

---

## 📦 Installation

1. Download `myVisualA4138B205DFF4204AB493EF33920159E.1.3.1.0.pbiviz`
2. In Power BI Desktop: Insert → More visuals → Import a visual from a file
3. Select the downloaded .pbiviz file
4. The visual appears in the Visualizations pane

---

## ⚙️ New Settings

### Arrows Panel
- **Show Arrows**: Toggle arrows on/off
- **Arrow Size**: 4-20px
- **Distance from Markers**: 2-50px ✨ NEW MAX
- **Arrow Color**: Color picker ✨ NEW
- **Arrow Transparency**: 0-100% ✨ NEW

### Matrix Grid Panel
- **Matrix Rows**: 2-10 (default: 3)
- **Matrix Columns**: 2-10 (default: 3)
- ~~Enable Scrolling~~ ✨ REMOVED (auto-fits viewport)

### Risk Markers Layout Panel
- **Positioning Mode**: Organized Grid / Random Scatter / Centered
- **Marker Rows (per cell)**: 1-10 (default: 3)
- **Marker Columns (per cell)**: 1-10 (default: 3)
- **Cell Padding**: 0-20px
- **Show Inherent Risks**: Toggle inherent markers
- **Inherent Transparency**: 0-100% ✨ NEW (default: 50%)
- **Show Arrows in Organized Mode**: Toggle arrows

---

## 🔧 Fixes

### v1.3.1 Fixes
- ✅ Inherent markers now appear in their correct original cells
- ✅ Arrows now span across matrix cells (not just small offsets)
- ✅ Viewport auto-fit eliminates unwanted scrollbars

### Known Issues
- None reported

---

## 💡 Usage Tips

### For Dense Portfolios
- Use 5×5 or larger matrix
- Set marker grid to 3×3 or 4×4
- Enable organized grid mode
- Adjust cell padding for optimal spacing

### For Executive Presentations
- Enable animations for dynamic entrance
- Use theme-matching arrow colors
- Set arrow transparency to 70-80% for subtlety
- Show inherent→residual journey

### For Printing/Export
- Use solid colors (100% opacity)
- Centered or organized mode works best
- Disable animations
- Consider black arrows (#000000)

### For Detailed Analysis
- Random scatter shows all risks
- Increase arrow distance to 30-50px
- Use tooltips for details
- Label key risks

---

## 📊 Example Scenarios

### Scenario 1: Risk Treatment Progress
```
Settings:
- Matrix: 5×5
- Mode: Organized Grid
- Show Inherent: ON
- Arrows: ON, Green (#00AA00), 80% opacity
- Inherent Transparency: 40%

Result: Clear visualization of how many risks moved from high to low
```

### Scenario 2: Current Risk Portfolio
```
Settings:
- Matrix: 3×3
- Mode: Centered
- Show Inherent: OFF
- Labels: ON

Result: Clean snapshot of current risk state
```

### Scenario 3: Detailed Risk Analysis
```
Settings:
- Matrix: 7×7
- Mode: Random Scatter
- Show Inherent: ON
- Arrows: ON, Red (#FF0000), 50% opacity
- Arrow Distance: 50px

Result: All risks visible with clear inherent→residual paths
```

---

## 🔄 Upgrading from v1.2.0

### Automatic Changes
- Matrix size becomes 3×3 (was 5×5)
- Positioning defaults to Organized Grid (was Scatter)
- Scrolling removed (auto-fit enabled)

### To Restore v1.2.0 Behavior
1. Change Matrix Rows/Columns to 5×5
2. Change Positioning Mode to "Random Scatter"
3. Your visual will look identical to v1.2.0

### Recommended Upgrade Path
1. Install v1.3.1
2. Keep scatter mode initially
3. Test organized grid mode
4. Adjust matrix size as needed
5. Experiment with arrow colors
6. Enable inherent display for insights

---

## 📈 Performance

- **Tested**: Up to 1000 risks
- **Smooth**: Animations use GPU acceleration
- **Fast**: Rendering < 500ms for typical portfolios
- **Efficient**: Auto-fit improves performance vs scrolling

---

## 🆘 Troubleshooting

**Issue**: Markers too crowded in cells  
**Solution**: Increase marker grid size or cell padding

**Issue**: Arrows not visible  
**Solution**: Check "Show Arrows" is ON, increase arrow transparency

**Issue**: Inherent markers not showing  
**Solution**: Verify "Show Inherent Risks" is ON, check transparency isn't 0%

**Issue**: Matrix too small  
**Solution**: Adjust Matrix Rows/Columns, ensure viewport has space

---

## 📝 Backward Compatibility

✅ **Fully Compatible** with v1.2.0 reports
- No data model changes required
- All existing features preserved
- Settings migrate automatically with sensible defaults

---

## 🎯 Next Steps

After installation:
1. ✅ Test with your data
2. ✅ Explore organized grid mode
3. ✅ Customize arrow colors for your theme
4. ✅ Enable inherent display to show risk treatments
5. ✅ Share feedback!

---

## 📞 Support

- **Documentation**: See project README.md
- **Issues**: https://github.com/novashi01/powerbi-visual-risks-matrix/issues
- **Version**: 1.3.1

---

**Released**: December 2024  
**License**: MIT  
**Tested**: Power BI Desktop (latest)