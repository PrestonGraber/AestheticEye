import { afterEach, expect, it, vi } from 'vitest';
import { installPageMotion } from '../src/ui/pageMotion.js';

const originalAnimate = Object.getOwnPropertyDescriptor(Element.prototype, 'animate');
afterEach(() => {
  if (originalAnimate) Object.defineProperty(Element.prototype, 'animate', originalAnimate);
  else delete Element.prototype.animate;
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});
function setup(reduced = false) {
  const animations = [];
  Object.defineProperty(Element.prototype, 'animate', {
    configurable: true,
    value: vi.fn(() => {
      const animation = { cancel: vi.fn() };
      animations.push(animation);
      return animation;
    }),
  });
  let notify;
  const disconnect = vi.fn();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback) {
        notify = callback;
      }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
    },
  );
  document.body.innerHTML =
    '<div class="site clarity"><section class="art-hero"><h1><span class="clarity-title-line">Headline</span></h1></section><section class="section"><div>Section content</div></section></div>';
  let change;
  const preference = {
    matches: reduced,
    addEventListener: vi.fn((_, callback) => {
      change = callback;
    }),
    removeEventListener: vi.fn(),
  };
  const root = document.querySelector('.site');
  const dispose = installPageMotion(root, preference);
  return {
    animations,
    preference,
    root,
    dispose,
    notify: () => notify([{ isIntersecting: true, target: root.querySelector('.section') }]),
    change: () => change(),
    disconnect,
  };
}
it('reveals each section only once and cancels animation when the page is removed', () => {
  const state = setup();
  expect(state.animations).toHaveLength(1);
  state.notify();
  state.notify();
  expect(state.animations).toHaveLength(2);
  state.dispose();
  expect(state.animations.every((animation) => animation.cancel.mock.calls.length === 1)).toBe(
    true,
  );
  expect(state.preference.removeEventListener).toHaveBeenCalled();
});
it('does not animate when reduced motion is enabled and cancels promptly when changed live', () => {
  const reduced = setup(true);
  reduced.notify();
  expect(reduced.animations).toHaveLength(0);
  reduced.dispose();
  const active = setup();
  active.preference.matches = true;
  active.change();
  expect(active.animations[0].cancel).toHaveBeenCalledOnce();
  active.notify();
  expect(active.animations).toHaveLength(1);
  active.dispose();
});
