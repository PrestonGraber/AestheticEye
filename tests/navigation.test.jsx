import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import axe from 'axe-core';
import Navigation, { HOVER_CLOSE_DELAY, HOVER_OPEN_DELAY } from '../src/navigation/Navigation.jsx';
import { getNavigationLinks, menuDesigns, navigationGroups } from '../src/navigation/model.js';
import original from '../src/original.json';

function mount(design = 'clarity') {
  return render(<Navigation design={design} contrast={false} setContrast={vi.fn()} />);
}
function trigger(name) {
  return within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', {
    name,
  });
}
function panel(name) {
  return screen.getByRole('region', { name: `${name} navigation` });
}
function advance(duration) {
  act(() => {
    vi.advanceTimersByTime(duration);
  });
}

describe('navigation content fidelity', () => {
  it('retains every original label and destination behind exactly five groups', () => {
    expect(navigationGroups).toHaveLength(5);
    const preserved = new Set(
      navigationGroups
        .flatMap((g) => g.sections.flatMap((s) => s.links))
        .map((link) => `${link.href}|${link.label}`),
    );
    for (const link of original.nav.flatMap((g) => g.links))
      expect(preserved.has(`${link.href}|${link.label}`)).toBe(true);
  });
  it('searches across categories, trims whitespace and returns no invented matches', () => {
    const treatments = navigationGroups.find((g) => g.id === 'treatments');
    expect(getNavigationLinks(treatments, 0, '  BROW ').length).toBeGreaterThan(0);
    for (const item of getNavigationLinks(treatments, 0, 'BROW'))
      expect(item.label.toLowerCase()).toContain('brow');
    expect(getNavigationLinks(treatments, 0, 'no-such-treatment-xyz')).toEqual([]);
  });
});

