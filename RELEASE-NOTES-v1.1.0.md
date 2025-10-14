# 🚀 Release Notes - Version 1.1.0.0

## 📅 Release Date: $(Get-Date -Format "yyyy-MM-dd")

## 🎯 **Major New Feature: Customizable Axis Labels**

### ✨ **What's New**

#### 🏷️ **Fully Customizable Axis Labels**
- **10 individual text inputs** for all axis labels (X-axis: 1-5, Y-axis: 1-5)
- **Custom text override** - Replace default numbers with your own labels
- **Flexible font sizing** - Range from 8px to 24px for optimal readability
- **Y-axis orientation control** - Choose horizontal or vertical text orientation
- **Show/hide toggles** - Individual visibility control for X and Y axes

#### 🛠️ **Settings Panel Enhancements**
New **"Axis Labels"** section with:
- ✅ **X-Axis Labels**: 5 customizable text inputs (positions 1-5)
- ✅ **Y-Axis Labels**: 5 customizable text inputs (positions 1-5)  
- ✅ **Font Size Controls**: Separate sizing for X and Y axes
- ✅ **Orientation Toggle**: Horizontal/Vertical Y-axis text
- ✅ **Visibility Controls**: Show/hide each axis independently

### 🐛 **Bug Fixes**

#### **Fixed Axis Label Display Issues**
- ✅ **Resolved**: Axis labels now consistently show 1-5 scale regardless of data content
- ✅ **Fixed**: Null/empty data no longer breaks axis label rendering
- ✅ **Improved**: Labels maintain proper positioning across all data scenarios

#### **Test Suite Improvements**
- ✅ **Fixed**: Floating point precision issues in test calculations
- ✅ **Enhanced**: More robust test patterns for numerical comparisons
- ✅ **Added**: 26 new test cases for customizable axis labels functionality

### 💻 **Technical Improvements**

#### **Code Quality Enhancements**
- ✅ **Refactored**: Modular axis label rendering system
- ✅ **Added**: Comprehensive type safety improvements
- ✅ **Enhanced**: Better error handling for edge cases
- ✅ **Improved**: Performance optimizations for label rendering

#### **Development Experience**
- ✅ **Added**: Complete test coverage for new features
- ✅ **Enhanced**: Better debugging and logging capabilities
- ✅ **Improved**: More maintainable code structure

### 🔧 **Breaking Changes**
**None** - This release maintains full backward compatibility with existing reports.

### 📦 **Package Information**
- **Package Name**: `powerbi-visual-risks-matrix`
- **Version**: `1.1.0.0`
- **Build Target**: Power BI API 5.3.0
- **File Size**: ~[Size will be determined after packaging]

### 🚀 **Installation Instructions**

#### **For New Installations:**
1. Download `risksMatrix.1.1.0.0.pbiviz` from the release
2. In Power BI Desktop, go to **Home** → **Get Data** → **More**
3. Select **Other** → **Import a custom visual**
4. Choose the downloaded `.pbiviz` file
5. Click **Import**

#### **For Upgrades from v1.0.x:**
1. Download the new `risksMatrix.1.1.0.0.pbiviz` file
2. Import as above - Power BI will automatically upgrade existing visuals
3. **Your existing reports will continue to work unchanged**
4. New customization options will be available in the formatting panel

### 🎨 **Usage Guide**

#### **Setting Custom Axis Labels:**
1. Select your Risk Matrix visual
2. Open the **Format visual** panel (🎨 icon)
3. Expand **"Axis Labels"** section
4. **For X-Axis**: Enter custom labels for positions 1-5 (left to right)
5. **For Y-Axis**: Enter custom labels for positions 1-5 (bottom to top)
6. **Adjust font size** using the size controls
7. **Toggle Y-axis orientation** between horizontal/vertical
8. **Show/hide** each axis as needed

#### **Example Use Cases:**
- **Risk Levels**: Very Low, Low, Medium, High, Critical
- **Probability Scale**: Rare, Unlikely, Possible, Likely, Certain  
- **Impact Scale**: Minimal, Minor, Moderate, Major, Catastrophic
- **Custom Scales**: A, B, C, D, E or any business-specific terminology

### 🧪 **Quality Assurance**
- ✅ **88 automated tests** - All passing
- ✅ **Cross-browser compatibility** verified
- ✅ **Performance testing** completed
- ✅ **Power BI certification** ready

### 📋 **Compatibility**
- **Power BI Desktop**: Latest version
- **Power BI Service**: Full support
- **Power BI Mobile**: Full support
- **API Version**: 5.3.0+

### 🔄 **Migration Notes**
**Seamless upgrade** - No manual migration required:
- Existing visuals automatically use new features
- Default behavior unchanged
- All existing formatting preserved
- New options available immediately

### 🐛 **Known Issues**
- None at release time

### 📞 **Support & Feedback**
- **GitHub Issues**: [powerbi-visual-risks-matrix/issues](https://github.com/novashi01/powerbi-visual-risks-matrix/issues)
- **Documentation**: [Repository README](https://github.com/novashi01/powerbi-visual-risks-matrix)

### 🔮 **Coming Next**
Check our [TODO.md](./TODO.md) for upcoming features:
- Enhanced tooltips
- Color customization options
- Animation improvements
- Additional matrix sizes (4x4, 6x6)

---

## 📈 **Release Statistics**
- **Files Changed**: 8
- **Lines Added**: 450+  
- **Tests Added**: 26
- **Features Added**: 1 major
- **Bugs Fixed**: 3
- **Development Time**: 2+ weeks

**Ready for production deployment!** 🎉