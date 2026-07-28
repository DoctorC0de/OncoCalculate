import React from 'react';
import { CalculatorDefinition } from '../types/calculator';
import { Bookmark, ChevronRight } from 'lucide-react';

interface CalculatorCardProps {
  calculator: CalculatorDefinition;
  onSelect: (calc: CalculatorDefinition) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calculator,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={() => onSelect(calculator)}
      className="m3-card p-4 flex items-center gap-3.5 touch-ripple cursor-pointer active:scale-[0.98]"
    >
      {/* Left: Content */}
      <div className="flex-1 min-w-0">
        {/* Top line: abbreviation + category */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {calculator.abbreviation && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/12 text-sky-400 font-mono">
              {calculator.abbreviation}
            </span>
          )}
          <span className="text-[10px] font-medium text-slate-500 bg-surface-container px-2 py-0.5 rounded-md">
            {calculator.categoryName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[15px] text-slate-100 leading-snug mb-1 truncate">
          {calculator.title}
        </h3>

        {/* Description */}
        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-1">
          {calculator.description}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={(e) => onToggleFavorite(calculator.id, e)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isFavorite
              ? 'text-amber-400 bg-amber-500/10'
              : 'text-slate-600 hover:text-amber-400'
          }`}
          aria-label={isFavorite ? '取消收藏' : '加入收藏'}
        >
          <Bookmark className={`w-[18px] h-[18px] ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-sky-400" />
        </div>
      </div>
    </div>
  );
};
