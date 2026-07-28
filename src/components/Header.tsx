import React from 'react';
import { Activity, Search, X } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenHistory: () => void;
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-30 m3-top-app-bar">
      <div className="px-4 pt-3 pb-2">
        {/* App Title Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-[17px] text-white tracking-tight">OncoCalculate</h1>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-500/12 text-sky-400 border border-sky-500/20">
                SI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">肿瘤医学临床计算系统</p>
          </div>
        </div>

        {/* Search Bar - Material 3 style */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`搜索 ${totalCount} 个肿瘤临床公式...`}
            className="m3-input pl-10 pr-10 !rounded-full !bg-surface-container !border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
