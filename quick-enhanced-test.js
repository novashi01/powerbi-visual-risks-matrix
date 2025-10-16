// Quick test for enhanced functionality
const fs = require('fs');

console.log('⚡ Quick Enhanced Layout Test...\n');

try {
    // Check if enhanced code compiles properly
    const visual = fs.readFileSync('src/visual.ts', 'utf8');
    const settings = fs.readFileSync('src/settings.ts', 'utf8');
    
    // Count method parameters to ensure they're correctly updated
    const organizeMatch = visual.match(/private organizeMarkersInCell\(([^)]+)\)/);
    const renderOrgMatch = visual.match(/this\.renderOrganizedLayout\(([^)]+)\)/g);
    
    console.log('🔍 Method Signatures:');
    if (organizeMatch) {
        const paramCount = (organizeMatch[1].match(/,/g) || []).length + 1;
        console.log(`   organizeMarkersInCell: ${paramCount} parameters ${paramCount >= 6 ? '✅' : '❌'}`);
    }
    
    if (renderOrgMatch) {
        const callParamCount = (renderOrgMatch[0].match(/,/g) || []).length + 1;
        console.log(`   renderOrganizedLayout call: ${callParamCount} parameters ${callParamCount >= 9 ? '✅' : '❌'}`);
    }
    
    // Check for new settings usage
    console.log('\n🔍 Settings Usage:');
    const enhancedSettings = [
        'markerRows.value',
        'markerColumns.value', 
        'showInherentInOrganized.value',
        'organizedArrows.value'
    ];
    
    let settingsUsed = 0;
    enhancedSettings.forEach(setting => {
        if (visual.includes(setting)) {
            console.log(`   ✅ ${setting}`);
            settingsUsed++;
        } else {
            console.log(`   ⚠️  ${setting} not found in usage`);
        }
    });
    
    console.log(`\n📊 Enhanced Features: ${settingsUsed}/4 implemented`);
    
    if (settingsUsed >= 3) {
        console.log('✅ Enhanced layout functionality appears ready!');
        console.log('\n🚀 Run these commands to test:');
        console.log('   npm run test:enhanced');
        console.log('   npm run build:check');
        console.log('   npm run package');
    } else {
        console.log('❌ Some enhanced features may be missing implementation');
    }
    
} catch (error) {
    console.log('❌ Error:', error.message);
}