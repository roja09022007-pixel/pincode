import React from 'react';
import { X } from 'lucide-react';
import { VerificationResult } from '../../types/postal';
import { ResultCard } from './ResultCard';

interface ResultDetailModalProps {
  result: VerificationResult | null;
  onClose: () => void;
}

export const ResultDetailModal: React.FC<ResultDetailModalProps> = ({
  result,
  onClose
}) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">
              Postal Verification Detail
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({result.id})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ResultCard
            result={result}
            onReset={onClose}
          />
        </div>
      </div>
    </div>
  );
};
