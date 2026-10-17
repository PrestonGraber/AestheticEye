import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import axe from 'axe-core';
import ExploreGuide from '../src/sections/ExploreGuide.jsx';
import { guideAreas } from '../src/sections/exploreGuideModel.js';
import routes from '../src/pages/page-routes.json';

describe('optional browsing guide', () => {
  afterEach(() => window.history.replaceState({}, '', '/'));
  it.each(guideAreas.map((area) => [area.name, area]))('routes %s to the selected information page', (name, area) => {
    render(<ExploreGuide design="clarity" />);
    expect(screen.queryByRole('dialog')).toBeNull();
    const trigger = screen.getByRole('button', { name: 'Explore with a short guide' });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('button', { name: 'Continue' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: `${name} ${area.detail}` }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('button', { name: 'See my starting point' }).disabled).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: area.topics[0].label }));
    fireEvent.click(screen.getByRole('button', { name: 'See my starting point' }));
    expect(
      screen.getByRole('link', { name: area.topics[0].title }).getAttribute('href'),
    ).toBe(area.topics[0].href);
    fireEvent.click(screen.getByRole('button', { name: 'Change my answers' }));
    expect(screen.getByRole('radio', { name: `${name} ${area.detail}` }).checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Close browsing guide' }));
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).not.toBe('hidden');
  });
  it('opens directly from a campaign link without collecting personal information', () => {
    window.history.replaceState({}, '', '/?guide=1&utm_source=example');
    render(<ExploreGuide design="clarity" />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
  });
  it('only links to pages in the replacement site', () => {
    const paths = new Set(routes.map((route) => route.path));
    guideAreas.flatMap((area) => area.topics).forEach((topic) => expect(paths.has(topic.href), topic.href).toBe(true));
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
