import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icons.jsx';
import BrandMark from '../ui/BrandMark.jsx';
import { BOOKING_URL, adjacentIndex, getNavigationLinks, navigationGroups } from './model.js';
import { menuLayouts } from './MenuLayouts.jsx';

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;
export const HOVER_OPEN_DELAY = 90;
export const HOVER_CLOSE_DELAY = 240;

export default function Navigation({ design = 'clarity', contrast, setContrast }) {
  const [open, setOpen] = useState(null);
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [mobile, setMobile] = useState(false);
  const [keyboardEntry, setKeyboardEntry] = useState(false);
  const root = useRef(null);
  const panel = useRef(null);
  const triggers = useRef([]);
  const mobileTrigger = useRef(null);
  const searchRef = useRef(null);
  const opening = useRef(null);
  const closing = useRef(null);
  const lastPointerType = useRef('');
  const openRef = useRef(open);
  const uid = useId().replaceAll(':', '');
  const panelId = `navigation-panel-${uid}`;
  const navId = `navigation-${uid}`;
  const titleId = `navigation-title-${uid}`;
  openRef.current = open;

  useLayoutEffect(() => {
    if (open === null) return;
    function alignPanel() {
      if (!root.current || !panel.current || !triggers.current[open]) return;
      const header = root.current.getBoundingClientRect();
      const trigger = triggers.current[open].getBoundingClientRect();
      const width = panel.current.getBoundingClientRect().width;
      const preferred = trigger.left - header.left + trigger.width / 2 - width * 0.35;
      const left = Math.max(16, Math.min(preferred, header.width - width - 16));
      panel.current.style.setProperty('--panel-left', `${left}px`);
    }
    alignPanel();
    window.addEventListener('resize', alignPanel);
    return () => window.removeEventListener('resize', alignPanel);
  }, [open, design]);

  const clearTimers = useCallback(() => {
    clearTimeout(opening.current);
    clearTimeout(closing.current);
  }, []);

  const close = useCallback(
    (restoreFocus = false) => {
      clearTimers();
      const trigger =
        restoreFocus && openRef.current !== null ? triggers.current[openRef.current] : null;
      trigger?.focus();
      setOpen(null);
      setQuery('');
      setKeyboardEntry(false);
      // Mobile category triggers reappear after closing their panel.
      if (trigger)
        requestAnimationFrame(() => {
          if (trigger.isConnected) trigger.focus();
        });
    },
    [clearTimers],
  );

  const reveal = useCallback(
    (index, focusFirstLink = false) => {
      clearTimers();
      if (openRef.current !== index) {
        setActive(0);
        setQuery('');
      }
      setOpen(index);
      setKeyboardEntry(focusFirstLink);
    },
    [clearTimers],
  );

  useEffect(() => {
    if (open !== null && keyboardEntry) {
      panel.current?.querySelector('.nav-links a')?.focus();
      setKeyboardEntry(false);
    }
  }, [open, keyboardEntry]);

  useEffect(() => {
    function outside(event) {
      if (!root.current?.contains(event.target)) {
        close();
        setMobile(false);
      }
    }
    function escape(event) {
      if (event.key !== 'Escape') return;
      if (openRef.current !== null) {
        event.preventDefault();
        close(true);
      } else if (mobile) {
        event.preventDefault();
        setMobile(false);
        mobileTrigger.current?.focus();
      }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [close, mobile]);

  useEffect(() => {
    const width = window.matchMedia('(max-width: 960px)');
    const changed = () => {
      close();
      setMobile(false);
    };
    width.addEventListener('change', changed);
    return () => {
      width.removeEventListener('change', changed);
      clearTimers();
    };
  }, [close, clearTimers]);

  function enterTrigger(event, index) {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover)').matches) return;
    clearTimers();
    opening.current = setTimeout(() => reveal(index), HOVER_OPEN_DELAY);
  }

  function leaveHeader(event) {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(opening.current);
    closing.current = setTimeout(() => {
      // Do not dismiss a panel that a keyboard user is still working inside.
      if (!panel.current?.contains(document.activeElement)) close();
    }, HOVER_CLOSE_DELAY);
  }

  function activate(event, index) {
    clearTimers();
    const mouse =
      event.detail > 0 &&
      lastPointerType.current === 'mouse' &&
      window.matchMedia('(hover: hover)').matches;
    if (mouse)
      reveal(index); // A click following hover must not flash the menu closed.
    else if (open === index) close();
    else reveal(index, event.detail === 0 || window.matchMedia('(max-width: 960px)').matches);
  }

  function triggerKeys(event, index) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      reveal(index, true);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = adjacentIndex(index, event.key, navigationGroups.length);
    triggers.current[next]?.focus();
    if (open !== null) reveal(next);
  }

  function goHome(event) {
    event.preventDefault();
    close();
    setMobile(false);
    const main = document.getElementById('main');
    main?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    main?.focus({ preventScroll: true });
  }

  const group = open === null ? null : navigationGroups[open];
  const current = group?.sections[active] || group?.sections[0];
  const Layout = menuLayouts[design] || menuLayouts.clarity;
  const links = group ? getNavigationLinks(group, active, query) : [];
  const title = query.trim()
    ? 'Search results'
    : group?.sections.length === 1
      ? 'The practice'
      : current?.label;

  return (
    <header
      ref={root}
      className={`ae-header ${mobile ? 'mobile-is-open' : ''} ${open !== null ? 'panel-is-open' : ''}`}
      data-design={design}
      data-single={group?.sections.length === 1}
      data-open-group={group?.id}
      onPointerEnter={() => clearTimeout(closing.current)}
      onPointerLeave={leaveHeader}
      onBlur={(event) => {
        // A removed search field can report a null target while changing groups.
        // Outside pointer events and Escape handle dismissal in that case.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <div className="ae-header-inner">
        <a className="ae-brand" href="#main" onClick={goHome} aria-label="AestheticEye home">
          <BrandMark />
        </a>
        <button
          ref={mobileTrigger}
          type="button"
          className="ae-mobile-toggle"
          aria-expanded={mobile}
          aria-controls={navId}
          onClick={() => {
            setMobile(!mobile);
            close();
          }}
        >
          <span>{mobile ? 'Close' : 'Menu'}</span>
          <Icon name={mobile ? 'close' : 'menu'} />
        </button>
        <nav className="ae-nav" id={navId} aria-label="Main navigation">
          {navigationGroups.map((item, index) => (
            <button
              ref={(element) => {
                triggers.current[index] = element;
              }}
              key={item.id}
              type="button"
              className="ae-nav-trigger"
              aria-expanded={open === index}
              aria-controls={open === index ? panelId : undefined}
              onPointerEnter={(event) => enterTrigger(event, index)}
              onPointerLeave={() => clearTimeout(opening.current)}
              onPointerDown={(event) => {
                lastPointerType.current = event.pointerType;
              }}
              onClick={(event) => activate(event, index)}
              onKeyDown={(event) => triggerKeys(event, index)}
            >
              <span>{item.label}</span>
              <Icon name="chevron" />
            </button>
          ))}
        </nav>
        {open !== null && (
          <div className="ae-mobile-selection">
            <button type="button" onClick={() => close(true)}>
              <Icon name="back" />
              All sections
            </button>
            <span>{group.label}</span>
          </div>
        )}
        <a className="ae-header-book" href={BOOKING_URL}>
          <span>Book An Appointment</span>
          <Icon name="arrow" />
        </a>
      </div>
      {group && (
        <div
          ref={panel}
          className={`ae-nav-panel ae-panel-${design}`}
          id={panelId}
          aria-label={`${group.label} navigation`}
          role="region"
          onPointerEnter={clearTimers}
        >
          <Layout
            group={group}
            title={title}
            titleId={titleId}
            links={links}
            active={active}
            query={query}
            select={(index) => {
              setActive(index);
              setQuery('');
            }}
            setQuery={setQuery}
            searchRef={searchRef}
            close={() => close(true)}
            contrast={contrast}
            setContrast={setContrast}
          />
        </div>
      )}
    </header>
  );
}
