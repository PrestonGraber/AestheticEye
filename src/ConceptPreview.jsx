import React from 'react';
const asset = (n) => `${import.meta.env.BASE_URL}assets/${n}`;
// Lightweight illustrated previews of the six compositions; no nested pages or controls.
export default function ConceptPreview({ id }) {
  const dark = id === 'perspective' || id === 'modern',
    ink = dark ? '#f2f3df' : '#203e31',
    paper = dark ? '#203e31' : id === 'clarity' ? '#fafbf6' : '#eeeee3';
  const photo = (name, x, y, w, h, clip) => (
    <image
      href={asset(name)}
      x={x}
      y={y}
      width={w}
      height={h}
      preserveAspectRatio="xMidYMid slice"
      clipPath={clip ? `url(#preview-${id})` : undefined}
    />
  );
  const text = (label, x, y, size = 20, fill = ink) => (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={size}
      fontFamily={
        id === 'serene' || id === 'form'
          ? 'Manrope, Inter, sans-serif'
          : id === 'editorial'
            ? 'DM Sans, Inter, sans-serif'
            : 'Inter, sans-serif'
      }
      fontWeight="500"
      letterSpacing={size > 40 ? -size * 0.055 : 0}
    >
      {label}
    </text>
  );
  const cta = (x, y) => (
    <g>
      <rect
        x={x}
        y={y}
        width="200"
        height="43"
        rx={id === 'form' || id === 'modern' ? 2 : 22}
        fill={dark ? '#dce6c7' : '#294f37'}
      />
      <text
        x={x + 18}
        y={y + 26}
        fill={dark ? '#203e31' : '#fff'}
        fontFamily="Inter, sans-serif"
        fontSize="12"
      >
        Book An Appointment
      </text>
      <text x={x + 172} y={y + 28} fill={dark ? '#203e31' : '#fff'} fontSize="22">
        ↗
      </text>
    </g>
  );
  return (
    <svg className="concept-preview" viewBox="0 0 900 710" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={'preview-' + id}>
          {id === 'serene' ? (
            <circle cx="650" cy="360" r="170" />
          ) : id === 'perspective' ? (
            <rect x="320" y="155" width="260" height="450" rx="130" />
          ) : (
            <rect x="290" y="365" width="335" height="280" rx="80" />
          )}
        </clipPath>
      </defs>
      <rect width="900" height="710" fill={paper} />
      <rect
        width="900"
        height="65"
        fill={id === 'serene' ? '#f0f1e5' : id === 'editorial' ? '#f2f2e7' : '#fafbf6'}
      />
      {id === 'serene' && (
        <rect x="25" y="9" width="850" height="49" rx="25" fill="#f9faf2" stroke="#c8d5ba" />
      )}
      <image href={asset('logo-grey.png')} x="45" y="19" width="19" height="27" />
      <image href={asset('name-color.png')} x="73" y="25" width="200" height="19" />
      {text('About     Treatments     Results     Resources     Contact', 310, 38, 11, '#29452c')}
      <rect
        x="690"
        y="17"
        width="165"
        height="32"
        rx={id === 'serene' || id === 'perspective' ? 17 : id === 'clarity' ? 5 : 0}
        fill={dark ? '#dce7c6' : '#294b35'}
      />
      {text('Book An Appointment  ↗', 704, 37, 10, dark ? '#203e31' : '#fff')}
      {id !== 'serene' && (
        <line x1="0" x2="900" y1="65" y2="65" stroke={dark ? '#536c4e' : '#ccd6c5'} />
      )}
      {id === 'clarity' && (
        <>
          {text('CINCINNATI & DAYTON’S ESTABLISHED EYELID EXPERTS', 230, 120, 10)}
          {text('You deserve to', 200, 207, 72)}
          {text('feel confident.', 220, 283, 72)}
          {cta(280, 305)}
          {photo('blog-2-1.jpg', 50, 430, 220, 215)}
          {photo('schedule.jpg', 290, 365, 335, 280, true)}
          <rect x="645" y="405" width="205" height="240" rx="14" fill="#dce7cb" />
          {text('EXPERIENCE. EXPERTISE.', 667, 443, 10)}
          {text('35+', 664, 532, 80)}
          {text('years of combined', 667, 567, 13)}
          {text('experience', 667, 587, 13)}
        </>
      )}
      {id === 'still' && (
        <>
          {photo('header-image.jpg', 0, 65, 900, 645)}
          <rect x="0" y="65" width="900" height="645" fill="#142b20" opacity=".8" />
          {text('CINCINNATI & DAYTON’S ESTABLISHED EYELID EXPERTS', 65, 210, 10, '#fff')}
          {text('You deserve to', 65, 315, 72, '#fff')}
          {text('feel confident.', 65, 395, 72, '#e3eccf')}
          {text('Your Eyes Deserve Excellence', 65, 448, 17, '#fff')}
          {cta(65, 488)}
          {text('About our practice  →', 65, 660, 13, '#fff')}
          {text('Ⅱ  Pause film', 745, 660, 13, '#fff')}
        </>
      )}
      {id === 'ease' && (
        <>
          <rect x="25" y="90" width="850" height="595" rx="18" fill="#eef1e6" />
          {photo('schedule.jpg', 490, 90, 385, 595)}
          {text('CINCINNATI & DAYTON', 65, 215, 11)}
          {text('You deserve', 65, 307, 53)}
          {text('to feel', 65, 366, 53)}
          {text('confident.', 65, 425, 53, '#526c3d')}
          {text('Your Eyes Deserve Excellence', 65, 477, 14)}
          {cta(65, 510)}
          {text('About our practice  →', 65, 635, 13)}
        </>
      )}
      {id === 'form' && (
        <>
          {text('CINCINNATI AND DAYTON’S', 45, 120, 10)}
          {text('Established', 45, 202, 78)}
          {text('Eyelid Experts.', 45, 282, 78)}
          {cta(640, 230)}
          {photo('Jon-Pargament-Ginger-Henson-license-confirmed.jpg', 45, 325, 400, 325)}
          <rect x="460" y="325" width="220" height="325" fill="#dce5ca" />
          {text('AESTHETICEYE', 482, 366, 10)}
          {text('Your Eyes', 482, 443, 35)}
          {text('Deserve', 482, 483, 35)}
          {text('Excellence.', 482, 523, 35)}
          {photo('header-image.jpg', 695, 325, 160, 325)}
          <rect x="695" y="525" width="160" height="125" fill="#203e31c9" />
          {text('25,000+', 708, 576, 32, '#fff')}
          {text('surgeries performed', 708, 607, 10, '#fff')}
        </>
      )}
      {id === 'perspective' && (
        <>
          {text('CINCINNATI / DAYTON', 45, 107, 10)}
          {text('OCULOPLASTIC SURGEONS', 690, 107, 10)}
          {photo('schedule.jpg', 320, 155, 260, 450, true)}
          {text('Your Eyes.', 140, 355, 124)}
          {text('Deserve Excellence.', 190, 440, 64)}
          {text('Established Eyelid Experts', 45, 663, 14)}
          {cta(600, 630)}
        </>
      )}
      {id === 'editorial' && (
        <>
          {text('AestheticEye.', 40, 216, 139)}
          <line x1="45" x2="855" y1="253" y2="253" stroke="#a2b096" />
          {photo('schedule.jpg', 45, 280, 400, 385)}
          {text('CINCINNATI & DAYTON', 500, 320, 10)}
          {text('Established', 500, 398, 48)}
          {text('Eyelid Experts.', 500, 451, 48)}
          {text('You deserve to feel confident.', 500, 514, 17)}
          {cta(500, 563)}
        </>
      )}
      {id === 'serene' && (
        <>
          {text('CINCINNATI & DAYTON', 45, 156, 10)}
          {text('You deserve', 45, 276, 79)}
          {text('to feel', 45, 363, 79)}
          {text('confident.', 45, 449, 79)}
          {photo('header-image.jpg', 480, 190, 340, 340, true)}
          <circle cx="650" cy="360" r="187" stroke="#bdcbae" strokeDasharray="2 10" fill="none" />
          {cta(45, 495)}
          <line x1="45" x2="855" y1="613" y2="613" stroke="#bdcbae" />
          {text('About our practice', 45, 660, 15)}
          {text('35+ years of combined experience', 485, 660, 15)}
        </>
      )}
      {id === 'modern' && (
        <>
          {text('AESTHETICEYE / CINCINNATI & DAYTON', 45, 136, 10)}
          {text('Your Eyes.', 45, 256, 87)}
          {text('Deserve', 45, 349, 87)}
          {text('Excellence.', 45, 442, 87, '#bbcea3')}
          {cta(45, 516)}
          {photo('Jon-Pargament-Ginger-Henson-license-confirmed.jpg', 505, 115, 350, 480)}
          <rect x="505" y="570" width="350" height="70" fill="#dce5ca" />
          {text('YOU DESERVE TO FEEL CONFIDENT', 527, 611, 11, '#203e31')}
        </>
      )}
      <line x1="45" x2="855" y1="688" y2="688" stroke={dark ? '#82936e' : '#bdcbae'} />
    </svg>
  );
}
