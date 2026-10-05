import React, { useId, useRef, useState } from 'react';
import { asset } from '../content.js';
import { Icon } from '../ui/Icons.jsx';
import { useModal } from '../ui/useModal.js';

export default function PracticeFilm() {
  const video = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const description = useId();
  const modal = useModal(() => video.current?.pause());

  function open() {
    setLoaded(true);
    modal.show();
  }

  return (
    <>
      <button className="film-trigger" type="button" onClick={open} aria-haspopup="dialog">
        <span className="play-icon" aria-hidden="true">
          <Icon name="play" />
        </span>
        <span>
          About our practice<small>Watch the film</small>
        </span>
      </button>
      <dialog
        className="film-dialog"
        {...modal.dialogProps}
        aria-label="AestheticEye practice film"
        aria-describedby={description}
      >
        <div className="film-heading">
          <div>
            <span>AestheticEye — About our practice</span>
            <p id={description}>Original practice film · No audio</p>
          </div>
          <button type="button" autoFocus aria-label="Close practice film" onClick={modal.close}>
            <Icon name="close" />
          </button>
        </div>
        {loaded && (
          <video
            ref={video}
            src={asset('REAL-ESTATE-1.mp4')}
            controls
            playsInline
            preload="metadata"
            aria-label="Original AestheticEye practice footage"
          />
        )}
      </dialog>
    </>
  );
}
