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
    name: string = "axes"; displayName: string = "Axis labels";
    slices: Array<FormattingSettingsSlice> = [];
}

class MarkersCardSettings extends FormattingSettingsCard {
    size = new formattingSettings.NumUpDown({ name: "size", displayName: "Marker size", value: 6 });
    color = new formattingSettings.ColorPicker({ name: "color", displayName: "Marker color override", value: { value: "" } });
    name: string = "markers"; displayName: string = "Markers";
    slices: Array<FormattingSettingsSlice> = [this.size, this.color];
}

class LabelsCardSettings extends FormattingSettingsCard {
    show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show labels", value: false });
    fontSize = new formattingSettings.NumUpDown({ name: "fontSize", displayName: "Label size", value: 10 });
    name: string = "labels"; displayName: string = "Labels";
    slices: Array<FormattingSettingsSlice> = [this.show, this.fontSize];
}

class ArrowsCardSettings extends FormattingSettingsCard {
    show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show arrows", value: true });
    name: string = "arrows"; displayName: string = "Arrows";
    slices: Array<FormattingSettingsSlice> = [this.show];
}

class TooltipsCardSettings extends FormattingSettingsCard {
    show = new formattingSettings.ToggleSwitch({ name: "show", displayName: "Show tooltips", value: true });
    name: string = "tooltips"; displayName: string = "Tooltips";
    slices: Array<FormattingSettingsSlice> = [this.show];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    dataPointCard = new DataPointCardSettings();
    severityCard = new SeverityCardSettings();
    thresholdsCard = new ThresholdsCardSettings();
    markersCard = new MarkersCardSettings();
    labelsCard = new LabelsCardSettings();
    arrowsCard = new ArrowsCardSettings();
    tooltipsCard = new TooltipsCardSettings();
    animationCard = new AnimationCardSettings();

    cards = [
        this.dataPointCard,
        this.severityCard,
        this.thresholdsCard,
        this.markersCard,
        this.labelsCard,
        this.arrowsCard,
        this.tooltipsCard,
        this.animationCard
    ];
}
