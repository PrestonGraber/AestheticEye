import React, { useId, useState } from 'react';
import { Icon } from '../ui/Icons.jsx';

export default function ComparisonViewer({ image, title }) {
  const [mode, setMode] = useState('compare');
  const [reveal, setReveal] = useState(50);
  const help = useId();
  return (
    <div className="case-comparison">
      <div className="case-view-switch" role="group" aria-label={`${title} photo view`}>
        <button type="button" aria-pressed={mode === 'compare'} onClick={() => setMode('compare')}>
          Compare
        </button>
        <button
          type="button"
          aria-pressed={mode === 'original'}
          onClick={() => setMode('original')}
        >
          Original photo
        </button>
      </div>
      {mode === 'compare' ? (
        <div className="case-wipe" style={{ '--reveal': `${reveal}%` }}>
          <div
            className="case-wipe-photo before"
            style={{
              backgroundImage: `url("${image.src.startsWith('media/') ? '/' + image.src : image.src}")`,
            }}
          />
          <div
            className="case-wipe-photo after"
            style={{
              backgroundImage: `url("${image.src.startsWith('media/') ? '/' + image.src : image.src}")`,
              clipPath: `inset(0 ${100 - reveal}% 0 0)`,
            }}
          />
          <div className="case-wipe-labels" aria-hidden="true">
            <span style={{ visibility: reveal > 12 ? 'visible' : 'hidden' }}>After</span>
            <span style={{ visibility: reveal < 88 ? 'visible' : 'hidden' }}>Before</span>
          </div>
          <div className="case-wipe-divider" aria-hidden="true">
            <span>
              <Icon name="compare" />
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={reveal}
            onChange={(e) => setReveal(Number(e.target.value))}
            aria-label={`Compare before and after ${title}`}
            aria-describedby={help}
            aria-valuetext={`${reveal}% of the after photograph visible`}
          />
        </div>
      ) : (
        <img
          className="case-original-photo"
          src={image.src.startsWith('media/') ? '/' + image.src : image.src}
          alt={image.alt || `Original before and after ${title}`}
          loading="lazy"
        />
      )}
      <p className="case-comparison-help" id={help}>
        {mode === 'compare'
          ? 'Drag to compare. Use arrow keys when focused.'
          : 'The complete, unaltered before-and-after photograph.'}
      </p>
    </div>
  );
}
