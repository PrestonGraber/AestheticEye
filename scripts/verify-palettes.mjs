import fs from 'node:fs';
import postcss from 'postcss';

const designs = ['clarity', 'form', 'perspective', 'editorial', 'serene', 'modern'];
const sections = [
  ['nav', 'src/navigation/navigation.css', '.ae-header'],
  ['procedure', 'src/sections/care.css', '.procedures-section'],
  ['gallery', 'src/sections/gallery.css', '.gallery-section'],
  ['review', 'src/sections/reviews.css', '.review-carousel'],
  ['contact', 'src/sections/contact.css', '.contact-section'],
];
function luminance(hex) {
  let value = hex.slice(1);
  if (value.length === 3)
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  const rgb = [0, 2, 4]
    .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function ratio(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
const results = [];
for (const [prefix, file, base] of sections) {
  const css = postcss.parse(fs.readFileSync(file, 'utf8'));
  for (const design of designs) {
    const tokens = {};
    css.walkRules((rule) => {
      if (rule.parent.type !== 'root' || rule.selector.includes('high-contrast')) return;
      const selectors = rule.selectors;
      const applies = selectors.some(
        (selector) =>
          selector === base ||
          (selector.includes(base) &&
            new RegExp(`\\[data-design=['"]?${design}['"]?\\]$`).test(selector)),
      );
      if (!applies) return;
      rule.walkDecls((decl) => {
        if (decl.prop.startsWith(`--${prefix}-`))
          tokens[decl.prop.slice(prefix.length + 3)] = decl.value;
      });
    });
    for (const key of ['ink', 'muted', 'soft']) {
      if (!tokens[key] || !tokens.paper) continue;
      const contrast = ratio(tokens[key], tokens.paper);
      results.push({
        section: prefix,
        design,
        text: key,
        foreground: tokens[key],
        background: tokens.paper,
        ratio: Number(contrast.toFixed(2)),
        passesNormalText: contrast >= 4.5,
      });
    }
  }
}
// These small surfaces override their section background, so check them directly.
for (const [label, foreground, background] of [
  ['Modernist category rail', '#4e6740', '#dce7c9'],
  ['Modernist location card', '#d2e3b6', '#173725'],
  ['Clarity location card', '#d3dfbf', '#294936'],
  ['Form location card', '#526d40', '#e4edd5'],
  ['Sanctuary location card', '#506b3f', '#f9fbf0'],
  ['Primary booking button', '#ffffff', '#294b35'],
  ['Dark header booking button', '#213d30', '#dce7c6'],
]) {
  const contrast = ratio(foreground, background);
  results.push({
    surface: label,
    foreground,
    background,
    ratio: Number(contrast.toFixed(2)),
    passesNormalText: contrast >= 4.5,
  });
}
const failed = results.filter((row) => !row.passesNormalText);
const report = {
  checkedAt: new Date().toISOString(),
  method:
    'WCAG relative-luminance formula applied to explicit source palette tokens. This is not rendered-browser contrast testing; text on images and state-specific CSS require visual review.',
  checks: results.length,
  failures: failed.length,
  results,
};
fs.writeFileSync('palette-checks.json', JSON.stringify(report, null, 2) + '\n');
console.log(`${results.length} source palette checks; ${failed.length} below 4.5:1.`);
if (failed.length) {
  console.log(JSON.stringify(failed, null, 2));
  process.exitCode = 1;
}
