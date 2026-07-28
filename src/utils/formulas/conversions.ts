import { CalculatorDefinition } from '../../types/calculator';

export const opioidCalculator: CalculatorDefinition = {
  id: 'opioid_converter',
  title: '阿片类止痛药等效剂量换算 (MEDD) 计算器',
  abbreviation: 'MEDD',
  category: 'conversion',
  categoryName: '药物与单位换算',
  description: '肿瘤癌痛三阶梯止痛中，在口服口服吗啡、羟考酮、芬太尼贴剂、地佐辛、氢考酮及喷他佐辛等之间进行口服吗啡等效剂量 (MEDD) 准确换算。',
  tags: ['阿片类', 'MEDD', '癌痛止痛', '吗啡', '羟考酮', '芬太尼贴剂', '等效剂量'],
  fields: [
    {
      id: 'sourceDrug',
      label: '当前正在使用的阿片类药物',
      type: 'select',
      defaultValue: 'oral_morphine',
      options: [
        { label: '口服吗啡 (Oral Morphine)', value: 'oral_morphine' },
        { label: '静脉/皮下吗啡 (IV/SC Morphine)', value: 'iv_morphine' },
        { label: '口服羟考酮 (Oral Oxycodone - 泰勒宁/奥施康定)', value: 'oral_oxycodone' },
        { label: '芬太尼透皮贴剂 (Transdermal Fentanyl Patch)', value: 'fentanyl_patch' },
        { label: '口服氢摩尔酮 (Oral Hydromorphone)', value: 'oral_hydromorphone' },
        { label: '静脉氢摩尔酮 (IV Hydromorphone)', value: 'iv_hydromorphone' },
        { label: '口服曲马多 (Oral Tramadol)', value: 'oral_tramadol' },
      ],
    },
    {
      id: 'sourceDose',
      label: '当前药物每日总剂量',
      hint: '芬太尼贴剂单位为 mcg/h，其他均为 mg/日',
      type: 'number',
      defaultValue: 60,
      min: 1,
      max: 2000,
      step: 1,
    },
    {
      id: 'targetDrug',
      label: '拟换算的目标阿片类药物',
      type: 'select',
      defaultValue: 'oral_oxycodone',
      options: [
        { label: '口服羟考酮 (Oral Oxycodone)', value: 'oral_oxycodone' },
        { label: '芬太尼透皮贴剂 (Transdermal Fentanyl Patch)', value: 'fentanyl_patch' },
        { label: '口服吗啡 (Oral Morphine)', value: 'oral_morphine' },
        { label: '静脉/皮下吗啡 (IV/SC Morphine)', value: 'iv_morphine' },
        { label: '口服氢摩尔酮 (Oral Hydromorphone)', value: 'oral_hydromorphone' },
        { label: '静脉氢摩尔酮 (IV Hydromorphone)', value: 'iv_hydromorphone' },
      ],
    },
    {
      id: 'crossReduction',
      label: '不完全交叉耐受减量系数 (Cross-Tolerance Reduction)',
      hint: '换用新阿片类药物时，通常推荐减少 25%-50% 剂量以防过量',
      type: 'select',
      defaultValue: '25',
      options: [
        { label: '减少 25% (临床标准推荐)', value: '25' },
        { label: '减少 30%', value: '30' },
        { label: '减少 50% (老弱衰竭/高危患者)', value: '50' },
        { label: '不减量 (0%)', value: '0' },
      ],
    },
  ],
  formulaEquation: `\\text{MEDD (mg/day)} = \\text{Dose} \\times \\text{Conversion Factor}`,
  formulaDescription: '口服吗啡:口服羟考酮 = 1.5:1；口服吗啡:芬太尼贴剂(mcg/h) = 2:1；口服吗啡:静脉吗啡 = 3:1。',
  references: [
    'NCCN Clinical Practice Guidelines in Oncology: Adult Cancer Pain. Version 1.2023.',
    'EAPC recommendations on the use of opioid analgesics in the treatment of cancer pain. Lancet Oncol. 2012;13(2):e58-e66.',
  ],
  calculate: (inputs) => {
    const sourceDrug = inputs.sourceDrug;
    const targetDrug = inputs.targetDrug;
    const dose = Number(inputs.sourceDose) || 0;
    const reductionPercent = Number(inputs.crossReduction) || 0;

    if (dose <= 0) {
      return { title: '等效剂量', value: '--' };
    }

    // Convert source drug dose to Oral Morphine Equivalent Daily Dose (MEDD in mg/day)
    let medd = 0;
    switch (sourceDrug) {
      case 'oral_morphine':
        medd = dose;
        break;
      case 'iv_morphine':
        medd = dose * 3;
        break;
      case 'oral_oxycodone':
        medd = dose * 1.5;
        break;
      case 'fentanyl_patch':
        // 25 mcg/h fentanyl patch ~ 60 mg/day oral morphine
        medd = dose * 2.4;
        break;
      case 'oral_hydromorphone':
        medd = dose * 4;
        break;
      case 'iv_hydromorphone':
        medd = dose * 20;
        break;
      case 'oral_tramadol':
        medd = dose * 0.1;
        break;
      default:
        medd = dose;
    }

    // Apply cross-tolerance reduction
    const reducedMedd = medd * (1 - reductionPercent / 100);

    // Convert reduced MEDD to target drug dose
    let targetDose = 0;
    let targetUnit = 'mg/日';

    switch (targetDrug) {
      case 'oral_morphine':
        targetDose = reducedMedd;
        targetUnit = 'mg/日 (口服吗啡)';
        break;
      case 'iv_morphine':
        targetDose = reducedMedd / 3;
        targetUnit = 'mg/日 (静脉/皮下吗啡)';
        break;
      case 'oral_oxycodone':
        targetDose = reducedMedd / 1.5;
        targetUnit = 'mg/日 (口服羟考酮/奥施康定)';
        break;
      case 'fentanyl_patch':
        targetDose = reducedMedd / 2.4;
        targetUnit = 'mcg/h (芬太尼透皮贴剂)';
        break;
      case 'oral_hydromorphone':
        targetDose = reducedMedd / 4;
        targetUnit = 'mg/日 (口服氢摩尔酮)';
        break;
      case 'iv_hydromorphone':
        targetDose = reducedMedd / 20;
        targetUnit = 'mg/日 (静脉氢摩尔酮)';
        break;
    }

    return {
      title: '目标药物计算剂量',
      value: targetDose.toFixed(1),
      unit: targetUnit.split(' ')[0],
      badge: {
        text: `已包含 ${reductionPercent}% 交叉耐受减量`,
        type: 'success',
      },
      details: [
        { label: '口服吗啡等效剂量 (MEDD)', value: `${medd.toFixed(1)} mg/日` },
        { label: '减量后有效 MEDD', value: `${reducedMedd.toFixed(1)} mg/日` },
        { label: '目标换算给药量', value: `${targetDose.toFixed(1)} ${targetUnit}` },
      ],
      interpretation: `该患者原方案折算口服吗啡等效剂量 (MEDD) 为 ${medd.toFixed(1)} mg/日。扣除 ${reductionPercent}% 的不完全交叉耐受减量后，推荐换用目标药物为 ${targetDose.toFixed(1)} ${targetUnit}。`,
    };
  },
};

