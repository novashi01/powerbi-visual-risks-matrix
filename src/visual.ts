/*
*  Power BI Visual CLI
*  MIT License
*/
"use strict";

import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import DataViewCategorical = powerbi.DataViewCategorical;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IViewport = powerbi.IViewport;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionId = powerbi.visuals.ISelectionId;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ITooltipService = powerbi.extensibility.ITooltipService;
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";
import { applyScrollFadeMask } from "./scrollFade";
import "./../style/visual.less";

interface RiskPoint {
    id: string;
    lInh?: number; 
    cInh?: number;
    lRes?: number; 
    cRes?: number;
    category?: string;
    selectionId?: ISelectionId;
    tooltipData?: any; // Store tooltip data from Power BI
}

export class Visual implements IVisual {
    private svg: SVGSVGElement;
    private gGrid: SVGGElement;
    private gArrows: SVGGElement;
    private gPoints: SVGGElement;
    // Track active click animations per element so we can cancel/restart without blinking
    private activeClickAnims: WeakMap<Element, Animation> = new WeakMap();
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private host: IVisualHost;
    private selectionManager: ISelectionManager;
    private tooltipService: ITooltipService;
    private tooltipDiv: HTMLDivElement; // Custom tooltip element
    private expandedCell: string | null = null; // Track expanded cell for centered drill-down (format: "L-C")
    private currentData: RiskPoint[] = []; // Store current data for re-rendering

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.selectionManager = this.host.createSelectionManager();
        this.tooltipService = this.host.tooltipService;
        this.formattingSettingsService = new FormattingSettingsService();
        
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.gGrid = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.gArrows = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.gPoints = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        
        // Initial arrow marker with default size (will be updated in update method)
        this.createArrowMarker(defs, 8, "#666666");
        
        this.svg.appendChild(defs);
        this.svg.appendChild(this.gGrid);
        this.svg.appendChild(this.gArrows);
        this.svg.appendChild(this.gPoints);
        
        // Clear element safely without innerHTML
        while (options.element.firstChild) {
            options.element.removeChild(options.element.firstChild);
        }
        options.element.appendChild(this.svg);
        
        // Create custom tooltip div
        this.tooltipDiv = document.createElement("div");
        this.tooltipDiv.style.position = "absolute";
        this.tooltipDiv.style.display = "none";
        this.tooltipDiv.style.pointerEvents = "none";
        this.tooltipDiv.style.zIndex = "10000";
        this.tooltipDiv.style.padding = "8px 12px";
        this.tooltipDiv.style.borderRadius = "4px";
        this.tooltipDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        this.tooltipDiv.style.whiteSpace = "normal";
        this.tooltipDiv.style.wordWrap = "break-word";
        this.tooltipDiv.style.maxWidth = "300px";
        this.tooltipDiv.style.minWidth = "50px";
        this.tooltipDiv.style.lineHeight = "1.4";
        options.element.appendChild(this.tooltipDiv);
        
