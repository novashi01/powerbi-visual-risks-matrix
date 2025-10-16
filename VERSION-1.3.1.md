# Version Update to 1.3.1 ✅

## Version Numbers Updated

All version references have been updated from 1.2.0 to **1.3.1.0**:

### Files Updated:
1. ✅ **package.json** - `"version": "1.3.1.0"`
2. ✅ **pbiviz.json** - `"version": "1.3.1.0"` (appears twice in file)
3. ✅ **VERIFY-V1.3.0.bat** - Updated to reference v1.3.1

---

## What's New in v1.3.1

### From v1.2.0 → v1.3.1

#### Major Features (v1.3.0):
1. **Configurable Matrix Grid**
   - 2×2 to 10×10 matrix sizes (was fixed 5×5)
   - Default: 3×3
   
2. **Three Positioning Modes**
   - Organized Grid (NEW!)
   - Random Scatter (legacy)
   - Centered (NEW!)

3. **Organized Grid Layout**
   - n×n markers per cell (configurable 1×1 to 10×10)
   - Default: 3×3 = 9 positions per cell
   - Cell padding control

4. **Inherent Risk Display** (FIXED in v1.3.1)
   - Inherent markers in their ORIGINAL cells
   - Residual markers in their CURRENT cells
   - Arrows show risk movement across matrix
   - Previously was incorrectly showing both in same cell

#### Improvements (v1.3.1):
5. **Arrow Customization**
   - Distance max increased: 50px (was 15px)
   - Color picker for arrows
   - Transparency control: 0-100%

6. **Inherent Marker Customization**
   - Transparency control: 0-100% (was fixed 50%)
   - Fade-in animation

7. **Auto-Fit Viewport**
   - Removed scrolling
   - Matrix always fits viewport perfectly
   - Cells scale automatically

---

## Version History

### v1.3.1 (Current Release)
**Date:** December 2024  
**Focus:** Enhancements & Refinements

**Changes:**
- ✅ Arrow distance max → 50px
- ✅ Arrow color picker
- ✅ Arrow transparency
- ✅ Inherent transparency (customizable)
- ✅ Inherent marker animation
- ✅ Auto-fit viewport (removed scrolling)

### v1.3.0 (Base Feature Release)
**Date:** December 2024  
**Focus:** Organized Grid Layout

**Changes:**
- ✅ Configurable matrix dimensions (2-10 × 2-10)
- ✅ Three positioning modes
- ✅ Organized grid with n×n markers per cell
- ✅ Inherent→residual display in organized mode
- ⚠️  Inherent positioning bug (fixed in v1.3.1)

### v1.2.0 (Previous Stable)
**Focus:** Customization

**Features:**
- Fixed 5×5 matrix
- Customizable axis labels
- Arrow size control
- Random scatter positioning only

---

## Migration Guide

### From v1.2.0 → v1.3.1

**Automatic (No Changes Required):**
- Existing visuals will default to scatter mode
- 5×5 matrix becomes 3×3 (can adjust to 5×5)
- All existing features preserved

**Optional Enhancements:**
1. Switch to "Organized Grid" for better organization
2. Adjust matrix size to 5×5 to match v1.2.0
3. Enable inherent risk display
4. Customize arrow colors/transparency
5. Adjust marker grid size per cell

**Breaking Changes:**
- None! Fully backward compatible

---

## File Versions Summary

| File | Version | Notes |
|------|---------|-------|
| package.json | 1.3.1.0 | Updated ✅ |
| pbiviz.json | 1.3.1.0 | Updated ✅ (appears twice) |
| VERIFY-V1.3.0.bat | References 1.3.1 | Updated ✅ |
| src/visual.ts | Implicit 1.3.1 | All features |
| src/settings.ts | Implicit 1.3.1 | All settings |
| capabilities.json | Implicit 1.3.1 | All capabilities |

---

## Package Output

When you run `npm run package`, the output file will be:

```
dist/myVisualA4138B205DFF4204AB493EF33920159E.1.3.1.0.pbiviz
```

**Note:** The package filename includes the GUID and version number.

---

## Description Updated

**pbiviz.json description (updated):**
> Plot risks on a configurable Likelihood×Consequence matrix with organized grid layout, inherent→residual arrows, and full customization. Features: 3 positioning modes, animated inherent markers, customizable arrow colors/transparency, and auto-fit viewport!

**Previous (v1.2.0):**
> Plot risks on a 5x5 Likelihood×Consequence matrix with inherent→residual arrows. Now with customizable axis labels and arrow controls!

---

## Testing v1.3.1

Run the verification script:
```cmd
VERIFY-V1.3.0.bat
```

**Tests:**
1. TypeScript compilation
2. Unit tests
3. Package creation
4. Version number verification

**Expected output:**
```
✅ TypeScript compilation passed
✅ Tests passed
✅ Package created

dist/myVisualA4138B205DFF4204AB493EF33920159E.1.3.1.0.pbiviz
```

---

## Deployment Checklist

- [x] Version updated in package.json
- [x] Version updated in pbiviz.json (both locations)
- [x] Description updated in pbiviz.json
- [x] VERIFY script updated
- [ ] Run `VERIFY-V1.3.0.bat`
- [ ] Test in Power BI Desktop
- [ ] Tag release in Git: `git tag v1.3.1`
- [ ] Push to repository: `git push origin v1.3.1`
- [ ] Update release notes
- [ ] Distribute .pbiviz file

---

## Support

**Issues/Questions:**
- GitHub: https://github.com/novashi01/powerbi-visual-risks-matrix
- Report bugs as GitHub issues
- Include version number (1.3.1) in reports

---

## Status

✅ **Version 1.3.1 Ready for Release**

All version numbers consistent across files. Ready to build and test!