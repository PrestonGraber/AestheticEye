import React from 'react';
import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';
import metadata from '../src/pages/seo-index.json';
import { applySeo } from '../src/pages/seo.js';
it('loads a treatment directly at its original URL with matching metadata', async () => {
  window.history.replaceState(null, '', '/ptosis-or-droopy-eyelids/');
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ html: '<p>Original treatment content</p>' }),
      }),
  );
  try {
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Ptosis or Droopy Eyelids' }),
    ).toBeTruthy();
    expect(document.title).toBe(metadata['/ptosis-or-droopy-eyelids/'].title);
    expect(document.head.querySelector('link[rel="canonical"]').href).toBe(
      'https://www.aestheticeyemd.com/ptosis-or-droopy-eyelids/',
    );
    expect(document.querySelector('.ae-brand').getAttribute('href')).toBe('/');
  } finally {
    vi.unstubAllGlobals();
    window.history.replaceState(null, '', '/');
  }
});
it('keeps review concepts out of the index and preserves legacy canonical targets', () => {
  applySeo('/', true);
  expect(document.querySelector('meta[name="robots"]').content).toContain('noindex');
  applySeo('/facial-fillers/');
  expect(document.querySelector('link[rel="canonical"]').href).toBe(
    'https://www.aestheticeyemd.com/non-surgical-treatments/',
  );
});
