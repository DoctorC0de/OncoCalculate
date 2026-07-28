import { CalculatorDefinition } from '../../types/calculator';

export const recistCalculator: CalculatorDefinition = {
  id: 'recist11',
  title: 'RECIST 1.1 实体瘤疗效评估器',
  abbreviation: 'RECIST 1.1',
  category: 'recist',
  categoryName: '实体瘤疗效评价',
  description: '对比靶病灶基线长径和 (Baseline SLD)、治疗期间最小长径和 (Nadir SLD) 与当前长径和，自动判断 CR、PR、SD 或 PD。',
  tags: ['RECIST 1.1', '实体瘤疗效', 'CR', 'PR', 'SD', 'PD', '肿瘤长径和', 'SLD'],
  fields: [
    {
      id: 'baselineSld',
      label: '基线靶病灶长径和 (Baseline SLD)',
      type: 'number',
      defaultValue: 50,
      defaultUnit: 'mm',
      min: 1,
      max: 500,
      step: 1,
    },
    {
      id: 'nadirSld',
      label: '观察期间最小长径和 (Nadir SLD)',
      hint: '自治疗开始以来的最小值（含基线）',
      type: 'number',
      defaultValue: 30,
      defaultUnit: 'mm',
      min: 0,
      max: 500,
      step: 1,
    },
    {
      id: 'currentSld',
      label: '当前复查靶病灶长径和 (Current SLD)',
      type: 'number',
      defaultValue: 32,
      defaultUnit: 'mm',
      min: 0,
      max: 500,
      step: 1,
    },
    {
      id: 'hasNewLesion',
      label: '是否存在新病灶或非靶病灶明确进展',
      type: 'select',
      defaultValue: 'no',
      options: [
        { label: '否 (无新病灶/非靶进展)', value: 'no' },
        { label: '是 (出现新病灶或非靶明显进展)', value: 'yes' },
      ],
    },
  ],
  formulaEquation: `\\% \\text{Change from Baseline} = \\frac{\\text{Current SLD} - \\text{Baseline SLD}}{\\text{Baseline SLD}} \\times 100\\%`,
  formulaDescription: 'RECIST 1.1 规定：PR 为较基线缩小 ≥ 30%；PD 为较 Nadir 增加 ≥ 20% 且绝对值增加 ≥ 5mm，或出现新病灶。',
  references: [
    'Eisenhauer EA, et al. New response evaluation criteria in solid tumours: revised RECIST guideline (version 1.1). Eur J Cancer. 2009;45(2):228-247.',
  ],
  calculate: (inputs) => {
    const baseline = Number(inputs.baselineSld) || 0;
    const nadir = Number(inputs.nadirSld) || 0;
    const current = Number(inputs.currentSld) || 0;
    const hasNew = inputs.hasNewLesion === 'yes';

    if (baseline <= 0) {
      return { title: 'RECIST 疗效评估', value: '--' };
    }

    const changeFromBaseline = ((current - baseline) / baseline) * 100;
    const increaseFromNadir = nadir > 0 ? ((current - nadir) / nadir) * 100 : 0;
    const absIncreaseFromNadir = current - nadir;

    let resultCategory = 'SD (疾病稳定)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'info';
    let explanation = '靶病灶未达到PR缩小标准，亦未达到PD进展标准。';

    if (hasNew) {
      resultCategory = 'PD (疾病进展)';
      badgeType = 'danger';
      explanation = '提示：因出现新病灶或非靶病灶明确进展，直接判定为疾病进展 (PD)。';
    } else if (current === 0) {
      resultCategory = 'CR (完全缓解)';
      badgeType = 'success';
      explanation = '所有靶病灶完全消失（淋巴结需短径 < 10mm）。';
    } else if (changeFromBaseline <= -30) {
      resultCategory = 'PR (部分缓解)';
      badgeType = 'success';
      explanation = `靶病灶较基线缩小 ${Math.abs(changeFromBaseline).toFixed(1)}% (≥ 30%)。`;
    } else if (increaseFromNadir >= 20 && absIncreaseFromNadir >= 5) {
      resultCategory = 'PD (疾病进展)';
      badgeType = 'danger';
      explanation = `靶病灶较最小值 (Nadir) 增加 ${increaseFromNadir.toFixed(1)}% (≥ 20%) 且绝对增加额为 ${absIncreaseFromNadir.toFixed(1)} mm (≥ 5 mm)。`;
    }

    return {
      title: `疗效判定: ${resultCategory}`,
      value: resultCategory.split(' ')[0],
      badge: { text: resultCategory, type: badgeType },
      details: [
        { label: '较基线变化率', value: `${changeFromBaseline > 0 ? '+' : ''}${changeFromBaseline.toFixed(1)} %` },
        { label: '较最小值 (Nadir) 变化', value: `${increaseFromNadir > 0 ? '+' : ''}${increaseFromNadir.toFixed(1)} % (${absIncreaseFromNadir > 0 ? '+' : ''}${absIncreaseFromNadir.toFixed(1)} mm)` },
        { label: '基线 / Nadir / 当前 SLD', value: `${baseline} / ${nadir} / ${current} mm` },
      ],
      interpretation: explanation,
    };
  },
};

