import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import EmployeeAccess from '../src/employee/EmployeeAccess.jsx';
import { readEmployeeSession } from '../src/employee/session.js';
import App from '../src/App.jsx';

const reply = (body, type = 'application/json') => ({ ok: true, headers: new Headers({ 'content-type': type }), json: async () => body });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('employee authentication boundary', () => {
  it('offers a local design preview without creating a session or loading staff data', async () => {
    vi.stubEnv('DEV', true);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ configured: false })));
    render(<EmployeeAccess />);
    fireEvent.click(await screen.findByRole('button', { name: /Preview dashboard design/ }));
    expect(screen.getByText('Design preview')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Enquiries' }));
    expect(screen.getByText('No records are being collected or displayed in this workspace yet.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Website resources' }));
    fireEvent.change(screen.getByLabelText('Search resources'), { target: { value: 'payment' } });
    expect(screen.getByRole('link', { name: /Payment plans/ }).getAttribute('href')).toBe('/payment-plans/');
    expect(screen.queryByRole('link', { name: /Treatment gallery/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Exit preview' }));
    expect(screen.getByLabelText('Password').disabled).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('does not expose the design preview outside development', async () => {
    vi.stubEnv('DEV', false);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ configured: false })));
    render(<EmployeeAccess />);
    await screen.findByText('Staff sign-in is not available yet.');
    expect(screen.queryByRole('button', { name: /Preview dashboard design/ })).toBeNull();
  });
  it('opens the clean employee route and marks it noindex', async () => {
    window.history.replaceState(null, '', '/employee/');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ configured: false })));
    render(<App />);
    await screen.findByText('Staff sign-in is not available yet.');
    expect(document.title).toBe('Employee access | AestheticEye');
    expect(document.querySelector('meta[name="robots"]').content).toBe('noindex, nofollow');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    window.history.replaceState(null, '', '/');
  });
  it('previews disabled sign-in fields and never submits without a configured backend', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ configured: false })));
    render(<EmployeeAccess />);
    await screen.findByText('Staff sign-in is not available yet.');
    expect(screen.getByLabelText('Password').disabled).toBe(true);
    expect(screen.getByLabelText('Work email').disabled).toBe(true);
    expect(screen.getByRole('button', {name:'Sign in'}).disabled).toBe(true);
    fireEvent.submit(document.querySelector('.employee-form'));
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Treatment gallery')).toBeNull();
  });
  it('fails closed if an SPA fallback returns HTML', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({}, 'text/html')));
    render(<EmployeeAccess />);
    await screen.findByText('Staff sign-in is not available yet.');
    expect(screen.queryByText('Treatment gallery')).toBeNull();
  });
  it('fails closed on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));
    render(<EmployeeAccess />);
    await screen.findByText('Staff sign-in is not available yet.');
  });
  it('requires an allowed employee role and CSRF token even for authenticated responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply({ configured: true, authenticated: true, user: { role: 'patient' }, csrfToken: 'test' })));
    expect((await readEmployeeSession()).state).toBe('unavailable');
    fetch.mockResolvedValue(reply({ configured: true, authenticated: true, user: { role: 'employee' } }));
    expect((await readEmployeeSession()).state).toBe('unavailable');
  });
  it('requires a verified session after login and clears entered passwords', async () => {
    const signedOut = { configured: true, authenticated: false, passwordLogin: true, csrfToken: 'test-csrf' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply(signedOut)));
    render(<EmployeeAccess />);
    fireEvent.change(await screen.findByLabelText('Work email'), { target: { value: 'staff@example.test' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'not-a-real-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await screen.findByRole('alert');
    expect(screen.queryByText('Treatment gallery')).toBeNull();
    expect(screen.getByLabelText('Password').value).toBe('');
    expect(fetch).toHaveBeenCalledWith('/api/employee/login', expect.objectContaining({ credentials: 'same-origin', headers: expect.objectContaining({ 'X-CSRF-Token': 'test-csrf' }) }));
  });
  it('shows public resources only after server authentication and hides them on logout failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(reply({ configured: true, authenticated: true, csrfToken: 'test', user: { role: 'employee', name: 'Staff' } })).mockRejectedValue(new Error('offline')));
    render(<EmployeeAccess />);
    await screen.findByText('Welcome, Staff.');
    expect(screen.getByText('Treatment gallery')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(screen.queryByText('Treatment gallery')).toBeNull());
    await screen.findByRole('button', { name: 'Try signing out again' });
  });
});
