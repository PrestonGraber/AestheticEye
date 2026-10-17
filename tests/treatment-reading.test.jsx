import React from 'react';
import fs from 'node:fs';
import { expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { pages, pageFor } from '../src/pages/ContentPage.jsx';
import ContentPage from '../src/pages/ContentPage.jsx';
import { splitTreatmentContent, splitIntroduction } from '../src/pages/TreatmentArticle.jsx';
import ComparisonViewer from '../src/pages/ComparisonViewer.jsx';

it('preserves every word and photograph when splitting nested treatment content',()=>{
  const parse=html=>new DOMParser().parseFromString(html,'text/html');
  for(const page of pages.filter(p=>p.category==='AestheticEye'&&p.headings.length>=3)){
    const {html}=JSON.parse(fs.readFileSync('public/content/'+page.contentFile,'utf8'));
    const result=splitTreatmentContent(html);
    const rebuilt=result.intro+result.sections.map(s=>`<h2>${s.title}</h2>${s.html}`).join('');
    expect(parse(rebuilt).body.textContent.replace(/\s/g,''),page.path).toBe(parse(html).body.textContent.replace(/\s/g,''));
    expect([...parse(rebuilt).images].map(i=>i.getAttribute('src')),page.path).toEqual([...parse(html).images].map(i=>i.getAttribute('src')));
  }
});

it('preserves all introduction text and links when offering a shorter first read', () => {
  const parse = html => new DOMParser().parseFromString(html, 'text/html');
  for (const page of pages.filter(p => p.category === 'AestheticEye' && p.headings.length >= 3)) {
    const { html } = JSON.parse(fs.readFileSync('public/content/' + page.contentFile, 'utf8'));
    const { intro } = splitTreatmentContent(html);
    const { lead, remainder } = splitIntroduction(intro);
    const before = parse(intro); const after = parse(lead + remainder);
    expect(after.body.textContent.replace(/\s/g, ''), page.path).toBe(before.body.textContent.replace(/\s/g, ''));
    expect([...after.querySelectorAll('a')].map(a => a.getAttribute('href')), page.path).toEqual([...before.querySelectorAll('a')].map(a => a.getAttribute('href')));
  }
});

it('shows treatment content as visible web sections without accordion controls',async()=>{
  const page=pageFor('anophthalmos-loss-of-an-eye');
  const data=JSON.parse(fs.readFileSync('public/content/'+page.contentFile,'utf8'));
  render(<ContentPage page={page} initialHtml={data.html}/>);
  expect(await screen.findByRole('heading',{name:/What Causes the Loss of an Eye/})).toBeTruthy();
  expect(document.querySelectorAll('.treatment-section').length).toBe(page.headings.length);
  expect(document.querySelectorAll('.treatment-section-body[hidden]').length).toBe(0);
  expect(screen.queryByRole('button',{name:'Read full page'})).toBeNull();
});
it('compares photos with a labeled range and offers the intact original',()=>{
  render(<ComparisonViewer title="Patient 01" image={{src:'media/pair.jpg',alt:'Original pair'}}/>);
  const slider=screen.getByRole('slider',{name:'Compare before and after Patient 01'});
  fireEvent.change(slider,{target:{value:'80'}});
  expect(slider.getAttribute('aria-valuetext')).toBe('80% of the after photograph visible');
  expect(document.querySelector('.case-wipe').style.getPropertyValue('--reveal')).toBe('80%');
  fireEvent.click(screen.getByRole('button',{name:'Original photo'}));
  expect(screen.getByAltText('Original pair').getAttribute('src')).toBe('/media/pair.jpg');
  expect(screen.queryByRole('slider')).toBeNull();
});

