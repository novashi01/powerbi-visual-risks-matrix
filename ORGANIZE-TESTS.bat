@echo off
echo.
echo ================================================
echo Test File Organization for Risk Matrix Visual
echo ================================================
echo.
echo This will move all .test.ts files from src/ to test/
echo and update configuration files accordingly.
echo.
pause

cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

echo.
echo Running organization script...
node organize-tests.js

echo.
echo ================================================
echo Verifying the organization...
echo ================================================
echo.

echo Testing compilation...
call npx tsc --noEmit

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  TypeScript compilation has errors
    echo Check if it's just node_modules or actual code issues
    echo.
) else (
    echo.
    echo ✅ TypeScript compilation passed!
    echo.
)

echo.
echo Running tests...
call npm test

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Some tests failed - review output above
    echo.
) else (
    echo.
    echo ✅ All tests passed!
    echo.
)

echo.
echo ================================================
echo Organization Complete!
echo ================================================
echo.
echo Test files are now in: test\
echo Production code remains in: src\
echo.
echo Contents of test folder:
dir /b test\*.ts
echo.
pause