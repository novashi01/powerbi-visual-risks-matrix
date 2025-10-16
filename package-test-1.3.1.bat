@echo off
echo Starting Power BI Visual v1.3.1 Package Release Test...
echo.

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo 1. Testing TypeScript compilation...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo ❌ TypeScript compilation failed
    exit /b 1
)
echo ✅ TypeScript compilation passed
echo.

echo 2. Running linting check...
call npm run lint
if %errorlevel% neq 0 (
    echo ❌ Linting failed
    exit /b 1
)
echo ✅ Linting passed
echo.

echo 3. Running enhanced layout test...
call node test-enhanced-layout.js
if %errorlevel% neq 0 (
    echo ❌ Enhanced layout test failed
    exit /b 1
)
echo ✅ Enhanced layout test passed
echo.

echo 4. Running full test suite...
call npm test
if %errorlevel% neq 0 (
    echo ❌ Test suite failed
    exit /b 1
)
echo ✅ Full test suite passed
echo.

echo 5. Packaging the visual...
call npm run package
if %errorlevel% neq 0 (
    echo ❌ Packaging failed
    exit /b 1
)
echo ✅ Visual packaged successfully
echo.

echo 🎉 All v1.3.1 package tests passed!
echo ✅ Ready for Power BI deployment