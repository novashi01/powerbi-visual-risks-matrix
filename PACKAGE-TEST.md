# Power BI Visual Package Test Guide

## Quick Package Test Commands

Run these commands to test packaging readiness:

```powershell
# Navigate to your visual directory
cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

# 1. Test TypeScript compilation (dry run)
npx tsc --noEmit
# Expected: No compilation errors

# 2. Run linting check  
npm run lint
# Expected: No linting errors

# 3. Run full test suite
npm test  
# Expected: All 60+ tests pass

# 4. Package the visual
npm run package
# Expected: Creates .pbiviz file in dist folder
```

## Packaging Validation Checklist

After running `npm run package`, verify:

### ✅ Package Created Successfully
- [ ] No compilation errors during build
- [ ] `.pbiviz` file created in `dist/` folder  
- [ ] File size reasonable (typically 1-5MB)
- [ ] Filename: `risksMatrix_1.0.0.0.pbiviz`

### ✅ Test Import in Power BI Desktop
1. Open Power BI Desktop
2. Go to Visualizations pane
3. Click "..." → "Get more visuals" → "Import from file"
4. Select the generated `.pbiviz` file
5. Verify visual appears in visualizations pane

### ✅ Basic Functionality Test
Create a simple dataset:

| Risk ID | Inherent L | Inherent C | Residual L | Residual C | Category |
|---------|------------|------------|------------|------------|-----------|
| RISK-001| 3          | 4          | 2          | 3          | Operational|
| RISK-002| 5          | 5          | 4          | 4          | Financial  |
| RISK-003| 2          | 2          | 1          | 2          | Technical  |

Expected behavior:
- [ ] 5x5 grid displays with color bands
- [ ] Risk points appear at correct positions  
- [ ] Arrows show inherent → residual movement
- [ ] Tooltips show on hover
- [ ] Selection works (click on points)

## Troubleshooting

### If packaging fails:
1. Check PowerBI CLI is installed: `pbiviz --version`
2. Install if missing: `npm install -g powerbi-visuals-tools`
3. Clear build cache: Delete `.tmp` and `dist` folders
4. Retry: `npm run package`

### If import fails in Power BI:
1. Check file isn't corrupted (file size >0)
2. Ensure Power BI Desktop is updated
3. Try importing in different Power BI instance
4. Check Windows Defender hasn't blocked the file

### If visual doesn't render:
1. Check browser console (F12) for errors
2. Verify data is mapped correctly to visual fields
3. Test with minimal dataset first
4. Check data types match capabilities.json

## Expected Package Contents

The `.pbiviz` file should contain:
- Compiled visual code (visual.js)
- Capabilities definition
- Visual metadata
- Styling (CSS)
- Icon assets  
- Power BI API bindings

## Production Deployment Notes

### For Organization Deployment:
1. Test thoroughly in Power BI Desktop first
2. Consider creating app workspace for testing
3. Upload via Power BI Admin portal if organizational visual
4. Document data requirements for end users

### For AppSource Submission:
1. Ensure icon is high quality (20x20, 40x40 formats)
2. Complete all metadata fields in pbiviz.json
3. Add comprehensive help documentation
4. Test across multiple Power BI environments
5. Follow Microsoft certification requirements

## Final Checklist Before Deployment

- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)  
- [ ] Package builds successfully (`npm run package`)
- [ ] Visual imports in Power BI Desktop
- [ ] Basic functionality verified with test data
- [ ] Performance acceptable with larger datasets
- [ ] Documentation updated
- [ ] Version number incremented if updating existing visual

**Status**: Ready for packaging and Power BI import testing! 🚀