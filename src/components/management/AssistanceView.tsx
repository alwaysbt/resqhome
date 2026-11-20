import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident } from '../../types';
import {
  LifeBuoy,
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame,
  Accessibility,
  PhoneCall,
  UserPlus,
} from 'lucide-react';

export const AssistanceView: React.FC = () => {
  const {
    language,
    t,
    incidents,
    residentsList,
    staff,
    currentRole,
    assignStaffToIncident,
    updateIncidentStatus,
  } = useApp();

  const isThai = language === 'th';
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Assistance requests: all active incidents requiring physical assistance
  const assistanceIncidents = incidents.filter(
    (i) => i.status !== 'resolved' && (i.type === 'medical' || i.type === 'fall' || i.type === 'evacuation' || i.type === 'accident' || i.type === 'other')
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-teal-600" />
            <span>{t.assistanceQueueTitle}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'รายการคำขอความช่วยเหลือเร่งด่วนเฉพาะบุคคล การมอบหมายเจ้าหน้าที่ และการยืนยันความปลอดภัย'
              : 'Direct resident dispatch queue, multi-staff responder assignment, and completion tracking'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Pending Requests:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono font-bold text-xs">
            {assistanceIncidents.length}
          </span>
        </div>
      </div>

      {/* Assistance Queue Cards */}
      <div className="space-y-3">
        {assistanceIncidents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              {isThai ? 'ไม่มีคำขอความช่วยเหลือคงค้าง' : 'No pending assistance requests at this time.'}
            </p>
          </div>
        ) : (
          assistanceIncidents.map((incident) => {
            const resident = residentsList.find((r) => r.id === incident.residentId);
            const assignedStaffMembers = staff.filter((s) =>
              incident.assignedStaffIds?.includes(s.id)
            );

            return (
              <div
                key={incident.id}
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:border-teal-300 transition space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
                    <span className="font-bold text-sm text-slate-900">
                      {isThai ? incident.titleTh : incident.titleEn}
                    </span>
                    <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                      {incident.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{incident.reportedAt}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                      {incident.status}
                    </span>
                  </div>
                </div>

                {/* Resident Details & Declared Needs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">RESIDENT</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      {resident ? (isThai ? resident.nameTh : resident.name) : 'Unknown Resident'}
                    </div>
                    <div className="text-[11px] text-teal-700 mt-0.5">
                      Floor {incident.floor} • Unit {incident.unit || 'Common'}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[10px] text-amber-800 block font-semibold">DECLARED NEED</span>
                    <div className="font-bold text-amber-950 text-sm mt-0.5 flex items-center gap-1.5">
                      {resident?.medicalInfo.wheelchairUser && <Accessibility className="w-4 h-4 text-amber-600" />}
                      <span>{resident?.assistanceCategory.toUpperCase() || 'STANDARD'}</span>
                    </div>
                    <div className="text-[11px] text-amber-800 mt-0.5">
                      {resident?.medicalInfo.mobilityLimitations || 'Standard evacuation'}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold">ASSIGNED RESPONDERS</span>
                    <div className="mt-1 space-y-1">
                      {assignedStaffMembers.length > 0 ? (
                        assignedStaffMembers.map((s) => (
                          <div key={s.id} className="font-bold text-teal-800 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                            <span>{isThai ? s.nameTh : s.name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No responders assigned yet</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="text-[11px] text-slate-500 font-mono">
                    BLE Proximity: {incident.locationNote}
                  </div>

                  <div className="flex items-center gap-2">
                    {incident.status === 'reported' && (
                      <button
                        onClick={() => assignStaffToIncident(incident.id, ['staff-resp-1', 'staff-resp-2'])}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Dispatch Alpha & Beta Teams</span>
                      </button>
                    )}

                    {incident.status === 'dispatched' && (
                      <button
                        onClick={() => updateIncidentStatus(incident.id, 'arrived')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{t.markArrived}</span>
                      </button>
                    )}

                    {incident.status === 'arrived' && (
                      <button
                        onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.markAssistedCompleted}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
