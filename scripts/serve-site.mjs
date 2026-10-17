import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
};
export function createSiteServer({ directory = 'dist', production = false } = {}) {
  const root = path.resolve(directory);
  const redirects = JSON.parse(fs.readFileSync(path.join(root, 'redirects.json')));
  return http.createServer((req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (!production) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return;
    }
    let url, pathname;
    try {
      url = new URL(req.url, 'http://localhost');
      pathname = decodeURIComponent(url.pathname);
      if (pathname.includes('\0') || pathname.includes('\\')) throw new Error();
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    const redirect =
      redirects[pathname] || (pathname.endsWith('/index.html') ? pathname.slice(0, -10) : null);
    if (redirect) {
      res.writeHead(301, { Location: redirect + url.search });
      res.end();
      return;
    }
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let status = 200;
    try {
      if (fs.statSync(file).isDirectory()) {
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: pathname + '/' + url.search });
          res.end();
          return;
        }
        file = path.join(file, 'index.html');
      }
      if (!fs.statSync(file).isFile()) throw new Error();
    } catch {
      file = path.join(root, '404.html');
      status = 404;
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const size = fs.statSync(file).size;
    const headers = {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': path.extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600',
      'Accept-Ranges': 'bytes',
    };
    let start = 0,
      end = size - 1;
    if (req.headers.range && status === 200) {
      const m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
      if (!m || Number(m[1]) >= size || (m[2] && Number(m[2]) < Number(m[1]))) {
        res.writeHead(416, { 'Content-Range': `bytes */${size}` });
        res.end();
        return;
      }
      start = Number(m[1]);
      end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
    }
    headers['Content-Length'] = end - start + 1;
    res.writeHead(status, headers);
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(file, { start, end }).pipe(res);
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 5197);
  createSiteServer({ production: process.env.SITE_ENV === 'production' }).listen(
    port,
    process.env.HOST || '127.0.0.1',
    () =>
      console.log(
        `AestheticEye: http://127.0.0.1:${port} (${process.env.SITE_ENV === 'production' ? 'production' : 'staging; noindex'})`,
      ),
  );
}
