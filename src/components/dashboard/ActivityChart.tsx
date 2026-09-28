import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface ActivityChartProps {
  data: Array<{
    date: string;
    verified: number;
    needsReview: number;
    mismatch: number;
  }>;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  // Calculate max volume for relative scaling
  const maxDayTotal = Math.max(
    ...data.map((d) => d.verified + d.needsReview + d.mismatch),
    5
  );

  const totalVerified = data.reduce((acc, d) => acc + d.verified, 0);
  const totalReview = data.reduce((acc, d) => acc + d.needsReview, 0);
  const totalMismatch = data.reduce((acc, d) => acc + d.mismatch, 0);
  const grandTotal = totalVerified + totalReview + totalMismatch;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
            <BarChart3 size={17} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">Verification Activity</h3>
            <p className="text-xs text-slate-500">Volume and status distribution over the last 7 active periods</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-slate-600 font-medium">Verified ({totalVerified})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span className="text-slate-600 font-medium">Review ({totalReview})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            <span className="text-slate-600 font-medium">Mismatch ({totalMismatch})</span>
          </div>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="pt-2 pb-1">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44">
          {data.map((day, idx) => {
            const dayTotal = day.verified + day.needsReview + day.mismatch;
            const verifiedH = dayTotal > 0 ? (day.verified / maxDayTotal) * 100 : 0;
            const reviewH = dayTotal > 0 ? (day.needsReview / maxDayTotal) * 100 : 0;
            const mismatchH = dayTotal > 0 ? (day.mismatch / maxDayTotal) * 100 : 0;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                {/* Tooltip on hover */}
                <div className="text-[10px] text-slate-600 font-mono mb-1 font-semibold opacity-80 group-hover:opacity-100">
                  {dayTotal > 0 ? dayTotal : '—'}
                </div>

                {/* Stacked bar */}
                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-sm flex flex-col justify-end overflow-hidden h-32">
                  {mismatchH > 0 && (
                    <div
                      style={{ height: `${mismatchH}%` }}
                      className="w-full bg-rose-500 transition-all hover:brightness-110"
                      title={`${day.mismatch} Mismatches`}
                    />
                  )}
                  {reviewH > 0 && (
                    <div
                      style={{ height: `${reviewH}%` }}
                      className="w-full bg-amber-400 transition-all hover:brightness-110"
                      title={`${day.needsReview} Needs Review`}
                    />
                  )}
                  {verifiedH > 0 && (
                    <div
                      style={{ height: `${verifiedH}%` }}
                      className="w-full bg-emerald-500 transition-all hover:brightness-110"
                      title={`${day.verified} Verified`}
                    />
                  )}
                </div>

                <span className="text-[11px] text-slate-500 mt-2 truncate w-full text-center">
                  {day.date.split(',')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Health summary bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <TrendingUp size={13} className="text-blue-700" />
          Overall Consistency Rate:
        </span>
        <span className="font-bold text-slate-800">
          {grandTotal > 0 ? Math.round((totalVerified / grandTotal) * 100) : 100}% Clean Dispatches
        </span>
      </div>
    </div>
  );
};
