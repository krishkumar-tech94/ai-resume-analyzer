import React from 'react';

interface ScoreGaugeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  sublabel?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 'md',
  label = 'Score',
  sublabel,
}) => {
  // Normalize score between 0 and 100
  const validScore = Math.max(0, Math.min(100, Math.round(score)));

  // Color mapping based on score
  let strokeColor = '#ef4444'; // Red < 60
  let textColor = 'text-red-400';
  let badgeBg = 'bg-red-500/10 text-red-400 border-red-500/20';
  let gradeText = 'Needs Work';

  if (validScore >= 85) {
    strokeColor = '#10b981'; // Emerald 85+
    textColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    gradeText = 'Excellent';
  } else if (validScore >= 70) {
    strokeColor = '#6366f1'; // Indigo 70-84
    textColor = 'text-indigo-400';
    badgeBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    gradeText = 'Competitive';
  } else if (validScore >= 60) {
    strokeColor = '#f59e0b'; // Amber 60-69
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    gradeText = 'Fair';
  }

  const dimensions = {
    sm: { width: 90, stroke: 7, fontSize: 'text-xl', labelSize: 'text-[10px]' },
    md: { width: 140, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-xs' },
    lg: { width: 190, stroke: 12, fontSize: 'text-5xl', labelSize: 'text-sm' },
  }[size];

  const radius = (dimensions.width - dimensions.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.width}
          className="transform -rotate-90"
        >
          {/* Background Track */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-extrabold tracking-tight ${dimensions.fontSize} ${textColor}`}>
            {validScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <div className="mt-2 flex flex-col items-center">
          <span className={`font-semibold text-slate-200 ${dimensions.labelSize}`}>
            {label}
          </span>
          <span className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badgeBg}`}>
            {gradeText}
          </span>
          {sublabel && (
            <span className="mt-1 text-[11px] text-slate-400 max-w-[150px]">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
