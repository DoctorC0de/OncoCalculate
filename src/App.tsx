import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { CalculatorCard } from './components/CalculatorCard';
import { CalculatorDetailPage } from './components/CalculatorDetailPage';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { AboutPage } from './components/AboutPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PatientProfileModal } from './components/PatientProfileModal';
import { Snackbar, SnackbarMessage } from './components/Snackbar';
import { ThemeProvider } from './context/ThemeContext';
import { allCalculators } from './utils/formulas';
import { CategoryType, CalculatorDefinition, HistoryItem, CalculationResult, PatientProfile } from './types/calculator';
import { Activity, Clock, Trash2, Bookmark, UserCheck, Sparkles, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorDefinition | null>(null);
  const [selectedHistorySnapshot, setSelectedHistorySnapshot] = useState<HistoryItem | null>(null);
  
  // Patient Profile state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(() => {
    try {
      const saved = localStorage.getItem('onco_patient_profile');
      return saved ? JSON.parse(saved) : { gender: 'male', isConfigured: false };
    } catch {
      return { gender: 'male', isConfigured: false };
    }
  });

  // Snackbar Toast state
  const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage | null>(null);

  const showSnackbar = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setSnackbarMessage({ id: Date.now().toString(), text, type });
  };

  // Favorites persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('onco_favs');
      return saved ? JSON.parse(saved) : ['bsa', 'calvert', 'recist11', 'gfr_crcl', 'ecog_kps'];
    } catch {
      return ['bsa', 'calvert', 'recist11', 'gfr_crcl', 'ecog_kps'];
    }
  });

  // History persistence
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

  useEffect(() => {
    try {
      localStorage.setItem('onco_patient_profile', JSON.stringify(patientProfile));
    } catch (e) {}
  }, [patientProfile]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isAdding = !favorites.includes(id);
    setFavorites((prev) => (isAdding ? [...prev, id] : prev.filter((item) => item !== id)));
    showSnackbar(isAdding ? '已加入常用收藏' : '已移出收藏');
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

    setHistory((prev) => [newItem, ...prev.filter((h) => h.calculatorId !== calc.id)].slice(0, 50));
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showSnackbar('已删除该条历史记录', 'info');
  };

  const handleSelectCalculator = (calc: CalculatorDefinition) => {
    setSelectedHistorySnapshot(null);
    setSelectedCalculator(calc);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    const calc = allCalculators.find((c) => c.id === item.calculatorId);
    if (calc) {
      setSelectedHistorySnapshot(item);
      setSelectedCalculator(calc);
      showSnackbar(`已还原历史数据: ${calc.title}`);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedCalculator(null);
    setSelectedHistorySnapshot(null);
  };

  // Filtered calculators for Home List
  const filteredCalculators = useMemo(() => {
    return allCalculators.filter((calc) => {
      if (selectedCategory !== 'all' && calc.category !== selectedCategory) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
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
    <div className="min-h-screen flex flex-col bg-surface-dim text-on-surface transition-colors duration-200">
      {/* DETAIL PAGE */}
      {selectedCalculator ? (
        <CalculatorDetailPage
          calculator={selectedCalculator}
          onBack={() => {
            setSelectedCalculator(null);
            setSelectedHistorySnapshot(null);
          }}
          onSaveHistory={handleSaveHistory}
          isFavorite={favorites.includes(selectedCalculator.id)}
          onToggleFavorite={(id) => toggleFavorite(id)}
          patientProfile={patientProfile}
          onOpenPatientProfile={() => setIsPatientModalOpen(true)}
          onShowSnackbar={showSnackbar}
          initialInputs={selectedHistorySnapshot?.inputs}
          initialUnits={selectedHistorySnapshot?.units}
        />
      ) : (
        /* MAIN TAB VIEWS */
        <div className="flex-1 pb-20">
          {activeTab === 'list' && (
            <>
              <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenPatientProfile={() => setIsPatientModalOpen(true)}
                patientProfileConfigured={patientProfile.isConfigured}
                totalCount={allCalculators.length}
              />

              <CategoryNav
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                counts={categoryCounts}
              />

              <main className="px-4 py-2 space-y-3 animate-fade-in max-w-7xl mx-auto">
                {/* Patient Profile Quick Banner */}
                {patientProfile.isConfigured ? (
                  <div 
                    onClick={() => setIsPatientModalOpen(true)}
                    className="m3-card p-3 flex items-center justify-between gap-3 border-sky-500/30 bg-sky-500/10 cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-white">当前患者档案生效中</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-mono">
                            {patientProfile.gender === 'female' ? '女' : '男'}
                            {patientProfile.age ? ` · ${patientProfile.age}岁` : ''}
                            {patientProfile.heightCm ? ` · ${patientProfile.heightCm}cm` : ''}
                            {patientProfile.weightKg ? ` · ${patientProfile.weightKg}kg` : ''}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">BSA、Calvert、GFR 等公式将自动带入，点按可修改</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-sky-400 flex-shrink-0">编辑</span>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsPatientModalOpen(true)}
                    className="m3-card p-3 flex items-center justify-between gap-3 border-white/10 bg-surface-container cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white/10 text-slate-400 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <span className="text-[12px] font-bold text-white">设置患者临床档案</span>
                        <p className="text-[11px] text-slate-400">录入身高体重与肌酐，跨公式一键同步免重复输入</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/20">
                      快速录入
                    </span>
                  </div>
                )}

                {/* Calculator List */}
                {filteredCalculators.length === 0 ? (
                  <div className="py-16 text-center m3-card">
                    <Activity className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-[14px] font-bold text-slate-300">未检索到匹配的计算公式</p>
                    <p className="text-[12px] mt-1 text-slate-500">请尝试更换搜索词或选择"全部公式"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
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
            <main className="px-4 py-4 space-y-3 animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center gap-2 px-1 mb-2">
                <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
                <h1 className="text-lg font-bold text-white">我的常用收藏 ({favoriteCalculators.length})</h1>
              </div>

              {favoriteCalculators.length === 0 ? (
                <div className="py-20 text-center m3-card">
                  <Bookmark className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-[14px] font-bold text-slate-300">暂无收藏的公式</p>
                  <p className="text-[12px] mt-1 text-slate-500">在公式列表中点击书签图标即可加入常用收藏</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
            <main className="px-4 py-4 space-y-3 animate-fade-in max-w-4xl mx-auto">
              <div className="flex items-center justify-between px-1 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-sky-400" />
                  <h1 className="text-lg font-bold text-white">最近计算历史 ({history.length})</h1>
                </div>

                {history.length > 0 && (
                  <button
                    onClick={() => {
                      setHistory([]);
                      showSnackbar('已清空全部计算历史');
                    }}
                    className="text-[12px] text-rose-400 flex items-center gap-1 py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    清空历史
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="py-20 text-center m3-card">
                  <Clock className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-[14px] font-bold text-slate-300">暂无计算历史记录</p>
                  <p className="text-[12px] mt-1 text-slate-500">在具体公式页面进行计算后结果会自动记录在此处</p>
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
                        className="m3-card p-4 touch-ripple cursor-pointer space-y-2 hover:border-sky-500/30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[14px] text-white truncate flex-1 group-hover:text-sky-300">
                            {item.calculatorTitle}
                          </span>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <span className="text-[11px] text-slate-500 font-mono">{formattedDate}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="删除记录"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold font-mono text-white">{item.result.value}</span>
                          {item.result.unit && (
                            <span className="text-[12px] text-sky-400 font-bold">{item.result.unit}</span>
                          )}
                          {item.result.badge && (
                            <span className="ml-auto text-[11px] px-2.5 py-1 rounded-lg bg-surface-container text-slate-300 font-semibold border border-white/5">
                              {item.result.badge.text}
                            </span>
                          )}
                        </div>

                        <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                          <span>点击重新载入当时患者数据</span>
                          <span className="text-sky-400 font-medium group-hover:underline">还原参数 →</span>
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

      {/* Patient Profile Modal */}
      <PatientProfileModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        profile={patientProfile}
        onSaveProfile={(prof) => {
          setPatientProfile(prof);
          showSnackbar('患者临床档案已保存并全局生效');
        }}
        onClearProfile={() => {
          setPatientProfile({ gender: 'male', isConfigured: false });
          showSnackbar('已清空患者档案');
        }}
      />

      {/* Snackbar Toast */}
      <Snackbar
        message={snackbarMessage}
        onClose={() => setSnackbarMessage(null)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
