import React, { useState } from 'react';
import './foundation.css';
import ArtDirectedHome from './Experience.jsx';
import Footer from './Footer.jsx';
import Navigation from './navigation/Navigation.jsx';
import { MotionLayer } from './Interactive.jsx';
import { Icon } from './ui/Icons.jsx';
import { designs, getDesign } from './designs.js';

export function jumpToMain(event) {
  event.preventDefault();
  const main = document.getElementById('main');
  main?.scrollIntoView({ behavior: 'instant' });
  main?.focus({ preventScroll: true });
}
function ReviewToolbar({ design }) {
  return (
    <div className="preview-bar">
      <a href="#/">
        <Icon name="back" />
        All designs
      </a>
      <span>
        {design.n} / {design.name}
      </span>
      <div className="preview-design-links">
        {designs.map((item) => (
          <a
            key={item.id}
            href={`#/${item.id}`}
            aria-current={item.id === design.id ? 'page' : undefined}
            aria-label={`View ${item.name}`}
          >
            {item.n}
          </a>
        ))}
      </div>
      <label className="preview-select">
        <span className="sr-only">Choose a design</span>
        <select
          value={design.id}
          onChange={(event) => {
            window.location.hash = `/${event.target.value}`;
          }}
        >
          {designs.map((item) => (
            <option key={item.id} value={item.id}>
              {item.n} / {item.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
// Import into an existing React/Base44 page to show one concept without a new root or router.
export default function Website({ design: designId = 'clarity', reviewTools = false }) {
  const design = getDesign(designId) || designs[0];
  const [contrast, setContrast] = useState(false);
  return (
    <div
      className={`site art-site ${design.id} ${contrast ? 'high-contrast' : ''} ${reviewTools ? 'with-review-tools' : 'client-view'}`}
    >
      <a className="skip-link" href="#main" onClick={jumpToMain}>
        Skip to main content
      </a>
      {reviewTools && <ReviewToolbar design={design} />}
      <MotionLayer route={design.id} />
      <Navigation
        key={`nav-${design.id}`}
        design={['still', 'ease'].includes(design.id) ? 'clarity' : design.id}
        contrast={contrast}
        setContrast={setContrast}
      />
      <ArtDirectedHome key={`page-${design.id}`} design={design.id} />
      <Footer />
      <a className="back-top" href="#main" onClick={jumpToMain} aria-label="Back to top">
        <Icon name="arrow" />
      </a>
    </div>
  );
}
