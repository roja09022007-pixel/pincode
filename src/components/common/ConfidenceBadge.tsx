import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { ConfidenceLevel } from '../../types/postal';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  showExplanation?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level,
  showExplanation = false
}) => {
  const configs = {
    High: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      barBg: 'bg-emerald-500',
      bars: 3,
      icon: ShieldCheck,
      desc: 'High confidence means the available postal information provides a strong match.'
    },
    Medium: {
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      barBg: 'bg-amber-500',
      bars: 2,
      icon: Shield,
      desc: 'Medium confidence indicates matching district records, with sub-locality beat requiring verification.'
    },
    Low: {
      color: 'text-slate-700 bg-slate-100 border-slate-200',
      barBg: 'bg-rose-500',
      bars: 1,
      icon: ShieldAlert,
      desc: 'Low confidence indicates insufficient or unindexed postal records for this specific area.'
    }
  };

  const config = configs[level] || configs.Low;
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold border ${config.color}`}>
          <Icon size={13} className="shrink-0" />
          <span>Verification confidence: {level}</span>
        </span>
        <div className="flex items-center gap-0.5" title={`Confidence: ${level}`}>
          {[1, 2, 3].map((barIndex) => (
            <span
              key={barIndex}
              className={`h-2.5 w-1.5 rounded-xs transition-colors ${
                barIndex <= config.bars ? config.barBg : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
      {showExplanation && (
        <p className="text-xs text-slate-500 leading-relaxed max-w-md">
          {config.desc}
        </p>
      )}
    </div>
  );
};
