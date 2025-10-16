@echo off
echo.
echo ================================================
echo EMERGENCY FIX - Power BI Visual v1.3.1
echo ================================================
echo.
echo This will restore your file to a clean state
echo and apply only the necessary minimal fix.
echo.
pause

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo.
echo Step 1: Backing up current file...
copy src\visual.ts src\visual.ts.corrupted.bak
echo    Done.

echo.
echo Step 2: Hard reset to last commit...
git reset --hard HEAD
echo    Done.

echo.
echo Step 3: Testing clean file...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo    Warning: Clean file has compilation issues
) else (
    echo    Clean file compiles successfully
)

echo.
echo Step 4: Applying minimal fix...
call node emergency-restore.js

echo.
echo ================================================
echo Process complete! Check output above.
echo ================================================
echo.
echo If successful, run: npm run package
echo.
pause