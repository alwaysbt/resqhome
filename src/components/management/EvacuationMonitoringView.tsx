import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Footprints,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ShieldCheck,
  Building,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';

export const EvacuationMonitoringView: React.FC = () => {
  const { language, t, floors, residentsList, addNotification, addAuditLog, activeScenario } = useApp();
  const isThai = language === 'th';

  const totalResidents = 148;
  const totalSafeCheckedIn = residentsList.filter((r) => r.checkInStatus === 'safe').length;
  const totalNeedsHelp = residentsList.filter((r) => r.checkInStatus === 'needs_help').length;
  const overallRate = Math.round((totalSafeCheckedIn / totalResidents) * 100);

  const handleBroadcastOrder = () => {
    addNotification({
      titleEn: '📢 OFFICIAL BUILDING EVACUATION ORDER DISPATCHED',
      titleTh: '📢 คำสั่งอพยพอย่างเป็นทางการจากฝ่ายจัดการอาคาร',
      messageEn: 'All residents in Serenity Heights Tower A are instructed to evacuate immediately via nearest safe fire stairs. Avoid elevators!',
      messageTh: 'ขอให้ผู้อยู่อาศัยทุกคนในอาคาร A อพยพออกจากห้องชุดทันทีผ่านบันไดหนีไฟที่ปลอดภัยที่สุด ห้ามใช้ลิฟต์โดยสารเด็ดขาด!',
      severity: 'critical',
      category: 'emergency',
    });

    addAuditLog(
      'Official Evacuation Order Broadcast',
      'ประกาศคำสั่งอพยพอย่างเป็นทางการ',
      'Building-wide PA and digital notification broadcast sent to all registered units.',
      'Security Control Room Lead',
      'Security'
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Bar with Broadcast Order */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Footprints className="w-5 h-5 text-teal-600" />
            <span>{t.navEvacuationMgmt}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'ติดตามการเช็คอินความปลอดภัยรายชั้น และควบคุมการสั่งอพยพ'
              : 'Live floor-by-floor muster progress, blocked routes, and safety verification'}
          </p>
        </div>

        <button
          onClick={handleBroadcastOrder}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center gap-2"
        >
          <Megaphone className="w-4 h-4" />
          <span>{t.broadcastEvacuationOrder}</span>
        </button>
      </div>

      {/* High-level Progress Summary */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-800 to-blue-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-teal-200 font-semibold uppercase tracking-wider block">
              {t.totalCheckInRate}
            </span>
            <div className="text-3xl font-black font-mono tracking-tight mt-1">
              {overallRate}% Completed
            </div>
            <p className="text-xs text-teal-100 mt-0.5">
              {totalSafeCheckedIn} verified safe at Assembly Ground • {totalNeedsHelp} assistance in progress
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-teal-200 uppercase block">Assembly Point</span>
              <span className="text-lg font-bold font-mono">North Garden</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] text-teal-200 uppercase block">Elevator State</span>
              <span className="text-lg font-bold text-amber-300">
                {activeScenario !== 'normal' ? 'LOCKED OUT' : 'OPERATIONAL'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-xs">
          <div
            className="bg-emerald-400 h-3 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(overallRate, 5)}%` }}
          ></div>
        </div>
      </div>

      {/* Floor by Floor Progress Matrix */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600" />
          <span>{t.evacProgressTitle} (20 Floors)</span>
        </h3>

        <div className="space-y-2">
          {floors
            .slice()
            .reverse()
            .map((floor) => {
              const floorResidents = residentsList.filter((r) => r.floor === floor.floorNumber);
              const safeOnFloor = floorResidents.filter((r) => r.checkInStatus === 'safe').length;
              const percent = floorResidents.length > 0 ? Math.round((safeOnFloor / floorResidents.length) * 100) : 0;
              const hasBlocked = floor.blockedCorridors.length > 0;
              const hasFire = floor.hazards.fireDetected || floor.hazards.smokePpm > 100;

              return (
                <div
                  key={floor.floorNumber}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    hasFire
                      ? 'bg-rose-50/70 border-rose-300'
                      : hasBlocked
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 w-32">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {floor.floorNumber}F
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {isThai ? floor.nameTh : floor.nameEn}
                    </span>
                  </div>

                  {/* Route Status Badges */}
                  <div className="flex items-center gap-2">
                    {hasFire && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        🔥 Fire Hazard
                      </span>
                    )}
                    {hasBlocked && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                        ⚠️ {floor.blockedCorridors.length} Blocked Route
                      </span>
                    )}
                    {floor.hasRefugeArea && (
                      <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-semibold">
                        ♿ Refuge Available
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 max-w-xs hidden sm:block">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="text-right text-xs font-mono font-semibold text-slate-800 w-16">
                    {safeOnFloor} / {floorResidents.length || floor.totalResidents}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
