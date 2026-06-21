import React from 'react';

const StatCard = ({ label, value, sublabel, accent = 'amber' }) => {
  const accentClasses = {
    amber: 'text-amber-dark',
    teal: 'text-teal-dark',
    coral: 'text-coral-dark',
    ink: 'text-ink',
  };

  return (
    <div className="bg-white rounded-card border border-slate-light/50 shadow-card p-5">
      <p className="text-xs font-mono-tracker uppercase tracking-wide text-slate-dark mb-2">{label}</p>
      <p className={`font-display text-3xl font-semibold ${accentClasses[accent] || accentClasses.ink}`}>
        {value}
      </p>
      {sublabel && <p className="text-xs text-slate mt-1">{sublabel}</p>}
    </div>
  );
};

export default StatCard;
