import React from 'react';
import { it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessibilityControls from '../src/ui/AccessibilityControls.jsx';
beforeEach(() => {
  localStorage.clear();
});
it('opens the reading dialog, saves preferences, and returns focus on close', () => {
  const { unmount } = render(<AccessibilityControls />);
  const trigger = screen.getByRole('button', { name: 'Accessibility and reading options' });
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog').hasAttribute('open')).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: 'Largest' }));
  fireEvent.click(screen.getByLabelText('Underline text links'));
  expect(document.documentElement.dataset.readingSize).toBe('2');
  expect(document.documentElement.dataset.readingLinks).toBe('true');
  fireEvent.click(screen.getByRole('button', { name: 'Close accessibility options' }));
  expect(document.activeElement).toBe(trigger);
  unmount();
  render(<AccessibilityControls />);
  expect(document.documentElement.dataset.readingSize).toBe('2');
  fireEvent.click(screen.getByRole('button', { name: 'Accessibility and reading options' }));
  fireEvent.click(screen.getByRole('button', { name: 'Reset preferences' }));
  expect(document.documentElement.dataset.readingSize).toBe('0');
  expect(document.documentElement.dataset.readingLinks).toBe('false');
});
