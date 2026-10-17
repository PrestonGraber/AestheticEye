import React from 'react';
import fs from 'node:fs';
import { expect, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import CareArticle from '../src/pages/CareArticle.jsx';
import pages from '../src/pages/page-index.json';

it('keeps all care instructions, links and images visible in the reading layout', () => {
  const normalize = text => text.replace(/\s/g, '').toLowerCase();
  for (const page of pages.filter(p => /(?:care-instructions|post-operative|pre-operative)/i.test(p.path) && p.headings.length)) {
    const { html } = JSON.parse(fs.readFileSync('public/content/' + page.contentFile, 'utf8'));
    const source = new DOMParser().parseFromString(html, 'text/html');
    const { container } = render(<CareArticle html={html} />);
    expect(normalize(container.textContent), page.path).toBe(normalize(source.body.textContent));
    for (const [selector, attr] of [['a', 'href'], ['img', 'src']]) {
      expect([...container.querySelectorAll(selector)].map(el => el.getAttribute(attr)), page.path)
        .toEqual([...source.querySelectorAll(selector)].map(el => el.getAttribute(attr)));
    }
    expect(container.querySelector('[hidden]'), page.path).toBeNull();
    cleanup();
  }
});
