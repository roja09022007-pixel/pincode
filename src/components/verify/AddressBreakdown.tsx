import React from 'react';
import { ParsedAddress } from '../../types/postal';
import { MapPin, Building, Globe, Navigation, Home, Hash } from 'lucide-react';

interface AddressBreakdownProps {
  parsed: ParsedAddress;
  fullAddressString: string;
}

export const AddressBreakdown: React.FC<AddressBreakdownProps> = ({
  parsed,
  fullAddressString
}) => {
  const components = [
    {
      label: 'House / Premises',
      value: parsed.houseFlat || 'Not specified',
      icon: Home,
      highlight: false
    },
    {
      label: 'Locality / Area',
      value: parsed.streetLocality,
      icon: Navigation,
      highlight: true
    },
    {
      label: 'City / Taluk',
      value: parsed.city,
      icon: Building,
      highlight: false
    },
    {
      label: 'District',
      value: parsed.district,
      icon: MapPin,
      highlight: false
    },
    {
      label: 'State / Circle',
      value: parsed.state,
      icon: Globe,
      highlight: false
    },
    {
      label: 'PIN Code',
      value: parsed.pinCode,
      icon: Hash,
      highlight: true,
      isMono: true
    }
  ];

  return (
    <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-600" />
            AI-Parsed Address Components
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Semantic decomposition for postal routing and database cross-referencing
          </p>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
          Parser Score: {parsed.confidenceScore}%
        </span>
      </div>

      {/* Full raw or synthesized address */}
      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
          Full Normalized Address
        </span>
        <p className="text-slate-800 font-medium leading-relaxed">
          {fullAddressString}
        </p>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {components.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border bg-white ${
                item.highlight
                  ? 'border-blue-200 shadow-2xs'
                  : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium mb-1">
                <Icon size={12} className={item.highlight ? 'text-blue-600' : 'text-slate-400'} />
                <span className="truncate">{item.label}</span>
              </div>
              <div
                className={`text-xs font-semibold text-slate-900 truncate ${
                  item.isMono ? 'font-mono text-blue-900 font-bold' : ''
                }`}
                title={item.value}
              >
                {item.value || '—'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
