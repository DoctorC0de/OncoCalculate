import { CalculatorDefinition } from '../../types/calculator';

export const bsaCalculator: CalculatorDefinition = {
  id: 'bsa',
  title: '体表面积 (BSA) 多公式计算器',
  abbreviation: 'BSA',
  category: 'chemo',
  categoryName: '化疗与剂量',
  description: '根据身高与体重计算体表面积，提供 Mosteller、Du Bois、Haycock、Gehan-George 及 Boyd 五大权威经典公式对比。',
  tags: ['BSA', '体表面积', 'Mosteller', 'DuBois', '化疗剂量'],
  fields: [
    {
      id: 'height',
      label: '身高',
      type: 'number',
      defaultValue: 170,
      defaultUnit: 'cm',
      units: [
        { label: 'cm', value: 'cm', toBaseMultiplier: 1 },
        { label: 'm', value: 'm', toBaseMultiplier: 100 },
        { label: 'in', value: 'in', toBaseMultiplier: 2.54 },
      ],
      min: 30,
      max: 250,
      step: 0.5,
    },
    {
      id: 'weight',
      label: '体重',
      type: 'number',
      defaultValue: 65,
      defaultUnit: 'kg',
      units: [
        { label: 'kg', value: 'kg', toBaseMultiplier: 1 },
        { label: 'lb', value: 'lb', toBaseMultiplier: 0.453592 },
      ],
      min: 2,
      max: 300,
      step: 0.1,
    },
  ],
  formulaEquation: `\\text{Mosteller: } \\text{BSA (m}^2\\text{)} = \\sqrt{\\frac{\\text{Height (cm)} \\times \\text{Weight (kg)}}{3600}}`,
  formulaDescription: 'Mosteller公式为目前国际肿瘤学临床试验及指南（NCCN/CSCO）推荐的最常用BSA计算方法。',
  references: [
    'Mosteller RD. Simplified calculation of body-surface area. N Engl J Med. 1987;317(17):1098.',
    'Du Bois D, Du Bois EF. A formula to estimate the approximate surface area if height and weight be known. Arch Intern Med. 1916;17:863-871.',
  ],
  calculate: (inputs, units) => {
    let heightCm = Number(inputs.height) || 0;
    if (units.height === 'm') heightCm *= 100;
    if (units.height === 'in') heightCm *= 2.54;

    let weightKg = Number(inputs.weight) || 0;
    if (units.weight === 'lb') weightKg *= 0.453592;

    if (heightCm <= 0 || weightKg <= 0) {
      return { title: '体表面积', value: '--', unit: 'm²' };
    }

    // Formulas
    const mosteller = Math.sqrt((heightCm * weightKg) / 3600);
    const duBois = 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);
    const haycock = 0.024265 * Math.pow(heightCm, 0.3964) * Math.pow(weightKg, 0.5378);
    const gehan = 0.0235 * Math.pow(heightCm, 0.42246) * Math.pow(weightKg, 0.51456);
    const boyd = 0.0003207 * Math.pow(heightCm, 0.3) * Math.pow(weightKg * 1000, 0.7285 - 0.0188 * Math.log10(weightKg * 1000));

    return {
      title: '推荐 Mosteller BSA',
      value: mosteller.toFixed(2),
      unit: 'm²',
      badge: { text: '临床标准推荐', type: 'success' },
      details: [
        { label: 'Mosteller (推荐)', value: `${mosteller.toFixed(3)} m²` },
        { label: 'Du Bois & Du Bois', value: `${duBois.toFixed(3)} m²` },
        { label: 'Haycock (儿童适用)', value: `${haycock.toFixed(3)} m²` },
        { label: 'Gehan & George', value: `${gehan.toFixed(3)} m²` },
        { label: 'Boyd', value: `${boyd.toFixed(3)} m²` },
      ],
      interpretation: `该患者身高 ${heightCm} cm，体重 ${weightKg.toFixed(1)} kg。标准Mosteller体表面积为 ${mosteller.toFixed(2)} m²。化疗给药请根据具体药物说明书调整上限（一般上限为 2.0 - 2.2 m²）。`,
    };
  },
};

