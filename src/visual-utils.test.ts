// Comprehensive tests for visual utility functions
import {
  clamp,
  getSeverityColor,
  stableJitter,
  calculateGridLayout,
  toGridPosition,
  hasValidPosition,
  calculateRiskScore,
  processRiskData,
  calculateSelectionOpacity,
  RiskPoint
} from './visual-utils';

describe('Visual Utilities', () => {
  
  describe('clamp', () => {
    test('should clamp values to 1-5 range', () => {
      expect(clamp(0)).toBe(1);
      expect(clamp(1)).toBe(1);
      expect(clamp(3)).toBe(3);
      expect(clamp(5)).toBe(5);
      expect(clamp(6)).toBe(5);
      expect(clamp(10)).toBe(5);
    });

    test('should handle null, undefined, and NaN', () => {
      expect(clamp(null)).toBeUndefined();
      expect(clamp(undefined)).toBeUndefined();
      expect(clamp(NaN)).toBeUndefined();
    });

    test('should round decimal values', () => {
      expect(clamp(1.4)).toBe(1);
      expect(clamp(1.6)).toBe(2);
      expect(clamp(4.5)).toBe(5);
      expect(clamp(5.8)).toBe(5);
    });
  });

  describe('getSeverityColor', () => {
    test('should return correct colors for default thresholds', () => {
      expect(getSeverityColor(2)).toBe("#388e3c");  // Low
      expect(getSeverityColor(4)).toBe("#388e3c");  // Low boundary
      expect(getSeverityColor(6)).toBe("#fbc02d");  // Moderate
      expect(getSeverityColor(9)).toBe("#fbc02d");  // Moderate boundary
      expect(getSeverityColor(12)).toBe("#f57c00"); // High
      expect(getSeverityColor(16)).toBe("#f57c00"); // High boundary
      expect(getSeverityColor(20)).toBe("#d32f2f"); // Extreme
      expect(getSeverityColor(25)).toBe("#d32f2f"); // Maximum extreme
    });

    test('should handle custom thresholds', () => {
      const customThresholds = { low: 2, moderate: 6, high: 12 };
      expect(getSeverityColor(1, customThresholds)).toBe("#388e3c");  // Low
      expect(getSeverityColor(4, customThresholds)).toBe("#fbc02d");  // Moderate
      expect(getSeverityColor(8, customThresholds)).toBe("#f57c00");  // High
      expect(getSeverityColor(15, customThresholds)).toBe("#d32f2f"); // Extreme
    });
  });

  describe('stableJitter', () => {
    test('should provide consistent jitter for same ID', () => {
      const jitter1 = stableJitter('RISK-001', 100, 80);
      const jitter2 = stableJitter('RISK-001', 100, 80);
      expect(jitter1).toEqual(jitter2);
    });

    test('should provide different jitter for different IDs', () => {
      const jitter1 = stableJitter('RISK-001', 100, 80);
      const jitter2 = stableJitter('RISK-002', 100, 80);
      expect(jitter1).not.toEqual(jitter2);
    });

    test('should keep jitter within bounds', () => {
      const cellW = 100, cellH = 80;
      const jitter = stableJitter('TEST-RISK', cellW, cellH);
      
      expect(Math.abs(jitter.dx)).toBeLessThanOrEqual(cellW * 0.3);
      expect(Math.abs(jitter.dy)).toBeLessThanOrEqual(cellH * 0.3);
    });
  });

  describe('calculateGridLayout', () => {
    test('should calculate correct dimensions', () => {
      const layout = calculateGridLayout({ width: 800, height: 600 });
      
      expect(layout.cellWidth).toBe(150);  // (800-40-10)/5 = 750/5 = 150
      expect(layout.cellHeight).toBe(112); // (600-10-30)/5 = 560/5 = 112
      expect(layout.cols).toBe(5);
      expect(layout.rows).toBe(5);
      expect(layout.margins).toEqual({ l: 40, r: 10, t: 10, b: 30 });
    });

    test('should handle small viewports', () => {
      const layout = calculateGridLayout({ width: 400, height: 300 });
      
      expect(layout.cellWidth).toBe(70);   // (400-40-10)/5 = 350/5 = 70
      expect(layout.cellHeight).toBe(52);  // (300-10-30)/5 = 260/5 = 52
    });
  });

  describe('toGridPosition', () => {
    test('should calculate correct positions', () => {
      const layout = calculateGridLayout({ width: 800, height: 600 });
      
      const pos11 = toGridPosition(1, 1, layout);
      const pos55 = toGridPosition(5, 5, layout);
      
      // For pos11 (1,1): x = 40 + (1-1)*150 + 150/2 = 40 + 0 + 75 = 115
      //                 y = 10 + (5-1)*112 + 112/2 = 10 + 448 + 56 = 514
      expect(pos11.x).toBe(115);  
      expect(pos11.y).toBe(514);  // 10 + 4*112 + 56 = 10 + 448 + 56 = 514
      
      // For pos55 (5,5): x = 40 + (5-1)*150 + 150/2 = 40 + 600 + 75 = 715
      //                 y = 10 + (5-5)*112 + 112/2 = 10 + 0 + 56 = 66  
      expect(pos55.x).toBe(715);  
      expect(pos55.y).toBe(66);   // 10 + 0*112 + 56 = 66
    });
  });

  describe('hasValidPosition', () => {
    test('should validate risk points with inherent values', () => {
      const risk: RiskPoint = { id: 'R1', lInh: 2, cInh: 3 };
      expect(hasValidPosition(risk)).toBe(true);
    });

    test('should validate risk points with residual values', () => {
      const risk: RiskPoint = { id: 'R1', lRes: 2, cRes: 3 };
      expect(hasValidPosition(risk)).toBe(true);
    });

    test('should validate risk points with both values', () => {
      const risk: RiskPoint = { 
        id: 'R1', 
        lInh: 3, cInh: 4, 
        lRes: 2, cRes: 3 
      };
      expect(hasValidPosition(risk)).toBe(true);
    });

    test('should reject risk points with incomplete data', () => {
      const risk1: RiskPoint = { id: 'R1', lInh: 2 }; // Missing cInh
      const risk2: RiskPoint = { id: 'R2' }; // No values
      
      expect(hasValidPosition(risk1)).toBe(false);
      expect(hasValidPosition(risk2)).toBe(false);
    });
  });

  describe('calculateRiskScore', () => {
    test('should calculate scores correctly', () => {
      expect(calculateRiskScore(1, 1)).toBe(1);
      expect(calculateRiskScore(2, 3)).toBe(6);
      expect(calculateRiskScore(4, 5)).toBe(20);
      expect(calculateRiskScore(5, 5)).toBe(25);
    });
  });

  describe('processRiskData', () => {
    const sampleData = [
      { id: 'RISK-001', lInh: 3, cInh: 4, lRes: 2, cRes: 3, category: 'Operational' },
      { id: 'RISK-002', lInh: 0, cInh: 6, lRes: -1, cRes: 10 }, // Out of range
      { id: 'RISK-003', lRes: 2, cRes: 3 }, // Only residual
      { id: 'RISK-004', lInh: 1 }, // Incomplete
      { id: 'RISK-005', lInh: null as any, cInh: NaN, lRes: 2, cRes: 3 } // Null values
    ];

    test('should process valid data correctly', () => {
      const result = processRiskData(sampleData);
      
      expect(result).toHaveLength(4); // 4 valid risks (excluding incomplete RISK-004)
      
      // Check first risk
      expect(result[0]).toMatchObject({
        id: 'RISK-001',
        lInh: 3, cInh: 4,
        lRes: 2, cRes: 3,
        category: 'Operational'
      });
      
      // Check clamping
      const clampedRisk = result.find(r => r.id === 'RISK-002');
      expect(clampedRisk?.lInh).toBe(1); // Clamped from 0
      expect(clampedRisk?.cInh).toBe(5); // Clamped from 6
      expect(clampedRisk?.lRes).toBe(1); // Clamped from -1
      expect(clampedRisk?.cRes).toBe(5); // Clamped from 10
      
      // Check null handling
      const nullRisk = result.find(r => r.id === 'RISK-005');
      expect(nullRisk?.lInh).toBeUndefined();
      expect(nullRisk?.cInh).toBeUndefined();
      expect(nullRisk?.lRes).toBe(2);
      expect(nullRisk?.cRes).toBe(3);
    });

    test('should apply data reduction cap', () => {
      const largeDataset = Array.from({ length: 1500 }, (_, i) => ({
        id: `RISK-${i + 1}`,
        lRes: 2,
        cRes: 3
      }));
      
      const result = processRiskData(largeDataset);
      expect(result).toHaveLength(1000); // Capped at 1000
    });

    test('should filter out invalid risks', () => {
      const invalidData = [
        { id: 'INVALID-1', lInh: 2 }, // Missing cInh
        { id: 'INVALID-2' }, // No values
        { id: 'INVALID-3', lRes: null as any, cRes: null as any }
      ];
      
      const result = processRiskData(invalidData);
      expect(result).toHaveLength(0);
    });
  });

  describe('calculateSelectionOpacity', () => {
    test('should return full opacity when no selection', () => {
      expect(calculateSelectionOpacity(false, false)).toBe('1');
      expect(calculateSelectionOpacity(false, true)).toBe('1');
    });

    test('should return full opacity when selected', () => {
      expect(calculateSelectionOpacity(true, true)).toBe('1');
    });

    test('should return reduced opacity when not selected', () => {
      expect(calculateSelectionOpacity(true, false)).toBe('0.2');
      expect(calculateSelectionOpacity(true, false, 0.3)).toBe('0.3');
    });
  });
});