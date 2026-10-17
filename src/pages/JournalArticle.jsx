import React, { useMemo } from 'react';
import './journal.css';

export function prepareJournal(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const image = doc.querySelector('img');
  if (image) image.classList.add('journal-opening-photo');
  const date = doc.querySelector('time');
  if (date) date.parentElement.classList.add('journal-date');
  for (const paragraph of doc.querySelectorAll('p')) {
    if (/^Posted on behalf of/.test(paragraph.textContent.trim())) {
      paragraph.parentElement.classList.add('journal-practice-details');
    }
  }
  for (const link of doc.querySelectorAll('a[aria-label^="Share on"]')) {
    link.classList.add('journal-share-link');
    // Imported SVG icons were stripped: give the existing actions visible labels.
    if (!link.textContent.trim()) link.textContent = link.getAttribute('aria-label').replace('Share on ', '');
    link.parentElement.classList.add('journal-share');
  }
  return doc.body.innerHTML;
}

export default function JournalArticle({ html }) {
  const content = useMemo(() => prepareJournal(html), [html]);
  return <article className="content-body source-content journal-reader" dangerouslySetInnerHTML={{ __html: content }} />;
}
