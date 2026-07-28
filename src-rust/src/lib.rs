use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BsaResult {
    pub mosteller: f64,
    pub du_bois: f64,
    pub haycock: f64,
    pub gehan: f64,
    pub boyd: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalvertResult {
    pub dose_mg: f64,
    pub gfr_used: f64,
    pub is_capped: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GfrResult {
    pub crcl_ml_min: f64,
    pub ckdepi_egfr: f64,
    pub scr_mg_dl: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AncResult {
    pub anc_gi_l: f64,
    pub anc_ul: f64,
    pub ctcae_grade: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CorrectedCalciumResult {
    pub corr_ca_mmol: f64,
    pub corr_ca_mg_dl: f64,
    pub is_hypercalcemia: bool,
    pub is_severe: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecistResult {
    pub category: String, // CR, PR, SD, PD
    pub pct_change_baseline: f64,
    pub pct_change_nadir: f64,
    pub abs_change_nadir_mm: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AlbiResult {
    pub score: f64,
    pub grade: u8,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpioidResult {
    pub medd_mg: f64,
    pub reduced_medd_mg: f64,
    pub target_dose: f64,
}

/// Calculate Body Surface Area (BSA) using 5 classical formulas
pub fn calculate_bsa(height_cm: f64, weight_kg: f64) -> Option<BsaResult> {
    if height_cm <= 0.0 || weight_kg <= 0.0 {
        return None;
    }

    let mosteller = ((height_cm * weight_kg) / 3600.0).sqrt();
    let du_bois = 0.007184 * height_cm.powf(0.725) * weight_kg.powf(0.425);
    let haycock = 0.024265 * height_cm.powf(0.3964) * weight_kg.powf(0.5378);
    let gehan = 0.0235 * height_cm.powf(0.42246) * weight_kg.powf(0.51456);
    let boyd_wt_g = weight_kg * 1000.0;
    let boyd = 0.0003207 * height_cm.powf(0.3) * boyd_wt_g.powf(0.7285 - 0.0188 * boyd_wt_g.log10());

    Some(BsaResult {
        mosteller,
        du_bois,
        haycock,
        gehan,
        boyd,
    })
}

/// Calculate Carboplatin Dose using Calvert Formula
pub fn calculate_calvert(auc: f64, gfr: f64, cap_gfr: bool) -> Option<CalvertResult> {
    if auc <= 0.0 || gfr <= 0.0 {
        return None;
    }

    let mut gfr_used = gfr;
    let is_capped = cap_gfr && gfr > 125.0;
    if is_capped {
        gfr_used = 125.0;
    }

    let dose_mg = auc * (gfr_used + 25.0);

    Some(CalvertResult {
        dose_mg,
        gfr_used,
        is_capped,
    })
}

/// Calculate CrCl (Cockcroft-Gault) & eGFR (CKD-EPI 2021)
pub fn calculate_gfr(age: f64, weight_kg: f64, scr_umol: f64, is_female: bool) -> Option<GfrResult> {
    if age <= 0.0 || weight_kg <= 0.0 || scr_umol <= 0.0 {
        return None;
    }

    let scr_mg_dl = scr_umol / 88.4;
    let mut crcl = ((140.0 - age) * weight_kg) / (72.0 * scr_mg_dl);
    if is_female {
        crcl *= 0.85;
    }

    let kappa = if is_female { 0.7 } else { 0.9 };
    let alpha = if is_female { -0.241 } else { -0.302 };
    let min_ratio = (scr_mg_dl / kappa).min(1.0);
    let max_ratio = (scr_mg_dl / kappa).max(1.0);

    let mut ckdepi = 142.0 * min_ratio.powf(alpha) * max_ratio.powf(-1.2) * 0.9938f64.powf(age);
    if is_female {
        ckdepi *= 1.012;
    }

    Some(GfrResult {
        crcl_ml_min: crcl,
        ckdepi_egfr: ckdepi,
        scr_mg_dl,
    })
}

/// Calculate ANC & CTCAE Neutropenia Grade
pub fn calculate_anc(wbc_gi_l: f64, segs_pct: f64, bands_pct: f64) -> Option<AncResult> {
    if wbc_gi_l <= 0.0 {
        return None;
    }

    let anc_gi_l = (wbc_gi_l * (segs_pct + bands_pct)) / 100.0;
    let anc_ul = anc_gi_l * 1000.0;

    let ctcae_grade = if anc_gi_l < 0.5 {
        4
    } else if anc_gi_l < 1.0 {
        3
    } else if anc_gi_l < 1.5 {
        2
    } else if anc_gi_l < 2.0 {
        1
    } else {
        0
    };

    Some(AncResult {
        anc_gi_l,
        anc_ul,
        ctcae_grade,
    })
}

/// Calculate Corrected Calcium for hypoalbuminemia
pub fn calculate_corrected_calcium(ca_mmol: f64, alb_gl: f64) -> Option<CorrectedCalciumResult> {
    if ca_mmol <= 0.0 || alb_gl <= 0.0 {
        return None;
    }

    let corr_ca_mmol = ca_mmol + 0.02 * (40.0 - alb_gl);
    let corr_ca_mg_dl = corr_ca_mmol / 0.2495;

    Some(CorrectedCalciumResult {
        corr_ca_mmol,
        corr_ca_mg_dl,
        is_hypercalcemia: corr_ca_mmol > 2.55,
        is_severe: corr_ca_mmol >= 3.5,
    })
}

/// Evaluate RECIST 1.1 Criteria
pub fn calculate_recist(baseline_sld: f64, nadir_sld: f64, current_sld: f64, has_new_lesion: bool) -> Option<RecistResult> {
    if baseline_sld <= 0.0 {
        return None;
    }

    let pct_change_baseline = ((current_sld - baseline_sld) / baseline_sld) * 100.0;
    let pct_change_nadir = if nadir_sld > 0.0 {
        ((current_sld - nadir_sld) / nadir_sld) * 100.0
    } else {
        0.0
    };
    let abs_change_nadir_mm = current_sld - nadir_sld;

    let category = if has_new_lesion {
        "PD".to_string()
    } else if current_sld == 0.0 {
        "CR".to_string()
    } else if pct_change_baseline <= -30.0 {
        "PR".to_string()
    } else if pct_change_nadir >= 20.0 && abs_change_nadir_mm >= 5.0 {
        "PD".to_string()
    } else {
        "SD".to_string()
    };

    Some(RecistResult {
        category,
        pct_change_baseline,
        pct_change_nadir,
        abs_change_nadir_mm,
    })
}

/// Calculate ALBI Score & Grade for HCC
pub fn calculate_albi(bili_umol: f64, alb_gl: f64) -> Option<AlbiResult> {
    if bili_umol <= 0.0 || alb_gl <= 0.0 {
        return None;
    }

    let score = bili_umol.log10() * 0.66 + alb_gl * -0.085;
    let grade = if score <= -2.60 {
        1
    } else if score <= -1.39 {
        2
    } else {
        3
    };

    Some(AlbiResult { score, grade })
}

/// Calculate Opioid MEDD & Target Equivalent Dose
pub fn calculate_opioid_medd(source: &str, dose: f64, target: &str, reduction_pct: f64) -> Option<OpioidResult> {
    if dose <= 0.0 {
        return None;
    }

    let medd_mg = match source {
        "oral_morphine" => dose,
        "iv_morphine" => dose * 3.0,
        "oral_oxycodone" => dose * 1.5,
        "fentanyl_patch" => dose * 2.4,
        "oral_hydromorphone" => dose * 4.0,
        "iv_hydromorphone" => dose * 20.0,
        "oral_tramadol" => dose * 0.1,
        _ => dose,
    };

    let reduced_medd_mg = medd_mg * (1.0 - reduction_pct / 100.0);

    let target_dose = match target {
        "oral_morphine" => reduced_medd_mg,
        "iv_morphine" => reduced_medd_mg / 3.0,
        "oral_oxycodone" => reduced_medd_mg / 1.5,
        "fentanyl_patch" => reduced_medd_mg / 2.4,
        "oral_hydromorphone" => reduced_medd_mg / 4.0,
        "iv_hydromorphone" => reduced_medd_mg / 20.0,
        _ => reduced_medd_mg,
    };

    Some(OpioidResult {
        medd_mg,
        reduced_medd_mg,
        target_dose,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bsa() {
        let res = calculate_bsa(170.0, 65.0).unwrap();
        assert!((res.mosteller - 1.7516).abs() < 0.01);
    }

    #[test]
    fn test_calvert_cap() {
        let res = calculate_calvert(5.0, 140.0, true).unwrap();
        assert_eq!(res.gfr_used, 125.0);
        assert_eq!(res.dose_mg, 750.0);
    }

    #[test]
    fn test_recist_pr() {
        let res = calculate_recist(50.0, 50.0, 30.0, false).unwrap();
        assert_eq!(res.category, "PR");
    }
}
