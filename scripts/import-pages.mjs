import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
const sourceDir = path.resolve('../work/source-site');
const inventory = JSON.parse(fs.readFileSync(path.join(sourceDir, 'inventory.json')));
const mediaDir = path.resolve('public/media');
fs.mkdirSync(mediaDir, { recursive: true });
fs.mkdirSync('src/pages', { recursive: true });
const media = new Map();
const origin = 'https://www.aestheticeyemd.com';
const paths = new Set(inventory.pages.map(p => p.path));
const normalize = value => value.replace(/\/?$/, '/');
function localHref(value, base) {
  try {
    const u = new URL(value, base);
    if (!['http:', 'https:', 'mailto:', 'tel:', 'sms:'].includes(u.protocol)) return '#';
    if (/^(www\.)?aestheticeyemd\.com$/.test(u.hostname) && paths.has(normalize(u.pathname))) return '#/' + normalize(u.pathname).replace(/^\//, '') + (u.hash ? `?section=${encodeURIComponent(u.hash.slice(1))}` : '');
    return u.href;
  } catch { return '#'; }
}
function imagePath(value, base) {
  if (!value || value.startsWith('data:')) return '';
  try {
    const url = new URL(value, base);
    if (!/^https?:$/.test(url.protocol)) return '';
    const ext = path.extname(url.pathname).toLowerCase();
    if (!['.jpg','.jpeg','.png','.webp','.gif','.svg','.pdf'].includes(ext)) return url.href;
    const name = crypto.createHash('sha256').update(url.href).digest('hex').slice(0,12) + '-' + path.basename(url.pathname).replace(/[^a-zA-Z0-9._-]/g, '-');
    media.set(url.href, name);
    return 'media/' + name;
  } catch { return ''; }
}
const imageSource = node => node.getAttribute('data-src-desktop-2x') || node.getAttribute('data-src-desktop-1x') || node.getAttribute('data-src-mobile-2x') || node.getAttribute('data-src') || node.getAttribute('src');
const pages = [];
for (const record of inventory.pages) {
  if (record.path === '/') continue;
  const dom = new JSDOM(fs.readFileSync(path.join(sourceDir,record.file), 'utf8'));
  const doc = dom.window.document;
  const main = doc.querySelector('#content') || doc.querySelector('main') || doc.body;
  const crumbs = [...doc.querySelectorAll('nav[aria-label="breadcrumb"] a')].map(a=>({title:a.textContent.trim(),href:localHref(a.getAttribute('href'),record.url)}));
  const description = doc.querySelector('meta[name="description"]')?.content || '';
  const date = main.querySelector('time')?.getAttribute('datetime') || '';
  if(record.path==='/oculoplastics-consultation/') {
    const styles=[...doc.querySelectorAll('style')].map(s=>s.textContent).join('\n');
    const added=new Set();
    for(const rule of styles.matchAll(/(#lp-pom-(?:block|box)-\d+)\s*\{([^}]+)\}/g)) {
      const match=rule[2].match(/url\(["']?([^\s)"']+)["']?\)/);
      const target=main.querySelector(rule[1]);
      if(!match||!target||added.has(rule[1])||!/(woman|doctors|waitingroom)/i.test(match[1]))continue;
      const img=doc.createElement('img');img.src=new URL(match[1],record.url).href;img.alt=match[1].includes('doctors')?'AestheticEye surgeons':match[1].includes('waitingroom')?'AestheticEye practice':'Portrait from AestheticEye';target.prepend(img);added.add(rule[1]);
    }
  }
  // Cloudflare email obfuscation must not depend on the retired WordPress host.
  for (const a of main.querySelectorAll('a[href*="/cdn-cgi/l/email-protection"]')) {
    const encoded=a.getAttribute('href').split('#')[1] || a.querySelector('[data-cfemail]')?.getAttribute('data-cfemail');
    if(encoded && /^[a-f0-9]+$/i.test(encoded)) { const key=parseInt(encoded.slice(0,2),16);const email=encoded.slice(2).match(/../g).map(pair=>String.fromCharCode(parseInt(pair,16)^key)).join('');a.href='mailto:'+email;a.textContent=email; }
  }
  const imageNodes = [...main.querySelectorAll('img')];
  const images = imageNodes.map(i=>({src:imagePath(imageSource(i),record.url),alt:i.alt || '',width:Number(i.getAttribute('width'))||null,height:Number(i.getAttribute('height'))||null})).filter(i=>i.src);
  const category = record.path.includes('/gallery/') ? 'Results' : record.path.startsWith('/blog/') ? 'Journal' : record.path.startsWith('/meet-the-team') ? 'Our team' : /instructions|resources|operative|recovery|your-first|payment|policy|providers/.test(record.path) ? 'Patient resources' : /contact/.test(record.path) ? 'Visit us' : /special|bundle|season/.test(record.path) ? 'Specials' : 'AestheticEye';
  if (record.path === '/payment-plans/') {
    main.innerHTML = '<h2>Payment Options with Cherry</h2><p>Questions about payment options? <a href="tel:9379079009">Call (937) 907-9009</a>.</p>';
  }
  main.querySelectorAll('script,style,link,meta,object,embed,noscript,nav[aria-label="breadcrumb"],.header-image,.sharedaddy,.social-share,.post-navigation').forEach(e=>e.remove());
  for (const button of main.querySelectorAll('button[data-target]')) {
    const answer = doc.getElementById((button.getAttribute('data-target') || '').replace(/^#/, ''));
    if (!answer || !main.contains(answer)) continue;
    const details=doc.createElement('details');
    const summary=doc.createElement('summary');summary.textContent=button.textContent.trim();
    details.append(summary,answer);button.replaceWith(details);
  }
  // Retain source copy and semantic structure, never source scripts or layout styling.
  for (const node of [...main.querySelectorAll('*')]) {
    const tag = node.tagName.toLowerCase();
    if (['input','textarea','select','button','form'].includes(tag)) {
      if(tag === 'form') { const frame=doc.createElement('iframe');frame.src='https://api.leadconnectorhq.com/widget/form/zrbsgRHnE2gIYj6TzOuF';frame.title='Contact AestheticEye to request a consultation';frame.id='inline-zrbsgRHnE2gIYj6TzOuF';frame.className='source-survey';frame.setAttribute('data-form-id','zrbsgRHnE2gIYj6TzOuF');frame.setAttribute('data-layout-iframe-id',frame.id);frame.setAttribute('data-height','942');node.replaceWith(frame); }
      else node.remove();
      continue;
    }
    if(tag === 'iframe') {
      const src=node.getAttribute('src')||'';
      const title=node.getAttribute('title');
      if (!/^https:\/\/(www\.youtube\.com|www\.youtube-nocookie\.com|www\.canva\.com|www\.google\.com|api\.leadconnectorhq\.com)\//.test(src)) { node.remove();continue; }
      const embedAttributes=[...node.attributes].filter(a=>a.name==='id'||a.name.startsWith('data-')).map(a=>[a.name,a.value]);
      for(const a of [...node.attributes]) node.removeAttribute(a.name);
      if(src.includes('leadconnectorhq'))for(const [key,value] of embedAttributes)node.setAttribute(key,value);
      node.setAttribute('src',src);node.setAttribute('title',title|| (src.includes('survey')?'Blepharoplasty questionnaire':src.includes('maps')?'Practice location map':src.includes('leadconnectorhq')?'Contact AestheticEye':'AestheticEye video'));node.setAttribute('loading','lazy');node.setAttribute('allowfullscreen','');
      node.setAttribute('class',src.includes('leadconnectorhq')?'source-survey':'source-embed');
      continue;
    }
    const oldClass=node.className||'';
    const keep={};
    if(node.hasAttribute('data-source-service'))keep['data-source-service']='true';
    if(node.getAttribute('aria-label'))keep['aria-label']=node.getAttribute('aria-label');
    if(tag==='table'){keep.tabindex='0';keep['aria-label']='Patient instructions table';}
    if(node.id) keep.id=node.id;
    if(tag==='a') {keep.href=node.hasAttribute('data-source-service')?node.getAttribute('href'):localHref(node.getAttribute('href')||'',record.url);if(/\.(pdf|jpg|jpeg|png|webp)(\?|$)/i.test(keep.href))keep.href=imagePath(keep.href,record.url);}
    if(tag==='img') {
      keep.src=imagePath(imageSource(node),record.url);keep.alt=node.alt||'';keep.loading='lazy';keep.decoding='async';
      if(node.getAttribute('width'))keep.width=node.getAttribute('width');if(node.getAttribute('height'))keep.height=node.getAttribute('height');
    }
    if(tag==='time'&&node.getAttribute('datetime'))keep.datetime=node.getAttribute('datetime');
    if(['td','th'].includes(tag))for(const a of ['colspan','rowspan','scope'])if(node.getAttribute(a))keep[a]=node.getAttribute(a);
    if(/btn-container/.test(oldClass))keep.class='source-actions';
    else if(/sr-only/.test(oldClass))keep.class='sr-only';
    else if(/column-content-block/.test(oldClass))keep.class='source-columns';
    else if(/column-content$/.test(oldClass))keep.class='source-card';
    else if(/flc-gallery|row-gutter-5|latest-posts--blog-page/.test(oldClass))keep.class='source-grid';
    else if(/type-team|latest-posts-single-content|flc-multiple-locations__single/.test(oldClass))keep.class='source-feature';
    for(const a of [...node.attributes])node.removeAttribute(a.name);
    for(const [key,value] of Object.entries(keep))node.setAttribute(key,value);
    if(['h1'].includes(tag)){const h=doc.createElement('h2');h.innerHTML=node.innerHTML;node.replaceWith(h);}
  }
  // Remove comment nodes and empty decorative elements.
  const walker=doc.createTreeWalker(main,128);const comments=[];while(walker.nextNode())comments.push(walker.currentNode);comments.forEach(n=>n.remove());
  main.querySelectorAll('i,svg,canvas').forEach(n=>n.remove());
  for(const list of main.querySelectorAll('dl'))if(list.querySelector('details')){const div=doc.createElement('div');div.append(...list.childNodes);if(list.id)div.id=list.id;list.replaceWith(div);}
  for(const item of main.querySelectorAll('dt,dd'))if(!item.parentElement.matches('dl')){const div=doc.createElement('div');div.append(...item.childNodes);if(item.id)div.id=item.id;item.replaceWith(div);}
  for(const a of main.querySelectorAll('a'))if(!a.textContent.trim()&&!a.getAttribute('aria-label')&&!a.querySelector('img[alt]:not([alt=""])')) {
    if(!a.querySelector('img')){a.remove();continue;}
    a.setAttribute('aria-label',a.getAttribute('href')?.startsWith('tel:')?'Call '+a.getAttribute('href').slice(4):'View image');
  }
  const headings=[...main.querySelectorAll('h2')].filter(h=>h.textContent.trim()).map((h,index)=>{h.id ||= `section-${index+1}`;return {title:h.textContent.trim(),id:h.id};});
  const text=main.textContent.replace(/\s+/g,' ').trim();
  pages.push({...record, category, description,date,crumbs,images,headings,html:main.innerHTML,textLength:text.length});
  dom.window.close();
}
const failures=[];
const pending=[...media.entries()];
while(pending.length){
  await Promise.all(pending.splice(0,5).map(async([url,name])=>{
    const file=path.join(mediaDir,name);if(fs.existsSync(file)&&fs.statSync(file).size)return;
    for(let attempt=0;attempt<3;attempt++)try{
      const response=await fetch(url,{signal:AbortSignal.timeout(40000)});if(!response.ok)throw new Error(`HTTP ${response.status}`);
      fs.writeFileSync(file,Buffer.from(await response.arrayBuffer()));return;
    }catch(error){if(attempt===2)failures.push({url,error:String(error)});}
  }));
  console.log(`${pending.length} media remaining`);
}
fs.writeFileSync('src/pages/source-pages.json',JSON.stringify(pages,null,2));
fs.mkdirSync('public/content',{recursive:true});
const index=pages.map(page=>{
  const file=crypto.createHash('sha256').update(page.path).digest('hex').slice(0,12)+'.json';
  fs.writeFileSync('public/content/'+file,JSON.stringify({html:page.html}));
  const {html,textLength,file:sourceFile,...metadata}=page;
  return {...metadata,contentFile:file};
});
fs.writeFileSync('src/pages/page-index.json',JSON.stringify(index));
fs.writeFileSync('src/pages/page-routes.json',JSON.stringify(pages.map(({path,title})=>({path,title}))));
fs.writeFileSync('src/pages/source-manifest.json',JSON.stringify({capturedAt:new Date().toISOString(),pages:pages.map(({path,title,category,textLength})=>({path,title,category,textLength})),media:[...media].map(([url,file])=>({url,file})),failures,sourceFailures:inventory.failures},null,2));
console.log(`Imported ${pages.length} pages and ${media.size} media files; ${failures.length} media failures.`);
