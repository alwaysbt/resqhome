import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentSeverity } from '../../types';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    language,
    t,
    notifications,
    markAllNotificationsRead,
    playEmergencyTone,
    isAudioMuted,
    toggleAudioMute,
  } = useApp();

  const isThai = language === 'th';
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filterSeverity === 'all') return true;
    return n.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-300 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-600" />
            <span>{t.severityCritical}</span>
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>{t.severityWarning}</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold border border-sky-300 flex items-center gap-1">
            <Info className="w-3 h-3 text-sky-600" />
            <span>{t.severityInfo}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">{t.notificationsTitle}</h2>
          <p className="text-[11px] text-slate-500">{t.notificationsSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Test / Mute */}
          <button
            onClick={() => {
              playEmergencyTone();
            }}
            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 transition"
            title="Test Emergency Audio Siren Chime"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">{isThai ? 'ทดสอบเสียง' : 'Test Siren'}</span>
          </button>

          <button
            onClick={markAllNotificationsRead}
            className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 text-xs font-semibold flex items-center gap-1 transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{t.markAllRead}</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Pills */}
      <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setFilterSeverity('all')}
          className={`px-3 py-1.5 rounded-xl border transition ${
            filterSeverity === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t.all} ({notifications.length})
        </button>
        <button
          onClick={() => setFilterSeverity('critical')}
          className={`px-3 py-1.5 rounded-xl border transition ${
            filterSeverity === 'critical'
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Critical ({notifications.filter((n) => n.severity === 'critical').length})
        </button>
        <button
          onClick={() => setFilterSeverity('warning')}
          className={`px-3 py-1.5 rounded-xl border transition ${
            filterSeverity === 'warning'
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Warning ({notifications.filter((n) => n.severity === 'warning').length})
        </button>
        <button
          onClick={() => setFilterSeverity('info')}
          className={`px-3 py-1.5 rounded-xl border transition ${
            filterSeverity === 'info'
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Info ({notifications.filter((n) => n.severity === 'info').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">{t.noNotifications}</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-3xl border transition shadow-xs ${
                notif.severity === 'critical'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                  : notif.severity === 'warning'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(notif.severity)}
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  )}
                </div>
                <span className="text-[11px] font-mono opacity-60">{notif.timestamp}</span>
              </div>

              <h4 className="text-xs font-bold leading-snug">
                {isThai ? notif.titleTh : notif.titleEn}
              </h4>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">
                {isThai ? notif.messageTh : notif.messageEn}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
