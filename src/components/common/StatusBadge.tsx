import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { VerificationStatus } from '../../types/postal';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const configs = {
    VERIFIED: {
      label: 'VERIFIED',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
      dot: 'bg-emerald-500',
      icon: CheckCircle2
    },
    NEEDS_REVIEW: {
      label: 'NEEDS REVIEW',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/90',
      dot: 'bg-amber-500',
      icon: AlertTriangle
    },
    MISMATCH: {
      label: 'POSSIBLE MISMATCH',
      bg: 'bg-rose-50 text-rose-800 border-rose-200/90',
      dot: 'bg-rose-500',
      icon: AlertCircle
    },
    UNVERIFIED: {
      label: 'UNVERIFIED',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      icon: HelpCircle
    }
  };

  const config = configs[status] || configs.UNVERIFIED;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold tracking-wider'
  };

  const iconSizes = {
    sm: 13,
    md: 15,
    lg: 18
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon size={iconSizes[size]} className="shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
};
