import React from 'react';
import { Mail, CheckCircle2, Shield, Menu, PlusCircle, Bell, User } from 'lucide-react';
import { DemoModeBanner } from '../common/DemoModeBanner';

interface HeaderProps {
  currentPageTitle: string;
  onNavigate: (page: string) => void;
  onToggleMobileMenu: () => void;
  onOpenChat: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPageTitle,
  onNavigate,
  onToggleMobileMenu,
  onOpenChat,
  historyCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Logo / Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-800 transition-colors">
              <Mail size={18} className="text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight">PostalAI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  GovTech
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Intelligent Address & PIN Verification
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 text-sm">
            <span className="text-slate-400 font-normal">/</span>
            <span className="font-semibold text-slate-800">{currentPageTitle}</span>
          </div>
        </div>

        {/* Right: Quick actions & user info */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <DemoModeBanner compact onLearnMoreClick={() => onNavigate('about')} />

          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-blue-950 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            title="Chat with n8n Postal AI Agent"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
            </span>
            <span>AI Chat</span>
          </button>

          <button
            onClick={() => onNavigate('verify')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle size={15} className="text-cyan-300" />
            <span className="hidden sm:inline">Verify Address</span>
            <span className="sm:hidden">Verify</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <User size={15} />
            </div>
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-slate-800 leading-tight">Postal Officer</div>
              <div className="text-[10px] text-slate-500">Verification Desk</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
