import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Download, 
  RotateCcw, 
  Filter, 
  Calendar, 
  MapPin, 
  Building2,
  CheckCircle2,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { VerificationHistoryItem, VerificationResult, VerificationStatus } from '../../types/postal';
import { StatusBadge } from '../common/StatusBadge';
import { storageService } from '../../services/storageService';

interface VerificationHistoryProps {
  history: VerificationHistoryItem[];
  onSelectResult: (result: VerificationResult) => void;
  onRefreshHistory: () => void;
  onNavigateVerify: () => void;
}

export const VerificationHistory: React.FC<VerificationHistoryProps> = ({
  history,
  onSelectResult,
  onRefreshHistory,
  onNavigateVerify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const handleDelete = (id: string) => {
    storageService.deleteItem(id);
    onRefreshHistory();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all verification history records?')) {
      storageService.clearHistory();
      onRefreshHistory();
    }
  };

  const handleResetDemoData = () => {
    storageService.resetDemoHistory();
    onRefreshHistory();
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = ['ID', 'Date', 'Address', 'City', 'PIN', 'Post Office', 'Status', 'Confidence'];
    const lines = [headers.join(',')];

    history.forEach(item => {
      lines.push([
        `"${item.id}"`,
        `"${new Date(item.timestamp).toLocaleString()}"`,
        `"${item.addressSummary.replace(/"/g, '""')}"`,
        `"${item.city}"`,
        `"${item.pinCode}"`,
        `"${item.postOfficeName}"`,
        `"${item.status}"`,
        `"${item.confidence}"`
      ].join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `postalai_history_export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredItems = history.filter(item => {
    const matchesSearch = 
      item.addressSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pinCode.includes(searchTerm) ||
      item.postOfficeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Verification Audit History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Local browser log of verified addresses, post office mappings, and detected PIN mismatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleResetDemoData}
            className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} className="text-blue-700" />
            <span>Reset Demo Records</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Clear Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['ALL', 'VERIFIED', 'NEEDS_REVIEW', 'MISMATCH'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === f
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'ALL' ? `All (${history.length})` : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search address, PIN, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 w-full sm:w-64"
          />
        </div>
      </div>

      {/* History Items Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <History size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700">No verification records found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {history.length === 0
                ? 'Your audit log is currently empty. Start by verifying an address or loading demo scenarios.'
                : 'No records matched your search query or filter.'}
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={onNavigateVerify}
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Verify New Address
              </button>
              <button
                onClick={handleResetDemoData}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Restore Demo Records
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">PIN</th>
                  <th className="py-3 px-4">Matched Post Office</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {item.addressSummary}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {item.city}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.pinCode}
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {item.postOfficeName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => onSelectResult(item.result)}
                        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-950 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
