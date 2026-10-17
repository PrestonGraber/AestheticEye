import React from 'react';
import { BookLink, Photo } from '../ui/Primitives.jsx';
import { DOCTORS } from '../content.js';
export function RelatedCare({ page, pages }) {
  const parent = page.crumbs.filter((c) => c.title !== 'Home').at(-1);
  if (!parent) return null;
  const words = new Set(
    page.title
      .toLowerCase()
      .replace(/[^a-z ]/g, ' ')
      .split(/\s+/)
      .map((w) => w.replace(/s$/, ''))
      .filter((w) => w.length > 3 && !['surgery', 'treatment'].includes(w)),
  );
  const score = (p) =>
    p.title
      .toLowerCase()
      .split(/\s+/)
      .reduce((n, w) => n + Number(words.has(w.replace(/s$/, ''))), 0);
  const siblings = pages
    .filter(
      (p) =>
        p.path !== page.path &&
        p.category === 'AestheticEye' &&
        p.crumbs.some((c) => c.href === parent.href),
    )
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
  if (!siblings.length) return null;
  return (
    <section className="related-care" aria-labelledby="related-care-title">
      <div className="related-care-heading">
        <h2 id="related-care-title">Explore related treatments</h2>
        <a href={parent.href}>
          View all <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="related-care-links">
        {siblings.map((p) => (
          <a key={p.path} href={'#' + p.path}>
            <span>{p.title}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}
export function ConsultationInvitation() {
  return (
    <section className="consultation-invitation">
      <div className="consultation-portrait">
        <Photo name={DOCTORS} alt="Dr. Jonathan Pargament and Dr. Ginger Henson" />
        <p>Dr. Jonathan Pargament & Dr. Ginger Henson</p>
      </div>
      <div className="consultation-copy">
        <p className="consultation-location">Cincinnati & Dayton</p>
        <h2>Schedule Your Consultation Today</h2>
        <p>Your Eyes Deserve Excellence</p>
        <div className="consultation-actions">
          <BookLink />
          <a href="tel:9379079009">Call (937) 907-9009</a>
        </div>
        <div className="consultation-resources">
          <a href="#/your-first-visit/">Your first visit</a>
          <a href="#/payment-plans/">Payment options</a>
        </div>
      </div>
    </section>
  );
}
