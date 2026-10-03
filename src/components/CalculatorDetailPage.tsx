import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorDefinition, CalculationResult, PatientProfile } from '../types/calculator';
import { 
  ArrowLeft, Copy, Check, BookOpen, ChevronDown, ChevronUp, 
  Bookmark, RotateCcw, UserCheck, Plus, Minus, FileText, Sparkles 
} from 'lucide-react';
import { EMRNoteModal } from './EMRNoteModal';

interface CalculatorDetailPageProps {
  calculator: CalculatorDefinition;
  onBack: () => void;
  onSaveHistory: (calc: CalculatorDefinition, inputs: Record<string, any>, units: Record<string, string>, result: CalculationResult) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  patientProfile?: PatientProfile;
  onOpenPatientProfile?: () => void;
  onShowSnackbar?: (text: string) => void;
  initialInputs?: Record<string, any>;
  initialUnits?: Record<string, string>;
}

export const CalculatorDetailPage: React.FC<CalculatorDetailPageProps> = ({
  calculator,
  onBack,
  onSaveHistory,
  isFavorite,
  onToggleFavorite,
  patientProfile,
  onOpenPatientProfile,
  onShowSnackbar,
  initialInputs,
  initialUnits,
}) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [units, setUnits] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showFormulaDetail, setShowFormulaDetail] = useState(false);
  const [isEMRModalOpen, setIsEMRModalOpen] = useState(false);

  // Initialize or re-fill inputs
  useEffect(() => {
    const defaultInputs: Record<string, any> = {};
    const defaultUnits: Record<string, string> = {};

    calculator.fields.forEach((field) => {
      // 1. Initial snapshot from history (if provided)
      if (initialInputs && initialInputs[field.id] !== undefined) {
        defaultInputs[field.id] = initialInputs[field.id];
      } 
      // 2. Or pre-fill from patient profile if available
      else if (patientProfile && patientProfile.isConfigured) {
        if (field.id === 'gender' && patientProfile.gender) {
          defaultInputs[field.id] = patientProfile.gender;
        } else if (field.id === 'age' && patientProfile.age !== undefined) {
          defaultInputs[field.id] = patientProfile.age;
        } else if (field.id === 'height' && patientProfile.heightCm !== undefined) {
          defaultInputs[field.id] = patientProfile.heightCm;
        } else if (field.id === 'weight' && patientProfile.weightKg !== undefined) {
          defaultInputs[field.id] = patientProfile.weightKg;
        } else if ((field.id === 'scr' || field.id === 'creatinine') && patientProfile.scrUmol !== undefined) {
          defaultInputs[field.id] = patientProfile.scrUmol;
        } else if (field.defaultValue !== undefined) {
          defaultInputs[field.id] = field.defaultValue;
        }
      } 
      // 3. Fallback to default field value
      else if (field.defaultValue !== undefined) {
        defaultInputs[field.id] = field.defaultValue;
      }

      // Units
      if (initialUnits && initialUnits[field.id] !== undefined) {
        defaultUnits[field.id] = initialUnits[field.id];
      } else if (field.defaultUnit) {
        defaultUnits[field.id] = field.defaultUnit;
      } else if (field.units && field.units.length > 0) {
        defaultUnits[field.id] = field.units[0].value;
      }
    });

    setInputs(defaultInputs);
    setUnits(defaultUnits);
    setCopied(false);
    setShowFormulaDetail(false);
    window.scrollTo(0, 0);
  }, [calculator, patientProfile, initialInputs, initialUnits]);

  // Check if current calculator matches any patient profile field
  const hasPatientProfileMatches = useMemo(() => {
    if (!patientProfile || !patientProfile.isConfigured) return false;
    const matchIds = ['gender', 'age', 'height', 'weight', 'scr', 'creatinine'];
    return calculator.fields.some((f) => matchIds.includes(f.id));
  }, [calculator, patientProfile]);

  const handleApplyPatientProfile = () => {
    if (!patientProfile || !patientProfile.isConfigured) {
      if (onOpenPatientProfile) onOpenPatientProfile();
      return;
    }

    const updated = { ...inputs };
    calculator.fields.forEach((f) => {
      if (f.id === 'gender' && patientProfile.gender) updated[f.id] = patientProfile.gender;
      if (f.id === 'age' && patientProfile.age !== undefined) updated[f.id] = patientProfile.age;
      if (f.id === 'height' && patientProfile.heightCm !== undefined) updated[f.id] = patientProfile.heightCm;
      if (f.id === 'weight' && patientProfile.weightKg !== undefined) updated[f.id] = patientProfile.weightKg;
      if ((f.id === 'scr' || f.id === 'creatinine') && patientProfile.scrUmol !== undefined) updated[f.id] = patientProfile.scrUmol;
    });
    setInputs(updated);
    if (onShowSnackbar) {
      onShowSnackbar('已载入患者档案数据');
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setInputs((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleStepValue = (fieldId: string, stepDelta: number, min?: number, max?: number) => {
    const cur = Number(inputs[fieldId]) || 0;
    let next = cur + stepDelta;
    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;
    // Round to avoid floating point weirdness
    const rounded = Math.round(next * 100) / 100;
    handleInputChange(fieldId, rounded);
  };

  const handleUnitChange = (fieldId: string, unitValue: string) => {
    setUnits((prev) => ({ ...prev, [fieldId]: unitValue }));
  };

  const handleReset = () => {
    const defaultInputs: Record<string, any> = {};
    calculator.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultInputs[field.id] = field.defaultValue;
      }
    });
    setInputs(defaultInputs);
    if (onShowSnackbar) onShowSnackbar('已重置为默认初始值');
  };

  const result: CalculationResult = useMemo(() => {
    try {
      return calculator.calculate(inputs, units);
    } catch (e) {
      return { title: '计算处理中', value: '--' };
    }
  }, [calculator, inputs, units]);

  useEffect(() => {
    if (result && result.value !== '--') {
      const timer = setTimeout(() => {
        onSaveHistory(calculator, inputs, units, result);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [calculator, inputs, units, result, onSaveHistory]);

  const handleCopyResult = () => {
    let copyText = `【OncoCalculate】${calculator.title}\n`;
    copyText += `计算结果: ${result.value} ${result.unit || ''}\n`;
    if (result.badge) copyText += `临床评估: ${result.badge.text}\n`;
    if (result.details) {
      result.details.forEach((d) => {
        copyText += `${d.label}: ${d.value}\n`;
      });
    }
    if (result.interpretation) copyText += `临床指导: ${result.interpretation}\n`;

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    if (onShowSnackbar) onShowSnackbar('计算结果已复制至剪贴板');
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeClass = (type?: string) => {
    switch (type) {
      case 'danger': return 'badge-danger';
      case 'warning': return 'badge-warning';
      case 'success': return 'badge-success';
      case 'info':
      default: return 'badge-info';
    }
  };

  // Get field presets (e.g. for height, weight, target AUC, etc.)
  const getFieldPresets = (field: any) => {
    if (field.presets && field.presets.length > 0) return field.presets;
    if (field.id === 'auc') {
      return [
        { label: 'AUC 4', value: 4 },
        { label: 'AUC 5', value: 5 },
        { label: 'AUC 6', value: 6 },
      ];
    }
    if (field.id === 'height') {
      return [
        { label: '160cm', value: 160 },
        { label: '165cm', value: 165 },
        { label: '170cm', value: 170 },
        { label: '175cm', value: 175 },
      ];
    }
    if (field.id === 'weight') {
      return [
        { label: '50kg', value: 50 },
        { label: '60kg', value: 60 },
        { label: '65kg', value: 65 },
        { label: '70kg', value: 70 },
      ];
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-surface-dim animate-slide-right pb-28">
      {/* Material 3 Top App Bar with back navigation */}
      <header className="sticky top-0 z-30 m3-top-app-bar">
        <div className="flex items-center gap-2 px-2 py-2.5 max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={onBack}
            className="w-11 h-11 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/10 active:scale-95 transition-all"
            aria-label="返回"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Title area */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold text-white truncate">
              {calculator.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate">{calculator.categoryName}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(calculator.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all ${
                isFavorite ? 'text-amber-400 bg-amber-500/15' : 'text-slate-400 hover:text-white'
              }`}
              aria-label={isFavorite ? '取消收藏' : '加入收藏'}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-3.5 space-y-4">
        {/* Description & Patient Profile Bar */}
        <div className="m3-card p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] text-slate-300 leading-relaxed flex-1">{calculator.description}</p>
            {calculator.abbreviation && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/25 font-mono flex-shrink-0">
                {calculator.abbreviation}
              </span>
            )}
          </div>

          {/* Patient Profile Sync Alert */}
          {hasPatientProfileMatches && (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-medium">
                <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  患者档案: {patientProfile?.gender === 'female' ? '女' : '男'}
                  {patientProfile?.age ? ` / ${patientProfile.age}岁` : ''}
                  {patientProfile?.heightCm ? ` / ${patientProfile.heightCm}cm` : ''}
                  {patientProfile?.weightKg ? ` / ${patientProfile.weightKg}kg` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={handleApplyPatientProfile}
                className="text-[11px] font-semibold text-sky-300 bg-sky-500/15 hover:bg-sky-500/25 px-2.5 py-1 rounded-lg border border-sky-500/30 transition-all flex items-center gap-1 active:scale-95"
              >
                <Sparkles className="w-3 h-3" />
                重新套用
              </button>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">临床数值输入</h2>
            <button
              onClick={handleReset}
              className="text-[12px] text-slate-400 hover:text-sky-400 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-surface-container border border-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置数值
            </button>
          </div>

          <div className="space-y-3">
            {calculator.fields.map((field) => {
              const presets = getFieldPresets(field);

              return (
                <div key={field.id} className="m3-card p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[14px] font-semibold text-slate-200">
                      {field.label}
                    </label>
                    {field.hint && <span className="text-[11px] text-slate-400">{field.hint}</span>}
                  </div>

                  {field.type === 'number' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Stepper Down Button */}
                        <button
                          type="button"
                          onClick={() => handleStepValue(field.id, -(field.step || 1), field.min, field.max)}
                          className="w-11 h-11 rounded-xl bg-surface-container hover:bg-white/10 active:scale-90 border border-white/10 flex items-center justify-center text-slate-300 font-bold transition-all flex-shrink-0"
                          aria-label="减少"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        {/* Number Input */}
                        <input
                          type="number"
                          inputMode="decimal"
                          value={inputs[field.id] ?? ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          placeholder={field.placeholder || '请输入数值'}
                          className="m3-input font-mono text-center text-[16px] font-bold flex-1"
                        />

                        {/* Stepper Up Button */}
                        <button
                          type="button"
                          onClick={() => handleStepValue(field.id, field.step || 1, field.min, field.max)}
                          className="w-11 h-11 rounded-xl bg-surface-container hover:bg-white/10 active:scale-90 border border-white/10 flex items-center justify-center text-slate-300 font-bold transition-all flex-shrink-0"
                          aria-label="增加"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        {/* Single Unit Label */}
                        {!field.units && field.defaultUnit && (
                          <span className="text-[12px] text-slate-400 bg-surface-container px-3 py-2.5 rounded-xl border border-white/10 font-mono flex items-center justify-center flex-shrink-0 min-h-[44px]">
                            {field.defaultUnit}
                          </span>
                        )}
                      </div>

                      {/* Multi-unit Switcher Chips */}
                      {field.units && field.units.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-surface-container rounded-xl p-1 border border-white/5">
                          {field.units.map((u) => (
                            <button
                              key={u.value}
                              type="button"
                              onClick={() => handleUnitChange(field.id, u.value)}
                              className={`flex-1 px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                                units[field.id] === u.value
                                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Presets Chips (Quick Fill) */}
                      {presets && presets.length > 0 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                          <span className="text-[10px] text-slate-500 mr-0.5 flex-shrink-0">预设:</span>
                          {presets.map((p: any, idx: number) => {
                            const isSelected = String(inputs[field.id]) === String(p.value);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleInputChange(field.id, p.value)}
                                className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition-all ${
                                  isSelected
                                    ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-bold'
                                    : 'bg-surface-container border-white/5 text-slate-400 hover:text-white'
                                }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {field.type === 'select' && (
                    <select
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="m3-input text-[14px]"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Calculation Result Box */}
        <div className="result-panel p-5 space-y-3 animate-fade-in relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              计算结果
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsEMRModalOpen(true)}
                className="flex items-center gap-1.5 text-[12px] text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/20 active:scale-95 transition-all font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>病历小结</span>
              </button>
              <button
                type="button"
                onClick={handleCopyResult}
                className="flex items-center gap-1.5 text-[12px] text-slate-300 bg-surface-container hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 active:scale-95 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制' : '复制'}</span>
              </button>
            </div>
          </div>

          {/* Hero Value Display */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              {result.value}
            </span>
            {result.unit && <span className="text-[15px] font-bold text-sky-400">{result.unit}</span>}
          </div>

          {result.badge && (
            <div className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-[12px] font-bold ${getBadgeClass(result.badge.type)}`}>
              {result.badge.text}
            </div>
          )}

          {result.details && result.details.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/5">
              {result.details.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-[12px] py-1.5 px-2 bg-surface-container/60 rounded-xl">
                  <span className="text-slate-400">{d.label}</span>
                  <span className="font-mono font-semibold text-slate-200">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          {result.interpretation && (
            <div className="p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-[12px] text-sky-100 leading-relaxed">
              <span className="font-bold text-sky-400 block mb-1">临床指导建议：</span>
              {result.interpretation}
            </div>
          )}
        </div>

        {/* Formula Detail Collapsible */}
        <div className="m3-card overflow-hidden">
          <button
            onClick={() => setShowFormulaDetail(!showFormulaDetail)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-[13px] font-medium text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>公式定义推导与文献引用</span>
            </div>
            {showFormulaDetail ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showFormulaDetail && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3 animate-fade-in text-[12px]">
              <div className="bg-surface-dim p-3 rounded-xl font-mono text-sky-300 overflow-x-auto border border-white/5">
                {calculator.formulaEquation}
              </div>

              <p className="text-slate-300 leading-relaxed">{calculator.formulaDescription}</p>

              {calculator.references && calculator.references.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">权威文献与指南引用：</span>
                  <ul className="space-y-1">
                    {calculator.references.map((ref, idx) => (
                      <li key={idx} className="text-[11px] text-slate-400 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-slate-500">
                        {ref}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* EMR Structured Note Modal */}
      <EMRNoteModal
        isOpen={isEMRModalOpen}
        onClose={() => setIsEMRModalOpen(false)}
        calculator={calculator}
        inputs={inputs}
        units={units}
        result={result}
        onShowSnackbar={onShowSnackbar || (() => {})}
      />
    </div>
  );
};
