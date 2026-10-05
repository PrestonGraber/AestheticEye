import React, { useState } from 'react';
import ConceptPreview from './ConceptPreview.jsx';
import BrandMark from './ui/BrandMark.jsx';
import { designs } from './designs.js';
import { Icon } from './ui/Icons.jsx';
import './collection.css';

const STORAGE_KEY = 'aestheticeye-design-shortlist-v1';
const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

function readShortlist() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    return Array.isArray(value)
      ? value.filter((id) => designs.some((design) => design.id === id))
      : [];
  } catch {
    return [];
  }
}

function DesignCard({ design, saved, toggle }) {
  return (
    <article className={`design-card preview-${design.id}`}>
      <div className="card-label">
        <span>DIRECTION {design.n}</span>
        <button
          type="button"
          className="shortlist-button"
          aria-pressed={saved}
          aria-label={`${saved ? 'Remove' : 'Add'} ${design.name} ${saved ? 'from' : 'to'} shortlist`}
          onClick={() => toggle(design.id)}
        >
          <Icon name={saved ? 'check' : 'plus'} />
          <span>{saved ? 'Shortlisted' : 'Shortlist'}</span>
        </button>
      </div>
      <a
        className="design-card-link"
        href={`#/${design.id}`}
        aria-label={`Explore ${design.name} homepage`}
      >
        <ConceptPreview id={design.id} />
        <div className="design-info">
          <div className="design-title">
            <h2>{design.name}</h2>
            <span className="circle-arrow">
              <Icon name="arrow" />
            </span>
          </div>
          <p className="design-tag">{design.tag}</p>
          <p className="design-description">{design.desc}</p>
          <div className="design-menu-note">
            <span>Navigation</span>
            <span>{design.navigation}</span>
          </div>
          <span className="view-design">
            Explore homepage
            <Icon name="right" />
          </span>
        </div>
      </a>
    </article>
  );
}

export default function Collection() {
  const [shortlist, setShortlist] = useState(readShortlist);
  const [filter, setFilter] = useState('all');
  function toggle(id) {
    setShortlist((previous) => {
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* The collection still works when storage is unavailable. */
      }
      return next;
    });
  }
  const visible = designs.filter(
    (design) =>
      filter === 'all' ||
      (filter === 'shortlist' ? shortlist.includes(design.id) : design.tone === filter),
  );

  return (
    <div className="design-collection">
      <header className="collection-header">
        <a className="collection-brand" href="#/" aria-label="AestheticEye design collection">
          <BrandMark />
        </a>
        <span className="collection-edition">DESIGN EXPLORATIONS</span>
        <span className="collection-count">SIX DIRECTIONS / ONE PRACTICE</span>
      </header>
      <main id="main" tabIndex={-1}>
        <div className="collection-intro">
          <div>
            <p className="collection-kicker">AESTHETICEYE / A NEW POINT OF VIEW</p>
            <h1>
              Different
              <br />
              <span>by design.</span>
            </h1>
          </div>
          <div className="collection-intro-copy">
            <span className="collection-spark" aria-hidden="true">
              ↗
            </span>
            <p>
              Six distinct directions.
              <br />
              One exceptional practice.
            </p>
            <span>
              Explore a homepage. Try the navigation.
              <br />
              Shortlist the directions you want to keep.
            </span>
          </div>
        </div>
        <div className="collection-controls">
          <div className="collection-filters" role="group" aria-label="Filter design directions">
            {[
              ['all', 'All directions'],
              ['light', 'Light'],
              ['dark', 'Dark'],
              ['shortlist', 'Shortlist'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
                {value === 'shortlist' && (
                  <span>{shortlist.length.toString().padStart(2, '0')}</span>
                )}
              </button>
            ))}
          </div>
          <span className="collection-result-count" role="status" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'direction' : 'directions'}
          </span>
        </div>
        {visible.length ? (
          <div className="design-grid">
            {visible.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                saved={shortlist.includes(design.id)}
                toggle={toggle}
              />
            ))}
          </div>
        ) : (
          <div className="shortlist-empty">
            <Icon name="plus" />
            <h2>Your shortlist starts here.</h2>
            <p>Use the Shortlist button on a design to save it for comparison.</p>
            <button type="button" onClick={() => setFilter('all')}>
              Explore all directions
              <Icon name="right" />
            </button>
          </div>
        )}
        <div className="collection-note">
          <span>Original photography. Original content. Six new perspectives.</span>
          <span>React / Vite / Tailwind CSS</span>
        </div>
      </main>
      <footer className="collection-footer">
        <span>AestheticEye</span>
        <span>Every direction includes an interactive homepage.</span>
        <a href="https://www.aestheticeyemd.com/">
          Original website
          <Icon name="arrow" />
        </a>
      </footer>
    </div>
  );
}
