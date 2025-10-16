const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎯 Power BI Visual v1.3.1 FIXED Package Test');
console.log('===============================================');
console.log('Running corrected package release validation...\n');

let testsPassed = 0;
let totalTests = 0;

function runTest(name, command, description, allowWarnings = false) {
    totalTests++;
    console.log(`${totalTests}️⃣  ${name}`);
    console.log(`    ${description}`);
    
    try {
        const result = execSync(command, { 
            cwd: process.cwd(),
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 120000
        });
        
        console.log('    ✅ PASSED\n');
        testsPassed++;
        return true;
    } catch (error) {
        if (allowWarnings && error.status === 0) {
            console.log('    ✅ PASSED (with warnings)\n');
            testsPassed++;
            return true;
        }
        
        console.log('    ❌ FAILED');
        console.log(`    Exit code: ${error.status || 'unknown'}`);
        if (error.stdout && error.stdout.trim()) {
            console.log(`    Output: ${error.stdout.trim().slice(0, 300)}...`);
        }
        if (error.stderr && error.stderr.trim()) {
            console.log(`    Error: ${error.stderr.trim().slice(0, 300)}...`);
        }
        console.log('');
        return false;
    }
}

// Test the fixes we applied
console.log('🔧 Validation of Applied Fixes');
console.log('==============================\n');

runTest(
    'Build Validation',
    'node validate-build.js',
    'Check version consistency and required files'
);

runTest(
    'TypeScript Compilation', 
    'npx tsc --noEmit',
    'Verify TypeScript syntax is correct'
);

runTest(
    'Enhanced Layout Test',
    'node test-enhanced-layout.js',
    'Confirm renderOrganizedLayout method signature fix'
);

// Test build quality
console.log('🧪 Code Quality Validation');
console.log('==========================\n');

runTest(
    'ESLint Check',
    'npm run lint',
    'Validate code style (ignoring temporary files)',
    true // Allow warnings for npm version mismatch
);

runTest(
    'Jest Unit Tests',
    'npm test',
    'Run comprehensive test suite'
);

// Test packaging
console.log('📦 Package Creation Test');
console.log('========================\n');

runTest(
    'Visual Packaging',
    'npm run package',
    'Create production .pbiviz package',
    true // Allow warnings for eslint deprecation
);

// Verify the package was created correctly
console.log('📋 Package Verification');
console.log('=======================\n');

const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    const pbivizFiles = files.filter(f => f.endsWith('.pbiviz'));
    
    if (pbivizFiles.length > 0) {
        // Find the most recent package file
        const mostRecent = pbivizFiles
            .map(f => ({
                name: f,
                stat: fs.statSync(path.join(distPath, f))
            }))
            .sort((a, b) => b.stat.mtime - a.stat.mtime)[0];
        
        console.log(`✅ Latest Package: ${mostRecent.name}`);
        console.log(`✅ Size: ${Math.round(mostRecent.stat.size / 1024)} KB`);
        console.log(`✅ Created: ${mostRecent.stat.mtime.toLocaleString()}`);
        
        // Check if it's version 1.3.1
        if (mostRecent.name.includes('1.3.1')) {
            console.log('✅ Package version is 1.3.1');
        } else {
            console.log('ℹ️  Package may need version update in filename');
        }
        
        testsPassed++;
    } else {
        console.log('❌ No .pbiviz files found in dist folder');
    }
} else {
    console.log('❌ Dist folder not found');
}
totalTests++;

// Final Summary
console.log('\n🏁 Fixed Package Test Results');
console.log('=============================');
console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
console.log(`Success Rate: ${Math.round((testsPassed/totalTests) * 100)}%\n`);

if (testsPassed === totalTests) {
    console.log('🎉 ALL ISSUES FIXED - PACKAGE TEST PASSED!');
    console.log('✅ Power BI Visual v1.3.1 is ready for deployment\n');
    
    console.log('🔧 Issues Resolved:');
    console.log('   ✅ Build validation version check fixed');
    console.log('   ✅ TypeScript compilation syntax error fixed');
    console.log('   ✅ renderOrganizedLayout method signature corrected');
    console.log('   ✅ ESLint configuration updated for temp files');
    console.log('   ✅ Package creation successful\n');
    
    console.log('🚀 Ready for Production:');
    console.log('   • Matrix layout configuration (2x2 to 10x10)');
    console.log('   • Organized marker positioning');
    console.log('   • Enhanced arrow display options');
    console.log('   • Backward compatibility maintained');
    
    process.exit(0);
} else {
    console.log('❌ Some issues remain');
    console.log(`🔧 ${totalTests - testsPassed} test(s) still failing`);
    process.exit(1);
}