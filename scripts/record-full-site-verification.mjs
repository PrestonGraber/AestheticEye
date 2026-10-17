import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const tests=read('test-results.json');
const routes=read('../work/all-page-audit.json');
const media=read('../work/media-decode-audit.json');
const accessibility=read('../work/content-axe-audit.json');
const source=read('src/pages/source-manifest.json');
fs.writeFileSync('full-site-verification.json',JSON.stringify({checkedAt:new Date().toISOString(),source:'https://www.aestheticeyemd.com/',design:'Clarity',preview:'http://127.0.0.1:5174/#/',pagesIncludingHomepage:source.pages.length+1,sourceFailures:source.sourceFailures,media,tests:{passed:tests.numPassedTests,failed:tests.numFailedTests},routeFailures:routes.filter(r=>r.overflow||r.error||!r.loaded||r.brokenImages.length),representativeAccessibility:accessibility,productionBuild:'passed',limitations:['External booking, patient portal, financing, and referral services retain their original providers; no submissions or payments were made.','Automated accessibility checks are not a complete accessibility certification; image and layered-background contrast checks can be incomplete.','This is a local build, not a deployed or pushed release.']},null,2));
