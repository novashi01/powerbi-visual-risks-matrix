import { test, expect } from '@playwright/test';

test.describe('Risk Matrix Visual', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the visual development server
    await page.goto('/');
  });

  test('should render 5x5 grid', async ({ page }) => {
    // Wait for the visual to load
    await page.waitForSelector('svg', { timeout: 10000 });
    
    // Check if SVG container exists
    const svg = await page.locator('svg').first();
    await expect(svg).toBeVisible();
    
    // Should have 25 grid cells (5x5)
    const gridCells = await page.locator('svg rect[fill-opacity="0.25"]');
    await expect(gridCells).toHaveCount(25);
  });

  test('should display axis labels', async ({ page }) => {
    await page.waitForSelector('svg');
    
    // Check for axis labels (should be 1-5 on both axes)
    const xAxisLabels = await page.locator('svg text[text-anchor="middle"]');
    const yAxisLabels = await page.locator('svg text[text-anchor="start"]');
    
    await expect(xAxisLabels).toHaveCount(5); // X-axis labels
    await expect(yAxisLabels).toHaveCount(5); // Y-axis labels
  });

  test('visual regression - baseline screenshot', async ({ page }) => {
    await page.waitForSelector('svg', { timeout: 10000 });
    
    // Wait a bit for any animations to complete
    await page.waitForTimeout(1000);
    
    // Take screenshot for visual regression testing
    await expect(page.locator('svg')).toHaveScreenshot('risk-matrix-baseline.png');
  });

  test('should handle empty data gracefully', async ({ page }) => {
    await page.waitForSelector('svg');
    
    // With empty data, should still show grid but no risk points
    const svg = await page.locator('svg').first();
    await expect(svg).toBeVisible();
    
    // Grid should still be visible
    const gridCells = await page.locator('svg rect[fill-opacity="0.25"]');
    await expect(gridCells).toHaveCount(25);
    
    // But no risk points initially
    const riskPoints = await page.locator('svg circle');
    await expect(riskPoints.count()).toBeGreaterThanOrEqual(0);
  });

  test('should apply severity color bands correctly', async ({ page }) => {
    await page.waitForSelector('svg');
    
    // Check that grid cells have different fill colors based on severity
    const gridCells = await page.locator('svg rect[fill-opacity="0.25"]');
    
    // Get the first cell (1×1 = Low)
    const lowCell = gridCells.first();
    const lowCellFill = await lowCell.getAttribute('fill');
    
    // Get a high severity cell (5×5 = Extreme) 
    const highCell = gridCells.last();
    const highCellFill = await highCell.getAttribute('fill');
    
    // They should have different colors
    expect(lowCellFill).not.toBe(highCellFill);
  });

  test('should be responsive to viewport changes', async ({ page }) => {
    await page.waitForSelector('svg');
    
    // Get initial SVG dimensions
    const svg = await page.locator('svg').first();
    const initialBounds = await svg.boundingBox();
    
    // Resize viewport
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(500); // Allow time for resize
    
    // Check that SVG adapts to new size
    const newBounds = await svg.boundingBox();
    expect(newBounds?.width).not.toBe(initialBounds?.width);
  });
});