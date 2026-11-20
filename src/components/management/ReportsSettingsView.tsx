import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ReportsSettingsView: React.FC = () => {
  const { language, t, resetAllToNormal, incidents, auditLogs } = useApp();
  const isThai = language === 'th';

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleSimulateExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>{t.reportsTitle}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'ข้อมูลจำเพาะระบบความปลอดภัยอาคาร และการส่งออกรายงานสรุปเหตุการณ์'
              : 'Verified condominium emergency plan parameters & incident report exporter'}
          </p>
        </div>

        <button
          onClick={handleSimulateExport}
          className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{t.exportReport}</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {isThai
              ? 'ส่งออกไฟล์รายงานสรุปเหตุฉุกเฉิน (ResQHome_Incident_Report_2026.csv) สำเร็จแล้ว!'
              : 'Export completed successfully: ResQHome_Incident_Report_2026.csv'}
          </span>
        </div>
      )}

      {/* Condominium Verified Emergency Specifications Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Building className="w-4 h-4 text-teal-600" />
          <span>{t.emergencyPlanSummary} (Serenity Heights Tower A)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">1. Architectural Fire Separation</h4>
            <p className="text-slate-600 leading-relaxed">
              - 20 Stories above grade, reinforced concrete shear wall core.
              <br />
              - 2 Positive-pressurized smoke-proof fire stairwells (Staircase A West Core & Staircase B East Core).
              <br />
              - Self-closing UL 10C 2-Hour fire door assemblies on all corridor vestibules.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">2. Designated Assistance Refuge Areas</h4>
            <p className="text-slate-600 leading-relaxed">
              - Dedicated Refuge Rooms situated on Floors 6, 12, and 18 (Rooms 6-R, 12-R, 18-R).
              <br />
              - Equipped with direct hardwired 2-way voice intercom to Security Control Room.
              <br />
              - Staging point for portable stair evacuation chairs (Evac-Chair Pro).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">3. Elevator Lockout Protocols</h4>
            <p className="text-slate-600 leading-relaxed">
              - Fire Mode Phase I: Automated recall of all 4 passenger lifts to Ground Floor upon FACP alarm.
              <br />
              - Phase II: Emergency service fire-lift key activation restricted strictly to Municipal Fire Marshals.
              <br />
              - Residents strictly prohibited from lift usage during active alarms.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900">4. High-Rise Assembly & Muster Point</h4>
            <p className="text-slate-600 leading-relaxed">
              - Primary Outdoor Assembly Ground: North Landscaped Garden (minimum 35 meters from building perimeter).
              <br />
              - Secondary Muster Area: Clubhouse Multi-Purpose Pavilion.
              <br />
              - Digital and manual resident safety tally reconciles within 10 minutes of evacuation order.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-rose-50 rounded-3xl p-6 border border-rose-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-rose-950 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{isThai ? 'รีเซ็ตข้อมูลการสาธิต (Demo Reset)' : 'Restore Clean Prototype State'}</span>
          </h3>
          <p className="text-xs text-rose-800 mt-1">
            {isThai
              ? 'คืนค่าเซนเซอร์ทุกชั้นให้เป็นปกติ ปิดเคสเหตุฉุกเฉินทั้งหมด และคืนค่าข้อมูลลูกบ้านจำลอง'
              : 'Clears active hazards, resolves incidents, unblocks corridors, and restores default mock data.'}
          </p>
        </div>

        <button
          onClick={resetAllToNormal}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.restoreNormalBtn}</span>
        </button>
      </div>
    </div>
  );
};
