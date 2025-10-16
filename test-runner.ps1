Set-Location "C:\Users\novas\OneDrive - Northland Regional Council\Documents\PowerBI Backup\PBI Visual\myVisual"

Write-Host "🧪 Power BI Visual v1.3.1 Package Release Test" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: TypeScript compilation
Write-Host "1️⃣  Testing TypeScript compilation..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ TypeScript compilation passed" -ForegroundColor Green
} else {
    Write-Host "   ❌ TypeScript compilation failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Enhanced layout test (our recent fix)
Write-Host "2️⃣  Testing enhanced layout (renderOrganizedLayout fix)..." -ForegroundColor Yellow
node test-enhanced-layout.js
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Enhanced layout test passed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Enhanced layout test failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Linting
Write-Host "3️⃣  Running linting check..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Linting passed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Linting failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: Full test suite
Write-Host "4️⃣  Running full test suite..." -ForegroundColor Yellow
npm test
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Full test suite passed" -ForegroundColor Green
} else {
    Write-Host "   ❌ Test suite failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 5: Package creation
Write-Host "5️⃣  Packaging the visual..." -ForegroundColor Yellow
npm run package
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Visual packaged successfully" -ForegroundColor Green
} else {
    Write-Host "   ❌ Packaging failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "🎉 All v1.3.1 package tests passed!" -ForegroundColor Green
Write-Host "✅ Ready for Power BI deployment" -ForegroundColor Green