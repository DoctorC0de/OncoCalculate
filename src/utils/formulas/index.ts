import { CalculatorDefinition, CategoryType } from '../../types/calculator';
import { bsaCalculator, calvertCalculator, gfrCalculator } from './chemo';
import { ancCalculator, correctedCalciumCalculator } from './hematology';
import { recistCalculator, doublingTimeCalculator } from './recist';
import { albiCalculator, childPughCalculator } from './organ';
import { khoranaCalculator, masccCalculator } from './riskScores';
import { opioidCalculator, steroidCalculator } from './conversions';
import { ipiCalculator, imdcCalculator } from './staging';

export const allCalculators: CalculatorDefinition[] = [
  bsaCalculator,
  calvertCalculator,
  gfrCalculator,
  ancCalculator,
  correctedCalciumCalculator,
  recistCalculator,
  doublingTimeCalculator,
  albiCalculator,
  childPughCalculator,
  khoranaCalculator,
  masccCalculator,
  opioidCalculator,
  steroidCalculator,
  ipiCalculator,
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
