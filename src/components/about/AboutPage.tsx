import React, { useState } from 'react';
import { 
  Info, 
  Workflow, 
  Database, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Send, 
  Code2, 
  ExternalLink,
  Lock,
  GitBranch,
  Bot
} from 'lucide-react';
import { agentService } from '../../services/agentService';
import { postalService } from '../../services/postalService';

export const AboutPage: React.FC = () => {
  const isN8nConfigured = agentService.isN8NConfigured();
  const n8nUrl = agentService.getN8NUrl();
  const [testPayloadVisible, setTestPayloadVisible] = useState(false);

  const samplePayload = {
    address: 'Plot 42, Sector 6, MVP Colony, Visakhapatnam, Andhra Pradesh 530017',
    fullName: 'Dr. K. Srinivas Rao',
    streetLocality: 'Sector 6, MVP Colony',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pin: '530017',
    source: 'PostalAI_Web_Client',
    timestamp: new Date().toISOString()
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold mb-2">
          <Info size={13} className="text-blue-700" />
          <span>System Architecture & Verification Methodology</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          How PostalAI Works
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          PostalAI addresses the pervasive logistical challenge of incorrect Indian PIN codes and misidentified delivery post offices through deterministic, multi-stage address decomposition and official postal jurisdiction cross-referencing.
        </p>
      </div>

      {/* 6 Core Verification Stages */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Workflow size={20} className="text-blue-700" />
          <span>The 6 Conceptual Verification Stages</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Every address runs through an auditable pipeline that isolates parsing, database querying, and logic rules.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              step: '1',
              title: 'Address Parsing',
              desc: 'AI & rule-based tokenization isolates house/flat, street, locality, city, district, state, and 6-digit PIN.'
            },
            {
              step: '2',
              title: 'Locality Identification',
              desc: 'Identifies the geographical locality or urban sector within municipal and post-beat boundaries.'
            },
            {
              step: '3',
              title: 'PIN Database Lookup',
              desc: 'Queries registered postal records for circle, division, region, and official PIN assignment.'
            },
            {
              step: '4',
              title: 'Delivery Office Identification',
              desc: 'Maps the specific Sub Post Office (S.O), Head Office (H.O), or Branch Office (B.O) holding delivery authority.'
            },
            {
              step: '5',
              title: 'Cross-Referencing & Mismatch Check',
              desc: 'Compares the entered PIN against the identified post office to detect discrepancies or conflicting circles.'
            },
            {
              step: '6',
              title: 'Audit Result Generation',
              desc: 'Outputs an auditable verdict (Verified, Needs Review, or Mismatch) with concise, human-readable explanations.'
            }
          ].map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{s.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* High-Level System Architecture Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Layers size={20} className="text-blue-700" />
          <span>System Pipeline Flow</span>
        </h3>
        <p className="text-xs text-slate-500">
          Visual representation of data routing from user ingestion to storage and audit log.
        </p>

        <div className="bg-slate-900 text-slate-200 p-6 rounded-xl border border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[720px] gap-2 text-center text-xs">
            {/* Step 1 */}
            <div className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700">
              <div className="font-bold text-cyan-300 mb-1">User / Operator</div>
              <div className="text-[11px] text-slate-400">Web Form / CSV Bulk</div>
            </div>

            <ArrowRight size={16} className="text-slate-500 shrink-0" />

            {/* Step 2 */}
            <div className="flex-1 p-3 rounded-lg bg-blue-950 border border-blue-800">
              <div className="font-bold text-cyan-300 mb-1">AI Address Parser</div>
              <div className="text-[11px] text-slate-400">Regex & Entity Tokens</div>
            </div>

            <ArrowRight size={16} className="text-slate-500 shrink-0" />

            {/* Step 3 */}
            <div className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700">
              <div className="font-bold text-cyan-300 mb-1">Postal Data Service</div>
              <div className="text-[11px] text-slate-400">Offline DB / Live API</div>
            </div>

            <ArrowRight size={16} className="text-slate-500 shrink-0" />

            {/* Step 4 */}
            <div className="flex-1 p-3 rounded-lg bg-blue-950 border border-blue-800">
              <div className="font-bold text-cyan-300 mb-1">Verification Engine</div>
              <div className="text-[11px] text-slate-400">Rule & Conflict Checker</div>
            </div>

            <ArrowRight size={16} className="text-slate-500 shrink-0" />

            {/* Step 5 */}
            <div className="flex-1 p-3 rounded-lg bg-emerald-950/70 border border-emerald-800">
              <div className="font-bold text-emerald-300 mb-1">Result & History</div>
              <div className="text-[11px] text-slate-300">Audited Slip / CSV Export</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Architecture (Section 14) */}
      <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-bold uppercase mb-2">
              <Bot size={13} />
              <span>Tool-Using AI Agent Model</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Autonomous AI Agent Architecture
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Modern AI agents should <strong>never hallucinate postal data</strong>. Instead, the agent operates as a deterministic workflow orchestrator that invokes dedicated tools.
            </p>
          </div>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Tool 1</span>
            <h5 className="font-bold text-xs text-slate-900 mt-0.5">addressParser()</h5>
            <p className="text-[11px] text-slate-500 mt-1">
              Extracts 6-digit PIN, state names, and cleans address typos without guessing facts.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Tool 2</span>
            <h5 className="font-bold text-xs text-slate-900 mt-0.5">postalLookupTool()</h5>
            <p className="text-[11px] text-slate-500 mt-1">
              Queries verified Indian postal databases for Sub Post Office hierarchy and jurisdiction.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Tool 3</span>
            <h5 className="font-bold text-xs text-slate-900 mt-0.5">verificationRules()</h5>
            <p className="text-[11px] text-slate-500 mt-1">
              Detects PIN-locality conflicts and calculates confidence scores based on hard criteria.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Tool 4</span>
            <h5 className="font-bold text-xs text-slate-900 mt-0.5">resultFormatter()</h5>
            <p className="text-[11px] text-slate-500 mt-1">
              Generates concise human-readable explanations without exposing raw system chain-of-thought.
            </p>
          </div>
        </div>
      </div>

      {/* n8n Integration Guide (Section 15) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GitBranch size={19} className="text-blue-700" />
              <span>n8n AI Agent Webhook Integration</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect external automation workflows via environment variable without code changes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                isN8nConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {isN8nConfigured ? '✓ Webhook Connected' : 'Local Fallback Engine Active'}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <p>
            To route all postal verification requests through an <strong>n8n AI Workflow</strong>:
          </p>

          <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
            # Add to .env or Vercel Environment Variables<br />
            VITE_N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/postal-verify"
          </div>

          <p>
            When <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-900 font-mono">VITE_N8N_WEBHOOK_URL</code> is defined, <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-900 font-mono">agentService.ts</code> dispatches an HTTP POST with the structured address payload. If unset or if a network error occurs, it falls back seamlessly to the high-fidelity local verification engine.
          </p>

          <button
            onClick={() => setTestPayloadVisible(!testPayloadVisible)}
            className="text-blue-700 hover:text-blue-900 font-semibold cursor-pointer flex items-center gap-1 mt-2"
          >
            <Code2 size={13} />
            <span>{testPayloadVisible ? 'Hide sample webhook payload' : 'Inspect sample webhook JSON payload'}</span>
          </button>

          {testPayloadVisible && (
            <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 overflow-x-auto">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* How to replace Demo Data with Real Postal API (Section 16) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Database size={19} className="text-blue-700" />
          <span>Postal Data Source Architecture</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The prototype runs on a curated offline dataset (<strong className="text-slate-900">{postalService.getRecordCount()} post offices</strong>) labeled <strong className="text-blue-900">DEMO DATA MODE</strong>.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <h5 className="font-bold text-slate-900">Connecting Live Postal Data (e.g. data.gov.in / postalpincode.in)</h5>
          <p className="text-slate-600">
            Open <code className="font-mono text-blue-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">src/services/postalService.ts</code>. The class is pre-configured with a clean hook:
          </p>
          <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`// In src/services/postalService.ts:
async getByPincode(pincode: string): Promise<PostalOfficeRecord[]> {
  // Uncomment this line to enable live API lookup:
  return this.getPostalDataFromAPI(pincode);
}`}
          </pre>
          <p className="text-slate-500 text-[11px]">
            No changes to any React components, verification rules, or the dashboard are required when upgrading to a live government postal database.
          </p>
        </div>
      </div>

      {/* Privacy Notice (Section 17) */}
      <div className="p-5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Lock size={18} className="text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900">Privacy & Data Governance Notice</span>
          <p className="leading-relaxed">
            Address information entered into this prototype is used only for verification within the application. Do not enter sensitive personal information into demonstration environments. No address data is stored permanently on remote servers.
          </p>
        </div>
      </div>
    </div>
  );
};
