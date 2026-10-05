import React, { useState } from 'react';
import content from './original.json';
import { ReviewCarousel } from './Interactive.jsx';
import './experience.css';
import Care from './sections/Care.jsx';
import { Photo } from './ui/Primitives.jsx';
import { Icon } from './ui/Icons.jsx';
import Gallery from './sections/Gallery.jsx';
import Contact from './sections/Contact.jsx';
import { usePointerDepth } from './ui/usePointerDepth.js';
import PracticeFilm from './sections/PracticeFilm.jsx';
import ExploreGuide from './sections/ExploreGuide.jsx';
import QuietHero from './sections/QuietHero.jsx';

const ROOT = 'https://www.aestheticeyemd.com';
const BOOK = 'https://l.klara.com/G3yV4TBdY4dUMwAk';
const p = content.paragraphs;
const DOCTORS = 'Jon-Pargament-Ginger-Henson-license-confirmed.jpg';
const A = () => (
  <span aria-hidden="true">
    <Icon name="arrow" />
  </span>
);
function Book({ light = false }) {
  return (
    <a className={'art-book' + (light ? ' light' : '')} href={BOOK}>
      <span>Book An Appointment</span>
      <span className="book-arrow">
        <A />
      </span>
    </a>
  );
}
function More({ href, children }) {
  return (
    <a className="art-more" href={ROOT + href}>
      {children}
      <A />
    </a>
  );
}
function ScrollTo({ id, children, className = '' }) {
  return (
    <a
      className={className}
      href={'#' + id}
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById(id);
        target?.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }}
    >
      {children}
    </a>
  );
}

