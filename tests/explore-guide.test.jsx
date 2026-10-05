import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import axe from 'axe-core';
import ExploreGuide from '../src/sections/ExploreGuide.jsx';
import original from '../src/original.json';

describe('optional browsing guide', () => {
  it.each([
    ['Cosmetic treatments', 1],
    ['Reconstructive care', 2],
    ['Non-surgical treatments', 4],
    ['I’m just exploring', 0],
  ])('routes %s to the selected original information page', (name, source) => {
    render(<ExploreGuide design="clarity" />);
    expect(screen.queryByRole('dialog')).toBeNull();
    const trigger = screen.getByRole('button', { name: 'Explore with a short guide' });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Continue' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('button', { name: 'See my starting point' }).disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Choose a topic'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: 'See my starting point' }));
    expect(
      screen.getByRole('link', { name: original.nav[source].links[0].label }).getAttribute('href'),
    ).toBe(original.nav[source].links[0].href);
    fireEvent.click(screen.getByRole('button', { name: 'Change my answers' }));
    expect(screen.getByRole('radio', { name }).checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Close browsing guide' }));
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).not.toBe('hidden');
  });
  it('exposes a labelled form with no detected semantic accessibility violations', async () => {
    render(<ExploreGuide design="modern" />);
    fireEvent.click(screen.getByRole('button', { name: 'Explore with a short guide' }));
    const report = await axe.run(screen.getByRole('dialog'), {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(report.violations).toEqual([]);
  });
});
