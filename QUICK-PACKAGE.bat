@echo off
echo.
echo ========================================
echo Quick Package Test - Force Creation
echo ========================================
echo.

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo Testing enhanced layout...
node test-enhanced-layout.js
if %errorlevel% neq 0 (
    echo Enhanced layout test failed!
    pause
    exit /b 1
)

echo.
echo Running unit tests...
call npm test
if %errorlevel% neq 0 (
    echo Unit tests failed!
    pause
    exit /b 1
)

echo.
echo Creating package (ignoring type definition warnings)...
call npm run package

echo.
echo ========================================
echo Process Complete!
echo ========================================
echo.
echo Check dist\ folder for the latest .pbiviz file
echo.
dir dist\*.pbiviz /o-d
echo.
pause