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
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { VisualFormattingSettingsModel } from "./settings";
import "./../style/visual.less";

interface RiskPoint {
    id: string;
    lInh?: number; cInh?: number;
    lRes?: number; cRes?: number;
    category?: string;
}

export class Visual implements IVisual {
    private svg: SVGSVGElement;
    private gGrid: SVGGElement;
    private gArrows: SVGGElement;
    private gPoints: SVGGElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        this.formattingSettingsService = new FormattingSettingsService();
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.gGrid = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.gArrows = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.gPoints = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrow"); marker.setAttribute("orient", "auto"); marker.setAttribute("markerWidth", "8"); marker.setAttribute("markerHeight", "8"); marker.setAttribute("refX", "8"); marker.setAttribute("refY", "4");
        const mpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        mpath.setAttribute("d", "M0,0 L8,4 L0,8 Z"); mpath.setAttribute("fill", "#333");
        marker.appendChild(mpath); defs.appendChild(marker); this.svg.appendChild(defs);
        this.svg.appendChild(this.gGrid); this.svg.appendChild(this.gArrows); this.svg.appendChild(this.gPoints);
        options.element.innerHTML = ""; options.element.appendChild(this.svg);
    }

    public update(options: VisualUpdateOptions) {
        const view = options.dataViews && options.dataViews[0];
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, view);
        const vp = options.viewport; this.resize(vp);
        this.renderGrid(vp);
        const data = this.mapData(view);
        this.renderData(vp, data);
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    private resize(vp: IViewport) {
        this.svg.setAttribute("width", String(vp.width));
        this.svg.setAttribute("height", String(vp.height));
    }

    private getSeverityColor(score: number): string {
        const low = (this.formattingSettings as any)?.severityCard?.low?.value?.value || "#388e3c";
        const mod = (this.formattingSettings as any)?.severityCard?.moderate?.value?.value || "#fbc02d";
        const high = (this.formattingSettings as any)?.severityCard?.high?.value?.value || "#f57c00";
        const ext = (this.formattingSettings as any)?.severityCard?.extreme?.value?.value || "#d32f2f";
        const tLow = (this.formattingSettings as any)?.thresholdsCard?.lowMax?.value ?? 4;
        const tMod = (this.formattingSettings as any)?.thresholdsCard?.moderateMax?.value ?? 9;
        const tHigh = (this.formattingSettings as any)?.thresholdsCard?.highMax?.value ?? 16;
        if (score > tHigh) return ext; if (score > tMod) return high; if (score > tLow) return mod; return low;
    }

    private renderGrid(vp: IViewport) {
        this.gGrid.innerHTML = "";
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
        // Axes labels custom or 1..5
        const lLabCSV = (this.formattingSettings as any)?.axesCard?.likelihoodLabels?.value as string || "1,2,3,4,5";
        const cLabCSV = (this.formattingSettings as any)?.axesCard?.consequenceLabels?.value as string || "1,2,3,4,5";
        const lLabs = lLabCSV.split(',').map(s=>s.trim());
        const cLabs = cLabCSV.split(',').map(s=>s.trim());
        for (let x = 0; x < cols; x++) {
            const tx = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tx.setAttribute("x", String(m.l + (x + 0.5) * cw)); tx.setAttribute("y", String(vp.height - 8));
            tx.setAttribute("text-anchor", "middle"); tx.setAttribute("font-size", "10"); tx.textContent = lLabs[x] || String(x + 1);
            this.gGrid.appendChild(tx);
        }
        for (let y = 0; y < rows; y++) {
            const ty = document.createElementNS("http://www.w3.org/2000/svg", "text");
            ty.setAttribute("x", String(12)); ty.setAttribute("y", String(m.t + (y + 0.6) * ch));
            ty.setAttribute("text-anchor", "start"); ty.setAttribute("font-size", "10"); ty.textContent = cLabs[rows - y - 1] || String(rows - y);
            this.gGrid.appendChild(ty);
        }
    }

    private clamp(n?: number): number | undefined {
        if (n == null || isNaN(n)) return undefined; return Math.max(1, Math.min(5, Math.round(n)));
    }

    private mapData(view?: DataView): RiskPoint[] {
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
        const n = riskCats.values.length;
        for (let i = 0; i < n; i++) {
            const rp: RiskPoint = { id: String(riskCats.values[i]) };
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
        this.gArrows.innerHTML = ""; this.gPoints.innerHTML = "";
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
            const showArrows = (this.formattingSettings as any)?.arrowsCard?.show?.value !== false;
            const markerSize = (this.formattingSettings as any)?.markersCard?.size?.value ?? 6;
            const overrideColor = (this.formattingSettings as any)?.markersCard?.color?.value?.value as string;
            const finalColor = overrideColor && overrideColor !== "" ? overrideColor : color;
            if (showArrows && start && (start.x !== end.x || start.y !== end.y)) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", String(start.x)); line.setAttribute("y1", String(start.y));
                line.setAttribute("x2", String(end.x)); line.setAttribute("y2", String(end.y));
                line.setAttribute("stroke", "#666"); line.setAttribute("stroke-width", "1.5"); line.setAttribute("marker-end", "url(#arrow)");
                this.gArrows.appendChild(line);
            }
            const showLabels = (this.formattingSettings as any)?.labelsCard?.show?.value === true;
            const labelSize = (this.formattingSettings as any)?.labelsCard?.fontSize?.value ?? 10;
            const showTooltips = (this.formattingSettings as any)?.tooltipsCard?.show?.value !== false;
            if (start) {
                const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                c1.setAttribute("cx", String(start.x + jit.dx)); c1.setAttribute("cy", String(start.y + jit.dy));
                c1.setAttribute("r", String(Math.max(1, markerSize - 1))); c1.setAttribute("fill", finalColor); c1.setAttribute("fill-opacity", "0.5"); c1.setAttribute("stroke", "#333"); c1.setAttribute("stroke-width", "1");
                if (showTooltips) c1.setAttribute("title", `${d.id} (I: ${d.lInh}×${d.cInh})`);
                this.gPoints.appendChild(c1);
            }
            if (end) {
                const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                c2.setAttribute("cx", String(end.x + jit.dx)); c2.setAttribute("cy", String(end.y + jit.dy));
                c2.setAttribute("r", String(markerSize)); c2.setAttribute("fill", finalColor); c2.setAttribute("stroke", "#111"); c2.setAttribute("stroke-width", "1");
                if (showTooltips) c2.setAttribute("title", `${d.id} (R: ${d.lRes ?? d.lInh}×${d.cRes ?? d.cInh})`);
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
