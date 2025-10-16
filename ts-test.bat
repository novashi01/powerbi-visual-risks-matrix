@echo off
cd "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"
echo Testing TypeScript compilation...
npx tsc --noEmit --strict
echo.
echo Exit code: %errorlevel%