# Deployment Checklist - v1.3.2

**Version**: 1.3.2.0  
**Date**: December 2024

---

## Pre-Build Verification

### Code Quality
- [ ] All TypeScript files compile without errors
- [ ] No ESLint warnings or errors
- [ ] Code follows project style guidelines
- [ ] All functions have proper error handling

### Version Numbers
- [ ] package.json version = 1.3.2.0
- [ ] pbiviz.json version = 1.3.2.0
- [ ] VERIFY-V1.3.0.bat references v1.3.2
- [ ] Release notes created: RELEASE-NOTES-v1.3.2.md
- [ ] Version doc created: VERSION-1.3.2.md

### Documentation
- [ ] RELEASE-NOTES-v1.3.2.md completed
- [ ] VERSION-1.3.2.md completed
- [ ] VISUAL-FIXES-SUMMARY.md created
- [ ] DOCUMENTATION-INDEX.md updated (if needed)
- [ ] Code comments updated

---

## Build Process

### Step 1: Clean Build
```bash
# Navigate to project directory
cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

# Clean previous builds
rm -rf dist/

# Install dependencies (if needed)
npm install
```

- [ ] Previous dist/ folder removed
- [ ] Dependencies up to date
- [ ] No package-lock.json conflicts

### Step 2: Run Verification Script
```bash
# Run verification batch file
VERIFY-V1.3.0.bat
```

**Expected Output**:
- [ ] ✅ TypeScript compilation passed
- [ ] ✅ Tests passed (or documented failures)
- [ ] ✅ Package created
- [ ] File created: `dist/risksMatrix.1.3.2.0.pbiviz`

### Step 3: Verify Package
```bash
# Check package exists
dir dist\*.pbiviz

# Check package size (should be ~150KB)
```

- [ ] Package file exists
- [ ] Package size is reasonable (~150KB)
- [ ] No error messages during build

---

## Testing Phase

### Unit Testing
```bash
npm test
```

- [ ] All existing tests pass
- [ ] New functionality covered by tests
- [ ] No test failures or warnings
- [ ] Code coverage acceptable

### Visual Testing
```bash
npm run test:visual
```

- [ ] Visual tests pass (if applicable)
- [ ] Screenshots match expected output
- [ ] No visual regression detected

### Manual Testing in Power BI Desktop

#### Test 1: Basic Import
- [ ] Open Power BI Desktop
- [ ] Insert → More visuals → Import from file
- [ ] Select `dist/risksMatrix.1.3.2.0.pbiviz`
- [ ] Visual imports successfully
- [ ] Visual appears in visualizations pane

