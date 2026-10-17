import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Contact, { locations } from '../src/sections/Contact.jsx';
import PracticeFilm from '../src/sections/PracticeFilm.jsx';
import Navigation from '../src/navigation/Navigation.jsx';
import { usePointerDepth } from '../src/ui/usePointerDepth.js';

const defaultMedia = window.matchMedia.getMockImplementation();
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.matchMedia.mockImplementation(defaultMedia);
});

describe('contact location tools', () => {
  it('switches addresses, hours, phone and directions together using the keyboard', () => {
    render(<Contact />);
    const tabs = screen.getAllByRole('tab');
    expect(screen.getByRole('tabpanel').textContent).toContain(locations[0].street);
    expect(screen.getByRole('tabpanel').textContent).toContain(locations[0].lunch);
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[1]);
    const panel = screen.getByRole('tabpanel');
    expect(panel.textContent).toContain(locations[1].street);
    expect(panel.textContent).not.toContain(locations[0].lunch);
    expect(within(panel).getByRole('link', { name: locations[1].phone }).getAttribute('href')).toBe(
      'tel:5135135437',
    );
    expect(
      new URL(within(panel).getByRole('link', { name: 'Get directions' }).href).searchParams.get(
        'query',
      ),
    ).toBe(`${locations[1].street}, ${locations[1].city}`);
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(tabs[0]);
  });
  it('copies the selected address and announces success without changing location', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal(
      'navigator',
      Object.assign(Object.create(navigator), { clipboard: { writeText } }),
    );
    render(<Contact />);
    fireEvent.click(screen.getByRole('tab', { name: /Cincinnati/ }));
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy address' })));
    expect(writeText).toHaveBeenCalledWith(`${locations[1].street}, ${locations[1].city}`);
    expect(screen.getByRole('button', { name: 'Address copied' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Cincinnati address copied.');
    vi.unstubAllGlobals();
  });
  it('keeps the visible address available if clipboard permission is unavailable', async () => {
    vi.stubGlobal(
      'navigator',
      Object.assign(Object.create(navigator), {
        clipboard: { writeText: vi.fn().mockRejectedValue(new Error('unavailable')) },
      }),
    );
    render(<Contact />);
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy address' })));
    expect(screen.getByRole('status').textContent).toContain('full address is shown above');
    expect(screen.getByRole('tabpanel').textContent).toContain(locations[0].street);
    vi.unstubAllGlobals();
  });
});

describe('practice film', () => {
  it('loads the original video only on request and restores focus and scrolling on close', () => {
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    const { container } = render(<PracticeFilm />);
    expect(container.querySelector('video')).toBeNull();
    const trigger = screen.getByRole('button', { name: /About our practice/ });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'AestheticEye practice film' });
    expect(dialog.open).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    expect(container.querySelector('video').getAttribute('src')).toContain('REAL-ESTATE-1.mp4');
    expect(container.querySelector('video').autoplay).toBe(false);
    expect(dialog.textContent).toContain('No audio');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(pause).toHaveBeenCalled();
    expect(document.body.style.overflow).toBe('');
    expect(document.activeElement).toBe(trigger);
  });
});

describe('small-screen navigation', () => {
  it('expands a mobile section in place and closes with Escape', () => {
    window.matchMedia.mockImplementation((query) => ({...defaultMedia(query),matches: query === '(max-width: 960px)'}));
    render(<Navigation setContrast={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu', exact: true }));
    const treatments = document.querySelector('.mobile-simple-menu .mobile-menu-group:nth-of-type(2) > button');
    fireEvent.click(treatments);
    expect(treatments.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('.mobile-simple-menu').textContent).toContain('Cosmetic');
    expect(screen.queryByRole('button', {name:'All sections'})).toBeNull();
    fireEvent.click(treatments);
    expect(treatments.getAttribute('aria-expanded')).toBe('false');
    fireEvent.keyDown(treatments, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded')).toBe('false');
  });
  it('does not dismiss a newly selected group on a null focus target', () => {
    render(<Navigation setContrast={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Treatments', exact: true }));
    const search = screen.getByRole('searchbox');
    fireEvent.blur(search, { relatedTarget: null });
    expect(screen.getByRole('region')).toBeTruthy();
    const outside = document.createElement('button');
    document.body.append(outside);
    fireEvent.blur(search, { relatedTarget: outside });
    expect(screen.queryByRole('region')).toBeNull();
    outside.remove();
  });
});

function DepthTarget() {
  return <div data-testid="depth-target" {...usePointerDepth()} />;
}
describe('local portrait movement', () => {
  it('responds only to mouse input, stays bounded, and resets on departure', () => {
    vi.useFakeTimers();
    render(<DepthTarget />);
    const target = screen.getByTestId('depth-target');
    target.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 });
    fireEvent.pointerMove(target, { pointerType: 'touch', clientX: 400, clientY: 300 });
    act(() => vi.runAllTimers());
    expect(target.style.getPropertyValue('--portrait-x')).toBe('');
    fireEvent.pointerMove(target, { pointerType: 'mouse', clientX: 800, clientY: 600 });
    act(() => vi.runAllTimers());
    expect(target.style.getPropertyValue('--portrait-x')).toBe('7px');
    expect(target.style.getPropertyValue('--portrait-y')).toBe('5px');
    fireEvent.pointerLeave(target);
    expect(target.style.getPropertyValue('--portrait-x')).toBe('0px');
  });
  it('honors the reduced-motion preference', () => {
    window.matchMedia.mockImplementation((query) => ({
      ...defaultMedia(query),
      matches: query === '(prefers-reduced-motion: reduce)',
    }));
    vi.useFakeTimers();
    render(<DepthTarget />);
    const target = screen.getByTestId('depth-target');
    target.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 });
    fireEvent.pointerMove(target, { pointerType: 'mouse', clientX: 400, clientY: 300 });
    act(() => vi.runAllTimers());
    expect(target.style.getPropertyValue('--portrait-x')).toBe('');
  });
});