const categories = [
  ['Cosmetic', '/procedures/'],
  ['Reconstructive', '/oculofacial-reconstructive-surgery/'],
  ['Non-Surgical', '/non-surgical-treatments/'],
];
function ServiceRail() {
  return (
    <div className="art-service-rail">
      {categories.map(([label, href], i) => (
        <a key={label} href={ROOT + href}>
          <span>0{i + 1}</span>
          <strong>{label}</strong>
          <A />
        </a>
      ))}
    </div>
  );
}
function Hero({ design }) {
  const depth = usePointerDepth();
  if (design === 'still' || design === 'ease') return <QuietHero design={design} />;
  if (design === 'clarity')
    return (
      <section className="art-hero clarity-v4">
        <div className="clarity-v4-intro">
          <p className="art-kicker">
            <span className="status-dot" /> CINCINNATI & DAYTON’S ESTABLISHED EYELID EXPERTS
          </p>
          <h1>
            You deserve to
            <br />
            feel{' '}
            <span className="underline-word">
              confident
              <svg viewBox="0 0 400 25" aria-hidden="true">
                <path d="M3 15 Q185 -3 395 16" />
              </svg>
            </span>
            .
          </h1>
          <div className="clarity-v4-actions">
            <Book />
            <PracticeFilm />
          </div>
        </div>
        <div className="clarity-v4-stage">
          <div className="clarity-image-small">
            <Photo name="blog-2-1.jpg" eager />
            <span>
              Looking as happy
              <br />
              as you feel.
            </span>
          </div>
          <div className="clarity-image-main">
            <Photo
              name="schedule.jpg"
              alt="Woman from the original AestheticEye homepage"
              eager
              priority
            />
            <ScrollTo id="gallery" className="clarity-image-caption">
              <span>Your Eyes Deserve Excellence</span>
              <span aria-hidden="true">↗</span>
            </ScrollTo>
          </div>
          <div className="clarity-proof-card">
            <span className="art-kicker">EXPERIENCE. EXPERTISE.</span>
            <strong>
              35<span>+</span>
            </strong>
            <p>years of combined experience</p>
            <div className="tiny-doctors">
              <Photo name={DOCTORS} alt="Dr. Pargament and Dr. Henson" eager />
              <span>
                Dr. Ginger Henson
                <br />
                Dr. Jonathan Pargament
              </span>
            </div>
          </div>
        </div>
        <ServiceRail />
      </section>
    );
  if (design === 'form')
    return (
      <section className="art-hero form-v4">
        <div className="form-v4-intro">
          <div>
            <p className="art-kicker">CINCINNATI AND DAYTON’S</p>
            <h1>
              Established
              <br />
              Eyelid <span>Experts.</span>
            </h1>
          </div>
          <div className="form-v4-intro-right">
            <p>You Deserve to feel confident</p>
            <Book />
          </div>
        </div>
        <div className="form-v4-grid">
          <div className="form-v4-people">
            <Photo
              name={DOCTORS}
              alt="Dr. Jonathan Pargament and Dr. Ginger Henson"
              eager
              priority
            />
            <div className="form-v4-names">
              <a href={ROOT + '/meet-the-team/dr-jonathan-pargament/'}>Dr. Jonathan Pargament</a>
              <a href={ROOT + '/meet-the-team/dr-ginger-henson/'}>Dr. Ginger Henson</a>
            </div>
          </div>
          <div className="form-v4-note">
            <span className="art-kicker">AESTHETICEYE</span>
            <h2>
              Your Eyes
              <br />
              Deserve
              <br />
              <span>Excellence.</span>
            </h2>
            <PracticeFilm />
          </div>
          <div className="form-v4-stat">
            <Photo
              name="header-image.jpg"
              alt="Woman in sunlight from the original website"
              eager
            />
            <div>
              <strong>
                25,000<span>+</span>
              </strong>
              <p>
                eyelid and brow
                <br />
                surgeries performed
              </p>
            </div>
          </div>
        </div>
        <ServiceRail />
      </section>
    );
  if (design === 'perspective')
    return (
      <section className="art-hero perspective-v4">
        <div className="poster-topline">
          <span>CINCINNATI / DAYTON</span>
          <span>OCULOPLASTIC SURGEONS</span>
        </div>
        <div className="poster-stage" {...depth}>
          <div className="poster-portrait">
            <Photo
              name="schedule.jpg"
              alt="Portrait from the original AestheticEye homepage"
              eager
              priority
            />
          </div>
          <h1>
            <span>Your Eyes.</span>
            <span>
              Deserve <em>Excellence.</em>
            </span>
          </h1>
          <span className="poster-side">YOU DESERVE TO FEEL CONFIDENT</span>
          <span className="poster-side right">AESTHETICEYE — OHIO</span>
        </div>
        <div className="poster-bottom">
          <p>
            Cincinnati and Dayton’s
            <br />
            Established Eyelid Experts
          </p>
          <Book light />
          <ScrollTo id="practice" className="poster-scroll">
            <span>Explore</span>
            <span aria-hidden="true">↓</span>
          </ScrollTo>
        </div>
      </section>
    );
  if (design === 'editorial')
    return (
      <section className="art-hero editorial-v4">
        <div className="editorial-titleline">
          <h1>
            AestheticEye<span>.</span>
          </h1>
          <p>
            OCULOPLASTIC <br />
            SURGEONS
          </p>
        </div>
        <div className="editorial-cover">
          <div className="editorial-cover-image">
            <Photo
              name="schedule.jpg"
              alt="Woman from the original AestheticEye homepage"
              eager
              priority
            />
            <span>YOU DESERVE TO FEEL CONFIDENT</span>
          </div>
          <div className="editorial-cover-copy">
            <span className="art-kicker">CINCINNATI & DAYTON</span>
            <h2>
              Established
              <br />
              Eyelid Experts.
            </h2>
            <div className="editorial-rule" />
            <p>{p[4]}</p>
            <Book />
            <PracticeFilm />
          </div>
        </div>
      </section>
    );
  if (design === 'serene')
    return (
      <section className="art-hero serene-v4">
        <div className="serene-title">
          <p className="art-kicker">CINCINNATI & DAYTON’S ESTABLISHED EYELID EXPERTS</p>
          <h1>
            You deserve
            <br />
            to feel <span>confident.</span>
          </h1>
          <Book />
        </div>
        <div className="serene-orbit">
          <div className="serene-portrait">
            <Photo
              name="header-image.jpg"
              alt="Woman in sunlight from the original AestheticEye website"
              eager
              priority
            />
          </div>
          <svg className="orbit-type" viewBox="0 0 500 500" aria-hidden="true">
            <defs>
              <path id="orbit-text" d="M250 25a225 225 0 1 1-.1 0" />
            </defs>
            <text>
              <textPath href="#orbit-text" startOffset="4%">
                AESTHETICEYE · LOOKING AS HAPPY AS YOU FEEL ·
              </textPath>
            </text>
          </svg>
          <span className="serene-seal">
            <Photo name="logo-grey.png" />
            <span>AE</span>
          </span>
        </div>
        <div className="serene-bottom">
          <PracticeFilm />
          <p>
            35+ years
            <br />
            <span>of combined experience</span>
          </p>
          <ScrollTo id="care" className="serene-scroll">
            Explore our care <span aria-hidden="true">↓</span>
          </ScrollTo>
        </div>
      </section>
    );
  return (
    <section className="art-hero modern-v4">
      <div className="modern-v4-grid">
        <div className="modern-v4-copy">
          <p className="art-kicker">AESTHETICEYE / CINCINNATI & DAYTON</p>
          <h1>
            Your Eyes.
            <br />
            Deserve
            <br />
            <span>Excellence.</span>
          </h1>
          <div className="modern-v4-actions">
            <Book light />
            <PracticeFilm />
          </div>
        </div>
        <div className="modern-v4-photo">
          <Photo name={DOCTORS} alt="Dr. Jonathan Pargament and Dr. Ginger Henson" eager priority />
          <div>
            <span>
              YOU DESERVE
              <br />
              TO FEEL CONFIDENT
            </span>
            <span className="modern-photo-index">01 — 02</span>
          </div>
        </div>
      </div>
      <ServiceRail />
    </section>
  );
}

