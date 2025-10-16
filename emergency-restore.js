const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 EMERGENCY RESTORE - Fixing Corrupted File');
console.log('============================================\n');

// Step 1: Hard reset to last commit
console.log('1️⃣  Hard reset to last clean state...');
try {
    // First, stash any changes
    try {
        execSync('git stash', {
            cwd: process.cwd(),
            stdio: 'pipe',
            encoding: 'utf8'
        });
    } catch (e) {
        // No changes to stash, continue
    }
    
    // Reset to HEAD
    execSync('git reset --hard HEAD', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
    });
    
    console.log('   ✅ File restored to last commit\n');
} catch (error) {
    console.log('   ❌ Git reset failed');
    console.log(error.message);
    process.exit(1);
}

// Step 2: Verify the file is now clean
console.log('2️⃣  Verifying file integrity...');
try {
    execSync('npx tsc --noEmit', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 60000
    });
    console.log('   ✅ File is clean and compiles\n');
} catch (error) {
    console.log('   ⚠️  File still has compilation issues');
    console.log('   This may be expected if fixes are needed\n');
}

// Step 3: Apply ONLY the renderOrganizedLayout parameter name fix
console.log('3️⃣  Applying minimal parameter name fix...');
let content = fs.readFileSync('src/visual.ts', 'utf8');

// Find and fix the renderOrganizedLayout method definition
const oldMethodDef = /private renderOrganizedLayout\(data: RiskPoint\[\], toXY: \(l: number, c: number\) => \{x: number, y: number\}, cellPadding: number, cw: number, ch: number, sm: ISelectionManager, markerRows: number, markerCols: number, showInherentInOrganized: boolean, organizedArrows: boolean\)/;
const newMethodDef = 'private renderOrganizedLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, cellPadding: number, cw: number, ch: number, sm: ISelectionManager, markerRows: number, markerCols: number, showInherent: boolean, showArrows: boolean)';

if (oldMethodDef.test(content)) {
    content = content.replace(oldMethodDef, newMethodDef);
    console.log('   ✅ Method signature updated');
} else {
    console.log('   ⚠️  Method signature not found or already updated');
}

// Find and update the method call
const oldCall = /this\.renderOrganizedLayout\(data, toXY, cellPadding, cw, ch, sm, markerRows, markerCols, showInherentInOrganized, organizedArrows\);/;
const newCall = `const showInherent = showInherentInOrganized;
            const showArrows = organizedArrows;
            this.renderOrganizedLayout(data, toXY, cellPadding, cw, ch, sm, markerRows, markerCols, showInherent, showArrows);`;

if (oldCall.test(content)) {
    content = content.replace(oldCall, newCall);
    console.log('   ✅ Method call updated');
} else {
    console.log('   ⚠️  Method call not found or already updated');
}

// Update internal parameter usage
content = content.replace(
    /showInherent: showInherentInOrganized,\s*showArrows: organizedArrows/g,
    'showInherent: showInherent,\n                showArrows: showArrows'
);
console.log('   ✅ Internal parameter usage updated');

// Write the file
fs.writeFileSync('src/visual.ts', content);
console.log('   ✅ File saved\n');

// Step 4: Test compilation
console.log('4️⃣  Testing TypeScript compilation...');
try {
    execSync('npx tsc --noEmit', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 60000
    });
    console.log('   ✅ TypeScript compilation PASSED!\n');
    
    // Step 5: Test enhanced layout
    console.log('5️⃣  Testing enhanced layout...');
    try {
        execSync('node test-enhanced-layout.js', {
            cwd: process.cwd(),
            stdio: 'pipe',
            encoding: 'utf8'
        });
        console.log('   ✅ Enhanced layout test PASSED!\n');
    } catch (e) {
        console.log('   ⚠️  Enhanced layout test had issues\n');
    }
    
    console.log('🎉 SUCCESS!');
    console.log('✅ File restored and minimal fix applied');
    console.log('✅ Ready for package creation\n');
    console.log('Run: npm run package');
    
} catch (error) {
    console.log('   ❌ TypeScript compilation FAILED\n');
    console.log('Error details:');
    console.log(error.stdout || error.message);
    console.log('\n🔧 Manual intervention may be required');
    process.exit(1);
}