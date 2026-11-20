import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Activity,
  Layers,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const OverviewView: React.FC<{ onSelectFloor: (floorNum: number) => void }> = ({ onSelectFloor }) => {
  const { language, t, floors, incidents, residentsList, activeScenario, currentRole } = useApp();
  const isThai = language === 'th';

  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  // Compute metrics
  const totalResidents = residentsList.length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== 'resolved').length;
  const checkedInSafeCount = residentsList.filter((r) => r.checkInStatus === 'safe').length;
  const assistanceNeededCount = residentsList.filter((r) => r.checkInStatus === 'needs_help').length;
  const respondersActiveCount = 3;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.totalResidentsCount}</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">148</div>
          <div className="text-[11px] text-slate-400 mt-1">20 Residential Floors</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.activeIncidentsCount}</span>
            <AlertTriangle className={`w-4 h-4 ${activeIncidentsCount > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${activeIncidentsCount > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
            {activeIncidentsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {activeIncidentsCount > 0 ? 'Triage In Progress' : 'No active alerts'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.evacuatedCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {checkedInSafeCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Assembly Point Verified</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.pendingAssistanceCount}</span>
            <AlertTriangle className={`w-4 h-4 ${assistanceNeededCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-extrabold font-mono ${assistanceNeededCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {assistanceNeededCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Wheelchair / Elderly Queue</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">{t.respondersDeployed}</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-600 font-mono">
            {respondersActiveCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Teams Alpha, Beta & Med</div>
        </div>
      </div>

      {/* 20-Floor Condominium Architectural Visualizer Matrix */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              <span>{t.building20FloorsVisualizer}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.floorInspectorPrompt}</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {t.normalCondition}
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              {t.alertCondition}
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              {isThai ? 'มีคำขอความช่วยเหลือ' : 'Assistance Needed'}
            </span>
          </div>
        </div>

        {/* 20 Floors Stack Grid (Ordered 20 down to 1 like a real skyscraper!) */}
        <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
          {floors
            .slice()
            .reverse()
            .map((floor) => {
              const hasFire = floor.hazards.fireDetected || floor.hazards.smokePpm > 100;
              const hasDamage = floor.hazards.structuralDamage;
              const hasAssistance = floor.assistancePending > 0;
              const isFloorHovered = hoveredFloor === floor.floorNumber;

              return (
                <div
                  key={floor.floorNumber}
                  onMouseEnter={() => setHoveredFloor(floor.floorNumber)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() => onSelectFloor(floor.floorNumber)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    hasFire
                      ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400 shadow-sm'
                      : hasDamage
                      ? 'bg-amber-50/90 border-amber-300'
                      : hasAssistance
                      ? 'bg-orange-50/70 border-orange-200'
                      : isFloorHovered
                      ? 'bg-slate-50 border-teal-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Floor Label */}
                  <div className="flex items-center gap-3 w-40">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                        hasFire
                          ? 'bg-rose-600 text-white animate-pulse'
                          : hasDamage
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {floor.floorNumber}F
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {isThai ? floor.nameTh : floor.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {floor.hasRefugeArea ? '♿ Reinforced Refuge' : `${floor.units.length} Units`}
                      </div>
                    </div>
                  </div>

                  {/* Hazard Status Icons */}
                  <div className="flex items-center gap-2">
                    {hasFire && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3 text-rose-600" />
                        <span>SMOKE {floor.hazards.smokePpm} PPM</span>
                      </span>
                    )}
                    {hasDamage && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-amber-600" />
                        <span>SEISMIC ALERT</span>
                      </span>
                    )}
                    {floor.blockedCorridors.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-semibold">
                        {floor.blockedCorridors.length} Blocked
                      </span>
                    )}
                  </div>

                  {/* Sensor Quick Stats */}
                  <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Smoke</span>
                      <span className={hasFire ? 'font-bold text-rose-600' : ''}>
                        {floor.hazards.smokePpm} ppm
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Temp</span>
                      <span className={floor.hazards.tempCelsius > 40 ? 'font-bold text-rose-600' : ''}>
                        {floor.hazards.tempCelsius}°C
                      </span>
                    </div>
                  </div>

                  {/* Residents & Evac Progress */}
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="font-bold text-slate-800">
                        {floor.evacuatedResidents}/{floor.totalResidents}
                      </span>
                      <span className="text-[10.5px] text-slate-400 block">Evacuated</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
