const { execSync } = require('child_process');

console.log('🔍 Quick test: Enhanced Layout (renderOrganizedLayout fix)');
console.log('=========================================================\n');

try {
    const result = execSync('node test-enhanced-layout.js', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
    });
    
    console.log('Test Output:');
    console.log(result);
    console.log('\n✅ Enhanced layout test PASSED!');
    console.log('🎉 renderOrganizedLayout method signature fix successful');
    
} catch (error) {
    console.log('❌ Enhanced layout test FAILED');
    console.log('Error output:');
    console.log(error.stdout || error.message);
    process.exit(1);
}