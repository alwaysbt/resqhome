import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  FileText,
  Cpu,
  Globe2,
  CheckCircle2,
  ExternalLink,
  History,
  AlertCircle,
} from 'lucide-react';

interface SettingsViewProps {
  onOpenOnboarding: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenOnboarding }) => {
  const { language, setLanguage, t, resident, updateResident } = useApp();
  const isThai = language === 'th';

  const consents = resident.pdpaConsents;

  const handleToggleConsent = (key: keyof typeof consents) => {
    if (key === 'essentialAccepted') return; // Cannot toggle essential
    updateResident({
      pdpaConsents: {
        ...consents,
        [key]: !consents[key],
      },
    });
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Settings Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <h2 className="text-base font-bold text-slate-900">
          {isThai ? 'การตั้งค่าความเป็นส่วนตัวและเทคโนโลยี' : 'Privacy, PDPA & System Settings'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isThai
            ? 'ตรวจสอบสิทธิ์การยินยอมข้อมูลตาม PDPA และคำอธิบายระบบ'
            : 'Manage PDPA permissions, intellectual property notices, and sensor telemetry'}
        </p>

        {/* Re-open Onboarding Guide Button */}
        <button
          onClick={onOpenOnboarding}
          className="mt-3 w-full py-2.5 px-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
        >
          <FileText className="w-4 h-4" />
          <span>{isThai ? 'เปิดอ่านเอกสาร PDPA & ข้อกำหนดระบบฉบับเต็ม' : 'Review Full PDPA & Technology Disclosure Notice'}</span>
        </button>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Globe2 className="w-4 h-4 text-teal-600" />
          <span>{t.language} (Language Preference)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLanguage('th')}
            className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition ${
              language === 'th'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            ภาษาไทย (TH)
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`py-2.5 px-3 rounded-2xl border text-xs font-bold transition ${
              language === 'en'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            English (EN)
          </button>
        </div>
      </div>

      {/* Granular PDPA Consent Management */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>{isThai ? 'สิทธิ์การประมวลผลข้อมูล (PDPA Consents)' : 'PDPA Consents & Permissions'}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Updated: {consents.acceptedAt ? new Date(consents.acceptedAt).toLocaleDateString() : 'Active'}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {/* Essential */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 border border-teal-200">
            <div>
              <span className="font-bold text-teal-950 block">{t.consentEssential}</span>
              <span className="text-[10.5px] text-teal-800">
                {isThai ? 'จำเป็นสำหรับการกู้ชีพฉุกเฉิน (ไม่สามารถปิดได้)' : 'Mandatory Life-Safety Processing'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-200/60 px-2 py-0.5 rounded-md">
              Enforced
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 block">{t.consentLocation}</span>
              <span className="text-[10.5px] text-slate-500">
                {isThai ? 'แชร์ตำแหน่งพิกัดบีคอนในโถงทางเดิน' : 'Share corridor BLE beacon proximity'}
              </span>
            </div>
            <button
              onClick={() => handleToggleConsent('locationSharing')}
              className={`w-11 h-6 rounded-full transition p-0.5 ${
                consents.locationSharing ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition shadow-sm ${
                  consents.locationSharing ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 block">{t.consentNotifications}</span>
              <span className="text-[10.5px] text-slate-500">
                {isThai ? 'การแจ้งเตือนเสียงไซเรนฉุกเฉิน' : 'Emergency Push Broadcasts & Siren'}
              </span>
            </div>
            <button
              onClick={() => handleToggleConsent('pushNotifications')}
              className={`w-11 h-6 rounded-full transition p-0.5 ${
                consents.pushNotifications ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition shadow-sm ${
                  consents.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Health Telemetry */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 block">{t.consentWearable}</span>
              <span className="text-[10.5px] text-slate-500">
                {isThai ? 'รับส่งข้อมูลตรวจจับการล้มจากนาฬิกา' : 'Smartwatch Fall Impact & Battery Telemetry'}
              </span>
            </div>
            <button
              onClick={() => handleToggleConsent('healthTelemetry')}
              className={`w-11 h-6 rounded-full transition p-0.5 ${
                consents.healthTelemetry ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition shadow-sm ${
                  consents.healthTelemetry ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Condominium Safety System Specifications */}
      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>{isThai ? 'มาตรฐานอาคารและการคุ้มครองข้อมูล' : 'Building Compliance & Certifications'}</span>
        </div>
        <p className="leading-relaxed">
          {isThai
            ? 'ระบบจำลองการทำงานตามพระราชบัญญัติควบคุมอาคาร และพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) เพื่อเป็นระบบต้นแบบด้านความปลอดภัยในอาคารชุดพักอาศัย'
            : 'Simulated according to the Thai Building Control Act and Personal Data Protection Act B.E. 2562 (PDPA) for high-rise residential safety.'}
        </p>
      </div>
    </div>
  );
};
