// Fix file ending issue
const fs = require('fs');

console.log('🔧 Fixing visual.ts file ending...');

try {
    let content = fs.readFileSync('src/visual.ts', 'utf8');
    
    // Remove any trailing periods or extra whitespace at the end
    content = content.replace(/\.+\s*$/, '');
    
    // Ensure proper ending
    if (!content.endsWith('}')) {
        content += '\n}';
    }
    
    // Write back the fixed content
    fs.writeFileSync('src/visual.ts', content);
    
    console.log('✅ File ending fixed!');
    
    // Verify the fix
    const verifyContent = fs.readFileSync('src/visual.ts', 'utf8');
    const lastLine = verifyContent.split('\n').pop();
    
    console.log(`Last line: "${lastLine}"`);
    
    if (verifyContent.endsWith('}') || verifyContent.endsWith('}\n')) {
        console.log('✅ Class properly closed now!');
        process.exit(0);
    } else {
        console.log('❌ Still has issues');
        process.exit(1);
    }
    
} catch (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
}