import React, { useMemo, useState } from 'react';

export default function ResourceDirectory({ html }) {
  const [query, setQuery] = useState('');
  const links = useMemo(() => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return [...doc.querySelectorAll('nav a')].map(a => ({ href: a.getAttribute('href'), title: a.textContent.trim() }));
  }, [html]);
  const filtered = links.filter(link => link.title.toLowerCase().includes(query.toLowerCase().trim()));
  return <section className="resource-directory" aria-label="Patient resource library">
    <header className="resource-directory-heading">
      <div><span>Patient resource library</span><h2>{links.length > 3 ? 'Find your instructions.' : 'Prepare for your treatment.'}</h2></div>
      {links.length > 3 && <label>Search care instructions<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by treatment name" /></label>}
    </header>
    {links.length > 3 && <p className="resource-directory-count" role="status">{filtered.length} {filtered.length === 1 ? 'resource' : 'resources'}</p>}
    <nav aria-label="Care instructions"><ul>{filtered.map(link => <li key={link.href}><a href={link.href}><span>{link.title}</span><span aria-hidden="true">↗</span></a></li>)}</ul></nav>
    {!filtered.length && <p>No matching instructions. Try a treatment name or clear your search.</p>}
  </section>;
}
