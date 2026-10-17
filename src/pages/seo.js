import metadata from './seo-index.json';
export function applySeo(path, preview = false, missing = false) {
  const seo = metadata[path] || metadata['/'];
  document.title = missing ? 'Page not found | AestheticEye' : seo.title;
  const meta = (key, value, property = false) => {
    const attr = property ? 'property' : 'name';
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.append(el);
    }
    el.content = value;
  };
  meta('description', seo.description);
  meta('robots', preview || missing ? 'noindex, follow' : seo.robots);
  meta('og:title', seo.title, true);
  meta('og:description', seo.description, true);
  meta('og:url', seo.canonical, true);
  meta('og:type', 'website', true);
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.append(canonical);
  }
  canonical.href = seo.canonical;
  if (seo.image) meta('og:image', new URL(seo.image, seo.canonical).href, true);
  else document.head.querySelector('meta[property="og:image"]')?.remove();
}
