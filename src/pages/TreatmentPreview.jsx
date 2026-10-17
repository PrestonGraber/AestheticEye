import React, { useState } from 'react';
import ComparisonViewer from './ComparisonViewer.jsx';
import { Photo } from '../ui/Primitives.jsx';
import { DOCTORS } from '../content.js';

// Explicit source categories prevent matching unrelated procedures by similar words.
const galleries = {
  '/blepharoplasty-lower-eyelid-surgery/': '/gallery/lower-eyelid-blepharoplasty/',
  '/lower-eyelid-bags/': '/gallery/lower-eyelid-blepharoplasty/',
  '/blepharoplasty-upper-eyelid-surgery/': '/gallery/upper-eyelid-surgery/',
  '/brow-lift-forehead-lift/': '/gallery/brow-lift-surgery/',
  '/reconstructive-surgery-after-eyelid-skin-cancer/': '/gallery/skin-cancer-reconstructions/',
  '/cosmetic-eyelid-surgery/': '/gallery/upper-eyelid-surgery/',
};
// Source captions identify these procedures; broad category aliases do not.
const specificCases = {
  '/ptosis-or-droopy-eyelids/': ['55', '56', '57'],
  '/eyelid-retraction-surgery/': ['69'],
};
export function treatmentCases(page, pages) {
  if (specificCases[page.path]) return specificCases[page.path]
    .map(id => pages.find(p => p.path === `/gallery/patient/${id}/`))
    .filter(p => p?.images.length);
  const gallery = galleries[page.path];
  if (!gallery) return [];
  return pages.filter(p => p.path.startsWith('/gallery/patient/') && p.images.length &&
    p.crumbs.some(c => c.href === '#' + gallery)).slice(0, 3);
}
export default function TreatmentPreview({ page, pages, compact = false }) {
  const cases = treatmentCases(page, pages);
  const [index, setIndex] = useState(0);
  const selected = cases[index] || cases[0];
  const originalResults = page.path === '/sofwave/'
    ? page.images.filter(image => /before and after Sofwave/i.test(image.alt)).slice(0, 3) : [];
  if (originalResults.length) return (
    <section className="treatment-results-preview treatment-original-results" aria-label="Sofwave treatment results">
      <div className="treatment-results-heading"><span>Sofwave · Before & after</span></div>
      <img src={'/' + originalResults[index].src} alt={originalResults[index].alt} />
      <div className="treatment-case-navigation">
        <span>Original treatment photograph</span>
        <div role="group" aria-label="Choose a Sofwave photograph">
          {originalResults.map((image, i) => <button type="button" key={image.src} aria-label={`Show Sofwave photograph ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)}>{i + 1}</button>)}
        </div>
      </div>
      <p className="treatment-result-caption">Photographs from our Sofwave treatment page. Individual results vary.</p>
    </section>
  );
  if (!selected && compact) return null;
  if (!selected) return (
    <figure className="treatment-team-preview">
      <Photo name={DOCTORS} alt="Dr. Jonathan Pargament and Dr. Ginger Henson" />
      <figcaption>
        <span>Your AestheticEye specialists</span>
        <a href="#/about/">Meet our surgeons <span aria-hidden="true">↗</span></a>
      </figcaption>
    </figure>
  );
  return (
    <section className="treatment-results-preview" aria-label="Related treatment results">
      <div className="treatment-results-heading">
        <span>Before & after</span>
        <a href={'#' + (galleries[page.path] || '/gallery/')}>View gallery <span aria-hidden="true">↗</span></a>
      </div>
      <ComparisonViewer key={selected.path} image={selected.images[0]} title={`Patient ${selected.title}`} />
      {!compact && <div className="treatment-case-navigation">
        <a href={'#' + selected.path}>Patient {selected.title} · Case details <span aria-hidden="true">↗</span></a>
        <div role="group" aria-label="Choose a patient case">
          {cases.map((item, i) => <button key={item.path} type="button" aria-label={`Show patient ${item.title}`} aria-pressed={i === index} onClick={() => setIndex(i)}>{i + 1}</button>)}
        </div>
      </div>}
      <p className="treatment-result-caption">{selected.images[0].alt || selected.crumbs.at(-1)?.title}. Individual results vary.</p>
    </section>
  );
}
