import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';
const pages = JSON.parse(fs.readFileSync('src/pages/page-index.json'));
const seo = JSON.parse(fs.readFileSync('src/pages/seo-index.json'));
const template = fs.readFileSync('dist/index.html', 'utf8');
const dom = new JSDOM('', { url: 'https://www.aestheticeyemd.com/' });
globalThis.DOMParser = dom.window.DOMParser;
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const escape = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const serialized = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');
const paths = new Set(['/', ...pages.map((p) => p.path)]);
try {
  const { renderPage } = await server.ssrLoadModule('/src/entry-static.jsx');
  const css = [...fs.readFileSync('dist/index.html', 'utf8').matchAll(/href="([^"]+\.css)"/g)].map(
    (m) => m[1],
  );
  const contentCss = fs
    .readdirSync('dist/assets')
    .find((n) => n.startsWith('ContentPage-') && n.endsWith('.css'));
  const results = [];
  for (const page of [null, ...pages]) {
    const route = page?.path || '/';
    const meta = seo[route];
    const html = page
      ? JSON.parse(fs.readFileSync('public/content/' + page.contentFile))
          .html.replaceAll('src="media/', 'src="/media/')
          .replaceAll('href="media/', 'href="/media/')
      : null;
    const output = new JSDOM(template);
    const doc = output.window.document;
    doc.title = meta.title;
    doc.querySelector('meta[name="description"]').content = meta.description;
    for (const [name, value] of Object.entries({
      robots: meta.robots,
      'og:title': meta.title,
      'og:description': meta.description,
      'og:url': meta.canonical,
      'og:type': 'website',
      ...(meta.image ? { 'og:image': new URL(meta.image, meta.canonical).href } : {}),
    })) {
      const tag = doc.createElement('meta');
      tag.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
      tag.content = value;
      doc.head.append(tag);
    }
    const canonical = doc.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = meta.canonical;
    doc.head.append(canonical);
    if (page && contentCss) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/' + contentCss;
      doc.head.append(link);
    }
    doc.querySelector('#root').innerHTML = renderPage(page, html);
    // All paths are real crawlable source URLs, including links in imported copy.
    for (const a of doc.querySelectorAll('a[href]')) {
      if (a.hasAttribute('data-source-service')) continue;
      const raw = a.getAttribute('href');
      if (raw.startsWith('#/')) a.setAttribute('href', raw.slice(1));
      else
        try {
          const u = new URL(raw);
          if (/^(www\.)?aestheticeyemd\.com$/.test(u.hostname) && paths.has(u.pathname))
            a.setAttribute('href', u.pathname + u.search + u.hash);
        } catch {}
    }
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': meta.canonical + '#webpage',
      url: meta.canonical,
      name: meta.title,
      description: meta.description,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.aestheticeyemd.com/#website',
        name: 'AestheticEye',
        url: 'https://www.aestheticeyemd.com/',
      },
    };
    const structured = doc.createElement('script');
    structured.type = 'application/ld+json';
    structured.textContent = serialized(schema);
    doc.head.append(structured);
    if (page) {
      const data = doc.createElement('script');
      data.textContent = 'window.__INITIAL_PAGE__=' + serialized({ path: route, html });
      doc.body.append(data);
    }
    const nojs = doc.createElement('noscript');
    nojs.innerHTML =
      '<style>.treatment-section-body[hidden]{display:block}.motion-pending{opacity:1!important;transform:none!important}</style>';
    doc.head.append(nojs);
    const target = path.join('dist', route, 'index.html');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, output.serialize());
    results.push({
      path: route,
      title: meta.title,
      description: meta.description,
      headings: doc.querySelectorAll('h1').length,
      links: doc.querySelectorAll('a[href]').length,
    });
    output.window.close();
  }
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    Object.entries(seo)
      .filter(
        ([p, m]) =>
          !m.robots.includes('noindex') && m.canonical === 'https://www.aestheticeyemd.com' + p,
      )
      .map(([p]) => '<url><loc>https://www.aestheticeyemd.com' + p + '</loc></url>')
      .join('') +
    '</urlset>';
  fs.writeFileSync('dist/sitemap.xml', xml);
  fs.writeFileSync(
    'dist/robots.txt',
    'User-agent: *\nAllow: /\nSitemap: https://www.aestheticeyemd.com/sitemap.xml\n',
  );
  const notFound = new JSDOM(template);
  notFound.window.document.title = 'Page not found | AestheticEye';
  const robots = notFound.window.document.createElement('meta');
  robots.name = 'robots';
  robots.content = 'noindex, follow';
  notFound.window.document.head.append(robots);
  notFound.window.document.querySelector('#root').innerHTML =
    '<main><h1>Page not found</h1><p>The page may have moved. <a href="/">Return to AestheticEye</a>.</p></main>';
  fs.writeFileSync('dist/404.html', notFound.serialize());
  // Public sign-in shell only. Employee data must come from an authenticated API.
  const employee = new JSDOM(template);
  employee.window.document.title = 'Employee access | AestheticEye';
  employee.window.document.querySelector('meta[name="description"]').content = 'AestheticEye employee access.';
  const employeeRobots = employee.window.document.createElement('meta');
  employeeRobots.name = 'robots';
  employeeRobots.content = 'noindex, nofollow';
  employee.window.document.head.append(employeeRobots);
  employee.window.document.querySelector('#root').innerHTML = '<main><h1>Employee access</h1><p>Loading secure sign-in…</p><noscript>JavaScript is required to sign in.</noscript></main>';
  fs.mkdirSync('dist/employee', { recursive: true });
  fs.writeFileSync('dist/employee/index.html', employee.serialize());
  employee.window.close();
  for (const concept of [
    'designs',
    'clarity',
    'serene',
    'still',
    'editorial',
    'modernist',
    'perspective',
    'ease',
    'atelier',
    'precision',
  ]) {
    const preview = new JSDOM(template);
    const r = preview.window.document.createElement('meta');
    r.name = 'robots';
    r.content = 'noindex, follow';
    preview.window.document.head.append(r);
    fs.mkdirSync('dist/' + concept, { recursive: true });
    fs.writeFileSync('dist/' + concept + '/index.html', preview.serialize());
    preview.window.close();
  }
  fs.writeFileSync(
    'seo-verification.json',
    JSON.stringify(
      {
        pages: results.length,
        missingDescriptions: results.filter((r) => !r.description),
        invalidH1: results.filter((r) => r.headings !== 1),
        results,
      },
      null,
      2,
    ),
  );
  console.log(`Pre-rendered ${results.length} pages with original paths, metadata, and content.`);
} finally {
  await server.close();
  dom.window.close();
}
