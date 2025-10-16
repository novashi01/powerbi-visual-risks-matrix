const fs = require('fs');

console.log('🔍 Complete File Integrity Check');
console.log('=================================\n');

const content = fs.readFileSync('src/visual.ts', 'utf8');
const lines = content.split('\n');

// Count all brackets
const openBraces = (content.match(/{/g) || []).length;
const closeBraces = (content.match(/}/g) || []).length;
const openParens = (content.match(/\(/g) || []).length;
const closeParens = (content.match(/\)/g) || []).length;
const openBrackets = (content.match(/\[/g) || []).length;
const closeBrackets = (content.match(/\]/g) || []).length;

console.log('📊 Bracket Counts:');
console.log(`   Braces: ${openBraces} open, ${closeBraces} close (balance: ${openBraces - closeBraces})`);
console.log(`   Parentheses: ${openParens} open, ${closeParens} close (balance: ${openParens - closeParens})`);
console.log(`   Brackets: ${openBrackets} open, ${closeBrackets} close (balance: ${openBrackets - closeBrackets})`);

// Check for problematic lines
console.log('\n🔍 Checking problematic lines:');
[260, 615, 640].forEach(lineNum => {
    const line = lines[lineNum - 1];
    if (line) {
        console.log(`\nLine ${lineNum}: ${line.trim()}`);
        console.log(`   Length: ${line.length}`);
        console.log(`   First char code: ${line.charCodeAt(0)}`);
        console.log(`   Trim length: ${line.trim().length}`);
        
        // Check for weird characters
        const weirdChars = [];
        for (let i = 0; i < line.length; i++) {
            const code = line.charCodeAt(i);
            if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
                weirdChars.push({pos: i, code: code});
            }
        }
        if (weirdChars.length > 0) {
            console.log(`   ⚠️  Weird characters: ${JSON.stringify(weirdChars)}`);
        }
    }
});

// Check class structure
console.log('\n🏗️  Class Structure:');
const classMatch = content.match(/export class Visual implements IVisual/);
if (classMatch) {
    console.log('   ✅ Class declaration found');
} else {
    console.log('   ❌ Class declaration missing or malformed');
}

// Check for method declarations
const methods = content.match(/private \w+\([^)]*\):/g) || [];
console.log(`\n📝 Method Declarations Found: ${methods.length}`);
methods.slice(0, 5).forEach(m => console.log(`   ${m}`));
if (methods.length > 5) console.log(`   ... and ${methods.length - 5} more`);

// Test TypeScript compilation
console.log('\n🧪 Testing TypeScript Compilation:');
const { execSync } = require('child_process');
try {
    execSync('npx tsc --noEmit', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
    });
    console.log('   ✅ TypeScript compilation PASSED!');
} catch (error) {
    console.log('   ❌ TypeScript compilation FAILED');
    console.log('\nFirst 1000 chars of error:');
    console.log(error.stdout ? error.stdout.slice(0, 1000) : error.message);
}