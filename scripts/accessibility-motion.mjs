import fs from 'node:fs';
for(const file of ['src/ui/Primitives.jsx','src/ui/usePointerDepth.js']){let s=fs.readFileSync(file,'utf8');s=s.replaceAll("window.matchMedia('(prefers-reduced-motion: reduce)').matches","(window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.readingMotion === 'true')");fs.writeFileSync(file,s);}
