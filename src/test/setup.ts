import { vi } from 'vitest';

class ResizeObserverMock {
  callback: globalThis.ResizeObserverCallback;

  constructor(callback: globalThis.ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    const entry: globalThis.ResizeObserverEntry = {
      target,
      borderBoxSize: [],
      contentBoxSize: [],
      devicePixelContentBoxSize: [],
      contentRect: target.getBoundingClientRect(),
    };

    this.callback([entry], this);
  }

  unobserve() {}

  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

class DOMMatrixReadOnlyMock {
  m22: number;
  constructor(transform: string) {
    const scale = transform?.match(/scale\(([1-9.])\)/)?.[1];
    this.m22 = scale !== undefined ? +scale : 1;
  }
}

// Covers only the m22 scale that reactflow reads, so it can't satisfy the full DOMMatrixReadOnly type
vi.stubGlobal('DOMMatrixReadOnly', DOMMatrixReadOnlyMock);

// Object.defineProperties(global.HTMLElement.prototype, {
//   offsetHeight: {
//     get() {
//       return parseFloat(this.style.height) || 1;
//     },
//   },
//   offsetWidth: {
//     get() {
//       return parseFloat(this.style.width) || 1;
//     },
//   },
// });

// (global.SVGElement as any).prototype.getBBox = () => ({
//   x: 0,
//   y: 0,
//   width: 0,
//   height: 0,
// });
