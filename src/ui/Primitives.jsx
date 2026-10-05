import React from 'react';
import { asset, BOOKING_URL, SITE_URL } from '../content.js';
import { Icon } from './Icons.jsx';
import dimensions from '../asset-dimensions.json';

export function Photo({
  name,
  alt = '',
  className = '',
  eager = false,
  priority = false,
  ...props
}) {
  return (
    <img
      src={asset(name)}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      width={dimensions[name]?.width}
      height={dimensions[name]?.height}
      {...props}
    />
  );
}
export function BookLink({ light = false }) {
  return (
    <a className={`art-book ${light ? 'light' : ''}`} href={BOOKING_URL}>
      <span>Book An Appointment</span>
      <span className="book-arrow">
        <Icon name="arrow" />
      </span>
    </a>
  );
}
export function TextLink({ path, children, className = '' }) {
  return (
    <a className={`art-more ${className}`} href={path.startsWith('http') ? path : SITE_URL + path}>
      {children}
      <Icon name="arrow" />
    </a>
  );
}
export function SectionLabel({ number, children, right }) {
  return (
    <div className="art-section-label">
      <span>
        {number && <span aria-hidden="true">{number.toString().padStart(2, '0')} / </span>}
        {children}
      </span>
      {right || <span>AESTHETICEYE</span>}
    </div>
  );
}
export function reducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
