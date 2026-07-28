import React from 'react';
import { CategoryType } from '../types/calculator';
import { categoryLabels } from '../utils/formulas';
import { Flame, ShieldAlert, HeartPulse, Scale, Award, Pill, FileSpreadsheet, Layers } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (cat: CategoryType | 'all') => void;
  counts: Record<CategoryType | 'all', number>;
}

const getCategoryIcon = (cat: CategoryType | 'all') => {
  const iconClass = 'w-3.5 h-3.5';
  switch (cat) {
    case 'chemo':
      return <Pill className={iconClass} />;
    case 'hematology':
      return <HeartPulse className={iconClass} />;
    case 'recist':
      return <Flame className={iconClass} />;
    case 'organ':
      return <Scale className={iconClass} />;
    case 'risk':
      return <ShieldAlert className={iconClass} />;
    case 'conversion':
      return <FileSpreadsheet className={iconClass} />;
    case 'staging':
      return <Award className={iconClass} />;
    default:
      return <Layers className={iconClass} />;
  }
};

export const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onSelectCategory, counts }) => {
  const categories: (CategoryType | 'all')[] = [
    'all',
    'chemo',
    'hematology',
    'recist',
    'organ',
    'risk',
    'conversion',
    'staging',
  ];

  return (
    <div className="overflow-x-auto no-scrollbar px-4 py-2">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = counts[cat] || 0;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`m3-chip ${isSelected ? 'm3-chip-active' : ''}`}
            >
              {getCategoryIcon(cat)}
              <span>{categoryLabels[cat]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
