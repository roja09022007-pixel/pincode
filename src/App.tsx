/**
 * PostalAI — Intelligent Postal Address & PIN Verification System
 * 
 * Production-grade civic-tech prototype for postal address verification,
 * Indian PIN consistency checking, and delivery post-office identification.
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PrivacyBanner } from './components/layout/PrivacyBanner';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { VerifyForm } from './components/verify/VerifyForm';
import { BulkVerification } from './components/bulk/BulkVerification';
import { VerificationHistory } from './components/history/VerificationHistory';
import { AboutPage } from './components/about/AboutPage';
import { ResultDetailModal } from './components/verify/ResultDetailModal';
import { VerificationHistoryItem, VerificationResult } from './types/postal';
import { storageService } from './services/storageService';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<VerificationResult | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('');
  
  // History and Dashboard stats state
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState(storageService.getDashboardStats());

  const refreshHistoryState = () => {
    const items = storageService.getHistory();
    setHistory(items);
    setDashboardStats(storageService.getDashboardStats());
  };

  useEffect(() => {
    refreshHistoryState();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryPreset = (presetId: string) => {
    setActivePresetId(presetId);
    setCurrentPage('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerificationComplete = (result: VerificationResult) => {
    refreshHistoryState();
  };

  const getPageTitle = (page: string): string => {
    switch (page) {
      case 'dashboard':
        return 'Verification Dashboard';
      case 'verify':
        return 'Verify Address & PIN';
      case 'bulk':
        return 'Bulk Verification';
      case 'history':
        return 'Verification History';
      case 'about':
        return 'About & Architecture';
      default:
        return 'PostalAI Platform';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Privacy Notice Banner */}
      <PrivacyBanner />

      <div className="flex-1 flex">
        {/* Desktop Sidebar & Mobile Slideover */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          historyCount={history.length}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-68 min-w-0">
          <Header
            currentPageTitle={getPageTitle(currentPage)}
            onNavigate={handleNavigate}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            historyCount={history.length}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentPage === 'dashboard' && (
              <DashboardOverview
                stats={dashboardStats}
                recentVerifications={history}
                onNavigate={handleNavigate}
                onSelectResult={(res) => setSelectedResult(res)}
                onTryPreset={handleTryPreset}
              />
            )}

            {currentPage === 'verify' && (
              <VerifyForm
                initialPresetId={activePresetId}
                onVerificationComplete={handleVerificationComplete}
                onNavigateHistory={() => handleNavigate('history')}
              />
            )}

            {currentPage === 'bulk' && (
              <BulkVerification
                onSelectResult={(res) => setSelectedResult(res)}
              />
            )}

            {currentPage === 'history' && (
              <VerificationHistory
                history={history}
                onSelectResult={(res) => setSelectedResult(res)}
                onRefreshHistory={refreshHistoryState}
                onNavigateVerify={() => handleNavigate('verify')}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage />
            )}
          </main>

          {/* Simple Professional Civic Tech Footer */}
          <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div>
                <span className="font-semibold text-slate-800">PostalAI</span> — Intelligent Postal Address & PIN Verification System
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Demo Data Mode Enabled</span>
                <span>•</span>
                <span>Vercel Deployable</span>
                <span>•</span>
                <span>Modular Service Layer</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Global Result Detail Modal */}
      <ResultDetailModal
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </div>
  );
}
