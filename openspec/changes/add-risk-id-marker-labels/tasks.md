## 1. Implementation
- [ ] Update `src/settings.ts` to add marker label settings (showRiskIdLabel, riskIdLabelFontSize, riskIdLabelAlignment, riskIdLabelPadding, riskIdLabelTruncate, riskIdLabelMinMarkerSize, riskIdLabelColor)
- [ ] Update `capabilities.json` to expose the new settings in the Markers card
- [ ] Implement rendering in `src/visual.ts`:
  - [ ] Create helper to compute label metrics and whether marker must expand or truncate
  - [ ] Render `<text>` node inside the marker group with alignment and padding
  - [ ] Ensure event handling (click/hover) still attaches to marker elements
  - [ ] Preserve animations and selection metadata
- [ ] Add unit tests (`src/marker-label.test.ts`) for: alignment, truncation, min-marker-size behavior, color and contrast
- [ ] Update docs: `DOCUMENTATION-INDEX.md` and release notes
- [ ] Manual validation: import packaged `.pbiviz` into Power BI Desktop with sample dataset and verify label options

## 2. Validation
- [ ] Run `npm test` and ensure all tests pass
- [ ] Run `npm run package` and confirm `.pbiviz` built
- [ ] Verify in Power BI Desktop using a representative sample report

## 3. Release
- [ ] Bump `package.json` and `pbiviz.json` versions to `1.3.4`
- [ ] Commit, tag `v1.3.4`, and push
- [ ] Publish release notes and updated docs
