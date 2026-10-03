import React from 'react';
import { Activity, Search, X, UserRound, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenPatientProfile: () => void;
  patientProfileConfigured?: boolean;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenPatientProfile,
  patientProfileConfigured,
  totalCount,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 m3-top-app-bar">
      <div className="px-4 pt-3 pb-2 max-w-7xl mx-auto">
        {/* App Title & Action Buttons Row */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-[17px] text-white tracking-tight">OncoCalculate</h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/25">
                  SI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">肿瘤临床评估系统 · 21大权威公式</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Patient Profile Quick Button */}
            <button
              type="button"
              onClick={onOpenPatientProfile}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-[12px] font-semibold border transition-all active:scale-95 ${
                patientProfileConfigured
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 shadow-sm'
                  : 'bg-surface-container border-white/10 text-slate-400 hover:text-white'
              }`}
              title="设置患者档案"
            >
              <UserRound className="w-3.5 h-3.5" />
              <span>{patientProfileConfigured ? '患者档案 ✓' : '患者档案'}</span>
              {patientProfileConfigured && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-slate-400 hover:text-white active:scale-95 transition-all"
              aria-label={theme === 'dark' ? '切换为明亮模式' : '切换为夜间模式'}
              title={theme === 'dark' ? '切换为明亮模式' : '切换为夜间模式'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Material 3 style */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`快速检索 ${totalCount} 项肿瘤公式 (如 BSA, Calvert, ECOG, RECIST)...`}
            className="m3-input pl-10 pr-10 !rounded-full !bg-surface-container !border-white/10 text-[14px]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              aria-label="清空搜索"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
