import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { CalculatorCard } from './components/CalculatorCard';
import { CalculatorDetailPage } from './components/CalculatorDetailPage';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { AboutPage } from './components/AboutPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { allCalculators } from './utils/formulas';
import { CategoryType, CalculatorDefinition, HistoryItem, CalculationResult } from './types/calculator';
import { Activity, Clock, Trash2, Bookmark } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorDefinition | null>(null);

  // Persistence in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('onco_favs');
      return saved ? JSON.parse(saved) : ['bsa', 'calvert', 'recist11', 'gfr_crcl'];
    } catch {
      return ['bsa', 'calvert', 'recist11', 'gfr_crcl'];
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('onco_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('onco_favs', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('onco_history', JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSaveHistory = (
    calc: CalculatorDefinition,
    inputs: Record<string, any>,
    units: Record<string, string>,
    result: CalculationResult
  ) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      calculatorId: calc.id,
      calculatorTitle: calc.title,
      timestamp: Date.now(),
      inputs,
      units,
      result,
    };

    setHistory((prev) => [newItem, ...prev.filter((h) => h.calculatorId !== calc.id)].slice(0, 30));
  };

  const handleSelectCalculator = (calc: CalculatorDefinition) => {
    setSelectedCalculator(calc);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    const calc = allCalculators.find((c) => c.id === item.calculatorId);
    if (calc) {
      setSelectedCalculator(calc);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedCalculator(null);
  };

  // Filtered calculators for Home List
  const filteredCalculators = useMemo(() => {
    return allCalculators.filter((calc) => {
      if (selectedCategory !== 'all' && calc.category !== selectedCategory) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = calc.title.toLowerCase().includes(q);
        const matchAbbr = calc.abbreviation?.toLowerCase().includes(q) ?? false;
        const matchDesc = calc.description.toLowerCase().includes(q);
        const matchTag = calc.tags.some((t) => t.toLowerCase().includes(q));

        return matchTitle || matchAbbr || matchDesc || matchTag;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Favorite calculators list
  const favoriteCalculators = useMemo(() => {
    return allCalculators.filter((c) => favorites.includes(c.id));
  }, [favorites]);

  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryType | 'all', number> = {
      all: allCalculators.length,
      chemo: 0,
      hematology: 0,
      recist: 0,
      organ: 0,
      risk: 0,
      conversion: 0,
      staging: 0,
    };

    allCalculators.forEach((calc) => {
      if (counts[calc.category] !== undefined) {
        counts[calc.category]++;
      }
    });

    return counts;
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-surface-dim text-on-surface">
        
        {/* DETAIL PAGE */}
        {selectedCalculator ? (
          <CalculatorDetailPage
            calculator={selectedCalculator}
            onBack={() => setSelectedCalculator(null)}
            onSaveHistory={handleSaveHistory}
            isFavorite={favorites.includes(selectedCalculator.id)}
            onToggleFavorite={(id) => toggleFavorite(id)}
          />
        ) : (
          /* MAIN TAB VIEWS */
          <div className="flex-1 pb-20">
            {activeTab === 'list' && (
              <>
                <Header
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onOpenHistory={() => setActiveTab('history')}
                  favoritesOnly={false}
                  onToggleFavorites={() => setActiveTab('favorites')}
                  totalCount={allCalculators.length}
                />

                <CategoryNav
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  counts={categoryCounts}
                />

                <main className="px-4 py-2 space-y-2.5 animate-fade-in">
                  {/* Status Banner */}
                  <div className="m3-card p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/12 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-[18px] h-[18px] text-sky-400" />
                    </div>
                    <div>
                      <h2 className="text-[13px] font-semibold text-white">
                        Rust 驱动 · 肿瘤临床计算引擎
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        点击任意公式展开详细计算与临床指导
                      </p>
                    </div>
                  </div>

                  {/* Calculator List */}
                  {filteredCalculators.length === 0 ? (
                    <div className="py-16 text-center">
                      <Activity className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                      <p className="text-[14px] font-medium text-slate-400">未检索到匹配的计算公式</p>
                      <p className="text-[12px] mt-1 text-slate-600">请尝试更换搜索关键词或选择"全部"</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredCalculators.map((calc) => (
                        <CalculatorCard
                          key={calc.id}
                          calculator={calc}
                          onSelect={handleSelectCalculator}
                          isFavorite={favorites.includes(calc.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      ))}
                    </div>
                  )}
                </main>
              </>
            )}

            {/* TAB 2: Favorites */}
            {activeTab === 'favorites' && (
              <main className="px-4 py-4 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 px-1 mb-2">
                  <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h1 className="text-lg font-bold text-white">我的收藏 ({favoriteCalculators.length})</h1>
                </div>

                {favoriteCalculators.length === 0 ? (
                  <div className="py-20 text-center m3-card">
                    <Bookmark className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                    <p className="text-[14px] font-medium text-slate-400">暂无收藏的公式</p>
                    <p className="text-[12px] mt-1 text-slate-600">在公式列表中点击书签图标即可收藏</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {favoriteCalculators.map((calc) => (
                      <CalculatorCard
                        key={calc.id}
                        calculator={calc}
                        onSelect={handleSelectCalculator}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </main>
            )}

            {/* TAB 3: History */}
            {activeTab === 'history' && (
              <main className="px-4 py-4 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between px-1 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    <h1 className="text-lg font-bold text-white">计算历史 ({history.length})</h1>
                  </div>

                  {history.length > 0 && (
                    <button
                      onClick={() => setHistory([])}
                      className="text-[12px] text-rose-400 flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-rose-500/10 transition-colors font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      清空
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="py-20 text-center m3-card">
                    <Clock className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                    <p className="text-[14px] font-medium text-slate-400">暂无计算历史记录</p>
                    <p className="text-[12px] mt-1 text-slate-600">进行计算后结果会自动记录在这里</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => {
                      const formattedDate = new Date(item.timestamp).toLocaleString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectHistoryItem(item)}
                          className="m3-card p-4 touch-ripple cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[14px] text-slate-200 truncate flex-1">
                              {item.calculatorTitle}
                            </span>
                            <span className="text-[11px] text-slate-600 font-mono ml-2 flex-shrink-0">{formattedDate}</span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-mono text-white">{item.result.value}</span>
                            {item.result.unit && (
                              <span className="text-[12px] text-sky-400 font-semibold">{item.result.unit}</span>
                            )}
                            {item.result.badge && (
                              <span className="ml-auto text-[11px] px-2.5 py-1 rounded-lg bg-surface-container text-slate-400 font-medium">
                                {item.result.badge.text}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </main>
            )}

            {/* TAB 4: About */}
            {activeTab === 'about' && <AboutPage />}
          </div>
        )}

        {/* Bottom Navigation Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          favoritesCount={favorites.length}
          historyCount={history.length}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