#### Test 2: Marker Border Customization
- [ ] Add visual to canvas
- [ ] Load sample risk data
- [ ] Open formatting panel → Markers
- [ ] Change border color (e.g., red #FF0000)
  - [ ] Border color updates immediately
  - [ ] Color applies to all markers
- [ ] Change border width to 3
  - [ ] Borders become thicker
  - [ ] Markers remain clear and visible
- [ ] Change border transparency to 50%
  - [ ] Borders become semi-transparent
  - [ ] Still visible but softer
- [ ] Test with different values (0, 1, 5)
- [ ] Test in all layout modes:
  - [ ] Organized grid
  - [ ] Random scatter
  - [ ] Centered

#### Test 3: Overflow Handling
- [ ] Create dataset with >9 risks in one cell
- [ ] Set marker grid to 3×3 (9 capacity)
- [ ] Enable scrolling = OFF
  - [ ] Only 9 markers show
  - [ ] Red "+X" indicator appears
  - [ ] X number matches actual overflow
- [ ] Enable scrolling = ON
  - [ ] All markers attempt to display
  - [ ] "+X" indicator disappears
- [ ] Increase grid to 4×4
  - [ ] More markers fit
  - [ ] "+X" updates or disappears
- [ ] Test with various overflow counts (1, 5, 20)

#### Test 4: Animation Sequence
- [ ] Enable animation (Animation → Enable animation)
- [ ] Set duration to 1000ms
- [ ] Refresh visual
- [ ] Observe animation sequence:
  - [ ] Inherent markers fade in first
  - [ ] Arrows fade in second (organized mode)
  - [ ] Residual markers fade in third
  - [ ] Timing feels natural
- [ ] Test with different durations:
  - [ ] 300ms (fast)
  - [ ] 1500ms (slow)
- [ ] Test with inherent risks disabled
  - [ ] Animation still works for residual
- [ ] Test in different layout modes

#### Test 5: Backward Compatibility
- [ ] Open existing v1.3.1 report
- [ ] Visual loads without errors
- [ ] All existing settings preserved
- [ ] Visual renders correctly
- [ ] No data loss
- [ ] No visual artifacts

#### Test 6: Comprehensive Feature Test
- [ ] Matrix grid: Test 3×3, 5×5, 7×7
- [ ] Axis labels: Verify custom labels work
- [ ] Severity colors: Change colors, verify updates
- [ ] Tooltips: Hover over markers
- [ ] Selection: Click markers, verify selection
- [ ] Arrows: Toggle on/off, change color/size
- [ ] Inherent transparency: Adjust slider
- [ ] Labels: Toggle on/off, change size
- [ ] All new v1.3.2 features work together

#### Test 7: Edge Cases
- [ ] Empty data (no risks)
- [ ] Single risk
- [ ] 100+ risks
- [ ] All risks in one cell
- [ ] Risks with only inherent values
- [ ] Risks with only residual values
- [ ] Very long risk IDs
- [ ] Special characters in risk IDs

#### Test 8: Performance
- [ ] Load 100 risks: <1 second render time
- [ ] Load 500 risks: <3 seconds render time
- [ ] Animation smooth (60fps)
- [ ] No lag when adjusting settings
- [ ] No memory leaks (check task manager)

#### Test 9: Cross-Browser (Power BI Service)
- [ ] Chrome: All features work
- [ ] Edge: All features work
- [ ] Firefox: All features work
- [ ] Safari: All features work (if accessible)

#### Test 10: Responsive Design
- [ ] Small canvas (300×300)
- [ ] Medium canvas (600×600)
- [ ] Large canvas (1200×1200)
- [ ] Wide aspect ratio (16:9)
- [ ] Tall aspect ratio (9:16)
- [ ] Visual scales appropriately

---

## Documentation Review

### User Documentation
- [ ] RELEASE-NOTES-v1.3.2.md is clear and comprehensive
- [ ] All new features explained with examples
- [ ] Screenshots added (if applicable)
- [ ] Troubleshooting section complete
- [ ] Installation instructions accurate

### Developer Documentation
- [ ] VERSION-1.3.2.md technically accurate
- [ ] Code changes documented
- [ ] Migration guide clear
- [ ] API changes listed
- [ ] Known issues documented

### Quick Reference
- [ ] QUICK-DEV-MENU.md updated (if needed)
- [ ] DEV-CONTEXT-MENU.md updated (if needed)
- [ ] DOCUMENTATION-INDEX.md reflects v1.3.2

---

## Pre-Release Sign-off

### Technical Review
- [ ] Code reviewed by team member
- [ ] All tests passed
- [ ] Performance acceptable
- [ ] No security concerns
- [ ] No data privacy issues

### Quality Assurance
- [ ] All test cases passed
- [ ] No critical bugs
- [ ] Minor bugs documented
- [ ] User acceptance testing complete

### Documentation
- [ ] All documentation complete
- [ ] Documentation reviewed for accuracy
- [ ] No typos or formatting issues
- [ ] Links work correctly

### Business Sign-off
- [ ] Product owner approval
- [ ] Release manager approval
- [ ] Deployment window confirmed

---

## Deployment

### Production Deployment

#### Step 1: Prepare Package
- [ ] Package file: `dist/risksMatrix.1.3.2.0.pbiviz`
- [ ] Package size verified
- [ ] Package scanned for issues
- [ ] Backup of previous version (v1.3.1) saved

#### Step 2: Distribution
- [ ] Upload to company file share
- [ ] Upload to GitHub releases
- [ ] Update download links in documentation
- [ ] Notify distribution list

#### Step 3: Announcement
- [ ] Email announcement sent to users
- [ ] Include link to RELEASE-NOTES-v1.3.2.md
- [ ] Include installation instructions
- [ ] Mention key new features
- [ ] Provide support contact information

#### Step 4: Documentation Updates
- [ ] Update project README.md
- [ ] Update version badge (if applicable)
- [ ] Update changelog
- [ ] Publish release notes
- [ ] Update wiki/knowledge base

---

## Post-Deployment

### Immediate (Day 1)
- [ ] Monitor for error reports
- [ ] Check support channels for issues
- [ ] Verify download links work
- [ ] Respond to user questions

### Short-term (Week 1)
- [ ] Collect user feedback
- [ ] Document any issues discovered
- [ ] Create hotfix plan if needed
- [ ] Update FAQ based on questions

### Long-term (Month 1)
- [ ] Analyze usage metrics
- [ ] Review performance data
- [ ] Plan next version features
- [ ] Conduct retrospective meeting

---

## Rollback Plan

### If Critical Issues Found

#### Step 1: Assess Severity
- [ ] Determine if issue is critical
- [ ] Document the issue
- [ ] Estimate impact
- [ ] Decide: hotfix or rollback?

#### Step 2: Rollback (if needed)
- [ ] Restore v1.3.1 package
- [ ] Re-distribute previous version
- [ ] Announce rollback to users
- [ ] Document reason for rollback

#### Step 3: Fix Forward
- [ ] Create hotfix branch
- [ ] Fix critical issue
- [ ] Test thoroughly
- [ ] Release v1.3.2.1 (hotfix)

---

## Sign-off Sheet

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Developer | | | |
| QA Lead | | | |
| Tech Lead | | | |
| Product Owner | | | |
| Release Manager | | | |

---

## Notes

### Test Environment
- Power BI Desktop Version: __________
- Operating System: __________
- Browser (for Service): __________
- Date Tested: __________

### Issues Found
_(Document any issues found during testing)_

1. 
2. 
3. 

### Deployment Notes
_(Add any special notes about the deployment)_




---

**Checklist Version**: 1.0  
**For Release**: v1.3.2.0  
**Created**: December 2024
