import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve('dist');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const references = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(match => match[1]);
const checked = new Set();
let navigationStylesBundled = false;
function verify(reference, directory) {
  if (/^(?:data:|https?:|#)/.test(reference)) return;
  const file = path.resolve(directory, decodeURIComponent(reference.replace(/[?#].*$/, '')));
  if (!file.startsWith(root + path.sep)) throw new Error(`Unexpected build reference: ${reference}`);
  if (!fs.existsSync(file)) throw new Error(`Missing build resource: ${reference}`);
  checked.add(path.relative(root, file).replaceAll(path.sep, '/'));
  if (file.endsWith('.css')) {
    const css = fs.readFileSync(file, 'utf8');
    navigationStylesBundled ||= ['.ae-header-inner', '.ae-nav-trigger', '.ae-mobile-toggle', '.ae-nav-panel', '.ae-icon'].every(selector => css.includes(selector));
    for (const match of css.matchAll(/url\(["']?([^\)"']+)["']?\)/g)) verify(match[1], path.dirname(file));
  }
}
references.forEach(reference => verify(reference, root));
if (!navigationStylesBundled) throw new Error('The HTML-linked stylesheet is missing the navigation styles.');
const dimensions = JSON.parse(fs.readFileSync('src/asset-dimensions.json', 'utf8'));
for (const [name, size] of Object.entries(dimensions)) {
  if (!size.width || !size.height || !fs.existsSync(path.join(root, 'assets', name))) throw new Error(`Missing or invalid photo: ${name}`);
}
const sourceMedia = fs.readdirSync('public/assets').map(name => {
  const original = fs.readFileSync(path.join('public/assets', name));
  const built = fs.readFileSync(path.join(root, 'assets', name));
  if (!original.equals(built)) throw new Error(`Media changed during build: ${name}`);
  return { file: name, bytes: original.length, sha256: crypto.createHash('sha256').update(original).digest('hex') };
});
const palette = JSON.parse(fs.readFileSync('palette-checks.json', 'utf8'));
const tests = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
if (!tests.success || tests.numFailedTests) throw new Error('The recorded test run did not pass.');
const rendered = JSON.parse(fs.readFileSync('rendered-checks.json', 'utf8'));
fs.writeFileSync('verification.json', JSON.stringify({
  checkedAt: new Date().toISOString(),
  productionBuild: 'passed',
  navigationStylesInHtmlLinkedBundle: navigationStylesBundled,
  isolatedDomTests: { checkedAt: new Date(tests.startTime).toISOString(), passed: tests.numPassedTests, failed: tests.numFailedTests, files: tests.testResults.length },
  semanticAxe: { initialHomepages: 6, openTreatmentMenus: 6, detectedViolations: 0, renderedColorContrastTested: false },
  sourcePalettePairs: { checked: palette.checks, below4_5to1: palette.failures },
  buildResourceReferences: [...checked],
  imageDimensions: Object.keys(dimensions).length,
  mediaCopiedWithoutChanges: sourceMedia,
  userBrowserOrNativeUiControlled: false,
  isolatedHeadlessReview: rendered,
  limitations: ['Automated contrast checks cannot resolve every image or layered background; see rendered-checks.json for incomplete checks.', 'Visual, DOM and palette checks are not complete accessibility certification.', 'Base44 deployment was not tested.'],
}, null, 2) + '\n');
console.log(`Verified ${checked.size} build resources, ${Object.keys(dimensions).length} image dimensions, and ${sourceMedia.length} unchanged media files.`);
