import React, { useState } from 'react';
import { Lock, Shield, X } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-100 border-b border-slate-200 text-slate-700 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-blue-700 shrink-0" />
          <p className="leading-snug">
            <span className="font-semibold text-slate-900">Privacy Notice:</span> Address information entered into this prototype is used only for in-browser verification. Do not enter sensitive personal information into demonstration environments.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer transition-colors"
          title="Dismiss privacy notice"
          aria-label="Dismiss privacy notice"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
