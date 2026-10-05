export const designs = [
  {
    id: 'clarity',
    n: '04',
    name: 'Clarity',
    tone: 'light',
    tag: 'Clean, intuitive, considered.',
    desc: 'A product-inspired experience with crisp typography, a portrait composition, and clear paths to care.',
    navigation: 'Floating command panel',
    details: [
      'Compact navigation with search',
      'Interactive treatment browser',
      'Light sage and soft white',
    ],
  },
  {
    id: 'form',
    n: '05',
    name: 'Form & Function',
    tone: 'light',
    tag: 'Precise, professional, personal.',
    desc: 'An architectural grid puts the surgeons first. Confident hierarchy gives the practice a modern business presence.',
    navigation: 'Compact horizontal directory',
    details: [
      'Horizontal category navigation',
      'Expandable procedure directory',
      'Square edges and structured spacing',
    ],
  },
  {
    id: 'perspective',
    n: '06',
    name: 'Perspective',
    tone: 'dark',
    tag: 'Expressive, immersive, assured.',
    desc: 'A photographic poster, oversized type, and bold changes of scale create the most expressive direction.',
    navigation: 'Quiet dark dropdowns',
    details: [
      'Compact dark navigation',
      'Horizontal treatment stories',
      'Forest green and warm cream',
    ],
  },
  {
    id: 'editorial',
    n: '01',
    name: 'The Editorial',
    tone: 'light',
    tag: 'Quiet confidence. Clear intent.',
    desc: 'An oversized masthead, fine rules, and open page layouts give the practice a contemporary editorial identity.',
    navigation: 'Numbered editorial index',
    details: [
      'Paper-style navigation index',
      'Open treatment story columns',
      'Restrained imagery and generous margins',
    ],
  },
  {
    id: 'serene',
    n: '02',
    name: 'The Sanctuary',
    tone: 'light',
    tag: 'Warm, calm, welcoming.',
    desc: 'Circular photography, softer typography, and warm natural tones create a more personal and reassuring experience.',
    navigation: 'Curved floating menu',
    details: [
      'Soft category pills and curved panels',
      'Gentle treatment discovery',
      'Warm ivory and muted olive',
    ],
  },
  {
    id: 'modern',
    n: '03',
    name: 'The Modernist',
    tone: 'dark',
    tag: 'Bold structure. Distinct character.',
    desc: 'Deep forest surfaces, confident typography, and precise divisions give the practice a strong visual presence.',
    navigation: 'Two-part structural grid',
    details: [
      'Compact indexed navigation',
      'Number-led procedure explorer',
      'High contrast and architectural forms',
    ],
  },
];

export function getDesign(id) {
  return designs.find((design) => design.id === id);
}
