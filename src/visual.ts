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
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrow");
        marker.setAttribute("orient", "auto");
        marker.setAttribute("markerWidth", "8");
        marker.setAttribute("markerHeight", "8");
        marker.setAttribute("refX", "8");
        marker.setAttribute("refY", "4");
        const mpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        mpath.setAttribute("d", "M0,0 L8,4 L0,8 Z");
        mpath.setAttribute("fill", "#333");
        marker.appendChild(mpath);
        defs.appendChild(marker);
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
        const m = { l: 40, r: 10, t: 10, b: 30 };
        const w = vp.width - m.l - m.r, h = vp.height - m.t - m.b;
        const cols = 5, rows = 5; const cw = w / cols, ch = h / rows;
        // Cells with severity background
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const L = x + 1; const C = rows - y; const score = L * C;
                const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", String(m.l + x * cw));
                rect.setAttribute("y", String(m.t + y * ch));
                rect.setAttribute("width", String(cw)); rect.setAttribute("height", String(ch));
                rect.setAttribute("fill", this.getSeverityColor(score)); rect.setAttribute("fill-opacity", "0.25");
                rect.setAttribute("stroke", "#ccc"); rect.setAttribute("stroke-width", "1");
                this.gGrid.appendChild(rect);
            }
        }
        
        // FIXED: Always use static 1-5 axis labels for consistent risk matrix framework
        // X-axis (Likelihood): Always 1,2,3,4,5 from left to right  
        // Y-axis (Consequence): Always 5,4,3,2,1 from top to bottom
        // Labels are intentionally FIXED regardless of data to maintain standard risk assessment scale
        const lLabs = ["1", "2", "3", "4", "5"];
        const cLabs = ["1", "2", "3", "4", "5"];
        
        // Render X-axis labels (Likelihood: 1-5)
        for (let x = 0; x < cols; x++) {
            const tx = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tx.setAttribute("x", String(m.l + (x + 0.5) * cw));
            tx.setAttribute("y", String(vp.height - 8));
            tx.setAttribute("text-anchor", "middle");
            tx.setAttribute("font-size", "10");
            tx.textContent = lLabs[x];
            this.gGrid.appendChild(tx);
        }
        
        // Render Y-axis labels (Consequence: 5,4,3,2,1 from top to bottom)
        for (let y = 0; y < rows; y++) {
            const ty = document.createElementNS("http://www.w3.org/2000/svg", "text");
            ty.setAttribute("x", "12");
            ty.setAttribute("y", String(m.t + (y + 0.6) * ch));
            ty.setAttribute("text-anchor", "start");
            ty.setAttribute("font-size", "10");
            ty.textContent = cLabs[rows - y - 1];
            this.gGrid.appendChild(ty);
        }
    }

    private clamp(n?: number): number | undefined {
        if (n == null || isNaN(n)) return undefined; return Math.max(1, Math.min(5, Math.round(n)));
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
        const m = { l: 40, r: 10, t: 10, b: 30 };
        const w = vp.width - m.l - m.r, h = vp.height - m.t - m.b;
        const cols = 5, rows = 5; const cw = w / cols, ch = h / rows;
        const toXY = (L: number, C: number) => {
            const x = m.l + (L - 1) * cw + cw / 2; const y = m.t + (rows - C) * ch + ch / 2; return { x, y };
        };
        for (const d of data) {
            const color = this.getSeverityColor(((d.lRes ?? d.lInh) || 1) * ((d.cRes ?? d.cInh) || 1));
            const start = (d.lInh && d.cInh) ? toXY(d.lInh, d.cInh) : undefined;
            const end = (d.lRes && d.cRes) ? toXY(d.lRes, d.cRes) : start;
            if (!end) continue;
            const jit = this.stableJitter(d.id, cw, ch);
            const showArrows = this.formattingSettings.arrowsCard.show.value;
            const markerSize = this.formattingSettings.markersCard.size.value ?? 6;
            const overrideColor = this.formattingSettings.markersCard.color.value.value;
            const finalColor = (overrideColor && overrideColor !== "") ? overrideColor : color;
            if (showArrows && start && (start.x !== end.x || start.y !== end.y)) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", String(start.x)); line.setAttribute("y1", String(start.y));
                line.setAttribute("x2", String(end.x)); line.setAttribute("y2", String(end.y));
                line.setAttribute("stroke", "#666"); line.setAttribute("stroke-width", "1.5"); line.setAttribute("marker-end", "url(#arrow)");
                this.gArrows.appendChild(line);
            }
            const showLabels = this.formattingSettings.labelsCard.show.value;
            const labelSize = this.formattingSettings.labelsCard.fontSize.value ?? 10;
            const showTooltips = this.formattingSettings.tooltipsCard.show.value;
            if (start) {
                const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                c1.setAttribute("cx", String(start.x + jit.dx)); c1.setAttribute("cy", String(start.y + jit.dy));
                c1.setAttribute("r", String(Math.max(1, markerSize - 1))); c1.setAttribute("fill", finalColor); c1.setAttribute("fill-opacity", "0.5"); c1.setAttribute("stroke", "#333"); c1.setAttribute("stroke-width", "1");
                if (showTooltips) c1.setAttribute("title", `${d.id} (I: ${d.lInh}×${d.cInh})`);
                c1.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
                (c1 as any).__sel = d.selectionId;
                this.gPoints.appendChild(c1);
            }
            if (end) {
                const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                c2.setAttribute("cx", String(end.x + jit.dx)); c2.setAttribute("cy", String(end.y + jit.dy));
                c2.setAttribute("r", String(markerSize)); c2.setAttribute("fill", finalColor); c2.setAttribute("stroke", "#111"); c2.setAttribute("stroke-width", "1");
                if (showTooltips) c2.setAttribute("title", `${d.id} (R: ${d.lRes ?? d.lInh}×${d.cRes ?? d.cInh})`);
                c2.addEventListener("click", (evt) => { evt.stopPropagation(); sm.select(d.selectionId, evt.ctrlKey || evt.metaKey); });
                (c2 as any).__sel = d.selectionId;
                this.gPoints.appendChild(c2);
                if (showLabels) {
                    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    label.setAttribute("x", String(end.x + jit.dx + markerSize + 2)); label.setAttribute("y", String(end.y + jit.dy + 3));
                    label.setAttribute("font-size", String(labelSize)); label.setAttribute("fill", "#111"); label.textContent = d.id;
                    this.gPoints.appendChild(label);
                }
            }
        }
    }
}
