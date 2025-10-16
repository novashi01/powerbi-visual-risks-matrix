/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Data Point Formatting Card
 */
class DataPointCardSettings extends FormattingSettingsCard {
    defaultColor = new formattingSettings.ColorPicker({
        name: "defaultColor",
        displayName: "Default color",
        value: { value: "" }
    });

    showAllDataPoints = new formattingSettings.ToggleSwitch({
        name: "showAllDataPoints",
        displayName: "Show all",
        value: true
    });

    fill = new formattingSettings.ColorPicker({
        name: "fill",
        displayName: "Fill",
        value: { value: "" }
    });

    fillRule = new formattingSettings.ColorPicker({
        name: "fillRule",
        displayName: "Color saturation",
        value: { value: "" }
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Text Size",
        value: 12
    });

    name: string = "dataPoint";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [this.defaultColor, this.showAllDataPoints, this.fill, this.fillRule, this.fontSize];
}

/** Severity colors card */
class SeverityCardSettings extends FormattingSettingsCard {
    low = new formattingSettings.ColorPicker({ name: "low", displayName: "Low", value: { value: "#388e3c" } });
    moderate = new formattingSettings.ColorPicker({ name: "moderate", displayName: "Moderate", value: { value: "#fbc02d" } });
    high = new formattingSettings.ColorPicker({ name: "high", displayName: "High", value: { value: "#f57c00" } });
    extreme = new formattingSettings.ColorPicker({ name: "extreme", displayName: "Extreme", value: { value: "#d32f2f" } });

    name: string = "severity";
    displayName: string = "Severity colors";
    slices: Array<FormattingSettingsSlice> = [this.low, this.moderate, this.high, this.extreme];
}

/** Animation card */
class AnimationCardSettings extends FormattingSettingsCard {
    enabled = new formattingSettings.ToggleSwitch({ name: "enabled", displayName: "Enable animation", value: true });
    durationMs = new formattingSettings.NumUpDown({ name: "durationMs", displayName: "Duration (ms)", value: 800 });

    name: string = "animation";
    displayName: string = "Animation";
    slices: Array<FormattingSettingsSlice> = [this.enabled, this.durationMs];
}

/**
* visual settings model class
*/
class ThresholdsCardSettings extends FormattingSettingsCard {
    lowMax = new formattingSettings.NumUpDown({ name: "lowMax", displayName: "Low max", value: 4 });
    moderateMax = new formattingSettings.NumUpDown({ name: "moderateMax", displayName: "Moderate max", value: 9 });
    highMax = new formattingSettings.NumUpDown({ name: "highMax", displayName: "High max", value: 16 });
    name: string = "thresholds"; displayName: string = "Severity thresholds";
    slices: Array<FormattingSettingsSlice> = [this.lowMax, this.moderateMax, this.highMax];
}

class AxesCardSettings extends FormattingSettingsCard {
    // X-Axis (Likelihood) Labels
    xLabel1 = new formattingSettings.TextInput({ name: "xLabel1", displayName: "X-axis label 1", value: "1", placeholder: "1" });
    xLabel2 = new formattingSettings.TextInput({ name: "xLabel2", displayName: "X-axis label 2", value: "2", placeholder: "2" });
    xLabel3 = new formattingSettings.TextInput({ name: "xLabel3", displayName: "X-axis label 3", value: "3", placeholder: "3" });
    xLabel4 = new formattingSettings.TextInput({ name: "xLabel4", displayName: "X-axis label 4", value: "4", placeholder: "4" });
    xLabel5 = new formattingSettings.TextInput({ name: "xLabel5", displayName: "X-axis label 5", value: "5", placeholder: "5" });
    
    // Y-Axis (Consequence) Labels  
    yLabel1 = new formattingSettings.TextInput({ name: "yLabel1", displayName: "Y-axis label 1", value: "1", placeholder: "1" });
    yLabel2 = new formattingSettings.TextInput({ name: "yLabel2", displayName: "Y-axis label 2", value: "2", placeholder: "2" });
    yLabel3 = new formattingSettings.TextInput({ name: "yLabel3", displayName: "Y-axis label 3", value: "3", placeholder: "3" });
    yLabel4 = new formattingSettings.TextInput({ name: "yLabel4", displayName: "Y-axis label 4", value: "4", placeholder: "4" });
    yLabel5 = new formattingSettings.TextInput({ name: "yLabel5", displayName: "Y-axis label 5", value: "5", placeholder: "5" });
    
