import { CalculatorDefinition } from '../../types/calculator';

export const khoranaCalculator: CalculatorDefinition = {
  id: 'khorana',
  title: 'Khorana 肿瘤相关静脉血栓 (VTE) 风险评分',
  abbreviation: 'Khorana',
  category: 'risk',
  categoryName: '风险与感染',
  description: '评估门诊拟行化疗的恶性肿瘤患者发生静脉血栓栓塞症 (VTE) 的概率，指导预防性抗凝治疗。',
  tags: ['Khorana', 'VTE', '血栓风险', '静脉血栓', '化疗血栓', '抗凝预防'],
  fields: [
    {
      id: 'site',
      label: '肿瘤原发部位',
      type: 'select',
      defaultValue: 'high',
      options: [
        { label: '极高危部位 (胃癌、胰腺癌、脑肿瘤) [2 分]', value: 'very_high' },
        { label: '高危部位 (肺癌、淋巴瘤、妇科肿瘤、膀胱癌、睾丸癌) [1 分]', value: 'high' },
        { label: '其他肿瘤部位 [0 分]', value: 'other' },
      ],
    },
    {
      id: 'platelet',
      label: '化疗前血小板计数 (Platelets)',
      type: 'select',
      defaultValue: 'no',
      options: [
        { label: '< 350 × 10⁹/L [0 分]', value: 'no' },
        { label: '≥ 350 × 10⁹/L [1 分]', value: 'yes' },
      ],
    },
    {
      id: 'hgb',
      label: '血红蛋白 (Hgb < 100 g/L 或使用促红素 ESA)',
      type: 'select',
      defaultValue: 'no',
      options: [
        { label: '血红蛋白 ≥ 100 g/L 且未使用 ESA [0 分]', value: 'no' },
        { label: '血红蛋白 < 100 g/L 或正使用 ESA [1 分]', value: 'yes' },
      ],
    },
    {
      id: 'wbc',
      label: '白细胞计数 (WBC > 11 × 10⁹/L)',
      type: 'select',
      defaultValue: 'no',
      options: [
        { label: 'WBC ≤ 11 × 10⁹/L [0 分]', value: 'no' },
        { label: 'WBC > 11 × 10⁹/L [1 分]', value: 'yes' },
      ],
    },
    {
      id: 'bmi',
      label: '体质指数 (BMI ≥ 35 kg/m²)',
      type: 'select',
      defaultValue: 'no',
      options: [
        { label: 'BMI < 35 kg/m² [0 分]', value: 'no' },
        { label: 'BMI ≥ 35 kg/m² [1 分]', value: 'yes' },
      ],
    },
  ],
  formulaEquation: `\\text{Khorana Score} = \\text{Site Points} + \\text{Plt} + \\text{Hgb} + \\text{WBC} + \\text{BMI}`,
  formulaDescription: '0分为低危（VTE率 ~0.8-1.5%）；1-2分为中危（~1.8-4.8%）；≥3分为高危（~6.7-12.9%）。NCCN指南建议高危患者考虑利伐沙班/阿哌沙班/LMWH预防性抗凝。',
  references: [
    'Khorana AA, et al. Development and validation of a predictive model for chemotherapy-associated thrombosis. Blood. 2008;111(10):4902-4907.',
  ],
  calculate: (inputs) => {
    let score = 0;

    if (inputs.site === 'very_high') score += 2;
    else if (inputs.site === 'high') score += 1;

    if (inputs.platelet === 'yes') score += 1;
    if (inputs.hgb === 'yes') score += 1;
    if (inputs.wbc === 'yes') score += 1;
    if (inputs.bmi === 'yes') score += 1;

    let riskLevel = '低危 (0 分)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let interp = '低血栓风险，无需例行给以药物性预防抗凝。';

    if (score >= 3) {
      riskLevel = `高危 (${score} 分)`;
      badgeType = 'danger';
      interp = '高血栓风险 (VTE 风险达 7-13%)！强烈建议根据 NCCN / CSCO 指南评估应用预防性抗凝药物 (如利伐沙班 10mg qd 或低分子肝素)。';
    } else if (score >= 1) {
      riskLevel = `中危 (${score} 分)`;
      badgeType = 'warning';
      interp = '中度血栓风险 (VTE 风险约 2-5%)，建议密切关注肢体肿胀、D-二聚体及呼吸症状。';
    }

    return {
      title: `VTE 风险分层: ${riskLevel}`,
      value: score,
      unit: '分',
      badge: { text: riskLevel, type: badgeType },
      details: [
        { label: 'Khorana 评分', value: `${score} 分` },
        { label: '预测 2.5 个月 VTE 发生率', value: score >= 3 ? '6.7% - 12.9%' : score >= 1 ? '1.8% - 4.8%' : '0.8% - 1.5%' },
      ],
      interpretation: interp,
    };
  },
};

