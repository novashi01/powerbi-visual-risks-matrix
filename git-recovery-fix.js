const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 Git-Based Recovery and Targeted Fix');
console.log('=======================================\n');

// Step 1: Check git status
console.log('1️⃣  Checking git status...');
try {
    const status = execSync('git status src/visual.ts', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
    });
    console.log(status);
} catch (e) {
    console.log('   Git status check completed');
}

// Step 2: Create backup of current broken file
console.log('\n2️⃣  Creating backup of current file...');
const brokenContent = fs.readFileSync('src/visual.ts', 'utf8');
fs.writeFileSync('src/visual.ts.broken', brokenContent);
console.log('   ✅ Backup saved as visual.ts.broken');

// Step 3: Restore from git
console.log('\n3️⃣  Restoring from git...');
try {
    execSync('git checkout HEAD -- src/visual.ts', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
    });
    console.log('   ✅ File restored from git');
} catch (error) {
    console.log('   ❌ Git restore failed');
    console.log('   Trying alternative: git restore');
    try {
        execSync('git restore src/visual.ts', {
            cwd: process.cwd(),
            stdio: 'pipe',
            encoding: 'utf8'
        });
        console.log('   ✅ File restored using git restore');
    } catch (e2) {
        console.log('   ❌ Alternative also failed');
        // Restore the broken file
        fs.writeFileSync('src/visual.ts', brokenContent);
        process.exit(1);
    }
}

// Step 4: Apply only the necessary fixes
console.log('\n4️⃣  Applying targeted fixes...');

let content = fs.readFileSync('src/visual.ts', 'utf8');

// Fix 1: Update renderOrganizedLayout method signature
console.log('   Fixing renderOrganizedLayout method parameters...');
content = content.replace(
    /private renderOrganizedLayout\(data: RiskPoint\[\], toXY: \(l: number, c: number\) => \{x: number, y: number\}, cellPadding: number, cw: number, ch: number, sm: ISelectionManager, markerRows: number, markerCols: number, showInherentInOrganized: boolean, organizedArrows: boolean\)/,
    'private renderOrganizedLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, cellPadding: number, cw: number, ch: number, sm: ISelectionManager, markerRows: number, markerCols: number, showInherent: boolean, showArrows: boolean)'
);

// Fix 2: Update method call to use local variables
console.log('   Fixing renderOrganizedLayout method call...');
content = content.replace(
    /this\.renderOrganizedLayout\(data, toXY, cellPadding, cw, ch, sm, markerRows, markerCols, showInherentInOrganized, organizedArrows\);/,
    `const showInherent = showInherentInOrganized;
            const showArrows = organizedArrows;
            this.renderOrganizedLayout(data, toXY, cellPadding, cw, ch, sm, markerRows, markerCols, showInherent, showArrows);`
);

// Fix 3: Update internal usage of parameters
console.log('   Fixing internal parameter references...');
content = content.replace(
    /showInherent: showInherentInOrganized,\s*showArrows: organizedArrows/,
    'showInherent: showInherent,\n                showArrows: showArrows'
);

// Fix 4: Ensure arrow rendering has proper if statement
console.log('   Ensuring proper arrow rendering structure...');
if (!content.includes('if (shouldShowArrow) {')) {
    // Find the arrow rendering block and wrap it properly
    content = content.replace(
        /(const shouldShowArrow = [\s\S]*?;\s*)const adjustedPos = this\.calculateArrowPosition/,
        '$1\n        if (shouldShowArrow) {\n            const adjustedPos = this.calculateArrowPosition'
    );
    
    // Add closing brace for if statement
    content = content.replace(
        /(this\.gArrows\.appendChild\(line\);)(\s*)(const showLabels)/,
        '$1\n        }$2$3'
    );
}

// Write the fixed content
fs.writeFileSync('src/visual.ts', content);
console.log('   ✅ All fixes applied');

// Step 5: Test compilation
console.log('\n5️⃣  Testing TypeScript compilation...');
try {
    execSync('npx tsc --noEmit', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 60000
    });
    console.log('   ✅ TypeScript compilation PASSED!\n');
    console.log('🎉 SUCCESS: File restored and fixes applied correctly');
    console.log('✅ Ready to proceed with package creation');
} catch (error) {
    console.log('   ❌ TypeScript compilation FAILED\n');
    console.log('Error output:');
    console.log(error.stdout || error.message);
    console.log('\n💡 The broken file has been saved as visual.ts.broken');
    console.log('💡 You may need to manually review the fixes');
}