function TrustBand({ design }) {
  return (
    <section className="art-trust" aria-label="Experience and recognition">
      <div className="trust-number">
        <strong>
          35<span>+</span>
        </strong>
        <p>
          years of combined
          <br />
          experience
        </p>
      </div>
      <div className="trust-awards">
        <Photo
          name="Top-Docs-Logo-2021-2025-1-300x230.jpg"
          alt="2021–2025 Top Doctors Cincinnati Magazine"
        />
        <Photo
          name="2025-CC-TD-license-confirmed-1-198x300.webp"
          alt="Castle Connolly Top Doctors 2025"
        />
      </div>
      <div className="trust-number">
        <strong>
          25,000<span>+</span>
        </strong>
        <p>
          eyelid and brow
          <br />
          surgeries performed
        </p>
      </div>
    </section>
  );
}

function Practice({ number = 1 }) {
  const [about, setAbout] = useState(false);
  return (
    <section className="section art-practice" id="practice">
      <div className="art-section-label">
        <span>{String(number).padStart(2, '0')} / THE PRACTICE</span>
        <span>AESTHETICEYE</span>
      </div>
      <div className="art-practice-grid">
        <div className="practice-heading">
          <p className="art-kicker">YOU DESERVE TO FEEL CONFIDENT</p>
          <h2>
            Eyelid Surgery Specialists in Cincinnati and Dayton<span>.</span>
          </h2>
          <div className="practice-statement">
            <p>{p[4]}</p>
            <button
              className="art-expand"
              aria-expanded={about}
              aria-controls="practice-about"
              onClick={() => setAbout(!about)}
            >
              About our practice <span aria-hidden="true">{about ? '−' : '+'}</span>
            </button>
            <div id="practice-about" className="practice-about" hidden={!about}>
              <h3>Welcome to AestheticEye</h3>
              <p>{p[6]}</p>
            </div>
          </div>
        </div>
        <div className="practice-portrait">
          <Photo name={DOCTORS} alt="Dr. Jonathan Pargament and Dr. Ginger Henson" />
          <div className="doctor-caption">
            <a href={ROOT + '/meet-the-team/dr-jonathan-pargament/'}>
              <span>Dr. Jonathan Pargament</span>
              <A />
            </a>
            <a href={ROOT + '/meet-the-team/dr-ginger-henson/'}>
              <span>Dr. Ginger Henson</span>
              <A />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Affiliations() {
  return (
    <section className="art-affiliations">
      <h2>Professional Affiliations</h2>
      <div>
        {content.imgs
          .filter((i) =>
            [
              'University of Cincinnati',
              'American Academy Of Ophthalmology',
              'Asoprs',
              'ACS American College Of Surgeons',
              'American Board of Ophthalmology',
              'Cincinnati Top Doctors 2024',
            ].includes(i.alt),
          )
          .map((i) => (
            <Photo key={i.src} name={i.src.split('/').pop()} alt={i.alt} />
          ))}
      </div>
    </section>
  );
}

const steps = [
  'Schedule an appointment.',
  'Collaborate with our surgeons to develop a custom surgical plan.',
  'Prepare for a successful recovery!',
];
function Journey() {
  const [step, setStep] = useState(0);
  return (
    <section className="section art-journey">
      <div className="journey-intro">
        <p className="art-kicker">YOUR EXPERIENCE</p>
        <h2>We care deeply about helping you look the way you feel to restore your confidence.</h2>
      </div>
      <div className="journey-layout">
        <div className="journey-photo">
          <Photo
            name={step === 1 ? DOCTORS : step === 0 ? 'schedule.jpg' : 'header-image.jpg'}
            alt={step === 1 ? 'Dr. Pargament and Dr. Henson' : 'Original AestheticEye photography'}
          />
          <span className="journey-photo-step" aria-hidden="true">
            0{step + 1}
          </span>
        </div>
        <div className="journey-steps">
          {steps.map((s, i) => (
            <button key={s} aria-pressed={step === i} onClick={() => setStep(i)}>
              <span aria-hidden="true">0{i + 1}</span>
              <span className="journey-step-title">{s}</span>
              <span aria-hidden="true">
                <Icon name={step === i ? 'check' : 'right'} />
              </span>
            </button>
          ))}
          <Book />
        </div>
      </div>
    </section>
  );
}

function Specialty() {
  const [selected, setSelected] = useState('reconstructive');
  const reconstructive = selected === 'reconstructive';
  return (
    <section className="section art-specialty">
      <div className="art-section-label">
        <span>04 / A PERSONAL APPROACH</span>
        <span>AESTHETICEYE</span>
      </div>
      <div className="specialty-switch" role="group" aria-label="More treatment options">
        <button aria-pressed={reconstructive} onClick={() => setSelected('reconstructive')}>
          Reconstructive
        </button>
        <button aria-pressed={!reconstructive} onClick={() => setSelected('non-surgical')}>
          Non-Surgical
        </button>
      </div>
      <div className="specialty-layout">
        <div className="specialty-image">
          <Photo name={reconstructive ? 'Text-Section-1.jpg' : 'Services.jpg'} />
          {!reconstructive && (
            <Photo
              className="specialty-sofwave"
              name="Sofwave-Logo-White.license-confirmed-300x98.png"
              alt="Sofwave"
            />
          )}
        </div>
        <div className="specialty-copy">
          <p className="art-kicker">{reconstructive ? p[11] : p[16]}</p>
          <h2>
            {reconstructive
              ? 'Your Eyes Deserve Excellence'
              : 'Non-Surgical Enhancements to Reclaim Your Youth'}
          </h2>
          <p>{reconstructive ? p[12] : p[17]}</p>
          {reconstructive ? (
            <>
              <details className="art-details">
                <summary>
                  Why Choose AestheticEye?{' '}
                  <span aria-hidden="true">
                    <Icon name="plus" />
                  </span>
                </summary>
                <div>
                  <p className="art-kicker">{p[13]}</p>
                  <p>{p[14]}</p>
                </div>
              </details>
              <More href="/oculofacial-reconstructive-surgery/">
                Reconstructive Surgery Procedures
              </More>
              <div className="specialty-links">
                {[
                  ['Eyelid Malposition', 'eyelid-malposition-repair'],
                  ['Eyebrow and Eyelid Ptosis', 'ptosis-or-droopy-eyelids'],
                  [
                    'Skin Cancer Reconstructions',
                    'reconstructive-surgery-after-eyelid-skin-cancer',
                  ],
                  ['Tear Drain Repair Surgery', 'surgical-treatment-of-tearing'],
                ].map(([t, u]) => (
                  <a key={u} href={ROOT + '/' + u + '/'}>
                    {t}
                    <A />
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              <More href="/non-surgical-treatments/">Non-Surgical Treatments</More>
              <div className="specialty-links">
                {[
                  ['Sofwave', 'sofwave'],
                  ['Dark Circle Treatment (Eye Bags)', 'dark-circle-under-eye-treatment'],
                  ['Eyelid Scar Tretments', 'eyelid-scar-treatments'],
                  ['Facial Fillers', 'facial-fillers'],
                  ['Non-surgical Eyelid Lift', 'non-surgical-eyelid-lift'],
                  ['Skin Conditions', 'cosmetic-skin-treatments'],
                  ['Injectables', 'injectables'],
                ].map(([t, u]) => (
                  <a key={u} href={ROOT + '/' + u + '/'}>
                    {t}
                    <A />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Articles() {
  return (
    <section className="section art-articles">
      <div className="art-section-label">
        <span>05 / OUR ARTICLES</span>
        <More href="/blog/">Read Our Blog</More>
      </div>
      <div className="article-grid">
        {content.articles.map((a, i) => (
          <article key={a.href}>
            <span className="article-number" aria-hidden="true">
              0{i + 1}
            </span>
            <p className="art-kicker">{a.date}</p>
            <h3>
              <a href={a.href}>{a.title}</a>
            </h3>
            <p>{a.body}</p>
            <a className="art-more" href={a.href}>
              Continue reading<span className="sr-only"> about {a.title}</span>
              <A />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
export default function ArtDirectedHome({ design }) {
  const heroDesign = design;
  if (design === 'still' || design === 'ease') design = 'clarity';
  return (
    <main id="main" tabIndex={-1} className={'art-experience art-' + design}>
      <Hero design={heroDesign} />
      <TrustBand design={design} />
      {design === 'form' || design === 'modern' ? (
        <>
          <Care design={design} number={1} />
          <Practice number={2} />
        </>
      ) : (
        <>
          <Practice />
          <Care design={design} />
        </>
      )}
      <ExploreGuide design={design} />
      <Gallery design={design} />
      <ReviewCarousel design={design} />
      <Affiliations />
      <Journey />
      <Specialty />
      <Articles />
      <Contact design={design} />
    </main>
  );
}
