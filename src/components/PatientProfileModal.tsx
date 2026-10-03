import React, { useState } from 'react';
import { PatientProfile } from '../types/calculator';
import { X, UserCheck, RotateCcw, Check, Sparkles } from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PatientProfile;
  onSaveProfile: (profile: PatientProfile) => void;
  onClearProfile: () => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onClearProfile,
}) => {
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender || 'male');
  const [age, setAge] = useState<string>(profile.age !== undefined ? String(profile.age) : '60');
  const [heightCm, setHeightCm] = useState<string>(profile.heightCm !== undefined ? String(profile.heightCm) : '170');
  const [weightKg, setWeightKg] = useState<string>(profile.weightKg !== undefined ? String(profile.weightKg) : '65');
  const [scrUmol, setScrUmol] = useState<string>(profile.scrUmol !== undefined ? String(profile.scrUmol) : '79.6');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile({
      gender,
      age: age ? Number(age) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
      scrUmol: scrUmol ? Number(scrUmol) : undefined,
      isConfigured: true,
    });
    onClose();
  };

  const handleClear = () => {
    onClearProfile();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full sm:max-w-md bg-surface dark:bg-surface-dim border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-white flex items-center gap-1.5">
                当前患者临床档案
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400">一键联动</span>
              </h2>
              <p className="text-[11px] text-slate-400">设置后各大计算器自动预填，避免重复录入</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-3.5">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-slate-200">患者生理性别</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                  gender === 'male'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-sm'
                    : 'bg-surface-container border-white/10 text-slate-400'
                }`}
              >
                男 (Male)
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                  gender === 'female'
                    ? 'bg-pink-500/20 border-pink-500 text-pink-300 shadow-sm'
                    : 'bg-surface-container border-white/10 text-slate-400'
                }`}
              >
                女 (Female)
              </button>
            </div>
          </div>

          {/* Age & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-200">年龄 (岁)</label>
              <input
                type="number"
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="例如 62"
                className="m3-input font-mono !py-2.5 text-center text-base"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-200">身高 (cm)</label>
              <input
                type="number"
                inputMode="decimal"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="例如 170"
                className="m3-input font-mono !py-2.5 text-center text-base"
              />
            </div>
          </div>

          {/* Weight & Creatinine */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-200">体重 (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="例如 65"
                className="m3-input font-mono !py-2.5 text-center text-base"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-slate-200">血肌酐 (µmol/L)</label>
              <input
                type="number"
                inputMode="decimal"
                value={scrUmol}
                onChange={(e) => setScrUmol(e.target.value)}
                placeholder="例如 79.6"
                className="m3-input font-mono !py-2.5 text-center text-base"
              />
            </div>
          </div>

          {/* Hint Card */}
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-start gap-2.5 text-[12px] text-sky-200">
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              保存后，打开体表面积 (BSA)、卡铂 (Calvert)、肌酐清除率 (GFR)、校正体重 (IBW) 等公式均会默认带入当前参数，并允许随时个别微调。
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          {profile.isConfigured && (
            <button
              type="button"
              onClick={handleClear}
              className="py-3 px-4 rounded-xl text-[13px] font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              清空
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all"
          >
            <Check className="w-4 h-4" />
            保存并全局联动
          </button>
        </div>
      </div>
    </div>
  );
};
