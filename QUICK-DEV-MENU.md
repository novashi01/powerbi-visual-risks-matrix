# Quick Developer Menu - v1.3.1

## 🚀 Quick Start Commands

```bash
# Test Everything
VERIFY-V1.3.0.bat

# Development Mode
npm start

# Build Package
npm run package

# Run Tests
npm test
```

---

## 📂 File Locations

| What | Where |
|------|-------|
| Main Logic | `src/visual.ts` |
| Settings | `src/settings.ts` |
| Capabilities | `capabilities.json` |
| Version Info | `package.json`, `pbiviz.json` |
| Tests | `test/*.test.ts` |
| Package Output | `dist/*.pbiviz` |

---

## ⚙️ Key Settings to Remember

### Matrix Grid Card
- `matrixRows` (2-10, default: 3)
- `matrixColumns` (2-10, default: 3)

### Risk Markers Layout Card  
- `layoutMode` (organized/scatter/centered)
- `markerRows` (1-10, default: 3)
- `markerColumns` (1-10, default: 3)
- `cellPadding` (0-20, default: 5)
- `showInherentInOrganized` (boolean, default: true)
- `inherentTransparency` (0-100, default: 50)
- `organizedArrows` (boolean, default: true)

### Arrows Card
- `show` (boolean, default: true)
- `arrowSize` (4-20, default: 8)
- `arrowDistance` (2-50, default: 5)
- `arrowColor` (color, default: #666666)
- `arrowTransparency` (0-100, default: 100)

---

## 🐛 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| TypeScript error | `npx tsc --noEmit` |
| Duplicate identifier | Check for copy-paste duplicates in settings.ts |
| Setting not showing | Check capabilities.json + settings.ts + slices array |
| Package fails | Check ESLint errors, run `npm run lint` |
| Version mismatch | Update package.json + pbiviz.json (both locations) |
| Scrolling still there | Removed scrollContainer, check constructor |
| Arrow wrong color | Check createArrowMarker() gets color parameter |

---

## 🔄 Development Cycle

```
1. Edit code → 2. Check TypeScript → 3. Run tests → 4. Package → 5. Test in Power BI
     ↑                                                                        ↓
     └────────────────────────────── Fix issues ─────────────────────────────┘
```

---

## 📋 Pre-Release Checklist

- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Tests pass: `npm test`
- [ ] Package builds: `npm run package`
- [ ] Versions match in package.json and pbiviz.json
- [ ] Test in Power BI Desktop
- [ ] Check all new settings appear
- [ ] Verify animations work
- [ ] Test with different matrix sizes
- [ ] Test all three positioning modes
- [ ] Verify arrows show correctly
- [ ] Check inherent/residual positioning

---

## 🎯 Key Methods in visual.ts

| Method | Purpose |
|--------|---------|
| `constructor()` | Initialize SVG |
| `update()` | Main render cycle |
| `renderGrid()` | Draw matrix |
| `renderData()` | Draw markers |
| `renderOrganizedLayout()` | Organized mode |
| `renderMarkerWithArrow()` | Scatter/centered mode |
| `createArrowMarker()` | Define arrow SVG |
| `calculateArrowPosition()` | Arrow offset |
| `organizeMarkersInCell()` | Grid positioning |

---

## 💡 Remember These Patterns

### Access Settings
```typescript
const value = this.formattingSettings?.cardName?.settingName?.value || defaultValue;
```

### Create SVG Element
```typescript
const el = document.createElementNS("http://www.w3.org/2000/svg", "elementType");
el.setAttribute("attr", String(value));
this.gPoints.appendChild(el);
```

### Add Animation
```typescript
el.setAttribute("opacity", "0");
setTimeout(() => {
    el.style.transition = `opacity ${duration}ms ease-in`;
    el.setAttribute("opacity", "1");
}, 10);
```

### Convert Transparency to Opacity
```typescript
const transparency = settings?.transparency?.value || 100;
const opacity = transparency / 100;
element.setAttribute("fill-opacity", String(opacity));
```

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| DEV-CONTEXT-MENU.md | Full development guide (this file's companion) |
| RELEASE-NOTES-v1.3.1.md | User-facing release notes |
| VERSION-1.3.1.md | Version details & migration |
| V1.3.0-IMPROVEMENTS-APPLIED.md | Technical changes log |
| RELEASE-TEST-PLAN-v1.3.0.md | Test plan |

---

## 🎨 Visual Structure

```
SVG
├── defs (arrow markers)
├── gGrid (matrix cells & labels)
├── gArrows (inherent→residual arrows)
└── gPoints (risk markers & labels)
```

---

## 🔧 Add New Setting (Quick Guide)

**1. settings.ts:**
```typescript
mySetting = new formattingSettings.NumUpDown({
    name: "mySetting",
    displayName: "My Setting",
    value: 10
});

slices = [..., this.mySetting];
```

**2. capabilities.json:**
```json
"mySetting": { "displayName": "My Setting", "type": { "numeric": true } }
```

**3. visual.ts:**
```typescript
const value = this.formattingSettings?.myCard?.mySetting?.value || 10;
```

---

## 📞 Emergency Contacts

- GitHub Issues: https://github.com/novashi01/powerbi-visual-risks-matrix/issues
- Power BI Community: https://community.powerbi.com
- Documentation: See project README.md

---

## 🏆 Version History Quick Ref

| Version | Date | Key Features |
|---------|------|--------------|
| 1.3.1 | Dec 2024 | Arrow enhancements, animations, auto-fit |
| 1.3.0 | Dec 2024 | Organized grid, configurable matrix |
| 1.2.0 | - | Customizable labels, arrows |

---

## ✅ Current Status

**Version**: 1.3.1.0  
**Status**: ✅ Ready for testing  
**Last Fix**: Removed duplicate slices declaration  
**Next**: Run VERIFY-V1.3.0.bat

---

**Quick Access**: Keep this file open during development for fast reference!