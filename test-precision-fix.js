// Quick test to verify floating point precision fix
console.log("Testing floating point calculations...");

// Simulate the calculations from the test
const mockViewport = { width: 800, height: 600 };
const margins = { l: 40, r: 10, t: 10, b: 30 };
const rows = 5;
const cellHeight = (mockViewport.width - margins.l - margins.r) / rows; // Should be 150
const actualCellHeight = (mockViewport.height - margins.t - margins.b) / rows; // Should be 112

console.log("Cell width calculation:", cellHeight);
console.log("Cell height calculation:", actualCellHeight);

// Calculate Y positions like in the test
const yPositions = Array.from({ length: rows }, (_, y) => {
    return margins.t + (y + 0.6) * actualCellHeight;
});

console.log("Calculated Y positions:", yPositions);
console.log("Expected positions: [77.2, 189.2, 301.2, 413.2, 525.2]");

// Check differences
const expectedPositions = [77.2, 189.2, 301.2, 413.2, 525.2];
yPositions.forEach((pos, index) => {
    const diff = Math.abs(pos - expectedPositions[index]);
    console.log(`Position ${index}: calculated=${pos}, expected=${expectedPositions[index]}, diff=${diff}`);
    console.log(`Within tolerance (1e-10): ${diff < 1e-10}`);
});

console.log("Test completed!");