        // clear any prior selection visuals
        this.selectionManager.clear();
        // clear selection on background click
        // reflect selection state by dimming unselected
        this.selectionManager.registerOnSelectCallback(() => {
            this.updateSelectionHighlight();
        });
        this.svg.addEventListener("click", (e) => {
            if (e.target === this.svg) {
                this.selectionManager.clear();
            }
        });
    }

    public update(options: VisualUpdateOptions) {
        try {
            // Clear expanded cell state on data refresh
            this.expandedCell = null;
            
            const view = options.dataViews && options.dataViews[0];
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, view);
            
            // Update arrow marker with current settings (with safe access)
            const arrowSize = this.formattingSettings?.arrowsCard?.arrowSize?.value || 8;
            const defs = this.svg.querySelector('defs') as SVGDefsElement;
            if (defs) {
                const arrowColor = this.formattingSettings?.arrowsCard?.arrowColor?.value?.value || "#666666";
                this.createArrowMarker(defs, arrowSize, arrowColor);
            }
            
            const vp = options.viewport;
            this.resize(vp);
            this.renderGrid(vp, view);
            const data = this.mapData(view);
            this.renderData(vp, data);
        } catch (error) {
            console.error("Error in visual update:", error);
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    private updateSelectionHighlight() {
        // Use selection manager's getSelectionIds() to check for selections
        const selections = this.selectionManager.getSelectionIds();
        const hasSelection = selections && selections.length > 0;
        const alpha = hasSelection ? 0.2 : 1;
        
        Array.from(this.gPoints.querySelectorAll('circle')).forEach(el => {
            const sel = (el as any).__sel as ISelectionId | undefined;
            let isSelected = false;
            
            if (hasSelection && sel) {
                // Check if this element's selection ID matches any selected ID
                // Use JSON comparison as fallback since ISelectionId may not have key property
                isSelected = selections.some(selectedId => 
                    JSON.stringify(selectedId) === JSON.stringify(sel)
                );
            }
            
            const opacity = !hasSelection || isSelected ? '1' : String(alpha);
            (el as SVGCircleElement).setAttribute('opacity', opacity);
        });

        // Additionally, if a selection exists, temporarily disable the scroll fade mask on any
        // cell group that contains a selected marker so the selected marker does not appear
        // faded/"vague" by the gradient. Restore masks on cells without selected markers.
        try {
            const cellGroups = Array.from(this.gPoints.querySelectorAll('g.cell-group')) as SVGGElement[];
            cellGroups.forEach(cg => {
                const maskValue = cg.getAttribute('data-scroll-mask');
                // Determine if this cell contains any selected element (markerGroup or circle)
                const containsSelected = hasSelection && Array.from(cg.querySelectorAll('*')).some(el => {
                    const s = (el as any).__sel as ISelectionId | undefined;
                    if (!s) return false;
                    return selections.some(selectedId => JSON.stringify(selectedId) === JSON.stringify(s));
                });

                if (containsSelected) {
                    // remove mask while selected to avoid appearing faded
                    if (cg.hasAttribute('mask')) cg.removeAttribute('mask');
                } else {
                    // restore mask if we previously stored one
                    if (maskValue) cg.setAttribute('mask', maskValue);
                }
            });
        } catch (e) {
            // Non-fatal if DOM traversal fails in test environment
        }
    }

    private resize(vp: IViewport) {
        this.svg.setAttribute("width", String(vp.width));
        this.svg.setAttribute("height", String(vp.height));
    }

    private getSeverityColor(score: number): string {
        const low = this.formattingSettings.severityCard.low.value.value || "#388e3c";
        const mod = this.formattingSettings.severityCard.moderate.value.value || "#fbc02d";
        const high = this.formattingSettings.severityCard.high.value.value || "#f57c00";
        const ext = this.formattingSettings.severityCard.extreme.value.value || "#d32f2f";
        const tLow = this.formattingSettings.thresholdsCard.lowMax.value ?? 4;
        const tMod = this.formattingSettings.thresholdsCard.moderateMax.value ?? 9;
        const tHigh = this.formattingSettings.thresholdsCard.highMax.value ?? 16;
        if (score > tHigh) return ext; 
        if (score > tMod) return high; 
        if (score > tLow) return mod; 
        return low;
    }

    private renderGrid(vp: IViewport, view?: DataView) {
        // Clear grid safely without innerHTML
        while (this.gGrid.firstChild) {
            this.gGrid.removeChild(this.gGrid.firstChild);
        }
        
        // Get matrix dimensions from settings
        const matrixRows = this.formattingSettings?.matrixGridCard?.matrixRows?.value || 5;
        const matrixColumns = this.formattingSettings?.matrixGridCard?.matrixColumns?.value || 5;
        
        const m = { l: 40, r: 10, t: 10, b: 30 };
        
        // Auto-fit to viewport (no scrolling)
        const w = vp.width - m.l - m.r;
        const h = vp.height - m.t - m.b;
        const cols = matrixColumns;
        const rows = matrixRows;
        const cw = w / cols;
        const ch = h / rows;
        
        // Cells with severity background
        // SWAPPED: Consequence (C) on X-axis, Likelihood (L) on Y-axis
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const C = x + 1;           // Consequence on X-axis (horizontal)
                const L = rows - y;        // Likelihood on Y-axis (vertical, inverted)
                const score = L * C;
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", String(m.l + x * cw));
                rect.setAttribute("y", String(m.t + y * ch));
                rect.setAttribute("width", String(cw)); rect.setAttribute("height", String(ch));
                rect.setAttribute("fill", this.getSeverityColor(score));
                // Use configured severity transparency (percentage -> opacity)
                const severityTransparency = (this.formattingSettings?.matrixGridCard?.severityTransparency?.value ?? 25) / 100;
                rect.setAttribute("fill-opacity", String(severityTransparency));
                // Use configured grid border color
                const borderColor = this.formattingSettings?.matrixGridCard?.gridBorderColor?.value?.value || "#cccccc";
                rect.setAttribute("stroke", borderColor); rect.setAttribute("stroke-width", "1");
                this.gGrid.appendChild(rect);
            }
        }
        
        // Get customizable axis labels from settings
        const settings = this.formattingSettings?.axesCard;
        const cLabs = [
            settings?.xLabel1?.value || "1",
            settings?.xLabel2?.value || "2", 
            settings?.xLabel3?.value || "3",
            settings?.xLabel4?.value || "4",
            settings?.xLabel5?.value || "5"
        ];
        const lLabs = [
            settings?.yLabel1?.value || "1",
            settings?.yLabel2?.value || "2",
            settings?.yLabel3?.value || "3", 
            settings?.yLabel4?.value || "4",
            settings?.yLabel5?.value || "5"
        ];
        
        const showXLabels = settings?.showXLabels?.value !== false;
        const showYLabels = settings?.showYLabels?.value !== false;
        const showAxisTitles = settings?.showAxisTitles?.value !== false;
        const xAxisTitle = settings?.xAxisTitle?.value || "Consequence";
        const yAxisTitle = settings?.yAxisTitle?.value || "Likelihood";
        const xFontSize = settings?.xAxisFontSize?.value || 10;
        const yFontSize = settings?.yAxisFontSize?.value || 10;
        const yOrientation = settings?.yAxisOrientation?.value?.value || "horizontal";
        
        // Render X-axis title (centered at bottom) - CONSEQUENCE
        if (showAxisTitles && xAxisTitle) {
            const titleX = document.createElementNS("http://www.w3.org/2000/svg", "text");
            titleX.setAttribute("x", String(m.l + w / 2));
            titleX.setAttribute("y", String(vp.height - 4));  // Below the labels
            titleX.setAttribute("text-anchor", "middle");
            titleX.setAttribute("font-size", String(xFontSize + 2));
            titleX.setAttribute("font-weight", "bold");
            titleX.setAttribute("fill", "#333");
            titleX.textContent = xAxisTitle;
            this.gGrid.appendChild(titleX);
        }
        
        // Render Y-axis title (rotated on left side) - LIKELIHOOD
        if (showAxisTitles && yAxisTitle) {
            const titleY = document.createElementNS("http://www.w3.org/2000/svg", "text");
            titleY.setAttribute("x", "8");
            titleY.setAttribute("y", String(m.t + h / 2));
            titleY.setAttribute("text-anchor", "middle");
            titleY.setAttribute("font-size", String(yFontSize + 2));
            titleY.setAttribute("font-weight", "bold");
            titleY.setAttribute("fill", "#333");
            titleY.setAttribute("transform", `rotate(-90, 8, ${m.t + h / 2})`);
            titleY.textContent = yAxisTitle;
            this.gGrid.appendChild(titleY);
        }
        
        // Render X-axis labels (Consequence: custom labels with bounds checking)
        if (showXLabels) {
            for (let x = 0; x < cols; x++) {
                const tx = document.createElementNS("http://www.w3.org/2000/svg", "text");
                tx.setAttribute("x", String(m.l + (x + 0.5) * cw));
                tx.setAttribute("y", String(vp.height - 20));  // Moved up to make room for title below
                tx.setAttribute("text-anchor", "middle");
                tx.setAttribute("font-size", String(xFontSize));
                // Use custom label or fallback to number
                const cIndex = x;
                tx.textContent = cIndex < cLabs.length ? cLabs[cIndex] : String(x + 1);
                this.gGrid.appendChild(tx);
            }
        }
        
        // Render Y-axis labels (Likelihood: custom labels with orientation)
        if (showYLabels) {
            for (let y = 0; y < rows; y++) {
                const ty = document.createElementNS("http://www.w3.org/2000/svg", "text");
                
                if (yOrientation === "vertical") {
                    // Vertical text orientation
                    ty.setAttribute("x", "25");
                    ty.setAttribute("y", String(m.t + (y + 0.5) * ch));
                    ty.setAttribute("text-anchor", "middle");
                    ty.setAttribute("transform", `rotate(-90, 25, ${m.t + (y + 0.5) * ch})`);
                } else {
                    // Horizontal text orientation (default)
                    ty.setAttribute("x", "12");
                    ty.setAttribute("y", String(m.t + (y + 0.6) * ch));
                    ty.setAttribute("text-anchor", "start");
                }
                
                ty.setAttribute("font-size", String(yFontSize));
                const lIndex = rows - y - 1; // Display from top to bottom
                ty.textContent = lIndex < lLabs.length ? lLabs[lIndex] : String(rows - y); // Use custom label or fallback
                this.gGrid.appendChild(ty);
            }
        }
    }

    private clamp(n?: number): number | undefined {
        if (n == null || isNaN(n)) return undefined;
        // Get matrix dimensions for dynamic clamping
        const maxRows = this.formattingSettings?.matrixGridCard?.matrixRows?.value || 5;
        const maxCols = this.formattingSettings?.matrixGridCard?.matrixColumns?.value || 5;
        const maxDimension = Math.max(maxRows, maxCols);
        return Math.max(1, Math.min(maxDimension, Math.round(n)));
    }

    private mapData(view?: DataView): RiskPoint[] {
        const maxN = 1000; // simple cap for data reduction
        const out: RiskPoint[] = [];
        if (!view || !view.categorical) return out;
        const cat = view.categorical as DataViewCategorical;
        const riskCats = (cat.categories || []).find(c => c.source.roles && (c.source.roles as any)["riskId"]);
        if (!riskCats) return out;
        const vals = cat.values || [] as any;
        const colByRole = (role: string) => vals.find((v: any) => v.source?.roles && v.source.roles[role]);
        const LInh = colByRole("likelihoodInh"), CInh = colByRole("consequenceInh");
        const LRes = colByRole("likelihoodRes"), CRes = colByRole("consequenceRes");
        const Cat = (cat.categories || []).find(c => c.source.roles && (c.source.roles as any)["category"]);
        const Tooltips = colByRole("tooltips"); // Capture tooltip data column
        const n = Math.min(riskCats.values.length, maxN);
        for (let i = 0; i < n; i++) {
            const selectionId = this.host.createSelectionIdBuilder().withCategory(riskCats, i).createSelectionId();
            const rp: RiskPoint = { id: String(riskCats.values[i]), selectionId };
            rp.lInh = this.clamp(LInh?.values?.[i]); rp.cInh = this.clamp(CInh?.values?.[i]);
            rp.lRes = this.clamp(LRes?.values?.[i]); rp.cRes = this.clamp(CRes?.values?.[i]);
            rp.category = Cat ? String(Cat.values[i]) : undefined;
            rp.tooltipData = Tooltips?.values?.[i]; // Store tooltip value
            if (rp.lInh && rp.cInh || rp.lRes && rp.cRes) out.push(rp);
        }
        return out;
    }

    private stableJitter(id: string, cellW: number, cellH: number): { dx: number, dy: number } {
        // simple hash-based jitter in [-0.3,0.3] cell size
        let h = 2166136261; for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24); }
        const r1 = ((h >>> 0) % 1000) / 1000 - 0.5; const r2 = (((h >>> 1) % 1000) / 1000) - 0.5;
        return { dx: r1 * cellW * 0.3, dy: r2 * cellH * 0.3 };
    }

    private renderData(vp: IViewport, data: RiskPoint[]) {
        // Store current data for re-rendering on expand/collapse
        this.currentData = data;
        
        const sm = this.selectionManager;
        // Clear elements safely without innerHTML
        while (this.gArrows.firstChild) {
            this.gArrows.removeChild(this.gArrows.firstChild);
        }
        while (this.gPoints.firstChild) {
            this.gPoints.removeChild(this.gPoints.firstChild);
        }
        
        // Get matrix dimensions and settings
        const matrixRows = this.formattingSettings?.matrixGridCard?.matrixRows?.value || 5;
        const matrixColumns = this.formattingSettings?.matrixGridCard?.matrixColumns?.value || 5;
        
        // Get risk markers layout settings
        const layoutMode = this.formattingSettings?.riskMarkersLayoutCard?.layoutMode?.value?.value || "scatter";
        const markerRows = this.formattingSettings?.riskMarkersLayoutCard?.markerRows?.value || 3;
        const markerCols = this.formattingSettings?.riskMarkersLayoutCard?.markerColumns?.value || 3;
        const cellPadding = this.formattingSettings?.riskMarkersLayoutCard?.cellPadding?.value || 5;
        const showInherentInOrganized = this.formattingSettings?.riskMarkersLayoutCard?.showInherentInOrganized?.value ?? true;
        const organizedArrows = this.formattingSettings?.riskMarkersLayoutCard?.organizedArrows?.value ?? true;
        
        const m = { l: 40, r: 10, t: 10, b: 30 };
        
        // Auto-fit to viewport
        const w = vp.width - m.l - m.r;
        const h = vp.height - m.t - m.b;
        const cols = matrixColumns;
        const rows = matrixRows;
        const cw = w / cols;
        const ch = h / rows;
        
        // SWAPPED: C (Consequence) on X-axis, L (Likelihood) on Y-axis
        const toXY = (L: number, C: number) => {
            const x = m.l + (C - 1) * cw + cw / 2;     // Consequence maps to x (horizontal)
            const y = m.t + (rows - L) * ch + ch / 2;  // Likelihood maps to y (vertical)
            return { x, y };
        };
        
        // Choose layout based on mode
        if (layoutMode === "organized") {
            // Organized grid layout within cells
            this.renderOrganizedLayout(data, toXY, cellPadding, cw, ch, sm, markerRows, markerCols, showInherentInOrganized, organizedArrows);
        } else if (layoutMode === "centered") {
            // Centered positioning (no jitter)
            this.renderCenteredLayout(data, toXY, sm);
        } else {
            // Random scatter (jittered) layout - legacy mode
            this.renderJitteredLayout(data, toXY, cw, ch, sm);
        }
    }
    
    private renderOrganizedLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, cellPadding: number, cw: number, ch: number, sm: ISelectionManager, markerRows: number, markerCols: number, showInherent: boolean, showArrows: boolean) {
        // Group markers by cell position - we need to track BOTH inherent and residual cells
        const inherentCellMarkers: { [key: string]: any[] } = {};
        const residualCellMarkers: { [key: string]: any[] } = {};
        
        for (const d of data) {
            const lRes = d.lRes ?? d.lInh;
            const cRes = d.cRes ?? d.cInh;
            if (!lRes || !cRes) continue;
            
            const color = this.getSeverityColor(lRes * cRes);
            
            // Group by residual cell (where risk is now)
            const residualKey = `${lRes}-${cRes}`;
            if (!residualCellMarkers[residualKey]) {
                residualCellMarkers[residualKey] = [];
            }
            residualCellMarkers[residualKey].push({
                data: d,
                color: color,
                type: 'residual'
            });
            
            // Also group by inherent cell if it exists and is different
            if (showInherent && d.lInh && d.cInh && (d.lInh !== lRes || d.cInh !== cRes)) {
                const inherentKey = `${d.lInh}-${d.cInh}`;
                if (!inherentCellMarkers[inherentKey]) {
                    inherentCellMarkers[inherentKey] = [];
                }
                inherentCellMarkers[inherentKey].push({
                    data: d,
                    color: color,
                    type: 'inherent'
                });
            }
        }
        
        // Store organized positions for arrow drawing
        const organizedPositions: { [riskId: string]: { inherent?: {x: number, y: number}, residual?: {x: number, y: number} } } = {};
        
        const enableScrolling = this.formattingSettings?.riskMarkersLayoutCard?.enableScrolling?.value ?? false;
        const scrollFadeDepthSetting = this.formattingSettings?.riskMarkersLayoutCard?.scrollFadeDepth?.value;
        const scrollFadeDepth = Math.max(0, scrollFadeDepthSetting ?? 16);
        const maxMarkers = markerRows * markerCols;
        const markerSize = this.formattingSettings.markersCard.size.value ?? 6;
        const animationEnabled = this.formattingSettings.animationCard.enabled.value ?? false;
        const animationDuration = this.formattingSettings.animationCard.durationMs.value || 1000;
        
        // Get or create defs for clipPaths
        let defs = this.svg.querySelector('defs') as SVGDefsElement;
        if (!defs) {
            defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            this.svg.insertBefore(defs, this.svg.firstChild);
        }
        
        // Organize and render residual markers with clipping
        Object.keys(residualCellMarkers).forEach(cellKey => {
            const [lStr, cStr] = cellKey.split('-');
            const l = parseInt(lStr);
            const c = parseInt(cStr);
            
            const cellCenter = toXY(l, c);
            const cellBounds = {
                x: cellCenter.x - cw/2,
                y: cellCenter.y - ch/2,
                width: cw,
                height: ch
            };
            
            // Create clipPath for this cell if scrolling is enabled
            const clipPathId = `clip-cell-${cellKey}`;
            if (enableScrolling) {
                // Remove existing clipPath
                const existingClip = defs.querySelector(`#${clipPathId}`);
                if (existingClip) existingClip.remove();
                
                // Create new clipPath
                const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                clipPath.setAttribute("id", clipPathId);
                const clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                clipRect.setAttribute("x", String(cellBounds.x));
                clipRect.setAttribute("y", String(cellBounds.y));
                clipRect.setAttribute("width", String(cellBounds.width));
                clipRect.setAttribute("height", String(cellBounds.height));
                clipPath.appendChild(clipRect);
                defs.appendChild(clipPath);
            }
            
            // Create a group for this cell's markers
            const cellGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            cellGroup.setAttribute('class', (cellGroup.getAttribute('class') || '') + ' cell-group');
            if (enableScrolling) {
                // Apply clipPath to enforce cell boundaries
                cellGroup.setAttribute("clip-path", `url(#${clipPathId})`);
            }
            
            const organizedMarkers = this.organizeMarkersInCell(residualCellMarkers[cellKey], cellBounds, cellPadding, markerRows, markerCols);
            
            // Count overflow if scrolling disabled
            const totalMarkers = residualCellMarkers[cellKey].length;
            const overflowCount = totalMarkers - maxMarkers;
            
            // Determine target container for markers
            let markerContainer = cellGroup;
            let scrollContainer: SVGGElement | null = null;
            
            // Add interactive mouse wheel scrolling when enabled and overflow exists
            if (enableScrolling && totalMarkers >= maxMarkers) {
                // Create scroll container for markers
                scrollContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
                scrollContainer.setAttribute("class", "scroll-container");
                cellGroup.appendChild(scrollContainer);
                markerContainer = scrollContainer; // Render markers into scroll container
                
                // Calculate scroll bounds based on actual content height
                const totalRows = Math.ceil(totalMarkers / markerCols);
                const cellPaddingValue = cellPadding;
                const usableHeight = cellBounds.height - (cellPaddingValue * 2);
                const markerSpacingY = usableHeight / markerRows;
                const contentHeight = (totalRows * markerSpacingY) + markerSize;
                const maxScroll = Math.min(0, cellBounds.height - contentHeight);
                
                // Add wheel event listener to cellGroup - captures from all children (markers, empty areas)
                let offsetY = 0;
                const handleWheel = (e: WheelEvent) => {
                    e.preventDefault();
                    offsetY = Math.max(maxScroll, Math.min(0, offsetY - e.deltaY * 0.5));
                    scrollContainer!.setAttribute('transform', `translate(0, ${offsetY})`);
                };
                cellGroup.addEventListener('wheel', handleWheel);

                // Anchor the fade mask to the static cell group (cellGroup) so the gradient stays fixed
                // while the inner scrollContainer translates. Previously binding the mask to the scroll
                // container caused the gradient to move with the markers.
                applyScrollFadeMask(defs, cellBounds, `scroll-fade-${cellKey}`, cellGroup, scrollFadeDepth);
                // remember the mask id so we can temporarily disable it on selection
                cellGroup.setAttribute('data-scroll-mask', `url(#scroll-fade-${cellKey}-mask)`);
            }
            
            // Render residual markers into appropriate container and store positions
            organizedMarkers.forEach((marker, idx) => {
                // When scrolling is disabled, skip overflow markers
                // When scrolling is enabled, render ALL markers (clipPath will hide overflow)
                if (!enableScrolling && marker.isOverflow) return;
                
                const riskId = marker.data.id;
                if (!organizedPositions[riskId]) {
                    organizedPositions[riskId] = {};
                }
                organizedPositions[riskId].residual = { x: marker.organizedX, y: marker.organizedY };
                
                this.renderSingleMarkerToGroup(markerContainer, marker, sm, 'residual');
            });
            
            this.gPoints.appendChild(cellGroup);
            
            // Show overflow indicator if there are more markers than grid can show (only when scrolling disabled)
            if (!enableScrolling && overflowCount > 0) {
                const lastMarker = organizedMarkers[maxMarkers - 1];
                if (lastMarker) {
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", String(lastMarker.organizedX + 8));
                    text.setAttribute("y", String(lastMarker.organizedY + 4));
                    text.setAttribute("font-size", "10");
                    text.setAttribute("font-weight", "bold");
                    text.setAttribute("fill", "#d32f2f");
                    text.textContent = `+${overflowCount}`;
                    this.gPoints.appendChild(text);
                }
            }
        });
        
        // Organize and render inherent markers (if enabled) - also with clipping
        if (showInherent) {
            Object.keys(inherentCellMarkers).forEach(cellKey => {
                const [lStr, cStr] = cellKey.split('-');
                const l = parseInt(lStr);
                const c = parseInt(cStr);
                
                const cellCenter = toXY(l, c);
                const cellBounds = {
                    x: cellCenter.x - cw/2,
                    y: cellCenter.y - ch/2,
                    width: cw,
                    height: ch
                };
                
                const clipPathId = `clip-cell-${cellKey}-inherent`;
                if (enableScrolling) {
                    const existingClip = defs.querySelector(`#${clipPathId}`);
                    if (existingClip) existingClip.remove();
                    
                    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                    clipPath.setAttribute("id", clipPathId);
                    const clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    clipRect.setAttribute("x", String(cellBounds.x));
                    clipRect.setAttribute("y", String(cellBounds.y));
                    clipRect.setAttribute("width", String(cellBounds.width));
                    clipRect.setAttribute("height", String(cellBounds.height));
                    clipPath.appendChild(clipRect);
                    defs.appendChild(clipPath);
                }
                
                const cellGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                if (enableScrolling) {
                    cellGroup.setAttribute("clip-path", `url(#${clipPathId})`);
                }
                
                const organizedMarkers = this.organizeMarkersInCell(inherentCellMarkers[cellKey], cellBounds, cellPadding, markerRows, markerCols);
                
                // Determine target container for markers
                let markerContainer = cellGroup;
                let scrollContainer: SVGGElement | null = null;
                
                // Add interactive mouse wheel scrolling for inherent markers when enabled and overflow exists
                const totalInherentMarkers = inherentCellMarkers[cellKey].length;
                if (enableScrolling && totalInherentMarkers >= maxMarkers) {
                    // Create scroll container for markers
                    scrollContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    scrollContainer.setAttribute("class", "scroll-container");
                    cellGroup.appendChild(scrollContainer);
                    markerContainer = scrollContainer; // Render markers into scroll container
                    
                    // Calculate scroll bounds based on actual content height
                    const totalRows = Math.ceil(totalInherentMarkers / markerCols);
                    const cellPaddingValue = cellPadding;
                    const usableHeight = cellBounds.height - (cellPaddingValue * 2);
                    const markerSpacingY = usableHeight / markerRows;
                    const contentHeight = (totalRows * markerSpacingY) + markerSize;
                    const maxScroll = Math.min(0, cellBounds.height - contentHeight);
                    
                    // Add wheel event listener to cellGroup - captures from all children (markers, empty areas)
                    let offsetY = 0;
                    const handleWheel = (e: WheelEvent) => {
                        e.preventDefault();
                        offsetY = Math.max(maxScroll, Math.min(0, offsetY - e.deltaY * 0.5));
                        scrollContainer!.setAttribute('transform', `translate(0, ${offsetY})`);
                    };
                    cellGroup.addEventListener('wheel', handleWheel);

                    // Anchor change for inherent markers as well
                    applyScrollFadeMask(defs, cellBounds, `scroll-fade-${cellKey}-inherent`, cellGroup, scrollFadeDepth);
                    cellGroup.setAttribute('data-scroll-mask', `url(#scroll-fade-${cellKey}-inherent-mask)`);
                }
                
                // Render inherent markers into appropriate container and store positions
                organizedMarkers.forEach(marker => {
                    // When scrolling is disabled, skip overflow markers
                    // When scrolling is enabled, render ALL markers (clipPath will hide overflow)
                    if (!enableScrolling && marker.isOverflow) return;
                    
                    const riskId = marker.data.id;
                    if (!organizedPositions[riskId]) {
                        organizedPositions[riskId] = {};
                    }
                    organizedPositions[riskId].inherent = { x: marker.organizedX, y: marker.organizedY };
                    
                    this.renderSingleMarkerToGroup(markerContainer, marker, sm, 'inherent');
                });
                
                this.gPoints.appendChild(cellGroup);
            });
        }
        
        // Draw arrows from inherent to residual positions (if enabled)
        if (showInherent && showArrows) {
            const arrowDistance = this.formattingSettings.arrowsCard.arrowDistance.value || 5;
            const arrowColor = this.formattingSettings.arrowsCard.arrowColor.value.value || "#666666";
            const arrowTransparency = this.formattingSettings.arrowsCard.arrowTransparency.value || 100;
            const arrowOpacity = arrowTransparency / 100;
            
            Object.keys(organizedPositions).forEach(riskId => {
                const positions = organizedPositions[riskId];
                if (positions.inherent && positions.residual) {
                    const adjustedPos = this.calculateArrowPosition(
                        positions.inherent,
                        positions.residual,
                        arrowDistance
                    );
                    
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", String(adjustedPos.start.x));
                    line.setAttribute("y1", String(adjustedPos.start.y));
                    line.setAttribute("x2", String(adjustedPos.end.x));
                    line.setAttribute("y2", String(adjustedPos.end.y));
                    line.setAttribute("stroke", arrowColor);
                    line.setAttribute("stroke-opacity", String(arrowOpacity));
                    line.setAttribute("stroke-width", "1.5");
                    line.setAttribute("marker-end", "url(#arrow)");
                    line.setAttribute("pointer-events", "none"); // Don't block scroll events
                    
                    // Animation for arrows - show SECOND (after inherent markers), HIDE with inherent
                    if (animationEnabled) {
                        line.setAttribute("opacity", "0");
                        setTimeout(() => {
                            line.style.transition = `opacity ${animationDuration}ms ease-in`;
                            line.setAttribute("opacity", "1");
                        }, animationDuration); // Show after inherent markers
                        
                        // FIXED: Hide arrows when inherent markers hide
                        setTimeout(() => {
                            line.style.transition = `opacity ${animationDuration}ms ease-out`;
                            line.setAttribute("opacity", "0");
                        }, animationDuration * 2.5); // Hide with inherent markers
                    }
                    
                    this.gArrows.appendChild(line);
                }
            });
        }
    }
    
    private organizeMarkersInCell(markers: any[], cellBounds: {x: number, y: number, width: number, height: number}, padding: number, rows: number, cols: number): any[] {
        const enableScrolling = this.formattingSettings?.riskMarkersLayoutCard?.enableScrolling?.value ?? false;
        const usableWidth = cellBounds.width - (padding * 2);
        const usableHeight = cellBounds.height - (padding * 2);
        
        const maxMarkers = rows * cols;
        
        // FIXED: When scrolling enabled, use ORIGINAL spacing and let markers overflow
        // When scrolling disabled, only show up to maxMarkers with original spacing
        const markerSpacingX = usableWidth / cols;  // Always use original grid spacing
        const markerSpacingY = usableHeight / rows; // Always use original grid spacing
        
        const organized: any[] = [];
        
        // Show markers based on scrolling setting
        const markersToShow = enableScrolling ? markers : markers.slice(0, maxMarkers);
        
        markersToShow.forEach((marker, index) => {
            const row = Math.floor(index / cols);  // Use original cols for layout
            const col = index % cols;               // Use original cols for layout
            
            const x = cellBounds.x + padding + (col * markerSpacingX) + (markerSpacingX / 2);
            const y = cellBounds.y + padding + (row * markerSpacingY) + (markerSpacingY / 2);
            
            organized.push({
                ...marker,
                organizedX: x,
                organizedY: y,
                isOverflow: index >= maxMarkers // Mark overflow markers (will extend beyond cell)
            });
        });
        
        return organized;
    }

    // Approximate text width when getBBox is unavailable (tests/node). Uses a per-character multiplier.
    private approximateTextWidth(text: string, fontSize: number): number {
        const avgCharWidth = 0.6; // multiplier of fontSize
        return Math.max(0, text.length * fontSize * avgCharWidth);
    }
    
    private renderSingleMarkerToGroup(group: SVGGElement, marker: any, sm: ISelectionManager, type: 'inherent' | 'residual') {
        const d = marker.data;
        const color = marker.color;
        const x = marker.organizedX;
        const y = marker.organizedY;
        
    const markerSize = this.formattingSettings.markersCard.size.value ?? 6;
    const overrideColor = this.formattingSettings.markersCard.color.value.value;
    // color param is the residual-based severity color (from caller). We want inherent to use its own severity color.
    const residualSeverityColor = color;
    const inherentSeverityColor = this.getSeverityColor(((d.lInh ?? d.lRes) || 1) * ((d.cInh ?? d.cRes) || 1));
    const resColor = (overrideColor && overrideColor !== "") ? overrideColor : residualSeverityColor;
    const inhColor = (overrideColor && overrideColor !== "") ? overrideColor : inherentSeverityColor;
        const showLabels = this.formattingSettings.labelsCard.show.value;
        const showTooltips = this.formattingSettings.tooltipsCard.show.value;
        const animationEnabled = this.formattingSettings.animationCard.enabled.value ?? false;
        const animationDuration = this.formattingSettings.animationCard.durationMs.value || 1000;
        
        // Get marker border settings - DEBUG with console.log
        const borderColor = this.formattingSettings.markersCard.borderColor.value?.value || "#111111";
        const borderWidth = this.formattingSettings.markersCard.borderWidth.value ?? 1;
        const borderTransparency = this.formattingSettings.markersCard.borderTransparency.value ?? 100;
        const borderOpacity = borderTransparency / 100;
        
        // DEBUG: Log border settings
        if (marker.data.id === "Risk1") { // Only log once to avoid spam
            console.log("=== Border Settings Debug ===");
            console.log("Border Color:", borderColor);
            console.log("Border Width:", borderWidth);
            console.log("Border Transparency:", borderTransparency);
            console.log("Border Opacity:", borderOpacity);
            console.log("Full markersCard:", this.formattingSettings.markersCard);
        }
        
        // Get inherent transparency setting (0-100%)
        const inherentTransparency = this.formattingSettings?.riskMarkersLayoutCard?.inherentTransparency?.value ?? 50;
        const inherentOpacity = inherentTransparency / 100;
        
        // Safely get shape with default value
        const shape = this.formattingSettings?.markersCard?.shape?.value?.value ?? "round";
        const labelSize = this.formattingSettings?.markersCard?.labelSize?.value ?? 10;
        const hoverEffect = this.formattingSettings?.markersCard?.hoverEffect?.value ?? true;
        const clickEffect = this.formattingSettings?.markersCard?.clickEffect?.value ?? true;

        let element: SVGElement | undefined;
        if (shape === "round") {
            element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            element.setAttribute("cx", String(x));
            element.setAttribute("cy", String(y));
            element.setAttribute("r", String(markerSize));
        } else if (shape === "rectangle") {
            element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            element.setAttribute("x", String(x - markerSize));
            element.setAttribute("y", String(y - markerSize / 2));
            element.setAttribute("width", String(markerSize * 2));
            element.setAttribute("height", String(markerSize));
        } else if (shape === "roundedRectangle") {
            element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            element.setAttribute("x", String(x - markerSize));
            element.setAttribute("y", String(y - markerSize / 2));
            element.setAttribute("width", String(markerSize * 2));
            element.setAttribute("height", String(markerSize));
            element.setAttribute("rx", "5");
            element.setAttribute("ry", "5");
        }

        if (!element) {
            // Fallback: if shape is unknown, default to circle
            element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            element.setAttribute("cx", String(x));
            element.setAttribute("cy", String(y));
            element.setAttribute("r", String(markerSize));
        }

        // Wrap element in a group so hover/scale and label live together.
        const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        markerGroup.setAttribute("class", "marker-group");
        // Track visibility state to avoid hover showing hidden/inactive markers
        (element as any).__visible = true;
        // Append element into the markerGroup and then into the cell/group
        markerGroup.appendChild(element);
        group.appendChild(markerGroup);

        // Hover effect: scale up the marker around its visual center and slightly brighten (via fill-opacity)
        if (hoverEffect) {
            const applyHover = () => {
                if (!(element as any).__visible) return; // don't show hover when hidden
                // compute center
                let cx = x, cy = y;
                if (element.tagName === 'circle') {
                    cx = Number(element.getAttribute('cx')) || x;
                    cy = Number(element.getAttribute('cy')) || y;
                } else if (element.tagName === 'rect') {
                    const rx = Number(element.getAttribute('x')) || (x - markerSize);
                    const ry = Number(element.getAttribute('y')) || (y - markerSize / 2);
                    const rw = Number(element.getAttribute('width')) || (markerSize * 2);
                    const rh = Number(element.getAttribute('height')) || markerSize;
                    cx = rx + rw / 2;
                    cy = ry + rh / 2;
                }
                // scale around center
                markerGroup.setAttribute('transform', `translate(${cx},${cy}) scale(1.15) translate(${-cx},${-cy})`);
                // slightly increase fill opacity/brightness
                try {
                    const currentFillOpacity = parseFloat(element.getAttribute('fill-opacity') || '1');
                    element.setAttribute('fill-opacity', String(Math.min(1, currentFillOpacity + 0.15)));
                } catch (e) {
                    // ignore
                }
            };
            const removeHover = () => {
                markerGroup.removeAttribute('transform');
                // restore fill-opacity
                try {
                    const baseOpacity = (type === 'inherent') ? (inherentOpacity) : 1;
                    element.setAttribute('fill-opacity', String(baseOpacity));
                } catch (e) {}
            };

            markerGroup.addEventListener('mouseover', () => applyHover());
            markerGroup.addEventListener('mouseout', () => removeHover());
        }

        if (clickEffect) {
            markerGroup.addEventListener('click', (evt) => {
                // Play a single transient click animation on the visual element.
                // Keep selection wiring separate (attached later) so we only trigger visual feedback here.
                try {
                    this.playClickPulse(element);
                } catch (e) {
                    // Non-fatal if animations are not supported in the environment
                }
            });
        }
        
    // Common visual attributes
    element.setAttribute("fill", type === 'inherent' ? inhColor : resColor);
        element.setAttribute("stroke", borderColor);
        element.setAttribute("stroke-width", String(borderWidth));
        element.setAttribute("stroke-opacity", String(borderOpacity));
        if (type === 'inherent') {
            element.setAttribute("fill-opacity", String(inherentOpacity));
        } else {
            element.setAttribute("fill-opacity", String(1));
        }

        // Wire up tooltip display using new Power BI-style helper
        if (showTooltips) {
            markerGroup.addEventListener('mouseover', () => {
                this.showTooltip(markerGroup, d, type);
            });
            markerGroup.addEventListener('mouseout', () => {
                this.hideTooltip();
            });
        }

        // Ensure markerGroup is visible by default
        markerGroup.removeAttribute('display');
        (element as any).__visible = true;

        if (animationEnabled) {
            // Animation sequence:
            // 0ms: Inherent markers fade in
            // animationDuration (1000ms): Arrows fade in
            // animationDuration * 2 (2000ms): Residual markers fade in (AFTER arrows, BEFORE inherent disappears)
            // animationDuration * 2.5 (2500ms): Inherent markers + arrows fade out together
            const inherentFadeOutStart = Math.ceil(animationDuration * 2.5);
            const residualFadeInStart = Math.ceil(animationDuration * 2); // Show after arrows
            
            if (type === 'inherent') {
                // Inherent: fade in immediately, then fade out at 2.5x
                markerGroup.setAttribute('opacity', '0');
                setTimeout(() => {
                    markerGroup.style.transition = `opacity ${animationDuration}ms ease-in`;
                    markerGroup.setAttribute('opacity', '1');
                }, 10);
                
                // Fade out inherent at 2.5x duration
                setTimeout(() => {
                    markerGroup.style.transition = `opacity ${animationDuration}ms ease-out`;
                    markerGroup.setAttribute('opacity', '0');
                    // after fade-out, remove from hit testing and mark invisible
                    setTimeout(() => {
                        try { markerGroup.setAttribute('display', 'none'); } catch (e) {}
                        (element as any).__visible = false;
                        try { (markerGroup as any).style.pointerEvents = 'none'; } catch (e) {}
                    }, animationDuration);
                }, inherentFadeOutStart);
            } else {
                // Residual: start visible with opacity 0, fade in at 2x duration (after arrows appear, before inherent disappears)
                markerGroup.setAttribute('opacity', '0');
                // Don't use display:none - keep visible for scrolling and pointer events
                try { (markerGroup as any).style.pointerEvents = 'auto'; } catch (e) {}
                
                setTimeout(() => {
                    markerGroup.style.transition = `opacity ${animationDuration}ms ease-in`;
                    markerGroup.setAttribute('opacity', '1');
                }, residualFadeInStart);
            }
        }
        
    // Selection wiring on the group so clicks on labels/text also select the marker
    markerGroup.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
    (markerGroup as any).__sel = d.selectionId;
        
    // Show labels for both inherent and residual when labels are enabled
    if (showLabels) {
            // Render in-marker Risk ID label if enabled; otherwise fallback to external label
            const showRiskIdLabel = this.formattingSettings?.markersCard?.showRiskIdLabel?.value ?? false;
            const riskIdFontSize = this.formattingSettings?.markersCard?.riskIdLabelFontSize?.value ?? labelSize;
            const riskIdAlign = this.formattingSettings?.markersCard?.riskIdLabelAlignment?.value?.value ?? "center";
            const riskIdPadding = this.formattingSettings?.markersCard?.riskIdLabelPadding?.value ?? 2;
            const riskIdTruncate = this.formattingSettings?.markersCard?.riskIdLabelTruncate?.value ?? true;
            const riskIdMinBehavior = this.formattingSettings?.markersCard?.riskIdLabelMinMarkerSize?.value?.value ?? "fixed";
            const riskIdColor = this.formattingSettings?.markersCard?.riskIdLabelColor?.value?.value || "#111111";

            if (showRiskIdLabel) {
                // Use existing markerGroup (created earlier) as container so clicks on text also select marker
                markerGroup.setAttribute('class', (markerGroup.getAttribute('class') || '') + ' marker-with-label');

                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("font-size", String(riskIdFontSize));
                text.setAttribute("fill", riskIdColor);
                text.setAttribute("dominant-baseline", "middle");
                text.setAttribute("text-anchor", riskIdAlign === "center" ? "middle" : (riskIdAlign === "left" ? "start" : "end"));
                text.textContent = String(d.id || "");

                // Compute available width depending on shape
                let availableWidth = 2 * markerSize - (riskIdPadding * 2);
                if (element.tagName === "rect") {
                    const w = Number(element.getAttribute("width") || (markerSize * 2));
                    availableWidth = w - (riskIdPadding * 2);
                }
                // Measure text width with getBBox if available; otherwise approximate
                let textWidth = 0;
                try {
                    // Temporarily append text to measure if getBBox exists in environment
                    markerGroup.appendChild(text);
                    if ((text as any).getBBox) {
                        const bbox = (text as any).getBBox();
                        textWidth = bbox.width;
                    }
                } catch (e) {
                    // ignore
                }
                if (!textWidth) {
                    textWidth = this.approximateTextWidth(text.textContent || "", riskIdFontSize);
                }

                // Truncate if needed
                if (textWidth > availableWidth) {
                    if (riskIdMinBehavior === "auto" && element.tagName === "rect") {
                        // expand rect width symmetrically
                        const needed = Math.ceil((textWidth + riskIdPadding * 2) - (availableWidth));
                        const oldW = Number(element.getAttribute("width") || (markerSize * 2));
                        const newW = oldW + needed;
                        element.setAttribute("width", String(newW));
                        // shift x left so center stays
                        const oldX = Number(element.getAttribute("x") || String(x - markerSize));
                        element.setAttribute("x", String(oldX - needed / 2));
                        availableWidth = newW - (riskIdPadding * 2);
                    } else if (riskIdTruncate) {
                        // truncate with simple ellipsis
                        const maxChars = Math.max(1, Math.floor(availableWidth / (riskIdFontSize * 0.6)));
                        let txt = String(d.id || "");
                        if (txt.length > maxChars) {
                            txt = txt.slice(0, Math.max(0, maxChars - 1)) + "…";
                        }
                        text.textContent = txt;
                    }
                }

                // Position text
                if (element.tagName === "circle") {
                    const cx = Number(element.getAttribute("cx"));
                    const cy = Number(element.getAttribute("cy"));
                    // center horizontally relative to circle center
                    const tx = riskIdAlign === "left" ? cx - markerSize + riskIdPadding : (riskIdAlign === "right" ? cx + markerSize - riskIdPadding : cx);
                    text.setAttribute("x", String(tx));
                    text.setAttribute("y", String(cy));
                } else if (element.tagName === "rect") {
                    const rx = Number(element.getAttribute("x"));
                    const ry = Number(element.getAttribute("y"));
                    const rw = Number(element.getAttribute("width") || (markerSize * 2));
                    const rh = Number(element.getAttribute("height") || markerSize);
                    const tx = riskIdAlign === "left" ? (rx + riskIdPadding) : (riskIdAlign === "right" ? (rx + rw - riskIdPadding) : (rx + rw / 2));
                    const ty = ry + rh / 2;
                    text.setAttribute("x", String(tx));
                    text.setAttribute("y", String(ty));
                } else {
                    // fallback to placing near x,y
                    text.setAttribute("x", String(x));
                    text.setAttribute("y", String(y));
                }

                // Always add full id as title for accessibility
                markerGroup.setAttribute("title", String(d.id || ""));

                // Ensure animation for text follows same timing as the markerGroup (no delayed after)
                if (animationEnabled) {
                    text.setAttribute("opacity", "0");
                    // start shortly after DOM updates (same as markerGroup initial fade)
                    setTimeout(() => {
                        text.style.transition = `opacity ${animationDuration}ms ease-in`;
                        text.setAttribute("opacity", "1");
                    }, 10);
                }

                // ensure text is appended to the markerGroup (may already be appended during measurement)
                if (text.parentNode !== markerGroup) markerGroup.appendChild(text);
            } else {
                // Fallback: external label (existing behavior)
                const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
                label.setAttribute("x", String(x + markerSize + 2));
                label.setAttribute("y", String(y + 3));
                label.setAttribute("font-size", String(labelSize));
                label.setAttribute("fill", "#111");
                label.textContent = d.id;
                if (animationEnabled) {
                    label.setAttribute("opacity", "0");
                    setTimeout(() => {
                        label.style.transition = `opacity ${animationDuration}ms ease-in`;
                        label.setAttribute("opacity", "1");
                    }, animationDuration * 2);
                }
                group.appendChild(label);
            }
        }
    }

    // Play a short click pulse animation on an element. Uses Web Animations API when available,
    // otherwise falls back to a CSS class toggle that restarts reliably.
    private playClickPulse(el: Element) {
        // Respect reduced motion setting
        try {
            if (typeof window !== 'undefined' && (window as any).matchMedia && (window as any).matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }
        } catch (e) {}

        // If Web Animations API is available, use it for a smooth non-blinking animation
        const WA = (el as any).animate;
    if (typeof WA === 'function') {
            // Cancel existing animation if present
            const prev = this.activeClickAnims.get(el);
            if (prev) prev.cancel();

            // Animate CSS filter brightness so the marker brightens visually without changing layout/position
            try { (el as any).style.willChange = 'filter'; } catch (e) {}
            const anim = (el as any).animate(
                [
                    { filter: 'brightness(1)', offset: 0 },
                    { filter: 'brightness(1.5)', offset: 0.3 },
                    { filter: 'brightness(1)', offset: 1 }
                ],
                { duration: 320, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'forwards' }
            );

            this.activeClickAnims.set(el, anim as Animation);
            anim.onfinish = () => this.activeClickAnims.delete(el);
            anim.oncancel = () => this.activeClickAnims.delete(el);
            return;
        }

        // Fallback: CSS class toggle with a double rAF restart to reduce blink risk
        const cls = 'click-pulse';
        el.classList.remove(cls);
        // Force style computation then re-add on next frames
        try { (el as Element).getBoundingClientRect(); } catch (e) {}
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add(cls)));
    }
    
    /**
     * Group risks by cell for count aggregation in centered mode
     * @param data Array of risk points
     * @returns Map where key is "L-C" (e.g., "3-2") and value is array of risks in that cell
     */
    private groupRisksByCell(data: RiskPoint[]): Map<string, RiskPoint[]> {
        const cellMap = new Map<string, RiskPoint[]>();
        
        for (const risk of data) {
            // Use residual position as primary, fallback to inherent if residual not available
            const L = risk.lRes ?? risk.lInh;
            const C = risk.cRes ?? risk.cInh;
            
            if (L === undefined || C === undefined) continue;
            
            const cellKey = `${L}-${C}`;
            const existing = cellMap.get(cellKey) || [];
            existing.push(risk);
            cellMap.set(cellKey, existing);
        }
        
        return cellMap;
    }
    
    /**
     * Render a count marker showing the number of risks in a cell
     * @param cellKey Cell identifier (e.g., "3-2")
     * @param count Number of risks in the cell
     * @param x X coordinate for marker center
     * @param y Y coordinate for marker center
     * @param color Marker fill color
     * @param sm Selection manager
     * @param onClick Click handler for expanding the cell
     */
    private renderCountMarker(
        cellKey: string,
        count: number,
        x: number,
        y: number,
        color: string,
        sm: ISelectionManager,
        onClick: () => void
    ): void {
        const markerSize = (this.formattingSettings.markersCard.size.value ?? 6) * 1.5; // 1.5x larger
        const shape = this.formattingSettings?.markersCard?.shape?.value?.value ?? "round";
        const borderColor = this.formattingSettings.markersCard.borderColor.value?.value || "#111111";
        const borderWidth = this.formattingSettings.markersCard.borderWidth.value ?? 1;
        const borderTransparency = this.formattingSettings.markersCard.borderTransparency.value ?? 100;
        const borderOpacity = borderTransparency / 100;
        
        // Create marker group
        const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        markerGroup.setAttribute("class", "count-marker-group");
        markerGroup.style.cursor = "pointer";
        
        // Create marker element based on shape
        let element: SVGElement;
        if (shape === "round") {
            element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            element.setAttribute("cx", String(x));
            element.setAttribute("cy", String(y));
            element.setAttribute("r", String(markerSize));
        } else if (shape === "rectangle") {
            element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            element.setAttribute("x", String(x - markerSize));
            element.setAttribute("y", String(y - markerSize / 2));
            element.setAttribute("width", String(markerSize * 2));
            element.setAttribute("height", String(markerSize));
        } else if (shape === "roundedRectangle") {
            element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            element.setAttribute("x", String(x - markerSize));
            element.setAttribute("y", String(y - markerSize / 2));
            element.setAttribute("width", String(markerSize * 2));
            element.setAttribute("height", String(markerSize));
            element.setAttribute("rx", "5");
            element.setAttribute("ry", "5");
        } else {
            // Fallback to circle
            element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            element.setAttribute("cx", String(x));
            element.setAttribute("cy", String(y));
            element.setAttribute("r", String(markerSize));
        }
        
        // Apply styling
        element.setAttribute("fill", color);
        element.setAttribute("stroke", borderColor);
        element.setAttribute("stroke-width", String(borderWidth));
        element.setAttribute("stroke-opacity", String(borderOpacity));
        element.setAttribute("fill-opacity", "1");
        
        markerGroup.appendChild(element);
        
        // Add count text centered inside marker
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", String(x));
        text.setAttribute("y", String(y));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("font-size", String(Math.max(10, markerSize * 0.8)));
        text.setAttribute("font-weight", "bold");
        text.setAttribute("fill", "#FFFFFF"); // White text for contrast
        text.setAttribute("pointer-events", "none");
        
        // Display "99+" if count exceeds 99
        const displayCount = count > 99 ? "99+" : String(count);
        text.textContent = displayCount;
        
        markerGroup.appendChild(text);
        
        // Add click handler
        markerGroup.addEventListener("click", (evt) => {
            evt.stopPropagation();
            onClick();
        });
        
        // Add hover effect
        const hoverEffect = this.formattingSettings?.markersCard?.hoverEffect?.value ?? true;
        if (hoverEffect) {
            markerGroup.addEventListener("mouseover", () => {
                let cx = x, cy = y;
                if (element.tagName === 'rect') {
                    const rx = Number(element.getAttribute('x')) || (x - markerSize);
                    const ry = Number(element.getAttribute('y')) || (y - markerSize / 2);
                    const rw = Number(element.getAttribute('width')) || (markerSize * 2);
                    const rh = Number(element.getAttribute('height')) || markerSize;
                    cx = rx + rw / 2;
                    cy = ry + rh / 2;
                }
                markerGroup.setAttribute('transform', `translate(${cx},${cy}) scale(1.15) translate(${-cx},${-cy})`);
            });
            
            markerGroup.addEventListener("mouseout", () => {
                markerGroup.removeAttribute('transform');
            });
        }
        
        this.gPoints.appendChild(markerGroup);
    }
    
    /**
     * Render a count marker with animation control
     * Similar to renderCountMarker but with animation timing parameters
     */
    private renderCountMarkerWithAnimation(
        cellKey: string,
        count: number,
        x: number,
        y: number,
        color: string,
        sm: ISelectionManager,
        onClick: () => void,
        animationEnabled: boolean,
        animationDuration: number,
        showDelay: number,
        hideDelay: number,
        willFadeOut: boolean
    ): void {
        const markerSize = (this.formattingSettings.markersCard.size.value ?? 6) * 1.5; // 1.5x larger
        const shape = this.formattingSettings?.markersCard?.shape?.value?.value ?? "round";
        const borderColor = this.formattingSettings.markersCard.borderColor.value?.value || "#111111";
        const borderWidth = this.formattingSettings.markersCard.borderWidth.value ?? 1;
        const borderTransparency = this.formattingSettings.markersCard.borderTransparency.value ?? 100;
        const borderOpacity = borderTransparency / 100;
        
        const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        markerGroup.setAttribute("class", "count-marker");
        markerGroup.style.cursor = willFadeOut ? "default" : "pointer";
        
        let element: SVGElement;
        
        // Create marker shape
        if (shape === "round") {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", String(x));
            circle.setAttribute("cy", String(y));
            circle.setAttribute("r", String(markerSize));
            circle.setAttribute("fill", color);
            circle.setAttribute("stroke", borderColor);
            circle.setAttribute("stroke-width", String(borderWidth));
            circle.setAttribute("stroke-opacity", String(borderOpacity));
            element = circle;
        } else if (shape === "rectangle") {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", String(x - markerSize));
            rect.setAttribute("y", String(y - markerSize / 2));
            rect.setAttribute("width", String(markerSize * 2));
            rect.setAttribute("height", String(markerSize));
            rect.setAttribute("fill", color);
            rect.setAttribute("stroke", borderColor);
            rect.setAttribute("stroke-width", String(borderWidth));
            rect.setAttribute("stroke-opacity", String(borderOpacity));
            element = rect;
        } else if (shape === "roundedRectangle") {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", String(x - markerSize));
            rect.setAttribute("y", String(y - markerSize / 2));
            rect.setAttribute("width", String(markerSize * 2));
            rect.setAttribute("height", String(markerSize));
            rect.setAttribute("rx", "5");
            rect.setAttribute("ry", "5");
            rect.setAttribute("fill", color);
            rect.setAttribute("stroke", borderColor);
            rect.setAttribute("stroke-width", String(borderWidth));
            rect.setAttribute("stroke-opacity", String(borderOpacity));
            element = rect;
        } else {
            // Fallback to circle
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", String(x));
            circle.setAttribute("cy", String(y));
            circle.setAttribute("r", String(markerSize));
            circle.setAttribute("fill", color);
            circle.setAttribute("stroke", borderColor);
            circle.setAttribute("stroke-width", String(borderWidth));
            circle.setAttribute("stroke-opacity", String(borderOpacity));
            element = circle;
        }
        
        markerGroup.appendChild(element);
        
        // Add count text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", String(x));
        text.setAttribute("y", String(y));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "#FFFFFF");
        text.setAttribute("font-size", String(markerSize * 0.8));
        text.setAttribute("font-weight", "bold");
        text.setAttribute("pointer-events", "none");
        text.textContent = count > 99 ? "99+" : String(count);
        
        markerGroup.appendChild(text);
        
        // Add click handler (only for persistent residual markers)
        if (!willFadeOut && onClick) {
            markerGroup.addEventListener("click", (evt) => {
                evt.stopPropagation();
                onClick();
            });
        }
        
        // Apply animation
        if (animationEnabled) {
            markerGroup.setAttribute('opacity', '0');
            if (willFadeOut) {
                markerGroup.setAttribute('display', 'none');
                (markerGroup as any).style.pointerEvents = 'none';
            }
            this.gPoints.appendChild(markerGroup);
            
            // Show marker
            setTimeout(() => {
                if (willFadeOut) {
                    markerGroup.removeAttribute('display');
                }
                try { markerGroup.style.transition = `opacity ${animationDuration}ms ease-in`; } catch (e) {}
                markerGroup.setAttribute('opacity', '1');
            }, showDelay);
            
            // Hide marker (if it should fade out)
            if (willFadeOut && hideDelay > 0) {
                setTimeout(() => {
                    try { markerGroup.style.transition = `opacity ${animationDuration}ms ease-out`; } catch (e) {}
                    markerGroup.setAttribute('opacity', '0');
                    setTimeout(() => {
                        try { markerGroup.setAttribute('display', 'none'); } catch (e) {}
                        try { (markerGroup as any).style.pointerEvents = 'none'; } catch (e) {}
                    }, animationDuration);
                }, hideDelay);
            } else if (!willFadeOut) {
                // Enable pointer events for residual markers
                setTimeout(() => {
                    try { (markerGroup as any).style.pointerEvents = 'auto'; } catch (e) {}
                }, showDelay);
            }
        } else {
            markerGroup.setAttribute('opacity', '1');
            this.gPoints.appendChild(markerGroup);
        }
    }
    
    /**
     * Render organized grid for a single expanded cell
     * @param risks Array of risks in this cell
     * @param L Likelihood value of the cell
     * @param C Consequence value of the cell
     * @param toXY Coordinate conversion function
     * @param sm Selection manager
     */
    private renderOrganizedCellOnly(
        risks: RiskPoint[],
        L: number,
        C: number,
        toXY: (l: number, c: number) => {x: number, y: number},
        sm: ISelectionManager
    ): void {
        // Get cell dimensions from current viewport
        const matrixRows = this.formattingSettings?.matrixGridCard?.matrixRows?.value || 5;
        const matrixColumns = this.formattingSettings?.matrixGridCard?.matrixColumns?.value || 5;
        const m = { l: 40, r: 10, t: 10, b: 30 };
        const vp = { 
            width: Number(this.svg.getAttribute('width')), 
            height: Number(this.svg.getAttribute('height')) 
        };
        const w = vp.width - m.l - m.r;
        const h = vp.height - m.t - m.b;
        const cw = w / matrixColumns;
        const ch = h / matrixRows;
        
        const cellPadding = this.formattingSettings?.riskMarkersLayoutCard?.cellPadding?.value ?? 5;
        const markerRows = this.formattingSettings?.riskMarkersLayoutCard?.markerRows?.value ?? 3;
        const markerCols = this.formattingSettings?.riskMarkersLayoutCard?.markerColumns?.value ?? 3;
        const showInherentInOrganized = this.formattingSettings?.riskMarkersLayoutCard?.showInherentInOrganized?.value ?? false;
        const organizedArrows = this.formattingSettings?.riskMarkersLayoutCard?.organizedArrows?.value ?? true;
        const animationEnabled = this.formattingSettings?.animationCard?.enabled?.value ?? true;
        const animationDuration = this.formattingSettings?.animationCard?.durationMs?.value || 800;
        
        const cellCenter = toXY(L, C);
        const cellBounds = {
            x: cellCenter.x - cw/2,
            y: cellCenter.y - ch/2,
            width: cw,
            height: ch
        };
        
        // Create cell group with background click handler
        const cellGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        cellGroup.setAttribute('class', 'expanded-cell-group');
        
        // Add clickable background rect for collapse
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("x", String(cellBounds.x));
        bgRect.setAttribute("y", String(cellBounds.y));
        bgRect.setAttribute("width", String(cellBounds.width));
        bgRect.setAttribute("height", String(cellBounds.height));
        bgRect.setAttribute("fill", "transparent");
        bgRect.setAttribute("pointer-events", "all");
        bgRect.style.cursor = "pointer";
        
        // Collapse on background click
        const collapseHandler = (evt: Event) => {
            evt.stopPropagation();
            this.expandedCell = null;
            // Re-render to show count view
            this.renderData(vp, this.currentData || []);
        };
        bgRect.addEventListener("click", collapseHandler);
        
        cellGroup.appendChild(bgRect);
        
        // Create container for markers with scrolling support
        const markerContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        markerContainer.setAttribute('class', 'marker-container');
        
        // Calculate max visible markers and check if scrolling needed
        const maxVisibleMarkers = markerRows * markerCols;
        const needsScrolling = risks.length > maxVisibleMarkers;
        
        // Organize markers in grid (residual positions)
        const residualMarkers = risks.map(risk => ({
            data: risk,
            color: this.getSeverityColor(((risk.lRes ?? risk.lInh) || 1) * ((risk.cRes ?? risk.cInh) || 1)),
            type: 'residual'
        }));
        
        const organizedResidualMarkers = this.organizeMarkersInCell(residualMarkers, cellBounds, cellPadding, markerRows, markerCols);
        
        // Track positions for arrow rendering
        const organizedPositions: {[riskId: string]: {inherent?: {x: number, y: number}, residual?: {x: number, y: number}}} = {};
        
        // Store residual positions
        organizedResidualMarkers.forEach(marker => {
            const riskId = marker.data.id;
            if (!organizedPositions[riskId]) {
                organizedPositions[riskId] = {};
            }
            organizedPositions[riskId].residual = { x: marker.organizedX, y: marker.organizedY };
        });
        
        // Render inherent markers if enabled (for arrow start points)
        if (showInherentInOrganized) {
            const inherentMarkers = risks
                .filter(risk => risk.lInh !== undefined && risk.cInh !== undefined)
                .map(risk => ({
                    data: risk,
                    color: this.getSeverityColor(((risk.lInh || 1) * (risk.cInh || 1))),
                    type: 'inherent'
                }));
            
            if (inherentMarkers.length > 0) {
                const organizedInherentMarkers = this.organizeMarkersInCell(inherentMarkers, cellBounds, cellPadding, markerRows, markerCols);
                
                organizedInherentMarkers.forEach((marker, index) => {
                    const riskId = marker.data.id;
                    if (!organizedPositions[riskId]) {
                        organizedPositions[riskId] = {};
                    }
                    organizedPositions[riskId].inherent = { x: marker.organizedX, y: marker.organizedY };
                    
                    // Render inherent marker with collapse on click and animation
                    const inherentElement = this.createMarkerElement(marker, sm, 'inherent');
                    inherentElement.addEventListener("click", collapseHandler);
                    
                    // Fast expansion animation for inherent markers too
                    if (animationEnabled) {
                        const centerX = cellCenter.x;
                        const centerY = cellCenter.y;
                        const targetX = marker.organizedX;
                        const targetY = marker.organizedY;
                        const dx = targetX - centerX;
                        const dy = targetY - centerY;
                        
                        inherentElement.setAttribute("transform", `translate(${-dx}, ${-dy})`);
                        inherentElement.setAttribute("opacity", "0");
                        
                        const staggerDelay = index * 30;
                        const animDuration = 300;
                        
                        setTimeout(() => {
                            inherentElement.style.transition = `transform ${animDuration}ms ease-out, opacity ${animDuration}ms ease-in`;
                            inherentElement.setAttribute("transform", "translate(0, 0)");
                            inherentElement.setAttribute("opacity", "1");
                        }, staggerDelay);
                    }
                    
                    markerContainer.appendChild(inherentElement);
                });
            }
        }
        
        // No arrows in expanded view - arrows only show before clicking in count marker view
        
        // Render residual markers with collapse on click and fast expansion animation
        organizedResidualMarkers.forEach((marker, index) => {
            const markerElement = this.createMarkerElement(marker, sm, 'residual');
            markerElement.addEventListener("click", collapseHandler);
            
            // Fast expansion animation: start at center, animate to position
            if (animationEnabled) {
                const centerX = cellCenter.x;
                const centerY = cellCenter.y;
                const targetX = marker.organizedX;
                const targetY = marker.organizedY;
                const dx = targetX - centerX;
                const dy = targetY - centerY;
                
                // Start at center (transform from target back to center)
                markerElement.setAttribute("transform", `translate(${-dx}, ${-dy})`);
                markerElement.setAttribute("opacity", "0");
                
                // Animate to final position with staggered delay for visual effect
                const staggerDelay = index * 30; // 30ms between each marker
                const animDuration = 300; // Fast 300ms animation
                
                setTimeout(() => {
                    markerElement.style.transition = `transform ${animDuration}ms ease-out, opacity ${animDuration}ms ease-in`;
                    markerElement.setAttribute("transform", "translate(0, 0)");
                    markerElement.setAttribute("opacity", "1");
                }, staggerDelay);
            }
            
            markerContainer.appendChild(markerElement);
        });
        
        // Add scrolling support if needed - using same approach as organized grid
        if (needsScrolling) {
            const enableScrolling = this.formattingSettings?.riskMarkersLayoutCard?.enableScrolling?.value ?? false;
            const scrollFadeDepth = this.formattingSettings?.riskMarkersLayoutCard?.scrollFadeDepth?.value ?? 20;
            
            if (enableScrolling) {
                // Create scroll container that will translate
                const scrollContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
                scrollContainer.setAttribute("class", "scroll-container");
                
                // Move markers from markerContainer to scrollContainer
                while (markerContainer.firstChild) {
                    scrollContainer.appendChild(markerContainer.firstChild);
                }
                markerContainer.appendChild(scrollContainer);
                
                // Calculate scroll bounds
                const totalRows = Math.ceil(risks.length / markerCols);
                const usableHeight = cellBounds.height - (cellPadding * 2);
                const markerSpacingY = usableHeight / markerRows;
                const markerSize = this.formattingSettings?.markersCard?.size?.value ?? 6;
                const contentHeight = (totalRows * markerSpacingY) + markerSize;
                const maxScroll = Math.min(0, cellBounds.height - contentHeight);
                
                // Add wheel event listener for scrolling
                let offsetY = 0;
                const handleWheel = (e: WheelEvent) => {
                    e.preventDefault();
                    offsetY = Math.max(maxScroll, Math.min(0, offsetY - e.deltaY * 0.5));
                    scrollContainer.setAttribute('transform', `translate(0, ${offsetY})`);
                };
                cellGroup.addEventListener('wheel', handleWheel);
                
                // Apply fade mask to cellGroup (static) so gradient stays fixed while content scrolls
                const defs = this.svg.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
                if (!this.svg.querySelector('defs')) {
                    this.svg.insertBefore(defs, this.svg.firstChild);
                }
                applyScrollFadeMask(defs, cellBounds, `scroll-fade-centered-${L}-${C}`, cellGroup, scrollFadeDepth);
                cellGroup.setAttribute('data-scroll-mask', `url(#scroll-fade-centered-${L}-${C}-mask)`);
            }
        }
        
        cellGroup.appendChild(markerContainer);
        this.gPoints.appendChild(cellGroup);
    }
    
    // Helper method to create marker element (extracted for reuse)
    private createMarkerElement(marker: any, sm: ISelectionManager, type: 'inherent' | 'residual'): SVGGElement {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.renderSingleMarkerToGroup(group, marker, sm, type);
        return group;
    }
    
    private renderSingleMarker(marker: any, sm: ISelectionManager, type: 'inherent' | 'residual') {
        // Fallback to gPoints group if no specific group is provided
        this.renderSingleMarkerToGroup(this.gPoints, marker, sm, type);
    }
    
    private renderCenteredLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, sm: ISelectionManager) {
        // Group risks by cell for count aggregation
        const cellMap = this.groupRisksByCell(data);
        
        // Settings for arrows and animation
        const showInherentInOrganized = this.formattingSettings?.riskMarkersLayoutCard?.showInherentInOrganized?.value ?? false;
        const organizedArrows = this.formattingSettings?.riskMarkersLayoutCard?.organizedArrows?.value ?? true;
        const arrowDistance = this.formattingSettings.arrowsCard.arrowDistance.value || 5;
        const arrowColor = this.formattingSettings.arrowsCard.arrowColor.value.value || "#666666";
        const arrowTransparency = this.formattingSettings.arrowsCard.arrowTransparency.value || 100;
        const arrowOpacity = arrowTransparency / 100;
        const animationEnabled = this.formattingSettings?.animationCard?.enabled?.value ?? false;
        const animationDuration = this.formattingSettings?.animationCard?.durationMs?.value || 1000;
        
        // Skip animation if a cell is expanded (we're just re-rendering after click)
        const shouldAnimate = animationEnabled && !this.expandedCell;
        
        // Calculate animation timing (same as jittered layout)
        const inherentFadeStart = Math.ceil(animationDuration * 2.5);
        const arrowShowDelay = Math.ceil(animationDuration * 1.5);
        const arrowHideStart = Math.ceil(animationDuration * 3.5);
        const residualBuffer = Math.max(75, Math.ceil(animationDuration * 0.3));
        // Residual markers should appear WITH arrows, not after they hide
        const residualDelay = arrowShowDelay; // Show at same time as arrows
        
        // Group risks by INHERENT position for initial display
        const inherentCellMap = new Map<string, RiskPoint[]>();
        for (const risk of data) {
            if (risk.lInh !== undefined && risk.cInh !== undefined) {
                const inhKey = `${risk.lInh}-${risk.cInh}`;
                const existing = inherentCellMap.get(inhKey) || [];
                existing.push(risk);
                inherentCellMap.set(inhKey, existing);
            }
        }
        
        // Collect arrow positions between inherent and residual cells
        interface ArrowPathData {
            inherent: {x: number, y: number};
            residual: {x: number, y: number};
            maxScore: number;
        }
        const arrowPaths: ArrowPathData[] = [];
        
        // Prepare data for staggered animation (sorted by risk severity, high to low)
        interface CellAnimationData {
            cellKey: string;
            position: {x: number, y: number};
            count: number;
            maxScore: number;
            color: string;
            risks: RiskPoint[];
            isInherent: boolean;
        }
        
        const inherentAnimationData: CellAnimationData[] = [];
        const residualAnimationData: CellAnimationData[] = [];
        
        // Collect inherent markers data
        if (showInherentInOrganized && shouldAnimate) {
            inherentCellMap.forEach((risks, inhKey) => {
                if (this.expandedCell === inhKey) return;
                
                const [L, C] = inhKey.split('-').map(Number);
                const position = toXY(L, C);
                const count = risks.length;
                const maxScore = Math.max(...risks.map(r => 
                    ((r.lInh || 1) * (r.cInh || 1))
                ));
                const color = this.getSeverityColor(maxScore);
                
                inherentAnimationData.push({
                    cellKey: inhKey,
                    position,
                    count,
                    maxScore,
                    color,
                    risks,
                    isInherent: true
                });
                
                // Check if any risks move to different residual position
                const residualPositions = new Set(risks.map(r => `${r.lRes ?? r.lInh}-${r.cRes ?? r.cInh}`));
                residualPositions.forEach(resKey => {
                    if (resKey !== inhKey) {
                        const [resL, resC] = resKey.split('-').map(Number);
                        const resPosition = toXY(resL, resC);
                        arrowPaths.push({
                            inherent: position,
                            residual: resPosition,
                            maxScore
                        });
                    }
                });
            });
            
            // Sort inherent markers by risk severity (high to low)
            inherentAnimationData.sort((a, b) => b.maxScore - a.maxScore);
        }
        
        // Collect residual markers data
        cellMap.forEach((risks, cellKey) => {
            // Don't skip expanded cell - we need its data for rendering organized grid
            const count = risks.length;
            const maxScore = Math.max(...risks.map(r => 
                ((r.lRes ?? r.lInh) || 1) * ((r.cRes ?? r.cInh) || 1)
            ));
            const color = this.getSeverityColor(maxScore);
            const [L, C] = cellKey.split('-').map(Number);
            const position = toXY(L, C);
            
            residualAnimationData.push({
                cellKey,
                position,
                count,
                maxScore,
                color,
                risks,
                isInherent: false
            });
        });
        
        // Sort residual markers by risk severity (high to low)
        residualAnimationData.sort((a, b) => b.maxScore - a.maxScore);
        
        // First pass: render inherent count markers with staggered animation
        if (showInherentInOrganized && shouldAnimate) {
            inherentAnimationData.forEach((data, index) => {
                const staggerDelay = index * 100; // 100ms gap between each marker
                
                this.renderCountMarkerWithAnimation(
                    `inh-${data.cellKey}`,
                    data.count,
                    data.position.x,
                    data.position.y,
                    data.color,
                    sm,
                    () => {}, // No click action for inherent markers (they fade out)
                    true, // Animation enabled for inherent markers
                    animationDuration,
                    10 + staggerDelay, // Show with stagger
                    inherentFadeStart + staggerDelay, // Fade out with stagger
                    true // This is inherent marker (will fade out)
                );
            });
        }
        
        // Second pass: render residual count markers or expanded cells
        residualAnimationData.forEach((data, index) => {
            const [L, C] = data.cellKey.split('-').map(Number);
            
            // Check if this cell is expanded
            if (this.expandedCell === data.cellKey) {
                // Render organized grid for this cell only
                this.renderOrganizedCellOnly(data.risks, L, C, toXY, sm);
            } else {
                if (shouldAnimate && showInherentInOrganized) {
                    // Staggered animation: 100ms gap between each marker
                    const staggerDelay = index * 100;
                    
                    // Render with delayed animation (appears with arrows)
                    this.renderCountMarkerWithAnimation(
                        data.cellKey,
                        data.count,
                        data.position.x,
                        data.position.y,
                        data.color,
                        sm,
                        () => {
                            // Expand this cell on click
                            this.expandedCell = data.cellKey;
                            // Re-render to show expanded view
                            this.renderData(
                                { width: Number(this.svg.getAttribute('width')), height: Number(this.svg.getAttribute('height')) },
                                this.currentData || []
                            );
                        },
                        true, // Animation enabled for residual markers when shouldAnimate is true
                        animationDuration,
                        residualDelay + staggerDelay, // Show with stagger
                        0, // Never fade out (stays visible)
                        false // This is residual marker (stays visible)
                    );
                } else {
                    // No animation or inherent disabled - render immediately
                    this.renderCountMarker(
                        data.cellKey,
                        data.count,
                        data.position.x,
                        data.position.y,
                        data.color,
                        sm,
                        () => {
                            // Expand this cell on click
                            this.expandedCell = data.cellKey;
                            // Re-render to show expanded view
                            this.renderData(
                                { width: Number(this.svg.getAttribute('width')), height: Number(this.svg.getAttribute('height')) },
                                this.currentData || []
                            );
                        }
                    );
                }
            }
        });
        
        // Third pass: draw arrows from inherent to residual count markers with staggered animation
        if (showInherentInOrganized && organizedArrows && arrowPaths.length > 0) {
            // Sort arrows by severity (high to low) for staggered animation
            const sortedArrowPaths = [...arrowPaths].sort((a, b) => b.maxScore - a.maxScore);
            
            sortedArrowPaths.forEach((path, index) => {
                const adjustedPos = this.calculateArrowPosition(
                    path.inherent,
                    path.residual,
                    arrowDistance
                );
                
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", String(adjustedPos.start.x));
                line.setAttribute("y1", String(adjustedPos.start.y));
                line.setAttribute("x2", String(adjustedPos.end.x));
                line.setAttribute("y2", String(adjustedPos.end.y));
                line.setAttribute("stroke", arrowColor);
                line.setAttribute("stroke-opacity", String(arrowOpacity));
                line.setAttribute("stroke-width", "1.5");
                line.setAttribute("marker-end", "url(#arrow)");
                line.setAttribute("pointer-events", "none");
                
                // Animate arrow opacity in sequence when animation enabled
                if (shouldAnimate) {
                    const staggerDelay = index * 100; // 100ms gap between each arrow
                    
                    line.setAttribute('opacity', '0');
                    this.gArrows.appendChild(line);
                    // Show arrow after inherent initial display with stagger
                    setTimeout(() => {
                        try { line.style.transition = `opacity ${animationDuration}ms ease-in`; } catch (e) {}
                        line.setAttribute('opacity', '1');
                    }, arrowShowDelay + staggerDelay);
                    // Schedule arrow fade-out after inherent fade-out completes with stagger
                    setTimeout(() => {
                        try { line.style.transition = `opacity ${animationDuration}ms ease-out`; } catch (e) {}
                        line.setAttribute('opacity', '0');
                        // Remove from hit-testing after fade-out
                        setTimeout(() => {
                            try { line.setAttribute('display', 'none'); } catch (e) {}
                        }, animationDuration);
                    }, arrowHideStart + staggerDelay);
                } else {
                    line.setAttribute('opacity', '1');
                    this.gArrows.appendChild(line);
                }
            });
        }
    }
    
    private renderJitteredLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, cw: number, ch: number, sm: ISelectionManager) {
        // Use original jittered layout
        for (const d of data) {
            const color = this.getSeverityColor(((d.lRes ?? d.lInh) || 1) * ((d.cRes ?? d.cInh) || 1));
            const start = (d.lInh && d.cInh) ? toXY(d.lInh, d.cInh) : undefined;
            const end = (d.lRes && d.cRes) ? toXY(d.lRes, d.cRes) : start;
            if (!end) continue;
            
            const jit = this.stableJitter(d.id, cw, ch);
            this.renderMarkerWithArrow(d, start, end, color, jit, sm);
        }
    }
    
    private renderMarkerWithArrow(d: RiskPoint, start: {x: number, y: number} | undefined, end: {x: number, y: number}, color: string, jit: {dx: number, dy: number}, sm: ISelectionManager) {
    const showArrows = this.formattingSettings.arrowsCard.show.value;
    const arrowDistance = this.formattingSettings.arrowsCard.arrowDistance.value || 5;
    const arrowColor = this.formattingSettings.arrowsCard.arrowColor.value.value || "#666666";
    const arrowTransparency = this.formattingSettings.arrowsCard.arrowTransparency.value || 100;
    const arrowOpacity = arrowTransparency / 100;
    const markerSize = this.formattingSettings.markersCard.size.value ?? 6;
    const overrideColor = this.formattingSettings.markersCard.color.value.value;
    // residual severity color comes from caller; compute inherent severity color separately
    const residualSeverityColor = color;
    const inherentSeverityColor = this.getSeverityColor(((d.lInh ?? d.lRes) || 1) * ((d.cInh ?? d.cRes) || 1));
    const resColor = (overrideColor && overrideColor !== "") ? overrideColor : residualSeverityColor;
    const inhColor = (overrideColor && overrideColor !== "") ? overrideColor : inherentSeverityColor;
    const showLabels = this.formattingSettings.labelsCard.show.value;
    const labelSize = this.formattingSettings.labelsCard.fontSize.value ?? 10;
    const showTooltips = this.formattingSettings.tooltipsCard.show.value;
        const animationEnabled = this.formattingSettings.animationCard.enabled.value ?? false;
        const animationDuration = this.formattingSettings.animationCard.durationMs.value || 1000;
        const hasArrow = showArrows && !!start && (start.x !== end.x || start.y !== end.y);
        const inherentFadeStart = Math.ceil(animationDuration * 2.5);
        const arrowShowDelay = Math.ceil(animationDuration * 1.5);
        const arrowHideStart = Math.ceil(animationDuration * 3.5);
        const residualBuffer = Math.max(75, Math.ceil(animationDuration * 0.3));
        const residualDelay = hasArrow
            ? arrowHideStart + animationDuration + residualBuffer
            : inherentFadeStart + animationDuration + residualBuffer;
        
        // Get marker border settings - FIXED: Correct reading from ColorPicker
        const borderColor = this.formattingSettings.markersCard.borderColor.value?.value || "#111111";
        const borderWidth = this.formattingSettings.markersCard.borderWidth.value ?? 1;
        const borderTransparency = this.formattingSettings.markersCard.borderTransparency.value ?? 100;
        const borderOpacity = borderTransparency / 100;
        
    if (hasArrow && start) {
            // Calculate adjusted positions with distance from markers
            const adjustedPos = this.calculateArrowPosition(
                { x: start.x + jit.dx, y: start.y + jit.dy },
                { x: end.x + jit.dx, y: end.y + jit.dy },
                arrowDistance
            );
            
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", String(adjustedPos.start.x)); 
            line.setAttribute("y1", String(adjustedPos.start.y));
            line.setAttribute("x2", String(adjustedPos.end.x)); 
            line.setAttribute("y2", String(adjustedPos.end.y));
            line.setAttribute("stroke", arrowColor);
            line.setAttribute("stroke-opacity", String(arrowOpacity));
            line.setAttribute("stroke-width", "1.5"); 
            line.setAttribute("marker-end", "url(#arrow)");
            line.setAttribute("pointer-events", "none"); // Don't block scroll events
            // Animate arrow opacity in sequence when animation enabled
            if (animationEnabled) {
                line.setAttribute('opacity', '0');
                this.gArrows.appendChild(line);
                // show arrow after inherent initial display (~1.5 * duration)
                setTimeout(() => {
                    try { line.style.transition = `opacity ${animationDuration}ms ease-in`; } catch (e) {}
                    line.setAttribute('opacity', '1');
                }, arrowShowDelay);
                // schedule arrow fade-out after inherent fade-out completes (~3.5 * duration)
                setTimeout(() => {
                    try { line.style.transition = `opacity ${animationDuration}ms ease-out`; } catch (e) {}
                    line.setAttribute('opacity', '0');
                    // remove from hit-testing after fade-out
                    setTimeout(() => {
                        try { line.setAttribute('display', 'none'); } catch (e) {}
                    }, animationDuration);
                }, arrowHideStart);
            } else {
                line.setAttribute('opacity', '1');
                this.gArrows.appendChild(line);
            }
        }
        
        // Render start marker (inherent risk) if exists
        if (start) {
            const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            c1.setAttribute("cx", String(start.x + jit.dx));
            c1.setAttribute("cy", String(start.y + jit.dy));
            c1.setAttribute("r", String(Math.max(1, markerSize - 1)));
            c1.setAttribute("fill", inhColor);
            c1.setAttribute("fill-opacity", "0.5");
            c1.setAttribute("stroke", borderColor);
            c1.setAttribute("stroke-width", String(borderWidth));
            c1.setAttribute("stroke-opacity", String(borderOpacity));
            if (showTooltips) c1.setAttribute("title", `${d.id} (I: ${d.lInh}×${d.cInh})`);
            c1.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
            (c1 as any).__sel = d.selectionId;
            if (animationEnabled) {
                c1.setAttribute('opacity', '0');
                this.gPoints.appendChild(c1);
                // show inherent quickly
                setTimeout(() => {
                    try { c1.style.transition = `opacity ${animationDuration}ms ease-in`; } catch (e) {}
                    c1.setAttribute('opacity', '1');
                }, 10);
                // fade out inherent later
                setTimeout(() => {
                    try { c1.style.transition = `opacity ${animationDuration}ms ease-out`; } catch (e) {}
                    c1.setAttribute('opacity', '0');
                    setTimeout(() => {
                        try { c1.setAttribute('display', 'none'); } catch (e) {}
                        try { (c1 as any).style.pointerEvents = 'none'; } catch (e) {}
                    }, animationDuration);
                }, inherentFadeStart);
            } else {
                this.gPoints.appendChild(c1);
            }
        }
        
        // Render end marker (residual risk)
        const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c2.setAttribute("cx", String(end.x + jit.dx));
        c2.setAttribute("cy", String(end.y + jit.dy));
        c2.setAttribute("r", String(markerSize));
        c2.setAttribute("fill", resColor);
        c2.setAttribute("stroke", borderColor);
        c2.setAttribute("stroke-width", String(borderWidth));
        c2.setAttribute("stroke-opacity", String(borderOpacity));
        if (showTooltips) c2.setAttribute("title", `${d.id} (R: ${d.lRes ?? d.lInh}×${d.cRes ?? d.cInh})`);
        c2.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
        (c2 as any).__sel = d.selectionId;
        // If animation is enabled, delay showing the residual marker until after arrows/initial sequence
        if (animationEnabled) {
            c2.setAttribute('opacity', '0');
            c2.setAttribute('display', 'none');
            try { (c2 as any).style.pointerEvents = 'none'; } catch (e) {}
            this.gPoints.appendChild(c2);
            setTimeout(() => {
                c2.removeAttribute('display');
                try {
                    c2.style.transition = `opacity ${animationDuration}ms ease-in`;
                } catch (e) {}
                c2.setAttribute('opacity', '1');
                try { (c2 as any).style.pointerEvents = 'auto'; } catch (e) {}
            }, residualDelay);
        } else {
            c2.setAttribute('opacity', '1');
            this.gPoints.appendChild(c2);
        }

        // Render label (if enabled)
        if (showLabels) {
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", String(end.x + jit.dx + markerSize + 2));
            label.setAttribute("y", String(end.y + jit.dy + 3));
            label.setAttribute("font-size", String(labelSize));
            label.setAttribute("fill", "#111");
            label.textContent = d.id;
            if (animationEnabled) {
                label.setAttribute('opacity', '0');
                label.setAttribute('display', 'none');
                this.gPoints.appendChild(label);
                const labelDelay = residualDelay;
                setTimeout(() => {
                    label.removeAttribute('display');
                    try {
                        label.style.transition = `opacity ${animationDuration}ms ease-in`;
                    } catch (e) {}
                    label.setAttribute('opacity', '1');
                }, labelDelay);
            } else {
                this.gPoints.appendChild(label);
            }
        }
    }

    private createArrowMarker(defs: SVGDefsElement, arrowSize: number, arrowColor: string) {
        // Remove existing marker if it exists
        const existingMarker = defs.querySelector('#arrow');
        if (existingMarker) {
            existingMarker.remove();
        }
        
        // Create new marker with custom size and color
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrow");
        marker.setAttribute("orient", "auto");
        marker.setAttribute("markerWidth", String(arrowSize));
        marker.setAttribute("markerHeight", String(arrowSize));
        marker.setAttribute("refX", String(arrowSize));
        marker.setAttribute("refY", String(arrowSize / 2));
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M0,0 L${arrowSize},${arrowSize/2} L0,${arrowSize} Z`);
        path.setAttribute("fill", arrowColor);
        
        marker.appendChild(path);
        defs.appendChild(marker);
    }

    private calculateArrowPosition(start: { x: number, y: number }, end: { x: number, y: number }, distance: number): { start: { x: number, y: number }, end: { x: number, y: number } } {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) {
            return { start, end };
        }
        
        // Calculate unit vector
        const unitX = dx / length;
        const unitY = dy / length;
        
        // Adjust start and end points by distance
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

    // Show custom HTML tooltip with full styling control
    private showTooltip(element: Element, d: RiskPoint, type: 'inherent' | 'residual') {
        try {
            const tooltipsSettings = this.formattingSettings?.tooltipsCard;
            if (!tooltipsSettings || !tooltipsSettings.show.value) return;

            // Get tooltip text
            let tooltipText = "";
            if (d.tooltipData !== undefined) {
                tooltipText = String(d.tooltipData);
            } else {
                // Fallback to default format
                if (type === 'inherent') {
                    tooltipText = `${d.id} (I: ${d.lInh}×${d.cInh})`;
                } else {
                    const lRes = d.lRes ?? d.lInh;
                    const cRes = d.cRes ?? d.cInh;
                    tooltipText = `${d.id} (R: ${lRes}×${cRes})`;
                }
            }

            if (!tooltipText) return;

            // Apply custom styling from settings
            const textSize = tooltipsSettings.textSize?.value || 11;
            const textColor = tooltipsSettings.textColor?.value?.value || "#333333";
            const backgroundColor = tooltipsSettings.backgroundColor?.value?.value || "#ffffff";
            const borderColor = tooltipsSettings.borderColor?.value?.value || "#cccccc";

            this.tooltipDiv.textContent = tooltipText;
            this.tooltipDiv.style.fontSize = `${textSize}px`;
            this.tooltipDiv.style.color = textColor;
            this.tooltipDiv.style.backgroundColor = backgroundColor;
            this.tooltipDiv.style.border = `1px solid ${borderColor}`;
            this.tooltipDiv.style.display = "block";

            // Position tooltip near the element
            const rect = (element as SVGElement).getBoundingClientRect?.();
            if (rect) {
                const containerRect = (element.ownerDocument?.defaultView as any)?.frameElement?.getBoundingClientRect();
                const offsetX = containerRect ? containerRect.left : 0;
                const offsetY = containerRect ? containerRect.top : 0;
                
                // Calculate position - show above marker by default
                let left = rect.left - offsetX + rect.width / 2;
                let top = rect.top - offsetY - 10; // 10px gap above marker
                
                // Get tooltip dimensions after setting content
                const tooltipRect = this.tooltipDiv.getBoundingClientRect();
                const tooltipHeight = tooltipRect.height;
                const tooltipWidth = tooltipRect.width;
                
                // Adjust vertical position to show above marker
                top = top - tooltipHeight;
                
                // Ensure tooltip stays within horizontal bounds
                if (left - tooltipWidth / 2 < 5) {
                    left = tooltipWidth / 2 + 5; // 5px margin from left edge
                } else if (left + tooltipWidth / 2 > window.innerWidth - 5) {
                    left = window.innerWidth - tooltipWidth / 2 - 5; // 5px margin from right edge
                }
                
                // If tooltip would go above viewport, show below marker instead
                if (top < 5) {
                    top = rect.bottom - offsetY + 10; // Show below marker with 10px gap
                }
                
                this.tooltipDiv.style.left = `${left}px`;
                this.tooltipDiv.style.top = `${top}px`;
                this.tooltipDiv.style.transform = "translateX(-50%)";
            }
        } catch (e) {
            // Non-fatal if positioning fails
        }
    }

    // Hide custom tooltip
    private hideTooltip() {
        try {
            this.tooltipDiv.style.display = "none";
        } catch (e) {
            // Non-fatal
        }
    }
}
