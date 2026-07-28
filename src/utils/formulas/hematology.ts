import { CalculatorDefinition } from '../../types/calculator';

export const ancCalculator: CalculatorDefinition = {
  id: 'anc',
  title: '中性粒细胞绝对计数 (ANC) & CTCAE 毒性分级',
  abbreviation: 'ANC',
  category: 'hematology',
  categoryName: '血液毒性与血钙',
  description: '根据白细胞计数 (WBC) 及杆状核/分叶核中性粒细胞百分比计算 ANC，自动给出 NCI-CTCAE v5.0 中性粒细胞减少分级。',
  tags: ['ANC', 'WBC', '中性粒细胞', 'CTCAE', '骨髓抑制', '化疗安全'],
  fields: [
    {
      id: 'wbc',
      label: '白细胞计数 (WBC)',
      type: 'number',
      defaultValue: 4.5,
      defaultUnit: '× 10⁹/L (SI)',
      units: [
        { label: '× 10⁹/L (SI)', value: 'giL', toBaseMultiplier: 1 },
        { label: '/µL', value: 'ul', toBaseMultiplier: 0.001 },
      ],
      min: 0.1,
      max: 100,
      step: 0.1,
    },
    {
      id: 'segs',
      label: '分叶核中性粒细胞 (Segs)',
      type: 'number',
      defaultValue: 55,
      defaultUnit: '%',
      min: 0,
      max: 100,
      step: 1,
    },
    {
      id: 'bands',
      label: '杆状核中性粒细胞 (Bands)',
      type: 'number',
      defaultValue: 5,
      defaultUnit: '%',
      min: 0,
      max: 100,
      step: 1,
    },
  ],
  formulaEquation: `\\text{ANC (\\times 10}^9\\text{/L)} = \\text{WBC (\\times 10}^9\\text{/L)} \\times \\frac{\\% \\text{Segs} + \\% \\text{Bands}}{100}`,
  formulaDescription: 'ANC 是化疗前评估患者骨髓毒性及是否可安全行下一周期化疗的最核心指标（通常要求 ANC ≥ 1.5 × 10⁹/L）。',
  references: [
    'National Cancer Institute. Common Terminology Criteria for Adverse Events (CTCAE) v5.0. 2017.',
  ],
  calculate: (inputs, units) => {
    let wbc = Number(inputs.wbc) || 0;
    if (units.wbc === 'ul') wbc *= 0.001;

    const segs = Number(inputs.segs) || 0;
    const bands = Number(inputs.bands) || 0;

    const anc = (wbc * (segs + bands)) / 100;
    const ancUl = Math.round(anc * 1000);

    let ctcaeGrade = '正常 (Grade 0)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let recommendation = 'ANC 处于正常范围，可按计划行化疗给药。';

    if (anc < 0.5) {
      ctcaeGrade = '4 级严重减少 (< 0.5 × 10⁹/L)';
      badgeType = 'danger';
      recommendation = '极高感染风险！需暂停化疗，建议应用 G-CSF (升白针) 并警惕中性粒细胞减少伴发热 (FN)。';
    } else if (anc < 1.0) {
      ctcaeGrade = '3 级重度减少 (0.5 - 0.99 × 10⁹/L)';
      badgeType = 'danger';
      recommendation = '显著骨髓抑制，建议暂停化疗并予以 G-CSF 支持治疗。';
    } else if (anc < 1.5) {
      ctcaeGrade = '2 级中度减少 (1.0 - 1.49 × 10⁹/L)';
      badgeType = 'warning';
      recommendation = '低于常规化疗安全门槛 (1.5 × 10⁹/L)，建议延迟化疗或酌情减量。';
    } else if (anc < 2.0) {
      ctcaeGrade = '1 级轻度减少 (1.5 - 1.99 × 10⁹/L)';
      badgeType = 'info';
      recommendation = '符合化疗给药标准，密切监测血常规变化。';
    }

    return {
      title: '绝对中性粒细胞计数 (ANC)',
      value: anc.toFixed(2),
      unit: '× 10⁹/L',
      badge: { text: ctcaeGrade, type: badgeType },
      details: [
        { label: 'ANC (SI国际单位)', value: `${anc.toFixed(2)} × 10⁹/L` },
        { label: 'ANC (绝对值)', value: `${ancUl} /µL` },
        { label: '中性粒细胞百分比和', value: `${(segs + bands).toFixed(1)} %` },
      ],
      interpretation: recommendation,
    };
  },
};

