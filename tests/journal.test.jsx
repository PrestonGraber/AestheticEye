import React from 'react';
import fs from 'node:fs';
import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContentPage, { pages, pageFor } from '../src/pages/ContentPage.jsx';
import { prepareJournal } from '../src/pages/JournalArticle.jsx';

it('preserves journal paragraphs, images, heading IDs and every destination', () => {
  const parse = html => new DOMParser().parseFromString(html, 'text/html');
  for (const page of pages.filter(p => p.category === 'Journal' && p.images.length)) {
    const { html } = JSON.parse(fs.readFileSync('public/content/' + page.contentFile, 'utf8'));
    const before = parse(html), after = parse(prepareJournal(html));
    for (const [selector, attr] of [['a', 'href'], ['img', 'src'], ['h2', 'id']]) {
      expect([...after.querySelectorAll(selector)].map(n => n.getAttribute(attr)), page.path)
        .toEqual([...before.querySelectorAll(selector)].map(n => n.getAttribute(attr)));
    }
    expect([...after.querySelectorAll('p')].map(n => n.textContent), page.path)
      .toEqual([...before.querySelectorAll('p')].map(n => n.textContent));
    for (const a of after.querySelectorAll('a[aria-label^="Share on"]')) expect(a.textContent.trim()).not.toBe('');
  }
});

it('searches older journal articles from the first archive page', () => {
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));
  try {
    render(<ContentPage page={pageFor('blog')} />);
    expect(document.querySelectorAll('.page-card').length).toBe(9);
    expect(screen.queryByRole('heading', { name: 'Tired of Tearing Up?' })).toBeNull();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Tired of Tearing Up' } });
    expect(screen.getByRole('heading', { name: 'Tired of Tearing Up?' })).toBeTruthy();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(document.querySelectorAll('.page-card').length).toBe(9);
  } finally { vi.unstubAllGlobals(); }
});
