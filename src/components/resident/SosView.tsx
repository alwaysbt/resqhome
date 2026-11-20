import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmergencyCategory, IncidentStatus } from '../../types';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  UserCheck,
  MapPin,
  XCircle,
  AlertTriangle,
  Stethoscope,
  Activity,
  Ambulance,
  PhoneCall,
  Flame,
} from 'lucide-react';

export const SosView: React.FC = () => {
  const {
    language,
    t,
    resident,
    activeSosIncident,
    staff,
    triggerResidentSos,
    cancelResidentSos,
    updateIncidentStatus,
  } = useApp();

  const isThai = language === 'th';
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Category selections
  const categories: { key: EmergencyCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'medical', label: t.catMedical, icon: <Stethoscope className="w-4 h-4 text-rose-500" /> },
    { key: 'fall', label: t.catFall, icon: <Activity className="w-4 h-4 text-amber-500" /> },
    { key: 'accident', label: t.catAccident, icon: <AlertTriangle className="w-4 h-4 text-orange-500" /> },
    { key: 'evacuation', label: t.catEvacuation, icon: <Flame className="w-4 h-4 text-red-500" /> },
    { key: 'other', label: t.catOther, icon: <PhoneCall className="w-4 h-4 text-slate-500" /> },
  ];

  // Assigned staff objects
  const assignedResponders = staff.filter((s) =>
    activeSosIncident?.assignedStaffIds?.includes(s.id)
  );

  const statuses: { key: IncidentStatus; title: string; desc: string }[] = [
    { key: 'reported', title: t.statusReported, desc: t.statusReportedDesc },
    { key: 'acknowledged', title: t.statusAcknowledged, desc: t.statusAcknowledgedDesc },
    { key: 'dispatched', title: t.statusDispatched, desc: t.statusDispatchedDesc },
    { key: 'arrived', title: t.statusArrived, desc: t.statusArrivedDesc },
    { key: 'resolved', title: t.statusResolved, desc: t.statusResolvedDesc },
  ];

  const currentStatusIndex = activeSosIncident
    ? statuses.findIndex((s) => s.key === activeSosIncident.status)
    : -1;

  if (!activeSosIncident) {
    return (
      <div className="space-y-5 text-center py-8 animate-in fade-in duration-200">
        <div className="w-24 h-24 mx-auto rounded-full bg-rose-100 border-4 border-rose-300 flex items-center justify-center text-rose-600 shadow-xl shadow-rose-500/20">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {t.sosButtonLabel}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
            {isThai
              ? 'กดปุ่มเพื่อแจ้งเหตุฉุกเฉินทันที ข้อมูลทางการแพทย์และพิกัดจำลองจะถูกส่งตรงถึงศูนย์ควบคุมอาคาร'
              : 'Tap below to trigger immediate emergency dispatch. Your location and medical summary will be shared.'}
          </p>
        </div>

        {/* Big Trigger Button */}
        <div className="max-w-xs mx-auto pt-2">
          <button
            onClick={() => triggerResidentSos('medical')}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 text-white font-black text-lg tracking-wider shadow-xl shadow-rose-600/30 hover:scale-105 active:scale-95 transition"
          >
            {t.sosButtonLabel}
          </button>
        </div>

        {/* Category Pre-selection Buttons */}
        <div className="pt-4 max-w-sm mx-auto text-left">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 text-center">
            {isThai ? 'หรือเลือกประเภทเหตุก่อนส่งสัญญาณ:' : 'Or tap a specific emergency type:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => triggerResidentSos(c.key)}
                className="p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 text-left transition flex items-center gap-2.5 shadow-xs"
              >
                <div className="p-2 rounded-xl bg-slate-50">{c.icon}</div>
                <span className="text-xs font-semibold text-slate-800">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Active Distress Call Card */}
      <div className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 rounded-3xl p-5 text-white shadow-xl shadow-rose-600/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-white animate-ping"></span>
            <span className="font-black text-sm tracking-wide uppercase">
              {t.activeSosTitle}
            </span>
          </div>
          <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
            {activeSosIncident.id}
          </span>
        </div>

        <h3 className="text-lg font-bold">
          {isThai ? activeSosIncident.titleTh : activeSosIncident.titleEn}
        </h3>
        <p className="text-xs text-rose-100 mt-0.5">{t.sosSentDesc}</p>

        {/* Location Badge */}
        <div className="mt-3 p-2.5 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/20 text-xs flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-300 shrink-0" />
          <span className="font-medium text-white">{t.simulatedLocationBadge}</span>
        </div>
      </div>

      {/* Real-time Response Progression Tracker */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>{t.dispatchStatus}</span>
        </h4>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {statuses.map((step, idx) => {
            const isCompleted = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;

            return (
              <div key={step.key} className="relative group">
                <span
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs transition ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 animate-pulse'
                        : 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                </span>

                <div>
                  <div
                    className={`text-xs font-bold ${
                      isCurrent ? 'text-rose-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Responders Card */}
      {assignedResponders.length > 0 && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.assignedResponders}</span>
          </h4>

          <div className="space-y-2">
            {assignedResponders.map((staffMember) => (
              <div
                key={staffMember.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold overflow-hidden">
                    {staffMember.avatar ? (
                      <img src={staffMember.avatar} alt={staffMember.name} className="w-full h-full object-cover" />
                    ) : (
                      staffMember.name[0]
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {isThai ? staffMember.nameTh : staffMember.name}
                    </div>
                    <div className="text-[10.5px] text-teal-800">
                      {isThai ? staffMember.roleTitleTh : staffMember.roleTitleEn}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${staffMember.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Category Switcher */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <label className="text-xs font-bold text-slate-700 block mb-2">
          {t.sosCategoryPrompt}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                triggerResidentSos(c.key);
              }}
              className={`p-2.5 rounded-xl border text-xs text-left transition flex items-center gap-2 ${
                activeSosIncident.type === c.key
                  ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {c.icon}
              <span className="truncate">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cancel SOS Option */}
      {!showCancelPrompt ? (
        <button
          onClick={() => setShowCancelPrompt(true)}
          className="w-full py-3 rounded-2xl border border-slate-300 hover:border-rose-400 text-slate-600 hover:text-rose-600 text-xs font-bold transition flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
          <span>{t.cancelSos}</span>
        </button>
      ) : (
        <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 space-y-3">
          <div className="text-xs font-bold text-rose-900">{t.cancelSosPrompt}</div>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder={t.cancelReasonPlaceholder}
            className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                cancelResidentSos(cancelReason || 'Resolved by resident');
                setShowCancelPrompt(false);
              }}
              className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
            >
              {t.confirm}
            </button>
            <button
              onClick={() => setShowCancelPrompt(false)}
              className="py-2 px-4 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
