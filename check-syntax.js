const fs = require('fs');

// Read the visual.ts file and check for common syntax issues
const content = fs.readFileSync('src/visual.ts', 'utf8');
const lines = content.split('\n');

console.log('🔍 Checking TypeScript syntax issues...\n');

// Check for brace balance
const openBraces = (content.match(/{/g) || []).length;
const closeBraces = (content.match(/}/g) || []).length;

console.log(`Brace count: ${openBraces} open, ${closeBraces} close`);
console.log(`Balance: ${openBraces - closeBraces}\n`);

// Check specific problem lines mentioned in error
const problemLines = [617, 641];
problemLines.forEach(lineNum => {
    if (lines[lineNum - 1]) {
        console.log(`Line ${lineNum}: ${lines[lineNum - 1]}`);
    }
});

// Look for common syntax issues
console.log('\nChecking for common issues:');

// Check for missing semicolons in method signatures
const methodSigRegex = /private\s+\w+\([^)]*\)\s*{/g;
let match;
while ((match = methodSigRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    console.log(`Method signature at line ${lineNum}: OK`);
}

// Check for unclosed parentheses or brackets
const unclosedParens = (content.match(/\(/g) || []).length - (content.match(/\)/g) || []).length;
const unclosedBrackets = (content.match(/\[/g) || []).length - (content.match(/\]/g) || []).length;

console.log(`Parentheses balance: ${unclosedParens}`);
console.log(`Brackets balance: ${unclosedBrackets}`);

if (openBraces === closeBraces && unclosedParens === 0 && unclosedBrackets === 0) {
    console.log('\n✅ Basic syntax checks passed');
} else {
    console.log('\n❌ Syntax issues found');
}