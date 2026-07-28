import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorDefinition, CalculationResult } from '../types/calculator';
import { X, Copy, Check, BookOpen, ChevronDown, ChevronUp, Bookmark, RotateCcw, Activity } from 'lucide-react';

interface CalculatorModalProps {
  calculator: CalculatorDefinition | null;
  onClose: () => void;
  onSaveHistory: (calc: CalculatorDefinition, inputs: Record<string, any>, units: Record<string, string>, result: CalculationResult) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  calculator,
  onClose,
  onSaveHistory,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!calculator) return null;

  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [units, setUnits] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showFormulaDetail, setShowFormulaDetail] = useState(false);

  useEffect(() => {
    const defaultInputs: Record<string, any> = {};
    const defaultUnits: Record<string, string> = {};

    calculator.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultInputs[field.id] = field.defaultValue;
      }
      if (field.defaultUnit) {
        defaultUnits[field.id] = field.defaultUnit;
      } else if (field.units && field.units.length > 0) {
        defaultUnits[field.id] = field.units[0].value;
      }
    });

    setInputs(defaultInputs);
    setUnits(defaultUnits);
    setCopied(false);
    setShowFormulaDetail(false);
  }, [calculator]);

  const handleInputChange = (fieldId: string, value: any) => {
    setInputs((prev) => ({ ...prev, [fieldId]: value }));
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
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'danger':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/40';
      case 'warning':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/40';
      case 'success':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'info':
      default:
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      {/* Container - Bottom sheet on mobile (h-[92vh]), Centered card on desktop */}
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[92vh] sm:h-auto max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Mobile Pull Indicator Bar */}
        <div className="w-12 h-1.5 bg-slate-700/60 rounded-full mx-auto my-2 sm:hidden"></div>

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              {calculator.abbreviation || calculator.categoryName}
            </span>
            <h2 className="font-bold text-white text-base sm:text-lg tracking-tight">{calculator.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(calculator.id)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center btn-touch ${
                isFavorite
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
              }`}
              aria-label="收藏"
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-amber-300' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center justify-center btn-touch"
              aria-label="关闭"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Inputs Section */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">临床数据录入</h3>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 btn-touch"
              >
                <RotateCcw className="w-3.5 h-3.5" /> 重置数值
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {calculator.fields.map((field) => (
                <div key={field.id} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <span>{field.label}</span>
                    </label>
                    {field.hint && <span className="text-[11px] text-slate-400">{field.hint}</span>}
                  </div>

                  {field.type === 'number' && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={inputs[field.id] ?? ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        placeholder={field.placeholder || '请输入数值'}
                        className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3 text-base font-mono text-slate-100 focus:outline-none focus:border-cyan-500 min-h-[48px]"
                      />

                      {/* Touch Friendly Unit Selector */}
                      {field.units && field.units.length > 0 ? (
                        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl p-1 gap-1">
                          {field.units.map((u) => (
                            <button
                              key={u.value}
                              type="button"
                              onClick={() => handleUnitChange(field.id, u.value)}
                              className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold rounded-xl min-h-[40px] btn-touch transition-all ${
                                units[field.id] === u.value
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {u.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        field.defaultUnit && (
                          <span className="text-xs text-slate-400 bg-slate-900 px-4 py-3 rounded-2xl border border-slate-700/80 font-mono text-center min-h-[48px] flex items-center justify-center">
                            {field.defaultUnit}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  {field.type === 'select' && (
                    <select
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 min-h-[48px]"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Result Card */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-cyan-500/40 rounded-3xl p-5 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                实时计算结果
              </span>
              <button
                onClick={handleCopyResult}
                className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700/70 btn-touch"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? '已复制' : '复制结果'}</span>
              </button>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {result.value}
              </span>
              {result.unit && <span className="text-base font-bold text-cyan-400">{result.unit}</span>}
            </div>

            {result.badge && (
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold border mb-3 ${getBadgeStyle(
                  result.badge.type
                )}`}
              >
                <span>{result.badge.text}</span>
              </div>
            )}

            {result.details && result.details.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 pt-3.5 border-t border-slate-800/80">
                {result.details.map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-xs bg-slate-900/80 px-3.5 py-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400">{d.label}</span>
                    <span className="font-mono font-semibold text-slate-200">{d.value}</span>
                  </div>
                ))}
              </div>
            )}

            {result.interpretation && (
              <div className="mt-3.5 p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-xs text-cyan-100 leading-relaxed">
                <span className="font-bold text-cyan-400">临床指导与建议：</span>
                {result.interpretation}
              </div>
            )}
          </div>

          {/* Formula & Reference Collapsible */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
            <button
              onClick={() => setShowFormulaDetail(!showFormulaDetail)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>公式定义推导与文献引用</span>
              </div>
              {showFormulaDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFormulaDetail && (
              <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/70 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-cyan-300 overflow-x-auto">
                  {calculator.formulaEquation}
                </div>

                <p className="text-slate-300 leading-relaxed">{calculator.formulaDescription}</p>

                {calculator.references && calculator.references.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">权威文献与指南引用：</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {calculator.references.map((ref, idx) => (
                        <li key={idx}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
