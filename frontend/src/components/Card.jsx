import React from 'react';

/**
 * Card – reusable glass‑morphism container used across the new UI.
 * Accepts additional Tailwind classes via `className` prop for flexibility.
 */
const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`glass-panel rounded-3xl p-6 shadow-lg border border-slate-200 bg-white/30 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
