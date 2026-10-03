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

export const flipiCalculator: CalculatorDefinition = {
  id: 'flipi_score',
  title: 'FLIPI 滤泡性淋巴瘤国际预后指数',
  abbreviation: 'FLIPI',
  category: 'staging',
  categoryName: '预后分期与评分',
  description: '滤泡性淋巴瘤 (Follicular Lymphoma) 国际公认的标准临床预后评分系统，预测患者总生存率与治疗启动指征。',
  tags: ['FLIPI', '滤泡淋巴瘤', '惰性淋巴瘤', 'Ann Arbor', 'LDH', '血红蛋白', '预后评分'],
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
        { label: 'I 期或 II 期 [0 分]', value: '0' },
        { label: 'III 期或 IV 期 [1 分]', value: '1' },
      ],
    },
    {
      id: 'hgb',
      label: '血红蛋白 (Hb) < 120 g/L (12.0 g/dL)',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: 'Hb ≥ 120 g/L [0 分]', value: '0' },
        { label: 'Hb < 120 g/L (贫血) [1 分]', value: '1' },
      ],
    },
    {
      id: 'nodal',
      label: '累及淋巴结区数 > 4 个',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: '≤ 4 个受累结区 [0 分]', value: '0' },
        { label: '> 4 个受累结区 [1 分]', value: '1' },
      ],
    },
    {
      id: 'ldh',
      label: '血清 LDH > 正常值上限 (ULN)',
      type: 'select',
      defaultValue: '0',
      options: [
        { label: 'LDH 正常 [0 分]', value: '0' },
        { label: 'LDH > 正常值上限 [1 分]', value: '1' },
      ],
    },
  ],
  formulaEquation: `\\text{FLIPI Points} = \\text{Age > 60} + \\text{Stage III-IV} + \\text{Hb < 120} + \\text{Nodal > 4} + \\text{LDH > ULN}`,
  formulaDescription: '0-1 分为低危组 (10年生存率 ~71%)；2 分为中危组 (10年生存率 ~51%)；3-5 分为高危组 (10年生存率 ~36%)。',
  references: [
    'Solal-Céligny P, et al. Follicular lymphoma international prognostic index. Blood. 2004;104(5):1258-1265.',
  ],
  calculate: (inputs) => {
    const score =
      Number(inputs.age) +
      Number(inputs.stage) +
      Number(inputs.hgb) +
      Number(inputs.nodal) +
      Number(inputs.ldh);

    let riskGroup = '低危组 (Low Risk)';
    let tenYearOs = '~71%';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let interp = 'FLIPI 0-1 分（低危）：10年总生存率高达 ~71%。无症状且低肿瘤负荷（GELF标准）者通常首选观察等待 (Watch & Wait)；有指征者可单药或利妥昔单抗单药。';

    if (score >= 3) {
      riskGroup = '高危组 (High Risk)';
      tenYearOs = '~36%';
      badgeType = 'danger';
      interp = 'FLIPI ≥ 3 分（高危）：10年总生存率仅约 ~36%。具有明显侵袭性不良预后，推荐首选强效免疫化疗（如 R-CHOP / BR 苯达莫司汀联合利妥昔单抗）诱导治疗，序贯利妥昔单抗维持治疗。';
    } else if (score === 2) {
      riskGroup = '中危组 (Intermediate Risk)';
      tenYearOs = '~51%';
      badgeType = 'warning';
      interp = 'FLIPI 2 分（中危）：10年总生存率约 ~51%。结合 GELF 肿瘤负荷标准与临床症状决定系统性免疫化疗或靶向维持。';
    }

    return {
      title: `FLIPI 预后: ${riskGroup}`,
      value: `${score} 分`,
      unit: `(${riskGroup.split(' ')[0]})`,
      badge: { text: riskGroup, type: badgeType },
      details: [
        { label: 'FLIPI 危险因素积分', value: `${score} / 5 分` },
        { label: '预后分层', value: riskGroup },
        { label: '预计 10 年总生存率 (OS)', value: tenYearOs },
      ],
      interpretation: interp,
    };
  },
};

