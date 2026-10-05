import React, { useEffect, useRef } from 'react';
import './motion.css';
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
    const sections = [...document.querySelectorAll('.section')];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    const configureMotion = () => {
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove('reveal-section', 'in-view');
        if (!preference.matches) {
          section.classList.add('reveal-section');
          observer.observe(section);
        }
      });
    };
    configureMotion();
    preference.addEventListener('change', configureMotion);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const resize = new ResizeObserver(update);
    resize.observe(document.documentElement);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      preference.removeEventListener('change', configureMotion);
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      sections.forEach((section) => section.classList.remove('reveal-section', 'in-view'));
    };
  }, [route]);
  return <div ref={bar} className="reading-progress" aria-hidden="true" />;
}
