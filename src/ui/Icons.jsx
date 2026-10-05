import React from 'react';

const paths = {
  arrow: (
    <>
      <path d="M5 19 19 5M5 5h14v14" />
    </>
  ),
  right: (
    <>
      <path d="M4 12h16m-7-7 7 7-7 7" />
    </>
  ),
  chevron: <path d="m7 10 5 5 5-5" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  menu: <path d="M4 8h16M4 16h16" />,
  play: <path d="m9 5 11 7-11 7Z" />,
  back: <path d="M20 12H4m7-7-7 7 7 7" />,
  check: <path d="m5 12 4 4L19 6" />,
  compare: (
    <>
      <path d="M12 3v18M9 8l-4 4 4 4m6-8 4 4-4 4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>
  ),
};

export function Icon({ name = 'arrow', className = '', ...props }) {
  return (
    <svg
      className={`ae-icon ${className}`}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}
