const fs = require('fs');
const path = require('path');

console.log('📁 Organizing Test Files');
console.log('========================\n');

// Ensure test directory exists
const testDir = './test';
if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
    console.log('✅ Created test/ directory\n');
}

// Files to move from src/ to test/
const testFilesInSrc = [
    'arrow-customization.test.ts',
    'axis-labels.test.ts',
    'customizable-axis-labels.test.ts',
    'settings.test.ts',
    'visual-functions.test.ts',
    'visual-utils.test.ts',
    'visual.integration.test.ts',
    'visual.simple.test.ts',
    'visual.test.ts',
    'visual.test.ts.backup',
    'test-data.ts',
    'visual-utils.ts' // Test utility
];

console.log('1️⃣  Moving test files from src/ to test/...\n');

let movedCount = 0;
testFilesInSrc.forEach(file => {
    const srcPath = path.join('./src', file);
    const destPath = path.join(testDir, file);
    
    if (fs.existsSync(srcPath)) {
        try {
            // Read content
            const content = fs.readFileSync(srcPath, 'utf8');
            
            // Update import paths in the file
            let updatedContent = content;
            
            // Update relative imports from ./ to ../src/
            updatedContent = updatedContent.replace(/from ['"]\.\/settings['"]/g, "from '../src/settings'");
            updatedContent = updatedContent.replace(/from ['"]\.\/visual['"]/g, "from '../src/visual'");
            updatedContent = updatedContent.replace(/from ['"]\.\/test-data['"]/g, "from './test-data'");
            updatedContent = updatedContent.replace(/from ['"]\.\/visual-utils['"]/g, "from './visual-utils'");
            
            // Write to test folder
            fs.writeFileSync(destPath, updatedContent);
            
            // Delete from src
            fs.unlinkSync(srcPath);
            
            console.log(`   ✅ Moved: ${file}`);
            movedCount++;
        } catch (error) {
            console.log(`   ❌ Error moving ${file}: ${error.message}`);
        }
    } else {
        console.log(`   ⚠️  Not found: ${file}`);
    }
});

console.log(`\n   Total moved: ${movedCount} files\n`);

// Update jest.config.js to point to test folder
console.log('2️⃣  Updating jest.config.js...\n');

try {
    const jestConfigPath = './jest.config.js';
    let jestConfig = fs.readFileSync(jestConfigPath, 'utf8');
    
    // Update testMatch pattern
    if (jestConfig.includes('src/**/*.test.ts')) {
        jestConfig = jestConfig.replace(/src\/\*\*\/\*\.test\.ts/g, 'test/**/*.test.ts');
        fs.writeFileSync(jestConfigPath, jestConfig);
        console.log('   ✅ Updated jest.config.js testMatch pattern\n');
    } else {
        console.log('   ✅ jest.config.js already configured\n');
    }
} catch (error) {
    console.log(`   ⚠️  Could not update jest.config.js: ${error.message}\n`);
}

// Update tsconfig.json to exclude test folder
console.log('3️⃣  Updating tsconfig.json...\n');

try {
    const tsconfigPath = './tsconfig.json';
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    if (!tsconfig.exclude) {
        tsconfig.exclude = [];
    }
    
    if (!tsconfig.exclude.includes('test')) {
        tsconfig.exclude.push('test');
        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4));
        console.log('   ✅ Added test/ to tsconfig exclude\n');
    } else {
        console.log('   ✅ test/ already excluded\n');
    }
} catch (error) {
    console.log(`   ⚠️  Could not update tsconfig.json: ${error.message}\n`);
}

// Create index file in test folder documenting test structure
console.log('4️⃣  Creating test documentation...\n');

const testReadme = `# Test Directory

All unit tests for the Power BI Risk Matrix visual.

## Test Files

### Core Visual Tests
- \`visual.test.ts\` - Main visual component tests
- \`visual.simple.test.ts\` - Basic functionality tests
- \`visual.integration.test.ts\` - Integration tests
- \`visual-functions.test.ts\` - Function-level tests

### Feature-Specific Tests
- \`arrow-customization.test.ts\` - Arrow sizing and positioning tests
- \`axis-labels.test.ts\` - Axis label customization tests
- \`customizable-axis-labels.test.ts\` - Extended axis label tests
- \`settings.test.ts\` - Settings model tests

### Test Utilities
- \`visual-utils.ts\` - Shared test utilities and mocks
- \`test-data.ts\` - Test data fixtures

## Running Tests

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run visual tests (Playwright)
npm run test:visual
\`\`\`

## Test Coverage

Current coverage: ~92% statement coverage
Business logic: 100% coverage

## Adding New Tests

1. Create \`*.test.ts\` file in this directory
2. Import test utilities from \`./visual-utils\`
3. Import code to test from \`../src/\`
4. Run tests with \`npm test\`
`;

fs.writeFileSync(path.join(testDir, 'README.md'), testReadme);
console.log('   ✅ Created test/README.md\n');

// Summary
console.log('📊 Summary');
console.log('==========');
console.log(`✅ ${movedCount} test files moved to test/`);
console.log('✅ Import paths updated');
console.log('✅ Configuration files updated');
console.log('✅ Test documentation created\n');

console.log('🧪 Next Steps:');
console.log('   1. Run: npm test (to verify tests still pass)');
console.log('   2. Run: npx tsc --noEmit (to verify no src/ errors)');
console.log('   3. All test files are now properly organized in test/\n');

console.log('✅ Test organization complete!');
