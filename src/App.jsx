import React, { Suspense, lazy, useEffect, useState } from 'react';
import './foundation.css';
import Collection from './Collection.jsx';
import Website, { jumpToMain } from './Website.jsx';
import { getDesign } from './designs.js';
import { applySeo } from './pages/seo.js';
import routes from './pages/page-routes.json';
import { useLocalLinks } from './pages/useLocalLinks.js';
const ContentPage = lazy(() => import('./pages/ContentPage.jsx'));
const EmployeeAccess = lazy(() => import('./employee/EmployeeAccess.jsx'));
const pageFor = (route) =>
  routes.find((p) => p.path === '/' + route.split('?')[0].replace(/^\/+|\/+$/g, '') + '/');
function readRoute() {
  return (
    window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : window.location.pathname
  ).replace(/^\/+|\/+$/g, '');
}
export default function App() {
  const [route, setRoute] = useState(readRoute);
  const collection = route === 'designs';
  const employee = route.split('?')[0] === 'employee';
  const design = getDesign(route) || getDesign('clarity');
  const contentRoute = Boolean(route && !collection && !employee && !getDesign(route));
  const page = contentRoute ? pageFor(route) : null;
  useLocalLinks();
  useEffect(() => {
    const changed = () => {
      const next = readRoute();
      if (window.location.hash.startsWith('#/') || !next) {
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
    document.title = collection
      ? 'AestheticEye — Design Collection'
      : contentRoute
        ? `${page?.title || 'Page not found'} — AestheticEye`
        : !route
          ? 'AestheticEye — Eyelid Surgery Specialists'
          : `${design.name} — AestheticEye`;
    applySeo(
      contentRoute ? page?.path : '/',
      Boolean(collection || getDesign(route)),
      !page && contentRoute,
    );
    if (employee) {
      document.title = 'Employee access | AestheticEye';
      document.querySelector('meta[name="robots"]').content = 'noindex, nofollow';
      document.querySelector('meta[name="description"]').content = 'AestheticEye employee access.';
      document.querySelector('link[rel="canonical"]')?.remove();
    }
    const section = new URLSearchParams(route.split('?')[1]).get('section');
    if (section) requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView());
  }, [design, collection, route, contentRoute, page, employee]);
  return employee ? (
    <Suspense fallback={<main id="main" tabIndex={-1} role="status">Loading employee access…</main>}>
      <EmployeeAccess />
    </Suspense>
  ) : contentRoute ? (
    <Suspense
      fallback={
        <main id="main" tabIndex={-1} className="content-body" role="status">
          Loading page…
        </main>
      }
    >
      <ContentPage key={page?.path || route} page={page} />
    </Suspense>
  ) : !collection ? (
    <Website design={design.id} reviewTools={Boolean(getDesign(route))} />
  ) : (
    <>
      <a className="skip-link" href="#main" onClick={jumpToMain}>
        Skip to main content
      </a>
      <Collection />
    </>
  );
}
