import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
const pages = JSON.parse(fs.readFileSync('src/pages/page-index.json'));
const seo = JSON.parse(fs.readFileSync('src/pages/seo-index.json'));
const errors = [];
for (const p of [{ path: '/' }, ...pages]) {
  const d = new JSDOM(fs.readFileSync(path.join('dist', p.path, 'index.html'))).window.document;
  if (d.querySelectorAll('h1').length !== 1) errors.push([p.path, 'h1']);
  if (d.title !== seo[p.path].title) errors.push([p.path, 'title']);
  if (!d.querySelector('meta[name="description"]')?.content) errors.push([p.path, 'description']);
  if (d.querySelector('link[rel="canonical"]')?.href !== seo[p.path].canonical)
    errors.push([p.path, 'canonical']);
  if (d.querySelector('#root').textContent.length < 100) errors.push([p.path, 'empty body']);
  for (const a of d.querySelectorAll('a[href^="#/"]'))
    errors.push([p.path, 'fragment route', a.href]);
  for (const img of d.querySelectorAll('img[src^="/media/"]'))
    if (!fs.existsSync('public' + img.getAttribute('src'))) errors.push([p.path, 'missing image']);
  d.defaultView.close();
}
const employeeDocument = new JSDOM(fs.readFileSync('dist/employee/index.html')).window.document;
if (employeeDocument.querySelector('meta[name="robots"]')?.content !== 'noindex, nofollow') errors.push(['/employee/', 'employee indexing']);
if (fs.readFileSync('dist/sitemap.xml', 'utf8').includes('/employee/')) errors.push(['/employee/', 'employee sitemap inclusion']);
employeeDocument.defaultView.close();
console.log(JSON.stringify({ pages: pages.length + 1, employeeRouteExcluded: true, errors }));
if (errors.length) process.exitCode = 1;
