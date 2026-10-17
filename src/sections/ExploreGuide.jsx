import React, { useEffect, useRef, useState } from 'react';
import { guideAreas as areas } from './exploreGuideModel.js';
import { BOOKING_URL } from '../navigation/model.js';
import { useModal } from '../ui/useModal.js';
import { Icon } from '../ui/Icons.jsx';
import './explore-guide.css';

export default function ExploreGuide({ design }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [area, setArea] = useState('');
  const [topic, setTopic] = useState('');
  const heading = useRef(null);
  const modal = useModal(() => setOpen(false));
  const links = area === '' ? [] : areas[Number(area)].topics;
  const chosen = links[Number(topic)];
  useEffect(() => {
    if (open) heading.current?.focus();
  }, [step, open]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('guide') === '1') {
      setOpen(true);
      modal.show();
    }
  }, [modal.show]);
  function start() {
    setStep(0);
    setArea('');
    setTopic('');
    setOpen(true);
    modal.show();
  }
  return (
    <>
      <aside
        className="explore-guide-invitation"
        data-design={design}
        aria-label="Optional browsing guide"
      >
        <div>
          <p>NOT SURE WHERE TO BEGIN?</p>
          <h2>Find your starting point.</h2>
          <span className="explore-guide-description">Two quick questions. Helpful information, at your pace.</span>
        </div>
        <button type="button" onClick={start}>
          Explore with a short guide <Icon name="arrow" />
        </button>
      </aside>
      <dialog
        {...modal.dialogProps}
        className="explore-guide-dialog"
        data-design={design}
        aria-labelledby="explore-guide-title"
      >
        <div className="explore-guide-shell">
          <div className="explore-guide-top">
            <span>
              {step < 2 ? `YOUR STARTING POINT · ${step + 1} OF 2` : 'YOUR STARTING POINT'}
            </span>
            <button type="button" onClick={modal.close} aria-label="Close browsing guide">
              <Icon name="close" />
            </button>
          </div>
          <div className="explore-guide-progress" aria-hidden="true">
            <span style={{ width: `${step === 0 ? 50 : 100}%` }} />
          </div>
          <h2 id="explore-guide-title" ref={heading} tabIndex={-1}>
            {step === 0
              ? 'What would you like to explore?'
              : step === 1
                ? 'What would you like to learn about?'
                : 'A place to begin.'}
          </h2>
          {step < 2 ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (step === 0 ? area !== '' : topic !== '') setStep(step + 1);
              }}
            >
              {step === 0 ? (
                <fieldset>
                  <legend className="sr-only">Choose an area of interest</legend>
                  {areas.map((item, index) => (
                    <label className="explore-guide-option" key={item.name}>
                      <input
                        type="radio"
                        name="explore-area"
                        value={index}
                        required
                        checked={area === String(index)}
                        onChange={(event) => {
                          setArea(event.target.value);
                          setTopic('');
                        }}
                      />
                      <span><strong>{item.name}</strong>{' '}<small>{item.detail}</small></span>
                    </label>
                  ))}
                </fieldset>
              ) : (
                <fieldset>
                  <legend className="sr-only">Choose a topic</legend>
                  {links.map((link, index) => (
                    <label className="explore-guide-option" key={link.href}>
                      <input type="radio" name="explore-topic" value={index} required
                        checked={topic === String(index)}
                        onChange={(event) => setTopic(event.target.value)} />
                      <span>{link.label}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              <div className="explore-guide-actions">
                {step === 1 && (
                  <button type="button" onClick={() => setStep(0)}>
                    Back
                  </button>
                )}
                <button
                  className="explore-guide-primary"
                  type="submit"
                  disabled={step === 0 ? area === '' : topic === ''}
                >
                  {step === 0 ? 'Continue' : 'See my starting point'}
                  <Icon name="right" />
                </button>
              </div>
            </form>
          ) : (
            <div className="explore-guide-result">
              <p>
                You chose {areas[Number(area)].name.toLowerCase()}. Explore the information below at
                your own pace.
              </p>
              <a className="explore-guide-result-link" href={chosen.href}>
                {chosen.title}
                <Icon name="arrow" />
              </a>
              <div className="explore-guide-next">
                <h3>When you’re ready to talk</h3>
                <p>A consultation is the next step for personal advice. The team can discuss your questions and whether a treatment is appropriate for you.</p>
              </div>
              <a className="explore-guide-book" href={BOOKING_URL}>
                Request a consultation <Icon name="arrow" />
              </a>
              <a className="explore-guide-visit" href="/your-first-visit/">What to expect at your first visit</a>
              <button className="explore-guide-restart" type="button" onClick={() => setStep(0)}>
                Change my answers
              </button>
            </div>
          )}
          <p className="explore-guide-note">
            This guide helps you explore information. It does not assess suitability or diagnose a condition. No email required; your answers aren’t saved or sent.
          </p>
        </div>
      </dialog>
    </>
  );
}
