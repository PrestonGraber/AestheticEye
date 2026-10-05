import React, { useState } from 'react';
import FavoriteFeedback from './FavoriteFeedback.jsx';
import ConceptPreview from './ConceptPreview.jsx';
import BrandMark from './ui/BrandMark.jsx';
import { designs } from './designs.js';
import { Icon } from './ui/Icons.jsx';
import './collection.css';

const STORAGE_KEY = 'aestheticeye-design-favorites-v1';
const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

export function readFavorites() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const value = JSON.parse(saved);
      if (Array.isArray(value))
        return [...new Set(value.filter((id) => designs.some((design) => design.id === id)))];
    }
    const legacy = JSON.parse(window.localStorage.getItem('aestheticeye-design-shortlist-v1'));
    return [
      ...new Set([
        'clarity',
        ...(Array.isArray(legacy)
          ? legacy.filter((id) => designs.some((design) => design.id === id))
          : []),
      ]),
    ];
  } catch {
    return ['clarity'];
  }
}

function DesignCard({ design, saved, toggle }) {
  return (
    <article className={`design-card preview-${design.id}`}>
      <div className="card-label">
        <span>DIRECTION {design.n}</span>
        <button
          type="button"
          className="favorites-button"
          aria-pressed={saved}
          aria-label={`${saved ? 'Remove' : 'Add'} ${design.name} ${saved ? 'from' : 'to'} favorites`}
          onClick={() => toggle(design.id)}
        >
          <Icon name={saved ? 'check' : 'plus'} />
          <span>{saved ? 'Favorited' : 'Favorite'}</span>
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
  const [favorites, setFavorites] = useState(readFavorites);
  const [filter, setFilter] = useState('all');
  function toggle(id) {
    setFavorites((previous) => {
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
      (filter === 'favorites' ? favorites.includes(design.id) : design.tone === filter),
  );

  return (
    <div className="design-collection">
      <header className="collection-header">
        <a className="collection-brand" href="#/" aria-label="AestheticEye design collection">
          <BrandMark />
        </a>
        <span className="collection-edition">DESIGN EXPLORATIONS</span>
        <span className="collection-count">EIGHT DIRECTIONS / ONE PRACTICE</span>
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
              Eight distinct directions.
              <br />
              One exceptional practice.
            </p>
            <span>
              Explore a homepage. Try the navigation.
              <br />
              Favorite the directions you want to keep.
            </span>
          </div>
        </div>
        <div className="collection-controls">
          <div className="collection-filters" role="group" aria-label="Filter design directions">
            {[
              ['all', 'All directions'],
              ['light', 'Light'],
              ['dark', 'Dark'],
              ['favorites', 'Favorites'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
                {value === 'favorites' && (
                  <span>{favorites.length.toString().padStart(2, '0')}</span>
                )}
              </button>
            ))}
          </div>
          <span className="collection-result-count" role="status" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'direction' : 'directions'}
          </span>
        </div>
        <a
          className="feedback-jump"
          href="#design-feedback"
          onClick={(event) => {
            event.preventDefault();
            document
              .getElementById('design-feedback')
              ?.scrollIntoView({
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                  ? 'instant'
                  : 'smooth',
              });
            document.getElementById('feedback-heading')?.focus({ preventScroll: true });
          }}
        >
          Review favorites & send feedback <Icon name="arrow" />
        </a>
        {visible.length ? (
          <div className="design-grid">
            {visible.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
                saved={favorites.includes(design.id)}
                toggle={toggle}
              />
            ))}
          </div>
        ) : (
          <div className="favorites-empty">
            <Icon name="plus" />
            <h2>Your favorites start here.</h2>
            <p>Use the Favorite button on a design to save it for comparison.</p>
            <button type="button" onClick={() => setFilter('all')}>
              Explore all directions
              <Icon name="right" />
            </button>
          </div>
        )}
        <FavoriteFeedback favorites={favorites} toggle={toggle} />
        <div className="collection-note">
          <span>Original photography. Original content. Eight new perspectives.</span>
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
