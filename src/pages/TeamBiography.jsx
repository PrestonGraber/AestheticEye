import React, { useMemo } from 'react';
import './team-biography.css';

// Keep the original biography intact; only move its existing portrait into a rail.
export function prepareBiography(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const portrait = doc.querySelector('.source-feature img') || doc.querySelector('img');
  const image = portrait ? { src: portrait.getAttribute('src'), alt: portrait.getAttribute('alt') || '', width: portrait.getAttribute('width'), height: portrait.getAttribute('height') } : null;
  portrait?.remove();
  doc.querySelectorAll('.source-feature, .source-grid').forEach(el => el.removeAttribute('class'));
  return { image, html: doc.body.innerHTML };
}

function Portrait({ image, name }) {
  if (!image) return null;
  return <img src={'/' + image.src.replace(/^\//, '')} alt={image.alt || name} width={image.width || undefined} height={image.height || undefined} loading="lazy" decoding="async" />;
}

export default function TeamBiography({ html, page }) {
  const biography = useMemo(() => prepareBiography(html), [html]);
  return <section className="team-biography" aria-label={`${page.title} biography`}>
    <aside className="team-biography-portrait">
      <figure><Portrait image={biography.image} name={page.title} /><figcaption>{page.title}</figcaption></figure>
      <a href="#/meet-the-team/">Meet the rest of our team <span aria-hidden="true">↗</span></a>
    </aside>
    <article className="content-body source-content team-biography-copy" dangerouslySetInnerHTML={{ __html: biography.html }} />
  </section>;
}

export function prepareTeamDirectory(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('.source-feature')].map(feature => {
    const biography = prepareBiography(feature.outerHTML);
    const content = new DOMParser().parseFromString(biography.html, 'text/html');
    const heading = content.querySelector('h2');
    const name = heading?.textContent.trim() || '';
    const headingHtml = heading?.outerHTML || '';
    const id = heading?.id;
    heading?.remove();
    const description = content.querySelector('p')?.textContent.trim() || '';
    // Ignore abbreviation stops such as Dr. and M.D.; previews stay verbatim.
    const stop = [...description.matchAll(/[.!?](?=\s|$)/g)].find(match => match.index >= 80);
    const excerpt = stop ? description.slice(0, stop.index + 1) : description;
    const preview = excerpt.length > 240 ? excerpt.slice(0, 240).replace(/\s+\S*$/, '') + '…' : excerpt;
    return { ...biography, html: content.body.innerHTML, name, id, headingHtml, preview };
  });
}

export function TeamDirectory({ html }) {
  const members = useMemo(() => prepareTeamDirectory(html), [html]);
  return <section className="team-directory" aria-label="The AestheticEye team">
    {members.map((member, index) => <article className={`team-directory-profile ${index < 2 ? 'team-directory-surgeon' : ''}`} key={member.id || member.name}>
      <div className="team-directory-photo"><Portrait image={member.image} name={member.name} /></div>
      <div className="team-directory-copy">
        <div dangerouslySetInnerHTML={{ __html: member.headingHtml }} />
        <p className="team-directory-preview" aria-hidden="true">{member.preview}</p>
        <details><summary>Read biography <span className="team-visually-hidden">of {member.name}</span></summary><div className="source-content" dangerouslySetInnerHTML={{ __html: member.html }} /></details>
      </div>
    </article>)}
  </section>;
}
