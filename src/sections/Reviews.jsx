import React, { useState } from 'react';
import original from '../original.json';
import { Icon } from '../ui/Icons.jsx';
import './reviews.css';

const authors = ['Lynne S.', 'Patricia B.', 'Sara G.'];

export default function Reviews({ design = 'clarity' }) {
  const [index, setIndex] = useState(0);
  const [all, setAll] = useState(false);
  const move = (delta) =>
    setIndex((current) => (current + delta + original.reviews.length) % original.reviews.length);

  return (
    <section
      className="section review-carousel"
      data-design={design}
      aria-labelledby="reviews-title"
    >
      <div className="reviews-topline">
        <span>PATIENT TESTIMONIALS</span>
        <span>AESTHETICEYE / CINCINNATI & DAYTON</span>
      </div>
      <div className="review-layout">
        <div className="review-heading">
          <h2 id="reviews-title">
            Patient{' '}
            <br />
            Testimonials<span>.</span>
          </h2>
          <a className="text-link" href="https://www.aestheticeyemd.com/testimonials/">
            View Our Testimonials
            <Icon name="arrow" />
          </a>
          <span className="review-large-index" aria-hidden="true">
            0{index + 1}
          </span>
        </div>
        <div className="review-story">
          <figure key={index}>
            <blockquote>{original.reviews[index]}</blockquote>
            <figcaption>
              <span className="review-initial" aria-hidden="true">
                {authors[index][0]}
              </span>
              <span>{authors[index]}</span>
              <span
                className="review-count"
                role="status"
                aria-label={`Testimonial ${index + 1} of ${original.reviews.length}`}
              >
                0{index + 1} / 03
              </span>
            </figcaption>
          </figure>
          <div className="review-bottom">
            <div className="review-dots" role="group" aria-label="Choose a testimonial">
              {original.reviews.map((_, item) => (
                <button
                  type="button"
                  key={item}
                  aria-label={`Read testimonial ${item + 1}`}
                  aria-pressed={index === item}
                  onClick={() => setIndex(item)}
                >
                  <span />
                </button>
              ))}
            </div>
            <div className="review-arrows">
              <button type="button" aria-label="Previous testimonial" onClick={() => move(-1)}>
                <Icon name="back" />
              </button>
              <button type="button" aria-label="Next testimonial" onClick={() => move(1)}>
                <Icon name="right" />
              </button>
            </div>
          </div>
          <button
            className="review-read-all"
            type="button"
            aria-expanded={all}
            aria-controls="all-testimonials"
            onClick={() => setAll(!all)}
          >
            {all ? 'Show one testimonial' : 'Read all 3 testimonials'}
            <Icon name={all ? 'minus' : 'plus'} />
          </button>
        </div>
      </div>
      <div id="all-testimonials" hidden={!all} className="all-testimonials">
        {original.reviews.map((review, item) => (
          <figure key={authors[item]}>
            <blockquote>{review}</blockquote>
            <figcaption>{authors[item]}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