export const doublingTimeCalculator: CalculatorDefinition = {
  id: 'doubling_time',
  title: '肿瘤倍增时间 (Tumor Doubling Time, DT)',
  abbreviation: 'DT & SGR',
  category: 'recist',
  categoryName: '实体瘤疗效评价',
  description: '根据两次影像学检查测得的肿瘤直径或体积及间隔天数，计算肿瘤体积倍增时间 (DT) 及特定生长率 (SGR)。',
  tags: ['倍增时间', 'Doubling Time', 'SGR', '生长动力学', '肿瘤体积'],
  fields: [
    {
      id: 'd1',
      label: '第一次检查肿瘤直径 (D1)',
      type: 'number',
      defaultValue: 15,
      defaultUnit: 'mm',
      min: 1,
      max: 200,
    },
    {
      id: 'd2',
      label: '第二次检查肿瘤直径 (D2)',
      type: 'number',
      defaultValue: 22,
      defaultUnit: 'mm',
      min: 1,
      max: 200,
    },
    {
      id: 'days',
      label: '两次检查间隔时间',
      type: 'number',
      defaultValue: 60,
      defaultUnit: '天 (Days)',
      min: 1,
      max: 3650,
    },
  ],
  formulaEquation: `\\text{DT (Days)} = \\frac{t \\times \\ln(2)}{3 \\times \\ln(D_2 / D_1)}`,
  formulaDescription: '假设肿瘤呈球形对称增长。DT越短说明肿瘤生长越迅速、侵袭性越强；DT为负值说明肿瘤在退缩。',
  references: [
    'Mehrara E, et al. Specific growth rate versus doubling time for quantitative characterization of tumor growth in clinical studies. Cancer Res. 2007;67(8):3970-3975.',
  ],
  calculate: (inputs) => {
    const d1 = Number(inputs.d1) || 0;
    const d2 = Number(inputs.d2) || 0;
    const days = Number(inputs.days) || 0;

    if (d1 <= 0 || d2 <= 0 || days <= 0 || d1 === d2) {
      return { title: '肿瘤倍增时间', value: '--', unit: '天' };
    }

    // Volume ratio V2/V1 = (D2/D1)^3
    const dtDays = (days * Math.log(2)) / (3 * Math.log(d2 / d1));
    const sgrPercentPerDay = (3 * Math.log(d2 / d1) / days) * 100;

    let interp = '';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'info';

    if (dtDays > 0) {
      if (dtDays < 30) {
        badgeType = 'danger';
        interp = '肿瘤倍增极快 (<30天)，提示高度恶性、高增殖活性。';
      } else if (dtDays < 180) {
        badgeType = 'warning';
        interp = '肿瘤呈中速生长特征。';
      } else {
        badgeType = 'success';
        interp = '肿瘤倍增较慢 (>180天)，生长相对惰性。';
      }
    } else {
      badgeType = 'success';
      interp = '倍增时间为负数，表明肿瘤体积正在缩小！';
    }

    return {
      title: '肿瘤体积倍增时间 (DT)',
      value: dtDays > 0 ? dtDays.toFixed(1) : '缩小中',
      unit: dtDays > 0 ? '天' : '',
      badge: { text: dtDays > 0 ? `DT: ${dtDays.toFixed(1)} 天` : '肿瘤退缩中', type: badgeType },
      details: [
        { label: '特定生长率 (SGR)', value: `${sgrPercentPerDay.toFixed(3)} % / 天` },
        { label: '直径增加率', value: `${(((d2 - d1) / d1) * 100).toFixed(1)} %` },
        { label: '估算体积变化', value: `${(Math.pow(d2 / d1, 3) * 100 - 100).toFixed(1)} %` },
      ],
      interpretation: interp,
    };
  },
};
