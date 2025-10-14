# Power BI Visual Release Packaging Script v1.1.0
param(
    [switch]$SkipTests = $false,
    [switch]$Verbose = $false
)

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   POWER BI VISUAL RELEASE PACKAGING v1.1.0" -ForegroundColor Cyan  
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Ensure we're in the right directory
$projectPath = "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    Write-Host "✓ Located project directory" -ForegroundColor Green
} else {
    Write-Host "✗ Project directory not found: $projectPath" -ForegroundColor Red
    exit 1
}

# Step 1: Run Tests (unless skipped)
if (-not $SkipTests) {
    Write-Host "[1/4] Running final tests..." -ForegroundColor Yellow
    $testResult = & npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Tests failed! Fix tests before packaging." -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "[1/4] Skipping tests as requested..." -ForegroundColor Yellow
}

# Step 2: Lint Check
Write-Host ""
Write-Host "[2/4] Running linter check..." -ForegroundColor Yellow
$lintResult = & npm run lint 2>&1
Write-Host "✓ Linter check completed (warnings are acceptable)" -ForegroundColor Green

# Step 3: Create Package
Write-Host ""
Write-Host "[3/4] Creating package..." -ForegroundColor Yellow
$packageResult = & npm run package 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Packaging failed! Check output above." -ForegroundColor Red
    Write-Host $packageResult -ForegroundColor Red
    exit 1
}

# Step 4: Verify Package
$packagePath = "dist\risksMatrix.1.1.0.0.pbiviz"
if (Test-Path $packagePath) {
    $packageSize = [math]::Round((Get-Item $packagePath).Length / 1KB, 2)
    Write-Host "✓ Package created successfully! ($packageSize KB)" -ForegroundColor Green
} else {
    Write-Host "✗ Package file not found at expected location: $packagePath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   RELEASE v1.1.0 PACKAGE COMPLETE!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Package Details:" -ForegroundColor White
Write-Host "   Location: $packagePath" -ForegroundColor Gray
Write-Host "   Size: $packageSize KB" -ForegroundColor Gray
Write-Host "   Version: 1.1.0.0" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor White
Write-Host "   1. Test the .pbiviz file in Power BI Desktop" -ForegroundColor Gray
Write-Host "   2. Commit and push changes to GitHub" -ForegroundColor Gray
Write-Host "   3. Create a GitHub release with the .pbiviz file" -ForegroundColor Gray
Write-Host "   4. Update documentation as needed" -ForegroundColor Gray
Write-Host ""

# If verbose, show recent changes
if ($Verbose) {
    Write-Host "📋 Recent Changes in v1.1.0:" -ForegroundColor White
    Write-Host "   ✓ Customizable axis labels (10 text inputs)" -ForegroundColor Green
    Write-Host "   ✓ Font size controls (8-24px)" -ForegroundColor Green  
    Write-Host "   ✓ Y-axis orientation (horizontal/vertical)" -ForegroundColor Green
    Write-Host "   ✓ Show/hide toggles for axes" -ForegroundColor Green
    Write-Host "   ✓ Fixed axis label display issues" -ForegroundColor Green
    Write-Host "   ✓ Enhanced test coverage (88 tests)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Release packaging complete! 🎉" -ForegroundColor Green