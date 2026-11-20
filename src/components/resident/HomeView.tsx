import React from 'react';
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
  ArrowRight,
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
  } = useApp();

  const isThai = language === 'th';
  const hasAlert = activeScenario !== 'normal' || activeSos;
  const recentNotifications = notifications.slice(0, 2);

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
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Calm & Welcoming Header Banner */}
      <div className="bg-gradient-to-br from-teal-600 via-sky-600 to-blue-700 rounded-3xl p-5 text-white shadow-lg shadow-teal-500/10">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-teal-100 font-medium">
              {t.greeting}
            </span>
            <h1 className="text-xl font-bold tracking-tight">
              {isThai ? resident.nameTh : resident.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-teal-100 mt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-200" />
              <span>
                {resident.tower} • {t.floor} {resident.floor} • {t.unit} {resident.unit}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 overflow-hidden flex items-center justify-center hover:scale-105 transition"
          >
            {resident.photoUrl ? (
              <img src={resident.photoUrl} alt={resident.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Building Safety Status Indicator */}
        <div className={`mt-4 p-3 rounded-2xl border transition flex items-center gap-3 ${
          hasAlert
            ? 'bg-rose-950/50 border-rose-400 text-rose-100 animate-pulse'
            : 'bg-white/15 border-white/25 text-white'
        }`}>
          <div className={`p-2 rounded-xl ${hasAlert ? 'bg-rose-500 text-white' : 'bg-emerald-400 text-emerald-950'}`}>
            {hasAlert ? (
              activeScenario === 'fire' ? <Flame className="w-4 h-4" /> : <Activity className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold">
              {hasAlert ? t.buildingStatusAlert : t.buildingStatusNormal}
            </div>
            <div className="text-[11px] opacity-90 line-clamp-1">
              {hasAlert ? t.buildingStatusDescAlert : t.buildingStatusDescNormal}
            </div>
          </div>
          {hasAlert && (
            <button
              onClick={() => onNavigate('evacuation')}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-xs transition"
            >
              {isThai ? 'ดูแผนอพยพ' : 'Evac Map'}
            </button>
          )}
        </div>
      </div>

      {/* Prominent One-Tap SOS Button */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 text-center">
        <div className="mb-3">
          <h2 className="text-sm font-bold text-slate-800">
            {t.sosButtonSubtext}
          </h2>
          <p className="text-[11px] text-slate-500">
            {isThai
              ? 'แตะปุ่มเพื่อแจ้งห้องควบคุมและส่งทีมช่วยเหลือทันที'
              : 'Directly alerts Security Control Room & dispatches staff'}
          </p>
        </div>

        <button
          onClick={() => {
            if (!activeSos) {
              triggerResidentSos('medical');
            }
            onNavigate('emergency');
          }}
          className={`w-full py-5 rounded-2xl font-black text-white text-lg tracking-wider shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
            activeSos
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25 animate-emergency-pulse'
              : 'bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 shadow-rose-600/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-7 h-7" />
            <span>{activeSos ? t.activeSosTitle.toUpperCase() : t.sosButtonLabel}</span>
          </div>
          <span className="text-[11px] font-medium text-rose-100 tracking-normal">
            {activeSos
              ? isThai ? 'กำลังดำเนินการช่วยเหลือ — แตะดูสถานะ' : 'Assistance in Progress — Tap to view'
              : isThai ? 'กดเพื่อขอความช่วยเหลือฉุกเฉินทันที' : 'One-Tap Instant Life-Safety Dispatch'}
          </span>
        </button>
      </div>

      {/* Personalized Life-Safety Summary Card */}
      <div
        onClick={() => onNavigate('profile')}
        className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 hover:border-teal-300 transition cursor-pointer"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{t.quickMedicalInfo}</span>
          </div>
          <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-0.5">
            <span>{isThai ? 'แก้ไข' : 'Edit'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">{t.age}</span>
            <span className="font-bold text-slate-800">{age} {t.yearsOld}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">{isThai ? 'ความต้องการพิเศษ' : 'Assistance Need'}</span>
            <span className="font-bold text-teal-700 uppercase">
              {resident.medicalInfo.wheelchairUser ? '♿ Wheelchair' : resident.assistanceCategory}
            </span>
          </div>
        </div>

        {resident.medicalInfo.allergies && (
          <div className="mt-2 p-2 rounded-xl bg-rose-50 border border-rose-100 text-[11px] text-rose-900 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">
              <strong>{isThai ? 'แพ้ยา:' : 'Allergies:'}</strong> {resident.medicalInfo.allergies}
            </span>
          </div>
        )}
      </div>

      {/* Wearable Device Status Widget */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Watch className="w-4 h-4 text-sky-600" />
            <span>{t.wearableStatusTitle}</span>
          </div>
          <button
            onClick={onOpenWearableModal}
            className="text-[11px] text-sky-600 font-semibold hover:underline"
          >
            {isThai ? 'ทดสอบจำลอง' : 'Simulate'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                resident.wearable.connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            ></span>
            <div>
              <div className="font-bold text-slate-800">{resident.wearable.model}</div>
              <div className="text-[10.5px] text-slate-500">
                {resident.wearable.connected ? t.wearableConnected : t.wearableDisconnected} • {resident.wearable.lastSync}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-[10px] text-slate-400 block">{t.bpm}</span>
              <span className="font-bold text-slate-800">{resident.wearable.heartRate}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-700 font-bold">
              <Battery className={`w-4 h-4 ${resident.wearable.batteryLevel < 20 ? 'text-rose-500' : 'text-emerald-500'}`} />
              <span>{resident.wearable.batteryLevel}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Shortcut */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Phone className="w-4 h-4 text-teal-600" />
            <span>{t.quickEmergencyContacts}</span>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-[11px] text-teal-600 font-semibold hover:underline"
          >
            {isThai ? 'ดูทั้งหมด' : 'View all'}
          </button>
        </div>

        <div className="space-y-1.5">
          {resident.emergencyContacts.slice(0, 2).map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div>
                <span className="font-semibold text-slate-800">{contact.name}</span>
                <span className="text-[10.5px] text-slate-500 ml-1.5">({contact.relationship})</span>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-mono text-[11px] font-semibold border border-teal-200 hover:bg-teal-100 transition"
              >
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{t.recentNotifications}</span>
            </div>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-[11px] text-amber-600 font-semibold hover:underline"
            >
              {t.viewAllNotifications}
            </button>
          </div>

          <div className="space-y-1.5">
            {recentNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-2.5 rounded-xl border text-xs ${
                  notif.severity === 'critical'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{isThai ? notif.titleTh : notif.titleEn}</span>
                  <span className="text-[10px] font-normal opacity-70">{notif.timestamp}</span>
                </div>
                <p className="text-[11px] opacity-90 mt-0.5 line-clamp-1">
                  {isThai ? notif.messageTh : notif.messageEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