export const calvertCalculator: CalculatorDefinition = {
  id: 'calvert',
  title: '卡铂剂量计算器 (Calvert 公式)',
  abbreviation: 'Calvert',
  category: 'chemo',
  categoryName: '化疗与剂量',
  description: '根据目标 AUC 曲线下面积和估计肾小球滤过率 (GFR / CrCl) 计算卡铂 (Carboplatin) 给药总剂量。',
  tags: ['卡铂', 'Calvert', 'AUC', 'Carboplatin', '化疗给药', 'GFR'],
  fields: [
    {
      id: 'targetAuc',
      label: '目标 AUC',
      hint: '典型单药 5-7 mg/mL·min，联合化疗 4-6 mg/mL·min',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 12,
      step: 0.5,
      defaultUnit: 'mg/mL·min',
    },
    {
      id: 'gfr',
      label: '估计 GFR / 肌酐清除率',
      hint: '可通过 Cockcroft-Gault 或 CKD-EPI 获得',
      type: 'number',
      defaultValue: 75,
      defaultUnit: 'mL/min',
      min: 5,
      max: 200,
      step: 1,
    },
    {
      id: 'capGfr',
      label: '是否限制 GFR 上限为 125 mL/min (FDA 建议)',
      type: 'select',
      defaultValue: 'yes',
      options: [
        { label: '是 (上限 125 mL/min)', value: 'yes' },
        { label: '否 (使用实际测量值)', value: 'no' },
      ],
    },
  ],
  formulaEquation: `\\text{Carboplatin Dose (mg)} = \\text{Target AUC} \\times (\\text{GFR} + 25)`,
  formulaDescription: 'NCCN指南建议：为防止超大剂量给药发生严重骨髓抑制，测算GFR上限通常封顶于 125 mL/min（即卡铂最大剂量不超过 AUC × 150 mg）。',
  references: [
    'Calvert AH, et al. Carboplatin dosage: prospective evaluation of a simple formula based on glomerular filtration rate. J Clin Oncol. 1989;7(11):1748-1756.',
    'FDA Guidance on Carboplatin Dosing (Cap GFR at 125 mL/min).',
  ],
  calculate: (inputs) => {
    const auc = Number(inputs.targetAuc) || 0;
    let gfr = Number(inputs.gfr) || 0;
    const isCapped = inputs.capGfr === 'yes';

    if (auc <= 0 || gfr <= 0) {
      return { title: '卡铂给药剂量', value: '--', unit: 'mg' };
    }

    const rawGfr = gfr;
    if (isCapped && gfr > 125) {
      gfr = 125;
    }

    const dose = auc * (gfr + 25);
    const maxDose = auc * 150;

    return {
      title: '卡铂计算剂量',
      value: Math.round(dose),
      unit: 'mg',
      badge: {
        text: rawGfr > 125 && isCapped ? '根据FDA建议已截顶' : '计算正常',
        type: rawGfr > 125 && isCapped ? 'warning' : 'success',
      },
      details: [
        { label: '使用的 GFR', value: `${gfr} mL/min ${rawGfr > 125 ? `(原值 ${rawGfr})` : ''}` },
        { label: '目标 AUC', value: `${auc} mg/mL·min` },
        { label: '最大建议上限', value: `${maxDose} mg` },
      ],
      interpretation: `该患者卡铂推荐计算剂量为 ${Math.round(dose)} mg。${
        rawGfr > 125 && isCapped
          ? `提示：原始估算 GFR (${rawGfr} mL/min) 超过 125 mL/min，已按照 NCCN / FDA 推荐截顶为 125 mL/min 进行安全计算。`
          : ''
      }`,
    };
  },
};

