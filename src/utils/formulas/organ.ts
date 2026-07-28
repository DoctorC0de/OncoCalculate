import { CalculatorDefinition } from '../../types/calculator';

export const albiCalculator: CalculatorDefinition = {
  id: 'albi',
  title: 'ALBI Grade 肝功能分级评分 (HCC 专用)',
  abbreviation: 'ALBI',
  category: 'organ',
  categoryName: '肝肾与器官功能',
  description: '无需主观指标，仅依据血清白蛋白和总胆红素客观评估肝细胞癌 (HCC) 患者的肝功能储备及预后。',
  tags: ['ALBI', 'HCC', '肝功能', '白蛋白', '胆红素', '肝癌', 'Child-Pugh'],
  fields: [
    {
      id: 'bilirubin',
      label: '总胆红素 (Total Bilirubin)',
      type: 'number',
      defaultValue: 25.6,
      defaultUnit: 'µmol/L (SI)',
      units: [
        { label: 'µmol/L (SI)', value: 'umol', toBaseMultiplier: 1 },
        { label: 'mg/dL', value: 'mgdL', toBaseMultiplier: 17.1 },
      ],
      min: 2,
      max: 1000,
      step: 0.1,
    },
    {
      id: 'albumin',
      label: '血清白蛋白 (Albumin)',
      type: 'number',
      defaultValue: 36,
      defaultUnit: 'g/L (SI)',
      units: [
        { label: 'g/L (SI)', value: 'gL', toBaseMultiplier: 1 },
        { label: 'g/dL', value: 'gdL', toBaseMultiplier: 10 },
      ],
      min: 10,
      max: 60,
      step: 0.5,
    },
  ],
  formulaEquation: `\\text{ALBI Score} = (\\log_{10} \\text{Bilirubin [\\mu mol/L]} \\times 0.66) + (\\text{Albumin [g/L]} \\times -0.085)`,
  formulaDescription: 'ALBI Grade 相比传统 Child-Pugh 评分摆脱了腹水和肝性脑病等主观打分指标的干扰，能够更精细地划分 Class A 患者。',
  references: [
    'Johnson PJ, et al. Assessment of liver function in patients with hepatocellular carcinoma: a new evidence-based approach-the ALBI grade. J Clin Oncol. 2015;33(6):550-558.',
  ],
  calculate: (inputs, units) => {
    let biliUmol = Number(inputs.bilirubin) || 0;
    if (units.bilirubin === 'mgdL') biliUmol = Number(inputs.bilirubin) * 17.1;

    let albGL = Number(inputs.albumin) || 0;
    if (units.albumin === 'gdL') albGL = Number(inputs.albumin) * 10;

    if (biliUmol <= 0 || albGL <= 0) {
      return { title: 'ALBI 评分', value: '--' };
    }

    const albiScore = Math.log10(biliUmol) * 0.66 + albGL * -0.085;

    let grade = 'Grade 1';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let interp = 'Grade 1 (分值 ≤ -2.60): 肝功能储备良好，系统治疗/靶向免疫/手术预后最佳。';

    if (albiScore > -1.39) {
      grade = 'Grade 3';
      badgeType = 'danger';
      interp = 'Grade 3 (分值 > -1.39): 肝功能严重受损，生存期较短，需慎重选择抗肿瘤治疗方案。';
    } else if (albiScore > -2.60) {
      grade = 'Grade 2';
      badgeType = 'warning';
      interp = 'Grade 2 (分值 -2.60 至 -1.39): 肝功能中度受损，需密切监测肝毒性。';
    }

    return {
      title: `ALBI 级别: ${grade}`,
      value: albiScore.toFixed(2),
      unit: '分',
      badge: { text: grade, type: badgeType },
      details: [
        { label: 'ALBI 计算分值', value: `${albiScore.toFixed(3)}` },
        { label: '总胆红素', value: `${biliUmol.toFixed(1)} µmol/L` },
        { label: '血清白蛋白', value: `${albGL.toFixed(1)} g/L` },
      ],
      interpretation: interp,
    };
  },
};

