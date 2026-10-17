import React, { useEffect, useMemo, useState } from 'react';
import sourcePages from './page-index.json';
import Navigation from '../navigation/Navigation.jsx';
import AccessibilityControls from '../ui/AccessibilityControls.jsx';
import Footer from '../Footer.jsx';
import { BookLink } from '../ui/Primitives.jsx';
import { jumpToMain } from '../Website.jsx';
import './pages.css';
import { useFormEmbeds } from './useFormEmbeds.js';
import PaymentPlans from './PaymentPlans.jsx';
import ComparisonViewer from './ComparisonViewer.jsx';
import TreatmentArticle, { splitIntroduction, splitTreatmentContent } from './TreatmentArticle.jsx';
import CareArticle, { careLabel, readingLabel } from './CareArticle.jsx';
import './subpage-refinement.css';
import ResourceDirectory from './ResourceDirectory.jsx';
import JournalArticle from './JournalArticle.jsx';
import TeamBiography, { TeamDirectory } from './TeamBiography.jsx';
import PracticeContent from './PracticeContent.jsx';

export const pages = sourcePages;
export const pageFor = (route) =>
  pages.find((p) => p.path === '/' + route.split('?')[0].replace(/^\/+|\/+$/g, '') + '/');
const hrefFor = (page) => '#' + page.path;
function Contents({ page, active, navigate, treatment, care }) {
  if (!page.headings.length) return null;
  const label = (h) =>
    /^Frequently Asked/i.test(h.title)
      ? 'Frequently asked questions'
      : /^Schedule Your Consultation/i.test(h.title)
        ? 'Your consultation'
        : care ? careLabel(h.title) : readingLabel(h.title);
  return (
    <aside className="page-contents">
      <nav aria-label="On this page">
        <p>ON THIS PAGE</p>
        <label className="mobile-section-picker">
          Jump to a section
          <select value={active || page.headings[0].id} onChange={(e) => navigate(e.target.value)}>
            {page.headings.map((h) => (
              <option key={h.id} value={h.id}>
                {label(h)}
              </option>
            ))}
          </select>
        </label>
        <div className="desktop-section-links">
          {page.headings.map((h, i) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              aria-current={active === h.id ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault();
                navigate(h.id);
              }}
            >
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              {label(h)}
            </a>
          ))}
        </div>
      </nav>
      {treatment && (
        <div className="reading-consultation">
          <p>Talk with our specialists</p>
          <BookLink />
        </div>
      )}
    </aside>
  );
}
function PageCards({ items, gallery = false, pageNumber = 1 }) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(12);
  const filtered = items.filter((p) =>
    (p.title + ' ' + p.crumbs.map((c) => c.title).join(' '))
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <section className="page-directory" aria-label={gallery ? 'Patient gallery' : 'Explore pages'}>
      <label className="directory-search">
        {gallery ? 'Find a procedure or patient case' : 'Find an article or page'}
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(12);
          }}
          placeholder={gallery ? 'Search gallery…' : 'Search…'}
        />
      </label>
      <p className="directory-count" role="status">
        {filtered.length} {gallery ? 'cases' : 'articles'}
      </p>
      <div className={`page-cards ${gallery ? 'case-cards' : ''}`}>
        {(gallery ? filtered.slice(0, limit) : query.trim() ? filtered : filtered.slice((pageNumber - 1) * 9, pageNumber * 9)).map((p) =>
          gallery ? (
            <article className="page-card case-card" key={p.path}>
              <div className="case-card-heading">
                <span>{p.crumbs.at(-1)?.title}</span>
                <h2>
                  <a href={hrefFor(p)}>Patient {p.title}</a>
                </h2>
              </div>
              {p.images[0] && <ComparisonViewer image={p.images[0]} title={`Patient ${p.title}`} />}
              <a className="case-details-link" href={hrefFor(p)}>
                View case details <span aria-hidden="true">↗</span>
              </a>
            </article>
          ) : (
            <a className="page-card" href={hrefFor(p)} key={p.path}>
              {p.images[0] && (
                <img
                  src={'/' + p.images[0].src.replace(/^\//, '')}
                  alt={p.images[0].alt}
                  loading="lazy"
                />
              )}
              <div>
                <span>{gallery ? p.crumbs.at(-1)?.title : p.category}</span>
                <h2>{gallery ? 'Patient ' + p.title : p.title}</h2>
                {!gallery && p.date && (
                  <time dateTime={p.date}>
                    {new Date(p.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                )}
                <span className="card-read">
                  {gallery ? 'View before & after' : 'Read more'} <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>
          ),
        )}
      </div>
      {!filtered.length && <p>No matches. Try another search.</p>}
      {gallery && limit < filtered.length && (
        <button className="gallery-load-more" type="button" onClick={() => setLimit((n) => n + 12)}>
          Show more cases <span>({filtered.length - limit} remaining)</span>
        </button>
      )}
    </section>
  );
}
export default function ContentPage({ page: requestedPage, initialHtml = null }) {
  const page = pages.find((p) => p.path === requestedPage?.path);
  const [contrast, setContrast] = useState(false);
  const [content, setContent] = useState(
    () =>
      initialHtml ??
      (typeof window !== 'undefined' && window.__INITIAL_PAGE__?.path === requestedPage?.path
        ? window.__INITIAL_PAGE__.html
        : null),
  );
  const [error, setError] = useState(false);
  useFormEmbeds(content);
  const [open, setOpen] = useState(() => new Set(page?.headings.slice(0, 1).map((h) => h.id)));
  const [active, setActive] = useState(page?.headings[0]?.id);
  const isCare = /(?:care-instructions|post-operative|pre-operative)/i.test(page?.path || '') && page?.headings.length > 0;
  const isResourceDirectory = ['/patient-resources/', '/aesthetic-and-laser-resources/', '/pre-and-post-surgical-resources/'].includes(page?.path);
  const isTreatment =
    !isCare &&
    page?.category === 'AestheticEye' &&
    page.headings.length >= 3 &&
    !['/about/', '/sitemap/', '/oculoplastics-consultation/', '/blepahroplasty-quiz/'].includes(
      page.path,
    );
  function navigate(id) {
    setOpen((current) => new Set([...current, id]));
    setActive(id);
    requestAnimationFrame(() => {
      const section = document.getElementById(id);
      section?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
      const heading = section?.querySelector('h2') || section;
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    });
  }
  useEffect(() => {
    if (!content || !page) return;
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = page.headings[0]?.id;
        for (const h of page.headings) {
          const el = document.getElementById(h.id);
          if (el && el.getBoundingClientRect().top <= 210) current = h.id;
        }
        setActive(current);
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(frame);
    };
  }, [content, page]);
  useEffect(() => {
    if (!page) return;
    if (initialHtml !== null || window.__INITIAL_PAGE__?.path === page.path) return;
    const controller = new AbortController();
    setContent(null);
    setError(false);
    fetch(`${import.meta.env.BASE_URL}content/${page.contentFile}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Content unavailable');
        return r.json();
      })
      .then((data) =>
        setContent(
          data.html
            .replaceAll('src="media/', 'src="/media/')
            .replaceAll('href="media/', 'href="/media/'),
        ),
      )
      .catch((e) => {
        if (e.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [page]);
  useEffect(() => {
    if (content === null) return;
    const section = new URLSearchParams(
      window.location.hash.split('?')[1] || window.location.search,
    ).get('section');
    if (section) navigate(section);
  }, [content]);
  const isCase = page?.path.startsWith('/gallery/patient/');
  const caseText = useMemo(() => {
    if (!isCase || !content) return '';
    const doc = new DOMParser().parseFromString(content, 'text/html');
    doc.querySelectorAll('a').forEach((a) => {
      if (a.querySelector('img')) a.remove();
    });
    doc.querySelectorAll('img').forEach((i) => i.remove());
    return doc.body.innerHTML;
  }, [isCase, content]);
  const isGallery = page?.path.startsWith('/gallery/') && !isCase;
  const isBlog = page?.path === '/blog/' || /^\/blog\/page\//.test(page?.path || '');
  const isJournalArticle = page?.category === 'Journal' && !isBlog;
  const galleryImages = new Set(page?.images.map((i) => i.src));
  const galleryCases = isGallery
    ? pages.filter(
        (p) =>
          p.path.startsWith('/gallery/patient/') &&
          (page.path === '/gallery/' ||
            p.crumbs.some((c) => c.href === '#' + page.path) ||
            p.images.some((i) => galleryImages.has(i.src))),
      )
    : [];
  const title = isCase ? `Patient ${page.title}` : page?.title || 'Page not found';
  const treatmentLead = useMemo(() => {
    if (!isTreatment || !content) return '';
    const lead = splitIntroduction(splitTreatmentContent(content).intro).lead;
    return /<(?:img|iframe|h[2-6]|nav|blockquote)\b/i.test(lead) ? '' : lead;
  }, [isTreatment, content]);
  return (
    <div
      className={`site art-site clarity client-view content-site ${page?.path === '/about/' ? 'about-page' : ''} ${page?.path === '/contact/' ? 'contact-page' : ''} ${isGallery ? 'gallery-page' : ''} ${isJournalArticle ? 'journal-page' : ''} ${isCare ? 'care-page' : ''} ${isTreatment ? 'treatment-page' : ''} ${isCase ? 'case-page' : ''} ${contrast ? 'high-contrast' : ''}`}
    >
      <a className="skip-link" href="#main" onClick={jumpToMain}>
        Skip to main content
      </a>
      <Navigation design="clarity" contrast={contrast} setContrast={setContrast} homeHref="#/" />
      <main id="main" tabIndex={-1}>
        <header className="content-hero">
          <nav aria-label="Breadcrumb">
            <a href="#/">Home</a>
            {page?.crumbs
              .filter((c) => c.title !== 'Home' && c.href !== '#' + page.path)
              .map((c, i) => (
                <React.Fragment key={i}>
                  <span aria-hidden="true">/</span>
                  <a href={c.href}>{c.title}</a>
                </React.Fragment>
              ))}
          </nav>

          <div className={isTreatment ? 'treatment-hero-layout' : undefined}>
          <div className="treatment-hero-copy">
          <h1>{title}</h1>
          {isTreatment && treatmentLead && <div className="treatment-hero-summary" dangerouslySetInnerHTML={{ __html: treatmentLead }} />}
          {(isGallery || isCase) && <div className="content-hero-bottom">
            <span>
              {isGallery
                ? 'Before & after photographs from our practice'
                : isCase
                  ? page.crumbs.at(-1)?.title
                  : 'AestheticEye · Cincinnati & Dayton'}
            </span>
          </div>}
          {isTreatment && <div className="treatment-hero-actions">
            <BookLink />
          </div>}
          </div>
          </div>
          {isCare && <div className="care-actions">
            <button type="button" onClick={() => window.print()}>Print instructions <span aria-hidden="true">↗</span></button>
            <a href="#/patient-resources/">All patient resources <span aria-hidden="true">→</span></a>
          </div>}
        </header>
        {!page ? (
          <section className="content-body">
            <p>We couldn’t find that page.</p>
            <a href="#/">Return home</a>
          </section>
        ) : (
          <>
            {isGallery && (
              <nav className="gallery-filter-links" aria-label="Gallery categories">
                <label className="gallery-category-picker">Treatment
                  <select value={'#' + page.path} onChange={event => { window.location.hash = event.target.value; }}>
                    <option value="#/gallery/">All results</option>
                    {pages.filter(p => p.path.startsWith('/gallery/') && !p.path.includes('/patient/') && p.path !== '/gallery/').map(p => <option key={p.path} value={hrefFor(p)}>{p.title.replace(/^Gallery:\s*/i, '')}</option>)}
                  </select>
                </label>
                <a href="#/gallery/" aria-current={page.path === '/gallery/' ? 'page' : undefined}>
                  All results
                </a>
                {pages
                  .filter(
                    (p) =>
                      p.path.startsWith('/gallery/') &&
                      !p.path.includes('/patient/') &&
                      p.path !== '/gallery/' &&
                      !['/gallery/lower-eyelid-surgery/', '/gallery/ptosis-surgery/'].includes(
                        p.path,
                      ),
                  )
                  .map((p) => (
                    <a
                      key={p.path}
                      href={hrefFor(p)}
                      aria-current={p.path === page.path ? 'page' : undefined}
                    >
                      {p.title.replace(/^Gallery:\s*/i, '')}
                    </a>
                  ))}
              </nav>
            )}
            {page.path === '/payment-plans/' ? (
              <PaymentPlans />
            ) : page.path === '/meet-the-team/' && content !== null && !error ? (
              <TeamDirectory html={content} />
            ) : page.path.startsWith('/meet-the-team/') && content !== null && !error ? (
              <TeamBiography html={content} page={page} />
            ) : isResourceDirectory && content !== null && !error ? (
              <ResourceDirectory key={page.path} html={content} />
            ) : isBlog || (isGallery && galleryCases.length) ? (
              <PageCards
                key={page.path}
                gallery={isGallery}
                pageNumber={Number(page.path.match(/page\/(\d+)/)?.[1] || 1)}
                items={
                  isBlog
                    ? pages
                        .filter(
                          (p) =>
                            p.path.startsWith('/blog/') && !/^\/blog\/(page\/\d+\/)?$/.test(p.path),
                        )
                        .sort((a, b) => b.date.localeCompare(a.date))
                    : galleryCases
                }
              />
            ) : (
              <div className={`content-layout ${isCase ? 'patient-case' : ''}`}>
                {isCare && (
                  <Contents
                    page={page}
                    active={active}
                    navigate={navigate}
                    treatment={isTreatment}
                    care={isCare}
                  />
                )}
                {error ? (
                  <div className="content-body" role="alert">
                    This page couldn’t load.{' '}
                    <button type="button" onClick={() => window.location.reload()}>
                      Try again
                    </button>
                  </div>
                ) : content === null ? (
                  <div className="content-body" role="status">
                    Loading page…
                  </div>
                ) : isCase ? (
                  <article className="content-body source-content">
                    <div className="patient-comparisons">
                      {page.images.map((image, i) => (
                        <ComparisonViewer
                          key={image.src}
                          image={image}
                          title={`Patient ${page.title}${page.images.length > 1 ? `, view ${i + 1}` : ''}`}
                        />
                      ))}
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: caseText }} />
                    <a href="#/gallery/">← Back to all results</a>
                  </article>
                ) : ['/about/', '/contact/'].includes(page.path) ? (
                  <PracticeContent html={content} contact={page.path === '/contact/'} />
                ) : isJournalArticle ? (
                  <JournalArticle html={content} />
                ) : isCare ? (
                  <CareArticle html={content} />
                ) : isTreatment ? (
                  <TreatmentArticle html={content} page={page} pages={pages} leadInHero={Boolean(treatmentLead)} />
                ) : (
                  <article
                    className="content-body source-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}
              </div>
            )}
            {isBlog && (
              <nav className="blog-pagination" aria-label="Blog pages">
                {[1, 2, 3].map((n) => (
                  <a
                    key={n}
                    href={n === 1 ? '#/blog/' : '#/blog/page/' + n + '/'}
                    aria-current={
                      Number(page.path.match(/page\/(\d+)/)?.[1] || 1) === n ? 'page' : undefined
                    }
                  >
                    Page {n}
                  </a>
                ))}
              </nav>
            )}
            {isTreatment ? (
              <>
                <section className="treatment-next-step">
                  <div><h2>Talk with our specialists.</h2><a href="#/your-first-visit/">What to expect at your first visit ↗</a></div>
                  <BookLink />
                </section>
              </>
            ) : page.path !== '/contact/' ? (
              <section className="content-consultation">
                <div>
                  <h2>Talk with our specialists.</h2>
                </div>
                <BookLink />
              </section>
            ) : null}
          </>
        )}
      </main>
      <Footer />
      <AccessibilityControls />
    </div>
  );
}
