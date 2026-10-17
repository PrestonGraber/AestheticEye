import React, { useEffect, useState } from 'react';
import BrandMark from '../ui/BrandMark.jsx';
import { readEmployeeSession, employeeAction } from './session.js';
import './employee.css';
import EmployeeDashboard from './EmployeeDashboard.jsx';

export default function EmployeeAccess() {
  const [session, setSession] = useState({ state: 'loading' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    readEmployeeSession(controller.signal).then(setSession).catch((error) => {
      if (error.name !== 'AbortError') setSession({ state: 'unavailable' });
    });
    return () => controller.abort();
  }, []);

  async function signIn(event) {
    event.preventDefault();
    if (session.state !== 'sign-in' || busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true); setError('');
    try {
      await employeeAction('login', session.csrfToken, {
        email: String(data.get('email')).trim(), password: data.get('password'),
      });
      const next = await readEmployeeSession();
      if (next.state !== 'authenticated') throw new Error('Sign-in could not be verified. Please try again.');
      setSession(next);
    } catch (error) { setError(error.message || 'Sign-in is unavailable. Please try again later.'); }
    finally { form.reset(); setBusy(false); }
  }
  async function signOut() {
    setBusy(true); setError('');
    // Hide the workspace immediately; only the server can invalidate a session.
    const token = session.csrfToken;
    setSession({ state: 'loading' });
    try {
      await employeeAction('logout', token);
      const next = await readEmployeeSession();
      if (next.state === 'authenticated') throw new Error('Sign out could not be confirmed. Please try again.');
      setSession(next);
    } catch (error) {
      setSession({ state: 'sign-out-error', csrfToken: token });
      setError(error.message || 'Sign out could not be confirmed. Please try again.');
    } finally { setBusy(false); }
  }

  return <div className="employee-page">
    <header className="employee-header">
      <a href="/" aria-label="AestheticEye home"><BrandMark /></a>
      <a href="/">Back to website <span aria-hidden="true">↗</span></a>
    </header>
    <main id="main" tabIndex={-1} className={`employee-main ${session.state === 'authenticated' || (import.meta.env.DEV && preview) ? 'employee-workspace' : ''}`}>
      {session.state === 'authenticated' || (import.meta.env.DEV && preview) ? <EmployeeDashboard name={session.state === 'authenticated' ? session.name : undefined} preview={session.state !== 'authenticated'} busy={busy} onExit={session.state === 'authenticated' ? signOut : () => setPreview(false)} /> : <>
      <p className="employee-eyebrow">AestheticEye · Team workspace</p>
      <h1>{session.state === 'authenticated' ? `Welcome, ${session.name}.` : 'Employee access'}</h1>
      {session.state === 'loading' && <p role="status">Checking secure access…</p>}
      {['sign-in', 'unavailable'].includes(session.state) && <>
        <p className="employee-intro">Sign in with your practice account.</p>
        {session.state === 'unavailable' && <p className="employee-connection-note" id="employee-connection-note" role="status">Staff sign-in is not available yet.</p>}
        <form onSubmit={signIn} className="employee-form">
          <label htmlFor="employee-email">Work email</label>
          <input id="employee-email" name="email" type="email" autoComplete="username" required disabled={busy || session.state !== 'sign-in'} />
          <label htmlFor="employee-password">Password</label>
          <div className="employee-password">
            <input id="employee-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required disabled={busy || session.state !== 'sign-in'} />
            <button type="button" disabled={session.state !== 'sign-in'} aria-controls="employee-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          <button className="employee-button" type="submit" disabled={busy || session.state !== 'sign-in'} aria-describedby={session.state === 'unavailable' ? 'employee-connection-note' : undefined}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <p>Need access or a password reset? Contact your practice administrator.</p>
        </form>
        {import.meta.env.DEV && session.state === 'unavailable' && <button type="button" className="staff-preview-launch" onClick={() => setPreview(true)}>Preview dashboard design <span aria-hidden="true">↗</span></button>}
      </>}
      {error && <p className="employee-error" role="alert">{error}</p>}
      {session.state === 'sign-out-error' && <button className="employee-button" onClick={signOut} disabled={busy}>Try signing out again</button>}
      </>}
    </main>
    <footer className="employee-footer">AestheticEye · Cincinnati & Dayton</footer>
  </div>;
}
