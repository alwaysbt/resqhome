import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Watch,
  User,
  Heart,
  ChevronRight,
  MapPin,
  Bell,
  Battery,
  Flame,
  Activity,
  MessageSquare,
  Sparkles,
  Accessibility,
  CheckCircle2,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'emergency' | 'evacuation' | 'notifications' | 'profile' | 'settings') => void;
  onOpenWearableModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenWearableModal }) => {
  const {
    language,
    t,
    resident,
    activeScenario,
    activeSos,
    triggerResidentSos,
    notifications,
    staff,
  } = useApp();

  const isThai = language === 'th';
  const hasAlert = activeScenario !== 'normal' || activeSos;
  const recentNotifications = notifications.slice(0, 1);
  const onDutyResponder = staff.find((s) => s.role === 'responder' && s.onDuty) || staff[2];

  // Auto age helper
  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(resident.birthDate);

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Top Welcome Bar (Clean, friendly style matching reference) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 p-0.5 bg-white shadow-xs cursor-pointer hover:scale-105 transition"
          >
            {resident.photoUrl ? (
              <img
                src={resident.photoUrl}
                alt={resident.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium">
                {isThai ? 'สวัสดี,' : 'Hello,'}
              </span>
              <span className="text-base font-bold text-slate-900">
                {isThai ? resident.nameTh.split(' ')[0] : resident.name.split(' ')[0]}!
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="w-3 h-3 text-teal-600" />
              <span>{resident.tower} • Unit {resident.unit}</span>
            </div>
          </div>
        </div>

        {/* Top Notification Bell with unread dot */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative p-2.5 rounded-full bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 shadow-xs transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {notifications.some((n) => !n.read) && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
          )}
        </button>
      </div>

      {/* Main Page Heading */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {isThai ? 'ความปลอดภัยและสุขภาพ' : 'Safety & Heart Health'}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {isThai
            ? 'ระบบเฝ้าระวังอัตโนมัติประจำห้องชุด 1204'
            : 'Automated residential life-safety monitoring'}
        </p>
      </div>

      {/* Card 1: Building Safety Status (Clean Pastel Mint Card inspired by UI reference) */}
      <div
        className={`p-4 rounded-[28px] border transition-all ${
          hasAlert
            ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
            : 'bg-[#eaf8ee] border-emerald-200/70 text-slate-900'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                hasAlert ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-500 text-white'
              }`}
            >
              {hasAlert ? <Flame className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isThai ? 'สถานะอาคาร' : 'BUILDING STATUS'}
              </span>
              <h2 className="text-sm font-extrabold text-slate-900">
                {hasAlert ? t.buildingStatusAlert : t.buildingStatusNormal}
              </h2>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              hasAlert
                ? 'bg-rose-200 text-rose-900'
                : 'bg-white/80 text-emerald-800 border border-emerald-200'
            }`}
          >
            {hasAlert ? 'ALERT' : 'NORMAL'}
          </span>
        </div>

        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
          {hasAlert ? t.buildingStatusDescAlert : t.buildingStatusDescNormal}
        </p>

        {hasAlert && (
          <button
            onClick={() => onNavigate('evacuation')}
            className="mt-3 w-full py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <span>{isThai ? 'ดูเส้นทางอพยพหนีไฟ' : 'View Evacuation Route'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card 2: Prominent One-Tap SOS Button (Large Touch Target for Elderly) */}
      <div className="bg-white rounded-[30px] p-5 border border-slate-200/90 shadow-sm text-center">
        <div className="flex items-center justify-between mb-3 text-left">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isThai ? 'ปุ่มขอความช่วยเหลือฉุกเฉิน' : 'Emergency Assistance Button'}
            </h3>
            <p className="text-xs text-slate-500">
              {isThai ? 'กดเพื่อส่งสัญญาณขอความช่วยเหลือทันที' : 'One-tap direct dispatch to Control Room'}
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        </div>

        <button
          onClick={() => {
            if (!activeSos) {
              triggerResidentSos('medical');
            }
            onNavigate('emergency');
          }}
          className={`w-full py-5 rounded-2xl font-black text-white text-lg tracking-wider shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-1 active:scale-95 ${
            activeSos
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25 animate-emergency-pulse'
              : 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 shadow-rose-600/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-7 h-7" />
            <span>{activeSos ? t.activeSosTitle.toUpperCase() : t.sosButtonLabel}</span>
          </div>
          <span className="text-[11px] font-normal text-rose-100 tracking-normal">
            {activeSos
              ? isThai ? 'กำลังดำเนินการช่วยเหลือ — แตะดูสถานะ' : 'Assistance in Progress — Tap to view'
              : isThai ? 'แตะ 1 ครั้งเพื่อแจ้งเจ้าหน้าที่กู้ภัย' : 'Tap for instant response team dispatch'}
          </span>
        </button>
      </div>

      {/* Card 3: Vital Signs & Heart Health (Soft Sky Blue Card matching Image 1) */}
      <div className="bg-[#eaf4fc] rounded-[28px] p-4 border border-sky-200/80 text-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                {isThai ? 'สัญญาณชีพและนาฬิกา' : 'VITAL SIGNS & WEARABLE'}
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                {resident.wearable.model}
              </h4>
            </div>
          </div>

          <button
            onClick={onOpenWearableModal}
            className="text-[11px] font-bold text-sky-700 bg-white px-2.5 py-1 rounded-full border border-sky-200 hover:bg-sky-50 transition"
          >
            {isThai ? 'ทดสอบ' : 'Simulate'}
          </button>
        </div>

        {/* Pulse & ECG Waveform Display */}
        <div className="bg-white rounded-2xl p-3 border border-sky-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {isThai ? 'อัตราการเต้นหัวใจ' : 'HEARTBEAT'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black font-mono text-slate-900">
                {resident.wearable.heartRate}
              </span>
              <span className="text-xs text-slate-500 font-semibold">bpm</span>
            </div>
          </div>

          {/* Stylized ECG Curve SVG (Inspired by Image 1) */}
          <div className="w-28 h-10 flex items-center">
            <svg viewBox="0 0 100 30" className="w-full h-full text-sky-500">
              <path
                d="M 0 15 L 20 15 L 25 10 L 30 20 L 35 3 L 40 27 L 45 15 L 55 15 L 60 11 L 65 19 L 70 15 L 100 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Sub-metrics: Blood Pressure & Battery */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-2xl p-2.5 border border-sky-100">
            <span className="text-[10px] text-slate-400 block font-semibold">
              {isThai ? 'ความดันโลหิต' : 'BLOOD PRESSURE'}
            </span>
            <span className="font-extrabold text-sm text-slate-900 font-mono">124 / 82</span>
            <span className="text-[10px] text-slate-400 block">mmHg</span>
          </div>

          <div className="bg-white rounded-2xl p-2.5 border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">
                {isThai ? 'แบตเตอรี่' : 'BATTERY'}
              </span>
              <span className="font-extrabold text-sm text-slate-900 font-mono">
                {resident.wearable.batteryLevel}%
              </span>
              <span className="text-[10px] text-emerald-600 block font-semibold">Normal</span>
            </div>
            <Battery className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Card 4: Quick Contact / On-Duty Responder (Warm Butter Yellow Card inspired by Robert Fox in Image 1) */}
      <div className="bg-[#fefce8] rounded-[28px] p-4 border border-amber-200/80 text-slate-900 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-white shrink-0">
            {onDutyResponder.avatar ? (
              <img
                src={onDutyResponder.avatar}
                alt={onDutyResponder.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-200 flex items-center justify-center font-bold text-amber-900">
                {onDutyResponder.name[0]}
              </div>
            )}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
              {isThai ? 'เจ้าหน้าที่กู้ภัยประจำอาคาร' : 'ON-DUTY FIRST RESPONDER'}
            </span>
            <h4 className="text-xs font-bold text-slate-900">
              {isThai ? onDutyResponder.nameTh : onDutyResponder.name}
            </h4>
            <span className="text-[10.5px] text-slate-600 block">
              {isThai ? 'ทีมกู้ชีพฉุกเฉินชั้น 6' : 'Emergency Team Alpha'}
            </span>
          </div>
        </div>

        {/* Direct Call & Message Action Buttons (Matching Image 1) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onNavigate('emergency')}
            className="w-9 h-9 rounded-full bg-white hover:bg-amber-100 border border-amber-200 text-amber-900 flex items-center justify-center transition shadow-xs"
            title="Message Responder"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <a
            href={`tel:${onDutyResponder.phone}`}
            className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition shadow-xs shadow-amber-500/20"
            title="Call Responder"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Card 5: Life-Safety & Declared Needs Summary */}
      <div
        onClick={() => onNavigate('profile')}
        className="bg-white rounded-[28px] p-4 border border-slate-200/80 shadow-xs hover:border-teal-300 transition cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{isThai ? 'ข้อมูลการแพทย์ของฉัน' : 'My Health & Safety Profile'}</span>
          </div>
          <span className="text-xs text-teal-600 font-semibold flex items-center gap-0.5">
            <span>{isThai ? 'แก้ไข' : 'Edit'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 block">{t.age}</span>
            <span className="font-bold text-slate-800">{age} {t.yearsOld}</span>
          </div>
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 block">Assistance</span>
            <span className="font-bold text-teal-700 truncate block">
              {resident.medicalInfo.wheelchairUser ? '♿ Wheelchair' : resident.assistanceCategory}
            </span>
          </div>
          <div className="p-2 rounded-2xl bg-rose-50 border border-rose-100 text-center">
            <span className="text-[10px] text-rose-500 block font-bold">Allergy</span>
            <span className="font-bold text-rose-700 truncate block">
              {resident.medicalInfo.allergies ? 'Penicillin' : 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
