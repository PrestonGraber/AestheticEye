import React, { useEffect, useId, useRef, useState } from 'react';
import { original } from '../content.js';
import { BookLink } from '../ui/Primitives.jsx';
import { Icon } from '../ui/Icons.jsx';
import { adjacentIndex } from '../navigation/model.js';
import './contact.css';

export const locations = [
  {
    name: 'Springboro',
    street: '10 Remick Blvd.',
    city: 'Springboro, OH 45066',
    phone: '(937) 907-9009',
    tel: '9379079009',
    lunch: 'Closed for lunch 12:00 pm - 12:45 pm',
  },
  {
    name: 'Cincinnati',
    street: '7903 E. Kemper Rd. Unit B',
    city: 'Cincinnati, OH 45249',
    phone: '(513) 513-5437',
    tel: '5135135437',
    lunch: '',
  },
];

export default function Contact({ design = 'clarity' }) {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(null);
  const [notice, setNotice] = useState('');
  const tabs = useRef([]);
  const timer = useRef(null);
  const id = useId();
  const location = locations[selected];
  const address = `${location.street}, ${location.city}`;
  useEffect(() => () => clearTimeout(timer.current), []);

  function choose(index) {
    setSelected(index);
    setNotice('');
  }
  function keys(event, index) {
    const next = adjacentIndex(index, event.key, locations.length);
    if (next === null) return;
    event.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  }
  async function copyAddress() {
    const current = location.name;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(current);
      setNotice(`${current} address copied.`);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setCopied(null);
        setNotice('');
      }, 2500);
    } catch {
      setNotice('Copy is unavailable here. The full address is shown above.');
    }
  }

  return (
    <section
      className="section contact-section"
      id="contact"
      data-design={design}
      aria-labelledby="contact-title"
    >
      <div className="contact-invitation">
        <p className="art-kicker">{original.paragraphs[19]}</p>
        <h2 id="contact-title">
          Schedule Your
          <br />
          <span>Consultation Today.</span>
        </h2>
        <p className="contact-intro-copy">{original.paragraphs[20]}</p>
        <div className="contact-actions">
          <BookLink light={design !== 'form' && design !== 'editorial' && design !== 'serene'} />
          <a className="contact-text-link" href="sms:9379187631">
            Text (937) 918-7631
            <Icon name="arrow" />
          </a>
        </div>
      </div>
      <div className="location-card-v6">
        <div className="location-tabs" role="tablist" aria-label="Practice locations">
          {locations.map((item, index) => (
            <button
              type="button"
              role="tab"
              key={item.name}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={`${id}-location-${index}`}
              aria-selected={selected === index}
              aria-controls={`${id}-location-panel`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={(event) => keys(event, index)}
            >
              <span aria-hidden="true">0{index + 1}</span>
              {item.name}
            </button>
          ))}
        </div>
        <div
          className="location-panel"
          id={`${id}-location-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-location-${selected}`}
          tabIndex={0}
        >
          <div className="location-name">
            <h3>
              AestheticEye
              <br />
              {location.name}
            </h3>
            <span className="location-symbol" aria-hidden="true">
              <Icon name="arrow" />
            </span>
          </div>
          <address>
            {location.street}
            <br />
            {location.city}
          </address>
          <div className="location-hours">
            <span>Monday - Friday</span>
            <p>
              8:00 am – 4:00 pm
              {location.lunch && (
                <>
                  <br />
                  <small>{location.lunch}</small>
                </>
              )}
            </p>
          </div>
          <a className="location-phone" href={`tel:${location.tel}`}>
            {location.phone}
            <Icon name="arrow" />
          </a>
          <div className="location-tools">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            >
              Get directions
              <Icon name="arrow" />
            </a>
            <button type="button" onClick={copyAddress}>
              {copied === location.name ? 'Address copied' : 'Copy address'}
              <Icon name={copied === location.name ? 'check' : 'plus'} />
            </button>
          </div>
          <span className="sr-only" role="status" aria-live="polite">
            {notice}
          </span>
        </div>
      </div>
    </section>
  );
}
