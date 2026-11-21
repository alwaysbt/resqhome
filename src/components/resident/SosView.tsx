import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight,
  Phone,
  ArrowRight,
  Check,
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
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | null>(null);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Interactive "Slide to Confirm SOS" State & Touch/Mouse Handling
  const [sliderPosition, setSliderPosition] = useState<number>(0); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sliderConfirmed, setSliderConfirmed] = useState<boolean>(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // Category selections with elderly-friendly descriptions
  const categories: {
    key: EmergencyCategory;
    label: string;
    sublabelEn: string;
    sublabelTh: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: 'medical',
      label: t.catMedical,
      sublabelEn: 'Chest pain, shortness of breath, sudden illness',
      sublabelTh: 'แน่นหน้าอก หายใจไม่ออก มีอาการป่วยกะทันหัน',
      icon: <Stethoscope className="w-5 h-5 text-rose-600" />,
      color: 'rose',
    },
    {
      key: 'fall',
      label: t.catFall,
      sublabelEn: 'Slipped or fallen, unable to get up unassisted',
      sublabelTh: 'หกล้ม ลื่นล้ม ลุกขึ้นเองไม่ได้ บาดเจ็บ',
      icon: <Activity className="w-5 h-5 text-amber-600" />,
      color: 'amber',
    },
    {
      key: 'accident',
      label: t.catAccident,
      sublabelEn: 'Injury, cut, burn, or household mishap',
      sublabelTh: 'เกิดอุบัติเหตุในห้อง มีดบาด ของหล่นทับ',
      icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      color: 'orange',
    },
    {
      key: 'evacuation',
      label: t.catEvacuation,
      sublabelEn: 'Wheelchair or mobility assistance to exit building',
      sublabelTh: 'ต้องการคนช่วยพยุงหรือช่วยเข็นวีลแชร์อพยพ',
      icon: <Flame className="w-5 h-5 text-red-600" />,
      color: 'red',
    },
    {
      key: 'other',
      label: t.catOther,
      sublabelEn: 'Other urgent distress requiring building staff',
      sublabelTh: 'เหตุฉุกเฉินเดือดร้อนอื่นๆ ที่ต้องการเจ้าหน้าที่ด่วน',
      icon: <PhoneCall className="w-5 h-5 text-teal-600" />,
      color: 'teal',
    },
  ];

  // Dragging logic for Slide to Confirm
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!selectedCategory) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !sliderTrackRef.current || !selectedCategory) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const knobWidth = 56;
    const maxTrack = rect.width - knobWidth;
    const currentX = e.clientX - rect.left - knobWidth / 2;
    const clampedX = Math.max(0, Math.min(currentX, maxTrack));
    const percent = (clampedX / maxTrack) * 100;
    setSliderPosition(percent);

    if (percent >= 85) {
      // Confirmed!
      setIsDragging(false);
      setSliderPosition(100);
      setSliderConfirmed(true);
      triggerResidentSos(selectedCategory);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (sliderPosition < 85) {
      // Spring back to 0
      setSliderPosition(0);
    }
  };

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

  // View when NO active SOS exists: Selection of reason + Slide to Confirm
  if (!activeSosIncident) {
    return (
      <div className="space-y-4 pb-20 animate-in fade-in duration-200">
        {/* Top Header Card */}
        <div className="bg-white rounded-[28px] p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold shadow-xs">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {isThai ? 'ขั้นตอนขอความช่วยเหลือ' : 'EMERGENCY DISPATCH'}
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {isThai ? 'แจ้งขอความช่วยเหลือฉุกเฉิน' : 'Emergency Assistance SOS'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {isThai
              ? 'โปรดเลือกประเภทเหตุฉุกเฉินด้านล่าง แล้วเลื่อนแถบเพื่อยืนยันโทรแจ้งห้องควบคุม'
              : 'Please choose the emergency reason below, then slide to confirm the distress call.'}
          </p>
        </div>

        {/* Step 1: Select Emergency Reason */}
        <div className="bg-white rounded-[28px] p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">
                1
              </span>
              <span>{t.step1SelectReason}</span>
            </span>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                selectedCategory
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}
            >
              {selectedCategory
                ? (isThai ? 'เลือกแล้ว ✓' : 'Selected ✓')
                : (isThai ? 'จำเป็นต้องเลือก' : 'Required')}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.key;

              return (
                <div
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-rose-50/80 border-rose-500 shadow-sm shadow-rose-500/10'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white shadow-xs' : 'bg-white/80'
                      }`}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {c.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {isThai ? c.sublabelTh : c.sublabelEn}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
                      isSelected
                        ? 'bg-rose-600 text-white font-bold'
                        : 'border-2 border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Slide to Confirm SOS (Like picking up phone) */}
        <div className="bg-white rounded-[28px] p-5 border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">
                2
              </span>
              <span>{t.step2SlideToCall}</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {isThai ? 'เลื่อนไปทางขวา' : 'Slide right'}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            {isThai
              ? 'เลื่อนปุ่มสีแดงไปทางขวาสุด เพื่อยืนยันโทรแจ้งเหตุ (ป้องกันการกดผิด)'
              : 'Slide the red button all the way to the right to confirm (prevents accidental calls).'}
          </p>

          {/* Slide Track Container */}
          <div
            ref={sliderTrackRef}
            className={`relative w-full h-16 rounded-full border-2 overflow-hidden select-none touch-none p-1 flex items-center transition-all ${
              selectedCategory
                ? 'bg-slate-100 border-rose-300 shadow-inner'
                : 'bg-slate-100/70 border-slate-200 cursor-not-allowed opacity-80'
            }`}
          >
            {/* Colored Fill Track behind the Knob */}
            {selectedCategory && (
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 to-red-600 transition-all rounded-full"
                style={{ width: `${Math.max(sliderPosition, 10)}%` }}
              ></div>
            )}

            {/* Glowing / Informational Text in Track */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-black tracking-wider px-14 text-center">
              {selectedCategory ? (
                <span className={sliderPosition > 40 ? 'text-white' : 'text-rose-900'}>
                  {t.slidePrompt} ➔➔
                </span>
              ) : (
                <span className="text-slate-400 font-bold flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {isThai
                    ? 'โปรดเลือกประเภทเหตุฉุกเฉินด้านบนก่อน'
                    : 'Please select emergency reason above first'}
                </span>
              )}
            </div>

            {/* Draggable Knob */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`absolute z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                selectedCategory
                  ? 'bg-white text-rose-600 shadow-md border border-rose-300 cursor-grab active:cursor-grabbing hover:scale-105'
                  : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
              }`}
              style={{
                left: `calc(${sliderPosition}% * (1 - 56px / 100%))`,
              }}
            >
              <Phone
                className={`w-6 h-6 fill-current ${
                  selectedCategory ? 'text-rose-600 animate-pulse' : 'text-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Quick Click Fallback for Seniors who prefer tapping */}
          <div className="pt-1 text-center">
            <button
              disabled={!selectedCategory}
              onClick={() => {
                if (!selectedCategory) return;
                setSliderPosition(100);
                triggerResidentSos(selectedCategory);
              }}
              className={`text-[11px] font-bold transition ${
                selectedCategory
                  ? 'text-slate-500 hover:text-rose-600 underline cursor-pointer'
                  : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              {isThai ? 'หรือแตะที่นี่เพื่อยืนยันโทรแจ้งทันที' : 'Or tap here to confirm SOS directly'}
            </button>
          </div>
        </div>

        {/* Location Notice */}
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            {isThai
              ? 'ตำแหน่งจะถูกระบุอัตโนมัติ: ห้องชุด 1204 อาคาร A (จุดอ้างอิง BLE #12-04)'
              : 'Auto-dispatches with simulated location: Unit 1204, Tower A (BLE Anchor #12-04)'}
          </span>
        </div>
      </div>
    );
  }

  // Active SOS Progress Screen (Once confirmed and dispatched!)
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Active Distress Call Card */}
      <div className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 rounded-[30px] p-5 text-white shadow-xl shadow-rose-600/20">
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
      <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-200/80">
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
        <div className="bg-white rounded-[28px] p-4 shadow-sm border border-slate-200/80">
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

      {/* Cancel SOS Option */}
      {!showCancelPrompt ? (
        <button
          onClick={() => setShowCancelPrompt(true)}
          className="w-full py-3.5 rounded-2xl border border-slate-300 hover:border-rose-400 text-slate-600 hover:text-rose-600 text-xs font-bold transition flex items-center justify-center gap-1.5"
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
