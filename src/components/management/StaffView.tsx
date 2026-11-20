import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  UserCheck,
  Phone,
  MapPin,
  Clock,
  ToggleLeft,
  ToggleRight,
  Shield,
  Briefcase,
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { language, t, staff, updateStaff } = useApp();
  const isThai = language === 'th';

  const toggleOnDuty = (staffId: string, current: boolean) => {
    updateStaff(staffId, { onDuty: !current });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <span>{t.staffRosterTitle}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'รายชื่อเจ้าหน้าที่รักษาความปลอดภัย นิติบุคคล และทีมตอบสนองเหตุฉุกเฉินประจำอาคาร'
              : 'Active operational personnel, deployment duty state, and active incident response'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>On Duty Personnel:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-600 text-white font-mono font-bold">
            {staff.filter((s) => s.onDuty).length} / {staff.length}
          </span>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-teal-300 transition space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center overflow-hidden border border-teal-700 shadow-xs">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name[0]
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {isThai ? member.nameTh : member.name}
                  </h3>
                  <span className="text-[11px] text-teal-700 font-semibold block">
                    {isThai ? member.roleTitleTh : member.roleTitleEn}
                  </span>
                </div>
              </div>

              {/* On Duty Toggle */}
              <button
                onClick={() => toggleOnDuty(member.id, member.onDuty)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1 ${
                  member.onDuty
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${member.onDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span>{member.onDuty ? t.onDutyBadge : t.offDutyBadge}</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{member.location || 'On Site'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`tel:${member.phone}`} className="font-mono text-teal-700 font-semibold hover:underline">
                  {member.phone}
                </a>
              </div>
            </div>

            {/* Assignments */}
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                {t.currentAssignment}:
              </span>
              {member.assignedIncidents.length > 0 ? (
                <div className="space-y-1">
                  {member.assignedIncidents.map((incId) => (
                    <span
                      key={incId}
                      className="inline-block px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-mono font-bold mr-1"
                    >
                      {incId}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic">Available on standby</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