export const childPughCalculator: CalculatorDefinition = {
  id: 'child_pugh',
  title: 'Child-Pugh 肝硬化/肝功能分级',
  abbreviation: 'Child-Pugh',
  category: 'organ',
  categoryName: '肝肾与器官功能',
  description: '综合脑病、腹水、胆红素、白蛋白及凝血酶原时间 (PT/INR)，评估肝功能代偿状态。',
  tags: ['Child-Pugh', '肝功能', '肝硬化', '胆红素', '白蛋白', '凝血'],
  fields: [
    {
      id: 'encephalopathy',
      label: '肝性脑病程度',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '无脑病 (1 分)', value: '1' },
        { label: '1-2 期 (2 分)', value: '2' },
        { label: '3-4 期 (3 分)', value: '3' },
      ],
    },
    {
      id: 'ascites',
      label: '腹水情况',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '无腹水 (1 分)', value: '1' },
        { label: '少量/中量 (2 分)', value: '2' },
        { label: '大量/难治性 (3 分)', value: '3' },
      ],
    },
    {
      id: 'bilirubin',
      label: '总胆红素 (µmol/L)',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '< 34 µmol/L [< 2 mg/dL] (1 分)', value: '1' },
        { label: '34 - 51 µmol/L [2 - 3 mg/dL] (2 分)', value: '2' },
        { label: '> 51 µmol/L [> 3 mg/dL] (3 分)', value: '3' },
      ],
    },
    {
      id: 'albumin',
      label: '血清白蛋白 (g/L)',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '> 35 g/L (1 分)', value: '1' },
        { label: '28 - 35 g/L (2 分)', value: '2' },
        { label: '< 28 g/L (3 分)', value: '3' },
      ],
    },
    {
      id: 'inr',
      label: '凝血酶原时间 (INR)',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: 'INR < 1.7 (1 分)', value: '1' },
        { label: 'INR 1.7 - 2.3 (2 分)', value: '2' },
        { label: 'INR > 2.3 (3 分)', value: '3' },
      ],
    },
  ],
  formulaEquation: `\\text{Child-Pugh Points} = \\sum (\\text{Encephalopathy} + \\text{Ascites} + \\text{Bilirubin} + \\text{Albumin} + \\text{INR})`,
  formulaDescription: '5-6 分为 Class A (代偿良好)；7-9 分为 Class B (中度失代偿)；10-15 分为 Class C (重度失代偿)。',
  references: [
    'Pugh RN, et al. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649.',
  ],
  calculate: (inputs) => {
    const enc = Number(inputs.encephalopathy) || 1;
    const asc = Number(inputs.ascites) || 1;
    const bili = Number(inputs.bilirubin) || 1;
    const alb = Number(inputs.albumin) || 1;
    const inr = Number(inputs.inr) || 1;

    const score = enc + asc + bili + alb + inr;

    let cls = 'Class A (5-6 分)';
    let badgeType: 'success' | 'warning' | 'danger' | 'info' = 'success';
    let interp = '肝功能代偿良好，手术及靶向化疗耐受性佳。';

    if (score >= 10) {
      cls = 'Class C (10-15 分)';
      badgeType = 'danger';
      interp = '肝功能重度失代偿，化疗及手术禁忌，中位生存期极短。';
    } else if (score >= 7) {
      cls = 'Class B (7-9 分)';
      badgeType = 'warning';
      interp = '肝功能中度失代偿，抗肿瘤药物需慎重减量（如索拉非尼/仑伐替尼）。';
    }

    return {
      title: `Child-Pugh 分级: ${cls.split(' ')[0]} ${cls.split(' ')[1]}`,
      value: score,
      unit: '分',
      badge: { text: cls, type: badgeType },
      details: [
        { label: '总积分', value: `${score} 分` },
        { label: '脑病 / 腹水得分', value: `${enc} 分 / ${asc} 分` },
        { label: '胆红素 / 白蛋白 / INR得分', value: `${bili} 分 / ${alb} 分 / ${inr} 分` },
      ],
      interpretation: interp,
    };
  },
};
