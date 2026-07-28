import { describe, it, expect } from 'vitest';
import { bsaCalculator, calvertCalculator, gfrCalculator } from '../chemo';
import { ancCalculator, correctedCalciumCalculator } from '../hematology';
import { recistCalculator } from '../recist';
import { albiCalculator } from '../organ';
import { khoranaCalculator } from '../riskScores';
import { opioidCalculator } from '../conversions';

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
    // CrCl = (140-60)*65 / (72 * 0.9) = 5200 / 64.8 = 80.2 mL/min
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
    // Baseline: 50mm, Current: 30mm -> -40% -> PR
    const res = recistCalculator.calculate({ baselineSld: 50, nadirSld: 50, currentSld: 30, hasNewLesion: 'no' }, {});
    expect(res.value).toBe('PR');
  });

  it('ALBI score calculates grade correctly', () => {
    // Bili 20 umol/L, Alb 40 g/L -> log10(20)*0.66 + 40*-0.085 = 1.301*0.66 - 3.40 = 0.858 - 3.40 = -2.54 -> Grade 2
    const res = albiCalculator.calculate({ bilirubin: 20, albumin: 40 }, { bilirubin: 'umol', albumin: 'gL' });
    expect(res.badge?.text).toBe('Grade 2');
  });

  it('Opioid MEDD converts oral oxycodone to oral morphine with 25% reduction', () => {
    // 40mg Oxycodone / day -> MEDD = 40 * 1.5 = 60mg Morphine. Reduced by 25% -> 45mg Morphine target.
    const res = opioidCalculator.calculate(
      { sourceDrug: 'oral_oxycodone', sourceDose: 40, targetDrug: 'oral_morphine', crossReduction: '25' },
      {}
    );
    expect(res.value).toBe('45.0');
  });
});
