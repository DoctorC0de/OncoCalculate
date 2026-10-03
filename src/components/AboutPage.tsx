import React from 'react';
import { Activity, ShieldCheck, Cpu, Info, BookOpen, UserCheck, FileText, SunMoon } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="px-4 py-4 pb-28 space-y-4 animate-fade-in max-w-4xl mx-auto">
      {/* App Header Card */}
      <div className="m3-card p-6 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
          <Activity className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-xl font-extrabold text-white">OncoCalculate 肿瘤医学计算器</h1>
        <p className="text-[11px] text-sky-400 font-bold uppercase tracking-wider">
          v1.1.0 · SI 国际标准单位 · Pure Rust 核心计算引擎 · Material 3
        </p>
        <p className="text-[12px] text-slate-400 max-w-md mx-auto leading-relaxed">
          专为肿瘤科临床医师、药师与医学科研人员精心打造的全功能临床评估计算工具，包含 21 大权威公式与病历小结一键导出。
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="m3-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0 text-sky-400">
            <Cpu className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white mb-1">Rust 核心计算引擎</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              核心公式由 Pure Rust 编写并通过严格自动化单元测试，杜绝前端浮点精度偏差，本地毫秒级响应。
            </p>
          </div>
        </div>

        <div className="m3-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0 text-emerald-400">
            <ShieldCheck className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white mb-1">全离线隐私安全</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              零网络依赖、零外部埋点。不收集、不上传任何患者病历或生理数据，100% 本地安全计算。
            </p>
          </div>
        </div>

        <div className="m3-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0 text-purple-400">
            <UserCheck className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white mb-1">患者档案跨公式联动</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              支持录入当前患者基线（性别、年龄、身高、体重、血肌酐），在各计算器间自动同步预填，杜绝重复输入。
            </p>
          </div>
        </div>

        <div className="m3-card p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0 text-amber-400">
            <FileText className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-white mb-1">规范化病历小结导出</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">
              自动整合患者参数、公式结果与临床指导，生成标准 EMR 临床小结，支持一键复制与多渠道分享。
            </p>
          </div>
        </div>
      </div>

      {/* Complete 21 Formulas Summary */}
      <div className="m3-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <h3 className="text-[14px] font-bold text-white">收录 21 项权威肿瘤公式一览</h3>
          </div>
          <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
            共 21 项
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
          {[
            { label: '体表面积 (BSA)', desc: 'Mosteller, Du Bois, Haycock, Gehan, Boyd' },
            { label: '卡铂 Calvert 公式', desc: 'Target AUC × (GFR + 25) 125封顶' },
            { label: '肌酐清除率 (GFR)', desc: 'Cockcroft-Gault & CKD-EPI 2021' },
            { label: '理想体重 (IBW/AdjBW)', desc: 'Devine 公式与肥胖化疗剂量调整 (ASCO)' },
            { label: '中性粒细胞 (ANC)', desc: 'WBC × (%Segs + %Bands) & CTCAE 分级' },
            { label: '校正血钙', desc: '低白蛋白血症纠正与肿瘤高钙血症判定' },
            { label: 'RECIST 1.1 实体瘤疗效', desc: 'SLD 比对基线/Nadir, CR/PR/SD/PD 自动判定' },
            { label: '肿瘤倍增时间 (DT/SGR)', desc: '两次测量体积生长动力学与比生长速率' },
            { label: 'ALBI 肝功能分级', desc: '白蛋白-胆红素客观评分 (HCC专用)' },
            { label: 'Child-Pugh 肝功能评分', desc: '肝硬化代偿与手术耐受分级 (Class A/B/C)' },
            { label: 'MELD / MELD-Na 肝病评分', desc: 'UNOS 标准 90 天终末期病死率预测' },
            { label: 'Khorana 肿瘤血栓评分', desc: '门诊化疗相关静脉血栓栓塞 (VTE) 风险' },
            { label: 'MASCC 粒缺发热评分', desc: '发热伴中性粒细胞减少门诊低危判定' },
            { label: 'CISNE 粒缺发热指数', desc: '实体瘤稳定期粒缺发热高危并发症识别' },
            { label: '阿片类等效剂量 (MEDD)', desc: '吗啡、羟考酮、芬太尼等效换算与不完全交叉耐受' },
            { label: '糖皮质激素等效换算', desc: '地塞米松、泼尼松、甲泼尼龙抗炎等效转换' },
            { label: 'ECOG / KPS 体能状态', desc: '双向对照与化疗耐受性临床门槛评定' },
            { label: 'IPI / R-IPI 淋巴瘤预后', desc: '弥漫大B细胞淋巴瘤 (DLBCL) 风险分层' },
            { label: 'FLIPI 滤泡淋巴瘤预后', desc: '滤泡性淋巴瘤国际预后指数与10年生存率' },
            { label: 'R-ISS 骨髓瘤修订分期', desc: 'ISS + iFISH高危异常 + LDH 联合分期' },
            { label: 'IMDC 晚期肾癌模型', desc: '转移性肾细胞癌 (mRCC) 一线靶免治疗推荐' },
          ].map((item, i) => (
            <div key={i} className="p-2.5 bg-surface-dim rounded-xl border border-white/5 space-y-0.5">
              <span className="text-sky-400 font-bold block">{item.label}</span>
              <span className="text-slate-400 text-[11px] block">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="m3-card p-4 flex items-start gap-3 border-rose-500/25 bg-rose-500/5">
        <Info className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-[13px] text-rose-400 block">医疗免责声明</span>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            本应用程序仅供肿瘤科执业医师、临床药师与科研人员参考。计算结果不能替代专业医师的临床判断。在行化疗给药或开具处方前，请务必根据具体临床情况、器官功能储备及药品说明书再次复核。
          </p>
        </div>
      </div>
    </div>
  );
};
