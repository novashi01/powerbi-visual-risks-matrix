export interface ScrollBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

const svgNs = "http://www.w3.org/2000/svg";

export function applyScrollFadeMask(
    defs: SVGDefsElement,
    bounds: ScrollBounds,
    key: string,
    target: SVGGElement,
    fadeDepth: number
): void {
    const maskId = `${key}-mask`;
    const gradientId = `${key}-gradient`;

    const existingMask = defs.querySelector(`#${maskId}`);
    if (existingMask) {
        existingMask.remove();
    }

    const existingGradient = defs.querySelector(`#${gradientId}`);
    if (existingGradient) {
        existingGradient.remove();
    }

    target.removeAttribute("mask");

    if (!bounds || bounds.height <= 0) {
        return;
    }

    const normalizedFade = Math.max(0, Math.min(bounds.height / 2, fadeDepth || 0));
    if (normalizedFade === 0) {
        return;
    }

    const fadeRatio = normalizedFade / bounds.height;
    const startOffset = Math.min(0.5, fadeRatio);
    const endOffset = 1 - startOffset;

    const gradient = document.createElementNS(svgNs, "linearGradient");
    gradient.setAttribute("id", gradientId);
    gradient.setAttribute("gradientUnits", "userSpaceOnUse");
    gradient.setAttribute("x1", "0");
    gradient.setAttribute("y1", String(bounds.y));
    gradient.setAttribute("x2", "0");
    gradient.setAttribute("y2", String(bounds.y + bounds.height));

    const stops = [
        { offset: 0, opacity: 0 },
        { offset: startOffset, opacity: 1 },
        { offset: endOffset, opacity: 1 },
        { offset: 1, opacity: 0 }
    ];

    stops.forEach(stopInfo => {
        const stop = document.createElementNS(svgNs, "stop");
        stop.setAttribute("offset", String(stopInfo.offset));
        stop.setAttribute("stop-color", "#ffffff");
        stop.setAttribute("stop-opacity", String(stopInfo.opacity));
        gradient.appendChild(stop);
    });

    const mask = document.createElementNS(svgNs, "mask");
    mask.setAttribute("id", maskId);
    mask.setAttribute("maskUnits", "userSpaceOnUse");

    const maskRect = document.createElementNS(svgNs, "rect");
    maskRect.setAttribute("x", String(bounds.x));
    maskRect.setAttribute("y", String(bounds.y));
    maskRect.setAttribute("width", String(bounds.width));
    maskRect.setAttribute("height", String(bounds.height));
    maskRect.setAttribute("fill", `url(#${gradientId})`);
    mask.appendChild(maskRect);

    defs.appendChild(gradient);
    defs.appendChild(mask);

    target.setAttributeNS(null, "mask", `url(#${maskId})`);
}