export const masccCalculator: CalculatorDefinition = {
  id: 'mascc',
  title: 'MASCC 中性粒细胞减少伴发热 (FN) 低危风险指数',
  abbreviation: 'MASCC',
  category: 'risk',
  categoryName: '风险与感染',
  description: '筛选肿瘤化疗后中性粒细胞减少伴发热 (FN) 患者中的低危群体，评估是否可行门诊口服抗生素治疗。',
  tags: ['MASCC', '发热', '中性粒细胞减少', 'FN', '低危筛选', '感染风险'],
  fields: [
    {
      id: 'burden',
      label: '发热相关症状严重程度 (Burden of Illness)',
      type: 'select',
      defaultValue: '5',
      options: [
        { label: '无症状或轻微临床症状 [5 分]', value: '5' },
        { label: '中度临床症状 [3 分]', value: '3' },
        { label: '严重临床症状或极度衰弱 [0 分]', value: '0' },
      ],
    },
    {
      id: 'hypotension',
      label: '无低血压 (收缩压 SBP > 90 mmHg)',
      type: 'select',
      defaultValue: '5',
      options: [
        { label: '是 (SBP > 90 mmHg) [5 分]', value: '5' },
        { label: '否 (SBP ≤ 90 mmHg 低血压) [0 分]', value: '0' },
      ],
    },
    {
      id: 'copd',
      label: '无合并慢阻肺 (COPD)',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '无 COPD [4 分]', value: '4' },
        { label: '有 COPD [0 分]', value: '0' },
      ],
    },
    {
      id: 'tumorType',
      label: '实体瘤 或 无真菌感染史的血液瘤',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '实体瘤或无既往真菌感染史 [4 分]', value: '4' },
        { label: '既往有真菌感染史的血液瘤 [0 分]', value: '0' },
      ],
    },
    {
      id: 'dehydration',
      label: '无需要静脉补液的脱水',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '无严重脱水 [3 分]', value: '3' },
        { label: '有脱水需要静脉补液 [0 分]', value: '0' },
      ],
    },
    {
      id: 'status',
      label: '发热发生时处于门诊状态',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '门诊发病 [3 分]', value: '3' },
        { label: '住院发病 [0 分]', value: '0' },
      ],
    },
    {
      id: 'age',
      label: '年龄 < 60 岁',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: '年龄 < 60 岁 [2 分]', value: '2' },
        { label: '年龄 ≥ 60 岁 [0 分]', value: '0' },
      ],
    },
  ],
  formulaEquation: `\\text{MASCC Index} = \\sum \\text{Points (Max 26)}`,
  formulaDescription: 'MASCC 评分 ≥ 21 分判定为低危患者（严重并发症发生率 < 5%），可考虑门诊口服抗生素治疗（如环丙沙星+阿莫西林克拉维酸钾）。',
  references: [
    'Klastersky J, et al. The Multinational Association for Supportive Care in Cancer risk index: A multinational scoring system for identifying low-risk febrile neutropenic cancer patients. J Clin Oncol. 2000;18(16):3038-3051.',
  ],
  calculate: (inputs) => {
    const score =
      Number(inputs.burden) +
      Number(inputs.hypotension) +
      Number(inputs.copd) +
      Number(inputs.tumorType) +
      Number(inputs.dehydration) +
      Number(inputs.status) +
      Number(inputs.age);

    const isLowRisk = score >= 21;

    return {
      title: `MASCC 评价: ${isLowRisk ? '低危 (Low Risk)' : '高危 (High Risk)'}`,
      value: score,
      unit: '/ 26分',
      badge: {
        text: isLowRisk ? '低危患者 (≥21分)' : '高危患者 (<21分)',
        type: isLowRisk ? 'success' : 'danger',
      },
      details: [
        { label: 'MASCC 总得分', value: `${score} / 26 分` },
        { label: '预测低风险可靠性', value: isLowRisk ? '高 (严重并发症 < 5%)' : '低 (需住院静脉广谱抗生素)' },
      ],
      interpretation: isLowRisk
        ? 'MASCC 得分 ≥ 21 分：患者属于低危发热性中性粒细胞减少，可在密切监护下考虑门诊口服广谱抗生素（如阿莫西林克拉维酸钾 + 喹诺酮类）。'
        : 'MASCC 得分 < 21 分：患者属于高危感染人群！强烈建议收住院行静脉广谱抗生素（如哌拉西林他唑巴坦 / 美罗培南）经验性抗感染治疗。',
    };
  },
};
