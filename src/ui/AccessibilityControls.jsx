import React, { useEffect, useRef, useState } from 'react';
import './accessibility.css';
const defaults = { size: 0, contrast: false, links: false, motion: false };
const key = 'aestheticeye-reading-preferences';
function load() {
  try {
    const p = JSON.parse(localStorage.getItem(key));
    return {
      size: [0, 1, 2].includes(p?.size) ? p.size : 0,
      contrast: p?.contrast === true,
      links: p?.links === true,
      motion: p?.motion === true,
    };
  } catch {
    return defaults;
  }
}
export default function AccessibilityControls() {
  const [prefs, setPrefs] = useState(load);
  const [open, setOpen] = useState(false);
  const dialog = useRef(null),
    trigger = useRef(null);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.readingSize = String(prefs.size);
    root.dataset.readingContrast = String(prefs.contrast);
    root.dataset.readingLinks = String(prefs.links);
    root.dataset.readingMotion = String(prefs.motion);
    try {
      localStorage.setItem(key, JSON.stringify(prefs));
    } catch {}
    if (prefs.motion) {
      document.getAnimations?.().forEach((a) => a.cancel());
      document.querySelectorAll('video[autoplay]').forEach((v) => v.pause());
    }
  }, [prefs]);
  function close() {
    dialog.current.close();
  }
  return (
    <>
      <button
        className="accessibility-launcher"
        ref={trigger}
        aria-label="Accessibility and reading options"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialog.current.showModal();
          setOpen(true);
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="4" r="2" />
          <path d="M4 9l8 2 8-2M12 11v5m0 0l-4 6m4-6l4 6" />
        </svg>
      </button>
      <dialog
        ref={dialog}
        className="accessibility-dialog"
        aria-labelledby="reading-options-title"
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            const r = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < r.left ||
              e.clientX > r.right ||
              e.clientY < r.top ||
              e.clientY > r.bottom
            )
              close();
          }
        }}
      >
        <div className="reading-panel-heading">
          <h2 id="reading-options-title">Reading & accessibility</h2>
          <button type="button" onClick={close} aria-label="Close accessibility options" autoFocus>
            ×
          </button>
        </div>
        <p>Adjust this website to suit you. Your preferences stay saved on this browser.</p>
        <fieldset>
          <legend>Reading text size</legend>
          <div className="reading-size-options">
            {['Default', 'Larger', 'Largest'].map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={prefs.size === i}
                onClick={() => setPrefs((p) => ({ ...p, size: i }))}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        {[
          ['contrast', 'Stronger contrast'],
          ['links', 'Underline text links'],
          ['motion', 'Reduce motion'],
        ].map(([id, label]) => (
          <label className="reading-option" key={id}>
            <span>{label}</span>
            <input
              type="checkbox"
              checked={prefs[id]}
              onChange={(e) => setPrefs((p) => ({ ...p, [id]: e.target.checked }))}
            />
          </label>
        ))}
        <p className="reading-hint">
          Reduced motion also follows your device settings. Videos can still be played manually.
        </p>
        <button type="button" className="reading-reset" onClick={() => setPrefs({ ...defaults })}>
          Reset preferences
        </button>
        <a className="reading-policy" href="/accessibility-policy/">
          Accessibility policy
        </a>
      </dialog>
    </>
  );
}
