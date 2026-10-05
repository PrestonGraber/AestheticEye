import React, { useEffect, useState } from 'react';
import { designs } from './designs.js';

const DRAFT_KEY = 'aestheticeye-design-feedback-v1';
export const FEEDBACK_EMAIL = 'prestongraber123@gmail.com';
function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
    return {
      name: typeof draft?.name === 'string' ? draft.name.slice(0, 100) : '',
      notes: typeof draft?.notes === 'string' ? draft.notes.slice(0, 1000) : '',
      likes: Object.fromEntries(
        designs.map((d) => [
          d.id,
          typeof draft?.likes?.[d.id] === 'string' ? draft.likes[d.id].slice(0, 500) : '',
        ]),
      ),
    };
  } catch {
    return { name: '', notes: '', likes: {} };
  }
}
export function feedbackText(favorites, draft) {
  const selected = designs.filter((d) => favorites.includes(d.id));
  return [
    'AestheticEye — Design feedback',
    `From: ${draft.name.trim() || 'Not provided'}`,
    '',
    'FAVORITE DIRECTIONS',
    ...selected.flatMap((d) => [
      `${d.n} — ${d.name}`,
      `What I like: ${draft.likes[d.id]?.trim() || 'No comments added.'}`,
      '',
    ]),
    'ADDITIONAL NOTES',
    draft.notes.trim() || 'No additional notes.',
  ].join('\n');
}
export default function FavoriteFeedback({ favorites, toggle }) {
  const [draft, setDraft] = useState(readDraft);
  const [status, setStatus] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
  const selected = designs.filter((d) => favorites.includes(d.id));
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setStorageFailed(false);
    } catch {
      setStorageFailed(true);
    }
  }, [draft]);
  const body = feedbackText(favorites, draft);
  function update(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
    setStatus('');
  }
  function submit(event) {
    event.preventDefault();
    if (!selected.length) return;
    const subject = 'AestheticEye — Favorite designs & feedback';
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(
      'Your email app has been requested. Review the message and press Send there. Nothing is sent automatically. If it did not open, copy the feedback below into an email.',
    );
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setStatus(`Feedback copied. Paste it into an email to ${FEEDBACK_EMAIL}.`);
    } catch {
      setStatus('Copy is unavailable. Select and copy the text in the email preview below.');
    }
  }
  return (
    <section className="favorite-feedback" id="design-feedback" aria-labelledby="feedback-heading">
      <div className="feedback-intro">
        <p className="collection-kicker">YOUR POINT OF VIEW</p>
        <h2 id="feedback-heading" tabIndex={-1}>
          What feels right?
        </h2>
        <p>Choose your favorites, tell us what you like, and share any changes you have in mind.</p>
        <p className="feedback-save-note">
          {storageFailed
            ? 'Browser saving is unavailable. Keep this page open until you send your feedback.'
            : 'Your notes are saved in this browser as you go.'}
        </p>
      </div>
      <form onSubmit={submit} className="feedback-form">
        <fieldset className="feedback-picks">
          <legend>1. Choose your favorites</legend>
          <div>
            {designs.map((d) => (
              <label key={d.id}>
                <input
                  type="checkbox"
                  checked={favorites.includes(d.id)}
                  onChange={() => {
                    toggle(d.id);
                    setStatus('');
                  }}
                />
                <span>
                  <small>{d.n}</small> {d.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="feedback-reasons">
          <legend>2. Tell us what you like</legend>
          {!selected.length && <p>Select at least one favorite to add feedback.</p>}
          {selected.map((d) => (
            <label key={d.id} htmlFor={`feedback-${d.id}`}>
              <span>
                {d.n} — {d.name}
              </span>
              <textarea
                id={`feedback-${d.id}`}
                rows={3}
                maxLength={500}
                value={draft.likes[d.id] || ''}
                placeholder="The typography, colors, navigation, photos…"
                onChange={(e) => update('likes', { ...draft.likes, [d.id]: e.target.value })}
              />
            </label>
          ))}
        </fieldset>
        <label className="feedback-field" htmlFor="feedback-notes">
          <span>
            3. Additional notes <small>(optional)</small>
          </span>
          <textarea
            id="feedback-notes"
            rows={4}
            maxLength={1000}
            value={draft.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Anything to change, combine, or explore further?"
          />
        </label>
        <label className="feedback-field" htmlFor="feedback-name">
          <span>
            Your name <small>(optional)</small>
          </span>
          <input
            id="feedback-name"
            autoComplete="name"
            maxLength={100}
            value={draft.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </label>
        <div className="feedback-actions">
          <button type="submit" disabled={!selected.length}>
            Submit feedback via email ↗
          </button>
          <button type="button" disabled={!selected.length} onClick={copy}>
            Copy feedback
          </button>
        </div>
        <p className="feedback-delivery">
          Opens your email app with a message to{' '}
          <a href={`mailto:${FEEDBACK_EMAIL}`}>{FEEDBACK_EMAIL}</a>. Press Send in your email app to
          submit.
        </p>
        <p className="feedback-status" role="status">
          {status}
        </p>
        <details className="feedback-preview">
          <summary>Preview email content</summary>
          <pre>{body}</pre>
        </details>
      </form>
    </section>
  );
}
