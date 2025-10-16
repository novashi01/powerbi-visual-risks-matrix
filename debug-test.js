const fs = require('fs');

console.log('Debugging renderOrganizedLayout method signature...\n');

const visualContent = fs.readFileSync('src/visual.ts', 'utf8');

// Check renderOrganizedLayout parameters
console.log('Looking for renderOrganizedLayout method...');
const renderOrgMatch = visualContent.match(/renderOrganizedLayout\([^)]+\)/);
if (renderOrgMatch) {
    console.log('Found method call/definition:');
    console.log(renderOrgMatch[0]);
    
    const params = renderOrgMatch[0];
    console.log('\nChecking for required parameters:');
    console.log('Contains showInherent?', params.includes('showInherent'));
    console.log('Contains showArrows?', params.includes('showArrows'));
    
    if (params.includes('showInherent') && params.includes('showArrows')) {
        console.log('✅ renderOrganizedLayout has enhanced parameters');
    } else {
        console.log('❌ renderOrganizedLayout missing enhanced parameters');
        console.log('Full params string:', params);
    }
} else {
    console.log('❌ renderOrganizedLayout method not found');
}

// Let's also search for the method definition specifically
console.log('\n--- Method Definition Search ---');
const methodDefMatch = visualContent.match(/private renderOrganizedLayout\([^)]+\)/);
if (methodDefMatch) {
    console.log('Method definition found:');
    console.log(methodDefMatch[0]);
} else {
    console.log('Method definition not found');
}

// Search for all occurrences
console.log('\n--- All renderOrganizedLayout occurrences ---');
const allMatches = visualContent.match(/renderOrganizedLayout[^(]*\([^)]*\)/g);
if (allMatches) {
    allMatches.forEach((match, index) => {
        console.log(`Match ${index + 1}:`, match);
    });
} else {
    console.log('No matches found');
}