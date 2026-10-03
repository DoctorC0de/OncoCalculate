import React, { useState } from 'react';
import { CalculatorDefinition, CalculationResult } from '../types/calculator';
import { X, Copy, Check, Share2, FileText, Sparkles } from 'lucide-react';

interface EMRNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculator: CalculatorDefinition;
  inputs: Record<string, any>;
  units: Record<string, string>;
  result: CalculationResult;
  onShowSnackbar: (text: string) => void;
}

export const EMRNoteModal: React.FC<EMRNoteModalProps> = ({
  isOpen,
  onClose,
  calculator,
  inputs,
  units,
  result,
  onShowSnackbar,
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Build input parameters summary
  const inputSummary: string[] = [];
  calculator.fields.forEach((f) => {
    const val = inputs[f.id];
    if (val !== undefined && val !== '') {
      if (f.type === 'select' && f.options) {
        const opt = f.options.find((o) => String(o.value) === String(val));
        inputSummary.push(`${f.label}: ${opt ? opt.label.split('[')[0].trim() : val}`);
      } else {
        const unit = units[f.id] || f.defaultUnit || '';
        inputSummary.push(`${f.label}: ${val} ${unit}`.trim());
      }
    }
  });

  let defaultNote = `【肿瘤临床评估记录】\n`;
  defaultNote += `评估项目: ${calculator.title} (${calculator.abbreviation || calculator.categoryName})\n`;
  defaultNote += `评估时间: ${timeStr}\n`;
  if (inputSummary.length > 0) {
    defaultNote += `基础参数:\n  • ${inputSummary.join('\n  • ')}\n`;
  }
  defaultNote += `测算结果: ${result.value} ${result.unit || ''}\n`;
  if (result.badge) {
    defaultNote += `临床分级: ${result.badge.text}\n`;
  }
  if (result.details && result.details.length > 0) {
    defaultNote += `明细指标:\n`;
    result.details.forEach((d) => {
      defaultNote += `  - ${d.label}: ${d.value}\n`;
    });
  }
  if (result.interpretation) {
    defaultNote += `临床指导建议:\n  ${result.interpretation}\n`;
  }
  defaultNote += `----------------------------------------\n`;
  defaultNote += `记录工具: OncoCalculate (SI国际单位标准)\n`;
  defaultNote += `说明: 本记录仅供临床执业医师与药师诊疗参考。`;

  const [noteText, setNoteText] = useState(defaultNote);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(noteText);
    setCopied(true);
    onShowSnackbar('病历小结已复制至剪贴板');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `【临床记录】${calculator.title}`,
          text: noteText,
        });
        onShowSnackbar('分享成功');
      } catch (e) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full sm:max-w-lg bg-surface dark:bg-surface-dim border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-slide-up max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white flex items-center gap-1.5">
                规范化临床病历小结
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">EMR格式</span>
              </h2>
              <p className="text-[11px] text-slate-400">可一键复制并粘贴至医院电子病历或交班报告</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Area */}
        <div className="flex-1 space-y-1.5 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between text-[12px] text-slate-400 px-1">
            <span>支持在下方直接修改文本细节：</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> 自动排版
            </span>
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={12}
            className="w-full flex-1 p-3.5 rounded-2xl bg-surface-container border border-white/10 text-slate-100 font-mono text-[13px] leading-relaxed focus:outline-none focus:border-emerald-500 resize-none no-scrollbar"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleShare}
            className="py-3 px-4 rounded-xl text-[13px] font-medium text-slate-300 bg-surface-container hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            分享
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制至剪贴板' : '复制病历小结'}
          </button>
        </div>
      </div>
    </div>
  );
};