export const steroidCalculator: CalculatorDefinition = {
  id: 'steroid_converter',
  title: '糖皮质激素等效剂量转换器',
  abbreviation: 'Steroid',
  category: 'conversion',
  categoryName: '药物与单位换算',
  description: '地塞米松、泼尼松、甲强龙及氢化可的松等常用激素抗炎及免疫抑制等效剂量换算。',
  tags: ['糖皮质激素', '地塞米松', '泼尼松', '甲强龙', '氢化可的松', '免疫毒性irAE'],
  fields: [
    {
      id: 'steroid',
      label: '当前糖皮质激素种类',
      type: 'select',
      defaultValue: 'dexamethasone',
      options: [
        { label: '地塞米松 (Dexamethasone)', value: 'dexamethasone' },
        { label: '泼尼松 / 泼尼松龙 (Prednisone)', value: 'prednisone' },
        { label: '甲泼尼龙 (Methylprednisolone / 甲强龙)', value: 'methylprednisolone' },
        { label: '氢化可的松 (Hydrocortisone)', value: 'hydrocortisone' },
      ],
    },
    {
      id: 'dose',
      label: '当前用药剂量',
      type: 'number',
      defaultValue: 7.5,
      defaultUnit: 'mg/日',
      min: 0.1,
      max: 1000,
      step: 0.5,
    },
  ],
  formulaEquation: `\\text{Equivalence Ratio}: \\text{Dex 0.75 mg} \\equiv \\text{Pred 5 mg} \\equiv \\text{Methylpred 4 mg} \\equiv \\text{Hydrocort 20 mg}`,
  formulaDescription: '地塞米松为长效（抗炎强，无盐皮质激素活性）；泼尼松与甲强龙为中效，常用于免疫检查点抑制剂毒性 (irAE) 处理。',
  references: ['Meikle AW, Tyler FH. Potency and duration of action of glucocorticoids. Am J Med. 1977;63(2):200-207.'],
  calculate: (inputs) => {
    const steroid = inputs.steroid;
    const dose = Number(inputs.dose) || 0;

    if (dose <= 0) {
      return { title: '激素等效剂量', value: '--' };
    }

    // Base in Prednisone equivalent mg
    let predEq = 0;
    switch (steroid) {
      case 'dexamethasone':
        predEq = dose * (5 / 0.75);
        break;
      case 'prednisone':
        predEq = dose;
        break;
      case 'methylprednisolone':
        predEq = dose * (5 / 4);
        break;
      case 'hydrocortisone':
        predEq = dose * (5 / 20);
        break;
    }

    const dexDose = predEq * (0.75 / 5);
    const predDose = predEq;
    const methylDose = predEq * (4 / 5);
    const hydroDose = predEq * (20 / 5);

    return {
      title: '泼尼松等效剂量',
      value: predDose.toFixed(1),
      unit: 'mg',
      badge: { text: '换算成功', type: 'success' },
      details: [
        { label: '地塞米松 (Dexamethasone)', value: `${dexDose.toFixed(2)} mg` },
        { label: '泼尼松 (Prednisone)', value: `${predDose.toFixed(1)} mg` },
        { label: '甲泼尼龙 (Methylprednisolone)', value: `${methylDose.toFixed(1)} mg` },
        { label: '氢化可的松 (Hydrocortisone)', value: `${hydroDose.toFixed(1)} mg` },
      ],
      interpretation: `该剂量相当于 泼尼松 ${predDose.toFixed(1)} mg / 地塞米松 ${dexDose.toFixed(2)} mg / 甲强龙 ${methylDose.toFixed(1)} mg。`,
    };
  },
};
