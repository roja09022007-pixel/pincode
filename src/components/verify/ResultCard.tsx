import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Building2, 
  MapPin, 
  Copy, 
  Check, 
  Printer, 
  ArrowRight, 
  HelpCircle, 
  RotateCcw,
  Download,
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { VerificationResult } from '../../types/postal';
import { StatusBadge } from '../common/StatusBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { AddressBreakdown } from './AddressBreakdown';

interface ResultCardProps {
  result: VerificationResult;
  onReset: () => void;
  onNavigateHistory?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onReset,
  onNavigateHistory
}) => {
  const [copied, setCopied] = useState(false);

  const fullAddressString = [
    result.parsedAddress.fullName,
    result.parsedAddress.houseFlat,
    result.parsedAddress.streetLocality,
    result.parsedAddress.city,
    result.parsedAddress.district !== result.parsedAddress.city ? result.parsedAddress.district : '',
    result.parsedAddress.state,
    result.enteredPin
  ]
    .filter(Boolean)
    .join(', ');

  const handleCopyStandardized = () => {
    navigator.clipboard.writeText(fullAddressString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isVerified = result.status === 'VERIFIED';
  const isMismatch = result.status === 'MISMATCH';
  const isReview = result.status === 'NEEDS_REVIEW';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden space-y-0 transition-all">
      {/* Result Status Header Bar */}
      <div
        className={`p-6 sm:p-7 border-b ${
          isVerified
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : isMismatch
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : 'bg-amber-50/70 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isVerified
                  ? 'bg-emerald-600 text-white'
                  : isMismatch
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {isVerified ? (
                <CheckCircle2 size={26} />
              ) : isMismatch ? (
                <AlertCircle size={26} />
              ) : (
                <AlertTriangle size={26} />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <StatusBadge status={result.status} size="lg" />
                <span className="text-xs text-slate-500 font-mono">
                  Ref: {result.id}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {isVerified
                  ? 'Address Fully Verified with Postal Records'
                  : isMismatch
                  ? 'Possible Address & PIN Mismatch Detected'
                  : 'Address Needs Manual Review'}
              </h2>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <ConfidenceBadge level={result.confidence} />
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Core Postal Key Information Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Entered PIN */}
          <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Entered PIN Code
            </span>
            <div className="text-2xl font-bold font-mono text-slate-900 flex items-center gap-2">
              <span>{result.enteredPin}</span>
              {isVerified && (
                <span className="text-xs font-sans font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Match
                </span>
              )}
              {isMismatch && (
                <span className="text-xs font-sans font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  Conflict
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {result.parsedAddress.district || result.parsedAddress.city}, {result.parsedAddress.state}
            </p>
          </div>

          {/* Delivery Post Office */}
          <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              {isMismatch ? 'Matched PIN Post Office' : 'Delivery Post Office'}
            </span>
            <div className="text-base font-bold text-slate-900 truncate">
              {result.matchedPostOffice?.officeName || result.suggestedPostOffice || 'Not identified'}
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
              <Building2 size={13} className="text-blue-700" />
              <span>
                {result.matchedPostOffice
                  ? `${result.matchedPostOffice.officeType} • ${result.matchedPostOffice.deliveryStatus}`
                  : 'Pending local office mapping'}
              </span>
            </div>
          </div>

          {/* District & Division */}
          <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              District / Division
            </span>
            <div className="text-base font-bold text-slate-900 truncate">
              {result.matchedPostOffice?.district || result.parsedAddress.district || 'Unassigned'}
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              Division: {result.matchedPostOffice?.division || 'Standard Division'}
            </p>
          </div>

          {/* State & Postal Circle */}
          <div className="bg-slate-50/90 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              State & Circle
            </span>
            <div className="text-base font-bold text-slate-900 truncate">
              {result.matchedPostOffice?.state || result.parsedAddress.state || 'India Post'}
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              Circle: {result.matchedPostOffice?.circle || 'National Circle'}
            </p>
          </div>
        </div>

        {/* MISMATCH SPECIAL RESOLUTION BOX */}
        {isMismatch && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-rose-950">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-bold text-sm text-rose-900">
                  PIN Correction Recommended
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">
                  The entered PIN <span className="font-mono font-bold text-rose-950">{result.enteredPin}</span> does not appear to correspond to the specified locality (<span className="font-semibold">{result.parsedAddress.streetLocality}</span>) according to the available postal dataset.
                </p>

                {result.suggestedPin && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-semibold uppercase">
                        Suggested Accurate PIN
                      </span>
                      <div className="font-mono text-lg font-bold text-blue-900">
                        {result.suggestedPin}
                      </div>
                      <span className="text-slate-600 font-medium">
                        Served by: {result.suggestedPostOffice}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 italic sm:text-right">
                      Correcting this PIN prevents misdirection at central mail sorters.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NEEDS REVIEW SPECIAL GUIDANCE BOX */}
        {isReview && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-950">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <h4 className="font-bold text-sm text-amber-900">
                  Verification Inconclusive — Clarification Required
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  The system could not verify the address with full confidence. This typically occurs when a locality name is ambiguous across multiple taluks or when the address lacks sufficient geographic specificity.
                </p>
                {result.explanation.recommendation && (
                  <p className="text-xs font-semibold text-amber-900 pt-1">
                    Recommendation: {result.explanation.recommendation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI-Parsed Address Components (Section 8) */}
        <AddressBreakdown
          parsed={result.parsedAddress}
          fullAddressString={fullAddressString}
        />

        {/* Why did we get this result? (Section 9) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle size={17} className="text-blue-700" />
            <h4 className="font-bold text-sm text-slate-900">
              Why did we get this result?
            </h4>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed">
            {result.explanation.summary}
          </div>

          <ul className="space-y-1.5 pt-1">
            {result.explanation.details.map((detail, idx) => (
              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Info size={13} className="text-slate-400" />
              <span>{result.confidenceReason}</span>
            </span>
            <span className="font-mono text-[11px] text-slate-600">
              Verified in {result.processingTimeMs}ms • Source: {result.source}
            </span>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyStandardized}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Address'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Verification Slip</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateHistory && (
              <button
                onClick={onNavigateHistory}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors cursor-pointer"
              >
                View in History
              </button>
            )}

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw size={14} className="text-cyan-300" />
              <span>Verify Another Address</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
