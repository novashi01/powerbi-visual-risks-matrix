// Find brace imbalance in visual.ts
const fs = require('fs');

console.log('🔍 Finding brace imbalance...\n');

try {
    const content = fs.readFileSync('src/visual.ts', 'utf8');
    const lines = content.split('\n');
    
    let openCount = 0;
    let closeCount = 0;
    let balance = 0;
    const issues = [];
    
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        
        openCount += openBraces;
        closeCount += closeBraces;
        balance += openBraces - closeBraces;
        
        // Track lines with significant brace changes
        if (openBraces > 0 || closeBraces > 0) {
            console.log(`Line ${lineNumber}: ${openBraces} open, ${closeBraces} close, balance: ${balance} | ${line.trim()}`);
        }
        
        // Flag potential issues
        if (balance < 0) {
            issues.push({
                line: lineNumber,
                balance: balance,
                content: line.trim()
            });
        }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total opening braces: ${openCount}`);
    console.log(`   Total closing braces: ${closeCount}`);
    console.log(`   Final balance: ${balance}`);
    
    if (issues.length > 0) {
        console.log(`\n❌ Potential issues (negative balance):`);
        issues.forEach(issue => {
            console.log(`   Line ${issue.line}: balance ${issue.balance} | ${issue.content}`);
        });
    }
    
    // Look for specific problematic patterns
    console.log(`\n🔍 Looking for problematic patterns:`);
    
    // Check for double closing braces
    const doubleClosing = content.match(/}\s*}/g);
    if (doubleClosing) {
        console.log(`   Found ${doubleClosing.length} double closing patterns: ${doubleClosing.join(', ')}`);
    }
    
    // Check for orphaned closing braces
    lines.forEach((line, index) => {
        if (line.trim() === '}' && index > 0) {
            const prevLine = lines[index - 1].trim();
            const nextLine = lines[index + 1]?.trim() || '';
            if (prevLine === '}' || nextLine === '}') {
                console.log(`   Potential orphaned brace at line ${index + 1}`);
            }
        }
    });
    
} catch (error) {
    console.log('❌ Error:', error.message);
}