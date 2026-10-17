import React, { useState } from 'react';
import { navigationGroups, BOOKING_URL, normalizeQuery } from './model.js';
export default function MobileMenu({ id, onNavigate }) {
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState('');
  const search = normalizeQuery(query);
  const groups = navigationGroups
    .map((group) => ({
      ...group,
      sections: group.sections
        .map((section) => ({
          ...section,
          links: section.links.filter(
            (link) => !search || normalizeQuery(link.label + ' ' + section.label).includes(search),
          ),
        }))
        .filter((section) => section.links.length),
    }))
    .filter((group) => group.sections.length);
  return (
    <nav id={id} className="mobile-simple-menu" aria-label="Mobile navigation">
      <label className="mobile-menu-search">
        Find a treatment or page
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the website menu"
        />
      </label>
      {groups.map((group) => (
        <section key={group.id} className="mobile-menu-group">
          <button
            type="button"
            aria-expanded={Boolean(search) || expanded === group.id}
            aria-controls={id + '-' + group.id}
            onClick={() => {
              setQuery('');
              setExpanded(expanded === group.id ? null : group.id);
            }}
          >
            {group.label}
            <span aria-hidden="true">{search || expanded === group.id ? '−' : '+'}</span>
          </button>
          <div id={id + '-' + group.id} hidden={!search && expanded !== group.id}>
            {group.sections.map((section) => (
              <div key={section.label} className="mobile-menu-section">
                {group.sections.length > 1 && <h3>{section.label}</h3>}
                <ul>
                  {section.links.map((link, i) => (
                    <li key={link.href + i}>
                      <a href={link.href} onClick={onNavigate}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
      {!groups.length && <p role="status">No matching pages. Try a different word.</p>}
      <div className="mobile-menu-actions">
        <a href={BOOKING_URL} onClick={onNavigate}>
          Book an appointment <span aria-hidden="true">↗</span>
        </a>
        <a href="tel:9379079009">Call (937) 907-9009</a>
      </div>
    </nav>
  );
}
