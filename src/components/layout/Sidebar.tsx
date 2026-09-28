import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Files, 
  History, 
  Info, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenChat: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenChat,
  isOpenMobile,
  onCloseMobile,
  historyCount
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Analytics & Recent Activities'
    },
    {
      id: 'verify',
      label: 'Verify Address',
      icon: MapPin,
      badge: 'Core',
      description: 'Single Address & PIN Verification'
    },
    {
      id: 'bulk',
      label: 'Bulk Verification',
      icon: Files,
      description: 'CSV Batch Address Processing'
    },
    {
      id: 'history',
      label: 'Verification History',
      icon: History,
      count: historyCount,
      description: 'Local Audit Log'
    },
    {
      id: 'about',
      label: 'About / How It Works',
      icon: Info,
      description: 'AI Architecture & n8n Guide'
    }
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-68 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <MapPin size={18} className="text-cyan-200" />
            </div>
            <div>
              <div className="font-bold text-white tracking-tight text-base leading-none">
                PostalAI
              </div>
              <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider mt-0.5">
                v1.2.0 • Civic Prototype
              </div>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={18}
                    className={isActive ? 'text-cyan-200' : 'text-slate-400'}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-900 text-cyan-200 border border-blue-700">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-blue-800 text-cyan-100'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} className="text-cyan-200" />}
                </div>
              </button>
            );
          })}

          {/* Dedicated n8n AI Chat Agent item */}
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenChat();
                onCloseMobile();
              }}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer bg-gradient-to-r from-blue-900/60 to-slate-800 border border-cyan-500/30 text-cyan-200 hover:from-blue-800 hover:to-slate-700 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="truncate font-semibold text-white">n8n AI Chatbot</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200 border border-cyan-400/40">
                Agent
              </span>
            </button>
          </div>
        </div>

        {/* Architecture & Engine Status Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/70">
          <div className="bg-slate-800/80 rounded-lg p-3 text-xs border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-300 mb-1.5">
              <span className="font-semibold flex items-center gap-1.5 text-white">
                <Cpu size={14} className="text-cyan-400" />
                Rule & Match Engine
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Separates parsing, postal lookup, and verification rules cleanly.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Database size={11} className="text-cyan-400" />
                Demo Records:
              </span>
              <span className="font-semibold text-slate-200">Offline Dataset</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
