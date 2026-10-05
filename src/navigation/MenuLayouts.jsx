import React, { useEffect, useRef } from 'react';
import { Icon } from '../ui/Icons.jsx';

function Categories({ group, active, query, select }) {
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), [group.id]);
  if (group.sections.length < 2) return null;
  return (
    <div className="nav-categories" role="group" aria-label={`${group.label} categories`}>
      {group.sections.map((section, index) => (
        <button
          type="button"
          key={section.label}
          className="nav-category"
          aria-pressed={active === index && !query.trim()}
          onClick={() => select(index)}
          onPointerEnter={(event) => {
            if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover)').matches)
              return;
            clearTimeout(timer.current);
            timer.current = setTimeout(() => select(index), 110);
          }}
          onPointerLeave={() => clearTimeout(timer.current)}
        >
          <span>{section.label}</span>
          <Icon name="right" />
        </button>
      ))}
    </div>
  );
}

function Search({ group, query, setQuery, searchRef }) {
  if (!['treatments', 'resources'].includes(group.id)) return null;
  return (
    <label className="nav-find">
      <Icon name="search" />
      <input
        ref={searchRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label={`Search ${group.label.toLowerCase()}`}
        placeholder={`Find a ${group.id === 'treatments' ? 'treatment' : 'resource'}`}
        autoComplete="off"
        spellCheck="false"
        type="search"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear navigation search"
          onClick={() => {
            setQuery('');
            searchRef.current?.focus();
          }}
        >
          <Icon name="close" />
        </button>
      )}
    </label>
  );
}

function Heading({ title, titleId, close }) {
  return (
    <div className="nav-panel-heading">
      <h2 id={titleId}>{title}</h2>
      <button className="nav-dismiss" aria-label="Close navigation" onClick={close} type="button">
        <Icon name="close" />
      </button>
    </div>
  );
}

function Links({ links, query, titleId, numbered = false }) {
  return (
    <div className="nav-list-wrap">
      <span className="sr-only" role="status" aria-live="polite">
        {query.trim() ? `${links.length} matching ${links.length === 1 ? 'link' : 'links'}` : ''}
      </span>
      {links.length ? (
        <ul
          className={`nav-links ${numbered ? 'nav-links-numbered' : ''}`}
          aria-labelledby={titleId}
        >
          {links.map((link, index) => (
            <li key={`${link.href}|${link.label}`}>
              <a href={link.href}>
                {numbered && (
                  <span className="link-number" aria-hidden="true">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                )}
                <span>{link.label}</span>
                <Icon name="arrow" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="nav-empty">
          <p>No matches for “{query}”.</p>
          <span>Try another word or choose a category.</span>
        </div>
      )}
    </div>
  );
}

function Footer({ group, contrast, setContrast }) {
  return (
    <div className="nav-utility">
      <a href={group.feature.href}>
        {group.feature.label}
        <Icon name="arrow" />
      </a>
      <button
        type="button"
        aria-pressed={contrast}
        onClick={() => setContrast(!contrast)}
        aria-label={contrast ? 'Use standard contrast' : 'Use high contrast'}
        title={contrast ? 'Use standard contrast' : 'Use high contrast'}
      >
        <Icon name="sun" />
      </button>
    </div>
  );
}

function CommandMenu(props) {
  return (
    <div className="menu-command nav-content">
      <Search {...props} />
      <div className="command-body">
        <Categories {...props} />
        <div className="nav-results">
          <Heading {...props} />
          <Links {...props} />
        </div>
      </div>
      <Footer {...props} />
    </div>
  );
}
function DirectoryMenu(props) {
  return (
    <div className="menu-directory nav-content">
      <Categories {...props} />
      <div className="directory-heading">
        <Heading {...props} />
        <Search {...props} />
      </div>
      <Links {...props} />
      <Footer {...props} />
    </div>
  );
}
function PortraitMenu(props) {
  return (
    <div className="menu-portrait nav-content">
      <Heading {...props} />
      <Categories {...props} />
      <Search {...props} />
      <Links {...props} />
      <Footer {...props} />
    </div>
  );
}
function IndexMenu(props) {
  return (
    <div className="menu-index nav-content">
      <div className="index-top">
        <Heading {...props} />
        <Search {...props} />
      </div>
      <div className="index-body">
        <Categories {...props} />
        <Links {...props} numbered />
      </div>
      <Footer {...props} />
    </div>
  );
}
function GardenMenu(props) {
  return (
    <div className="menu-garden nav-content">
      <Heading {...props} />
      <Categories {...props} />
      <Search {...props} />
      <Links {...props} />
      <Footer {...props} />
    </div>
  );
}
function BlueprintMenu(props) {
  return (
    <div className="menu-blueprint nav-content">
      <Categories {...props} />
      <div className="blueprint-results">
        <Heading {...props} />
        <Search {...props} />
        <Links {...props} numbered />
      </div>
      <Footer {...props} />
    </div>
  );
}

export const menuLayouts = {
  clarity: CommandMenu,
  form: DirectoryMenu,
  perspective: PortraitMenu,
  editorial: IndexMenu,
  serene: GardenMenu,
  modern: BlueprintMenu,
};
