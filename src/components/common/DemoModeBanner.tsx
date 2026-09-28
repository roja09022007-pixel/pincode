import React from 'react';
import { Database, ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { agentService } from '../../services/agentService';
import { postalService } from '../../services/postalService';

interface DemoModeBannerProps {
  onLearnMoreClick?: () => void;
  compact?: boolean;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  onLearnMoreClick,
  compact = false
}) => {
  const isN8nConnected = agentService.isN8NConfigured();
  const demoCount = postalService.getRecordCount();

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
        </span>
        <span className="font-semibold text-blue-950">DEMO DATA MODE</span>
        <span className="text-blue-700/80">({demoCount} postal records)</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white px-4 py-2.5 text-xs shadow-xs border-b border-blue-800/50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 shrink-0">
            <Database size={13} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-[10px]">
              DEMO DATA MODE
            </span>
            <span className="text-slate-200">
              Running with curated Indian postal records ({demoCount} post offices indexed offline).
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isN8nConnected ? (
            <span className="inline-flex items-center gap-1 text-emerald-300 font-medium">
              <CheckCircle2 size={13} /> n8n Webhook Active
            </span>
          ) : (
            <span className="text-slate-400 hidden md:inline">
              Modular architecture ready for live India Post API or n8n AI Agent
            </span>
          )}

          {onLearnMoreClick && (
            <button
              onClick={onLearnMoreClick}
              className="inline-flex items-center gap-1 font-semibold text-cyan-300 hover:text-cyan-100 hover:underline transition-colors cursor-pointer"
            >
              <span>Architecture & API Setup</span>
              <ExternalLink size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
