import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  FileText, 
  Info,
  ChevronDown
} from 'lucide-react';
import { AddressInput, VerificationResult } from '../../types/postal';
import { DEMO_PRESETS, DemoPreset } from '../../data/demoPresets';
import { INDIAN_STATES, parseAddress } from '../../services/addressParser';
import { agentService } from '../../services/agentService';
import { ProcessingSteps } from './ProcessingSteps';
import { ResultCard } from './ResultCard';
import { storageService } from '../../services/storageService';

interface VerifyFormProps {
  initialPresetId?: string;
  onVerificationComplete?: (result: VerificationResult) => void;
  onNavigateHistory?: () => void;
}

export const VerifyForm: React.FC<VerifyFormProps> = ({
  initialPresetId,
  onVerificationComplete,
  onNavigateHistory
}) => {
  // Form State
  const [formData, setFormData] = useState<AddressInput>({
    fullName: '',
    houseFlat: '',
    streetLocality: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    rawAddress: ''
  });

  const [inputMode, setInputMode] = useState<'structured' | 'raw'>('structured');
  const [rawText, setRawText] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Verification Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepDetail, setStepDetail] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);

  // Preset selector
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Handle initial preset if passed from Dashboard
  useEffect(() => {
    if (initialPresetId) {
      loadPreset(initialPresetId);
    }
  }, [initialPresetId]);

  const loadPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setFormData({
      fullName: preset.address.fullName || '',
      houseFlat: preset.address.houseFlat || '',
      streetLocality: preset.address.streetLocality || '',
      city: preset.address.city || '',
      district: preset.address.district || '',
      state: preset.address.state || '',
      pinCode: preset.address.pinCode || '',
      rawAddress: preset.address.rawAddress || ''
    });
    setRawText(preset.address.rawAddress || '');
    setErrors({});
    setResult(null);
  };

  const handleInputChange = (field: keyof AddressInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Convert raw freeform text to structured form
  const handleParseRawText = () => {
    if (!rawText.trim()) {
      setErrors({ raw: 'Please enter or paste an address first.' });
      return;
    }
    const parsed = parseAddress(rawText);
    setFormData({
      fullName: parsed.fullName || '',
      houseFlat: parsed.houseFlat || '',
      streetLocality: parsed.streetLocality === 'Not specified' ? '' : parsed.streetLocality,
      city: parsed.city === 'Unknown City' ? '' : parsed.city,
      district: parsed.district === 'Not specified' ? '' : parsed.district,
      state: parsed.state === 'Not specified' ? '' : parsed.state,
      pinCode: parsed.pinCode || '',
      rawAddress: rawText
    });
    setInputMode('structured');
    setErrors({});
  };

  const handleClear = () => {
    setFormData({
      fullName: '',
      houseFlat: '',
      streetLocality: '',
      city: '',
      district: '',
      state: '',
      pinCode: '',
      rawAddress: ''
    });
    setRawText('');
    setErrors({});
    setResult(null);
    setSelectedPresetId('');
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.streetLocality.trim()) {
      errs.streetLocality = 'Street / Locality is required.';
    }

    if (!formData.city.trim()) {
      errs.city = 'City or Taluk is required.';
    }

    if (!formData.pinCode.trim()) {
      errs.pinCode = 'PIN Code is required.';
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pinCode.trim())) {
      errs.pinCode = 'PIN must be a valid 6-digit Indian Postal Code.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputMode === 'raw' && rawText.trim()) {
      const parsed = parseAddress(rawText);
      formData.streetLocality = parsed.streetLocality;
      formData.city = parsed.city;
      formData.district = parsed.district;
      formData.state = parsed.state;
      formData.pinCode = parsed.pinCode;
      formData.rawAddress = rawText;
    }

    if (!validateForm()) return;

    setIsProcessing(true);
    setResult(null);
    setCurrentStep(1);
    setStepDetail('Initiating verification sequence');

    try {
      const { result: verifiedResult } = await agentService.processVerification(
        formData,
        (step, title, detail) => {
          setCurrentStep(step);
          setStepDetail(detail || title);
        }
      );

      // Save to localStorage history
      storageService.addResult(verifiedResult);

      setResult(verifiedResult);
      onVerificationComplete?.(verifiedResult);
    } catch (err: any) {
      console.error('Verification error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Postal Address & PIN Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-check Indian PIN codes against delivery post offices and locality records.
          </p>
        </div>

        {/* Try Demo Address Dropdown / Quick Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <Sparkles size={13} className="text-cyan-600" />
            Try Demo:
          </span>
          <select
            value={selectedPresetId}
            onChange={(e) => loadPreset(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-blue-200 bg-blue-50/60 text-blue-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select a workshop scenario...</option>
            {DEMO_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.tag}] {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Explanation Tag if selected */}
      {selectedPresetId && (
        <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/90 text-xs text-blue-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-blue-700 shrink-0" />
            <span>
              <strong>Scenario Loaded:</strong>{' '}
              {DEMO_PRESETS.find(p => p.id === selectedPresetId)?.description}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="text-blue-700 hover:text-blue-950 font-semibold shrink-0 cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Processing State: Progressive 6 Stages */}
      {isProcessing && (
        <ProcessingSteps
          currentStep={currentStep}
          currentDetail={stepDetail}
        />
      )}

      {/* Result Display Card */}
      {!isProcessing && result && (
        <ResultCard
          result={result}
          onReset={handleClear}
          onNavigateHistory={onNavigateHistory}
        />
      )}

      {/* Main Address Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Input Mode Selector Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/70 px-4 pt-2">
          <button
            type="button"
            onClick={() => setInputMode('structured')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 ${
              inputMode === 'structured'
                ? 'border-blue-900 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={13} />
            <span>Standardized Fields</span>
          </button>

          <button
            type="button"
            onClick={() => setInputMode('raw')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-1.5 ${
              inputMode === 'raw'
                ? 'border-blue-900 text-blue-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={13} />
            <span>Paste Full Address (Auto-Parse)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {inputMode === 'raw' ? (
            /* RAW ADDRESS INPUT MODE */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Paste Full Postal Address
                </label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    if (errors.raw) setErrors(prev => ({ ...prev, raw: '' }));
                  }}
                  placeholder="e.g. Flat 3B, Golden Palms, Plot 42, Sector 6, MVP Colony, Visakhapatnam, Andhra Pradesh 530017"
                  className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${
                    errors.raw ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.raw && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.raw}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  The AI parser will automatically deconstruct your text into recipient, building, locality, city, state, and 6-digit PIN code.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleParseRawText}
                  className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-cyan-600" />
                  <span>Parse into Standard Form</span>
                </button>
              </div>
            </div>
          ) : (
            /* STRUCTURED FIELDS MODE */
            <div className="space-y-4">
              {/* Row 1: Full Name & House/Flat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name / Addressee <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g. Dr. K. Srinivas Rao"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    House / Flat / Plot Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.houseFlat}
                    onChange={(e) => handleInputChange('houseFlat', e.target.value)}
                    placeholder="e.g. Plot No. 42, Flat 3B"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Row 2: Street / Locality */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street / Locality <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.streetLocality}
                  onChange={(e) => handleInputChange('streetLocality', e.target.value)}
                  placeholder="e.g. Sector 6, MVP Colony"
                  className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${
                    errors.streetLocality ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                {errors.streetLocality && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.streetLocality}
                  </p>
                )}
              </div>

              {/* Row 3: City & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Town / Taluk <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Visakhapatnam"
                    className={`w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${
                      errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.city && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District <span className="text-slate-400 font-normal">(Recommended)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="e.g. Visakhapatnam"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Row 4: State & 6-digit PIN Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / Union Territory
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select State...</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      PIN Code <span className="text-rose-600">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">6 digits</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => handleInputChange('pinCode', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 530017"
                    className={`w-full px-3 py-2 text-xs sm:text-sm font-mono tracking-widest font-bold rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-blue-600 ${
                      errors.pinCode ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {errors.pinCode && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.pinCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 size={16} className="text-cyan-300" />
              <span>{isProcessing ? 'Verifying...' : 'Verify Address'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
