import fs from 'node:fs';
const meta=JSON.parse(fs.readFileSync('src/pages/seo-index.json'));
const media=JSON.parse(fs.readFileSync('src/pages/source-manifest.json')).media;
const redirects={};
for(const [route,seo] of Object.entries(meta)){const target=new URL(seo.canonical).pathname;if(route!==target&&meta[target])redirects[route]=target;}
for(const item of media){const url=new URL(item.url);if(/^(www\.)?aestheticeyemd\.com$/.test(url.hostname))redirects[url.pathname]='/media/'+item.file;}
redirects['/wp-content/uploads/2024/10/favicon-192x192.jpg']='/assets/favicon-original.jpg';
fs.writeFileSync('public/redirects.json',JSON.stringify(redirects,null,2));
fs.writeFileSync('public/_redirects',Object.entries(redirects).map(([from,to])=>`${from} ${to} 301`).join('\n')+'\n');
const res=await fetch('https://www.aestheticeyemd.com/wp-content/uploads/2024/10/favicon-192x192.jpg');if(!res.ok)throw new Error('Favicon unavailable');fs.writeFileSync('public/assets/favicon-original.jpg',Buffer.from(await res.arrayBuffer()));
const index=fs.readFileSync('index.html','utf8').replace('<meta name="theme-color"','<link rel="icon" type="image/jpeg" href="/assets/favicon-original.jpg" />\n    <meta name="theme-color"');fs.writeFileSync('index.html',index);
console.log('Saved',Object.keys(redirects).length,'legacy redirects and the original favicon.');
