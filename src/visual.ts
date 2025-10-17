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
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";
import "./../style/visual.less";

interface RiskPoint {
    id: string;
    lInh?: number; 
    cInh?: number;
    lRes?: number; 
    cRes?: number;
    category?: string;
    selectionId?: ISelectionId;
}

export class Visual implements IVisual {
    private svg: SVGSVGElement;
    private gGrid: SVGGElement;
    private gArrows: SVGGElement;
    private gPoints: SVGGElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private host: IVisualHost;
    private selectionManager: ISelectionManager;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.selectionManager = this.host.createSelectionManager();
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
        const view = options.dataViews && options.dataViews[0];
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, view);
        
        // Update arrow marker with current settings
        const arrowSize = this.formattingSettings.arrowsCard.arrowSize.value || 8;
        const defs = this.svg.querySelector('defs') as SVGDefsElement;
        if (defs) {
            const arrowColor = this.formattingSettings.arrowsCard.arrowColor.value.value || "#666666";
            this.createArrowMarker(defs, arrowSize, arrowColor);
        }
        
        const vp = options.viewport;
        this.resize(vp);
        this.renderGrid(vp, view);
        const data = this.mapData(view);
        this.renderData(vp, data);
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
                rect.setAttribute("fill", this.getSeverityColor(score)); rect.setAttribute("fill-opacity", "0.25");
                rect.setAttribute("stroke", "#ccc"); rect.setAttribute("stroke-width", "1");
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
        const n = Math.min(riskCats.values.length, maxN);
        for (let i = 0; i < n; i++) {
            const selectionId = this.host.createSelectionIdBuilder().withCategory(riskCats, i).createSelectionId();
            const rp: RiskPoint = { id: String(riskCats.values[i]), selectionId };
            rp.lInh = this.clamp(LInh?.values?.[i]); rp.cInh = this.clamp(CInh?.values?.[i]);
            rp.lRes = this.clamp(LRes?.values?.[i]); rp.cRes = this.clamp(CRes?.values?.[i]);
            rp.category = Cat ? String(Cat.values[i]) : undefined;
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
        
        const enableScrolling = this.formattingSettings?.riskMarkersLayoutCard?.enableScrolling?.value ?? true;
        const maxMarkers = markerRows * markerCols;
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
            if (enableScrolling) {
                // Apply clipPath to enforce cell boundaries
                cellGroup.setAttribute("clip-path", `url(#${clipPathId})`);
            }
            
            const organizedMarkers = this.organizeMarkersInCell(residualCellMarkers[cellKey], cellBounds, cellPadding, markerRows, markerCols);
            
            // Count overflow if scrolling disabled
            const totalMarkers = residualCellMarkers[cellKey].length;
            const overflowCount = totalMarkers - maxMarkers;
            
            // Render residual markers and store positions
            organizedMarkers.forEach((marker, idx) => {
                // When scrolling is disabled, skip overflow markers
                // When scrolling is enabled, render ALL markers (clipPath will hide overflow)
                if (!enableScrolling && marker.isOverflow) return;
                
                const riskId = marker.data.id;
                if (!organizedPositions[riskId]) {
                    organizedPositions[riskId] = {};
                }
                organizedPositions[riskId].residual = { x: marker.organizedX, y: marker.organizedY };
                
                this.renderSingleMarkerToGroup(cellGroup, marker, sm, 'residual');
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
                
                // Render inherent markers and store positions
                organizedMarkers.forEach(marker => {
                    // When scrolling is disabled, skip overflow markers
                    // When scrolling is enabled, render ALL markers (clipPath will hide overflow)
                    if (!enableScrolling && marker.isOverflow) return;
                    
                    const riskId = marker.data.id;
                    if (!organizedPositions[riskId]) {
                        organizedPositions[riskId] = {};
                    }
                    organizedPositions[riskId].inherent = { x: marker.organizedX, y: marker.organizedY };
                    
                    this.renderSingleMarkerToGroup(cellGroup, marker, sm, 'inherent');
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
        const enableScrolling = this.formattingSettings?.riskMarkersLayoutCard?.enableScrolling?.value ?? true;
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
    
    private renderSingleMarkerToGroup(group: SVGGElement, marker: any, sm: ISelectionManager, type: 'inherent' | 'residual') {
        const d = marker.data;
        const color = marker.color;
        const x = marker.organizedX;
        const y = marker.organizedY;
        
        const markerSize = this.formattingSettings.markersCard.size.value ?? 6;
        const overrideColor = this.formattingSettings.markersCard.color.value.value;
        const finalColor = (overrideColor && overrideColor !== "") ? overrideColor : color;
        const showLabels = this.formattingSettings.labelsCard.show.value;
        const labelSize = this.formattingSettings.labelsCard.fontSize.value ?? 10;
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
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(x));
        circle.setAttribute("cy", String(y));
        
        if (type === 'inherent') {
            circle.setAttribute("r", String(Math.max(1, markerSize - 1)));
            circle.setAttribute("fill", finalColor);
            circle.setAttribute("fill-opacity", String(inherentOpacity));
            circle.setAttribute("stroke", borderColor);
            circle.setAttribute("stroke-width", String(borderWidth));
            circle.setAttribute("stroke-opacity", String(borderOpacity));
            if (showTooltips) circle.setAttribute("title", `${d.id} (I: ${d.lInh}×${d.cInh})`);
            
            if (animationEnabled) {
                circle.setAttribute("opacity", "0");
                setTimeout(() => {
                    circle.style.transition = `opacity ${animationDuration}ms ease-in`;
                    circle.setAttribute("opacity", "1");
                }, 10);
                
                setTimeout(() => {
                    circle.style.transition = `opacity ${animationDuration}ms ease-out`;
                    circle.setAttribute("opacity", "0");
                }, animationDuration * 2.5);
            }
        } else {
            circle.setAttribute("r", String(markerSize));
            circle.setAttribute("fill", finalColor);
            circle.setAttribute("stroke", borderColor);
            circle.setAttribute("stroke-width", String(borderWidth));
            circle.setAttribute("stroke-opacity", String(borderOpacity));
            if (showTooltips) {
                const lRes = d.lRes ?? d.lInh;
                const cRes = d.cRes ?? d.cInh;
                circle.setAttribute("title", `${d.id} (R: ${lRes}×${cRes})`);
            }
            
            if (animationEnabled) {
                circle.setAttribute("opacity", "0");
                setTimeout(() => {
                    circle.style.transition = `opacity ${animationDuration}ms ease-in`;
                    circle.setAttribute("opacity", "1");
                }, animationDuration * 2);
            }
        }
        
        circle.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
        (circle as any).__sel = d.selectionId;
        group.appendChild(circle);
        
        if (type === 'residual' && showLabels) {
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
    
    private renderSingleMarker(marker: any, sm: ISelectionManager, type: 'inherent' | 'residual') {
        // Fallback to gPoints group if no specific group is provided
        this.renderSingleMarkerToGroup(this.gPoints, marker, sm, type);
    }
    
    private renderCenteredLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, sm: ISelectionManager) {
        for (const d of data) {
            const color = this.getSeverityColor(((d.lRes ?? d.lInh) || 1) * ((d.cRes ?? d.cInh) || 1));
            const start = (d.lInh && d.cInh) ? toXY(d.lInh, d.cInh) : undefined;
            const end = (d.lRes && d.cRes) ? toXY(d.lRes, d.cRes) : start;
            if (!end) continue;
            
            this.renderMarkerWithArrow(d, start, end, color, { dx: 0, dy: 0 }, sm);
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
        const finalColor = (overrideColor && overrideColor !== "") ? overrideColor : color;
        const showLabels = this.formattingSettings.labelsCard.show.value;
        const labelSize = this.formattingSettings.labelsCard.fontSize.value ?? 10;
        const showTooltips = this.formattingSettings.tooltipsCard.show.value;
        
        // Get marker border settings - FIXED: Correct reading from ColorPicker
        const borderColor = this.formattingSettings.markersCard.borderColor.value?.value || "#111111";
        const borderWidth = this.formattingSettings.markersCard.borderWidth.value ?? 1;
        const borderTransparency = this.formattingSettings.markersCard.borderTransparency.value ?? 100;
        const borderOpacity = borderTransparency / 100;
        
        if (showArrows && start && (start.x !== end.x || start.y !== end.y)) {
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
            this.gArrows.appendChild(line);
        }
        
        // Render start marker (inherent risk) if exists
        if (start) {
            const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            c1.setAttribute("cx", String(start.x + jit.dx));
            c1.setAttribute("cy", String(start.y + jit.dy));
            c1.setAttribute("r", String(Math.max(1, markerSize - 1)));
            c1.setAttribute("fill", finalColor);
            c1.setAttribute("fill-opacity", "0.5");
            c1.setAttribute("stroke", borderColor);
            c1.setAttribute("stroke-width", String(borderWidth));
            c1.setAttribute("stroke-opacity", String(borderOpacity));
            if (showTooltips) c1.setAttribute("title", `${d.id} (I: ${d.lInh}×${d.cInh})`);
            c1.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
            (c1 as any).__sel = d.selectionId;
            this.gPoints.appendChild(c1);
        }
        
        // Render end marker (residual risk)
        const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c2.setAttribute("cx", String(end.x + jit.dx));
        c2.setAttribute("cy", String(end.y + jit.dy));
        c2.setAttribute("r", String(markerSize));
        c2.setAttribute("fill", finalColor);
        c2.setAttribute("stroke", borderColor);
        c2.setAttribute("stroke-width", String(borderWidth));
        c2.setAttribute("stroke-opacity", String(borderOpacity));
        if (showTooltips) c2.setAttribute("title", `${d.id} (R: ${d.lRes ?? d.lInh}×${d.cRes ?? d.cInh})`);
        c2.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
        (c2 as any).__sel = d.selectionId;
        this.gPoints.appendChild(c2);
        
        // Render label (if enabled)
        if (showLabels) {
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", String(end.x + jit.dx + markerSize + 2));
            label.setAttribute("y", String(end.y + jit.dy + 3));
            label.setAttribute("font-size", String(labelSize));
            label.setAttribute("fill", "#111");
            label.textContent = d.id;
            this.gPoints.appendChild(label);
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
}
