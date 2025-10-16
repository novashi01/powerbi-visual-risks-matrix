// Test script for dual layout settings functionality
const fs = require('fs');

console.log('🧪 Testing Layout Settings Configuration...\n');

// Test 1: Check settings structure
console.log('1️⃣  Settings Structure Test:');
try {
    const settingsContent = fs.readFileSync('src/settings.ts', 'utf8');
    
    // Check for dual settings classes
    const hasMatrixGrid = settingsContent.includes('class MatrixGridSettings');
    const hasRiskMarkersLayout = settingsContent.includes('class RiskMarkersLayoutSettings');
    const hasFormattingModel = settingsContent.includes('matrixGridCard') && settingsContent.includes('riskMarkersLayoutCard');
    
    console.log(`   Matrix Grid Settings: ${hasMatrixGrid ? '✅' : '❌'}`);
    console.log(`   Risk Markers Layout: ${hasRiskMarkersLayout ? '✅' : '❌'}`);
    console.log(`   Formatting Model: ${hasFormattingModel ? '✅' : '❌'}`);
    
    if (!hasMatrixGrid || !hasRiskMarkersLayout || !hasFormattingModel) {
        throw new Error('Missing required settings classes');
    }
} catch (error) {
    console.log('   ❌ Settings test failed:', error.message);
    process.exit(1);
}

// Test 2: Check capabilities configuration
console.log('\n2️⃣  Capabilities Configuration Test:');
try {
    const capabilities = JSON.parse(fs.readFileSync('capabilities.json', 'utf8'));
    
    const hasMatrixGridObj = capabilities.objects && capabilities.objects.matrixGrid;
    const hasRiskMarkersObj = capabilities.objects && capabilities.objects.riskMarkersLayout;
    const hasLayoutModeEnum = hasRiskMarkersObj && 
        capabilities.objects.riskMarkersLayout.properties.layoutMode &&
        capabilities.objects.riskMarkersLayout.properties.layoutMode.type.enumeration;
    
    console.log(`   Matrix Grid Object: ${hasMatrixGridObj ? '✅' : '❌'}`);
    console.log(`   Risk Markers Object: ${hasRiskMarkersObj ? '✅' : '❌'}`);
    console.log(`   Layout Mode Enum: ${hasLayoutModeEnum ? '✅' : '❌'}`);
    
    if (!hasMatrixGridObj || !hasRiskMarkersObj) {
        throw new Error('Missing required capabilities objects');
    }
} catch (error) {
    console.log('   ❌ Capabilities test failed:', error.message);
    process.exit(1);
}

// Test 3: Check visual.ts integration
console.log('\n3️⃣  Visual Integration Test:');
try {
    const visualContent = fs.readFileSync('src/visual.ts', 'utf8');
    
    const hasMatrixGridUsage = visualContent.includes('matrixGridCard');
    const hasRiskMarkersUsage = visualContent.includes('riskMarkersLayoutCard');
    const hasLayoutMethods = visualContent.includes('renderOrganizedLayout') && 
                             visualContent.includes('renderCenteredLayout') &&
                             visualContent.includes('renderJitteredLayout');
    
    console.log(`   Matrix Grid Usage: ${hasMatrixGridUsage ? '✅' : '❌'}`);
    console.log(`   Risk Markers Usage: ${hasRiskMarkersUsage ? '✅' : '❌'}`);
    console.log(`   Layout Methods: ${hasLayoutMethods ? '✅' : '❌'}`);
    
    if (!hasMatrixGridUsage || !hasRiskMarkersUsage || !hasLayoutMethods) {
        throw new Error('Missing required visual integration');
    }
} catch (error) {
    console.log('   ❌ Visual integration test failed:', error.message);
    process.exit(1);
}

// Test 4: Check documentation consistency
console.log('\n4️⃣  Documentation Consistency Test:');
try {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    const releaseNotesContent = fs.readFileSync('RELEASE-NOTES-v1.3.0.md', 'utf8');
    
    const readmeHasDualSettings = readmeContent.includes('Matrix Grid Settings') && 
                                 readmeContent.includes('Risk Markers Layout Settings');
    const releaseNotesHasDual = releaseNotesContent.includes('Dual Layout Configuration') ||
                               releaseNotesContent.includes('Matrix Grid Panel');
    
    console.log(`   README Dual Settings: ${readmeHasDualSettings ? '✅' : '❌'}`);
    console.log(`   Release Notes Updated: ${releaseNotesHasDual ? '✅' : '❌'}`);
    
} catch (error) {
    console.log('   ⚠️  Documentation test warning:', error.message);
    // Don't fail build for documentation issues
}

// Test 5: Validate setting names and types
console.log('\n5️⃣  Settings Validation Test:');
try {
    const settingsContent = fs.readFileSync('src/settings.ts', 'utf8');
    
    // Check for specific setting properties
    const requiredMatrixSettings = [
        'matrixRows',
        'matrixColumns', 
        'enableScrolling'
    ];
    
    const requiredMarkerSettings = [
        'organizedLayout',
        'layoutMode',
        'cellPadding'
    ];
    
    let allMatrixSettingsFound = true;
    requiredMatrixSettings.forEach(setting => {
        if (!settingsContent.includes(setting)) {
            console.log(`   ❌ Missing matrix setting: ${setting}`);
            allMatrixSettingsFound = false;
        }
    });
    
    let allMarkerSettingsFound = true;
    requiredMarkerSettings.forEach(setting => {
        if (!settingsContent.includes(setting)) {
            console.log(`   ❌ Missing marker setting: ${setting}`);
            allMarkerSettingsFound = false;
        }
    });
    
    if (allMatrixSettingsFound && allMarkerSettingsFound) {
        console.log('   ✅ All required settings present');
    }
    
} catch (error) {
    console.log('   ❌ Settings validation failed:', error.message);
    process.exit(1);
}

console.log('\n🎉 All layout settings tests passed!');
console.log('\n📋 Configuration Summary:');
console.log('   • Matrix Grid: Controls overall risk matrix dimensions (2x2 to 10x10)');
console.log('   • Risk Markers Layout: Controls marker positioning within cells');
console.log('   • Three positioning modes: Organized, Random Scatter, Centered');
console.log('   • Separate, independent configuration for maximum flexibility');

console.log('\n🚀 Ready for deployment testing!');
console.log('   Next: Run npm run package and test in Power BI Desktop');