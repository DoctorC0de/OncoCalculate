import React from 'react';
import { Activity, ShieldCheck, Cpu, Info, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="px-4 py-4 pb-28 space-y-4 animate-fade-in">
      {/* App Header Card */}
      <div className="m3-card-elevated p-6 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
          <Activity className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">OncoCalculate</h1>
        <p className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">
          肿瘤医学计算器 · SI 国际标准单位
        </p>
        <p className="text-[12px] text-slate-500 max-w-sm mx-auto leading-relaxed">
          专为肿瘤科临床医师、药师与医学研究人员设计的全功能临床评估计算软件
        </p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-3">
        <div className="m3-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/12 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-[18px] h-[18px] text-sky-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white mb-1">Rust 核心计算引擎</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              核心数学公式由 Pure Rust 编写，保障极高的数值精度与无浮点偏差，运算在本地毫秒级完成。
            </p>
          </div>
        </div>

        <div className="m3-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/12 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-[18px] h-[18px] text-emerald-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white mb-1">全离线与隐私安全</h3>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              零网络依赖，零外部请求。不收集任何患者临床数据，100% 本地离线运行。
            </p>
          </div>
        </div>
      </div>

      {/* Formulas Summary */}
      <div className="m3-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <h3 className="text-[13px] font-semibold text-white">核心计算公式</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: '体表面积 (BSA)', desc: 'Mosteller, Du Bois, Haycock, Gehan, Boyd' },
            { label: '卡铂 Calvert', desc: 'Target AUC × (GFR + 25)' },
            { label: '中性粒细胞 (ANC)', desc: 'WBC × (%Segs + %Bands) & CTCAE 分级' },
            { label: 'RECIST 1.1 疗效', desc: 'SLD 比对基线/Nadir, CR/PR/SD/PD' },
            { label: '肝功能 ALBI', desc: 'log10(Bili)×0.66 + Alb×-0.085' },
            { label: '阿片类等效 MEDD', desc: '吗啡、羟考酮、芬太尼贴剂等效换算' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 py-2 px-3 bg-surface-dim rounded-xl">
              <span className="text-sky-400 font-semibold text-[12px] flex-shrink-0">{item.label}:</span>
              <span className="text-[12px] text-slate-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="m3-card p-4 flex items-start gap-3 border-rose-500/20">
        <Info className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-[13px] text-rose-400 block">医疗免责声明</span>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            本应用程序仅供肿瘤科执业医师、药师与科研人员参考。计算结果不能替代专业医师的临床判断。在行化疗给药或开具处方前，请务必根据具体临床情况与药品说明书再次复核。
          </p>
        </div>
      </div>
    </div>
  );
};
