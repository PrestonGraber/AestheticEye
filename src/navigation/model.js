import original from '../original.json';

export const SITE_URL = 'https://www.aestheticeyemd.com';
export const BOOKING_URL = 'https://l.klara.com/G3yV4TBdY4dUMwAk';

export const navigationGroups = [
  {
    id: 'about',
    label: 'About',
    caption: 'You deserve to feel confident.',
    image: 'Jon-Pargament-Ginger-Henson-license-confirmed.jpg',
    feature: original.nav[0].links[0],
    sections: [original.nav[0]],
  },
  {
    id: 'treatments',
    label: 'Treatments',
    caption: 'Your Eyes Deserve Excellence',
    image: '1.webp',
    feature: { label: 'All Oculoplastic Procedures', href: `${SITE_URL}/procedures/` },
    sections: [original.nav[1], original.nav[2], original.nav[4]],
  },
  {
    id: 'results',
    label: 'Results',
    caption: 'Looking as happy as you feel',
    image: 'schedule.jpg',
    feature: { label: 'View Our Gallery', href: `${SITE_URL}/gallery/` },
    sections: [
      original.nav[3],
      {
        label: 'Testimonials',
        links: [{ label: 'Patient Testimonials', href: `${SITE_URL}/testimonials/` }],
      },
    ],
  },
  {
    id: 'resources',
    label: 'Resources',
    caption: 'A personalized approach to care',
    image: 'blog-2-1.jpg',
    feature: { label: 'Your First Visit', href: `${SITE_URL}/your-first-visit/` },
    sections: [
      { label: 'Patient essentials', links: original.nav[5].links.slice(0, 3) },
      { label: 'Surgery preparation', links: original.nav[5].links.slice(3, 7) },
      { label: 'Treatment aftercare', links: original.nav[5].links.slice(7) },
      original.nav[6],
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    caption: 'Cincinnati & Dayton',
    image: 'header-image.jpg',
    feature: { label: 'Book An Appointment', href: BOOKING_URL },
    sections: [
      original.nav[7],
      {
        label: 'Locations',
        links: [
          { label: 'Springboro & Cincinnati', href: `${SITE_URL}/contact/` },
          { label: 'Call (937) 907-9009', href: 'tel:9379079009' },
          { label: 'Text (937) 918-7631', href: 'sms:9379187631' },
        ],
      },
    ],
  },
];

export const menuDesigns = {
  clarity: { title: 'Clarity', layout: 'command', hint: 'Explore AestheticEye' },
  form: { title: 'Form & Function', layout: 'directory', hint: 'Cincinnati & Dayton' },
  perspective: { title: 'Perspective', layout: 'portrait', hint: 'A different perspective' },
  editorial: { title: 'The Editorial', layout: 'index', hint: 'AestheticEye / Index' },
  serene: { title: 'The Sanctuary', layout: 'garden', hint: 'You deserve to feel confident' },
  modern: { title: 'The Modernist', layout: 'blueprint', hint: 'AestheticEye / Ohio' },
};

export function normalizeQuery(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function getNavigationLinks(group, activeSection, query = '') {
  const search = normalizeQuery(query);
  if (!search) return group.sections[activeSection]?.links || [];
  const seen = new Set();
  return group.sections
    .flatMap((section) => section.links)
    .filter((link) => normalizeQuery(link.label).includes(search))
    .filter((link) => {
      const key = `${link.href}|${link.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function adjacentIndex(index, key, length) {
  if (key === 'ArrowRight' || key === 'ArrowDown') return (index + 1) % length;
  if (key === 'ArrowLeft' || key === 'ArrowUp') return (index + length - 1) % length;
  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  return null;
}
