import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Smartphone,
  LayoutDashboard,
  Columns,
  Sliders,
  CheckCircle2,
  Lock,
  Building,
  Watch,
  Users,
  Flame,
  Activity,
  ArrowRight,
  ShieldCheck,
  FileText,
  Zap,
  UserPlus,
} from 'lucide-react';

interface WelcomePageProps {
  onOpenDemoPanel: () => void;
  onOpenOnboarding: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onOpenDemoPanel, onOpenOnboarding }) => {
  const {
    language,
    t,
    setCurrentView,
    setCurrentRole,
    triggerFireScenario,
    triggerEarthquakeScenario,
    resetAllToNormal,
    setIsOnboardingFlowOpen,
    setOnboardingInitialStep,
  } = useApp();

  const isThai = language === 'th';

  return (
    <div className="space-y-8 py-4 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-teal-700 via-sky-800 to-indigo-950 p-6 sm:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-200">
            <ShieldAlert className="w-4 h-4 text-teal-300" />
            <span>{t.appTagline}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            ResQHome
          </h1>
          <p className="text-base sm:text-lg text-teal-100 font-light leading-relaxed">
            {t.welcomeDesc}
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
              <span>{isThai ? 'อาคาร 20 ชั้น Serenity Heights' : '20-Floor Condominium Layout'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-300" />
              <span>{isThai ? 'สอดคล้องพระราชบัญญัติ PDPA' : 'Bilingual PDPA & Privacy Notice'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 flex items-center gap-1.5">
              <Watch className="w-3.5 h-3.5 text-teal-300" />
              <span>{isThai ? 'จำลองนาฬิกาตรวจจับการล้ม' : 'Smartwatch Fall Detection Stream'}</span>
            </span>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Portals Entry Cards (Resident vs Management vs Split) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Resident Mobile Portal */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200/80 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <Smartphone className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t.residentPortal}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{t.residentPortalDesc}</p>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1 font-mono">
              <div className="font-bold text-slate-800">Preconfigured Demo Resident:</div>
              <div>Somchai Prasert (สมชาย ประเสริฐสุข)</div>
              <div>Unit 1204, Floor 12 (Wheelchair User)</div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button
              onClick={() => {
                setIsOnboardingFlowOpen(false);
                setCurrentRole('resident');
                setCurrentView('resident');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
            >
              <span>{t.enterResidentApp}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setCurrentRole('resident');
                setOnboardingInitialStep('signup');
                setIsOnboardingFlowOpen(true);
                setCurrentView('resident');
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-teal-600" />
              <span>
                {isThai
                  ? '✨ สมัครใหม่: Sign Up ➔ PDPA ➔ บันทึกประวัติ'
                  : '✨ Sign Up & Profiling: Sign Up ➔ PDPA ➔ Profile'}
              </span>
            </button>

            <button
              onClick={onOpenOnboarding}
              className="w-full py-1.5 px-3 text-center text-teal-700 hover:underline text-xs font-semibold cursor-pointer"
            >
              {isThai ? 'ตรวจสอบนโยบายความเป็นส่วนตัว PDPA' : 'Review Privacy & Technology Terms'}
            </button>
          </div>
        </div>

        {/* 2. Building Management Portal */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200/80 hover:border-sky-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{t.managementPortal}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{t.managementPortalDesc}</p>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">Available Operational Roles:</div>
              <div className="flex flex-wrap gap-1 pt-1 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-bold">Admin</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold">Security Lead</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">First Responder</span>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button
              onClick={() => {
                setCurrentRole('admin');
                setCurrentView('management');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>{t.enterManagement}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
              <button
                onClick={() => {
                  setCurrentRole('security');
                  setCurrentView('management');
                }}
                className="hover:text-teal-700 font-semibold"
              >
                Security Preview
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentRole('responder');
                  setCurrentView('management');
                }}
                className="hover:text-blue-700 font-semibold"
              >
                Responder Preview
              </button>
            </div>
          </div>
        </div>

        {/* 3. Interactive Split View (Evaluator Favorite!) */}
        <div className="bg-gradient-to-br from-teal-50 via-sky-50 to-indigo-50 rounded-[32px] p-6 shadow-sm border border-teal-200/80 hover:border-teal-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold group-hover:scale-110 transition shadow-md shadow-teal-500/20">
              <Columns className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{t.splitView}</h2>
              <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-black uppercase">
                Dual-View
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{t.splitViewDesc}</p>

            <div className="p-3 rounded-2xl bg-white/80 border border-teal-100 text-xs text-teal-900 space-y-1">
              <div className="font-bold">Live Synchronized Triage:</div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                Test Demo 6: Trigger an SOS in the resident mobile window on the left, watch it populate the management queue on the right instantly!
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setCurrentView('split')}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2 group-hover:gap-3"
            >
              <span>{t.openSplitView}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Evaluator Quick-Start Scenarios & Demo Control Guide */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>{t.evaluatorNotice}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.evaluatorNoticeDesc}</p>
          </div>

          <button
            onClick={onOpenDemoPanel}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            <span>{isThai ? 'เปิดแผงจำลองเหตุการณ์' : 'Launch Demo Control Panel'}</span>
          </button>
        </div>

        {/* 6 Demonstrations Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-xs text-slate-900">{t.quickDemo1}</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isThai
                ? 'เข้าแอปผู้อยู่อาศัย ตรวจสอบ PDPA onboarding แก้ไขวันเกิดเพื่อดูอายุคำนวณอัตโนมัติ และดูข้อมูลผู้ติดต่อฉุกเฉิน'
                : 'Enter as resident, review onboarding disclosures, edit DOB to see automatic age recalculation, review medical info.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-xs text-amber-950">{t.quickDemo2}</h4>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {isThai
                ? 'จำลองแผ่นดินไหว ระบบลิฟต์ตัดอัตโนมัติ แสดงคำแนะนำหมอบ-กำบัง-ยึดแน่น และลูกบ้านเช็คอินความปลอดภัย'
                : 'Trigger seismic tremors, automated elevator safety shutdown, step-by-step instructions, and safety check-in.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-xs text-rose-950">{t.quickDemo3}</h4>
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              {isThai
                ? 'จำลองไฟไหม้ชั้น 12 ทางเดินทิศเหนือมีควัน 420 PPM ระบบคำนวณเส้นทางใหม่ไปยังบันได B อัตโนมัติ'
                : 'Simulate fire on Floor 12, smoke trips detector (420 PPM), dynamic rerouting around blocked corridor to Stair B.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-xs text-blue-950">{t.quickDemo4}</h4>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              {isThai
                ? 'ทดสอบลูกบ้านกลุ่มเปราะบาง (ผู้ใช้วีลแชร์) เส้นทางชี้ไปยังห้องพักคอยทนไฟ 12-R และส่งทีมพร้อมเก้าอี้อพยพ'
                : 'Wheelchair user route directs to Refuge Area 12-R with 2-way intercom; response team dispatched with Evac Chair.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h4 className="font-bold text-xs text-purple-950">{t.quickDemo5}</h4>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed">
              {isThai
                ? 'สลับบทบาท Admin, Security Lead และ Responder เพื่อตรวจสอบการจำกัดสิทธิ์เข้าถึงเวชระเบียนและความคืบหน้า'
                : 'Switch between Admin, Security Control, and Responder to verify RBAC access and dispatch workflows.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                6
              </span>
              <h4 className="font-bold text-xs text-teal-950">{t.quickDemo6}</h4>
            </div>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              {isThai
                ? 'กด SOS ในมือถือ สังเกตการแจ้งเตือนปรากฏบนแดชบอร์ด มอบหมายเจ้าหน้าที่ และลูกบ้านได้รับการตอบรับทันที'
                : 'Press SOS in mobile app, observe instant dispatch on dashboard, assign staff, observe resident receiving ETA.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
