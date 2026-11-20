import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Flame,
  Globe2,
  Sliders,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  LayoutDashboard,
  Columns,
  Home,
} from 'lucide-react';

interface HeaderProps {
  onOpenDemoPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDemoPanel }) => {
  const {
    language,
    setLanguage,
    t,
    currentView,
    setCurrentView,
    activeScenario,
    isAudioMuted,
    toggleAudioMute,
    resetAllToNormal,
  } = useApp();

  const isThai = language === 'th';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('welcome')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-sky-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-teal-600 transition">
                  {t.appName}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                  {t.demoModeBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                {t.condoName}
              </p>
            </div>
          </button>

          {/* Active Scenario Indicator Badge */}
          {activeScenario !== 'normal' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {activeScenario === 'fire'
                  ? isThai
                    ? 'เหตุเพลิงไหม้ (ชั้น 12)'
                    : 'FIRE HAZARD (FLOOR 12)'
                  : isThai
                  ? 'เหตุแผ่นดินไหว'
                  : 'EARTHQUAKE ALERT'}
              </span>
            </div>
          )}
        </div>

        {/* View Switchers & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Navigation Pills */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setCurrentView('welcome')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                currentView === 'welcome'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isThai ? 'หน้าหลัก' : 'Portal'}</span>
            </button>
            <button
              onClick={() => setCurrentView('resident')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                currentView === 'resident'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isThai ? 'แอปผู้อยู่อาศัย' : 'Resident App'}</span>
            </button>
            <button
              onClick={() => setCurrentView('management')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                currentView === 'management'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{isThai ? 'ฝ่ายจัดการ' : 'Management'}</span>
            </button>
            <button
              onClick={() => setCurrentView('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                currentView === 'split'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-teal-700 hover:text-teal-900 bg-teal-50/50'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{isThai ? 'สองหน้าจอ' : 'Split View'}</span>
            </button>
          </div>

          {/* Demo Simulation Controls Button */}
          <button
            onClick={onOpenDemoPanel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm shadow-amber-500/20 transition hover:scale-105 active:scale-95"
            title="Demo Simulation Control Panel"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isThai ? 'แผงจำลองเหตุการณ์' : 'Demo Controls'}
            </span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={resetAllToNormal}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
            title={t.resetDemo}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleAudioMute}
            className={`p-2 rounded-xl border transition ${
              isAudioMuted
                ? 'text-slate-400 border-slate-200 hover:bg-slate-100'
                : 'text-teal-600 border-teal-200 bg-teal-50 hover:bg-teal-100'
            }`}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Emergency Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            <Globe2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'th' ? 'TH' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
