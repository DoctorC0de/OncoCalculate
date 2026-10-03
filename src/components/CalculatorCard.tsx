import React from 'react';
import { CalculatorDefinition, CategoryType } from '../types/calculator';
import { Bookmark, ChevronRight } from 'lucide-react';

interface CalculatorCardProps {
  calculator: CalculatorDefinition;
  onSelect: (calc: CalculatorDefinition) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

const getCategoryBadgeColor = (category: CategoryType) => {
  switch (category) {
    case 'chemo':
      return 'bg-sky-500/15 text-sky-400 border-sky-500/25';
    case 'hematology':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/25';
    case 'recist':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
    case 'organ':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
    case 'risk':
      return 'bg-red-500/15 text-red-400 border-red-500/25';
    case 'conversion':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/25';
    case 'staging':
      return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/25';
  }
};

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculator,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const badgeColor = getCategoryBadgeColor(calculator.category);

  return (
    <div
      onClick={() => onSelect(calculator)}
      className="m3-card p-4 flex items-center gap-3 touch-ripple cursor-pointer active:scale-[0.98] transition-all hover:border-sky-500/30 group"
    >
      {/* Left: Content */}
      <div className="flex-1 min-w-0">
        {/* Top line: abbreviation + category */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          {calculator.abbreviation && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/25 font-mono">
              {calculator.abbreviation}
            </span>
          )}
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeColor}`}>
            {calculator.categoryName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[15px] text-white group-hover:text-sky-300 transition-colors leading-snug mb-1 truncate">
          {calculator.title}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-1 mb-1.5">
          {calculator.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-1 overflow-hidden">
          {calculator.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-[10px] text-slate-500 bg-surface-container/80 px-1.5 py-0.2 rounded font-mono truncate">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={(e) => onToggleFavorite(calculator.id, e)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
            isFavorite
              ? 'text-amber-400 bg-amber-500/15'
              : 'text-slate-500 hover:text-amber-400 hover:bg-white/5'
          }`}
          aria-label={isFavorite ? '取消收藏' : '加入收藏'}
        >
          <Bookmark className={`w-[18px] h-[18px] ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:bg-sky-500/15 transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
