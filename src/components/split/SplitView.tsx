import React from 'react';
import { useApp } from '../../context/AppContext';
import { ResidentApp } from '../resident/ResidentApp';
import { ManagementDashboard } from '../management/ManagementDashboard';
import { Columns, Smartphone, LayoutDashboard, Sliders } from 'lucide-react';

interface SplitViewProps {
  onOpenDemoPanel: () => void;
}

export const SplitView: React.FC<SplitViewProps> = ({ onOpenDemoPanel }) => {
  const { language, t } = useApp();
  const isThai = language === 'th';

  return (
    <div className="space-y-4 p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Split View Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-800 to-indigo-900 rounded-3xl p-4 text-white shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20">
            <Columns className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              <span>{t.splitView}</span>
              <span className="text-[10px] font-mono bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/30">
                LIVE DUAL-SYNC MODE
              </span>
            </h2>
            <p className="text-xs text-teal-100">
              {isThai
                ? 'หน้าจอผู้อยู่อาศัย (ซ้าย) และศูนย์ควบคุมอาคาร (ขวา) เชื่อมต่อแบบเรียลไทม์ 100%'
                : 'Interactive synchronized demonstration of both interfaces communicating with zero latency.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDemoPanel}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
        >
          <Sliders className="w-4 h-4" />
          <span>{isThai ? 'แผงจำลองเหตุการณ์' : 'Demo Control Panel'}</span>
        </button>
      </div>

      {/* Side-by-Side Dual Container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        {/* Left Side: Resident Mobile App (5 Columns on XL) */}
        <div className="xl:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between px-3 py-1.5 mb-2 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>{t.residentPortal}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Mobile Simulator</span>
          </div>
          <ResidentApp isEmbedded={true} />
        </div>

        {/* Right Side: Building Management Dashboard (7 Columns on XL) */}
        <div className="xl:col-span-7 flex flex-col">
          <div className="w-full flex items-center justify-between px-3 py-1.5 mb-2 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-sky-600" />
              <span>{t.managementPortal}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Desktop Operations Center</span>
          </div>
          <ManagementDashboard onOpenDemoPanel={onOpenDemoPanel} isEmbedded={true} />
        </div>
      </div>
    </div>
  );
};