export const gfrCalculator: CalculatorDefinition = {
  id: 'gfr_crcl',
  title: '肾功能评估 (Cockcroft-Gault & CKD-EPI 2021)',
  abbreviation: 'GFR / CrCl',
  category: 'chemo',
  categoryName: '化疗与剂量',
  description: '评估肿瘤患者肾功能与肌酐清除率，包含 Cockcroft-Gault (CrCl)、CKD-EPI (2021) 与 MDRD 公式，支持国际单位与传统单位转换。',
  tags: ['CrCl', 'GFR', 'Cockcroft-Gault', 'CKD-EPI', '肌酐清除率', '肾功能'],
  fields: [
    {
      id: 'gender',
      label: '性别',
      type: 'select',
      defaultValue: 'male',
      options: [
        { label: '男 (Male)', value: 'male' },
        { label: '女 (Female)', value: 'female' },
      ],
    },
    {
      id: 'age',
      label: '年龄',
      type: 'number',
      defaultValue: 60,
      defaultUnit: '岁',
      min: 18,
      max: 120,
    },
    {
      id: 'weight',
      label: '体重',
      type: 'number',
      defaultValue: 65,
      defaultUnit: 'kg',
      units: [
        { label: 'kg', value: 'kg', toBaseMultiplier: 1 },
        { label: 'lb', value: 'lb', toBaseMultiplier: 0.453592 },
      ],
      min: 20,
      max: 300,
    },
    {
      id: 'scr',
      label: '血清肌酐 (SCr)',
      type: 'number',
      defaultValue: 79.6,
      defaultUnit: 'µmol/L (SI)',
      units: [
        { label: 'µmol/L (SI)', value: 'umol', toBaseMultiplier: 1 },
        { label: 'mg/dL', value: 'mgdL', toBaseMultiplier: 88.4 },
      ],
      min: 10,
      max: 1500,
      step: 0.1,
    },
  ],
  formulaEquation: `\\text{CrCl (Cockcroft-Gault)} = \\frac{(140 - \\text{Age}) \\times \\text{Weight (kg)}}{72 \\times \\text{SCr (mg/dL)}} \\times [0.85 \\text{ if Female}]`,
  formulaDescription: 'Cockcroft-Gault公式是化疗药物（如顺铂、卡铂、培美曲塞）剂量调整的标准权威参考公式。',
  references: [
    'Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31-41.',
    'Inker GJ, et al. New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race. N Engl J Med. 2021;385(19):1737-1749.',
  ],
  calculate: (inputs, units) => {
    const age = Number(inputs.age) || 0;
    const isFemale = inputs.gender === 'female';

    let weightKg = Number(inputs.weight) || 0;
    if (units.weight === 'lb') weightKg *= 0.453592;

    let scrUmol = Number(inputs.scr) || 0;
    if (units.scr === 'mgdL') scrUmol = Number(inputs.scr) * 88.4;
    const scrMgDl = scrUmol / 88.4;

    if (age <= 0 || weightKg <= 0 || scrMgDl <= 0) {
      return { title: '估算肾功能', value: '--', unit: 'mL/min' };
    }

    // Cockcroft-Gault CrCl (mL/min)
    let crCl = ((140 - age) * weightKg) / (72 * scrMgDl);
    if (isFemale) crCl *= 0.85;

    // CKD-EPI 2021 eGFR (mL/min/1.73m²)
    const kappa = isFemale ? 0.7 : 0.9;
    const alpha = isFemale ? -0.241 : -0.302;
    const minRatio = Math.min(scrMgDl / kappa, 1);
    const maxRatio = Math.max(scrMgDl / kappa, 1);

    const ckdepi = 142 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.2) * Math.pow(0.9938, age) * (isFemale ? 1.012 : 1.0);

    let badgeText = '肾功能正常 (≥90)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';

    if (crCl < 30) {
      badgeText = '重度肾功能不全 (<30)';
      badgeType = 'danger';
    } else if (crCl < 60) {
      badgeText = '中度肾功能不全 (30-59)';
      badgeType = 'warning';
    } else if (crCl < 90) {
      badgeText = '轻度肾功能不全 (60-89)';
      badgeType = 'info';
    }

    return {
      title: 'Cockcroft-Gault 肌酐清除率',
      value: crCl.toFixed(1),
      unit: 'mL/min',
      badge: { text: badgeText, type: badgeType },
      details: [
        { label: 'Cockcroft-Gault (CrCl)', value: `${crCl.toFixed(1)} mL/min` },
        { label: 'CKD-EPI 2021 (eGFR)', value: `${ckdepi.toFixed(1)} mL/min/1.73m²` },
        { label: '对应血肌酐', value: `${scrUmol.toFixed(1)} µmol/L (${scrMgDl.toFixed(2)} mg/dL)` },
      ],
      interpretation: `根据 Cockcroft-Gault 公式，患者 CrCl 为 ${crCl.toFixed(1)} mL/min。${
        crCl < 60 ? '提示：肾功能受损，顺铂（Cisplatin）、培美曲塞（Pemetrexed）、卡培他滨（Capecitabine）等药物需谨慎减量或停用！' : '肾功能良好，化疗药物可正常给药。'
      }`,
    };
  },
};
