import React from 'react';
import { Layers, Bookmark, Clock, Info } from 'lucide-react';

export type TabType = 'list' | 'favorites' | 'history' | 'about';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
  historyCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  historyCount,
}) => {
  const tabs: { id: TabType; label: string; Icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'list', label: '公式', Icon: Layers },
    { id: 'favorites', label: '收藏', Icon: Bookmark, badge: favoritesCount },
    { id: 'history', label: '历史', Icon: Clock, badge: historyCount },
    { id: 'about', label: '关于', Icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 m3-bottom-nav">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-0.5 py-1.5 px-4 relative touch-ripple m3-btn"
              style={{ minHeight: '56px', minWidth: '56px' }}
            >
              {/* Material 3 Pill Indicator behind icon */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`absolute inset-x-[-14px] inset-y-[-4px] rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/15 scale-100'
                      : 'bg-transparent scale-75'
                  }`}
                />
                <div className="relative">
                  <tab.Icon
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${
                      isActive ? 'text-sky-400' : 'text-slate-500'
                    }`}
                  />
                  {/* Badge */}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-sky-500 text-white leading-none">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-0.5 transition-colors duration-200 ${
                  isActive ? 'text-sky-400 font-semibold' : 'text-slate-500 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
