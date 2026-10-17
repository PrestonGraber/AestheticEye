import React from 'react';
import { expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TreatmentPreview, { treatmentCases } from '../src/pages/TreatmentPreview.jsx';
import pages from '../src/pages/page-index.json';

it('uses explicitly labeled ptosis and retraction cases', () => {
  for (const [path, label] of [['/ptosis-or-droopy-eyelids/', /ptosis/i], ['/eyelid-retraction-surgery/', /retraction/i]]) {
    const cases = treatmentCases(pages.find(p => p.path === path), pages);
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.every(p => label.test(p.images[0].alt))).toBe(true);
  }
});

it('keeps Sofwave originals intact and allows choosing another photograph', () => {
  const page = pages.find(p => p.path === '/sofwave/');
  const photos = page.images.filter(i => /before and after Sofwave/i.test(i.alt));
  render(<TreatmentPreview page={page} pages={pages} />);
  expect(screen.queryByRole('slider')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Show Sofwave photograph 2' }));
  expect(screen.getByRole('img').getAttribute('src')).toBe('/' + photos[1].src);
});

it('uses only lower-eyelid gallery cases and resets comparison when changing patient', () => {
  const page = pages.find(p => p.path === '/blepharoplasty-lower-eyelid-surgery/');
  const cases = treatmentCases(page, pages);
  expect(cases.length).toBe(3);
  expect(cases.every(p => p.crumbs.some(c => c.href === '#/gallery/lower-eyelid-blepharoplasty/'))).toBe(true);
  render(<TreatmentPreview page={page} pages={pages} />);
  fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } });
  fireEvent.click(screen.getByRole('button', { name: `Show patient ${cases[1].title}` }));
  expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('50% of the after photograph visible');
  expect(screen.getByRole('link', { name: new RegExp(`Patient ${cases[1].title} · Case details`) }).getAttribute('href')).toBe('#' + cases[1].path);
  fireEvent.click(screen.getByRole('button', { name: 'Original photo' }));
  expect(screen.queryByRole('slider')).toBeNull();
});

it('does not invent a gallery association for a treatment without a verified match', () => {
  const page = pages.find(p => p.path === '/stye-chalazion-drainage/');
  expect(treatmentCases(page, pages)).toEqual([]);
  render(<TreatmentPreview page={page} pages={pages} />);
  expect(screen.queryByRole('slider')).toBeNull();
  expect(screen.getByRole('link', { name: /Meet our surgeons/ })).toBeTruthy();
});
