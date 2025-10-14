@echo off
echo ===========================================
echo   POWER BI VISUAL RELEASE PACKAGING v1.1.0
echo ===========================================
echo.

echo [1/4] Running final tests...
call npm test
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Tests failed! Fix tests before packaging.
    pause
    exit /b 1
)

echo.
echo [2/4] Running linter check...
call npm run lint
echo Linter check completed (warnings are acceptable for packaging)

echo.
echo [3/4] Creating package...
call npm run package
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Packaging failed! Check the output above.
    pause
    exit /b 1
)

echo.
echo [4/4] Package created successfully!
echo.
echo ===========================================
echo   RELEASE v1.1.0 PACKAGE COMPLETE!
echo ===========================================
echo.
echo Package location: dist\risksMatrix.1.1.0.0.pbiviz
echo.
echo Next steps:
echo 1. Test the .pbiviz file in Power BI Desktop
echo 2. Commit and push changes to GitHub
echo 3. Create a GitHub release with the .pbiviz file
echo 4. Update documentation as needed
echo.
pause