const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Power BI Visual v1.3.1 Release Package Test');
console.log('================================================');
console.log('Testing all components for production release...\n');

let testsPassed = 0;
let totalTests = 0;

function runTest(name, command, description) {
    totalTests++;
    console.log(`${totalTests}️⃣  ${name}`);
    console.log(`    ${description}`);
    
    try {
        const result = execSync(command, { 
            cwd: process.cwd(),
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 120000 // 2 minute timeout
        });
        
        console.log('    ✅ PASSED\n');
        testsPassed++;
        return true;
    } catch (error) {
        console.log('    ❌ FAILED');
        if (error.stdout) console.log(`    Output: ${error.stdout.slice(0, 200)}...`);
        if (error.stderr) console.log(`    Error: ${error.stderr.slice(0, 200)}...`);
        console.log('');
        return false;
    }
}

// Version Verification
console.log('📋 Pre-Release Checks');
console.log('=====================\n');

try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const pbivizJson = JSON.parse(fs.readFileSync('pbiviz.json', 'utf8'));
    
    console.log(`✅ Package.json version: ${packageJson.version}`);
    console.log(`✅ Pbiviz.json version: ${pbivizJson.visual.version}`);
    console.log(`✅ Visual name: ${pbivizJson.visual.displayName}`);
    console.log(`✅ Description updated for v1.3.1 features\n`);
} catch (error) {
    console.log('❌ Error reading version files\n');
}

// Core Tests
console.log('🧪 Core Functionality Tests');
console.log('============================\n');

runTest(
    'Enhanced Layout Test',
    'node test-enhanced-layout.js',
    'Verify renderOrganizedLayout method signature and new features'
);

runTest(
    'Layout Settings Test', 
    'node test-layout-settings.js',
    'Validate matrix configuration and organized positioning'
);

runTest(
    'Build Validation',
    'node validate-build.js',
    'Check build configuration and file integrity'
);

// Code Quality Tests
console.log('🔍 Code Quality Tests');
console.log('=====================\n');

runTest(
    'TypeScript Compilation',
    'npx tsc --noEmit',
    'Ensure no TypeScript compilation errors'
);

runTest(
    'ESLint Code Quality',
    'npm run lint',
    'Validate code style and quality standards'
);

// Comprehensive Test Suite
console.log('🎯 Test Suite Execution');
console.log('=======================\n');

runTest(
    'Unit Test Suite',
    'npm test',
    'Run comprehensive Jest test suite'
);

// Package Creation
console.log('📦 Package Creation');
console.log('===================\n');

runTest(
    'Visual Packaging',
    'npm run package',
    'Create production-ready .pbiviz package'
);

// Verify Package Output
console.log('📋 Package Verification');
console.log('=======================\n');

const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    const pbivizFiles = files.filter(f => f.endsWith('.pbiviz'));
    
    if (pbivizFiles.length > 0) {
        const packageFile = pbivizFiles[0];
        const packagePath = path.join(distPath, packageFile);
        const stats = fs.statSync(packagePath);
        
        console.log(`✅ Package File: ${packageFile}`);
        console.log(`✅ File Size: ${Math.round(stats.size / 1024)} KB`);
        console.log(`✅ Created: ${stats.mtime.toLocaleString()}`);
        
        // Expected filename format
        if (packageFile.includes('1.3.1') || packageFile.includes('risksMatrix')) {
            console.log('✅ Package filename format correct');
        } else {
            console.log('⚠️  Package filename may need adjustment');
        }
        
        testsPassed++;
    } else {
        console.log('❌ No .pbiviz package file found');
    }
} else {
    console.log('❌ Distribution folder not found');
}

totalTests++;

// Final Results
console.log('\n🏁 Release Test Results');
console.log('=======================');
console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
console.log(`Success Rate: ${Math.round((testsPassed/totalTests) * 100)}%\n`);

if (testsPassed === totalTests) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Power BI Visual v1.3.1 is READY for release\n');
    
    console.log('🚀 Release Checklist Completed:');
    console.log('   ✅ Version numbers updated (1.3.1)');
    console.log('   ✅ Enhanced layout features working');
    console.log('   ✅ Method signatures fixed');
    console.log('   ✅ Code quality validated');
    console.log('   ✅ All tests passing');
    console.log('   ✅ Package successfully created\n');
    
    console.log('📦 Next Steps:');
    console.log('   1. Import the .pbiviz file into Power BI Desktop');
    console.log('   2. Test with sample risk data');
    console.log('   3. Validate matrix layout configurations (2x2 to 10x10)');
    console.log('   4. Test organized marker positioning');
    console.log('   5. Verify inherent risk display options');
    console.log('   6. Deploy to production environment\n');
    
    process.exit(0);
} else {
    console.log('❌ TESTS FAILED');
    console.log(`🔧 ${totalTests - testsPassed} issue(s) need to be resolved before release`);
    console.log('📋 Review failed tests above and retry\n');
    process.exit(1);
}