// Jest setup file
require('jest-environment-jsdom');

// Mock Power BI API
global.powerbi = {
  extensibility: {
    visual: {},
    ISelectionManager: {},
    IVisualHost: {}
  },
  visuals: {},
  DataView: {},
  DataViewCategorical: {},
  IViewport: {}
};

// Mock SVG namespace
Object.defineProperty(global, 'SVGElement', {
  writable: true,
  value: class SVGElement extends HTMLElement {}
});

// Mock createElementNS for SVG elements
const originalCreateElementNS = document.createElementNS;
document.createElementNS = jest.fn((namespace, qualifiedName) => {
  if (namespace === 'http://www.w3.org/2000/svg') {
    const element = document.createElement(qualifiedName);
    // Add SVG-specific methods
    element.setAttribute = jest.fn();
    element.appendChild = jest.fn();
    return element;
  }
  return originalCreateElementNS.call(document, namespace, qualifiedName);
});

// Mock console methods to reduce test noise
console.warn = jest.fn();
console.error = jest.fn();