import React, { useEffect, useState } from 'react';
import './foundation.css';
import Collection from './Collection.jsx';
import Website, { jumpToMain } from './Website.jsx';
import { getDesign } from './designs.js';
function readRoute() {
  return window.location.hash.replace(/^#\/?/, '');
}
export default function App() {
  const [route, setRoute] = useState(readRoute);
  const design = getDesign(route);
  useEffect(() => {
    const changed = () => {
      const next = readRoute();
      if (!next || getDesign(next)) {
        setRoute(next);
        window.scrollTo({ top: 0, behavior: 'instant' });
        requestAnimationFrame(() =>
          document.getElementById('main')?.focus({ preventScroll: true }),
        );
      }
    };
    window.addEventListener('hashchange', changed);
    return () => window.removeEventListener('hashchange', changed);
  }, []);
  useEffect(() => {
    document.title = design ? `${design.name} — AestheticEye` : 'AestheticEye — Design Collection';
  }, [design]);
  return design ? (
    <Website design={design.id} reviewTools />
  ) : (
    <>
      <a className="skip-link" href="#main" onClick={jumpToMain}>
        Skip to main content
      </a>
      <Collection />
    </>
  );
}
