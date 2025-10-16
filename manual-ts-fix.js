const fs = require('fs');

console.log('🔧 Manual TypeScript Fix - Line 617 Issue');
console.log('==========================================\n');

// Read the file and examine line 617
const content = fs.readFileSync('src/visual.ts', 'utf8');
const lines = content.split('\n');

console.log('Examining problem area around line 617...\n');

// Show lines 615-620 with details
for (let i = 614; i < 620; i++) {
    const line = lines[i] || '<end of file>';
    const chars = Array.from(line).map(c => c.charCodeAt(0));
    console.log(`Line ${i + 1}: "${line}"`);
    console.log(`   Char codes: [${chars.slice(0, 20).join(', ')}${chars.length > 20 ? '...' : ''}]`);
}

// Check the createArrowMarker method specifically
const methodMatch = content.match(/private createArrowMarker\([^{]+{/);
if (methodMatch) {
    console.log('\nFound createArrowMarker method:');
    console.log(`"${methodMatch[0]}"`);
} else {
    console.log('\n❌ createArrowMarker method not found properly');
}

// Let's recreate the method cleanly
console.log('\n🔧 Recreating createArrowMarker method...');

const beforeMethod = content.substring(0, content.indexOf('private createArrowMarker'));
const afterMethodStart = content.indexOf('private calculateArrowPosition');
const afterMethod = content.substring(afterMethodStart);

const cleanMethod = `    private createArrowMarker(defs: SVGDefsElement, arrowSize: number) {
        // Remove existing marker if it exists
        const existingMarker = defs.querySelector('#arrow');
        if (existingMarker) {
            existingMarker.remove();
        }
        
        // Create new marker with custom size
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrow");
        marker.setAttribute("viewBox", "0 0 10 10");
        marker.setAttribute("refX", "9");
        marker.setAttribute("refY", "3");
        marker.setAttribute("markerWidth", String(arrowSize));
        marker.setAttribute("markerHeight", String(arrowSize));
        marker.setAttribute("orient", "auto");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M0,0 L0,6 L9,3 z");
        path.setAttribute("fill", "#333");
        
        marker.appendChild(path);
        defs.appendChild(marker);
    }

    `;

const newContent = beforeMethod + cleanMethod + afterMethod;

// Write the fixed content
fs.writeFileSync('src/visual.ts', newContent);

console.log('✅ createArrowMarker method recreated');
console.log('✅ File updated with clean method syntax');

// Test the fix
const { execSync } = require('child_process');
try {
    execSync('npx tsc --noEmit', { 
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf8'
    });
    console.log('🎉 TypeScript compilation now passes!');
} catch (error) {
    console.log('❌ TypeScript compilation still has issues');
    console.log('Error output:');
    console.log(error.stdout || error.message);
}