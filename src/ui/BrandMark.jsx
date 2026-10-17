import React from 'react';
import './brand-mark.css';

// Complete, unmodified SVG artwork copied from the original site's header.
export default function BrandMark({ light = false }) {
  return (
    <span className="client-brand" role="img" aria-label="AestheticEye">
      <img
        className="client-brand-artwork"
        src={`${import.meta.env.BASE_URL}assets/aestheticeye-logo-${light ? 'light' : 'color'}.svg`}
        width="377"
        height="80"
        alt=""
      />
    </span>
  );
}
