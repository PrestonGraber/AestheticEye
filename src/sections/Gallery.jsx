import React, { useRef, useState } from 'react';
import { asset, galleryCases, SITE_URL } from '../content.js';
import { Icon } from '../ui/Icons.jsx';
import { Photo, SectionLabel, TextLink } from '../ui/Primitives.jsx';
import { useModal } from '../ui/useModal.js';
import './gallery.css';

export default function Gallery({ design = 'clarity', number = 3, initialMode = 'original' }) {
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState(initialMode);
  const [reveal, setReveal] = useState(50);
  const modal = useModal();
  const touchStart = useRef(null);
  const swiped = useRef(false);
  const current = galleryCases[selected];
  const originalUrl = `${SITE_URL}/gallery/${current.path}/`;

  function select(index) {
    setSelected((index + galleryCases.length) % galleryCases.length);
    setReveal(50);
  }

  return (
    <section
      className="section gallery-section"
      id="gallery"
      data-design={design}
      aria-labelledby="gallery-title"
    >
      <SectionLabel number={number} right={<TextLink path="/gallery/">View Our Gallery</TextLink>}>
        BEFORE & AFTER
      </SectionLabel>
      <div className="gallery-composition">
        <div className="gallery-editorial">
          <p className="art-kicker">BEFORE & AFTER GALLERY</p>
          <h2 id="gallery-title">
            A different
            <br />
            <span>perspective.</span>
          </h2>
          <div className="gallery-categories" role="group" aria-label="Choose a gallery category">
            {galleryCases.map((item, index) => (
              <button
                type="button"
                key={item.title}
                aria-pressed={selected === index}
                onClick={() => select(index)}
              >
                <span className="gallery-category-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>{item.title}</span>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
          <div className="gallery-context">
            <Icon name={mode === 'original' ? 'arrow' : 'compare'} />
            <p>
              {mode === 'original' ? (
                <>
                  Original photographs.
                  <br />
                  Explore the before & after gallery.
                </>
              ) : (
                <>
                  Drag to compare.
                  <br />
                  Use arrow keys for precise control.
                </>
              )}
            </p>
          </div>
          <TextLink path={originalUrl}>View {current.title}</TextLink>
        </div>
        <div className="gallery-workspace">
          <div className="gallery-toolbar">
            <div className="gallery-mode" role="group" aria-label="Photograph viewing mode">
              <button
                type="button"
                aria-pressed={mode === 'original'}
                onClick={() => setMode('original')}
              >
                Original
              </button>
              <button
                type="button"
                aria-pressed={mode === 'compare'}
                onClick={() => setMode('compare')}
              >
                <Icon name="compare" />
                Compare
              </button>
            </div>
            <span
              className="gallery-current-count"
              role="status"
              aria-label={`Gallery category ${selected + 1} of ${galleryCases.length}`}
            >
              0{selected + 1} / 04
            </span>
          </div>
          {mode === 'original' ? (
            <button
              type="button"
              className="gallery-original"
              onPointerDown={(event) => {
                if (event.pointerType !== 'touch') swiped.current = false;
              }}
              onTouchStart={(event) => {
                swiped.current = false;
                const touch = event.touches.length === 1 ? event.touches[0] : null;
                touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
              }}
              onTouchCancel={() => {
                touchStart.current = null;
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                touchStart.current = null;
                const touch = event.changedTouches[0];
                if (!start || !touch) return;
                const dx = touch.clientX - start.x;
                const dy = touch.clientY - start.y;
                if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
                swiped.current = true;
                select(selected + (dx < 0 ? 1 : -1));
              }}
              onClick={(event) => {
                if (swiped.current && event.detail !== 0) {
                  swiped.current = false;
                  return;
                }
                modal.show();
              }}
              aria-label={`Enlarge original ${current.title} photographs`}
            >
              <Photo name={current.image} alt={`Original before and after ${current.title}`} />
              <span className="gallery-zoom">
                <Icon name="plus" />
                <span>View original</span>
              </span>
            </button>
          ) : (
            <div className="gallery-comparison" style={{ '--reveal': `${reveal}%` }}>
              <div
                className="gallery-comparison-photo before"
                style={{ backgroundImage: `url("${asset(current.image)}")` }}
              />
              <div
                className="gallery-comparison-photo after"
                style={{
                  backgroundImage: `url("${asset(current.image)}")`,
                  clipPath: `inset(0 ${100 - reveal}% 0 0)`,
                }}
              />
              <div className="gallery-comparison-labels" aria-hidden="true">
                <span style={{ visibility: reveal > 9 ? 'visible' : 'hidden' }}>AFTER</span>
                <span style={{ visibility: reveal < 91 ? 'visible' : 'hidden' }}>BEFORE</span>
              </div>
              <div className="gallery-comparison-divider" aria-hidden="true">
                <span>
                  <Icon name="compare" />
                </span>
              </div>
              <input
                type="range"
                className="gallery-range"
                min="0"
                max="100"
                value={reveal}
                onChange={(event) => setReveal(Number(event.target.value))}
                aria-label={`Compare before and after ${current.title}`}
                aria-valuetext={`${reveal}% of the after photograph visible`}
              />
            </div>
          )}
          <div className="gallery-caption">
            <span>{current.title}</span>
            <div>
              <button
                type="button"
                aria-label="Previous gallery category"
                onClick={() => select(selected - 1)}
              >
                <Icon name="back" />
              </button>
              <button
                type="button"
                aria-label="Next gallery category"
                onClick={() => select(selected + 1)}
              >
                <Icon name="right" />
              </button>
            </div>
          </div>
          <div
            className="gallery-contact-sheet"
            role="group"
            aria-label="Preview gallery photographs"
          >
            {galleryCases.map((item, index) => (
              <button
                key={item.image}
                type="button"
                aria-label={`Show ${item.title} photographs`}
                aria-pressed={selected === index}
                onClick={() => select(index)}
              >
                <Photo name={item.image} alt="" />
                <span aria-hidden="true">0{index + 1}</span>
              </button>
            ))}
          </div>
          {mode === 'compare' && (
            <div className="gallery-comparison-tools">
              <div role="group" aria-label="Comparison position">
                <button type="button" onClick={() => setReveal(0)}>
                  Before
                </button>
                <button type="button" onClick={() => setReveal(50)}>
                  50 / 50
                </button>
                <button type="button" onClick={() => setReveal(100)}>
                  After
                </button>
              </div>
              <button type="button" onClick={modal.show}>
                View full original
                <Icon name="arrow" />
              </button>
            </div>
          )}
          <p className="gallery-integrity-note">
            {mode === 'compare'
              ? 'Cropped comparison view. Open the original to see the full photographs.'
              : 'Original photographs from AestheticEye’s before & after gallery.'}
          </p>
        </div>
      </div>
      <dialog
        {...modal.dialogProps}
        className="gallery-dialog gallery-viewer"
        aria-label="Original before and after photographs"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            select(selected + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        <div>
          <button
            type="button"
            autoFocus
            className="dialog-close"
            aria-label="Close original photographs"
            onClick={modal.close}
          >
            <Icon name="close" />
          </button>
          <Photo name={current.image} alt={`Original before and after ${current.title}`} eager />
          <footer>
            <span aria-live="polite">{current.title}</span>
            <div className="gallery-viewer-controls">
              <button
                type="button"
                aria-label="Previous original photograph"
                onClick={() => select(selected - 1)}
              >
                <Icon name="back" />
              </button>
              <button
                type="button"
                aria-label="Next original photograph"
                onClick={() => select(selected + 1)}
              >
                <Icon name="right" />
              </button>
            </div>
            <a href={originalUrl}>
              View gallery
              <Icon name="arrow" />
            </a>
          </footer>
        </div>
      </dialog>
    </section>
  );
}
