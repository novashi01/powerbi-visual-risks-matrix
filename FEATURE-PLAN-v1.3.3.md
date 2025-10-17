# Feature Plan for Version 1.3.3

## 🎯 Objective
Enhance the Power BI Risks Matrix visual by introducing customizable markers with interactive features. This includes:
- Marker shapes: Round, Rectangle, Rounded Rectangle
- Labels inside markers with adjustable text size (5-16)
- Hover and click effects
- Transparency adjustment for unselected markers

---

## 🔧 Implementation Plan

### 1. **Settings Updates**
#### File: `src/settings.ts`
- Extend `MarkersCardSettings` to include:
  - `shape`: Dropdown with options (Round, Rectangle, Rounded Rectangle)
  - `labelSize`: NumUpDown for text size (5-16)
  - `hoverEffect`: Toggle for enabling hover effects
  - `clickEffect`: Toggle for enabling click effects

```typescript
shape = new formattingSettings.ItemDropdown({
    name: "shape",
    displayName: "Marker Shape",
    items: [
        { displayName: "Round", value: "round" },
        { displayName: "Rectangle", value: "rectangle" },
        { displayName: "Rounded Rectangle", value: "roundedRectangle" }
    ],
    value: { displayName: "Round", value: "round" }
});

labelSize = new formattingSettings.NumUpDown({
    name: "labelSize",
    displayName: "Label Size",
    value: 10,
    options: {
        minValue: { value: 5, type: powerbi.visuals.ValidatorType.Min },
        maxValue: { value: 16, type: powerbi.visuals.ValidatorType.Max }
    }
});

hoverEffect = new formattingSettings.ToggleSwitch({
    name: "hoverEffect",
    displayName: "Enable Hover Effect",
    value: true
});

clickEffect = new formattingSettings.ToggleSwitch({
    name: "clickEffect",
    displayName: "Enable Click Effect",
    value: true
});
```

### 2. **Rendering Logic Updates**
#### File: `src/visual.ts`
- Update `renderSingleMarkerToGroup` to:
  - Draw markers based on the selected shape.
  - Render labels inside markers with the specified text size.
  - Add event listeners for hover and click effects.

```typescript
const shape = this.formattingSettings.markersCard.shape.value.value;
const labelSize = this.formattingSettings.markersCard.labelSize.value;
const hoverEffect = this.formattingSettings.markersCard.hoverEffect.value;
const clickEffect = this.formattingSettings.markersCard.clickEffect.value;

if (shape === "round") {
    element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    element.setAttribute("r", String(markerSize));
} else if (shape === "rectangle") {
    element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    element.setAttribute("width", String(markerSize * 2));
    element.setAttribute("height", String(markerSize));
} else if (shape === "roundedRectangle") {
    element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    element.setAttribute("width", String(markerSize * 2));
    element.setAttribute("height", String(markerSize));
    element.setAttribute("rx", "5");
    element.setAttribute("ry", "5");
}

if (hoverEffect) {
    element.addEventListener("mouseover", () => {
        element.setAttribute("opacity", "0.8");
    });
    element.addEventListener("mouseout", () => {
        element.setAttribute("opacity", "1");
    });
}

if (clickEffect) {
    element.addEventListener("click", () => {
        // Logic to make other markers transparent
    });
}
```

### 3. **Capabilities Update**
#### File: `capabilities.json`
- Add new properties under the `markers` object:
```json
"markers": {
    "displayName": "Markers",
    "properties": {
        "shape": {
            "displayName": "Marker Shape",
            "type": { "enumeration": ["round", "rectangle", "roundedRectangle"] }
        },
        "labelSize": {
            "displayName": "Label Size",
            "type": { "numeric": true }
        },
        "hoverEffect": {
            "displayName": "Enable Hover Effect",
            "type": { "bool": true }
        },
        "clickEffect": {
            "displayName": "Enable Click Effect",
            "type": { "bool": true }
        }
    }
}
```

### 4. **Testing**
- Add unit tests in `test-layout-settings.js` to validate:
  - Marker shapes render correctly.
  - Labels appear with the correct size.
  - Hover and click effects work as expected.

### 5. **Documentation**
- Update `README.md` and `DEV-CONTEXT-MENU.md` with details about the new settings and their usage.

---

## 📅 Timeline
- **Week 1**: Implement settings and rendering logic.
- **Week 2**: Update capabilities and write tests.
- **Week 3**: Finalize documentation and perform end-to-end testing.

---

## 📝 Notes
- Ensure backward compatibility with existing visuals.
- Optimize performance for large datasets.
- Validate the feature in Power BI Desktop and Service.