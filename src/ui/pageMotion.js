// Animate visible content once. No hidden pre-animation state or scroll interception.
export function installPageMotion(root, preference) {
  if (!root || !Element.prototype.animate) return () => {};
  const running = new Set();
  const seen = new WeakSet();
  const clarity = root.classList.contains('clarity');
  function play(element, frames, timing) {
    if (!element || preference.matches) return;
    seen.add(element);
    const animation = element.animate(frames, { fill: 'backwards', ...timing });
    running.add(animation);
    animation.onfinish = () => running.delete(animation);
  }
  function enter(element, index = 0, hero = false) {
    if (!element || preference.matches || seen.has(element)) return;
    seen.add(element);
    const animation = element.animate(
      [
        { opacity: 0.35, transform: `translate3d(0, ${hero && clarity ? 26 : 16}px, 0)` },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: hero && clarity ? 950 : 650,
        delay: Math.min(index * 85, 340),
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'backwards',
      },
    );
    running.add(animation);
    animation.onfinish = () => running.delete(animation);
  }
  const hero = root.querySelector('.art-hero, .quiet-hero');
  const heroParts = hero
    ? [
        ...hero.querySelectorAll(
          clarity
            ? '.clarity-v4-intro > .art-kicker, .clarity-title-line, .clarity-v4-actions, .clarity-v4-stage > *, .art-service-rail'
            : 'h1, .art-book, .form-v4-grid, .poster-portrait, .editorial-cover, .serene-orbit, .modern-v4-photo, .quiet-ease .quiet-media',
        ),
      ]
    : [];
  if (clarity && hero?.querySelector('.clarity-image-main')) {
    const ease = 'cubic-bezier(.16,1,.3,1)';
    hero.querySelectorAll('.clarity-title-line').forEach((line, index) =>
      play(
        line,
        [
          { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(32px)', filter: 'blur(5px)' },
          { clipPath: 'inset(-20% -5% -35% -5%)', transform: 'translateY(0)', filter: 'blur(0px)' },
        ],
        { duration: 1100, delay: 100 + index * 180, easing: ease },
      ),
    );
    play(
      hero.querySelector('.clarity-image-main > img'),
      [
        { clipPath: 'circle(0% at 50% 45%)', filter: 'blur(8px)' },
        { clipPath: 'circle(38% at 50% 45%)', filter: 'blur(1px)', offset: 0.5 },
        { clipPath: 'circle(100% at 50% 45%)', filter: 'blur(0px)' },
      ],
      { duration: 1550, delay: 180, easing: 'cubic-bezier(.22,.65,.15,1)' },
    );
    play(
      hero.querySelector('.clarity-lens-ring'),
      [
        { transform: 'translate(-50%, -50%) scale(.1)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1.5)', opacity: 0.8, offset: 0.3 },
        { transform: 'translate(-50%, -50%) scale(8)', opacity: 0 },
      ],
      { duration: 1550, delay: 180, easing: 'cubic-bezier(.22,.65,.15,1)' },
    );
    ['.clarity-image-small', '.clarity-proof-card'].forEach((selector, index) =>
      play(
        hero.querySelector(selector),
        [
          { transform: `translateY(65px) rotate(${index ? 4 : -4}deg) scale(.94)`, opacity: 0 },
          { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 1 },
        ],
        { duration: 1200, delay: 450 + index * 160, easing: ease },
      ),
    );
    [
      '.clarity-v4-intro > .art-kicker',
      '.clarity-v4-actions',
      '.clarity-image-caption',
      '.art-service-rail',
    ].forEach((selector, index) =>
      play(
        hero.querySelector(selector),
        [
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 700, delay: 150 + index * 220, easing: ease },
      ),
    );
  } else heroParts.forEach((element, index) => enter(element, index, true));
  const sections = [...root.querySelectorAll('.section, .art-trust, .explore-guide-invitation')];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || preference.matches) return;
        const section = entry.target;
        const children = [
          ...section.querySelectorAll(
            ':scope > .art-section-label, :scope > .procedures-intro, :scope > .journey-intro, :scope > .reviews-topline, .art-practice-grid > *, .article-grid > article, .gallery-composition > *, .review-layout > *, .journey-layout > *, .specialty-layout > *, :scope > .contact-invitation, :scope > .location-card-v6',
          ),
        ];
        (children.length ? children : [...section.children]).forEach((element, index) =>
          enter(element, index),
        );
        observer.unobserve(section);
      });
    },
    { threshold: 0.08 },
  );
  function configure() {
    observer.disconnect();
    if (preference.matches) {
      running.forEach((animation) => animation.cancel());
      running.clear();
    } else sections.forEach((section) => observer.observe(section));
  }
  configure();
  preference.addEventListener('change', configure);
  return () => {
    observer.disconnect();
    preference.removeEventListener('change', configure);
    running.forEach((animation) => animation.cancel());
    running.clear();
  };
}
