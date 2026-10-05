import original from './original.json';
export { original };
export const SITE_URL = 'https://www.aestheticeyemd.com';
export const BOOKING_URL = 'https://l.klara.com/G3yV4TBdY4dUMwAk';
export const DOCTORS = 'Jon-Pargament-Ginger-Henson-license-confirmed.jpg';
export const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
export const treatments = [
  {
    title: 'Drooping upper Eyelids',
    image: '1.webp',
    path: '/ptosis-or-droopy-eyelids/',
    body: original.paragraphs[7],
  },
  {
    title: 'Lower Eyelid Bags',
    image: '2.webp',
    path: '/lower-eyelid-bags/',
    body: original.paragraphs[8],
  },
  {
    title: 'Brow and Forehead Lifts',
    image: '3.webp',
    path: '/brow-lift-forehead-lift/',
    body: original.paragraphs[9],
  },
];
export const galleryCases = [
  { title: 'Brow Lift Surgery', image: '1521114.jpg', path: 'brow-lift-surgery' },
  {
    title: 'Lower Eyelid Blepharoplasty',
    image: '392657.jpg',
    path: 'lower-eyelid-blepharoplasty',
  },
  {
    title: 'Skin Cancer Reconstructions',
    image: '1193219OS.jpg',
    path: 'skin-cancer-reconstructions',
  },
  { title: 'Upper Eyelid Surgery', image: '1524824.jpg', path: 'upper-eyelid-surgery' },
];
