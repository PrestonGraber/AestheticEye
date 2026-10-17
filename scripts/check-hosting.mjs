import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createSiteServer } from './serve-site.mjs';
const server = createSiteServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const result = { pages: 0, redirects: 0, checks: [] };
try {
  const redirects = JSON.parse(fs.readFileSync('dist/redirects.json'));
  const pages = JSON.parse(fs.readFileSync('src/pages/page-index.json'));
  for (const p of [{ path: '/' }, ...pages]) {
    const r = await fetch(base + p.path, { redirect: 'manual' });
    assert.equal(r.status, redirects[p.path] ? 301 : 200, p.path);
    assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
    if (r.status === 200) {
      const h = await r.text();
      assert.match(h, /<h1[ >]/);
      assert.match(h, /rel="canonical"/);
    }
    result.pages++;
  }
  for (const [from, to] of Object.entries(redirects)) {
    const r = await fetch(base + from, { method: 'HEAD', redirect: 'manual' });
    assert.equal(r.status, 301, from);
    assert.equal(r.headers.get('location'), to);
    const dest = await fetch(base + to, { method: 'HEAD' });
    assert.equal(dest.status, 200, to);
    result.redirects++;
  }
  const missing = await fetch(base + '/this-page-does-not-exist/');
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Page not found/);
  result.checks.push('Real HTTP 404 for unknown paths');
  const slash = await fetch(base + '/contact?example=1', { redirect: 'manual' });
  assert.equal(slash.status, 301);
  assert.equal(slash.headers.get('location'), '/contact/?example=1');
  result.checks.push('Canonical trailing slash redirects preserve query parameters');
  const video = await fetch(base + '/assets/REAL-ESTATE-1.mp4', {
    headers: { Range: 'bytes=0-99' },
  });
  assert.equal(video.status, 206);
  assert.equal((await video.arrayBuffer()).byteLength, 100);
  result.checks.push('Video byte ranges work');
  const post = await fetch(base + '/fsg', { method: 'POST' });
  assert.equal(post.status, 405);
  result.checks.push('No fake successful form endpoint');
  fs.writeFileSync('hosting-verification.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
} finally {
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
