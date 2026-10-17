import { useEffect, useRef } from 'react';

// Small, local, user-driven movement; no global pointer tracking or animation loop.
export function usePointerDepth() {
  const ref = useRef(null);
  const frame = useRef(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => {
      if (preference.matches) reset();
    };
    preference.addEventListener('change', changed);
    return () => {
      cancelAnimationFrame(frame.current);
      preference.removeEventListener('change', changed);
    };
  }, []);
  function reset() {
    cancelAnimationFrame(frame.current);
    ref.current?.style.setProperty('--portrait-x', '0px');
    ref.current?.style.setProperty('--portrait-y', '0px');
  }
  function move(event) {
    if (
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.readingMotion === 'true'
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      ref.current?.style.setProperty('--portrait-x', `${x * 7}px`);
      ref.current?.style.setProperty('--portrait-y', `${y * 5}px`);
    });
  }
  return { ref, onPointerMove: move, onPointerLeave: reset };
}
