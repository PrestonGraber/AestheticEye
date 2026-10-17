import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const origin = 'https://www.aestheticeyemd.com';
const directory = path.resolve('../work/source-site');
fs.mkdirSync(directory, { recursive: true });
const urls = new Set();
const failures = [];
const cacheName = url => encodeURIComponent(new URL(url).pathname) + '.html';
async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(40000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) { if (attempt === 2) throw error; }
  }
}
for (const type of ['page', 'post', 'gallery', 'team', 'gallery_categories']) {
  const xml = await get(`${origin}/${type}-sitemap.xml`);
  const dom = new JSDOM(xml, { contentType: 'text/xml' });
  for (const loc of dom.window.document.querySelectorAll('url > loc')) urls.add(loc.textContent);
  dom.window.close();
}
const queued = [...urls];
const pages = [];
function add(href, base) {
  try {
    const u = new URL(href, base);
    if (!['www.aestheticeyemd.com', 'aestheticeyemd.com'].includes(u.hostname) || u.search || /\.[a-z0-9]{2,5}$/i.test(u.pathname) || /\/(wp-|feed|author|tag|category|cdn-cgi)/.test(u.pathname)) return;
    const url = origin + u.pathname.replace(/\/?$/, '/');
    if (!urls.has(url)) { urls.add(url); queued.push(url); }
  } catch {}
}
while (queued.length) {
  const batch = queued.splice(0, 4);
  await Promise.all(batch.map(async url => {
    try {
      const file = path.join(directory, cacheName(url));
      const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : await get(url);
      fs.writeFileSync(file, html);
      const dom = new JSDOM(html);
      const d = dom.window.document;
      if (!d.querySelector('main') && new URL(url).pathname !== '/oculoplastics-consultation/') throw new Error('No main content');
      for (const a of d.querySelectorAll('main a[href], header a[href], footer a[href]')) add(a.getAttribute('href'), url);
      pages.push({ url, path: new URL(url).pathname, title: d.querySelector('h1')?.textContent.trim() || d.title, file: cacheName(url) });
      dom.window.close();
    } catch(error) { failures.push({url,error:String(error)}); }
  }));
  fs.writeFileSync(path.join(directory, 'inventory.json'), JSON.stringify({ pages, failures }, null, 2));
  console.log(`${pages.length} pages collected; ${queued.length} pending; ${failures.length} failures`);
}
