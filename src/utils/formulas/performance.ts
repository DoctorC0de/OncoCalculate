import { CalculatorDefinition } from '../../types/calculator';

export const ecogKpsCalculator: CalculatorDefinition = {
  id: 'ecog_kps',
  title: 'ECOG 与 Karnofsky (KPS) 体能状态评分对照',
  abbreviation: 'ECOG / KPS',
  category: 'staging',
  categoryName: '预后分期与评分',
  description: '国际肿瘤学标准体能状态（PS）双向评定系统，评估肿瘤患者日常活动能力、化疗耐受性门槛及预后。',
  tags: ['ECOG', 'KPS', 'Karnofsky', '体能状态', '化疗耐受', 'PS评分'],
  fields: [
    {
      id: 'ecog_score',
      label: 'ECOG 评分标准（日常活动与卧床能力）',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '0 级 - 活动能力完全正常，能耐受所有发病前日常活动 (KPS 100-90%)', value: '0' },
        { label: '1 级 - 能自由走动及从事轻体力活动，不能从事重体力劳动 (KPS 80-70%)', value: '1' },
        { label: '2 级 - 能生活自理，能自主活动，但丧失工作能力，日间卧床时间 < 50% (KPS 60-50%)', value: '2' },
        { label: '3 级 - 生活仅能部分自理，日间卧床或坐轮椅时间 > 50% (KPS 40-30%)', value: '3' },
        { label: '4 级 - 完全卧床，生活完全不能自理，病情严重 (KPS 20-10%)', value: '4' },
      ],
    },
    {
      id: 'treatment_intent',
      label: '拟定抗肿瘤治疗方案意向',
      type: 'select',
      defaultValue: 'systemic_chemo',
      options: [
        { label: '高强度联合化疗 / 方案 (如含铂双药/三药)', value: 'high_chemo' },
        { label: '标准系统化疗 / 免疫联合治疗', value: 'systemic_chemo' },
        { label: '单药化疗 / 口服靶向 / 姑息治疗', value: 'palliative' },
      ],
    },
  ],
  formulaEquation: `\\text{ECOG 0-1} \\leftrightarrow \\text{KPS 80-100\\% (标准化疗适宜)}; \\quad \\text{ECOG 2} \\leftrightarrow \\text{KPS 60-70\\% (需减量或慎重)}; \\quad \\text{ECOG 3-4} \\leftrightarrow \\text{KPS <60\\% (建议BSC)}`,
  formulaDescription: 'ECOG (Eastern Cooperative Oncology Group) 评分与 Karnofsky Performance Scale (KPS) 评分是所有恶性肿瘤临床试验入组标准与化疗处方前必评的体能指标。',
  references: [
    'Oken MM, et al. Toxicity and response criteria of the Eastern Cooperative Oncology Group. Am J Clin Oncol. 1982;5(6):649-655.',
    'Karnofsky DA, Burchenal JH. The Clinical Evaluation of Chemotherapeutic Agents in Cancer. Columbia University Press, 1949:191-205.',
  ],
  calculate: (inputs) => {
    const score = Number(inputs.ecog_score) || 0;
    const intent = inputs.treatment_intent;

    let kpsRange = '100 - 90%';
    let statusText = '活动能力完全正常 (ECOG 0)';
    let badgeText = '体能良好 (适宜标准化疗)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let recommendation = '患者体能极佳，可耐受全剂量强效联合化疗，满足绝大多数临床试验入组标准。';

    if (score === 1) {
      kpsRange = '80 - 70%';
      statusText = '能走动，轻体力劳动正常 (ECOG 1)';
      badgeText = '体能良好 (满足常规化疗)';
      badgeType = 'success';
      recommendation = '体能状态良好，可耐受常规系统性化疗与免疫靶向联合治疗。';
    } else if (score === 2) {
      kpsRange = '60 - 50%';
      statusText = '生活自理，日间卧床 < 50% (ECOG 2)';
      badgeText = '体能边缘 (谨慎评估化疗)';
      badgeType = 'warning';
      recommendation = '化疗耐受性减低！强效联合化疗骨髓抑制及感染风险显著增加。临床指南建议：优先考虑单药化疗、低剂量滴定、靶向/免疫单药或考虑局部姑息治疗。';
    } else if (score === 3) {
      kpsRange = '40 - 30%';
      statusText = '生活部分自理，日间卧床 > 50% (ECOG 3)';
      badgeText = '体能极差 (化疗高危禁忌)';
      badgeType = 'danger';
      recommendation = '抗肿瘤药物毒性常大于获益！常规系统化疗通常属于禁忌，强烈建议以最佳支持治疗 (BSC)、癌痛控制、营养支持及姑息放疗为主。';
    } else if (score === 4) {
      kpsRange = '20 - 10%';
      statusText = '完全卧床，生活完全不能自理 (ECOG 4)';
      badgeText = '终末期/危重状态';
      badgeType = 'danger';
      recommendation = '绝对禁止系统性抗肿瘤化疗，全力予以安宁疗护与症状控制 (BSC)。';
    }

    if (score >= 2 && intent === 'high_chemo') {
      recommendation += ' 【警示：当前体能状态行高强度联合化疗可能带来致死性毒性，强烈建议降低治疗强度！】';
    }

    return {
      title: `ECOG ${score} 级 · 对应 KPS ${kpsRange}`,
      value: `ECOG ${score}`,
      unit: `(KPS ${kpsRange})`,
      badge: { text: badgeText, type: badgeType },
      details: [
        { label: 'ECOG 评分', value: `${score} 级` },
        { label: '对应 Karnofsky (KPS)', value: kpsRange },
        { label: '功能状态描述', value: statusText },
        { label: '拟定方案考量', value: intent === 'high_chemo' ? '强效联合化疗' : intent === 'systemic_chemo' ? '标准系统化疗' : '姑息/单药治疗' },
      ],
      interpretation: recommendation,
    };
  },
};
