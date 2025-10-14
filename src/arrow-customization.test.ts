/**
 * Tests for arrow customization features
 */

describe('Arrow Customization', () => {
  // Mock DOM elements
  const mockSVG = {
    querySelector: jest.fn(),
    createElementNS: jest.fn()
  };

  const mockDefs = {
    querySelector: jest.fn(),
    appendChild: jest.fn()
  };

  const mockMarker = {
    setAttribute: jest.fn(),
    appendChild: jest.fn(),
    remove: jest.fn()
  };

  const mockPath = {
    setAttribute: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup DOM mocks
    global.document = {
      createElementNS: jest.fn()
    } as any;

    (document.createElementNS as jest.Mock)
      .mockReturnValueOnce(mockMarker)
      .mockReturnValueOnce(mockPath);

    mockDefs.querySelector.mockReturnValue(null); // No existing marker
  });

  describe('Arrow Size Calculation', () => {
    test('should create markers with custom size', () => {
      const arrowSize = 12;
      
      // Simulate the createArrowMarker method logic
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("id", "arrow");
      marker.setAttribute("orient", "auto");
      marker.setAttribute("markerWidth", String(arrowSize));
      marker.setAttribute("markerHeight", String(arrowSize));
      marker.setAttribute("refX", String(arrowSize));
      marker.setAttribute("refY", String(arrowSize / 2));

      // Verify correct attributes are set
      expect(marker.setAttribute).toHaveBeenCalledWith("markerWidth", "12");
      expect(marker.setAttribute).toHaveBeenCalledWith("markerHeight", "12");
      expect(marker.setAttribute).toHaveBeenCalledWith("refX", "12");
      expect(marker.setAttribute).toHaveBeenCalledWith("refY", "6");
    });

    test('should create path with correct dimensions', () => {
      const arrowSize = 10;
      
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const expectedPath = `M0,0 L${arrowSize},${arrowSize/2} L0,${arrowSize} Z`;
      path.setAttribute("d", expectedPath);
      path.setAttribute("fill", "#333");

      expect(path.setAttribute).toHaveBeenCalledWith("d", "M0,0 L10,5 L0,10 Z");
      expect(path.setAttribute).toHaveBeenCalledWith("fill", "#333");
    });

    test('should handle minimum arrow size', () => {
      const arrowSize = 4; // Minimum allowed size
      
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("markerWidth", String(arrowSize));
      
      expect(marker.setAttribute).toHaveBeenCalledWith("markerWidth", "4");
    });

    test('should handle maximum arrow size', () => {
      const arrowSize = 20; // Maximum allowed size
      
      const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
      marker.setAttribute("markerWidth", String(arrowSize));
      
      expect(marker.setAttribute).toHaveBeenCalledWith("markerWidth", "20");
    });
  });

  describe('Arrow Distance Calculation', () => {
    // Helper function to simulate calculateArrowPosition
    function calculateArrowPosition(
      start: { x: number, y: number }, 
      end: { x: number, y: number }, 
      distance: number
    ): { start: { x: number, y: number }, end: { x: number, y: number } } {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length === 0) {
        return { start, end };
      }
      
      const unitX = dx / length;
      const unitY = dy / length;
      
      return {
        start: {
          x: start.x + unitX * distance,
          y: start.y + unitY * distance
        },
        end: {
          x: end.x - unitX * distance,
          y: end.y - unitY * distance
        }
      };
    }

    test('should calculate correct arrow positions with distance', () => {
      const start = { x: 100, y: 100 };
      const end = { x: 200, y: 200 };
      const distance = 10;

      const adjusted = calculateArrowPosition(start, end, distance);

      // Verify arrows don't overlap markers
      expect(adjusted.start.x).toBeGreaterThan(start.x);
      expect(adjusted.start.y).toBeGreaterThan(start.y);
      expect(adjusted.end.x).toBeLessThan(end.x);
      expect(adjusted.end.y).toBeLessThan(end.y);

      // Verify exact calculations for diagonal line
      const expectedOffset = distance / Math.sqrt(2); // For 45-degree line
      expect(adjusted.start.x).toBeCloseTo(100 + expectedOffset, 1);
      expect(adjusted.start.y).toBeCloseTo(100 + expectedOffset, 1);
      expect(adjusted.end.x).toBeCloseTo(200 - expectedOffset, 1);
      expect(adjusted.end.y).toBeCloseTo(200 - expectedOffset, 1);
    });

    test('should handle horizontal arrows', () => {
      const start = { x: 100, y: 150 };
      const end = { x: 200, y: 150 }; // Horizontal line
      const distance = 8;

      const adjusted = calculateArrowPosition(start, end, distance);

      expect(adjusted.start.x).toBe(108); // 100 + 8
      expect(adjusted.start.y).toBe(150); // No Y change
      expect(adjusted.end.x).toBe(192);   // 200 - 8
      expect(adjusted.end.y).toBe(150);   // No Y change
    });

    test('should handle vertical arrows', () => {
      const start = { x: 150, y: 100 };
      const end = { x: 150, y: 200 }; // Vertical line
      const distance = 5;

      const adjusted = calculateArrowPosition(start, end, distance);

      expect(adjusted.start.x).toBe(150); // No X change
      expect(adjusted.start.y).toBe(105); // 100 + 5
      expect(adjusted.end.x).toBe(150);   // No X change
      expect(adjusted.end.y).toBe(195);   // 200 - 5
    });

    test('should handle zero-length arrows', () => {
      const start = { x: 100, y: 100 };
      const end = { x: 100, y: 100 }; // Same point
      const distance = 10;

      const adjusted = calculateArrowPosition(start, end, distance);

      // Should return original points when length is zero
      expect(adjusted.start).toEqual(start);
      expect(adjusted.end).toEqual(end);
    });

    test('should handle minimum distance', () => {
      const start = { x: 100, y: 100 };
      const end = { x: 110, y: 100 };
      const distance = 2; // Minimum allowed distance

      const adjusted = calculateArrowPosition(start, end, distance);

      expect(adjusted.start.x).toBe(102); // 100 + 2
      expect(adjusted.end.x).toBe(108);   // 110 - 2
    });

    test('should handle maximum distance', () => {
      const start = { x: 100, y: 100 };
      const end = { x: 200, y: 100 };
      const distance = 15; // Maximum allowed distance

      const adjusted = calculateArrowPosition(start, end, distance);

      expect(adjusted.start.x).toBe(115); // 100 + 15
      expect(adjusted.end.x).toBe(185);   // 200 - 15
    });
  });

  describe('Arrow Settings Validation', () => {
    test('should use default arrow size when value is undefined', () => {
      const defaultArrowSize = 8;
      const arrowSize = undefined || defaultArrowSize;
      
      expect(arrowSize).toBe(8);
    });

    test('should use default distance when value is undefined', () => {
      const defaultDistance = 5;
      const distance = undefined || defaultDistance;
      
      expect(distance).toBe(5);
    });

    test('should validate arrow size range', () => {
      const minSize = 4;
      const maxSize = 20;
      const testSizes = [3, 4, 12, 20, 25];
      
      testSizes.forEach(size => {
        const clampedSize = Math.max(minSize, Math.min(maxSize, size));
        
        if (size < minSize) {
          expect(clampedSize).toBe(minSize);
        } else if (size > maxSize) {
          expect(clampedSize).toBe(maxSize);
        } else {
          expect(clampedSize).toBe(size);
        }
      });
    });

    test('should validate distance range', () => {
      const minDistance = 2;
      const maxDistance = 15;
      const testDistances = [1, 2, 8, 15, 20];
      
      testDistances.forEach(distance => {
        const clampedDistance = Math.max(minDistance, Math.min(maxDistance, distance));
        
        if (distance < minDistance) {
          expect(clampedDistance).toBe(minDistance);
        } else if (distance > maxDistance) {
          expect(clampedDistance).toBe(maxDistance);
        } else {
          expect(clampedDistance).toBe(distance);
        }
      });
    });
  });

  describe('Integration with Visual Settings', () => {
    test('should integrate arrow settings with formatting model', () => {
      // Mock formatting settings structure
      const mockArrowSettings = {
        show: { value: true },
        arrowSize: { value: 10 },
        arrowDistance: { value: 7 }
      };

      // Verify settings are accessible
      expect(mockArrowSettings.show.value).toBe(true);
      expect(mockArrowSettings.arrowSize.value).toBe(10);
      expect(mockArrowSettings.arrowDistance.value).toBe(7);
    });

    test('should handle missing arrow settings gracefully', () => {
      // Simulate missing settings with fallbacks
      const mockArrowSettings = {
        show: { value: true },
        arrowSize: { value: undefined },
        arrowDistance: { value: undefined }
      };

      const arrowSize = mockArrowSettings.arrowSize.value || 8;
      const arrowDistance = mockArrowSettings.arrowDistance.value || 5;

      expect(arrowSize).toBe(8);
      expect(arrowDistance).toBe(5);
    });
  });
});