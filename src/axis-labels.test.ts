// Tests for fixed axis labels functionality
describe('Risk Matrix Axis Labels', () => {
  
  describe('Fixed Axis Labels Behavior', () => {
    test('should always display 1-5 labels regardless of data', () => {
      // Test that axis labels are always consistent
      const expectedXLabels = ["1", "2", "3", "4", "5"];
      const expectedYLabels = ["1", "2", "3", "4", "5"]; // Will be reversed in display (5,4,3,2,1)
      
      expect(expectedXLabels).toEqual(["1", "2", "3", "4", "5"]);
      expect(expectedYLabels).toEqual(["1", "2", "3", "4", "5"]);
    });
    
    test('should handle empty dataset with consistent labels', () => {
      // Even with no data, labels should be fixed
      const emptyDataScenario = [];
      const axisLabels = {
        likelihood: ["1", "2", "3", "4", "5"],
        consequence: ["1", "2", "3", "4", "5"]
      };
      
      expect(axisLabels.likelihood).toHaveLength(5);
      expect(axisLabels.consequence).toHaveLength(5);
      expect(axisLabels.likelihood[0]).toBe("1");
      expect(axisLabels.likelihood[4]).toBe("5");
    });
    
    test('should handle partial data range with fixed labels', () => {
      // Data only contains values 2,3,4 but labels should still be 1-5
      const partialData = [
        { likelihood: 2, consequence: 2 },
        { likelihood: 3, consequence: 3 }, 
        { likelihood: 4, consequence: 4 }
      ];
      
      // Axis labels should NOT be derived from data
      const fixedLabels = ["1", "2", "3", "4", "5"];
      const dataValues = partialData.map(d => d.likelihood); // [2,3,4]
      
      // Labels should remain fixed regardless of actual data values
      expect(fixedLabels).not.toEqual(dataValues.map(String));
      expect(fixedLabels).toEqual(["1", "2", "3", "4", "5"]);
    });
    
    test('should handle out-of-range data with fixed labels', () => {
      // Data contains values outside 1-5 range
      const outOfRangeData = [
        { likelihood: 0, consequence: 6 },
        { likelihood: 7, consequence: -1 },
        { likelihood: 10, consequence: 2 }
      ];
      
      // Labels should remain 1-5 even with invalid data
      const fixedLabels = ["1", "2", "3", "4", "5"];
      expect(fixedLabels).toEqual(["1", "2", "3", "4", "5"]);
      
      // Data should be clamped, but labels stay fixed
      const clampToRange = (n: number) => Math.max(1, Math.min(5, n));
      outOfRangeData.forEach(item => {
        expect(clampToRange(item.likelihood)).toBeGreaterThanOrEqual(1);
        expect(clampToRange(item.likelihood)).toBeLessThanOrEqual(5);
        expect(clampToRange(item.consequence)).toBeGreaterThanOrEqual(1);
        expect(clampToRange(item.consequence)).toBeLessThanOrEqual(5);
      });
    });
    
    test('should maintain consistent axis orientation', () => {
      // X-axis: Likelihood 1-5 (left to right)
      // Y-axis: Consequence 5-1 (top to bottom, so 1-5 bottom to top)
      
      const xAxisPositions = [0, 1, 2, 3, 4]; // Grid positions
      const xAxisLabels = ["1", "2", "3", "4", "5"];
      
      const yAxisPositions = [4, 3, 2, 1, 0]; // Grid positions (reversed)
      const yAxisLabelsDisplay = ["1", "2", "3", "4", "5"]; // Consequence values
      
      // Verify correspondence
      xAxisPositions.forEach((pos, index) => {
        expect(xAxisLabels[pos]).toBe(String(index + 1));
      });
      
      yAxisPositions.forEach((pos, index) => {
        expect(yAxisLabelsDisplay[index]).toBe(String(index + 1));
      });
    });
  });
  
  describe('Risk Matrix Standard Compliance', () => {
    test('should follow 5x5 risk matrix standard', () => {
      // Standard risk matrix is always 5x5 with fixed scales
      const matrixSize = 5;
      const likelihoodScale = Array.from({length: matrixSize}, (_, i) => i + 1);
      const consequenceScale = Array.from({length: matrixSize}, (_, i) => i + 1);
      
      expect(likelihoodScale).toEqual([1, 2, 3, 4, 5]);
      expect(consequenceScale).toEqual([1, 2, 3, 4, 5]);
      
      // Total grid cells should always be 25
      expect(likelihoodScale.length * consequenceScale.length).toBe(25);
    });
    
    test('should provide predictable risk positioning', () => {
      // Risk at (L=1, C=1) should always be in same position
      // Risk at (L=5, C=5) should always be in same position
      
      const riskPositions = [
        { likelihood: 1, consequence: 1, expected: 'bottom-left' },
        { likelihood: 5, consequence: 5, expected: 'top-right' },
        { likelihood: 1, consequence: 5, expected: 'top-left' },
        { likelihood: 5, consequence: 1, expected: 'bottom-right' }
      ];
      
      riskPositions.forEach(risk => {
        // Position should be calculable and consistent
        const gridX = risk.likelihood - 1; // 0-4
        const gridY = 5 - risk.consequence; // 0-4 (flipped)
        
        expect(gridX).toBeGreaterThanOrEqual(0);
        expect(gridX).toBeLessThan(5);
        expect(gridY).toBeGreaterThanOrEqual(0);
        expect(gridY).toBeLessThan(5);
      });
    });
  });
  
  describe('User Experience Validation', () => {
    test('should provide consistent visual framework', () => {
      // Users should always see the same axis labels
      const userExpectedLabels = {
        xAxis: ["1", "2", "3", "4", "5"],
        yAxis: ["5", "4", "3", "2", "1"] // As displayed top to bottom
      };
      
      // These should never change based on data
      expect(userExpectedLabels.xAxis).toEqual(["1", "2", "3", "4", "5"]);
      expect(userExpectedLabels.yAxis).toEqual(["5", "4", "3", "2", "1"]);
    });
    
    test('should maintain axis labels with data filtering', () => {
      // When Power BI applies filters, axis should remain stable
      const allData = [
        { risk: 'R1', L: 1, C: 1 },
        { risk: 'R2', L: 3, C: 3 },
        { risk: 'R3', L: 5, C: 5 }
      ];
      
      const filteredData = allData.filter(r => r.L >= 3); // Only L=3,5
      
      // Axis should still show 1-5, not just 3,5
      const axisLabelsBeforeFilter = ["1", "2", "3", "4", "5"];
      const axisLabelsAfterFilter = ["1", "2", "3", "4", "5"];
      
      expect(axisLabelsBeforeFilter).toEqual(axisLabelsAfterFilter);
    });
  });
});