    // Axis Configuration
    showXLabels = new formattingSettings.ToggleSwitch({ name: "showXLabels", displayName: "Show X-axis labels", value: true });
    showYLabels = new formattingSettings.ToggleSwitch({ name: "showYLabels", displayName: "Show Y-axis labels", value: true });
    
    // Font Size
    xAxisFontSize = new formattingSettings.NumUpDown({ 
        name: "xAxisFontSize", 
        displayName: "X-axis font size", 
        value: 10,
        options: { minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min }, maxValue: { value: 24, type: powerbi.visuals.ValidatorType.Max } }
    });
    yAxisFontSize = new formattingSettings.NumUpDown({ 
        name: "yAxisFontSize", 
        displayName: "Y-axis font size", 
        value: 10,
        options: { minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min }, maxValue: { value: 24, type: powerbi.visuals.ValidatorType.Max } }
    });
    
    // Y-Axis Orientation
    yAxisOrientation = new formattingSettings.ItemDropdown({
        name: "yAxisOrientation",
        displayName: "Y-axis text orientation",
        items: [
            { displayName: "Horizontal", value: "horizontal" },
            { displayName: "Vertical", value: "vertical" }
        ],
        value: { displayName: "Horizontal", value: "horizontal" }
    });
    
    name: string = "axes";
    displayName: string = "Axis Labels";
    slices: Array<FormattingSettingsSlice> = [
        this.showXLabels, this.showYLabels,
        this.xAxisFontSize, this.yAxisFontSize, this.yAxisOrientation,
        this.xLabel1, this.xLabel2, this.xLabel3, this.xLabel4, this.xLabel5,
        this.yLabel1, this.yLabel2, this.yLabel3, this.yLabel4, this.yLabel5
    ];
}

class MarkersCardSettings extends FormattingSettingsCard {
    size = new formattingSettings.NumUpDown({ name: "size", displayName: "Marker size", value: 6 });
    color = new formattingSettings.ColorPicker({ name: "color", displayName: "Marker color override", value: { value: "" } });
    
    // Border customization
    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Border color",
        value: { value: "#111111" }
    });
    
    borderWidth = new formattingSettings.NumUpDown({
        name: "borderWidth",
        displayName: "Border width",
        value: 1,
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 5, type: powerbi.visuals.ValidatorType.Max }
        }
    });
    
    borderTransparency = new formattingSettings.NumUpDown({
        name: "borderTransparency",
        displayName: "Border transparency (%)",
        value: 100,
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        }
    });
    
    name: string = "markers"; displayName: string = "Markers";
    slices: Array<FormattingSettingsSlice> = [this.size, this.color, this.borderColor, this.borderWidth, this.borderTransparency];
}

class LabelsCardSettings extends FormattingSettingsCard {
    show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show labels", value: false });
    fontSize = new formattingSettings.NumUpDown({ name: "fontSize", displayName: "Label size", value: 10 });
    name: string = "labels"; displayName: string = "Labels";
    slices: Array<FormattingSettingsSlice> = [this.show, this.fontSize];
}

class ArrowsCardSettings extends FormattingSettingsCard {
    show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show arrows", value: true });
    
    // Arrow Size Control
    arrowSize = new formattingSettings.NumUpDown({
        name: "arrowSize",
        displayName: "Arrow size", 
        value: 8,
        options: { 
            minValue: { value: 4, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 20, type: powerbi.visuals.ValidatorType.Max }
        }
    });
    
    // Distance from markers (increased max to 50)
    arrowDistance = new formattingSettings.NumUpDown({
        name: "arrowDistance",
        displayName: "Distance from markers",
        value: 5,
        options: {
            minValue: { value: 2, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 50, type: powerbi.visuals.ValidatorType.Max }
        }
    });
    
    // Arrow color
    arrowColor = new formattingSettings.ColorPicker({
        name: "arrowColor",
        displayName: "Arrow color",
        value: { value: "#666666" }
    });
    
