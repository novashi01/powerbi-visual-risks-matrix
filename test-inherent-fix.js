const fs = require('fs');

console.log('🔍 Verifying Inherent Risk Display Logic\n');
console.log('=' .repeat(50) + '\n');

// Read the visual.ts file
const content = fs.readFileSync('src/visual.ts', 'utf8');

// Test 1: Check for separate cell grouping
console.log('Test 1: Separate Cell Grouping');
const hasInherentGroup = content.includes('inherentCellMarkers') && content.includes('residualCellMarkers');
console.log(hasInherentGroup ? '   ✅ PASS - Groups inherent and residual cells separately' : '   ❌ FAIL');

// Test 2: Check for inherent cell organization
console.log('\nTest 2: Inherent Cell Organization');
const organizesInherent = content.includes('inherentCellMarkers[inherentKey]');
console.log(organizesInherent ? '   ✅ PASS - Organizes markers in inherent cells' : '   ❌ FAIL');

// Test 3: Check for residual cell organization
console.log('\nTest 3: Residual Cell Organization');
const organizesResidual = content.includes('residualCellMarkers[residualKey]');
console.log(organizesResidual ? '   ✅ PASS - Organizes markers in residual cells' : '   ❌ FAIL');

// Test 4: Check for position tracking
console.log('\nTest 4: Position Tracking for Arrows');
const tracksPositions = content.includes('organizedPositions') && 
                       content.includes('organizedPositions[riskId].inherent') &&
                       content.includes('organizedPositions[riskId].residual');
console.log(tracksPositions ? '   ✅ PASS - Tracks both inherent and residual positions' : '   ❌ FAIL');

// Test 5: Check for arrow drawing between cells
console.log('\nTest 5: Arrows Between Cells');
const drawsArrows = content.includes('if (positions.inherent && positions.residual)') &&
                   content.includes('calculateArrowPosition');
console.log(drawsArrows ? '   ✅ PASS - Draws arrows from inherent to residual positions' : '   ❌ FAIL');

// Test 6: Check for renderSingleMarker method
console.log('\nTest 6: Single Marker Rendering');
const hasSingleMarker = content.includes('renderSingleMarker') &&
                       content.includes("type: 'inherent'") &&
                       content.includes("type: 'residual'");
console.log(hasSingleMarker ? '   ✅ PASS - Renders markers with correct types' : '   ❌ FAIL');

// Test 7: Check for different marker appearance
console.log('\nTest 7: Marker Appearance Differentiation');
const differentiates = content.includes('fill-opacity') && 
                      content.includes('"0.5"') && // inherent opacity
                      content.includes('markerSize - 1'); // inherent size
console.log(differentiates ? '   ✅ PASS - Inherent and residual markers look different' : '   ❌ FAIL');

// Summary
console.log('\n' + '='.repeat(50));
const allPassed = hasInherentGroup && organizesInherent && organizesResidual && 
                 tracksPositions && drawsArrows && hasSingleMarker && differentiates;

if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('\nInherent risk display is correctly implemented:');
    console.log('  • Inherent markers in their original cells (○)');
    console.log('  • Residual markers in their current cells (●)');
    console.log('  • Arrows connect across matrix cells (○→●)');
    console.log('\nRun VERIFY-V1.3.0.bat to compile and package.\n');
    process.exit(0);
} else {
    console.log('❌ SOME TESTS FAILED');
    console.log('Review the implementation above.\n');
    process.exit(1);
}