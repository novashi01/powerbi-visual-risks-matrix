# 🚀 GitHub Release Instructions - v1.1.0

## 📋 Pre-Release Checklist

### ✅ **Code Quality**
- [ ] All tests passing (88/88)
- [ ] Linter warnings addressed  
- [ ] Package builds successfully
- [ ] Visual tested in Power BI Desktop

### ✅ **Version Management**
- [x] Version bumped to 1.1.0.0 in `package.json`
- [x] Version bumped to 1.1.0.0 in `pbiviz.json`  
- [x] Release notes created (`RELEASE-NOTES-v1.1.0.md`)
- [x] Documentation updated

### ✅ **Git Operations**
- [ ] All changes committed to feature branch
- [ ] Feature branch merged to main
- [ ] Main branch up to date
- [ ] Package file generated and ready

## 🎯 **GitHub Release Steps**

### **1. Commit and Push Changes**
```bash
# Commit final changes
git add .
git commit -m "🚀 Release v1.1.0: Customizable Axis Labels

✨ New Features:
- Customizable axis labels with 10 text inputs
- Font size controls (8-24px range)  
- Y-axis orientation toggle (horizontal/vertical)
- Individual show/hide controls for axes

🐛 Bug Fixes:
- Fixed axis labels showing null/wrong numbers with sparse data
- Improved floating point precision in tests
- Enhanced error handling for edge cases

📦 Package: risksMatrix.1.1.0.0.pbiviz ready for deployment"

# Push to GitHub
git push origin main
```

### **2. Create GitHub Release**
1. **Go to**: https://github.com/novashi01/powerbi-visual-risks-matrix/releases
2. **Click**: "Create a new release"
3. **Tag version**: `v1.1.0`
4. **Release title**: `🎨 v1.1.0 - Customizable Axis Labels`

### **3. Release Description Template**
```markdown
# 🎨 Customizable Axis Labels - v1.1.0

## ✨ Major New Feature
**Fully Customizable Axis Labels** - Transform your risk matrix with personalized axis labeling!

### 🏷️ What's New
- **10 individual text inputs** for complete axis customization
- **Flexible font sizing** (8px-24px) for optimal readability  
- **Y-axis orientation control** (horizontal/vertical text)
- **Show/hide toggles** for each axis independently
- **Backward compatible** - existing reports work unchanged

### 🐛 Bug Fixes  
- ✅ Fixed axis labels showing incorrect values with sparse data
- ✅ Improved test suite reliability (88 tests passing)
- ✅ Enhanced error handling for edge cases

### 📦 Installation
1. Download `risksMatrix.1.1.0.0.pbiviz` below
2. Import into Power BI Desktop via **Get Data** → **Import custom visual**
3. Enjoy your enhanced Risk Matrix! 🎉

### 🎯 Perfect For
- **Risk Management**: Very Low → Critical scales
- **Probability Assessment**: Rare → Certain classifications  
- **Impact Analysis**: Minimal → Catastrophic ratings
- **Custom Business Scales**: Any terminology your organization uses

**Full backward compatibility** - upgrade seamlessly from v1.0.x!

See [RELEASE-NOTES-v1.1.0.md](./RELEASE-NOTES-v1.1.0.md) for complete details.
```

### **4. Upload Assets**
**Required Files to Attach**:
- [ ] `risksMatrix.1.1.0.0.pbiviz` (main package file)
- [ ] `RELEASE-NOTES-v1.1.0.md` (detailed release notes)

**Optional Files**:
- [ ] `package.json` (for version reference)
- [ ] Screenshots of new axis customization features

### **5. Release Settings**
- **Pre-release**: ❌ (this is a stable release)
- **Latest release**: ✅ (set as latest)
- **Generate release notes**: ✅ (auto-generate changelog)

## 🧪 **Testing Instructions for Users**

### **Basic Functionality Test**
1. Download and import the visual
2. Add sample risk data (Risk ID, Likelihood, Consequence)
3. Verify standard 1-5 matrix appears
4. Open Format panel → Axis Labels
5. Test custom label inputs
6. Verify font size changes work
7. Test Y-axis orientation toggle

### **Edge Cases to Verify**
- Empty/null data handling
- Very long custom labels  
- Minimum/maximum font sizes
- Hide/show toggle combinations

## 📊 **Release Metrics Target**
- **GitHub Stars**: Maintain current level
- **Downloads**: Track via GitHub insights
- **Issues**: Monitor for any post-release bugs
- **Feedback**: Collect user experience reports

## 🔄 **Post-Release Tasks**
- [ ] Monitor GitHub issues for 48 hours
- [ ] Update main README with v1.1.0 features
- [ ] Create usage examples/screenshots
- [ ] Share release on relevant communities
- [ ] Plan next iteration based on feedback

## 📞 **Support Strategy**
- **GitHub Issues**: Primary support channel
- **Response Time**: Within 24 hours for critical issues
- **Documentation**: Keep README and wiki updated
- **Community**: Encourage user feedback and feature requests

---

**Ready to release! 🚀**

**Command to execute**: `.\Release-Package.ps1` then follow GitHub release steps above.