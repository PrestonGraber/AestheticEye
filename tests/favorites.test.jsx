import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Collection, { readFavorites } from '../src/Collection.jsx';
import { feedbackText } from '../src/FavoriteFeedback.jsx';
import { designs } from '../src/designs.js';

beforeEach(() => localStorage.clear());
it('orders all eight directions and defaults Clarity to a favorite', () => {
  expect(designs.map((d) => d.n)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
  expect(readFavorites()).toEqual(['clarity']);
  localStorage.setItem('aestheticeye-design-shortlist-v1', JSON.stringify(['still', 'invalid']));
  expect(readFavorites()).toEqual(['clarity', 'still']);
  localStorage.setItem('aestheticeye-design-favorites-v1', '[]');
  expect(readFavorites()).toEqual([]);
});
it('saves notes and synchronizes quick picks with card favorites', () => {
  render(<Collection />);
  fireEvent.change(screen.getByLabelText('01 — Clarity'), {
    target: { value: 'Love the navigation.' },
  });
  fireEvent.click(screen.getByRole('checkbox', { name: '03 Still' }));
  expect(
    screen
      .getByRole('button', { name: 'Remove Still from favorites' })
      .getAttribute('aria-pressed'),
  ).toBe('true');
  expect(JSON.parse(localStorage.getItem('aestheticeye-design-feedback-v1')).likes.clarity).toBe(
    'Love the navigation.',
  );
  fireEvent.click(screen.getByRole('checkbox', { name: '01 Clarity' }));
  fireEvent.click(screen.getByRole('checkbox', { name: '03 Still' }));
  expect(screen.getByRole('button', { name: /Submit feedback via email/ }).disabled).toBe(true);
});
it('includes selected designs and user text in the copyable email without claiming delivery', async () => {
  const writeText = vi.fn().mockResolvedValue();
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  render(<Collection />);
  fireEvent.change(screen.getByLabelText('01 — Clarity'), {
    target: { value: 'Spacing & colors' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Copy feedback' }));
  expect(await screen.findByText(/Feedback copied. Paste it into an email/)).toBeTruthy();
  expect(writeText.mock.calls[0][0]).toContain('01 — Clarity\nWhat I like: Spacing & colors');
  expect(
    feedbackText(['still'], {
      name: 'Client',
      likes: { clarity: 'omit me', still: 'Film' },
      notes: 'Keep it simple.',
    }),
  ).not.toContain('omit me');
});
