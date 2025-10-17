@echo off
echo.
echo ================================================
echo Git Pull and Push for v1.3.2
echo ================================================
echo.

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo Current directory:
cd
echo.

echo Step 1: Pulling remote changes...
echo.
git pull origin main --rebase
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Pull failed. Checking if we need to merge...
    echo.
    git pull origin main
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Pull failed. You may have conflicts.
        echo Please resolve conflicts manually and run:
        echo   git add .
        echo   git rebase --continue
        echo.
        pause
        exit /b 1
    )
)
echo ✓ Remote changes pulled successfully
echo.

echo Step 2: Checking git status...
git status
echo.

echo Step 3: Pushing local commits...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Push failed
    pause
    exit /b 1
)
echo ✓ Commits pushed successfully
echo.

echo Step 4: Checking if tag needs to be pushed...
git ls-remote --tags origin | findstr "v1.3.2"
if %errorlevel% equ 0 (
    echo ✓ Tag v1.3.2 already exists on remote
) else (
    echo Pushing tag v1.3.2...
    git push origin v1.3.2
    if %errorlevel% neq 0 (
        echo ⚠️ Tag push failed (may already exist)
    ) else (
        echo ✓ Tag pushed successfully
    )
)
echo.

echo ================================================
echo Success!
echo ================================================
echo.
echo Your v1.3.2 changes are now on GitHub
echo Repository: https://github.com/novashi01/powerbi-visual-risks-matrix
echo.
echo View your commit:
git log -1 --oneline
echo.

pause
