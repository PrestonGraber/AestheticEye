import React from 'react';
import BrandMark from './ui/BrandMark.jsx';
import { Icon } from './ui/Icons.jsx';
import { SITE_URL } from './navigation/model.js';
const socials = [
  ['Facebook', 'https://www.facebook.com/profile.php?id=61570863325154'],
  ['Instagram', 'https://www.instagram.com/aestheticeyemd/'],
  ['TikTok', 'https://www.tiktok.com/@blepharobosses'],
  ['YouTube', 'https://www.youtube.com/@AestheticEyeOculoplasticSurgeo'],
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <span className="brand">
            <BrandMark />
          </span>
          <p className="footer-brand-copy">
            Cincinnati and Dayton’s
            <br />
            Established Eyelid Experts
          </p>
        </div>
        <div>
          <h3>AestheticEye Springboro</h3>
          <p>
            10 Remick Blvd.
            <br />
            Springboro, OH 45066
          </p>
          <p>
            Monday - Friday
            <br />
            8:00 am – 4:00 pm
            <br />
            Closed for lunch 12:00 pm - 12:45 pm
          </p>
          <a href="tel:9379079009">
            (937) 907-9009
            <Icon name="arrow" />
          </a>
        </div>
        <div>
          <h3>AestheticEye Cincinnati</h3>
          <p>
            7903 E. Kemper Rd. Unit B<br />
            Cincinnati, OH 45249
          </p>
          <p>
            Monday - Friday
            <br />
            8:00 am – 4:00 pm
          </p>
          <a href="tel:5135135437">
            (513) 513-5437
            <Icon name="arrow" />
          </a>
        </div>
        <div>
          <h3>Follows Us</h3>
          {socials.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
              <Icon name="arrow" />
            </a>
          ))}
          <a href="sms:9379187631">Text (937) 918-7631</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 AestheticEye. All Rights Reserved.</span>
        <div>
          <a href={`${SITE_URL}/accessibility-policy/`}>Accessibility Policy</a>
          <a href={`${SITE_URL}/privacy-policy/`}>Privacy Policy</a>
          <a href={`${SITE_URL}/sitemap/`}>Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
