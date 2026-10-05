import React, { useEffect, useRef, useState } from 'react';
import { Photo, BookLink } from '../ui/Primitives.jsx';
import { Icon } from '../ui/Icons.jsx';
import './quiet-hero.css';

export default function QuietHero({ design }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const cinematic = design === 'still';
  useEffect(() => {
    if (!cinematic) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (preference.matches || navigator.connection?.saveData) video.current?.pause();
      else video.current?.play()?.catch(() => {});
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, [cinematic]);

  return (
    <section className={`quiet-hero quiet-${design}`} aria-labelledby="quiet-title">
      <div className="quiet-media">
        {cinematic ? (
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="none"
            poster={`${import.meta.env.BASE_URL}assets/header-image.jpg`}
            src={`${import.meta.env.BASE_URL}assets/REAL-ESTATE-1.mp4`}
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : (
          <Photo
            name="schedule.jpg"
            eager
            priority
            alt="Portrait from the original AestheticEye website"
          />
        )}
      </div>
      <div className="quiet-copy">
        <p className="quiet-eyebrow">CINCINNATI & DAYTON’S ESTABLISHED EYELID EXPERTS</p>
        <h1 id="quiet-title">
          You deserve to
          <br />
          feel <span>confident.</span>
        </h1>
        <p className="quiet-subtitle">Your Eyes Deserve Excellence</p>
        <BookLink light={cinematic} />
      </div>
      {cinematic && (
        <button
          className="quiet-video-toggle"
          type="button"
          onClick={() => {
            if (playing) video.current?.pause();
            else video.current?.play()?.catch(() => {});
          }}
          aria-label={playing ? 'Pause background video' : 'Play background video'}
        >
          <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>
          {playing ? 'Pause film' : 'Play film'}
        </button>
      )}
      <a
        className="quiet-explore"
        href="#practice"
        onClick={(event) => {
          event.preventDefault();
          const target = document.getElementById('practice');
          target?.scrollIntoView({
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          });
          target?.setAttribute('tabindex', '-1');
          target?.focus({ preventScroll: true });
        }}
      >
        About our practice <Icon name="right" />
      </a>
    </section>
  );
}