export const rissCalculator: CalculatorDefinition = {
  id: 'r_iss_myeloma',
  title: 'R-ISS 多发性骨髓瘤修订版国际分期系统',
  abbreviation: 'R-ISS (MM)',
  category: 'staging',
  categoryName: '预后分期与评分',
  description: '整合经典 ISS 分期、高危细胞遗传学 (iFISH) 与血清 LDH，是多发性骨髓瘤 (MM) 国际金标准精准预后分期模型。',
  tags: ['R-ISS', 'ISS', '骨髓瘤', 'MM', '细胞遗传学', 'LDH', '微球蛋白', '白蛋白'],
  fields: [
    {
      id: 'iss_stage',
      label: '经典 ISS 分期 (基于 β2-MG 和 白蛋白)',
      type: 'select',
      defaultValue: 'I',
      options: [
        { label: 'ISS I 期 (β2-MG < 3.5 mg/L 且 白蛋白 ≥ 35 g/L)', value: 'I' },
        { label: 'ISS II 期 (介于 I 期与 III 期之间)', value: 'II' },
        { label: 'ISS III 期 (β2-MG ≥ 5.5 mg/L)', value: 'III' },
      ],
    },
    {
      id: 'cytogenetics',
      label: 'iFISH 高危细胞遗传学异常 [del(17p), t(4;14), t(14;16)]',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: '标危 (Standard Risk - 无上述高危异常)', value: 'standard' },
        { label: '高危 (High Risk - 具备 del(17p) / t(4;14) / t(14;16) 任意一项)', value: 'high' },
      ],
    },
    {
      id: 'ldh',
      label: '血清乳酸脱氢酶 (LDH)',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: '正常水平 (Normal ≤ ULN)', value: 'normal' },
        { label: '升高 (> 正常值上限 ULN)', value: 'high' },
      ],
    },
  ],
  formulaEquation: `\\text{R-ISS I} = \\text{ISS I} + \\text{标危FISH} + \\text{正常LDH}; \\quad \\text{R-ISS III} = \\text{ISS III} + [\\text{高危FISH} \\text{ 或 } \\text{高LDH}]; \\quad \\text{R-ISS II} = \\text{其余类型}`,
  formulaDescription: 'R-ISS I 期 (5年OS约82%)；R-ISS II 期 (5年OS约62%)；R-ISS III 期 (5年OS约40%)。',
  references: [
    'Palumbo A, et al. Revised International Staging System for Multiple Myeloma: A Report From International Myeloma Working Group. J Clin Oncol. 2015;33(26):2863-2869.',
  ],
  calculate: (inputs) => {
    const iss = inputs.iss_stage;
    const cyto = inputs.cytogenetics;
    const ldh = inputs.ldh;

    let rissStage = 'R-ISS II 期';
    let fiveYearOs = '62%';
    let fiveYearPfs = '36 个月';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'warning';
    let interp = 'R-ISS II 期（中危）：5 年总生存率约为 62%。推荐三药或四药联合诱导方案（如 VRd / Dara-VRd），后续序贯自体造血干细胞移植 (ASCT) 与维持治疗。';

    if (iss === 'I' && cyto === 'standard' && ldh === 'normal') {
      rissStage = 'R-ISS I 期 (低危)';
      fiveYearOs = '82%';
      fiveYearPfs = '55 个月';
      badgeType = 'success';
      interp = 'R-ISS I 期（低危组）：预后极佳！5 年总生存率高达 82%，中位无进展生存期 (PFS) 达 55 个月。常规新药联合诱导及维持治疗反应率极高。';
    } else if (iss === 'III' && (cyto === 'high' || ldh === 'high')) {
      rissStage = 'R-ISS III 期 (高危)';
      fiveYearOs = '40%';
      fiveYearPfs = '17 个月';
      badgeType = 'danger';
      interp = 'R-ISS III 期（高危组）：预后极具挑战！5 年总生存率仅约 40%，中位 PFS 仅 17 个月。指南强烈建议强化治疗：四药联合方案（如 CD38 单抗联合蛋白酶体抑制剂+免疫调节剂+地塞米松），考虑双次移植或尽早引入 BCMA CAR-T / 双抗靶向临床试验！';
    }

    return {
      title: `多发性骨髓瘤 ${rissStage}`,
      value: rissStage.split(' (')[0],
      unit: `(5年OS: ${fiveYearOs})`,
      badge: { text: rissStage, type: badgeType },
      details: [
        { label: 'R-ISS 分期', value: rissStage },
        { label: '预计 5 年总生存率 (OS)', value: fiveYearOs },
        { label: '中位无进展生存期 (PFS)', value: fiveYearPfs },
        { label: '基线条件', value: `ISS ${iss}期, ${cyto === 'high' ? '高危' : '标危'}FISH, LDH${ldh === 'high' ? '升高' : '正常'}` },
      ],
      interpretation: interp,
    };
  },
};

