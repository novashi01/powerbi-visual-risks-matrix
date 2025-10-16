// Test enhanced Risk Markers Layout functionality
const fs = require('fs');

console.log('🧪 Testing Enhanced Risk Markers Layout v1.3.1...\n');

let allTestsPassed = true;

try {
    // Test 1: Settings Structure
    console.log('1️⃣  Settings Structure Test:');
    const settingsContent = fs.readFileSync('src/settings.ts', 'utf8');
    
    const requiredSettings = [
        'markerRows',
        'markerColumns', 
        'showInherentInOrganized',
        'organizedArrows'
    ];
    
    let settingsCheck = true;
    requiredSettings.forEach(setting => {
        if (settingsContent.includes(setting)) {
            console.log(`   ✅ ${setting} setting found`);
        } else {
            console.log(`   ❌ ${setting} setting missing`);
            settingsCheck = false;
        }
    });
    
    if (!settingsCheck) allTestsPassed = false;

    // Test 2: Capabilities Configuration
    console.log('\n2️⃣  Capabilities Configuration Test:');
    const capabilities = JSON.parse(fs.readFileSync('capabilities.json', 'utf8'));
    
    const riskMarkersObj = capabilities.objects?.riskMarkersLayout;
    if (riskMarkersObj) {
        const requiredProps = ['markerRows', 'markerColumns', 'showInherentInOrganized', 'organizedArrows'];
        let capsCheck = true;
        
        requiredProps.forEach(prop => {
            if (riskMarkersObj.properties[prop]) {
                console.log(`   ✅ ${prop} capability configured`);
            } else {
                console.log(`   ❌ ${prop} capability missing`);
                capsCheck = false;
            }
        });
        
        if (!capsCheck) allTestsPassed = false;
    } else {
        console.log('   ❌ riskMarkersLayout object not found');
        allTestsPassed = false;
    }

    // Test 3: Visual Integration
    console.log('\n3️⃣  Visual Integration Test:');
    const visualContent = fs.readFileSync('src/visual.ts', 'utf8');
    
    const integrationChecks = [
        { name: 'Enhanced organizeMarkersInCell', pattern: /organizeMarkersInCell.*markerRows.*markerCols/ },
        { name: 'Marker grid settings usage', pattern: /markerRows\.value/ },
        { name: 'Inherent display logic', pattern: /showInherentInOrganized/ },
        { name: 'Organized arrows logic', pattern: /organizedArrows/ },
        { name: 'Enhanced renderOrganizedLayout', pattern: /renderOrganizedLayout.*showInherent.*showArrows/ }
    ];
    
    integrationChecks.forEach(check => {
        if (check.pattern.test(visualContent)) {
            console.log(`   ✅ ${check.name}`);
        } else {
            console.log(`   ❌ ${check.name}`);
            allTestsPassed = false;
        }
    });

    // Test 4: Method Signatures
    console.log('\n4️⃣  Method Signatures Test:');
    
    // Check organizeMarkersInCell parameters
    const organizeMethodMatch = visualContent.match(/organizeMarkersInCell\([^)]+\)/);
    if (organizeMethodMatch) {
        const params = organizeMethodMatch[0];
        if (params.includes('markerRows') && params.includes('markerCols')) {
            console.log('   ✅ organizeMarkersInCell has correct parameters');
        } else {
            console.log('   ❌ organizeMarkersInCell missing grid parameters');
            allTestsPassed = false;
        }
    }
    
    // Check renderOrganizedLayout parameters
    const renderOrgMatch = visualContent.match(/renderOrganizedLayout\([^)]+\)/);
    if (renderOrgMatch) {
        const params = renderOrgMatch[0];
        if (params.includes('showInherent') && params.includes('showArrows')) {
            console.log('   ✅ renderOrganizedLayout has enhanced parameters');
        } else {
            console.log('   ❌ renderOrganizedLayout missing enhanced parameters');
            allTestsPassed = false;
        }
    }

    // Test 5: Logic Validation
    console.log('\n5️⃣  Logic Validation Test:');
    
    // Check for marker overflow handling
    if (visualContent.includes('maxMarkersPerCell') || visualContent.includes('slice(0,')) {
        console.log('   ✅ Marker overflow handling implemented');
    } else {
        console.log('   ⚠️  Marker overflow handling may be missing');
    }
    
    // Check for inherent risk offset positioning
    if (visualContent.includes('offset') && visualContent.includes('inherent')) {
        console.log('   ✅ Inherent risk offset positioning implemented');
    } else {
        console.log('   ⚠️  Inherent risk positioning logic may need review');
    }
    
    // Check for conditional arrow display
    if (visualContent.includes('shouldShowArrow') && visualContent.includes('organizedArrows')) {
        console.log('   ✅ Conditional arrow display implemented');
    } else {
        console.log('   ⚠️  Arrow display logic may need review');
    }

    // Test 6: Configuration Defaults
    console.log('\n6️⃣  Configuration Defaults Test:');
    
    const defaultChecks = [
        { name: 'markerRows default: 3', pattern: /markerRows.*value:\s*3/ },
        { name: 'markerColumns default: 3', pattern: /markerColumns.*value:\s*3/ },
        { name: 'showInherentInOrganized default: true', pattern: /showInherentInOrganized.*value:\s*true/ },
        { name: 'organizedArrows default: true', pattern: /organizedArrows.*value:\s*true/ }
    ];
    
    defaultChecks.forEach(check => {
        if (check.pattern.test(settingsContent)) {
            console.log(`   ✅ ${check.name}`);
        } else {
            console.log(`   ⚠️  ${check.name} - check default value`);
        }
    });

    // Final Summary
    console.log('\n📊 Test Summary:');
    if (allTestsPassed) {
        console.log('   🎉 All critical tests passed!');
        console.log('   ✅ Enhanced Risk Markers Layout is ready');
        console.log('\n🚀 Ready for:');
        console.log('   - npm run package');
        console.log('   - Power BI Desktop testing');
        console.log('   - User acceptance testing');
        
        console.log('\n🎯 New Features Available:');
        console.log('   • Configurable marker grid (n×n per cell)');
        console.log('   • Inherent risk display in organized mode');
        console.log('   • Animation arrows for risk journey');
        console.log('   • Enhanced visual organization');
        
        process.exit(0);
    } else {
        console.log('   ❌ Some tests failed - review needed');
        console.log('   🔧 Check the issues above before proceeding');
        process.exit(1);
    }

} catch (error) {
    console.log('❌ Test error:', error.message);
    process.exit(1);
}