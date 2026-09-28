import React from 'react';
import { CheckCircle2, Loader2, Circle, ArrowRight } from 'lucide-react';
import { VERIFICATION_STAGES } from '../../services/verificationService';

interface ProcessingStepsProps {
  currentStep: number;
  currentDetail?: string;
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({
  currentStep,
  currentDetail
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto my-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-2">
          <Loader2 size={13} className="animate-spin text-blue-700" />
          <span>Multi-Stage Verification in Progress</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Analyzing Postal Address & Hierarchy
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Evaluating postal circle boundaries, PIN consistency, and delivery post office jurisdiction
        </p>
      </div>

      {/* Progress Track */}
      <div className="space-y-3 relative">
        {/* Connecting line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 -z-0" />

        {VERIFICATION_STAGES.map((stage) => {
          const isDone = currentStep > stage.step;
          const isCurrent = currentStep === stage.step;
          const isPending = currentStep < stage.step;

          return (
            <div
              key={stage.step}
              className={`relative z-10 flex items-start gap-3.5 p-3 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-blue-50/80 border border-blue-200 shadow-2xs'
                  : isDone
                  ? 'bg-emerald-50/40 border border-emerald-100'
                  : 'bg-white border border-transparent opacity-60'
              }`}
            >
              {/* Step Icon Indicator */}
              <div className="shrink-0 mt-0.5">
                {isDone ? (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                    <CheckCircle2 size={16} />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-xs">
                    <Loader2 size={16} className="animate-spin text-cyan-200" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-semibold">
                    {stage.step}
                  </div>
                )}
              </div>

              {/* Step Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isCurrent
                        ? 'text-blue-900'
                        : isDone
                        ? 'text-emerald-800'
                        : 'text-slate-600'
                    }`}
                  >
                    Step {stage.step}: {stage.title}
                  </h4>
                  {isCurrent && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-200 text-blue-900 animate-pulse">
                      Processing
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {stage.description}
                </p>

                {isCurrent && currentDetail && (
                  <div className="mt-2 text-[11px] font-mono bg-white/90 border border-blue-200 text-blue-950 px-2.5 py-1.5 rounded-md flex items-center gap-1.5">
                    <ArrowRight size={11} className="text-blue-600 shrink-0" />
                    <span className="truncate">{currentDetail}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
