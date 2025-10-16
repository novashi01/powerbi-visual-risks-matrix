// Quick verification that the renderOrganizedLayout method signature is correct
const fs = require('fs');

console.log('🔍 Verifying renderOrganizedLayout fix...\n');

const visualContent = fs.readFileSync('src/visual.ts', 'utf8');

// Check renderOrganizedLayout parameters - both call and definition
const allMatches = visualContent.match(/renderOrganizedLayout[^(]*\([^)]*\)/g);
if (allMatches) {
    console.log('Found renderOrganizedLayout occurrences:');
    allMatches.forEach((match, index) => {
        console.log(`${index + 1}: ${match}`);
        
        if (match.includes('showInherent') && match.includes('showArrows')) {
            console.log(`   ✅ Has enhanced parameters`);
        } else {
            console.log(`   ❌ Missing enhanced parameters`);
        }
    });
} else {
    console.log('❌ renderOrganizedLayout method not found');
}

// Specifically check the method signature test pattern
const renderOrgMatch = visualContent.match(/renderOrganizedLayout.*showInherent.*showArrows/);
if (renderOrgMatch) {
    console.log('\n✅ Enhanced renderOrganizedLayout pattern found');
    console.log('🎉 Test should now pass!');
    process.exit(0);
} else {
    console.log('\n❌ Enhanced renderOrganizedLayout pattern not found');
    console.log('🔧 Need to adjust method signature or call');
    process.exit(1);
}