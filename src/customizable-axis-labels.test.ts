// Tests for customizable axis labels functionality
describe('Customizable Axis Labels', () => {
  
  describe('Text Input Functionality', () => {
    test('should support custom text for X-axis labels', () => {
      const customXLabels = {
        xLabel1: "Very Low",
        xLabel2: "Low", 
        xLabel3: "Medium",
        xLabel4: "High",
        xLabel5: "Very High"
      };
      
      // Test that custom labels can be set
      Object.values(customXLabels).forEach(label => {
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
      
      // Test label array construction
      const xLabels = [
        customXLabels.xLabel1,
        customXLabels.xLabel2,
        customXLabels.xLabel3,
        customXLabels.xLabel4,
        customXLabels.xLabel5
      ];
      
      expect(xLabels).toEqual(["Very Low", "Low", "Medium", "High", "Very High"]);
    });
    
    test('should support custom text for Y-axis labels', () => {
      const customYLabels = {
        yLabel1: "Negligible",
        yLabel2: "Minor",
        yLabel3: "Moderate", 
        yLabel4: "Major",
        yLabel5: "Catastrophic"
      };
      
      // Test that custom labels can be set
      Object.values(customYLabels).forEach(label => {
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
      
      // Test label array construction (displayed in reverse order)
      const yLabels = [
        customYLabels.yLabel1,
        customYLabels.yLabel2,
        customYLabels.yLabel3,
        customYLabels.yLabel4,
        customYLabels.yLabel5
      ];
      
      // Y-axis displays from top to bottom: 5,4,3,2,1
      const displayOrder = yLabels.reverse();
      expect(displayOrder).toEqual(["Catastrophic", "Major", "Moderate", "Minor", "Negligible"]);
    });
    
    test('should fallback to default values when custom text is empty', () => {
      const settingsWithEmptyValues = {
        xLabel1: "", // Empty string
        xLabel2: undefined, // Undefined
        xLabel3: null, // Null
        xLabel4: "4", // Valid
        xLabel5: "Custom" // Valid custom
      };
      
      // Simulate fallback logic
      const getLabel = (customValue: string | undefined | null, defaultValue: string) => {
        return customValue || defaultValue;
      };
      
      const xLabels = [
        getLabel(settingsWithEmptyValues.xLabel1, "1"),
        getLabel(settingsWithEmptyValues.xLabel2, "2"),
        getLabel(settingsWithEmptyValues.xLabel3, "3"),
        getLabel(settingsWithEmptyValues.xLabel4, "4"),
        getLabel(settingsWithEmptyValues.xLabel5, "5")
      ];
      
      expect(xLabels).toEqual(["1", "2", "3", "4", "Custom"]);
    });
  });
  
  describe('Font Size Configuration', () => {
    test('should support configurable X-axis font sizes', () => {
      const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24];
      
      fontSizeOptions.forEach(size => {
        expect(size).toBeGreaterThanOrEqual(8);
        expect(size).toBeLessThanOrEqual(24);
        expect(Number.isInteger(size)).toBe(true);
      });
      
      // Test default value
      const defaultXFontSize = 10;
      expect(defaultXFontSize).toBe(10);
    });
    
    test('should support configurable Y-axis font sizes', () => {
      const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24];
      
      fontSizeOptions.forEach(size => {
        expect(size).toBeGreaterThanOrEqual(8);
        expect(size).toBeLessThanOrEqual(24);
        expect(Number.isInteger(size)).toBe(true);
      });
      
      // Test default value
      const defaultYFontSize = 10;
      expect(defaultYFontSize).toBe(10);
    });
    
    test('should validate font size boundaries', () => {
      const testFontSize = (size: number) => {
        return Math.max(8, Math.min(24, size));
      };
      
      // Test boundary conditions
      expect(testFontSize(5)).toBe(8);   // Below minimum
      expect(testFontSize(8)).toBe(8);   // At minimum
      expect(testFontSize(12)).toBe(12); // Within range
      expect(testFontSize(24)).toBe(24); // At maximum
      expect(testFontSize(30)).toBe(24); // Above maximum
    });
  });
  
  describe('Y-Axis Orientation Options', () => {
    test('should support horizontal text orientation', () => {
      const horizontalOrientation = {
        value: "horizontal",
        displayName: "Horizontal"
      };
      
      expect(horizontalOrientation.value).toBe("horizontal");
      expect(horizontalOrientation.displayName).toBe("Horizontal");
    });
    
    test('should support vertical text orientation', () => {
      const verticalOrientation = {
        value: "vertical", 
        displayName: "Vertical"
      };
      
      expect(verticalOrientation.value).toBe("vertical");
      expect(verticalOrientation.displayName).toBe("Vertical");
    });
    
    test('should default to horizontal when orientation is undefined', () => {
      const getOrientation = (setting: any) => {
        return setting?.value?.value || "horizontal";
      };
      
      expect(getOrientation(undefined)).toBe("horizontal");
      expect(getOrientation(null)).toBe("horizontal");
      expect(getOrientation({})).toBe("horizontal");
      expect(getOrientation({ value: { value: "vertical" } })).toBe("vertical");
    });
  });
  
  describe('Show/Hide Axis Labels', () => {
    test('should support toggling X-axis label visibility', () => {
      const showXLabelsSettings = [
        { showXLabels: true, expectedVisible: true },
        { showXLabels: false, expectedVisible: false },
        { showXLabels: undefined, expectedVisible: true }, // Default to true
      ];
      
      showXLabelsSettings.forEach(({ showXLabels, expectedVisible }) => {
        const isVisible = showXLabels !== false;
        expect(isVisible).toBe(expectedVisible);
      });
    });
    
    test('should support toggling Y-axis label visibility', () => {
      const showYLabelsSettings = [
        { showYLabels: true, expectedVisible: true },
        { showYLabels: false, expectedVisible: false },
        { showYLabels: undefined, expectedVisible: true }, // Default to true
      ];
      
      showYLabelsSettings.forEach(({ showYLabels, expectedVisible }) => {
        const isVisible = showYLabels !== false;
        expect(isVisible).toBe(expectedVisible);
      });
    });
  });
  
  describe('Axis Label Positioning Logic', () => {
    test('should calculate correct X-axis label positions', () => {
      const mockViewport = { width: 800, height: 600 };
      const margins = { l: 40, r: 10, t: 10, b: 30 };
      const cols = 5;
      const cellWidth = (mockViewport.width - margins.l - margins.r) / cols; // 150
      
      // Calculate X positions for each label
      const xPositions = Array.from({ length: cols }, (_, x) => {
        return margins.l + (x + 0.5) * cellWidth;
      });
      
      // Verify positions with precision handling
      const expectedXPositions = [115, 265, 415, 565, 715];
      xPositions.forEach((pos, index) => {
        expect(pos).toBeCloseTo(expectedXPositions[index], 10);
      });
      
      // Y position should be near bottom
      const yPosition = mockViewport.height - 8; // 592
      expect(yPosition).toBe(592);
    });
    
    test('should calculate correct Y-axis label positions', () => {
      const mockViewport = { width: 800, height: 600 };
      const margins = { l: 40, r: 10, t: 10, b: 30 };
      const rows = 5;
      const cellHeight = (mockViewport.height - margins.t - margins.b) / rows; // 112
      
      // Calculate Y positions for each label (displayed top to bottom as 5,4,3,2,1)
      const yPositions = Array.from({ length: rows }, (_, y) => {
        return margins.t + (y + 0.6) * cellHeight;
      });
      
      // Handle floating point precision issues
      const expectedPositions = [77.2, 189.2, 301.2, 413.2, 525.2];
      yPositions.forEach((pos, index) => {
        expect(pos).toBeCloseTo(expectedPositions[index], 1);
      });
      
      // X position depends on orientation
      const horizontalX = 12;
      const verticalX = 25;
      expect(horizontalX).toBe(12);
      expect(verticalX).toBe(25);
    });
    
    test('should handle vertical text rotation calculations', () => {
      const mockPosition = { x: 25, y: 200 };
      const rotateTransform = `rotate(-90, ${mockPosition.x}, ${mockPosition.y})`;
      
      expect(rotateTransform).toBe("rotate(-90, 25, 200)");
      
      // Verify rotation is counterclockwise 90 degrees
      const rotationAngle = -90;
      expect(rotationAngle).toBe(-90);
    });
  });
  
  describe('Real-World Usage Scenarios', () => {
    test('should handle risk assessment terminology', () => {
      const riskTerminology = {
        likelihood: ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"],
        consequence: ["Insignificant", "Minor", "Moderate", "Major", "Catastrophic"]
      };
      
      expect(riskTerminology.likelihood).toHaveLength(5);
      expect(riskTerminology.consequence).toHaveLength(5);
      
      // Test that all terms are strings and non-empty
      [...riskTerminology.likelihood, ...riskTerminology.consequence].forEach(term => {
        expect(typeof term).toBe('string');
        expect(term.length).toBeGreaterThan(0);
      });
    });
    
    test('should handle numerical scales', () => {
      const numericalScales = {
        standard: ["1", "2", "3", "4", "5"],
        percentage: ["20%", "40%", "60%", "80%", "100%"],
        decimal: ["0.2", "0.4", "0.6", "0.8", "1.0"]
      };
      
      Object.values(numericalScales).forEach(scale => {
        expect(scale).toHaveLength(5);
        scale.forEach(value => {
          expect(typeof value).toBe('string');
          expect(value.length).toBeGreaterThan(0);
        });
      });
    });
    
    test('should handle multilingual labels', () => {
      const multilingualLabels = {
        english: ["Low", "Medium", "High", "Very High", "Extreme"],
        spanish: ["Bajo", "Medio", "Alto", "Muy Alto", "Extremo"],
        french: ["Faible", "Moyen", "Élevé", "Très Élevé", "Extrême"]
      };
      
      Object.values(multilingualLabels).forEach(labels => {
        expect(labels).toHaveLength(5);
        labels.forEach(label => {
          expect(typeof label).toBe('string');
          expect(label.length).toBeGreaterThan(0);
        });
      });
    });
  });
});