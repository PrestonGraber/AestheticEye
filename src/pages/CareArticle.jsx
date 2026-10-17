import React, { useMemo } from 'react';
import { splitTreatmentContent } from './TreatmentArticle.jsx';

// Change typography, never the instructions themselves.
export function readingLabel(title) {
  if (title !== title.toUpperCase()) return title;
  return title.charAt(0) + title.slice(1).toLowerCase();
}

export function careLabel(title) {
  const labels = {
    'WHAT TO EXPECT': 'What to expect',
    'PRE-TREATMENT INSTRUCTIONS': 'Before your treatment',
    'DAY OF TREATMENT: POST-TREATMENT INSTRUCTIONS': 'On treatment day',
    'POST-TREATMENT SKIN CARE INSTRUCTIONS DAY 1': 'After treatment · Day 1',
    'POST-TREATMENT SKIN CARE INSTRUCTIONS DAY 2-7': 'After treatment · Days 2–7',
  };
  return labels[title] || readingLabel(title);
}

export default function CareArticle({ html }) {
  const { intro, sections } = useMemo(() => splitTreatmentContent(html), [html]);
  return (
    <article className="content-body source-content care-reader">
      <div className="care-introduction" dangerouslySetInnerHTML={{ __html: intro }} />
      {sections.map((section) => (
        <section className="care-section" id={section.id} key={section.id}>
          <h2>{readingLabel(section.title)}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.html }} />
        </section>
      ))}
    </article>
  );
}
