AESTHETICEYE — SIX HOMEPAGE DIRECTIONS

React 19 / Vite / Tailwind CSS. Homepage concepts only. Source practice copy,
photos, reviews, articles, contact details and brand colors are retained.
Secondary links lead to the existing website; booking uses its Klara service.

RUN: npm ci, then npm run dev
BUILD: npm run build
PREVIEW: npm run preview
CHECK: npm test, then node scripts/verify-palettes.mjs

ROUTES
#/              Collection with filters and saved shortlist
#/clarity       Light product-inspired composition; compact category rail
#/form          Modern business grid; horizontal menu directory
#/perspective   Photographic poster; dark dropdowns; treatment filmstrip
#/editorial     Oversized masthead; fine rules; numbered navigation index
#/serene        Circular portrait; warm paper; rounded floating menus
#/modern        Forest-green typography; structural grids; split dropdowns

NAVIGATION
Five primary items: About, Treatments, Results, Resources, Contact.
Mouse hover opens panels after 90 ms; a 240 ms exit delay allows pointer travel.
Categories switch after 110 ms of deliberate hover, or on click. Panels align
near their triggers. Short groups receive smaller panels; long desktop lists
scroll inside the dropdown. Treatments and resources include search. There are
no decorative photos or oversized marketing headings inside the dropdowns.

Touch uses a five-row directory and an All sections return button. Enter and
ArrowDown open a section and focus a link. Escape closes and restores focus.
ArrowLeft/Right and Home/End move among desktop primary items. Outside pointer
interaction or focus moving outside closes the dropdown.

INTERACTIONS
Clarity, Sanctuary and Modernist use procedure tabs with keyboard controls.
Form uses expandable procedure rows. Editorial shows all three procedure
stories. Perspective uses a manual scroll-snap filmstrip with controls.

The gallery starts with the full original photograph. Compare is optional and
uses cropped halves of that source image. A modal always offers the full
original. The range has keyboard support and Before/50:50/After shortcuts.
Gallery and film dialogs lock background scrolling and restore trigger focus.
The original practice film loads on request, uses native controls and never
autoplays. The source file contains video but no audio track.

Testimonials, journey steps, treatment families and locations are controlled
by the visitor. Locations include directions and a copy-address button.
Decorative movement respects reduced-motion preferences. Photos have intrinsic
dimensions; one hero image per concept receives high fetch priority.

BASE44 / EXISTING REACT PROJECT
To show one concept without the review toolbar or hash router:

  import Website from './Website.jsx';
  export default function Home() {
    return <Website design="clarity" />;
  }

Copy the src components/styles/data and public assets/fonts into the project.
Do not paste src/main.jsx's createRoot into an existing React mount. Website
does not need a router. App supplies the optional six-design collection.
Set reviewTools on Website only when you want the concept-switching toolbar.

This project uses Tailwind v4 and local CSS. If the host already imports
Tailwind, merge foundation.css's Tailwind import/theme with that setup.
Assets use Vite BASE_URL. Adapt the asset helpers if the platform hosts files
at different URLs. Base44 deployment itself has not been performed or verified.

SOURCE MAP
src/App.jsx                 Collection routing and page titles
src/Website.jsx             Importable single-design page
src/Collection.jsx          Filtering and shortlist
src/ConceptPreview.jsx      Illustrated previews, not browser screenshots
src/Experience.jsx          Six heroes and supporting homepage sections
src/navigation/             Behavior and six compact menu layouts
src/sections/               Procedures, gallery, reviews, film and contact tools
src/ui/                     Shared icons, images, modal and motion hooks
src/foundation.css          Tailwind, type, review toolbar and footer
src/experience.css          Page composition and responsive CSS
src/original.json           Captured copy, links, reviews and articles
public/assets/              Unmodified source photography and practice film
public/fonts/               Local fonts and license notices
tests/                      DOM interaction and semantic axe checks

VERIFICATION AND LIMITS
This revision passes 106 isolated DOM tests covering all six menus, hover
timing, category switching, touch/keyboard behavior, source navigation coverage,
section interactions, modal focus/scroll restoration and semantic axe checks
on six initial pages and six open treatment menus. Production build succeeds.
67 explicit source palette pairs meet a 4.5:1 normal-text contrast ratio.

The user's browser and computer UI were not controlled. A separate, hidden
headless renderer with a temporary profile was used to inspect desktop heroes
and menus and capture all six mobile layouts at 390px. This exposed and helped
fix Perspective's horizontal overflow. Supporting sections were reviewed;
additional checks at 320, 768 and 1024px caught and resolved narrow-header and
card-height issues. Rendered axe checks on all six initial pages and open menus
at desktop and mobile sizes detected no violations. Incomplete automated contrast
checks remain documented in rendered-checks.json. Headers, footers and previews use original client
logo artwork rather than a recreated text wordmark.
Palette calculations do not cover text over photographs or every rendered
state. Automated checks are not formal accessibility certification. Earlier
screenshots and browser reports are retained outside this source delivery.

OPTIONAL INTERACTIONS
Each homepage includes a quiet invitation to a two-question browsing guide.
It opens only on request, uses original destination links, does not assess
medical suitability, and does not save or transmit answers. Phone, tablet and
desktop checks covered 27 guide states across the six design themes.
The gallery includes original-photo thumbnails and horizontal phone swiping;
vertical scrolling, pinch zoom, keyboard controls and full originals remain
available. Gallery and testimonial touch controls have 44px minimum targets.

SOURCE
https://www.aestheticeyemd.com/ — captured October 4, 2026.
Source spelling and clinical descriptions are preserved. Navigation grouping,
interface labels, decorative elements and art direction are new. No backend,
patient data collection, analytics or tracking was added.

FULL CLARITY SITE
Run npm run dev from this folder. The AestheticEye preview uses port 5174 (strict); port 5173 belongs to another project.
Homepage: http://127.0.0.1:5174/#/
Design archive: http://127.0.0.1:5174/#/designs
The full site contains the Clarity homepage and 269 additional source routes. Source content is loaded per page from public/content; original media is stored in public/media. Source inventory: src/pages/source-manifest.json. Latest checks: full-site-verification.json.
Third-party booking, portal, financing, and forms retain their existing provider destinations. No form submissions or payments were made during testing.

