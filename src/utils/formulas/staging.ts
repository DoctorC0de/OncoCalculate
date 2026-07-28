import { CalculatorDefinition } from '../../types/calculator';

export const ipiCalculator: CalculatorDefinition = {
  id: 'ipi_dlbcl',
  title: 'IPI / R-IPI 弥漫大B细胞淋巴瘤预后指数',
  abbreviation: 'IPI (DLBCL)',
  category: 'staging',
  categoryName: '预后分期与评分',
  description: '经典 IPI 及利妥昔单抗时代 R-IPI 评分，用于弥漫大B细胞淋巴瘤 (DLBCL) 患者治疗前风险分层。',
  tags: ['IPI', 'R-IPI', 'DLBCL', '淋巴瘤', '预后评分', '分期'],
  fields: [
    {
      id: 'age',
      label: '年龄 > 60 岁',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '年龄 ≤ 60 岁 [0 分]', value: '0' },
        { label: '年龄 > 60 岁 [1 分]', value: '1' },
      ],
    },
    {
      id: 'stage',
      label: 'Ann Arbor 分期 III 或 IV 期',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: 'I 或 II 期 [0 分]', value: '0' },
        { label: 'III 或 IV 期 [1 分]', value: '1' },
      ],
    },
    {
      id: 'ldh',
      label: '血清 LDH 水平 > 正常值上限',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '正常范围内 [0 分]', value: '0' },
        { label: '高于正常值上限 [1 分]', value: '1' },
      ],
    },
    {
      id: 'ecog',
      label: 'ECOG 体能状态 ≥ 2 分',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: 'ECOG 0 - 1 分 [0 分]', value: '0' },
        { label: 'ECOG 2 - 4 分 [1 分]', value: '1' },
      ],
    },
    {
      id: 'extranodal',
      label: '结外受累部位数 > 1 个',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '≤ 1 个结外部位 [0 分]', value: '0' },
        { label: '> 1 个结外部位 [1 分]', value: '1' },
      ],
    },
  ],
  formulaEquation: `\\text{IPI Score} = \\text{Age} + \\text{Stage} + \\text{LDH} + \\text{ECOG} + \\text{Extranodal}`,
  formulaDescription: '经典 IPI: 0-1低危, 2中低危, 3中高危, 4-5高危。R-IPI (R-CHOP方案下): 0分极佳, 1-2分良好, 3-5分不良。',
  references: [
    'A predictive model for aggressive non-Hodgkin\'s lymphoma. N Engl J Med. 1993;329(14):987-994.',
    'Sehn LH, et al. The revised International Prognostic Index (R-IPI) is a better predictor of outcome than the standard IPI for patients with diffuse large B-cell lymphoma treated with R-CHOP. Blood. 2007;109(5):1857-1861.',
  ],
  calculate: (inputs) => {
    const score =
      Number(inputs.age) +
      Number(inputs.stage) +
      Number(inputs.ldh) +
      Number(inputs.ecog) +
      Number(inputs.extranodal);

    let ipiGroup = '低危 (Low Risk)';
    let ripiGroup = 'Very Good (极佳)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';

    if (score >= 4) {
      ipiGroup = '高危 (High Risk)';
      ripiGroup = 'Poor (不良预后)';
      badgeType = 'danger';
    } else if (score === 3) {
      ipiGroup = '中高危 (High-Intermediate Risk)';
      ripiGroup = 'Poor (不良预后)';
      badgeType = 'danger';
    } else if (score === 2) {
      ipiGroup = '中低危 (Low-Intermediate Risk)';
      ripiGroup = 'Good (良好预后)';
      badgeType = 'warning';
    } else if (score === 1) {
      ipiGroup = '低危 (Low Risk)';
      ripiGroup = 'Good (良好预后)';
      badgeType = 'success';
    }

    return {
      title: `IPI 得分: ${score} 分`,
      value: score,
      unit: '分',
      badge: { text: `R-IPI: ${ripiGroup}`, type: badgeType },
      details: [
        { label: '经典 IPI 风险分层', value: `${ipiGroup}` },
        { label: 'R-IPI (R-CHOP方案下分层)', value: `${ripiGroup}` },
        { label: '估算 4 年无 progression 生存率 (R-IPI)', value: score === 0 ? '94%' : score <= 2 ? '79%' : '55%' },
      ],
      interpretation: `该患者 IPI 得分为 ${score} 分。在含利妥昔单抗 (R-CHOP) 治疗时代，R-IPI 归类为 ${ripiGroup}。`,
    };
  },
};

