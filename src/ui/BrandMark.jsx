import React from 'react';
import './brand-mark.css';

// Original client artwork, with the original white wordmark on dark surfaces.
export default function BrandMark({ light = false }) {
  const asset = (name) => `${import.meta.env.BASE_URL}assets/${name}`;
  return (
    <span className="client-brand" role="img" aria-label="AestheticEye">
      <img className="client-brand-symbol" src={asset(light ? 'logo.png' : 'logo-grey.png')} width="36" height="50" alt="" />
      <img className="client-brand-name" src={asset(light ? 'name.svg' : 'name-color.png')} width="289" height="27" alt="" />
    </span>
  );
}
