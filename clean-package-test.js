const { execSync } = require('child_process');
const fs = require('path');

console.log('🎯 CLEAN Package Test for v1.3.1');
console.log('==================================');
console.log('Using git-based recovery and targeted fixes\n');

function run(cmd, description) {
    console.log(`▶️  ${description}...`);
    try {
        execSync(cmd, {
            cwd: process.cwd(),
            stdio: 'inherit',
            encoding: 'utf8',
            timeout: 120000
        });
        console.log('   ✅ Success\n');
        return true;
    } catch (error) {
        console.log('   ❌ Failed\n');
        return false;
    }
}

// Recovery and fix
if (!run('node git-recovery-fix.js', 'Step 1: Git recovery and targeted fixes')) {
    console.log('🚨 Recovery failed - stopping');
    process.exit(1);
}

// Test compilation
if (!run('npx tsc --noEmit', 'Step 2: TypeScript compilation')) {
    console.log('🚨 Compilation failed - stopping');
    process.exit(1);
}

// Test enhanced layout
run('node test-enhanced-layout.js', 'Step 3: Enhanced layout test');

// Build validation
run('node validate-build.js', 'Step 4: Build validation');

// Run tests
run('npm test', 'Step 5: Unit tests');

// Package
if (run('npm run package', 'Step 6: Create package')) {
    console.log('\n🎉 PACKAGE CREATION SUCCESSFUL!');
    console.log('✅ Power BI Visual v1.3.1 is ready');
    console.log('📦 Check dist/ folder for the .pbiviz file\n');
} else {
    console.log('\n⚠️  Package creation had issues');
    console.log('Check the output above for details\n');
}