import fs from 'node:fs';
import { JSDOM } from 'jsdom';
const inventory = JSON.parse(fs.readFileSync('../work/source-site/inventory.json'));
const pages = JSON.parse(fs.readFileSync('src/pages/page-index.json'));
const seo = {};
for (const record of inventory.pages) {
  const doc = new JSDOM(fs.readFileSync('../work/source-site/' + record.file, 'utf8')).window
    .document;
  const page = pages.find((p) => p.path === record.path);
  const title =
    (doc.title.trim() || page?.title + ' | AestheticEye') +
    (/^\/blog\/page\//.test(record.path) ? ' — Page ' + record.path.split('/')[3] : '');
  const description =
    doc.querySelector('meta[name="description"]')?.content?.trim() ||
    (page?.path.startsWith('/gallery/patient/')
      ? `${page.crumbs.at(-1)?.title || 'Before and after'} — Patient ${page.title}. View original patient photographs from AestheticEye.`
      : `Explore ${page?.title || 'AestheticEye'}, with information from AestheticEye in Cincinnati and Dayton.`);
  seo[record.path] = {
    title,
    description,
    canonical:
      doc.querySelector('link[rel="canonical"]')?.href ||
      'https://www.aestheticeyemd.com' + record.path,
    robots: doc.querySelector('meta[name="robots"]')?.content || 'index, follow',
    image: page?.images[0]?.src ? '/' + page.images[0].src : null,
  };
}
fs.writeFileSync('src/pages/seo-index.json', JSON.stringify(seo));
