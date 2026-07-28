import React from 'react';
import { HistoryItem } from '../types/calculator';
import { X, Trash2, Clock, ChevronRight, Copy } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-base">最近计算历史</h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清空
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
              <Clock className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">暂无计算历史</p>
              <p className="text-xs mt-1">进行临床计算后结果会自动保存在这里</p>
            </div>
          ) : (
            history.map((item) => {
              const formattedDate = new Date(item.timestamp).toLocaleTimeString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectHistoryItem(item)}
                  className="glass-card p-3.5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">
                      {item.calculatorTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{formattedDate}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-mono text-white">{item.result.value}</span>
                    {item.result.unit && (
                      <span className="text-xs text-cyan-400 font-semibold">{item.result.unit}</span>
                    )}
                    {item.result.badge && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.result.badge.text}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
