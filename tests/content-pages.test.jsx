import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentPage, { pages, pageFor } from '../src/pages/ContentPage.jsx';
import manifest from '../src/pages/source-manifest.json';
import { localLink } from '../src/pages/useLocalLinks.js';

it('ships every inventoried page and all downloaded media without missing files', () => {
  expect(pages.length).toBe(manifest.pages.length);
  expect(pages.length).toBeGreaterThan(260);
  expect(new Set(pages.map(p=>p.path)).size).toBe(pages.length);
  expect(manifest.failures).toEqual([]);
  expect(manifest.sourceFailures).toEqual([]);
  for(const page of pages) {
    expect(pageFor(page.path)).toBe(page);
    const content=JSON.parse(fs.readFileSync(path.resolve('public/content',page.contentFile),'utf8'));
    expect(content.html.trim().length).toBeGreaterThan(0);
    const template=document.createElement('template');template.innerHTML=content.html;
    expect(template.content.querySelector('script,style,object,embed,form')).toBeNull();
    for(const item of template.content.querySelectorAll('dt,dd'))expect(item.parentElement.tagName).toBe('DL');
    for(const node of template.content.querySelectorAll('*')) {
      expect([...node.attributes].some(a=>a.name.startsWith('on'))).toBe(false);
    }
    for(const image of template.content.querySelectorAll('img')) {
      expect(image.getAttribute('src')).toMatch(/^media\//);
      expect(fs.existsSync(path.resolve('public',image.getAttribute('src')))).toBe(true);
    }
    for(const link of template.content.querySelectorAll('a[href^="#/"]')) {
      const route=link.getAttribute('href').slice(1).split('?')[0];
      expect(route==='/'||pages.some(p=>p.path===route)).toBe(true);
    }
  }
  for(const item of manifest.media) expect(fs.statSync(path.resolve('public/media',item.file)).size).toBeGreaterThan(0);
});

it('keeps original FAQ questions and answers accessible without WordPress scripts', async()=>{
  const page=pageFor('ptosis-or-droopy-eyelids');
  const content=JSON.parse(fs.readFileSync(path.resolve('public/content',page.contentFile),'utf8'));
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>content}));
  try {
    render(<ContentPage page={page}/>);
    expect(await screen.findByText('How Do I Know If I Need Ptosis Repair Surgery?')).toBeTruthy();
    expect(document.querySelectorAll('details').length).toBeGreaterThan(0);
    expect(document.querySelector('.ae-brand').getAttribute('href')).toBe('#/');
  }finally{vi.unstubAllGlobals();}
});

it('filters the complete patient gallery and keeps external services external',()=>{
  vi.stubGlobal('fetch',vi.fn().mockReturnValue(new Promise(()=>{})));
  try {
    render(<ContentPage page={pageFor('gallery')}/>);
    const before=document.querySelectorAll('.page-card').length;
    expect(before).toBe(12);
    fireEvent.click(screen.getByRole('button',{name:/Show more cases/}));
    expect(document.querySelectorAll('.page-card').length).toBe(24);
    fireEvent.change(screen.getByRole('searchbox'),{target:{value:'Skin Cancer'}});
    expect(document.querySelectorAll('.page-card').length).toBeLessThan(before);
    expect(document.querySelectorAll('.page-card').length).toBeGreaterThan(0);
    expect(localLink('https://www.aestheticeyemd.com/ptosis-or-droopy-eyelids/')).toBe('#/ptosis-or-droopy-eyelids/');
    expect(localLink('https://l.klara.com/G3yV4TBdY4dUMwAk')).toBe('https://l.klara.com/G3yV4TBdY4dUMwAk');
  }finally{vi.unstubAllGlobals();}
});
