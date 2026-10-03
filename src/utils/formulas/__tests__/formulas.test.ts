import { describe, it, expect } from 'vitest';
import { bsaCalculator, calvertCalculator, gfrCalculator, ibwCalculator } from '../chemo';
import { ancCalculator, correctedCalciumCalculator } from '../hematology';
import { recistCalculator } from '../recist';
import { albiCalculator, meldCalculator } from '../organ';
import { khoranaCalculator, cisneCalculator } from '../riskScores';
import { opioidCalculator } from '../conversions';
import { ecogKpsCalculator } from '../performance';
import { flipiCalculator, rissCalculator } from '../staging';

describe('OncoCalculate Formulas Unit Tests', () => {
  it('BSA Mosteller formula calculates correctly', () => {
    // Height: 170 cm, Weight: 65 kg -> sqrt(170 * 65 / 3600) = sqrt(3.06944) = 1.752 m²
    const res = bsaCalculator.calculate({ height: 170, weight: 65 }, { height: 'cm', weight: 'kg' });
    expect(res.value).toBe('1.75');
    expect(res.unit).toBe('m²');
  });

  it('Calvert formula caps GFR at 125 mL/min when selected', () => {
    // Target AUC: 5, GFR: 140 -> Capped at 125 -> Dose = 5 * (125 + 25) = 750 mg
    const resCapped = calvertCalculator.calculate({ targetAuc: 5, gfr: 140, capGfr: 'yes' }, {});
    expect(resCapped.value).toBe(750);

    // Uncapped -> Dose = 5 * (140 + 25) = 825 mg
    const resUncapped = calvertCalculator.calculate({ targetAuc: 5, gfr: 140, capGfr: 'no' }, {});
    expect(resUncapped.value).toBe(825);
  });

  it('Cockcroft-Gault GFR calculates correctly with SI unit (umol/L)', () => {
    // Male 60yo, 65kg, SCr = 79.6 umol/L (~0.9 mg/dL)
    const res = gfrCalculator.calculate(
      { gender: 'male', age: 60, weight: 65, scr: 79.6 },
      { weight: 'kg', scr: 'umol' }
    );
    expect(Number(res.value)).toBeGreaterThan(75);
    expect(Number(res.value)).toBeLessThan(85);
  });

  it('ANC calculates CTCAE Grade 4 when < 0.5', () => {
    // WBC 1.0 * 10^9/L, Segs 20%, Bands 10% -> ANC = 1.0 * 0.30 = 0.30 * 10^9/L
    const res = ancCalculator.calculate({ wbc: 1.0, segs: 20, bands: 10 }, { wbc: 'giL' });
    expect(res.value).toBe('0.30');
    expect(res.badge?.text).toContain('4 级');
  });

  it('Corrected Calcium adjusts for low albumin in SI units', () => {
    // Total Ca = 2.0 mmol/L, Albumin = 25 g/L -> Corr Ca = 2.0 + 0.02 * (40 - 25) = 2.30 mmol/L
    const res = correctedCalciumCalculator.calculate({ calcium: 2.0, albumin: 25 }, { calcium: 'mmol', albumin: 'gL' });
    expect(res.value).toBe('2.30');
    expect(res.badge?.text).toContain('正常血钙');
  });

  it('RECIST 1.1 determines PR when reduction >= 30%', () => {
    const res = recistCalculator.calculate({ baselineSld: 50, nadirSld: 50, currentSld: 30, hasNewLesion: 'no' }, {});
    expect(res.value).toBe('PR');
  });

  it('ALBI score calculates grade correctly', () => {
    const res = albiCalculator.calculate({ bilirubin: 20, albumin: 40 }, { bilirubin: 'umol', albumin: 'gL' });
    expect(res.badge?.text).toBe('Grade 2');
  });

  it('Opioid MEDD converts oral oxycodone to oral morphine with 25% reduction', () => {
    const res = opioidCalculator.calculate(
      { sourceDrug: 'oral_oxycodone', sourceDose: 40, targetDrug: 'oral_morphine', crossReduction: '25' },
      {}
    );
    expect(res.value).toBe('45.0');
  });

  it('IBW & AdjBW calculates Devine formula and detects overweight', () => {
    // Male 170cm, 80kg -> IBW = 50 + 0.9055*(170-152.4) = 65.9kg -> Overweight > 1.2*IBW
    const res = ibwCalculator.calculate({ gender: 'male', height: 170, weight: 80 }, { height: 'cm', weight: 'kg' });
    expect(Number(res.value)).toBeGreaterThan(65);
    expect(res.badge?.text).toContain('超重');

    // 95kg -> Obese
    const resObese = ibwCalculator.calculate({ gender: 'male', height: 170, weight: 95 }, { height: 'cm', weight: 'kg' });
    expect(resObese.badge?.text).toContain('肥胖');
  });

  it('MELD-Na calculates correct score range', () => {
    const res = meldCalculator.calculate(
      { bilirubin: 25.6, inr: 1.2, creatinine: 80, sodium: 135, dialysis: 'no' },
      { bilirubin: 'umol', creatinine: 'umol' }
    );
    expect(Number(res.value)).toBeGreaterThanOrEqual(6);
    expect(Number(res.value)).toBeLessThanOrEqual(40);
  });

  it('CISNE score stratifies low risk vs high risk', () => {
    const low = cisneCalculator.calculate(
      { ecog: '0', hyperglycemia: '0', copd: '0', cardio: '0', mucositis: '0', monocytes: '0' },
      {}
    );
    expect(low.value).toBe(0);
    expect(low.badge?.text).toContain('低危');

    const high = cisneCalculator.calculate(
      { ecog: '2', hyperglycemia: '2', copd: '1', cardio: '0', mucositis: '0', monocytes: '0' },
      {}
    );
    expect(high.value).toBe(5);
    expect(high.badge?.text).toContain('高危');
  });

  it('ECOG vs KPS maps correctly', () => {
    const res = ecogKpsCalculator.calculate({ ecog_score: '1', treatment_intent: 'systemic_chemo' }, {});
    expect(res.value).toBe('ECOG 1');
    expect(res.unit).toContain('KPS 80 - 70%');
  });

  it('FLIPI score calculates risk group', () => {
    const res = flipiCalculator.calculate(
      { age: '1', stage: '1', hgb: '1', nodal: '0', ldh: '0' },
      {}
    );
    expect(res.value).toBe('3 分');
    expect(res.badge?.text).toContain('高危组');
  });

  it('R-ISS stages multiple myeloma correctly', () => {
    const stage1 = rissCalculator.calculate(
      { iss_stage: 'I', cytogenetics: 'standard', ldh: 'normal' },
      {}
    );
    expect(stage1.value).toContain('R-ISS I');
  });
});
