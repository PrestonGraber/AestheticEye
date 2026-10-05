import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axe from 'axe-core';
import Care from '../src/sections/Care.jsx';
import Gallery from '../src/sections/Gallery.jsx';
import Reviews from '../src/sections/Reviews.jsx';
import Collection from '../src/Collection.jsx';
import Website from '../src/Website.jsx';
import { designs } from '../src/designs.js';
import { galleryCases, original, treatments } from '../src/content.js';

describe.each(['clarity', 'serene', 'modern'])('%s procedure browser', (design) => {
  it('supports keyboard selection and retains the exact procedure copy', () => {
    render(<Care design={design} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    fireEvent.keyDown(tabs[0], { key: 'End' });
    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').textContent).toContain(treatments[2].body);
    fireEvent.keyDown(tabs[2], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[0]);
    expect(screen.getByRole('tabpanel').textContent).toContain(treatments[0].body);
    fireEvent.click(tabs[1]);
    expect(screen.getByRole('tabpanel').textContent).toContain(treatments[1].body);
  });
});

describe('distinct procedure presentations', () => {
  it('expands a business directory row and collapses it on a second activation', () => {
    const { container } = render(<Care design="form" />);
    const second = screen.getByRole('button', { name: 'Lower Eyelid Bags' });
    fireEvent.click(second);
    expect(second.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelectorAll('.directory-procedure-panel:not([hidden])')).toHaveLength(1);
    expect(
      container.querySelector('.directory-procedure-panel:not([hidden])').textContent,
    ).toContain(treatments[1].body);
    fireEvent.click(second);
    expect(second.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelectorAll('.directory-procedure-panel:not([hidden])')).toHaveLength(0);
  });
  it('keeps all three editorial procedure stories and descriptions visible', () => {
    const { container } = render(<Care design="editorial" />);
    expect(container.querySelectorAll('.procedure-stories article')).toHaveLength(3);
    for (const treatment of treatments) expect(container.textContent).toContain(treatment.body);
  });
  it('advances the Perspective filmstrip with controls and keyboard arrows', () => {
    render(<Care design="perspective" />);
    fireEvent.click(screen.getByRole('button', { name: 'Next procedure' }));
    expect(
      screen.getByRole('button', { name: 'Lower Eyelid Bags' }).getAttribute('aria-pressed'),
    ).toBe('true');
    const strip = screen.getByRole('region', { name: 'Cosmetic procedure stories' });
    fireEvent.keyDown(strip, { key: 'ArrowRight' });
    expect(
      screen.getByRole('button', { name: 'Brow and Forehead Lifts' }).getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Next procedure' }));
    expect(
      screen.getByRole('button', { name: 'Drooping upper Eyelids' }).getAttribute('aria-pressed'),
    ).toBe('true');
  });
});

describe('photograph viewer and comparison', () => {
  it('browses visual previews and swipes without hijacking vertical scrolling or opening the modal', () => {
    render(<Gallery />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Show Lower Eyelid Blepharoplasty photographs' }),
    );
    let photo = screen.getByRole('button', {
      name: 'Enlarge original Lower Eyelid Blepharoplasty photographs',
    });
    fireEvent.touchStart(photo, { touches: [{ clientX: 220, clientY: 200 }] });
    fireEvent.touchEnd(photo, { changedTouches: [{ clientX: 120, clientY: 205 }] });
    photo = screen.getByRole('button', {
      name: 'Enlarge original Skin Cancer Reconstructions photographs',
    });
    fireEvent.click(photo, { detail: 1 });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.touchStart(photo, { touches: [{ clientX: 220, clientY: 200 }] });
    fireEvent.touchEnd(photo, { changedTouches: [{ clientX: 210, clientY: 350 }] });
    expect(
      screen
        .getByRole('button', { name: 'Show Skin Cancer Reconstructions photographs' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(photo, { detail: 0 });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
  it('starts with the original image, changes categories, and exposes comparison on request', () => {
    render(<Gallery />);
    expect(screen.queryByRole('slider')).toBeNull();
    expect(
      screen
        .getByRole('img', { name: 'Original before and after Brow Lift Surgery' })
        .getAttribute('src'),
    ).toContain(galleryCases[0].image);
    fireEvent.click(screen.getByRole('button', { name: 'Next gallery category' }));
    expect(
      screen
        .getByRole('button', { name: 'Lower Eyelid Blepharoplasty' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Compare', exact: true }));
    const range = screen.getByRole('slider');
    expect(range.value).toBe('50');
    fireEvent.change(range, { target: { value: '72' } });
    expect(range.getAttribute('aria-valuetext')).toBe('72% of the after photograph visible');
    fireEvent.click(screen.getByRole('button', { name: 'Before', exact: true }));
    expect(range.value).toBe('0');
    fireEvent.click(screen.getByRole('button', { name: 'After', exact: true }));
    expect(range.value).toBe('100');
    fireEvent.click(screen.getByRole('button', { name: 'Next gallery category' }));
    expect(range.value).toBe('50');
    fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }));
    expect(screen.queryByRole('slider')).toBeNull();
  });
  it('locks background scrolling, navigates originals, and restores focus on dismissal', () => {
    render(<Gallery />);
    const open = screen.getByRole('button', {
      name: 'Enlarge original Brow Lift Surgery photographs',
    });
    open.focus();
    fireEvent.click(open);
    const dialog = screen.getByRole('dialog', { name: 'Original before and after photographs' });
    expect(dialog.open).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(within(dialog).getByRole('img').getAttribute('src')).toContain(galleryCases[1].image);
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(dialog.open).toBe(false);
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(open);
  });
  it('releases the modal scroll lock when changing away from the page', () => {
    const { unmount } = render(<Gallery />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Enlarge original Brow Lift Surgery photographs' }),
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('testimonials', () => {
  it('cycles complete original quotes and can reveal all three without autoplay', () => {
    const { container } = render(<Reviews />);
    expect(container.querySelector('.review-story blockquote').textContent).toBe(
      original.reviews[0],
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }));
    expect(container.querySelector('.review-story blockquote').textContent).toBe(
      original.reviews[1],
    );
    fireEvent.click(screen.getByRole('button', { name: 'Read all 3 testimonials' }));
    expect(container.querySelector('#all-testimonials').hidden).toBe(false);
    expect(container.querySelectorAll('#all-testimonials blockquote')).toHaveLength(3);
  });
});

describe('design collection', () => {
  beforeEach(() => window.localStorage.clear());
  it('filters the collection and persists a user shortlist', () => {
    const { container } = render(<Collection />);
    expect(container.querySelectorAll('.design-card')).toHaveLength(6);
    fireEvent.click(screen.getByRole('button', { name: 'Dark', exact: true }));
    expect(container.querySelectorAll('.design-card')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Add Perspective to shortlist' }));
    expect(JSON.parse(window.localStorage.getItem('aestheticeye-design-shortlist-v1'))).toEqual([
      'perspective',
    ]);
    fireEvent.click(screen.getByRole('button', { name: /Shortlist01/ }));
    expect(container.querySelectorAll('.design-card')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Explore Perspective homepage' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Perspective from shortlist' }));
    expect(screen.getByText('Your shortlist starts here.')).toBeTruthy();
  });
  it('handles unavailable or corrupt saved preferences without losing the collection', () => {
    window.localStorage.setItem('aestheticeye-design-shortlist-v1', '{broken');
    const { container } = render(<Collection />);
    expect(container.querySelectorAll('.design-card')).toHaveLength(6);
  });
});

describe.each(designs.map((design) => design.id))('%s complete homepage', (design) => {
  it('renders one page, one heading, five navigation items and the source content', () => {
    const { container } = render(<Website design={design} />);
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      within(screen.getByRole('navigation', { name: 'Main navigation' })).getAllByRole('button'),
    ).toHaveLength(5);
    expect(container.querySelector('.preview-bar')).toBeNull();
    expect(container.querySelector('.site').classList.contains('client-view')).toBe(true);
    for (const index of [4, 12, 20])
      expect(container.textContent).toContain(original.paragraphs[index]);
    expect(container.querySelectorAll('.art-articles article')).toHaveLength(3);
    expect(container.querySelectorAll('img:not([alt])')).toHaveLength(0);
    expect(container.querySelectorAll('.art-hero img[fetchpriority="high"]')).toHaveLength(1);
  });
  it('has no detected semantic WCAG violations in the full initial page', async () => {
    const { container } = render(<Website design={design} />);
    const report = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(
      report.violations.map((item) => ({
        id: item.id,
        targets: item.nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  });
});
