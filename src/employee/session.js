// The server owns authentication. No credentials, session tokens or staff data
// are persisted in browser storage. Missing integrations fail closed.
export async function readEmployeeSession(signal) {
  const response = await fetch('/api/employee/session', {
    credentials: 'same-origin', cache: 'no-store', signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Employee access is unavailable.');
  }
  const session = await response.json();
  if (session.configured !== true) return { state: 'unavailable' };
  const csrfToken = typeof session.csrfToken === 'string' ? session.csrfToken : '';
  if (session.authenticated === true && session.user &&
      ['employee', 'admin'].includes(session.user.role) && csrfToken) {
    return { state: 'authenticated', csrfToken, name: String(session.user.name || 'Team member') };
  }
  if (session.authenticated === false && session.passwordLogin === true && csrfToken) {
    return { state: 'sign-in', csrfToken };
  }
  return { state: 'unavailable' };
}

export async function employeeAction(action, csrfToken, body = {}) {
  const response = await fetch(`/api/employee/${action}`, {
    method: 'POST', credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': csrfToken },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(action === 'login'
    ? 'We couldn’t sign you in. Check your details or contact your administrator.'
    : 'Sign out could not be confirmed. Please try again.');
}