export const imdcCalculator: CalculatorDefinition = {
  id: 'imdc_rcc',
  title: 'IMDC / Heng 模型 转移性肾癌预后评分',
  abbreviation: 'IMDC (RCC)',
  category: 'staging',
  categoryName: '预后分期与评分',
  description: '评估转移性肾细胞癌 (mRCC) 患者在靶向/免疫联合治疗下的预后分层及生存期。',
  tags: ['IMDC', 'Heng评分', '肾癌', 'RCC', '靶向免疫', '预后'],
  fields: [
    {
      id: 'kps',
      label: 'Karnofsky 体能评分 (KPS < 80%)',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: 'KPS ≥ 80% [0 分]', value: '0' },
        { label: 'KPS < 80% [1 分]', value: '1' },
      ],
    },
    {
      id: 'timeToTx',
      label: '从诊断到开始系统治疗时间 < 1 年',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '≥ 1 年 [0 分]', value: '0' },
        { label: '< 1 年 [1 分]', value: '1' },
      ],
    },
    {
      id: 'hgb',
      label: '血红蛋白 < 正常值下限 (LLN)',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '正常或升高 [0 分]', value: '0' },
        { label: '< 正常值下限 (贫血) [1 分]', value: '1' },
      ],
    },
    {
      id: 'calcium',
      label: '纠正血钙 > 正常值上限 (ULN)',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '正常或偏低 [0 分]', value: '0' },
        { label: '> 2.55 mmol/L (10 mg/dL) [1 分]', value: '1' },
      ],
    },
    {
      id: 'neutrophil',
      label: '中性粒细胞绝对值 (ANC) > 正常值上限',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '正常 [0 分]', value: '0' },
        { label: '> 正常值上限 [1 分]', value: '1' },
      ],
    },
    {
      id: 'platelet',
      label: '血小板计数 (PLT) > 正常值上限',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '正常 [0 分]', value: '0' },
        { label: '> 正常值上限 [1 分]', value: '1' },
      ],
    },
  ],
  formulaEquation: `\\text{IMDC Risk} = \\sum (\\text{KPS} + \\text{TimeToTx} + \\text{Hgb} + \\text{Ca} + \\text{ANC} + \\text{PLT})`,
  formulaDescription: '0分为低危 (Favorable)；1-2分为中危 (Intermediate)；3-6分为高危 (Poor)。NCCN建议中高危患者优先选择双免疫（纳武利尤+伊匹木单抗）或免疫+TKI。',
  references: [
    'Heng DY, et al. Prognostic factors for recentered overall survival in patients with metastatic renal cell carcinoma treated with vascular endothelial growth factor-targeted agents. J Clin Oncol. 2009;27(34):5794-5799.',
  ],
  calculate: (inputs) => {
    const score =
      Number(inputs.kps) +
      Number(inputs.timeToTx) +
      Number(inputs.hgb) +
      Number(inputs.calcium) +
      Number(inputs.neutrophil) +
      Number(inputs.platelet);

    let riskGroup = '低危 (Favorable Risk)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let txRec = '一线可考虑 TKI 单药（帕唑帕尼/舒尼替尼）或 免疫+TKI 联合。';

    if (score >= 3) {
      riskGroup = `高危 (Poor Risk - ${score}分)`;
      badgeType = 'danger';
      txRec = '高危组：NCCN首选推荐双免疫（O+Y 纳武利尤单抗+伊匹木单抗）或 帕博利珠单抗+阿昔替尼！';
    } else if (score >= 1) {
      riskGroup = `中危 (Intermediate Risk - ${score}分)`;
      badgeType = 'warning';
      txRec = '中危组：推荐免疫联合治疗方案（如 O+Y 或 IO+TKI）。';
    }

    return {
      title: `IMDC 风险分层: ${riskGroup.split(' ')[0]}`,
      value: score,
      unit: '分',
      badge: { text: riskGroup, type: badgeType },
      details: [
        { label: '危险因素计数', value: `${score} / 6 个` },
        { label: '预后分组', value: `${riskGroup}` },
        { label: '一线治疗推荐', value: `${txRec}` },
      ],
      interpretation: `IMDC 评分为 ${score} 分（归为 ${riskGroup}）。`,
    };
  },
};
