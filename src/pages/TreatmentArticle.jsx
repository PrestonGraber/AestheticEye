import React, { useMemo } from 'react';
import TreatmentPreview, { treatmentCases } from './TreatmentPreview.jsx';

export function splitIntroduction(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const first = doc.querySelector('p');
  const text = first?.textContent || '';
  const sentence = text.match(/^.*?[.!?](?=\s)/s)?.[0];
  if (text.length < 360 || !sentence || sentence.length > 340) return { lead: html, remainder: '' };
  const walker = doc.createTreeWalker(first, 4);
  let node; let offset = sentence.length;
  while ((node = walker.nextNode())) {
    if (offset <= node.textContent.length) break;
    offset -= node.textContent.length;
  }
  if (!node) return { lead: html, remainder: '' };
  const lead = doc.createRange(); lead.setStart(doc.body, 0); lead.setEnd(node, offset);
  const rest = doc.createRange(); rest.setStart(node, offset); rest.setEnd(doc.body, doc.body.childNodes.length);
  const serialize = range => { const div = doc.createElement('div'); div.append(range.cloneContents()); return div.innerHTML; };
  return { lead: serialize(lead), remainder: serialize(rest) };
}

// Ranges preserve nested source markup and all copy between the original headings.
export function splitTreatmentContent(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('a[href^="tel:"]').forEach(link => {
    const parent = link.parentElement;
    if (parent?.querySelector(':scope > a[href*="klara.com"]')) parent.classList.add('source-actions');
  });
  const headings = [...doc.body.querySelectorAll('h2[id]')];
  const serialize = (range) => {
    const div = doc.createElement('div');
    div.append(range.cloneContents());
    return div.innerHTML;
  };
  if (!headings.length) return { intro: html, sections: [] };
  const intro = doc.createRange();
  intro.setStart(doc.body, 0);
  intro.setEndBefore(headings[0]);
  const sections = headings.map((heading, i) => {
    const range = doc.createRange();
    range.setStartAfter(heading);
    if (headings[i + 1]) range.setEndBefore(headings[i + 1]);
    else range.setEnd(doc.body, doc.body.childNodes.length);
    return { id: heading.id, title: heading.textContent, html: serialize(range) };
  });
  return { intro: serialize(intro), sections };
}

export default function TreatmentArticle({ html, page, pages = [], leadInHero = false }) {
  const { intro, sections } = useMemo(() => splitTreatmentContent(html), [html]);
  const introduction = useMemo(() => splitIntroduction(intro), [intro]);
  const hasResults = page && (treatmentCases(page, pages).length > 0 || (page.path === '/sofwave/' && page.images.some(image => /before and after Sofwave/i.test(image.alt))));
  return <article className="content-body source-content treatment-reader editorial-treatment">
    {(!leadInHero || introduction.remainder) && <div className="treatment-intro">
      {!leadInHero && <div dangerouslySetInnerHTML={{__html:introduction.lead}} />}
      {introduction.remainder && <div dangerouslySetInnerHTML={{__html:introduction.remainder}} />}
    </div>}
    {sections.map((section, index) => <section className={`treatment-section is-open ${index === 0 && hasResults ? 'treatment-visual-section' : ''} ${/source-card/.test(section.html) ? 'treatment-benefits-section' : ''} ${/frequently asked|faq/i.test(section.title) ? 'treatment-faq-section' : ''} ${/<img\b/.test(section.html) ? 'treatment-photo-section' : ''}`} id={section.id} key={section.id}>
      {index === 0 && hasResults ? <>
        <div className="treatment-section-visual"><TreatmentPreview key={page.path} page={page} pages={pages} compact /></div>
        <div className="treatment-section-copy"><h2>{section.title}</h2><div id={`body-${section.id}`} className="treatment-section-body" dangerouslySetInnerHTML={{__html:section.html}} /></div>
      </> : <><h2>{section.title}</h2><div id={`body-${section.id}`} className="treatment-section-body" dangerouslySetInnerHTML={{__html:section.html}} /></>}
    </section>)}
  </article>;
}
