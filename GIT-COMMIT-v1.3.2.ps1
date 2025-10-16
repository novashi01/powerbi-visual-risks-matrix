# Git Commit Script for v1.3.2
# PowerShell Version

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Git Commit for v1.3.2" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to repository
$repoPath = "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"
Set-Location $repoPath

Write-Host "Current directory: $repoPath" -ForegroundColor Yellow
Write-Host ""

# Check git status before
Write-Host "Git status before commit:" -ForegroundColor Yellow
git status
Write-Host ""

# Add modified files
Write-Host "Adding modified files..." -ForegroundColor Green
$modifiedFiles = @(
    "src/visual.ts",
    "src/settings.ts",
    "package.json",
    "pbiviz.json",
    "VERIFY-V1.3.0.bat",
    "DOCUMENTATION-INDEX.md"
)

foreach ($file in $modifiedFiles) {
    git add $file
    Write-Host "  ✓ Added: $file" -ForegroundColor Gray
}
Write-Host ""

# Add new documentation files
Write-Host "Adding new documentation files..." -ForegroundColor Green
$newFiles = @(
    "RELEASE-NOTES-v1.3.2.md",
    "VERSION-1.3.2.md",
    "VISUAL-FIXES-SUMMARY.md",
    "DEPLOYMENT-CHECKLIST-v1.3.2.md",
    "CRITICAL-FIXES-v1.3.2.md",
    "FINAL-STATUS-v1.3.2.md",
    "FINAL-FIX-COMPLETE-v1.3.2.md",
    "V1.3.2-RELEASE-SUMMARY.md",
    "ALL-FIXES-FINAL-v1.3.2.md",
    "SCROLLING-FEATURE-CORRECTED.md",
    "TRUE-SCROLLING-IMPLEMENTATION.md",
    "DEBUGGING-NOTES.md",
    "SIMPLIFIED-FINAL-v1.3.2.md"
)

foreach ($file in $newFiles) {
    git add $file
    Write-Host "  ✓ Added: $file" -ForegroundColor Gray
}
Write-Host ""

# Show status after adding
Write-Host "Git status after adding files:" -ForegroundColor Yellow
git status
Write-Host ""

# Create commit with detailed message
Write-Host "Creating commit..." -ForegroundColor Green
$commitMessage = @"
Release v1.3.2: Border customization, clipPath boundaries, animation enhancements

Features Added:
- Marker border color, width, and transparency customization
- ClipPath enforcement to prevent cell overlap
- Sequential animation (inherent -> arrow -> residual, then hide inherent/arrows)
- Debug logging for border settings troubleshooting

Bug Fixes:
- Fixed ColorPicker value access for border settings
- Simplified scrolling to use clipPath boundaries (removed buggy wheel events)
- Arrows now hide when inherent markers hide

Technical Changes:
- Added renderSingleMarkerToGroup() for per-cell rendering
- Implemented clipPath per cell for boundary enforcement
- Updated setting descriptions for clarity
- Version bumped to 1.3.2.0 in package.json and pbiviz.json

Documentation:
- Created 13 new documentation files
- Updated DOCUMENTATION-INDEX.md for v1.3.2
- Comprehensive testing checklist and release notes

Breaking Changes: None (100% backward compatible)

Settings Added:
- Markers: borderColor, borderWidth, borderTransparency
- Risk Markers Layout: enableScrolling (simplified to clipPath enforcement)

Status: Ready for build and testing
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Create version tag
Write-Host "Creating version tag..." -ForegroundColor Green
git tag -a v1.3.2 -m "Version 1.3.2: Border customization and clipPath boundaries"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Tag v1.3.2 created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Tag creation failed (may already exist)" -ForegroundColor Yellow
}
Write-Host ""

# Show commit summary
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Commit Summary" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
git log -1 --stat
Write-Host ""

# Show next steps
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To push to remote repository, run:" -ForegroundColor Yellow
Write-Host "  git push origin main" -ForegroundColor White
Write-Host "  git push origin v1.3.2" -ForegroundColor White
Write-Host ""
Write-Host "Or if your branch is named 'master':" -ForegroundColor Yellow
Write-Host "  git push origin master" -ForegroundColor White
Write-Host "  git push origin v1.3.2" -ForegroundColor White
Write-Host ""
Write-Host "Repository is ready for push!" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
