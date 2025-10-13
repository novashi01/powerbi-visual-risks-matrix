// Utility functions extracted from visual.ts for better testability
// These functions contain the core business logic without Power BI dependencies

export interface RiskPoint {
    id: string;
    lInh?: number; 
    cInh?: number;
    lRes?: number; 
    cRes?: number;
    category?: string;
}

/**
 * Clamps a numeric value to the range [1, 5]
 */
export function clamp(n?: number): number | undefined {
    if (n == null || isNaN(n)) return undefined;
    return Math.max(1, Math.min(5, Math.round(n)));
}

/**
 * Calculates severity color based on risk score
 */
export function getSeverityColor(score: number, thresholds = { low: 4, moderate: 9, high: 16 }): string {
    const colors = {
        low: "#388e3c",
        moderate: "#fbc02d", 
        high: "#f57c00",
        extreme: "#d32f2f"
    };
    
    if (score > thresholds.high) return colors.extreme;
    if (score > thresholds.moderate) return colors.high;
    if (score > thresholds.low) return colors.moderate;
    return colors.low;
}

/**
 * Generates consistent jitter for risk point positioning
 */
export function stableJitter(id: string, cellW: number, cellH: number): { dx: number, dy: number } {
    let h = 2166136261;
    for (let i = 0; i < id.length; i++) {
        h ^= id.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    const r1 = ((h >>> 0) % 1000) / 1000 - 0.5;
    const r2 = (((h >>> 1) % 1000) / 1000) - 0.5;
    return { dx: r1 * cellW * 0.3, dy: r2 * cellH * 0.3 };
}

/**
 * Calculates grid cell dimensions based on viewport
 */
export function calculateGridLayout(viewport: { width: number; height: number }) {
    const margins = { l: 40, r: 10, t: 10, b: 30 };
    const availableW = viewport.width - margins.l - margins.r;
    const availableH = viewport.height - margins.t - margins.b;
    const cols = 5, rows = 5;
    
    return {
        cellWidth: availableW / cols,
        cellHeight: availableH / rows,
        margins,
        cols,
        rows
    };
}

/**
 * Converts likelihood/consequence values to X/Y coordinates
 */
export function toGridPosition(likelihood: number, consequence: number, layout: ReturnType<typeof calculateGridLayout>) {
    const { cellWidth, cellHeight, margins, rows } = layout;
    const x = margins.l + (likelihood - 1) * cellWidth + cellWidth / 2;
    const y = margins.t + (rows - consequence) * cellHeight + cellHeight / 2;
    return { x, y };
}

/**
 * Validates if a risk point has a valid position (either inherent or residual)
 */
export function hasValidPosition(riskPoint: RiskPoint): boolean {
    return (riskPoint.lInh != null && riskPoint.cInh != null) || 
           (riskPoint.lRes != null && riskPoint.cRes != null);
}

/**
 * Calculates risk score from likelihood and consequence
 */
export function calculateRiskScore(likelihood: number, consequence: number): number {
    return likelihood * consequence;
}

/**
 * Processes raw risk data with clamping and validation
 */
export function processRiskData(rawData: Array<{
    id: string;
    lInh?: number;
    cInh?: number;
    lRes?: number; 
    cRes?: number;
    category?: string;
}>): RiskPoint[] {
    const maxItems = 1000; // Data reduction cap
    const processedData: RiskPoint[] = [];
    
    const itemsToProcess = Math.min(rawData.length, maxItems);
    
    for (let i = 0; i < itemsToProcess; i++) {
        const item = rawData[i];
        const riskPoint: RiskPoint = {
            id: item.id,
            lInh: clamp(item.lInh),
            cInh: clamp(item.cInh),
            lRes: clamp(item.lRes),
            cRes: clamp(item.cRes),
            category: item.category
        };
        
        if (hasValidPosition(riskPoint)) {
            processedData.push(riskPoint);
        }
    }
    
    return processedData;
}

/**
 * Calculates selection opacity based on selection state
 */
export function calculateSelectionOpacity(hasSelection: boolean, isSelected: boolean, alpha = 0.2): string {
    return !hasSelection || isSelected ? '1' : String(alpha);
}