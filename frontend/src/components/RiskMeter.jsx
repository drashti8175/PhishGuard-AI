import React from 'react';

const RiskMeter = ({ score = 0 }) => {
  // Standard SVG Geometry values
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const cleanScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (cleanScore / 100) * circumference;

  // Determine colors and threats based on score threshold
  let glowColor = 'shadow-[0_0_20px_rgba(16,185,129,0.2)] border-emerald-500/10';
  let strokeColor = '#10B981'; // Emerald
  let textColorClass = 'text-emerald-400 text-glow-emerald';
  let threatLevel = 'SECURE';
  let pulseClass = '';

  if (cleanScore >= 70) {
    glowColor = 'shadow-[0_0_30px_rgba(239,68,68,0.35)] border-red-500/20';
    strokeColor = '#EF4444'; // Crimson
    textColorClass = 'text-red-500 text-glow-danger font-extrabold';
    threatLevel = 'HIGH THREAT';
    pulseClass = 'animate-pulse';
  } else if (cleanScore >= 35) {
    glowColor = 'shadow-[0_0_20px_rgba(245,158,11,0.2)] border-amber-500/15';
    strokeColor = '#F59E0B'; // Amber
    textColorClass = 'text-amber-500 font-bold';
    threatLevel = 'SUSPICIOUS';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`relative flex items-center justify-center w-48 h-48 rounded-full glass-panel border ${glowColor} ${pulseClass} transition-all duration-1000`}>
        {/* Radial Progress Ring */}
        <svg className="w-44 h-44 transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Labels */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white leading-none">
            {cleanScore}%
          </span>
          <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
            Confidence
          </span>
          <span className={`text-[11px] mt-2 tracking-widest uppercase ${textColorClass}`}>
            {threatLevel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
