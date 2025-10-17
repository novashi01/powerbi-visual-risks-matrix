# Marker Shape Format Pane Fix Log

## Issue
- The "Marker Shape" dropdown and other marker customization controls were missing from the Power BI format pane.

## Root Cause
- The `capabilities.json` was missing critical property definitions:
  - `borderColor`
  - `borderWidth`
  - `borderTransparency`
- These properties were defined in `settings.ts` but not declared in `capabilities.json`, causing the formatting model to fail initialization and not display the entire markers card.

## Investigation Steps
1. Verified `MarkersCardSettings` in `settings.ts`:
   - `shape`, `labelSize`, `hoverEffect`, `clickEffect` properties defined as `ItemDropdown`, `NumUpDown`, and `ToggleSwitch`.
   - All included in the `slices` array.
   - Card name is `"markers"`.
   - **Found**: `borderColor`, `borderWidth`, `borderTransparency` properties were defined but NOT in `capabilities.json`.

2. Checked `VisualFormattingSettingsModel`:
   - `markersCard` is instantiated and included in the `cards` array. ✅

3. Reviewed `capabilities.json`:
   - Missing critical properties for the markers card.
   - This prevented Power BI from recognizing and rendering the formatting pane for markers.

4. Compared with working dropdown (`layoutMode`):
   - Confirmed `ItemDropdown` is the correct dropdown type.
   - Verified item structure matches expected format.

## Solution Applied
Updated `capabilities.json` to add missing marker properties:

```json
"markers": {
  "displayName": "Markers",
  "properties": {
    "size": { "displayName": "Marker size", "type": { "numeric": true } },
    "color": { "displayName": "Marker color override", "type": { "fill": { "solid": { "color": true } } } },
    "borderColor": { "displayName": "Border color", "type": { "fill": { "solid": { "color": true } } } },
    "borderWidth": { "displayName": "Border width", "type": { "numeric": true } },
    "borderTransparency": { "displayName": "Border transparency (%)", "type": { "numeric": true } },
    "shape": { ... },
    "labelSize": { ... },
    "hoverEffect": { ... },
    "clickEffect": { ... }
  }
}
```

## Verification
- ✅ TypeScript compilation: No errors
- ✅ All 104 tests: Passed
- ✅ Package creation: Successful
- ✅ Capabilities validation: Valid

## Result
The marker customization controls should now appear in the Power BI format pane under the "Markers" section, including:
- Marker size
- Marker color override
- Border color (NEW)
- Border width (NEW)
- Border transparency (NEW)
- **Marker Shape (NEW)** ← The dropdown users were looking for
- Label Size (NEW)
- Enable Hover Effect (NEW)
- Enable Click Effect (NEW)

---

**Fix Applied**: Added missing border properties to `capabilities.json` that were defined in `settings.ts`.
