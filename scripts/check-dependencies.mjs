import fs from 'node:fs';import {JSDOM} from 'jsdom';
const pages=JSON.parse(fs.readFileSync('src/pages/page-index.json'));const paths=new Set(['/',...pages.map(p=>p.path)]);const issues=[];const embeds=[];let downloads=0;
for(const p of pages){const d=new JSDOM(JSON.parse(fs.readFileSync('public/content/'+p.contentFile)).html).window.document;for(const a of d.querySelectorAll('a[href]')){const h=a.getAttribute('href');if(h.startsWith('media/'))downloads++;try{const u=new URL(h);if(/^(www\.)?aestheticeyemd\.com$/.test(u.hostname))issues.push({page:p.path,url:h,known:paths.has(u.pathname)});}catch{}}
for(const e of d.querySelectorAll('iframe'))embeds.push({page:p.path,src:e.src,id:e.id,title:e.title});d.defaultView.close();}
fs.writeFileSync('migration-dependencies.json',JSON.stringify({issues,embeds,downloads},null,2));console.log(JSON.stringify({issues,embeds:embeds.filter(e=>e.src.includes('leadconnector')||e.src.includes('canva')),downloads},null,2));