    // Arrow transparency
    arrowTransparency = new formattingSettings.NumUpDown({
        name: "arrowTransparency",
        displayName: "Arrow transparency (%)",
        value: 100,
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        }
    });
    
    name: string = "arrows"; 
    displayName: string = "Arrows";
    slices: Array<FormattingSettingsSlice> = [this.show, this.arrowSize, this.arrowDistance, this.arrowColor, this.arrowTransparency];
}

class TooltipsCardSettings extends FormattingSettingsCard {
    show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show tooltips", value: true });
    name: string = "tooltips"; displayName: string = "Tooltips";
    slices: Array<FormattingSettingsSlice> = [this.show];
}

class MatrixGridCardSettings extends FormattingSettingsCard {
    matrixRows = new formattingSettings.NumUpDown({
        name: "matrixRows",
        displayName: "Matrix rows",
        value: 3,
        options: {
            minValue: { value: 2, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    matrixColumns = new formattingSettings.NumUpDown({
        name: "matrixColumns",
        displayName: "Matrix columns",
        value: 3,
        options: {
            minValue: { value: 2, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    name: string = "matrixGrid";
    displayName: string = "Matrix Grid";
    slices: Array<FormattingSettingsSlice> = [this.matrixRows, this.matrixColumns];
}

class RiskMarkersLayoutCardSettings extends FormattingSettingsCard {
    layoutMode = new formattingSettings.ItemDropdown({
        name: "layoutMode",
        displayName: "Positioning mode",
        items: [
            { displayName: "Organized Grid", value: "organized" },
            { displayName: "Random Scatter", value: "scatter" },
            { displayName: "Centered", value: "centered" }
        ],
        value: { displayName: "Organized Grid", value: "organized" }
    });

    markerRows = new formattingSettings.NumUpDown({
        name: "markerRows",
        displayName: "Marker rows (per cell)",
        value: 3,
        options: {
            minValue: { value: 1, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    markerColumns = new formattingSettings.NumUpDown({
        name: "markerColumns",
        displayName: "Marker columns (per cell)",
        value: 3,
        options: {
            minValue: { value: 1, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    cellPadding = new formattingSettings.NumUpDown({
        name: "cellPadding",
        displayName: "Cell padding",
        value: 5,
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 20, type: powerbi.visuals.ValidatorType.Max }
        }
    });
    
    enableScrolling = new formattingSettings.ToggleSwitch({
        name: "enableScrolling",
        displayName: "Show all markers (overflow hidden by clipPath, no interactive scroll)",
        value: false
    });

    showInherentInOrganized = new formattingSettings.ToggleSwitch({
        name: "showInherentInOrganized",
        displayName: "Show inherent risks",
        value: true
    });

    inherentTransparency = new formattingSettings.NumUpDown({
        name: "inherentTransparency",
        displayName: "Inherent transparency (%)",
        value: 50,
        options: {
            minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
            maxValue: { value: 100, type: powerbi.visuals.ValidatorType.Max }
        }
    });

    organizedArrows = new formattingSettings.ToggleSwitch({
        name: "organizedArrows",
        displayName: "Show arrows in organized mode",
        value: true
    });

    name: string = "riskMarkersLayout";
    displayName: string = "Risk Markers Layout";
    slices: Array<FormattingSettingsSlice> = [
        this.layoutMode,
        this.markerRows,
        this.markerColumns,
        this.cellPadding,
        this.enableScrolling,
        this.showInherentInOrganized,
        this.inherentTransparency,
        this.organizedArrows
    ];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dataPointCard = new DataPointCardSettings();
    severityCard = new SeverityCardSettings();
    thresholdsCard = new ThresholdsCardSettings();
    axesCard = new AxesCardSettings();
    markersCard = new MarkersCardSettings();
    labelsCard = new LabelsCardSettings();
    arrowsCard = new ArrowsCardSettings();
    tooltipsCard = new TooltipsCardSettings();
    animationCard = new AnimationCardSettings();
    matrixGridCard = new MatrixGridCardSettings();
    riskMarkersLayoutCard = new RiskMarkersLayoutCardSettings();

    cards = [
        this.dataPointCard,
        this.severityCard,
        this.thresholdsCard,
        this.axesCard,
        this.markersCard,
        this.labelsCard,
        this.arrowsCard,
        this.tooltipsCard,
        this.animationCard,
        this.matrixGridCard,
        this.riskMarkersLayoutCard
    ];
}
