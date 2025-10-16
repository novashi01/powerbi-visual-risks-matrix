const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Power BI Visual v1.3.1 Complete Package Release Test');
console.log('========================================================\n');

let allTestsPassed = true;
const testResults = [];

function runTest(testName, command, description) {
    console.log(`🧪 ${testName}: ${description}`);
    try {
        console.log(`   Running: ${command}`);
        const result = execSync(command, { 
            cwd: process.cwd(),
            stdio: 'pipe',
            encoding: 'utf8'
        });
        
        console.log('   ✅ PASSED\n');
        testResults.push({ name: testName, status: 'PASSED', output: result.trim() });
        return true;
    } catch (error) {
        console.log('   ❌ FAILED');
        console.log(`   Error: ${error.message}\n`);
        testResults.push({ name: testName, status: 'FAILED', error: error.message });
        allTestsPassed = false;
        return false;
    }
}

// Test 1: Enhanced Layout Test (our recent fix)
runTest(
    'Enhanced Layout', 
    'node test-enhanced-layout.js',
    'Verify renderOrganizedLayout method signature fix'
);

// Test 2: Layout Settings Test
runTest(
    'Layout Settings',
    'node test-layout-settings.js', 
    'Validate layout configuration settings'
);

// Test 3: TypeScript Compilation
runTest(
    'TypeScript Compilation',
    'npx tsc --noEmit',
    'Check for TypeScript compilation errors'
);

// Test 4: Build Validation
runTest(
    'Build Validation',
    'node validate-build.js',
    'Validate build configuration and dependencies'
);

// Test 5: ESLint
runTest(
    'Code Linting',
    'npm run lint',
    'Check code style and quality'
);

// Test 6: Jest Test Suite
runTest(
    'Unit Tests',
    'npm test',
    'Run comprehensive unit test suite'
);

// Test 7: Package Creation
runTest(
    'Visual Packaging',
    'npm run package',
    'Create .pbiviz package file'
);

// Verify package was created
console.log('📦 Verifying Package Creation...');
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    const pbivizFiles = files.filter(f => f.endsWith('.pbiviz'));
    
    if (pbivizFiles.length > 0) {
        const packageFile = pbivizFiles[0];
        const packagePath = path.join(distPath, packageFile);
        const stats = fs.statSync(packagePath);
        
        console.log(`   ✅ Package created: ${packageFile}`);
        console.log(`   📏 File size: ${Math.round(stats.size / 1024)} KB`);
        console.log(`   📅 Created: ${stats.mtime.toLocaleString()}\n`);
    } else {
        console.log('   ❌ No .pbiviz file found in dist folder\n');
        allTestsPassed = false;
    }
} else {
    console.log('   ❌ Dist folder not found\n');
    allTestsPassed = false;
}

// Final Summary
console.log('📊 Test Summary');
console.log('===============');
testResults.forEach(result => {
    const status = result.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${result.name}: ${result.status}`);
});

console.log('\n🎯 Version Check');
console.log('================');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const pbivizJson = JSON.parse(fs.readFileSync('pbiviz.json', 'utf8'));
    
    console.log(`Package.json version: ${packageJson.version}`);
    console.log(`Pbiviz.json version: ${pbivizJson.visual.version}`);
    
    if (packageJson.version === '1.3.1') {
        console.log('✅ Package version is 1.3.1');
    } else {
        console.log('⚠️  Package version is not 1.3.1');
    }
} catch (error) {
    console.log('❌ Error reading version information');
}

if (allTestsPassed) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Power BI Visual v1.3.1 is ready for release');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Import .pbiviz file into Power BI Desktop');
    console.log('   2. Test with sample data');
    console.log('   3. Validate new matrix layout features');
    console.log('   4. Deploy to production environment');
    process.exit(0);
} else {
    console.log('\n❌ SOME TESTS FAILED');
    console.log('🔧 Review failed tests above before release');
    process.exit(1);
}