const { execSync } = require('child_process');

console.log('🔍 Quick TypeScript Fix Verification');
console.log('====================================\n');

try {
    console.log('Testing TypeScript compilation...');
    const result = execSync('npx tsc --noEmit', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 60000
    });
    
    console.log('✅ TypeScript compilation PASSED!');
    console.log('🎉 Arrow rendering syntax error has been fixed');
    
    // Also test the enhanced layout
    console.log('\nTesting enhanced layout...');
    execSync('node test-enhanced-layout.js', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
    });
    
    console.log('✅ Enhanced layout test PASSED!');
    console.log('\n🚀 Core fixes are working correctly');
    
} catch (error) {
    console.log('❌ Tests FAILED');
    console.log('Error:', error.message);
    if (error.stdout) console.log('Output:', error.stdout);
    process.exit(1);
}