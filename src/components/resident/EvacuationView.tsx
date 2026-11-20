import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateEvacuationRoute } from '../../utils/evacuationRouter';
import { FloorPlanSvg } from '../floorplan/FloorPlanSvg';
import { CheckInStatus } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Footprints,
  DoorClosed,
  Navigation,
  PhoneCall,
  Accessibility,
  Building,
  UserCheck,
} from 'lucide-react';

export const EvacuationView: React.FC = () => {
  const {
    language,
    t,
    resident,
    floors,
    activeScenario,
    checkInResident,
  } = useApp();

  const isThai = language === 'th';
  const [selectedFloorNum, setSelectedFloorNum] = useState<number>(resident.floor || 12);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const currentFloor = floors.find((f) => f.floorNumber === selectedFloorNum) || floors[11];
  const evacuationPlan = calculateEvacuationRoute(currentFloor, resident, activeScenario);

  const toggleStepCompleted = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'DoorClosed':
        return <DoorClosed className="w-4 h-4 text-sky-600" />;
      case 'Navigation':
        return <Navigation className="w-4 h-4 text-emerald-600" />;
      case 'Footprints':
        return <Footprints className="w-4 h-4 text-teal-600" />;
      case 'Accessibility':
        return <Accessibility className="w-4 h-4 text-amber-600" />;
      case 'PhoneCall':
        return <PhoneCall className="w-4 h-4 text-rose-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header and Floor Selector */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">{t.evacuationTitle}</h2>
          <p className="text-[11px] text-slate-500">{t.evacuationSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">{t.selectFloor}</label>
          <select
            value={selectedFloorNum}
            onChange={(e) => setSelectedFloorNum(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          >
            {floors.map((f) => (
              <option key={f.floorNumber} value={f.floorNumber}>
                Floor {f.floorNumber} {f.hazards.fireDetected ? '🔥' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive 2D Architectural SVG */}
      <FloorPlanSvg
        floorNumber={selectedFloorNum}
        evacuationPlan={evacuationPlan}
        resident={resident}
        language={language}
        interactive={true}
      />

      {/* Critical Life-Safety Alert Callouts */}
      <div className="space-y-2">
        {/* Elevator Warning */}
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{t.routeElevatorWarning}</span>
            <p className="text-[11px] text-rose-800 mt-0.5">
              {isThai
                ? 'ระบบลิฟต์โดยสารอาจตัดการทำงานหรือปล่องลิฟต์อาจกลายเป็นทางระบายควันไฟ ให้อพยพทางบันไดหนีไฟหรือพื้นที่พักคอยทนไฟเท่านั้น'
                : 'Elevator shafts can act as chimneys for smoke and thermal drafts. Use pressurized fire staircases only.'}
            </p>
          </div>
        </div>

        {/* Wheelchair / Personalized Notice */}
        {resident.medicalInfo.wheelchairUser && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <Accessibility className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t.routeWheelchairNotice}</span>
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Personalized Evacuation Guidance */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.stepByStepGuide}</span>
          </h3>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {t.staffVerificationBadge}
          </span>
        </div>

        <div className="space-y-3">
          {evacuationPlan.steps.map((step) => {
            const isDone = completedSteps.includes(step.stepNumber);

            return (
              <div
                key={step.stepNumber}
                onClick={() => toggleStepCompleted(step.stepNumber)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${isDone ? 'bg-emerald-200 text-emerald-800' : 'bg-white text-slate-700'}`}>
                  {getStepIcon(step.iconName)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">
                      {isThai ? step.titleTh : step.titleEn}
                    </span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-slate-400'
                    }`}>
                      {isDone ? '✓' : step.stepNumber}
                    </span>
                  </div>

                  <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                    {isThai ? step.descriptionTh : step.descriptionEn}
                  </p>

                  {step.cautionEn && (
                    <div className="mt-1.5 text-[10.5px] font-semibold text-rose-600">
                      ⚠️ {isThai ? step.cautionTh : step.cautionEn}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Check-in Section */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-5 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-teal-400" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.safetyCheckInTitle}
            </h4>
            <p className="text-[11px] text-slate-300">{t.safetyCheckInDesc}</p>
          </div>
        </div>

        {/* Current Check-in State Badge */}
        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-xs flex items-center justify-between">
          <span className="text-slate-300">{t.checkInState}:</span>
          <span className="font-bold text-teal-300 uppercase">
            {resident.checkInStatus === 'safe'
              ? '✓ SAFE AT ASSEMBLY AREA'
              : resident.checkInStatus === 'needs_help'
              ? '🚨 ASSISTANCE REQUESTED'
              : resident.checkInStatus === 'evacuating'
              ? '🏃 EVACUATING IN PROGRESS'
              : '⏳ PENDING REPORT'}
          </span>
        </div>

        {/* Check-In Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => checkInResident('safe')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              resident.checkInStatus === 'safe'
                ? 'bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.checkInSafeBtn}</span>
          </button>

          <button
            onClick={() => checkInResident('evacuating')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              resident.checkInStatus === 'evacuating'
                ? 'bg-amber-500 text-white shadow-lg ring-2 ring-amber-300'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>{t.checkInEvacuatingBtn}</span>
          </button>

          <button
            onClick={() => checkInResident('needs_help')}
            className={`py-3 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              resident.checkInStatus === 'needs_help'
                ? 'bg-rose-500 text-white shadow-lg ring-2 ring-rose-300'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.checkInNeedHelpBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
