// Quick validation after syntax fixes
const fs = require('fs');

console.log('🔧 Quick Fix Validation...\n');

try {
    // Test 1: Check for proper method declarations
    const visualContent = fs.readFileSync('src/visual.ts', 'utf8');
    
    // Count method declarations
    const renderMarkerCount = (visualContent.match(/private renderMarker\(/g) || []).length;
    const createArrowMarkerCount = (visualContent.match(/private createArrowMarker\(/g) || []).length;
    const calculateArrowPositionCount = (visualContent.match(/private calculateArrowPosition\(/g) || []).length;
    
    console.log('🔍 Method Declaration Check:');
    console.log(`   renderMarker methods: ${renderMarkerCount} ${renderMarkerCount === 1 ? '✅' : '❌'}`);
    console.log(`   createArrowMarker methods: ${createArrowMarkerCount} ${createArrowMarkerCount === 1 ? '✅' : '❌'}`);
    console.log(`   calculateArrowPosition methods: ${calculateArrowPositionCount} ${calculateArrowPositionCount === 1 ? '✅' : '❌'}`);
    
    // Test 2: Check for syntax issues
    const syntaxIssues = [
        'return { start, end };', // Should be inside a function
        'private renderMarker(marker: any, sm: ISelectionManager, useOrganizedPosition: boolean) {', // Should be properly declared
    ];
    
    console.log('\n🔍 Syntax Structure Check:');
    let syntaxOk = true;
    
    // Check for proper class ending
    if (visualContent.endsWith('}\n') || visualContent.endsWith('}')) {
        console.log('   Class properly closed: ✅');
    } else {
        console.log('   Class properly closed: ❌');
        syntaxOk = false;
    }
    
    // Check for balanced braces
    const openBraces = (visualContent.match(/{/g) || []).length;
    const closeBraces = (visualContent.match(/}/g) || []).length;
    console.log(`   Brace balance: ${openBraces}/${closeBraces} ${openBraces === closeBraces ? '✅' : '❌'}`);
    
    if (openBraces !== closeBraces) {
        syntaxOk = false;
    }
    
    // Test 3: Check for proper imports and exports
    console.log('\n🔍 Import/Export Check:');
    const hasProperExport = visualContent.includes('export class Visual implements IVisual');
    const hasProperImports = visualContent.includes('import powerbi from "powerbi-visuals-api"');
    
    console.log(`   Export declaration: ${hasProperExport ? '✅' : '❌'}`);
    console.log(`   Import statements: ${hasProperImports ? '✅' : '❌'}`);
    
    if (renderMarkerCount === 1 && createArrowMarkerCount === 1 && calculateArrowPositionCount === 1 && syntaxOk && hasProperExport && hasProperImports) {
        console.log('\n🎉 Syntax fixes appear successful!');
        console.log('\n🚀 Next steps:');
        console.log('   1. Run: npm run test:layout');
        console.log('   2. Run: npm test');
        console.log('   3. Run: npm run package');
        process.exit(0);
    } else {
        console.log('\n❌ Still has issues. Manual review needed.');
        process.exit(1);
    }
    
} catch (error) {
    console.log('❌ Error during validation:', error.message);
    process.exit(1);
}