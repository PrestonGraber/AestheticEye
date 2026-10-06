import React, { useEffect, useRef } from 'react';
import './motion.css';
import { installPageMotion } from './ui/pageMotion.js';
export { default as ReviewCarousel } from './sections/Reviews.jsx';

export function MotionLayer({ route }) {
  const bar = useRef(null);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;
        bar.current?.style.setProperty('--progress', progress);
        const site = bar.current?.closest('.site');
        if (site) site.dataset.scrolled = String(window.scrollY > window.innerHeight * 0.6);
      });
    };
    const disposeMotion = installPageMotion(bar.current?.closest('.site'), preference);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const resize = new ResizeObserver(update);
    resize.observe(document.documentElement);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      disposeMotion();
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [route]);
  return <div ref={bar} className="reading-progress" aria-hidden="true" />;
}
