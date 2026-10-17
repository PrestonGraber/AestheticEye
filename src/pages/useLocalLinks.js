import { useEffect } from 'react';
import routes from './page-routes.json';
const paths = new Set(['/', ...routes.map((p) => p.path)]);
export function localLink(href) {
  try {
    const url = new URL(href);
    const path = url.pathname.replace(/\/?$/, '/');
    if (/^(www\.)?aestheticeyemd\.com$/.test(url.hostname) && paths.has(path)) {
      return '#' + path + (url.hash ? '?section=' + encodeURIComponent(url.hash.slice(1)) : '');
    }
  } catch {
    /* Relative links and non-HTTP actions retain their original behavior. */
  }
  return href;
}
// The existing concept components share original source URLs. Normalize rendered
// anchors, including menus mounted on demand, so new-tab and keyboard navigation work.
export function useLocalLinks() {
  useEffect(() => {
    const update = () =>
      document.querySelectorAll('a[href]').forEach((a) => {
        if (a.hasAttribute('data-source-service')) return;
        const href = a.getAttribute('href');
        let next = localLink(href);
        if (!window.location.hash.startsWith('#/') && next.startsWith('#/')) next = next.slice(1);
        if (next !== href) a.setAttribute('href', next);
      });
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href'],
    });
    return () => observer.disconnect();
  }, []);
}
