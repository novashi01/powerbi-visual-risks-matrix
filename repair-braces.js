// Repair brace imbalance in visual.ts
const fs = require('fs');

console.log('🔧 Repairing brace imbalance...\n');

try {
    let content = fs.readFileSync('src/visual.ts', 'utf8');
    const lines = content.split('\n');
    
    // Find the problematic area
    let balance = 0;
    let problemStart = -1;
    
    lines.forEach((line, index) => {
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        balance += openBraces - closeBraces;
        
        if (balance < 0 && problemStart === -1) {
            problemStart = index;
            console.log(`❌ Negative balance detected at line ${index + 1}: ${line.trim()}`);
        }
    });
    
    console.log(`Final balance: ${balance} (should be 0)`);
    
    if (balance === -1) {
        // We have one extra closing brace
        console.log('🔍 Looking for extra closing brace...');
        
        // Look for common patterns of extra closing braces
        const patterns = [
            /}\s*}\s*$/m,  // Double closing at end
            /}\s*}\s*private/m,  // Double closing before method
            /}\s*}\s*\n\s*private/m,  // Double closing with newline
        ];
        
        for (const pattern of patterns) {
            if (pattern.test(content)) {
                console.log(`Found pattern: ${pattern}`);
                // Remove one closing brace from the first match
                content = content.replace(pattern, (match) => {
                    return match.replace(/}/, '').trim();
                });
                break;
            }
        }
        
        // If no pattern found, look for standalone closing braces
        const linesArray = content.split('\n');
        for (let i = linesArray.length - 1; i >= 0; i--) {
            if (linesArray[i].trim() === '}' && i > 0) {
                const prevLine = linesArray[i - 1].trim();
                if (prevLine === '}') {
                    console.log(`Removing extra closing brace at line ${i + 1}`);
                    linesArray.splice(i, 1);
                    content = linesArray.join('\n');
                    break;
                }
            }
        }
        
    } else if (balance === 1) {
        // We're missing one closing brace
        console.log('Adding missing closing brace at end');
        if (!content.endsWith('}')) {
            content += '\n}';
        }
    }
    
    // Write the repaired content
    fs.writeFileSync('src/visual.ts', content);
    
    // Verify the repair
    const repairedContent = fs.readFileSync('src/visual.ts', 'utf8');
    const openCount = (repairedContent.match(/{/g) || []).length;
    const closeCount = (repairedContent.match(/}/g) || []).length;
    
    console.log(`\n📊 After repair:`);
    console.log(`   Opening braces: ${openCount}`);
    console.log(`   Closing braces: ${closeCount}`);
    console.log(`   Balance: ${openCount - closeCount}`);
    
    if (openCount === closeCount) {
        console.log('✅ Brace balance fixed!');
        process.exit(0);
    } else {
        console.log('❌ Still imbalanced');
        process.exit(1);
    }
    
} catch (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
}