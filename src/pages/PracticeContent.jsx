import React, { useMemo } from 'react';
import { splitTreatmentContent } from './TreatmentArticle.jsx';

export function preparePracticeContent(html, contact = false) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  if (contact) {
    const locations = doc.querySelector('.source-feature')?.parentElement;
    locations?.classList.add('practice-locations');
    doc.querySelectorAll('.source-feature iframe').forEach(frame => {
      const details = doc.createElement('details');
      const summary = doc.createElement('summary');
      summary.textContent = 'View map';
      frame.before(details); details.append(summary, frame);
    });
  } else {
    doc.querySelectorAll('a[href*="klara.com"]').forEach(link => {
      if (link.parentElement.querySelector('a[href^="tel:"]')) link.parentElement.remove();
    });
    const first = doc.querySelector('h4');
    if (first) {
      const details = doc.createElement('details');
      details.className = 'practice-publications';
      const summary = doc.createElement('summary');
      summary.textContent = 'Publications & presentations';
      first.before(details); details.append(summary);
      while (details.nextSibling) details.append(details.nextSibling);
    }
  }
  return doc.body.innerHTML;
}
export default function PracticeContent({ html, contact = false }) {
  const prepared = useMemo(() => preparePracticeContent(html, contact), [html, contact]);
  const content = useMemo(() => splitTreatmentContent(prepared), [prepared]);
  return <article className={`content-body source-content practice-reader ${contact ? 'contact-reader' : 'about-reader'}`}>
    {content.intro.trim() && <div className="practice-intro" dangerouslySetInnerHTML={{__html:content.intro}} />}
    {content.sections.map(section => <section className="practice-section" id={section.id} key={section.id}>
      <h2>{section.title}</h2><div className="practice-section-body" dangerouslySetInnerHTML={{__html:section.html}} />
    </section>)}
  </article>;
}
