@echo off
echo.
echo ================================================
echo v1.3.2 Coding Complete - Quick Verification
echo ================================================
echo.

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo 1. Testing TypeScript compilation...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo    ❌ TypeScript compilation failed
    echo    Review errors above
    pause
    exit /b 1
)
echo    ✅ TypeScript compilation passed
echo.

echo 2. Running tests...
call npm test
if %errorlevel% neq 0 (
    echo    ⚠️  Some tests failed - review above
) else (
    echo    ✅ Tests passed
)
echo.

echo 3. Creating package...
call npm run package
if %errorlevel% neq 0 (
    echo    ⚠️  Package creation had issues
    pause
    exit /b 1
)
echo    ✅ Package created
echo.

echo ================================================
echo v1.3.2 Verification Complete!
echo ================================================
echo.
echo Check dist\ folder for the .pbiviz package
dir /b dist\*.pbiviz
echo.
echo Next steps:
echo 1. Import package into Power BI Desktop
echo 2. Test matrix configuration (3x3, 5x5, etc)
echo 3. Test marker border color, width, and transparency
echo 4. Test overflow handling (enable/disable scrolling)
echo 5. Test animation sequence (inherent, arrow, residual)
echo 6. Test organized layout mode with inherent risks
echo 7. Test arrow color and transparency settings
echo 8. Verify auto-fit viewport
echo 9. Deploy to production
echo.
pause