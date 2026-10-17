import fs from 'node:fs';
const edit=(p,f)=>fs.writeFileSync(p,f(fs.readFileSync(p,'utf8')));
edit('src/Website.jsx',s=>s.replace("import Footer from", "import AccessibilityControls from './ui/AccessibilityControls.jsx';\nimport Footer from").replace(/      <a className="back-top"[\s\S]*?<\/a>/,'      <AccessibilityControls />'));
edit('src/pages/ContentPage.jsx',s=>s.replace("import Footer from", "import AccessibilityControls from '../ui/AccessibilityControls.jsx';\nimport Footer from").replace('      <Footer />','      <Footer />\n      <AccessibilityControls />'));
edit('src/ui/pageMotion.js',s=>s.replaceAll('preference.matches','(preference.matches || document.documentElement.dataset.readingMotion === \'true\')'));
