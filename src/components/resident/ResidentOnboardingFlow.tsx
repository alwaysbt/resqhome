import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssistanceCategory, Resident } from '../../types';
import {
  ShieldCheck,
  Lock,
  User,
  Heart,
  Phone,
  Watch,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  Activity,
  CheckCircle2,
  UserPlus,
  FileText,
  AlertTriangle,
  ChevronLeft,
} from 'lucide-react';

interface ResidentOnboardingFlowProps {
  onComplete: () => void;
  onCancel?: () => void;
  initialStep?: 'signup' | 'pdpa' | 'profiling';
}

export const ResidentOnboardingFlow: React.FC<ResidentOnboardingFlowProps> = ({
  onComplete,
  onCancel,
  initialStep = 'signup',
}) => {
  const { language, t, resident, updateResident } = useApp();
  const isThai = language === 'th';

  const [step, setStep] = useState<'signup' | 'pdpa' | 'profiling'>(initialStep);

  // Form State: Sign Up (Starts blank so user fills in by themselves)
  const [signupData, setSignupData] = useState({
    nameTh: '',
    nameEn: '',
    unit: '',
    tower: 'A',
    floor: 12,
    phone: '',
    pin: '',
  });

  // Form State: PDPA Consents
  const [pdpaAgreed, setPdpaAgreed] = useState(true);
  const [consents, setConsents] = useState({
    essentialAccepted: true,
    locationSharing: true,
    pushNotifications: true,
    healthTelemetry: true,
  });

  // Form State: Profiling Personal Information (Starts blank for user to fill in)
  const [profileData, setProfileData] = useState<{
    name: string;
    nameTh: string;
    nickname: string;
    birthDate: string;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    bloodType: string;
    assistanceCategory: AssistanceCategory;
    conditions: string;
    allergies: string;
    medications: string;
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactPhone: string;
    hasWearable: boolean;
    wearableModel: string;
  }>({
    name: '',
    nameTh: '',
    nickname: '',
    birthDate: '',
    gender: 'male',
    bloodType: 'O Positive (O+)',
    assistanceCategory: 'standard',
    conditions: '',
    allergies: '',
    medications: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    hasWearable: false,
    wearableModel: 'None',
  });

  // Sync signup data into profile and proceed to PDPA
  const handleProceedToPdpa = () => {
    setProfileData((prev) => ({
      ...prev,
      name: signupData.nameEn || prev.name,
      nameTh: signupData.nameTh || prev.nameTh,
      nickname: prev.nickname || (signupData.nameTh ? signupData.nameTh.split(' ')[0] : ''),
    }));
    setStep('pdpa');
  };

  // Complete and save profile
  const handleCompleteProfiling = () => {
    const updatedResident: Partial<Resident> = {
      name: profileData.name || signupData.nameEn,
      nameTh: profileData.nameTh || signupData.nameTh,
      unit: signupData.unit,
      floor: Number(signupData.floor) || 12,
      tower: signupData.tower,
      phone: signupData.phone,
      birthDate: profileData.birthDate,
      gender: profileData.gender,
      assistanceCategory: profileData.assistanceCategory,
      medicalInfo: {
        ...resident.medicalInfo,
        bloodType: profileData.bloodType,
        conditions: profileData.conditions,
        allergies: profileData.allergies,
        medications: profileData.medications,
        wheelchairUser: profileData.assistanceCategory === 'wheelchair',
        mobilityLimitations:
          profileData.assistanceCategory === 'wheelchair'
            ? 'Wheelchair Required'
            : profileData.assistanceCategory === 'elderly'
            ? 'Elderly / Walker Support'
            : profileData.assistanceCategory === 'hearing'
            ? 'Hearing Impairment Support'
            : profileData.assistanceCategory === 'visual'
            ? 'Visual Impairment Support'
            : 'None',
      },
      emergencyContacts: [
        {
          id: 'ec-primary',
          name: profileData.emergencyContactName,
          relationship: profileData.emergencyContactRelation,
          phone: profileData.emergencyContactPhone,
          isPrimary: true,
          notifyPreference: 'call',
        },
      ],
      wearable: {
        ...resident.wearable,
        connected: profileData.hasWearable,
        model: profileData.hasWearable ? profileData.wearableModel : 'None',
      },
      pdpaConsents: {
        ...consents,
        acceptedAt: new Date().toISOString(),
      },
    };

    updateResident(updatedResident);
    onComplete();
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Stepper Indicator */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/90">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
            {isThai ? 'ขั้นตอนการเริ่มต้นใช้งาน' : 'NEW RESIDENT ONBOARDING'}
          </span>
          <span className="text-xs font-black text-slate-500 font-mono">
            {step === 'signup' ? 'Step 1/3' : step === 'pdpa' ? 'Step 2/3' : 'Step 3/3'}
          </span>
        </div>

        {/* 3 Steps Pills */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              step === 'signup'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span>1. {isThai ? 'ลงทะเบียน' : 'Sign Up'}</span>
          </div>
          <div
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              step === 'pdpa'
                ? 'bg-teal-600 text-white shadow-xs'
                : step === 'profiling'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span>2. {isThai ? 'ยินยอม PDPA' : 'PDPA'}</span>
          </div>
          <div
            className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              step === 'profiling'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <span>3. {isThai ? 'บันทึกประวัติ' : 'Profiling'}</span>
          </div>
        </div>
      </div>

      {/* ==================== STEP 1: SIGN UP ==================== */}
      {step === 'signup' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-teal-700 via-sky-800 to-indigo-900 rounded-[28px] p-5 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-xs">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  {isThai ? 'สร้างบัญชีผู้พักอาศัย' : 'RESIDENT REGISTRATION'}
                </span>
                <h2 className="text-lg font-black tracking-tight">
                  {isThai ? 'ลงทะเบียนเข้าสู่ระบบ' : 'Create Resident Account'}
                </h2>
              </div>
            </div>
            <p className="text-xs text-teal-100 mt-2 leading-relaxed">
              {isThai
                ? 'เชื่อมต่อข้อมูลห้องชุดกับระบบบริหารจัดการเหตุฉุกเฉินคอนโดมิเนียม เพื่อรับการดูแลความปลอดภัยตลอด 24 ชั่วโมง'
                : 'Connect your apartment unit to the condominium life-safety network for 24/7 emergency response.'}
            </p>
          </div>

          {/* Sign Up Form Inputs (User fills in by themselves) */}
          <div className="bg-white rounded-[28px] p-5 border border-slate-200/90 shadow-sm space-y-3.5">
            {/* Unit & Tower */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isThai ? 'อาคาร (Tower)' : 'Building / Tower'}
                </label>
                <input
                  type="text"
                  value={signupData.tower}
                  onChange={(e) => setSignupData({ ...signupData, tower: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  placeholder="เช่น Tower A"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {isThai ? 'เลขที่ห้องชุด (Unit)' : 'Unit Number'}
                </label>
                <input
                  type="text"
                  value={signupData.unit}
                  onChange={(e) => setSignupData({ ...signupData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  placeholder="เช่น 1204"
                />
              </div>
            </div>

            {/* Resident Full Name (Thai) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isThai ? 'ชื่อ-นามสกุล (ภาษาไทย)' : 'Full Name (Thai)'}
              </label>
              <input
                type="text"
                value={signupData.nameTh}
                onChange={(e) => setSignupData({ ...signupData, nameTh: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                placeholder={isThai ? 'กรอกชื่อ-นามสกุลภาษาไทย' : 'e.g. สมชาย ประเสริฐสุข'}
              />
            </div>

            {/* Resident Full Name (English) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isThai ? 'ชื่อ-นามสกุล (ภาษาอังกฤษ)' : 'Full Name (English)'}
              </label>
              <input
                type="text"
                value={signupData.nameEn}
                onChange={(e) => setSignupData({ ...signupData, nameEn: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                placeholder="e.g. Somchai Prasert"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isThai ? 'เบอร์โทรศัพท์มือถือ' : 'Mobile Phone Number'}
              </label>
              <input
                type="tel"
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                placeholder="08X-XXX-XXXX"
              />
            </div>

            {/* Security PIN */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isThai ? 'รหัส PIN ความปลอดภัย (6 หลัก)' : 'Security PIN (6 Digits)'}
              </label>
              <input
                type="password"
                maxLength={6}
                value={signupData.pin}
                onChange={(e) => setSignupData({ ...signupData, pin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono tracking-widest text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                placeholder="••••••"
              />
            </div>

            {/* Proceed to Step 2 (PDPA Consent) */}
            <div className="pt-2">
              <button
                onClick={handleProceedToPdpa}
                className="w-full py-3.5 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isThai ? 'ลงทะเบียนและไปสู่ขั้นตอน PDPA' : 'Sign Up & Proceed to PDPA'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick return if opened from app */}
          {onCancel && (
            <div className="text-center pt-1">
              <button
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                {isThai ? 'ยกเลิก / กลับสู่หน้าหลัก' : 'Cancel / Return to Home'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== STEP 2: PDPA CONSENT MODAL / SCREEN ==================== */}
      {step === 'pdpa' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-teal-700 via-sky-800 to-indigo-900 rounded-[28px] p-5 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  {isThai ? 'การคุ้มครองข้อมูลส่วนบุคคล' : 'PDPA COMPLIANCE NOTICE'}
                </span>
                <h2 className="text-lg font-black tracking-tight">
                  {isThai ? 'ความยินยอมตาม พ.ร.บ. PDPA' : 'PDPA Privacy & Consent'}
                </h2>
              </div>
            </div>
            <p className="text-xs text-teal-100 mt-2 leading-relaxed">
              {isThai
                ? 'ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ข้อมูลสุขภาพและตำแหน่งห้องชุดของท่านจะถูกจัดเก็บและประมวลผลเพื่อวัตถุประสงค์ในการช่วยชีวิตฉุกเฉินเท่านั้น'
                : 'In accordance with Thailand Personal Data Protection Act B.E. 2562, health and unit data are processed exclusively for emergency life-safety.'}
            </p>
          </div>

          {/* Granular Consent Toggles Card */}
          <div className="bg-white rounded-[28px] p-5 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>{isThai ? 'กำหนดความยินยอมรายหมวด' : 'Granular Consent Items'}</span>
              </span>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {isThai ? 'มาตรา 26' : 'PDPA Sec 26'}
              </span>
            </div>

            {/* 1. Essential Emergency Dispatch (Required) */}
            <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-start gap-3">
              <input
                type="checkbox"
                checked={consents.essentialAccepted}
                disabled
                className="mt-0.5 w-4 h-4 rounded text-teal-600 accent-teal-600"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  <span>{isThai ? '1. การช่วยเหลือฉุกเฉินเพื่อความปลอดภัยในชีวิต' : '1. Life-Safety Emergency Dispatch'}</span>
                  <span className="text-[10px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded font-bold">
                    {isThai ? 'จำเป็น' : 'Required'}
                  </span>
                </div>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  {isThai
                    ? 'ยินยอมให้นิติบุคคลและทีมกู้ภัยประมวลผลชื่อ ห้องชุด และระดับความช่วยเหลือเพื่อส่งทีมช่วยเหลือเมื่อกด SOS'
                    : 'Authorizes control room and first responders to access name, unit, and mobility needs during an active SOS.'}
                </p>
              </div>
            </div>

            {/* 2. Indoor Location Proximity */}
            <label className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.locationSharing}
                onChange={(e) => setConsents({ ...consents, locationSharing: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-teal-600 accent-teal-600"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{isThai ? '2. พิกัดบลูทูธบีคอนภายในโถงทางเดิน' : '2. Hallway BLE Beacon Positioning'}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                    {isThai ? 'แนะนำ' : 'Recommended'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isThai
                    ? 'ยินยอมให้ระบุตำแหน่งคร่าวๆ ในอาคารผ่านบีคอนโถงทางเดินเฉพาะขณะเกิดเหตุ เพื่อให้ทีมกู้ภัยเข้าถึงห้องชุดได้รวดเร็ว'
                    : 'Triangulates floor corridor location during active alerts to accelerate responder routing.'}
                </p>
              </div>
            </label>

            {/* 3. Emergency Contacts Notification */}
            <label className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.pushNotifications}
                onChange={(e) => setConsents({ ...consents, pushNotifications: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-teal-600 accent-teal-600"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{isThai ? '3. แจ้งเตือนผู้ติดต่อฉุกเฉินอัตโนมัติ' : '3. Emergency Contact Auto-Alert'}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                    {isThai ? 'แนะนำ' : 'Recommended'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isThai
                    ? 'ยินยอมให้ส่ง SMS และโทรแจ้งเตือนบุตรหลานหรือผู้ดูแลโดยอัตโนมัติทันทีที่มีการส่งสัญญาณ SOS'
                    : 'Sends automatic SMS / voice dispatch notifications to primary emergency contact upon distress trigger.'}
                </p>
              </div>
            </label>

            {/* 4. Wearable Device Telemetry */}
            <label className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consents.healthTelemetry}
                onChange={(e) => setConsents({ ...consents, healthTelemetry: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-teal-600 accent-teal-600"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{isThai ? '4. ซิงค์ข้อมูลนาฬิกาตรวจจับการล้ม' : '4. Smartwatch Fall Detection Stream'}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                    {isThai ? 'ทางเลือก' : 'Optional'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isThai
                    ? 'ยินยอมให้ส่งสัญญาณแจ้งเหตุอัตโนมัติเมื่อนาฬิกาตรวจพบแรงกระแทกจากการล้ม (Fall Detection)'
                    : 'Transmits accelerometer impact alerts and battery telemetry from connected wearable.'}
                </p>
              </div>
            </label>

            {/* Mandatory Acknowledgement Checkbox */}
            <div className="pt-2 border-t border-slate-100">
              <label className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pdpaAgreed}
                  onChange={(e) => setPdpaAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-teal-600 accent-teal-600"
                />
                <span className="text-xs font-bold text-amber-950 leading-snug">
                  {isThai
                    ? 'ข้าพเจ้าได้อ่าน เข้าใจ และยินยอมให้ประมวลผลข้อมูลส่วนบุคคลเพื่อการคุ้มครองความปลอดภัยในชีวิต'
                    : 'I have read and consent to the PDPA life-safety emergency data processing policy.'}
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setStep('signup')}
                className="w-1/3 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isThai ? 'ย้อนกลับ' : 'Back'}</span>
              </button>
              <button
                disabled={!pdpaAgreed}
                onClick={() => setStep('profiling')}
                className={`w-2/3 py-3 px-4 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                  pdpaAgreed
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isThai ? 'ยินยอมและไปสู่การบันทึกประวัติ' : 'Accept & Proceed to Profiling'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== STEP 3: PROFILING PERSONAL INFORMATION SCREEN ==================== */}
      {step === 'profiling' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-teal-700 via-sky-800 to-indigo-900 rounded-[28px] p-5 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-xs">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  {isThai ? 'ขั้นตอนสุดท้าย' : 'FINAL STEP'}
                </span>
                <h2 className="text-lg font-black tracking-tight">
                  {isThai ? 'บันทึกประวัติข้อมูลสุขภาพ' : 'Personal & Medical Profiling'}
                </h2>
              </div>
            </div>
            <p className="text-xs text-teal-100 mt-2 leading-relaxed">
              {isThai
                ? 'ข้อมูลนี้จำเป็นอย่างยิ่งสำหรับทีมแพทย์และกู้ภัย เพื่อเตรียมอุปกรณ์ช่วยเหลือและยาได้ถูกต้องเมื่อเกิดเหตุ'
                : 'Vital for first responders to prepare proper mobility equipment and triage upon emergency arrival.'}
            </p>
          </div>

          {/* CARD 1 (Pastel Mint Green): Personal Demographics */}
          <div className="bg-[#e8f5e9]/70 rounded-[28px] p-5 border border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-emerald-100">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                {isThai ? 'ข้อมูลส่วนบุคคลและอายุ' : 'Personal Identity & Age'}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {isThai ? 'ชื่อเล่นที่คุ้นเคย' : 'Familiar Nickname'}
                </label>
                <input
                  type="text"
                  value={profileData.nickname}
                  onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder={isThai ? 'ลุงสมชาย' : 'Uncle Somchai'}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {isThai ? 'กรุ๊ปเลือด' : 'Blood Type'}
                </label>
                <select
                  value={profileData.bloodType}
                  onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="O Positive (O+)">O Positive (O+)</option>
                  <option value="A Positive (A+)">A Positive (A+)</option>
                  <option value="B Positive (B+)">B Positive (B+)</option>
                  <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                  <option value="O Negative (O-)">O Negative (O-)</option>
                  <option value="Unknown">Unknown / ไม่แน่ชัด</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {isThai ? 'วันเกิด (คำนวณอายุอัตโนมัติ)' : 'Birth Date'}
                </label>
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                  {isThai ? 'เพศ' : 'Gender'}
                </label>
                <select
                  value={profileData.gender}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      gender: e.target.value as 'male' | 'female' | 'other' | 'prefer_not_to_say',
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="male">{isThai ? 'ชาย' : 'Male'}</option>
                  <option value="female">{isThai ? 'หญิง' : 'Female'}</option>
                  <option value="other">{isThai ? 'อื่นๆ' : 'Other'}</option>
                  <option value="prefer_not_to_say">{isThai ? 'ไม่ระบุ' : 'Prefer not to say'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* CARD 2 (Pastel Sky Blue): Mobility & Assistance Level */}
          <div className="bg-[#e1f5fe]/70 rounded-[28px] p-5 border border-sky-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-sky-100">
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-xs font-black text-sky-950 uppercase tracking-wide">
                {isThai ? 'ระดับความช่วยเหลือในการอพยพ' : 'Evacuation & Mobility Assistance'}
              </h3>
            </div>

            {/* Assistance Categories Pills / Radios */}
            <div className="space-y-2">
              {[
                {
                  key: 'wheelchair' as AssistanceCategory,
                  label: isThai ? 'ผู้ใช้วีลแชร์ (Wheelchair)' : 'Wheelchair User',
                  desc: isThai
                    ? 'ต้องการคนช่วยเข็นและยกวีลแชร์ลงบันไดหนีไฟ'
                    : 'Requires responder mobility assistance to navigate stairwells',
                  color: 'border-rose-400 bg-rose-50/50',
                },
                {
                  key: 'elderly' as AssistanceCategory,
                  label: isThai ? 'ผู้สูงอายุ / ไม้เท้า (Elderly / Walker)' : 'Elderly / Walker Support',
                  desc: isThai
                    ? 'เดินได้ช้า เหนื่อยง่าย ต้องการคนช่วยพยุงเดิน'
                    : 'Slow gait, easily fatigued, requires physical support',
                  color: 'border-amber-400 bg-amber-50/50',
                },
                {
                  key: 'standard' as AssistanceCategory,
                  label: isThai ? 'ช่วยเหลือตนเองได้ (Independent)' : 'Fully Independent',
                  desc: isThai ? 'สามารถเดินลงบันไดหนีไฟได้ตามปกติ' : 'Can evacuate via emergency stairs unassisted',
                  color: 'border-emerald-400 bg-emerald-50/50',
                },
                {
                  key: 'hearing' as AssistanceCategory,
                  label: isThai ? 'การได้ยินบกพร่อง (Hearing Impairment)' : 'Hearing Impairment',
                  desc: isThai
                    ? 'ต้องการสัญญาณไฟกะพริบและข้อความแจ้งเตือน'
                    : 'Requires visual strobe lights and text alerts',
                  color: 'border-indigo-400 bg-indigo-50/50',
                },
                {
                  key: 'visual' as AssistanceCategory,
                  label: isThai ? 'สายตาเลือนราง (Visual Impairment)' : 'Visual Impairment',
                  desc: isThai
                    ? 'ต้องการเสียงแนะนำและคนช่วยนำทางเดิน'
                    : 'Requires audio prompts and physical evacuation guide',
                  color: 'border-purple-400 bg-purple-50/50',
                },
              ].map((item) => {
                const isSelected = profileData.assistanceCategory === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => setProfileData({ ...profileData, assistanceCategory: item.key })}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-sky-600 bg-white shadow-xs'
                        : 'border-sky-100 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isSelected ? 'bg-sky-600 text-white font-bold' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chronic Conditions & Allergies */}
            <div className="space-y-2 pt-2 border-t border-sky-100">
              <div>
                <label className="block text-[11px] font-bold text-sky-950 mb-1">
                  {isThai ? 'โรคประจำตัวที่สำคัญ' : 'Chronic Health Conditions'}
                </label>
                <input
                  type="text"
                  value={profileData.conditions}
                  onChange={(e) => setProfileData({ ...profileData, conditions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sky-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  placeholder={isThai ? 'เช่น ความดันโลหิตสูง, โรคหัวใจ' : 'e.g. Hypertension, Heart Disease'}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-sky-950 mb-1">
                  {isThai ? 'ประวัติการแพ้ยา / แพ้อาหาร' : 'Known Drug & Food Allergies'}
                </label>
                <input
                  type="text"
                  value={profileData.allergies}
                  onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-sky-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  placeholder={isThai ? 'เช่น แพ้ยาเพนิซิลลิน หรือ ไม่มี' : 'e.g. Penicillin allergy or None'}
                />
              </div>
            </div>
          </div>

          {/* CARD 3 (Pastel Warm Yellow): Emergency Contacts & Wearable */}
          <div className="bg-[#fff9c4]/70 rounded-[28px] p-5 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-amber-200">
              <div className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                {isThai ? 'ผู้ติดต่อฉุกเฉินและอุปกรณ์สวมใส่' : 'Emergency Contact & Smartwatch'}
              </h3>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-amber-950 mb-1">
                    {isThai ? 'ชื่อผู้ติดต่อฉุกเฉินหลัก' : 'Primary Contact Name'}
                  </label>
                  <input
                    type="text"
                    value={profileData.emergencyContactName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, emergencyContactName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="สมหญิง ประเสริฐสุข"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-950 mb-1">
                    {isThai ? 'ความสัมพันธ์' : 'Relationship'}
                  </label>
                  <input
                    type="text"
                    value={profileData.emergencyContactRelation}
                    onChange={(e) =>
                      setProfileData({ ...profileData, emergencyContactRelation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder={isThai ? 'บุตรสาว / ผู้ดูแล' : 'Daughter / Caregiver'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-amber-950 mb-1">
                  {isThai ? 'เบอร์โทรผู้ติดต่อฉุกเฉิน' : 'Contact Phone Number'}
                </label>
                <input
                  type="tel"
                  value={profileData.emergencyContactPhone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, emergencyContactPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs font-mono bg-white text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  placeholder="089-876-5432"
                />
              </div>
            </div>

            {/* Wearable Device Choice */}
            <div className="pt-2 border-t border-amber-200 space-y-2">
              <label className="block text-[11px] font-bold text-amber-950">
                {isThai ? 'อุปกรณ์สวมใส่อัจฉริยะ (Smartwatch)' : 'Connected Life-Safety Wearable'}
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setProfileData({ ...profileData, hasWearable: true })}
                  className={`p-3 rounded-2xl border-2 text-left transition ${
                    profileData.hasWearable
                      ? 'border-amber-600 bg-white shadow-xs'
                      : 'border-amber-200/80 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Watch className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-slate-900">
                      {isThai ? 'มีสมาร์ตวอทช์' : 'Has Smartwatch'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {profileData.wearableModel}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileData({ ...profileData, hasWearable: false })}
                  className={`p-3 rounded-2xl border-2 text-left transition ${
                    !profileData.hasWearable
                      ? 'border-amber-600 bg-white shadow-xs'
                      : 'border-amber-200/80 bg-white/60 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-900">
                      {isThai ? 'ไม่มีอุปกรณ์' : 'No Wearable'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isThai ? 'ใช้งานเฉพาะมือถือ' : 'Mobile App Only'}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons: Save & Launch */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setStep('pdpa')}
              className="w-1/3 py-3.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isThai ? 'ย้อนกลับ' : 'Back'}</span>
            </button>
            <button
              onClick={handleCompleteProfiling}
              className="w-2/3 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isThai ? 'บันทึกข้อมูลและเข้าสู่ระบบ' : 'Complete Setup & Launch App'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
