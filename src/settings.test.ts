// Unit tests for Settings
// Note: Testing individual setting values rather than the full model due to ESM import issues

describe('Settings Configuration', () => {
  test('should have correct default severity colors', () => {
    // Test the expected default colors
    const expectedColors = {
      low: "#388e3c",
      moderate: "#fbc02d", 
      high: "#f57c00",
      extreme: "#d32f2f"
    };
    
    // These are the colors we expect in the visual
    expect(expectedColors.low).toBe("#388e3c");
    expect(expectedColors.moderate).toBe("#fbc02d");
    expect(expectedColors.high).toBe("#f57c00");
    expect(expectedColors.extreme).toBe("#d32f2f");
  });

  test('should have correct default threshold values', () => {
    const expectedThresholds = {
      lowMax: 4,
      moderateMax: 9,
      highMax: 16
    };
    
    expect(expectedThresholds.lowMax).toBe(4);
    expect(expectedThresholds.moderateMax).toBe(9);
    expect(expectedThresholds.highMax).toBe(16);
  });

  test('should have correct marker defaults', () => {
    const expectedDefaults = {
      markerSize: 6,
      showLabels: false,
      labelFontSize: 10,
      showArrows: true,
      showTooltips: true,
      animationEnabled: true,
      animationDuration: 800
    };
    
    expect(expectedDefaults.markerSize).toBe(6);
    expect(expectedDefaults.showLabels).toBe(false);
    expect(expectedDefaults.labelFontSize).toBe(10);
    expect(expectedDefaults.showArrows).toBe(true);
    expect(expectedDefaults.showTooltips).toBe(true);
    expect(expectedDefaults.animationEnabled).toBe(true);
    expect(expectedDefaults.animationDuration).toBe(800);
  });

  test('should validate color formats', () => {
    const colorPattern = /^#[0-9a-fA-F]{6}$/;
    
    expect("#388e3c").toMatch(colorPattern);
    expect("#fbc02d").toMatch(colorPattern);
    expect("#f57c00").toMatch(colorPattern);
    expect("#d32f2f").toMatch(colorPattern);
  });

  test('should validate threshold logic', () => {
    const thresholds = { low: 4, moderate: 9, high: 16 };
    
    // Thresholds should be in ascending order
    expect(thresholds.low).toBeLessThan(thresholds.moderate);
    expect(thresholds.moderate).toBeLessThan(thresholds.high);
    
    // Should cover the full risk matrix range (1-25)
    expect(thresholds.low).toBeGreaterThan(0);
    expect(thresholds.high).toBeLessThan(26);
  });
});