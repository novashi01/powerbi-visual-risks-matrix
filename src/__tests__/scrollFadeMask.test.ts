import { applyScrollFadeMask } from "../scrollFade";

describe("applyScrollFadeMask", () => {
    const svgNamespace = "http://www.w3.org/2000/svg";

    const createSvgContext = () => {
        const svg = document.createElementNS(svgNamespace, "svg");
        const defs = document.createElementNS(svgNamespace, "defs");
        svg.appendChild(defs);
        const target = document.createElementNS(svgNamespace, "g");
        svg.appendChild(target);
        document.body.appendChild(svg);
        const cleanup = () => svg.remove();
        return { defs, target, cleanup };
    };

    it("creates gradient mask when fade depth is positive", () => {
        const { defs, target, cleanup } = createSvgContext();
        const bounds = { x: 0, y: 0, width: 100, height: 100 };

        applyScrollFadeMask(defs, bounds, "scroll-test", target, 20);
        expect(target.getAttribute("mask")).toBe("url(#scroll-test-mask)");
        cleanup();
    });

    it("removes gradient mask when fade depth is zero", () => {
        const { defs, target, cleanup } = createSvgContext();
        const bounds = { x: 10, y: 15, width: 80, height: 120 };

        applyScrollFadeMask(defs, bounds, "scroll-test", target, 24);
        expect(target.getAttribute("mask")).toBe("url(#scroll-test-mask)");

        applyScrollFadeMask(defs, bounds, "scroll-test", target, 0);
        expect(target.hasAttribute("mask")).toBe(false);
        cleanup();
    });
});
