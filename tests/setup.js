import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

class TestPointerEvent extends MouseEvent {
  constructor(type, options = {}) {
    super(type, options);
    Object.defineProperty(this, 'pointerType', { value: options.pointerType || 'mouse' });
    Object.defineProperty(this, 'pointerId', { value: options.pointerId || 1 });
  }
}
window.PointerEvent = TestPointerEvent;

window.matchMedia = vi.fn((query) => ({
  matches: query === '(hover: hover)',
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

Element.prototype.scrollIntoView = vi.fn();
Element.prototype.scrollTo = vi.fn();
window.scrollTo = vi.fn();
window.requestAnimationFrame = (callback) => setTimeout(callback, 0);
window.cancelAnimationFrame = clearTimeout;
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Native dialogs are simulated only inside this DOM test process, never in a browser.
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute('open', '');
  this.querySelector('button')?.focus();
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
