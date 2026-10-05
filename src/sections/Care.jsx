import React, { useEffect, useId, useRef, useState } from 'react';
import { treatments } from '../content.js';
import { Icon } from '../ui/Icons.jsx';
import { Photo, SectionLabel, TextLink, reducedMotion } from '../ui/Primitives.jsx';
import { adjacentIndex } from '../navigation/model.js';
import './care.css';
import { useMediaQuery } from '../ui/useMediaQuery.js';

function ProcedureText({ treatment, heading = true }) {
  return (
    <div className="procedure-text">
      {heading && <h3>{treatment.title}</h3>}
      <p>{treatment.body}</p>
      <TextLink path={treatment.path}>
        Learn More<span className="sr-only"> about {treatment.title}</span>
      </TextLink>
    </div>
  );
}

function ProcedureTabs({ design }) {
  const narrow = useMediaQuery('(max-width: 740px)');
  const [selected, setSelected] = useState(0);
  const refs = useRef([]);
  const id = useId();
  const treatment = treatments[selected];
  function keys(event, index) {
    const next = adjacentIndex(index, event.key, treatments.length);
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    refs.current[next]?.focus();
  }
  return (
    <div className={`procedure-browser browser-${design}`}>
      <div
        className="procedure-tabs"
        role="tablist"
        aria-label="Cosmetic procedures"
        aria-orientation={
          design === 'serene' ||
          (design === 'clarity' && narrow) ||
          (design === 'modern' && !narrow)
            ? 'vertical'
            : 'horizontal'
        }
      >
        {treatments.map((item, index) => (
          <button
            type="button"
            key={item.title}
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            ref={(element) => {
              refs.current[index] = element;
            }}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => keys(event, index)}
          >
            <span className="procedure-tab-index" aria-hidden="true">
              0{index + 1}
            </span>
            <span>{item.title}</span>
            <Icon name={selected === index ? 'arrow' : 'plus'} />
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        className="procedure-panel"
        role="tabpanel"
        aria-labelledby={`${id}-tab-${selected}`}
        tabIndex={0}
      >
        <div className="procedure-visual" key={treatment.image}>
          <Photo name={treatment.image} />
          <span className="procedure-visual-number" aria-hidden="true">
            0{selected + 1}
          </span>
          <span className="procedure-visual-label">COSMETIC OCULOPLASTIC PROCEDURES</span>
        </div>
        <div className="procedure-panel-copy" key={treatment.title}>
          <span className="procedure-copy-index" aria-hidden="true">
            0{selected + 1} / 03
          </span>
          <ProcedureText treatment={treatment} />
        </div>
      </div>
    </div>
  );
}

function ProcedureDirectory() {
  const [open, setOpen] = useState(0);
  const id = useId();
  return (
    <div className="procedure-directory">
      {treatments.map((treatment, index) => (
        <article
          key={treatment.title}
          className={open === index ? 'directory-procedure is-expanded' : 'directory-procedure'}
        >
          <h3>
            <button
              type="button"
              aria-expanded={open === index}
              aria-controls={`${id}-${index}`}
              onClick={() => setOpen(open === index ? null : index)}
            >
              <span className="directory-procedure-number" aria-hidden="true">
                0{index + 1}
              </span>
              <span>{treatment.title}</span>
              <Icon name={open === index ? 'minus' : 'plus'} />
            </button>
          </h3>
          <div id={`${id}-${index}`} hidden={open !== index} className="directory-procedure-panel">
            <div>
              <span className="procedure-directory-label">COSMETIC</span>
              <ProcedureText treatment={treatment} heading={false} />
            </div>
            <Photo name={treatment.image} />
          </div>
        </article>
      ))}
    </div>
  );
}

function ProcedureStories() {
  return (
    <div className="procedure-stories">
      {treatments.map((treatment, index) => (
        <article key={treatment.title}>
          <div className="procedure-story-photo">
            <Photo name={treatment.image} />
            <span aria-hidden="true">0{index + 1}</span>
          </div>
          <ProcedureText treatment={treatment} />
        </article>
      ))}
    </div>
  );
}

function ProcedureFilmstrip() {
  const [index, setIndex] = useState(0);
  const strip = useRef(null);
  const currentIndex = useRef(index);
  currentIndex.current = index;
  function show(next) {
    const value = (next + treatments.length) % treatments.length;
    setIndex(value);
    strip.current?.scrollTo({
      left: value * strip.current.clientWidth,
      behavior: reducedMotion() ? 'instant' : 'smooth',
    });
  }
  useEffect(() => {
    const observer = new ResizeObserver(() =>
      strip.current?.scrollTo({
        left: currentIndex.current * strip.current.clientWidth,
        behavior: 'instant',
      }),
    );
    if (strip.current) observer.observe(strip.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="procedure-filmstrip">
      <div className="filmstrip-toolbar">
        <span aria-live="polite">
          0{index + 1} / 03 — {treatments[index].title}
        </span>
        <div>
          <button type="button" aria-label="Previous procedure" onClick={() => show(index - 1)}>
            <Icon name="back" />
          </button>
          <button type="button" aria-label="Next procedure" onClick={() => show(index + 1)}>
            <Icon name="right" />
          </button>
        </div>
      </div>
      <div
        className="filmstrip-track"
        ref={strip}
        tabIndex={0}
        role="region"
        aria-label="Cosmetic procedure stories"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            show(index + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
        onScroll={(event) => {
          const width = event.currentTarget.clientWidth;
          if (width)
            setIndex(
              Math.max(
                0,
                Math.min(treatments.length - 1, Math.round(event.currentTarget.scrollLeft / width)),
              ),
            );
        }}
      >
        {treatments.map((treatment, item) => (
          <article key={treatment.title} className="filmstrip-card">
            <div className="filmstrip-photo">
              <Photo name={treatment.image} />
              <span aria-hidden="true">0{item + 1}</span>
            </div>
            <div className="filmstrip-copy">
              <span className="procedure-directory-label">COSMETIC</span>
              <ProcedureText treatment={treatment} />
            </div>
          </article>
        ))}
      </div>
      <div className="filmstrip-pagination" role="group" aria-label="Choose a procedure">
        {treatments.map((treatment, item) => (
          <button
            type="button"
            key={treatment.title}
            aria-pressed={item === index}
            onClick={() => show(item)}
          >
            <span aria-hidden="true">0{item + 1}</span>
            <span>{treatment.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Care({ design = 'clarity', number = 2 }) {
  return (
    <section
      className="section art-care procedures-section"
      id="care"
      data-design={design}
      aria-labelledby="care-title"
    >
      <SectionLabel
        number={number}
        right={<TextLink path="/procedures/">All Oculoplastic Procedures</TextLink>}
      >
        SPECIALIZED CARE
      </SectionLabel>
      <div className="procedures-intro">
        <p className="art-kicker">COSMETIC</p>
        <h2 id="care-title">
          Cosmetic Oculoplastic
          <br />
          <span>Procedures.</span>
        </h2>
      </div>
      {design === 'form' ? (
        <ProcedureDirectory />
      ) : design === 'editorial' ? (
        <ProcedureStories />
      ) : design === 'perspective' ? (
        <ProcedureFilmstrip />
      ) : (
        <ProcedureTabs design={design} />
      )}
      <div className="procedure-payment">
        <span>Payment Options with Cherry</span>
        <a href="https://www.aestheticeyemd.com/payment-plans/">
          Explore payment options
          <Icon name="arrow" />
        </a>
      </div>
    </section>
  );
}
