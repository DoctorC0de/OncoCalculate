import { CalculatorDefinition, CategoryType } from '../../types/calculator';
import { bsaCalculator, calvertCalculator, gfrCalculator, ibwCalculator } from './chemo';
import { ancCalculator, correctedCalciumCalculator } from './hematology';
import { recistCalculator, doublingTimeCalculator } from './recist';
import { albiCalculator, childPughCalculator, meldCalculator } from './organ';
import { khoranaCalculator, masccCalculator, cisneCalculator } from './riskScores';
import { opioidCalculator, steroidCalculator } from './conversions';
import { ipiCalculator, imdcCalculator, flipiCalculator, rissCalculator } from './staging';
import { ecogKpsCalculator } from './performance';

export const allCalculators: CalculatorDefinition[] = [
  bsaCalculator,
  calvertCalculator,
  gfrCalculator,
  ibwCalculator,
  ancCalculator,
  correctedCalciumCalculator,
  recistCalculator,
  doublingTimeCalculator,
  albiCalculator,
  childPughCalculator,
  meldCalculator,
  khoranaCalculator,
  masccCalculator,
  cisneCalculator,
  opioidCalculator,
  steroidCalculator,
  ecogKpsCalculator,
  ipiCalculator,
  flipiCalculator,
  rissCalculator,
  imdcCalculator,
];

export const categoryLabels: Record<CategoryType | 'all', string> = {
  all: '全部公式',
  chemo: '化疗与剂量',
  hematology: '血液毒性与血钙',
  recist: '实体瘤疗效评价',
  organ: '肝肾与器官功能',
  risk: '风险与感染',
  conversion: '药物与单位换算',
  staging: '预后分期与评分',
};
