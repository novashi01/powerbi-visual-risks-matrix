# 🚀 Deployment Checklist - v1.1.0

## 📋 **Pre-Deployment Verification**

### ✅ **Code Quality**
- [x] Version updated to 1.1.0.0 in both `package.json` and `pbiviz.json`
- [x] All tests passing (88/88 tests)
- [x] Floating point precision issues fixed
- [x] Linter warnings acceptable for production
- [x] No breaking changes introduced

### ✅ **Feature Completeness** 
- [x] Customizable axis labels implemented (10 text inputs)
- [x] Font size controls working (8-24px range)
- [x] Y-axis orientation toggle functional
- [x] Show/hide controls operational
- [x] Backward compatibility maintained
- [x] Settings panel integration complete

### ✅ **Documentation**
- [x] README.md updated with v1.1.0 features  
- [x] Release notes created (`RELEASE-NOTES-v1.1.0.md`)
- [x] GitHub release guide prepared (`GITHUB-RELEASE.md`)
- [x] TODO.md status updated
- [x] Test review documentation complete

### ✅ **Build & Package**
- [ ] Run final tests: `npm test`
- [ ] Lint check: `npm run lint`  
- [ ] Create package: `npm run package`
- [ ] Verify .pbiviz file created in `dist/` folder
- [ ] Test .pbiviz import in Power BI Desktop

## 🎯 **Deployment Commands**

### **Option 1: Automated (Recommended)**
```powershell
# Run the automated release script
.\Release-Package.ps1

# Or with verbose output
.\Release-Package.ps1 -Verbose

# Or skip tests if already verified
.\Release-Package.ps1 -SkipTests
```

### **Option 2: Manual Steps**
```powershell
# Navigate to project directory
cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

# Run tests
npm test

# Lint check (warnings OK)
npm run lint

# Create package
npm run package

# Verify package
dir dist\*.pbiviz
```

## 📦 **Expected Output**

### **Package File**
- **Name**: `risksMatrix.1.1.0.0.pbiviz`
- **Location**: `dist/risksMatrix.1.1.0.0.pbiviz`
- **Expected Size**: ~50-100KB (typical for Power BI visuals)

### **Test Results**
```
Test Suites: 8 passed, 8 total
Tests:       88 passed, 88 total  
Snapshots:   0 total
Time:        ~10s
```

### **Package Success Message**
```
✓ Package created!
✓ Build completed successfully
ℹ Visual can be improved by adding X more optional features
```

## 🧪 **Quality Assurance**

### **Manual Testing in Power BI**
1. **Import Test**:
   - Import .pbiviz into Power BI Desktop
   - Verify visual appears in visualizations panel
   - No error messages during import

2. **Basic Functionality**:  
   - Create simple risk matrix with sample data
   - Verify 5x5 grid displays correctly
   - Test data point plotting

3. **New Features Test**:
   - Open Format panel → Axis Labels section
   - Test custom text inputs (X-axis: 1-5, Y-axis: 1-5)
   - Verify font size changes work
   - Test Y-axis orientation toggle
   - Test show/hide controls

4. **Backward Compatibility**:
   - Import existing .pbix files with v1.0.x
   - Verify automatic upgrade works
   - Ensure no visual changes to existing reports

## 🚀 **Git & GitHub Release**

### **Git Operations**
```bash
# Final commit
git add .
git commit -m "🚀 Release v1.1.0: Customizable Axis Labels

✨ Features: Custom labels, font controls, orientation options
🐛 Fixes: Axis display issues, test precision improvements  
📦 Ready: risksMatrix.1.1.0.0.pbiviz"

# Push to main
git push origin main

# Create tag
git tag -a v1.1.0 -m "Release v1.1.0 - Customizable Axis Labels"
git push origin v1.1.0
```

### **GitHub Release**
1. Go to: https://github.com/novashi01/powerbi-visual-risks-matrix/releases
2. Click "Create a new release"
3. Use tag: `v1.1.0`
4. Title: `🎨 v1.1.0 - Customizable Axis Labels`
5. Upload: `risksMatrix.1.1.0.0.pbiviz`
6. Copy description from `GITHUB-RELEASE.md`

## 📊 **Post-Deployment Monitoring**

### **First 24 Hours**
- [ ] Monitor GitHub issues for bug reports
- [ ] Check download metrics
- [ ] Test user feedback collection
- [ ] Verify package download works

### **First Week**  
- [ ] Collect user experience feedback
- [ ] Monitor performance in production environments
- [ ] Track adoption metrics
- [ ] Plan hotfixes if needed

## 🔧 **Rollback Plan**

If critical issues are discovered:

### **Immediate Actions**
1. **Mark release as pre-release** on GitHub
2. **Document issue** in GitHub issues
3. **Revert to v1.0.x** if necessary
4. **Communicate** with users via GitHub

### **Fix & Re-release**
1. Fix critical issue(s)
2. Update version to v1.1.1 
3. Create new package
4. Release as v1.1.1 with hotfix notes

## ✅ **Final Deployment Confirmation**

When all checks pass:

- [x] **Code Quality**: All tests green ✅
- [ ] **Package Built**: .pbiviz file ready ⏳
- [ ] **Manual Testing**: Power BI import successful ⏳  
- [ ] **Git Release**: Committed and tagged ⏳
- [ ] **GitHub Release**: Published with assets ⏳
- [ ] **Documentation**: Updated and complete ✅

**🎉 Ready for production deployment!**

---

**Deployment Contact**: Development Team  
**Support Channel**: GitHub Issues  
**Documentation**: Repository README & Wiki