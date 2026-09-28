import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Play, 
  FileText, 
  RefreshCw, 
  Database,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { BulkVerificationRow, VerificationResult, VerificationStatus } from '../../types/postal';
import { StatusBadge } from '../common/StatusBadge';
import { verificationEngine } from '../../services/verificationService';
import { storageService } from '../../services/storageService';

export const BulkVerification: React.FC<{
  onSelectResult?: (result: VerificationResult) => void;
}> = ({ onSelectResult }) => {
  const [fileName, setFileName] = useState<string>('');
  const [rows, setRows] = useState<BulkVerificationRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample CSV Template content
  const sampleCSVTemplate = `name,house,street,locality,city,district,state,pin
Dr. K. Srinivas Rao,Plot 42 Flat 3B,MVP Double Road,MVP Colony,Visakhapatnam,Visakhapatnam,Andhra Pradesh,530017
A. Lakshmi Narayana,Door 14-3-8,MVP Double Road,MVP Colony,Visakhapatnam,Visakhapatnam,Andhra Pradesh,530018
Priya Sundaram,Villa 18,100 Feet Road,Indiranagar,Bengaluru,Bengaluru,Karnataka,560038
Rohan Mehta,B-702 Sea Crest,Pali Hill,Bandra West,Mumbai,Mumbai Suburban,Maharashtra,400001
Rajesh Verma,House 112,2nd Cross,Gandhi Nagar Main Road,Gandhi Nagar,,560009
K. Balaji,Flat 4A,Beach Road,Lawsons Bay Colony,Visakhapatnam,Visakhapatnam,Andhra Pradesh,530018`;

  const downloadSampleTemplate = () => {
    const blob = new Blob([sampleCSVTemplate], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'postal_verification_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSVString = (text: string, name: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return;

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    const parsedRows: BulkVerificationRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV comma splitter handling quotes
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const locality = rowObj['locality'] || rowObj['street'] || rowObj['address'] || '';
      const city = rowObj['city'] || '';
      const pin = (rowObj['pin'] || rowObj['pincode'] || rowObj['postal_code'] || '').replace(/\D/g, '');

      parsedRows.push({
        id: `ROW-${i}-${Date.now()}`,
        rawRow: rowObj,
        name: rowObj['name'] || rowObj['fullname'] || `Recipient ${i}`,
        house: rowObj['house'] || rowObj['flat'] || '',
        street: rowObj['street'] || '',
        locality: locality,
        city: city,
        district: rowObj['district'] || '',
        state: rowObj['state'] || '',
        pin: pin,
        status: 'UNVERIFIED',
        reason: 'Pending verification run'
      });
    }

    setFileName(name);
    setRows(parsedRows);
    setProcessedCount(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSVString(text, file.name);
    };
    reader.readAsText(file);
  };

  const loadDemoBatch = () => {
    parseCSVString(sampleCSVTemplate, 'demo_workshop_batch.csv');
  };

  const handleProcessBatch = async () => {
    if (rows.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setProcessedCount(0);

    const updatedRows = [...rows];

    for (let i = 0; i < updatedRows.length; i++) {
      const row = updatedRows[i];

      const res = await verificationEngine.verifyAddress(
        {
          fullName: row.name,
          houseFlat: row.house,
          streetLocality: row.locality || row.street,
          city: row.city,
          district: row.district,
          state: row.state,
          pinCode: row.pin
        },
        undefined,
        0 // synchronous instant execution for bulk
      );

      // Save to localStorage history
      storageService.addResult(res);

      updatedRows[i] = {
        ...row,
        status: res.status,
        matchedPostOffice: res.matchedPostOffice?.officeName || res.suggestedPostOffice || 'N/A',
        matchedPin: res.suggestedPin || res.enteredPin,
        confidence: res.confidence,
        reason: res.explanation.summary
      };

      setProcessedCount(i + 1);
      // Small tick for UI responsiveness
      await new Promise(r => setTimeout(r, 60));
    }

    setRows(updatedRows);
    setIsProcessing(false);
  };

  const handleDownloadResults = () => {
    if (rows.length === 0) return;

    const headers = [
      'Original Address',
      'Entered PIN',
      'Matched Post Office',
      'Matched PIN',
      'Status',
      'Confidence',
      'Reason'
    ];

    const csvLines = [headers.join(',')];

    rows.forEach(r => {
      const originalAddress = `"${[r.house, r.street, r.locality, r.city, r.district, r.state].filter(Boolean).join(', ')}"`;
      const line = [
        originalAddress,
        `"${r.pin}"`,
        `"${r.matchedPostOffice || ''}"`,
        `"${r.matchedPin || ''}"`,
        `"${r.status}"`,
        `"${r.confidence || ''}"`,
        `"${(r.reason || '').replace(/"/g, '""')}"`
      ];
      csvLines.push(line.join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `verified_postal_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalRows = rows.length;
  const verifiedCount = rows.filter(r => r.status === 'VERIFIED').length;
  const reviewCount = rows.filter(r => r.status === 'NEEDS_REVIEW').length;
  const mismatchCount = rows.filter(r => r.status === 'MISMATCH').length;
  const unverifiedCount = rows.filter(r => r.status === 'UNVERIFIED').length;

  const filteredRows = rows.filter(r => {
    const matchesFilter = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch = 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pin.includes(searchTerm) ||
      (r.matchedPostOffice && r.matchedPostOffice.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Bulk Address & PIN Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload CSV datasets to audit thousands of addresses, detect PIN mismatches, and route to delivery offices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadSampleTemplate}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Download CSV Template</span>
          </button>

          <button
            onClick={loadDemoBatch}
            className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={13} className="text-blue-700" />
            <span>Load Demo Batch</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 p-8 text-center transition-colors shadow-xs">
        <input
          type="file"
          id="csv-file-input"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="csv-file-input" className="cursor-pointer block space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-800 mx-auto flex items-center justify-center">
            <Upload size={22} />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-800 hover:text-blue-700">
              Click to upload CSV address file
            </span>
            <span className="text-slate-500 text-xs block mt-1">
              Supported columns: <code className="font-mono text-blue-900 bg-blue-50 px-1 py-0.5 rounded">name, house, street, locality, city, district, state, pin</code>
            </span>
          </div>
        </label>
      </div>

      {/* File & Batch Processing Panel if rows are present */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
          {/* Batch Metadata Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-blue-700" />
                <h3 className="font-bold text-slate-900 text-base">{fileName || 'Address_Batch.csv'}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono font-semibold">
                  {totalRows} records
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Data Mode: <strong className="text-blue-900">Demo Postal Dataset</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleProcessBatch}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
              >
                {isProcessing ? (
                  <RefreshCw size={15} className="animate-spin text-cyan-300" />
                ) : (
                  <Play size={15} className="text-cyan-300" />
                )}
                <span>{isProcessing ? `Processing (${processedCount}/${totalRows})...` : 'Process Batch Verification'}</span>
              </button>

              <button
                onClick={handleDownloadResults}
                disabled={unverifiedCount === totalRows || isProcessing}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Download Results CSV</span>
              </button>
            </div>
          </div>

          {/* Progress bar if running */}
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Progress: {processedCount} / {totalRows} addresses analyzed</span>
                <span>{Math.round((processedCount / totalRows) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-150"
                  style={{ width: `${(processedCount / totalRows) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Verified</span>
              <span className="text-xl font-bold font-mono text-emerald-900">{verifiedCount}</span>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-800 uppercase block">Needs Review</span>
              <span className="text-xl font-bold font-mono text-amber-900">{reviewCount}</span>
            </div>
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
              <span className="text-[11px] font-semibold text-rose-800 uppercase block">Mismatches</span>
              <span className="text-xl font-bold font-mono text-rose-900">{mismatchCount}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-600 uppercase block">Unverified</span>
              <span className="text-xl font-bold font-mono text-slate-900">{unverifiedCount}</span>
            </div>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'VERIFIED', 'NEEDS_REVIEW', 'MISMATCH'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === f
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'ALL' ? 'All Records' : f.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, locality, PIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 w-full sm:w-60"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Address & Locality</th>
                  <th className="py-2.5 px-3">Entered PIN</th>
                  <th className="py-2.5 px-3">Matched Post Office</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Reason / Suggestion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                      {[r.house, r.street, r.locality, r.city, r.state].filter(Boolean).join(', ')}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {r.pin}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                      {r.matchedPostOffice || '—'}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate text-[11px]">
                      {r.reason || 'Pending verification'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
