import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import QuietHero from '../src/sections/QuietHero.jsx';

it('provides a working pause and resume control for the decorative film', () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  const { container } = render(<QuietHero design="still" />);
  expect(play).toHaveBeenCalledOnce();
  fireEvent.play(container.querySelector('video'));
  fireEvent.click(screen.getByRole('button', { name: 'Pause background video' }));
  expect(pause).toHaveBeenCalledOnce();
  fireEvent.pause(container.querySelector('video'));
  fireEvent.click(screen.getByRole('button', { name: 'Play background video' }));
  expect(play).toHaveBeenCalledTimes(2);
});

it('keeps the poster still when reduced motion is requested', () => {
  const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  render(<QuietHero design="still" />);
  expect(play).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Play background video' })).toBeTruthy();
});
