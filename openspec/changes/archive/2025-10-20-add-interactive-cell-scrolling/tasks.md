# Tasks: Add Interactive Cell Scrolling (Simplified)

## Implementation Checklist

### Phase 1: Core Implementation (~2 hours)
- [ ] **1.1** Add scroll container wrapper in `renderOrganizedLayout`
  - After rendering markers to cellGroup, create `<g class="scroll-container">`
  - Move all cellGroup children into scroll-container
  - Append scroll-container back to cellGroup
  - **Validation**: Inspect DOM, verify structure and clipPath still works

- [ ] **1.2** Calculate scroll bounds inline
  - Find min/max Y coordinates of all markers in cell
  - Calculate content height: `maxY - minY + markerSize`
  - Calculate max scroll: `Math.min(0, cellHeight - contentHeight)`
  - **Validation**: Manual calculation check with test data

- [ ] **1.3** Add wheel event listener
  - Store scroll offset in closure variable (initialized to 0)
  - On wheel event: update offset, clamp to bounds, apply transform
  - Call `preventDefault()` to prevent page scroll
  - **Validation**: Manual test wheel scrolling in browser

### Phase 2: Settings Update (~15 minutes)
- [ ] **2.1** Update display name in `settings.ts`
  - Change from: "Show all markers (overflow hidden by clipPath, no interactive scroll)"
  - Change to: "Enable mouse wheel scrolling for overflow markers"
  - **Validation**: Check format pane displays new name

### Phase 3: Testing (~1-2 hours)
- [ ] **3.1** Add integration tests
  - Test: wheel event updates transform attribute
  - Test: scroll clamping at bounds
  - Test: no scroll when no overflow
  - Test: scroll works only when enableScrolling = true
  - **Validation**: Run `npm test`, all tests pass

- [ ] **3.2** Manual testing
  - Cell with 20 markers (3×3 grid): wheel reveals all ✓
  - Scroll to bounds: stops correctly ✓
  - Cell with few markers: no scroll ✓
  - Toggle off: no handlers ✓
  - Data update: scroll resets ✓
  - **Validation**: Checklist completed

### Phase 4: Documentation & Deployment (~30 minutes)
- [ ] **4.1** Add code comments
  - Document scroll logic inline
  - Explain bounds calculation
  - **Validation**: Code review

- [ ] **4.2** Update version and package
  - Bump to v1.3.5 (patch: minor feature addition)
  - Run `npm run package`
  - **Validation**: Build succeeds

- [ ] **4.3** Git commit and push
  - Commit: `feat: add mouse wheel scrolling for overflow cells (v1.3.5)`
  - Tag: `v1.3.5`
  - Push with tags
  - **Validation**: Changes pushed

---

## Code Template

Here's the approximate implementation:

```typescript
// In renderOrganizedLayout, after rendering markers to cellGroup:
if (enableScrolling && organizedMarkers.length > maxMarkers) {
    // Wrap markers in scroll container
    const scrollContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    scrollContainer.setAttribute("class", "scroll-container");
    
    // Move all children to scroll container
    const children = Array.from(cellGroup.children);
    children.forEach(child => scrollContainer.appendChild(child));
    cellGroup.appendChild(scrollContainer);
    
    // Calculate bounds
    let minY = Infinity, maxY = -Infinity;
    organizedMarkers.forEach(m => {
        minY = Math.min(minY, m.organizedY);
        maxY = Math.max(maxY, m.organizedY);
    });
    const contentHeight = maxY - minY + markerSize * 2;
    const maxScroll = Math.min(0, cellBounds.height - contentHeight);
    
    // Add wheel listener
    let offsetY = 0;
    cellGroup.addEventListener('wheel', (e) => {
        e.preventDefault();
        offsetY = Math.max(maxScroll, Math.min(0, offsetY - e.deltaY * 0.5));
        scrollContainer.setAttribute('transform', `translate(0, ${offsetY})`);
    });
}
```

---

## Estimated Effort

- Phase 1: 2 hours
- Phase 2: 15 minutes
- Phase 3: 1-2 hours
- Phase 4: 30 minutes

**Total: ~4 hours** (half a working day)

---

## Success Metrics

- [x] All tasks completed
- [ ] Code < 50 lines added
- [ ] No new files created
- [ ] All tests pass
- [ ] Manual testing scenarios completed
- [ ] Visual packaged successfully
