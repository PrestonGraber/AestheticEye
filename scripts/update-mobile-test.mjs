import fs from 'node:fs';
const p='tests/interactions.test.jsx';let s=fs.readFileSync(p,'utf8');const start=s.indexOf("  it('moves into a selected section");const end=s.indexOf("  it('does not dismiss",start);
s=s.slice(0,start)+`  it('expands a mobile section in place and closes with Escape', () => {
    window.matchMedia.mockImplementation((query) => ({...defaultMedia(query),matches: query === '(max-width: 960px)'}));
    render(<Navigation setContrast={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu', exact: true }));
    const treatments = document.querySelector('.mobile-simple-menu .mobile-menu-group:nth-of-type(2) > button');
    fireEvent.click(treatments);
    expect(treatments.getAttribute('aria-expanded')).toBe('true');
    expect(document.querySelector('.mobile-simple-menu').textContent).toContain('Cosmetic');
    expect(screen.queryByRole('button', {name:'All sections'})).toBeNull();
    fireEvent.click(treatments);
    expect(treatments.getAttribute('aria-expanded')).toBe('false');
    fireEvent.keyDown(treatments, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Menu', exact: true }).getAttribute('aria-expanded')).toBe('false');
  });
`+s.slice(end);fs.writeFileSync(p,s);
