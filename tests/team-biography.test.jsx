import React from 'react';
import fs from 'node:fs';
import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import pages from '../src/pages/page-index.json';
import TeamBiography, { prepareBiography, prepareTeamDirectory, TeamDirectory } from '../src/pages/TeamBiography.jsx';

const parse = html => new DOMParser().parseFromString(html, 'text/html');
const text = html => parse(html).body.textContent.replace(/\s/g, '');
const links = html => [...parse(html).querySelectorAll('a')].map(a => a.getAttribute('href'));

it('retains every biography word, source link, video and photograph', () => {
  for (const page of pages.filter(p => p.path.startsWith('/meet-the-team/') && p.path !== '/meet-the-team/')) {
    const { html } = JSON.parse(fs.readFileSync('public/content/' + page.contentFile, 'utf8'));
    const result = prepareBiography(html);
    expect(text(result.html), page.path).toBe(text(html));
    expect(links(result.html), page.path).toEqual(links(html));
    const before = parse(html); const after = parse(result.html);
    expect([result.image.src, ...[...after.images].map(image => image.getAttribute('src'))], page.path).toEqual([...before.images].map(image => image.getAttribute('src')));
    expect([...after.querySelectorAll('iframe')].map(el => el.getAttribute('src')), page.path).toEqual([...before.querySelectorAll('iframe')].map(el => el.getAttribute('src')));
  }
});

it('preserves the full team directory while separating portrait, title and biography', () => {
  const page = pages.find(p => p.path === '/meet-the-team/');
  const { html } = JSON.parse(fs.readFileSync('public/content/' + page.contentFile, 'utf8'));
  const members = prepareTeamDirectory(html);
  expect(members).toHaveLength(11);
  expect(members[0].preview.length).toBeGreaterThan(80);
  expect(members[0].preview).toContain('Dr. Ginger Henson');
  const rebuilt = members.map(member => member.headingHtml + member.html).join('');
  expect(text(rebuilt)).toBe(text(html));
  expect(links(rebuilt)).toEqual(links(html));
  expect(members.flatMap(member => [member.image.src, ...[...parse(member.html).images].map(image => image.getAttribute('src'))])).toEqual([...parse(html).images].map(image => image.getAttribute('src')));
});

it('renders the local portrait and a return to the team', () => {
  render(<TeamBiography page={{ title: 'Dr. Example' }} html='<div class="source-feature"><img src="media/portrait.jpg" alt="Source portrait"><p>Original biography.</p></div>' />);
  expect(screen.getByAltText('Source portrait').getAttribute('src')).toBe('/media/portrait.jpg');
  expect(screen.getByText('Original biography.')).toBeTruthy();
  expect(screen.getByRole('link', { name: /Meet the rest of our team/ }).getAttribute('href')).toBe('#/meet-the-team/');
});
