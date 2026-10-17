import fs from 'node:fs';
let css=fs.readFileSync('src/ui/accessibility.css','utf8');css=css.split('/* Reading-size preferences extend')[0];fs.writeFileSync('src/ui/accessibility.css',css);
let s=fs.readFileSync('src/navigation/Navigation.jsx','utf8');s=s.replace("import BrandMark from", "import MobileMenu from './MobileMenu.jsx';\nimport BrandMark from");
s=s.replace(/    const enlargedWidth[\s\S]*?    return \(\) => \{/, '    return () => {');s=s.replace("      enlargedWidth.removeEventListener('change', changed);\n      observer.disconnect();\n",'');
s=s.replace(/  const compactNavigation = \(\) =>[\s\S]*?;\n/,"  const compactNavigation = () => window.matchMedia('(max-width: 960px)').matches;\n");
s=s.replace('aria-controls={navId}',"aria-controls={`${navId}-mobile`}");s=s.replace('      {group && (','      {mobile && <MobileMenu id={`${navId}-mobile`} onNavigate={() => {setMobile(false);close();}} />}\n      {group && (');
fs.writeFileSync('src/navigation/Navigation.jsx',s);
