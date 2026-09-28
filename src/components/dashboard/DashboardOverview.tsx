import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  FileCheck2, 
  ArrowRight, 
  Search, 
  Eye, 
  RotateCcw,
  Sparkles,
  MapPin,
  Building2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { DashboardStats, VerificationHistoryItem, VerificationResult } from '../../types/postal';
import { StatusBadge } from '../common/StatusBadge';
import { ActivityChart } from './ActivityChart';

interface DashboardOverviewProps {
  stats: DashboardStats;
  recentVerifications: VerificationHistoryItem[];
  onNavigate: (page: string) => void;
  onSelectResult: (result: VerificationResult) => void;
  onTryPreset: (presetId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  recentVerifications,
  onNavigate,
  onSelectResult,
  onTryPreset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredItems = recentVerifications.filter(item => {
    const matchesSearch = 
      item.addressSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pinCode.includes(searchQuery) ||
      item.postOfficeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner with requested core message */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 text-white p-6 sm:p-8 shadow-sm border border-blue-900">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-800/60 border border-blue-700/60 text-cyan-300 text-xs font-semibold mb-3">
            <ShieldCheck size={14} />
            <span>Enterprise Postal Quality Assurance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Verify Before You Send.
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal">
            An AI-assisted system for validating postal addresses, checking PIN consistency, and identifying the appropriate delivery post office.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('verify')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-blue-950 font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <span>Verify an Address</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 border border-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>See How It Works</span>
            </button>
            <button
              onClick={() => onNavigate('bulk')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
            >
              <span>Bulk Verification (CSV)</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 opacity-10 pointer-events-none hidden md:block">
          <MapPin size={280} className="text-white" />
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Verifications */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Verifications
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {stats.total}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Processed in session</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <FileCheck2 size={24} />
          </div>
        </div>

        {/* Verified Addresses */}
        <div className="bg-white rounded-xl border border-emerald-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Verified Addresses
            </p>
            <h3 className="text-2xl font-bold text-emerald-800 mt-1 font-mono">
              {stats.verified}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Clean PIN & office match</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Needs Review */}
        <div className="bg-white rounded-xl border border-amber-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Needs Review
            </p>
            <h3 className="text-2xl font-bold text-amber-800 mt-1 font-mono">
              {stats.needsReview}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Ambiguous or multiple offices</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </div>

        {/* Mismatched Addresses */}
        <div className="bg-white rounded-xl border border-rose-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Mismatched Addresses
            </p>
            <h3 className="text-2xl font-bold text-rose-800 mt-1 font-mono">
              {stats.mismatch}
            </h3>
            <p className="text-xs text-slate-500 mt-1">PIN / Locality discrepancy</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* Activity Chart Section */}
      <ActivityChart data={stats.recentActivity} />

      {/* Workshop Presets Quick Test Bar */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-950">Workshop Test Presets</h4>
            <p className="text-xs text-blue-800/80">Simulate verified, mismatch, and review scenarios instantly.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onTryPreset('demo-verified-mvp')}
            className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            ✓ Test Verified (MVP Colony)
          </button>
          <button
            onClick={() => onTryPreset('demo-mismatch-mvp')}
            className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            ⚠ Test Mismatch (530018)
          </button>
          <button
            onClick={() => onTryPreset('demo-review-ambiguous')}
            className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            ? Test Review (Ambiguous)
          </button>
        </div>
      </div>

      {/* Recent Verifications Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Recent Postal Verifications</h3>
            <p className="text-xs text-slate-500">Audit trail of addresses analyzed in the system</p>
          </div>

          {/* Table Search & Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PIN, city, address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 w-44 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="MISMATCH">Mismatch</option>
            </select>

            <button
              onClick={() => onNavigate('verify')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <MapPin size={13} className="text-cyan-300" />
              <span>Verify New Address</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No verification records match your filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">PIN</th>
                  <th className="py-3 px-4">Post Office</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {item.addressSummary}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {item.city}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {item.pinCode}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {item.postOfficeName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectResult(item.result)}
                        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
