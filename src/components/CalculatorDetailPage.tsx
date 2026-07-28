import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorDefinition, CalculationResult } from '../types/calculator';
import { ArrowLeft, Copy, Check, BookOpen, ChevronDown, ChevronUp, Bookmark, RotateCcw } from 'lucide-react';

interface CalculatorDetailPageProps {
  calculator: CalculatorDefinition;
  onBack: () => void;
  onSaveHistory: (calc: CalculatorDefinition, inputs: Record<string, any>, units: Record<string, string>, result: CalculationResult) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const CalculatorDetailPage: React.FC<CalculatorDetailPageProps> = ({
  calculator,
  onBack,
  onSaveHistory,
  isFavorite,
  onToggleFavorite,
}) => {
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
    window.scrollTo(0, 0);
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

  const getBadgeClass = (type?: string) => {
    switch (type) {
      case 'danger': return 'badge-danger';
      case 'warning': return 'badge-warning';
      case 'success': return 'badge-success';
      case 'info':
      default: return 'badge-info';
    }
  };

  return (
    <div className="min-h-screen bg-surface-dim animate-slide-right">
      {/* Material 3 Top App Bar with back navigation */}
      <header className="sticky top-0 z-30 m3-top-app-bar">
        <div className="flex items-center gap-2 px-2 py-2.5">
          {/* Back button */}
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/5 touch-ripple m3-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Title area */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-white truncate">
              {calculator.title}
            </h1>
            <p className="text-[11px] text-slate-500 truncate">{calculator.categoryName}</p>
          </div>

          {/* Actions */}
          <button
            onClick={() => onToggleFavorite(calculator.id)}
            className={`w-11 h-11 rounded-full flex items-center justify-center m3-btn ${
              isFavorite ? 'text-amber-400' : 'text-slate-500'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 pb-28 space-y-4">
        {/* Description Card */}
        <div className="m3-card-elevated p-4">
          <p className="text-[13px] text-slate-400 leading-relaxed">{calculator.description}</p>
          {calculator.abbreviation && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/12 text-sky-400 font-mono">
                {calculator.abbreviation}
              </span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">临床数值输入</h2>
            <button
              onClick={handleReset}
              className="text-[12px] text-slate-500 flex items-center gap-1 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置
            </button>
          </div>

          <div className="space-y-2.5">
            {calculator.fields.map((field) => (
              <div key={field.id} className="m3-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-medium text-slate-200">
                    {field.label}
                  </label>
                  {field.hint && <span className="text-[11px] text-slate-500">{field.hint}</span>}
                </div>

                {field.type === 'number' && (
                  <div className="space-y-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={inputs[field.id] ?? ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      placeholder={field.placeholder || '请输入数值'}
                      className="m3-input font-mono"
                    />

                    {/* Unit Selectors */}
                    {field.units && field.units.length > 0 ? (
                      <div className="flex items-center gap-1.5 bg-surface-container rounded-xl p-1">
                        {field.units.map((u) => (
                          <button
                            key={u.value}
                            type="button"
                            onClick={() => handleUnitChange(field.id, u.value)}
                            className={`flex-1 px-3 py-2 text-[12px] font-semibold rounded-lg transition-all min-h-[36px] ${
                              units[field.id] === u.value
                                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      field.defaultUnit && (
                        <span className="inline-block text-[12px] text-slate-500 bg-surface-container px-3 py-2 rounded-lg font-mono">
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
                    className="m3-input"
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

        {/* Result Panel */}
        <div className="result-panel p-5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              计算结果
            </span>
            <button
              onClick={handleCopyResult}
              className="flex items-center gap-1.5 text-[12px] text-slate-400 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制' : '复制'}</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {result.value}
            </span>
            {result.unit && <span className="text-[14px] font-semibold text-sky-400">{result.unit}</span>}
          </div>

          {result.badge && (
            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[12px] font-semibold ${getBadgeClass(result.badge.type)}`}>
              {result.badge.text}
            </div>
          )}

          {result.details && result.details.length > 0 && (
            <div className="space-y-1.5 pt-3 border-t border-white/5">
              {result.details.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-[12px] py-1.5 px-1">
                  <span className="text-slate-500">{d.label}</span>
                  <span className="font-mono font-semibold text-slate-300">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          {result.interpretation && (
            <div className="p-3.5 bg-sky-500/8 border border-sky-500/15 rounded-xl text-[12px] text-sky-200 leading-relaxed">
              <span className="font-semibold text-sky-400 block mb-1">临床指导：</span>
              {result.interpretation}
            </div>
          )}
        </div>

        {/* Formula Detail Collapsible */}
        <div className="m3-card overflow-hidden">
          <button
            onClick={() => setShowFormulaDetail(!showFormulaDetail)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-[13px] font-medium text-slate-400 hover:text-white transition-colors touch-ripple"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>公式定义与文献引用</span>
            </div>
            {showFormulaDetail ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFormulaDetail && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3 animate-fade-in">
              <div className="bg-surface-dim p-3 rounded-xl font-mono text-[12px] text-sky-300 overflow-x-auto">
                {calculator.formulaEquation}
              </div>

              <p className="text-[12px] text-slate-400 leading-relaxed">{calculator.formulaDescription}</p>

              {calculator.references && calculator.references.length > 0 && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">参考文献：</span>
                  <ul className="space-y-1">
                    {calculator.references.map((ref, idx) => (
                      <li key={idx} className="text-[11px] text-slate-500 leading-relaxed pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-slate-600">
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
    </div>
  );
};
