import fs from 'node:fs';
import {JSDOM} from 'jsdom';
const pages=JSON.parse(fs.readFileSync('src/pages/source-pages.json'));
const ids=new Map(pages.map(p=>[p.path,new Set([...new JSDOM(p.html).window.document.querySelectorAll('[id]')].map(e=>e.id))]));
const bad=[];
for(const page of pages){
 const d=new JSDOM(page.html).window.document;
 for(const a of d.querySelectorAll('a[href]')){
  const href=a.getAttribute('href');if(!href.includes('?section='))continue;
  const [route,q]=href.slice(1).split('?');const id=new URLSearchParams(q).get('section');
  if(!ids.get(route)?.has(id))bad.push({page:page.path,href,text:a.textContent.trim()});
 }
}
console.log(JSON.stringify(bad,null,2));
