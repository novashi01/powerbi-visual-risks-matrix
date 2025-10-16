// Verify the brace fix
const fs = require('fs');

console.log('✅ Verifying brace fix...\n');

try {
    const content = fs.readFileSync('src/visual.ts', 'utf8');
    
    // Count braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const balance = openBraces - closeBraces;
    
    console.log(`📊 Brace Count:`);
    console.log(`   Opening braces: ${openBraces}`);
    console.log(`   Closing braces: ${closeBraces}`);
    console.log(`   Balance: ${balance}`);
    
    // Check file ending
    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1].trim();
    const secondLastLine = lines[lines.length - 2]?.trim() || '';
    
    console.log(`\n📄 File Ending:`);
    console.log(`   Second last line: "${secondLastLine}"`);
    console.log(`   Last line: "${lastLine}"`);
    
    // Verify class structure
    const hasProperExport = content.includes('export class Visual implements IVisual');
    const hasProperClosing = lastLine === '}' && !content.includes('}\n}');
    
    console.log(`\n🔍 Structure Check:`);
    console.log(`   Proper export: ${hasProperExport ? '✅' : '❌'}`);
    console.log(`   Proper closing: ${hasProperClosing ? '✅' : '❌'}`);
    console.log(`   Balanced braces: ${balance === 0 ? '✅' : '❌'}`);
    
    if (balance === 0 && hasProperExport && hasProperClosing) {
        console.log('\n🎉 All fixes verified! File structure is correct.');
        console.log('\n🚀 Ready for:');
        console.log('   npm test');
        console.log('   npm run package');
        process.exit(0);
    } else {
        console.log('\n❌ Issues remain');
        process.exit(1);
    }
    
} catch (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
}