import React from 'react';
import { beforeEach, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App.jsx';

beforeEach(() => window.history.replaceState(null, '', '/#/'));

it('opens Clarity as the public homepage without concept review controls', () => {
  const { container } = render(<App />);
  expect(container.querySelector('.site.clarity.client-view')).not.toBeNull();
  expect(screen.queryByText('All designs')).toBeNull();
  expect(container.querySelector('.design-collection')).toBeNull();
});

it('keeps the collection and concept previews available on separate routes', () => {
  window.history.replaceState(null, '', '/#/designs');
  const { container } = render(<App />);
  expect(container.querySelector('.design-collection')).not.toBeNull();
  window.history.replaceState(null, '', '/#/serene');
  fireEvent(window, new HashChangeEvent('hashchange'));
  expect(container.querySelector('.site.serene.with-review-tools')).not.toBeNull();
  expect(screen.getByText('All designs').getAttribute('href')).toBe('#/designs');
  window.history.replaceState(null, '', '/#/');
  fireEvent(window, new HashChangeEvent('hashchange'));
  expect(container.querySelector('.site.clarity.client-view')).not.toBeNull();
});
