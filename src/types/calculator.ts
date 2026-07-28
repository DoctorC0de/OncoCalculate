export type CategoryType = 
  | 'chemo'        // 化疗与剂量计算
  | 'hematology'   // 血液毒性与血钙
  | 'recist'       // 实体瘤疗效与生长动力学
  | 'organ'        // 肝肾与器官功能
  | 'risk'         // 感染与血栓风险
  | 'conversion'   // 药物与单位换算
  | 'staging';      // 预后分期与评分

export interface UnitOption {
  label: string;
  value: string;
  toBaseMultiplier?: number; // Multiply by this to convert input to base SI unit
  fromBaseMultiplier?: number; // Convert base SI unit back
  customConvertFromBase?: (val: number) => number;
  customConvertToBase?: (val: number) => number;
}

export interface OptionChoice {
  label: string;
  value: string | number;
  points?: number;
  description?: string;
}

export interface FieldDefinition {
  id: string;
  label: string;
  hint?: string;
  type: 'number' | 'select' | 'radio';
  defaultValue?: number | string;
  defaultUnit?: string;
  units?: UnitOption[];
  options?: OptionChoice[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface CalculationResult {
  title: string;
  value: string | number;
  unit?: string;
  badge?: {
    text: string;
    type: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  };
  details?: { label: string; value: string }[];
  interpretation?: string;
  recommendation?: string;
}

export interface CalculatorDefinition {
  id: string;
  title: string;
  abbreviation?: string;
  category: CategoryType;
  categoryName: string;
  description: string;
  tags: string[];
  fields: FieldDefinition[];
  calculate: (inputs: Record<string, any>, units: Record<string, string>) => CalculationResult;
  formulaEquation: string; // LaTeX or formatted string equation
  formulaDescription: string;
  references: string[];
}

export interface HistoryItem {
  id: string;
  calculatorId: string;
  calculatorTitle: string;
  timestamp: number;
  inputs: Record<string, any>;
  units: Record<string, string>;
  result: CalculationResult;
}