describe.each(Object.keys(menuDesigns))('%s navigation', (design) => {
  it('renders its own structural layout and opens every top-level group', () => {
    const { container } = mount(design);
    expect(within(screen.getByRole('navigation')).getAllByRole('button')).toHaveLength(5);
    for (const group of navigationGroups) {
      fireEvent.click(trigger(group.label));
      expect(panel(group.label)).toBeTruthy();
      expect(container.querySelector(`.menu-${menuDesigns[design].layout}`)).not.toBeNull();
      expect(trigger(group.label).getAttribute('aria-expanded')).toBe('true');
      expect(within(panel(group.label)).getAllByRole('link').length).toBeGreaterThan(0);
    }
  });
  it('opens on mouse hover, tolerates a brief exit, and closes after departure', () => {
    vi.useFakeTimers();
    const { container } = mount(design);
    fireEvent.pointerEnter(trigger('Treatments'), { pointerType: 'mouse' });
    advance(HOVER_OPEN_DELAY - 1);
    expect(screen.queryByRole('region')).toBeNull();
    advance(1);
    expect(panel('Treatments')).toBeTruthy();
    fireEvent.pointerLeave(container.querySelector('.ae-header'), { pointerType: 'mouse' });
    advance(100);
    fireEvent.pointerEnter(panel('Treatments'), { pointerType: 'mouse' });
    advance(HOVER_CLOSE_DELAY + 1);
    expect(panel('Treatments')).toBeTruthy();
    fireEvent.pointerLeave(container.querySelector('.ae-header'), { pointerType: 'mouse' });
    advance(HOVER_CLOSE_DELAY + 1);
    expect(screen.queryByRole('region')).toBeNull();
  });
  it('cancels a fleeting hover and ignores touch hover events', () => {
    vi.useFakeTimers();
    mount(design);
    const button = trigger('Treatments');
    fireEvent.pointerEnter(button, { pointerType: 'mouse' });
    advance(20);
    fireEvent.pointerLeave(button, { pointerType: 'mouse' });
    advance(HOVER_OPEN_DELAY + 1);
    expect(screen.queryByRole('region')).toBeNull();
    fireEvent.pointerEnter(button, { pointerType: 'touch' });
    advance(HOVER_OPEN_DELAY + 1);
    expect(screen.queryByRole('region')).toBeNull();
    fireEvent.pointerDown(button, { pointerType: 'touch' });
    fireEvent.click(button, { detail: 1 });
    expect(panel('Treatments')).toBeTruthy();
    fireEvent.click(button, { detail: 1 });
    expect(screen.queryByRole('region')).toBeNull();
  });
  it('does not close when a mouse click follows a hover opening', () => {
    vi.useFakeTimers();
    mount(design);
    const button = trigger('About');
    fireEvent.pointerEnter(button, { pointerType: 'mouse' });
    advance(HOVER_OPEN_DELAY);
    fireEvent.pointerDown(button, { pointerType: 'mouse' });
    fireEvent.click(button, { detail: 1 });
    expect(panel('About')).toBeTruthy();
  });
  it('keeps small groups compact and omits decorative photographs from the dropdown', () => {
    const { container } = mount(design);
    fireEvent.click(trigger('About'));
    expect(container.querySelector('.ae-header').dataset.single).toBe('true');
    expect(within(panel('About')).queryByRole('searchbox')).toBeNull();
    expect(panel('About').querySelectorAll('img')).toHaveLength(0);
    expect(within(panel('About')).getAllByRole('listitem')).toHaveLength(6);
  });
  it('switches treatment categories on deliberate mouse hover and cancels a fleeting hover', () => {
    vi.useFakeTimers();
    mount(design);
    fireEvent.click(trigger('Treatments'));
    const category = within(panel('Treatments')).getByRole('button', { name: 'Non-Surgical' });
    fireEvent.pointerEnter(category, { pointerType: 'mouse' });
    advance(50);
    fireEvent.pointerLeave(category, { pointerType: 'mouse' });
    advance(100);
    expect(category.getAttribute('aria-pressed')).toBe('false');
    fireEvent.pointerEnter(category, { pointerType: 'mouse' });
    advance(110);
    expect(category.getAttribute('aria-pressed')).toBe('true');
    expect(within(panel('Treatments')).getAllByRole('listitem')).toHaveLength(23);
  });
  it('enters links with ArrowDown and restores the trigger on Escape', () => {
    mount(design);
    const button = trigger('Treatments');
    button.focus();
    fireEvent.keyDown(button, { key: 'ArrowDown' });
    expect(document.activeElement.closest('.nav-links')).not.toBeNull();
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(screen.queryByRole('region')).toBeNull();
    expect(document.activeElement).toBe(button);
  });
  it('keeps a panel open when keyboard focus is inside during pointer departure', () => {
    vi.useFakeTimers();
    const { container } = mount(design);
    fireEvent.keyDown(trigger('Results'), { key: 'ArrowDown' });
    fireEvent.pointerLeave(container.querySelector('.ae-header'), { pointerType: 'mouse' });
    advance(HOVER_CLOSE_DELAY + 1);
    expect(panel('Results')).toBeTruthy();
  });
  it('searches, clears search, and switches categories without losing links', () => {
    mount(design);
    fireEvent.click(trigger('Treatments'));
    const search = screen.getByRole('searchbox', { name: 'Search treatments' });
    fireEvent.change(search, { target: { value: 'brow' } });
    const matches = within(panel('Treatments')).getAllByRole('listitem');
    expect(matches.length).toBeGreaterThan(0);
    for (const match of matches) expect(match.textContent.toLowerCase()).toContain('brow');
    fireEvent.click(screen.getByRole('button', { name: 'Clear navigation search' }));
    expect(search.value).toBe('');
    expect(document.activeElement).toBe(search);
    fireEvent.click(within(panel('Treatments')).getByRole('button', { name: 'Non-Surgical' }));
    expect(within(panel('Treatments')).getAllByRole('listitem')).toHaveLength(
      navigationGroups[1].sections[2].links.length,
    );
  });
  it('closes an expanded mobile panel when its menu button collapses', () => {
    mount(design);
    const menu = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(menu);
    fireEvent.click(trigger('Treatments'));
    fireEvent.click(screen.getByRole('button', { name: 'Close', exact: true }));
    expect(screen.queryByRole('region')).toBeNull();
    expect(screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });
  it('has no detected semantic accessibility violations with the menu open', async () => {
    const { container } = mount(design);
    fireEvent.click(trigger('Treatments'));
    const report = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(
      report.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
    ).toEqual([]);
  });
});
