@echo off
echo.
echo ================================================
echo Git Commit for v1.3.2
echo ================================================
echo.

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo Current directory:
cd
echo.

echo Git status before commit:
git status
echo.

echo.
echo Adding modified files...
git add src/visual.ts
git add src/settings.ts
git add package.json
git add pbiviz.json
git add VERIFY-V1.3.0.bat
git add DOCUMENTATION-INDEX.md
echo ✓ Modified files added
echo.

echo Adding new documentation files...
git add RELEASE-NOTES-v1.3.2.md
git add VERSION-1.3.2.md
git add VISUAL-FIXES-SUMMARY.md
git add DEPLOYMENT-CHECKLIST-v1.3.2.md
git add CRITICAL-FIXES-v1.3.2.md
git add FINAL-STATUS-v1.3.2.md
git add FINAL-FIX-COMPLETE-v1.3.2.md
git add V1.3.2-RELEASE-SUMMARY.md
git add ALL-FIXES-FINAL-v1.3.2.md
git add SCROLLING-FEATURE-CORRECTED.md
git add TRUE-SCROLLING-IMPLEMENTATION.md
git add DEBUGGING-NOTES.md
git add SIMPLIFIED-FINAL-v1.3.2.md
echo ✓ Documentation files added
echo.

echo Git status after adding files:
git status
echo.

echo.
echo Creating commit...
git commit -m "Release v1.3.2: Border customization, clipPath boundaries, animation enhancements" -m "" -m "Features Added:" -m "- Marker border color, width, and transparency customization" -m "- ClipPath enforcement to prevent cell overlap" -m "- Sequential animation (inherent -> arrow -> residual, then hide inherent/arrows)" -m "- Debug logging for border settings troubleshooting" -m "" -m "Bug Fixes:" -m "- Fixed ColorPicker value access for border settings" -m "- Simplified scrolling to use clipPath boundaries (removed buggy wheel events)" -m "- Arrows now hide when inherent markers hide" -m "" -m "Technical Changes:" -m "- Added renderSingleMarkerToGroup() for per-cell rendering" -m "- Implemented clipPath per cell for boundary enforcement" -m "- Updated setting descriptions for clarity" -m "- Version bumped to 1.3.2.0 in package.json and pbiviz.json" -m "" -m "Documentation:" -m "- Created 13 new documentation files" -m "- Updated DOCUMENTATION-INDEX.md for v1.3.2" -m "- Comprehensive testing checklist and release notes" -m "" -m "Breaking Changes: None (100% backward compatible)" -m "" -m "Settings Added:" -m "- Markers: borderColor, borderWidth, borderTransparency" -m "- Risk Markers Layout: enableScrolling (simplified to clipPath enforcement)" -m "" -m "Status: Ready for build and testing"

if %errorlevel% neq 0 (
    echo ❌ Commit failed
    pause
    exit /b 1
)
echo ✓ Commit created successfully
echo.

echo.
echo Creating version tag...
git tag -a v1.3.2 -m "Version 1.3.2: Border customization and clipPath boundaries"
if %errorlevel% neq 0 (
    echo ⚠️  Tag creation failed (may already exist)
) else (
    echo ✓ Tag v1.3.2 created
)
echo.

echo.
echo ================================================
echo Commit Summary
echo ================================================
echo.
git log -1 --stat
echo.

echo ================================================
echo Next Steps
echo ================================================
echo.
echo To push to remote repository, run:
echo   git push origin main
echo   git push origin v1.3.2
echo.
echo Or if your branch is named 'master':
echo   git push origin master
echo   git push origin v1.3.2
echo.
echo Repository is ready for push!
echo.

pause
