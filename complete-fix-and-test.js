const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Complete Fix and Package Test for v1.3.1');
console.log('=============================================\n');

function runCommand(description, command, allowFailure = false) {
    console.log(`🔄 ${description}...`);
    try {
        const result = execSync(command, {
            cwd: process.cwd(),
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 120000
        });
        console.log('   ✅ Success\n');
        return true;
    } catch (error) {
        if (allowFailure) {
            console.log('   ⚠️  Warning (but continuing)\n');
            return true;
        }
        console.log('   ❌ Failed');
        console.log(`   Error: ${error.message}\n`);
        return false;
    }
}

// Step 1: Fix structural issues
console.log('🔧 Step 1: Fix Structural Issues');
console.log('=================================\n');

runCommand('Repairing brace imbalances', 'node repair-braces.js');
runCommand('Fixing file endings', 'node fix-file-ending.js');

// Step 2: Test compilation
console.log('🧪 Step 2: Test Core Compilation');
console.log('=================================\n');

if (!runCommand('TypeScript compilation test', 'npx tsc --noEmit')) {
    console.log('❌ TypeScript compilation still failing. Manual intervention required.');
    
    // Let's check specific error details
    try {
        execSync('npx tsc --noEmit', {
            cwd: process.cwd(),
            stdio: 'inherit',
            encoding: 'utf8'
        });
    } catch (error) {
        console.log('\n🔍 Detailed TypeScript errors shown above');
    }
    
    process.exit(1);
}

// Step 3: Test functionality
console.log('🎯 Step 3: Test Enhanced Features');
console.log('=================================\n');

runCommand('Enhanced layout test', 'node test-enhanced-layout.js');
runCommand('Build validation', 'node validate-build.js');

// Step 4: Code quality
console.log('🔍 Step 4: Code Quality Checks');
console.log('==============================\n');

runCommand('ESLint check', 'npm run lint', true); // Allow warnings
runCommand('Jest unit tests', 'npm test');

// Step 5: Package creation
console.log('📦 Step 5: Package Creation');
console.log('===========================\n');

if (runCommand('Create package', 'npm run package', true)) {
    // Verify package was created
    const distPath = './dist';
    if (fs.existsSync(distPath)) {
        const files = fs.readdirSync(distPath).filter(f => f.endsWith('.pbiviz'));
        if (files.length > 0) {
            const latest = files[files.length - 1];
            const stats = fs.statSync(`${distPath}/${latest}`);
            console.log(`✅ Package created: ${latest}`);
            console.log(`✅ Size: ${Math.round(stats.size / 1024)} KB\n`);
        }
    }
}

console.log('🎉 Complete Fix and Test Finished!');
console.log('==================================');
console.log('✅ Power BI Visual v1.3.1 processing complete');
console.log('✅ Check above for any remaining issues');
console.log('✅ If all tests passed, ready for deployment\n');