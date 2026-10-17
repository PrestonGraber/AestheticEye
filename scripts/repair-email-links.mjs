import fs from 'node:fs';
let s=fs.readFileSync('scripts/import-pages.mjs','utf8');const marker='  const imageNodes = [...main.querySelectorAll(\'img\')];';s=s.replace(marker,`  // Cloudflare email obfuscation must not depend on the retired WordPress host.
  for (const a of main.querySelectorAll('a[href*="/cdn-cgi/l/email-protection"]')) {
    const encoded=a.getAttribute('href').split('#')[1] || a.querySelector('[data-cfemail]')?.getAttribute('data-cfemail');
    if(encoded && /^[a-f0-9]+$/i.test(encoded)) { const key=parseInt(encoded.slice(0,2),16);const email=encoded.slice(2).match(/../g).map(pair=>String.fromCharCode(parseInt(pair,16)^key)).join('');a.href='mailto:'+email;a.textContent=email; }
  }
`+marker);fs.writeFileSync('scripts/import-pages.mjs',s);
