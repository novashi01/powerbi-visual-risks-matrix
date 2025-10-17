@echo off
echo.
echo ================================================
echo Git Branch Fix and Push for v1.3.2
echo ================================================
echo.

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo Current branch status:
git status
echo.

echo You are on: feature/axis-labels-complete
echo Your commits need to go to: main
echo.
echo Choose an option:
echo.
echo [1] Push to feature branch (feature/axis-labels-complete)
echo [2] Switch to main branch and push there
echo [3] Cancel
echo.
set /p choice="Enter choice (1, 2, or 3): "

if "%choice%"=="1" goto push_feature
if "%choice%"=="2" goto switch_main
if "%choice%"=="3" goto end

:push_feature
echo.
echo Pushing to feature/axis-labels-complete...
git push origin feature/axis-labels-complete
if %errorlevel% neq 0 (
    echo ❌ Push failed
    pause
    exit /b 1
)
echo ✓ Successfully pushed to feature/axis-labels-complete
echo.
echo Your changes are now on GitHub in the feature branch.
echo To merge to main, create a Pull Request on GitHub:
echo https://github.com/novashi01/powerbi-visual-risks-matrix/compare/feature/axis-labels-complete
goto end

:switch_main
echo.
echo Switching to main branch...
git checkout main
if %errorlevel% neq 0 (
    echo ❌ Failed to switch to main
    pause
    exit /b 1
)
echo ✓ Switched to main
echo.

echo Pulling latest main...
git pull origin main
if %errorlevel% neq 0 (
    echo ❌ Pull failed
    pause
    exit /b 1
)
echo ✓ Main is up to date
echo.

echo Merging feature branch into main...
git merge feature/axis-labels-complete
if %errorlevel% neq 0 (
    echo ❌ Merge failed - you may have conflicts
    echo Please resolve conflicts and run:
    echo   git add .
    echo   git commit
    echo   git push origin main
    pause
    exit /b 1
)
echo ✓ Feature branch merged into main
echo.

echo Pushing to main...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Push failed
    pause
    exit /b 1
)
echo ✓ Successfully pushed to main
echo.

echo Pushing tag v1.3.2...
git push origin v1.3.2
if %errorlevel% neq 0 (
    echo ⚠️ Tag already exists on remote (this is OK)
) else (
    echo ✓ Tag pushed
)
echo.

echo ================================================
echo Success!
echo ================================================
echo.
echo Your v1.3.2 changes are now on main branch
echo Repository: https://github.com/novashi01/powerbi-visual-risks-matrix
goto end

:end
echo.
pause