export const correctedCalciumCalculator: CalculatorDefinition = {
  id: 'corrected_calcium',
  title: '纠正血清钙 (Corrected Calcium) 计算器',
  abbreviation: 'Corr. Ca',
  category: 'hematology',
  categoryName: '血液毒性与血钙',
  description: '当肿瘤患者合并低白蛋白血症时，纠正总血钙测定值，准确诊断肿瘤相关高钙血症或低钙血症。',
  tags: ['高钙血症', '血钙纠正', '白蛋白', '肿瘤急症', '骨转移'],
  fields: [
    {
      id: 'calcium',
      label: '测定总血钙 (Total Ca)',
      type: 'number',
      defaultValue: 2.2,
      defaultUnit: 'mmol/L (SI)',
      units: [
        { label: 'mmol/L (SI)', value: 'mmol', toBaseMultiplier: 1 },
        { label: 'mg/dL', value: 'mgdL', toBaseMultiplier: 0.2495 },
      ],
      min: 1.0,
      max: 5.0,
      step: 0.05,
    },
    {
      id: 'albumin',
      label: '血清白蛋白 (Albumin)',
      type: 'number',
      defaultValue: 32,
      defaultUnit: 'g/L (SI)',
      units: [
        { label: 'g/L (SI)', value: 'gL', toBaseMultiplier: 1 },
        { label: 'g/dL', value: 'gdL', toBaseMultiplier: 10 },
      ],
      min: 10,
      max: 60,
      step: 1,
    },
  ],
  formulaEquation: `\\text{Corr. Ca (mmol/L)} = \\text{Measured Ca (mmol/L)} + 0.02 \\times (40 - \\text{Albumin [g/L]})`,
  formulaDescription: '血清中约 40-45% 的钙与白蛋白结合。肿瘤患者发生低白蛋白血症时，总血钙测定值会假性偏低，必须计算纠正钙。',
  references: [
    'Payne RB, et al. Interpretation of serum calcium in patients with abnormal serum proteins. BMJ. 1973;4(5893):643-646.',
  ],
  calculate: (inputs, units) => {
    let caMmol = Number(inputs.calcium) || 0;
    if (units.calcium === 'mgdL') caMmol = Number(inputs.calcium) * 0.2495;

    let albGL = Number(inputs.albumin) || 0;
    if (units.albumin === 'gdL') albGL = Number(inputs.albumin) * 10;

    if (caMmol <= 0 || albGL <= 0) {
      return { title: '纠正血钙', value: '--', unit: 'mmol/L' };
    }

    // Calculation in mmol/L
    const corrCaMmol = caMmol + 0.02 * (40 - albGL);
    const corrCaMgDl = corrCaMmol / 0.2495;

    let status = '正常血钙 (2.15 - 2.55 mmol/L)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let interp = '纠正血钙在正常范围内。';

    if (corrCaMmol > 3.5) {
      status = '重度高钙血症 (≥ 3.5 mmol/L) - 肿瘤急症';
      badgeType = 'danger';
      interp = '肿瘤相关高钙血症危象！需立即静脉水化、给以双膦酸盐（择泰）或地诺单抗（Denosumab）降钙处理！';
    } else if (corrCaMmol > 3.0) {
      status = '中度高钙血症 (3.0 - 3.49 mmol/L)';
      badgeType = 'danger';
      interp = '显著高钙血症，提示可能存在骨转移或PTHrp过度分泌，需积极降钙水化。';
    } else if (corrCaMmol > 2.55) {
      status = '轻度高钙血症 (2.56 - 2.99 mmol/L)';
      badgeType = 'warning';
      interp = '轻度高钙血症，需密切监测并进行水化治疗。';
    } else if (corrCaMmol < 2.15) {
      status = '低钙血症 (< 2.15 mmol/L)';
      badgeType = 'info';
      interp = '纠正血钙偏低，注意观察手足抽搐、QT延长，必要时补充钙剂及维D。';
    }

    return {
      title: '纠正后血钙浓度',
      value: corrCaMmol.toFixed(2),
      unit: 'mmol/L',
      badge: { text: status, type: badgeType },
      details: [
        { label: '纠正血钙 (SI国际单位)', value: `${corrCaMmol.toFixed(2)} mmol/L` },
        { label: '纠正血钙 (常规单位)', value: `${corrCaMgDl.toFixed(2)} mg/dL` },
        { label: '未纠正实测血钙', value: `${caMmol.toFixed(2)} mmol/L` },
        { label: '白蛋白水平', value: `${albGL.toFixed(1)} g/L` },
      ],
      interpretation: interp,
    };
  },
};
