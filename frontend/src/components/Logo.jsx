import React from 'react';

const Logo = ({ className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="7" fill="#10172A" />
      <path d="M6 19L11 11L15 15.5L22 8" stroke="#F2A93B" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="8" r="2.25" fill="#2DD4BF" />
    </svg>
    <span className="font-display font-semibold text-xl tracking-tight text-ink">
      Trackline
    </span>
  </div>
);

export default Logo;
