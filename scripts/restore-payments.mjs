import fs from 'node:fs';
let s=fs.readFileSync('src/pages/ContentPage.jsx','utf8');s=s.replace("import ComparisonViewer from", "import PaymentPlans from './PaymentPlans.jsx';\nimport ComparisonViewer from");s=s.replace("            {isBlog || (isGallery && galleryCases.length) ? (","            {page.path === '/payment-plans/' ? <PaymentPlans /> : isBlog || (isGallery && galleryCases.length) ? (");fs.writeFileSync('src/pages/ContentPage.jsx',s);
const old='<h2>Payment Options with Cherry</h2><p><a data-source-service="true" href="https://www.aestheticeyemd.com/payment-plans/">Open Cherry payment options</a></p>';
const html='<h2>Payment Options with Cherry</h2><p>Questions about payment options? <a href="tel:9379079009">Call (937) 907-9009</a>.</p>';
let importer=fs.readFileSync('scripts/import-pages.mjs','utf8').replace(old,html);fs.writeFileSync('scripts/import-pages.mjs',importer);
const page=JSON.parse(fs.readFileSync('src/pages/page-index.json')).find(p=>p.path==='/payment-plans/');fs.writeFileSync('public/content/'+page.contentFile,JSON.stringify({html}));
