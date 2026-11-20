import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident, IncidentStatus } from '../../types';
import {
  AlertTriangle,
  Flame,
  Activity,
  CheckCircle2,
  Clock,
  UserPlus,
  XCircle,
  Eye,
  Check,
  Stethoscope,
  ShieldAlert,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

export const IncidentsView: React.FC = () => {
  const {
    language,
    t,
    incidents,
    staff,
    currentRole,
    acknowledgeIncident,
    assignStaffToIncident,
    updateIncidentStatus,
    closeIncident,
  } = useApp();

  const isThai = language === 'th';
  const [selectedIncidentForAssign, setSelectedIncidentForAssign] = useState<Incident | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  // RBAC checks
  const canTriage = currentRole === 'admin' || currentRole === 'security';
  const canUpdateStatus = currentRole === 'admin' || currentRole === 'security' || currentRole === 'responder';

  const handleOpenAssignModal = (incident: Incident) => {
    setSelectedIncidentForAssign(incident);
    setSelectedStaffIds(incident.assignedStaffIds || []);
  };

  const handleConfirmAssignment = () => {
    if (!selectedIncidentForAssign) return;
    assignStaffToIncident(selectedIncidentForAssign.id, selectedStaffIds);
    setSelectedIncidentForAssign(null);
  };

  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId) ? prev.filter((id) => id !== staffId) : [...prev, staffId]
    );
  };

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'reported':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-300 flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>Reported (New)</span>
          </span>
        );
      case 'acknowledged':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Acknowledged</span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-300 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-sky-600" />
            <span>Responders En Route</span>
          </span>
        );
      case 'arrived':
        return (
          <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold border border-teal-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-teal-600" />
            <span>Responders On Site</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Resolved / Closed</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t.navIncidents}</h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'ศูนย์คัดกรองเหตุฉุกเฉิน มอบหมายเจ้าหน้าที่กู้ภัย และติดตามสถานะช่วยเหลือ'
              : 'Real-time emergency triage, responder dispatch, and incident resolution hub'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Active Queue:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono font-bold">
            {incidents.filter((i) => i.status !== 'resolved').length}
          </span>
        </div>
      </div>

      {/* Incidents List Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {incidents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">{t.noActiveIncidents}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">{t.incidentId}</th>
                  <th className="py-3.5 px-4">{t.incidentType}</th>
                  <th className="py-3.5 px-4">{t.incidentLocation}</th>
                  <th className="py-3.5 px-4">{t.incidentTime}</th>
                  <th className="py-3.5 px-4">{t.incidentStatus}</th>
                  <th className="py-3.5 px-4">{t.assignedStaff}</th>
                  <th className="py-3.5 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.map((incident) => {
                  const assignedStaffNames = staff
                    .filter((s) => incident.assignedStaffIds?.includes(s.id))
                    .map((s) => (isThai ? s.nameTh : s.name))
                    .join(', ');

                  return (
                    <tr
                      key={incident.id}
                      className={`hover:bg-slate-50/80 transition ${
                        incident.status !== 'resolved' ? 'bg-white' : 'bg-slate-50/40 opacity-75'
                      }`}
                    >
                      {/* ID */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {incident.id}
                      </td>

                      {/* Type & Title */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">
                          {isThai ? incident.titleTh : incident.titleEn}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {incident.notes}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-800">
                          Floor {incident.floor} {incident.unit ? `• Unit ${incident.unit}` : ''}
                        </span>
                        <div className="text-[10px] text-teal-700 font-medium truncate max-w-[180px]">
                          {incident.locationNote}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-4 font-mono text-slate-600">
                        {incident.reportedAt}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(incident.status)}
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-4 px-4">
                        {assignedStaffNames ? (
                          <div className="flex items-center gap-1.5 font-medium text-teal-800">
                            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                            <span className="truncate max-w-[140px]">{assignedStaffNames}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      {/* Actions Buttons */}
                      <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {incident.status === 'reported' && canTriage && (
                          <button
                            onClick={() => acknowledgeIncident(incident.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition shadow-xs"
                          >
                            {t.ackIncident}
                          </button>
                        )}

                        {incident.status !== 'resolved' && canTriage && (
                          <button
                            onClick={() => handleOpenAssignModal(incident)}
                            className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition shadow-xs"
                          >
                            {t.assignStaffBtn}
                          </button>
                        )}

                        {incident.status === 'dispatched' && canUpdateStatus && (
                          <button
                            onClick={() => updateIncidentStatus(incident.id, 'arrived')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition shadow-xs"
                          >
                            Mark Arrived
                          </button>
                        )}

                        {incident.status !== 'resolved' && canUpdateStatus && (
                          <button
                            onClick={() => closeIncident(incident.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] transition shadow-xs"
                          >
                            {t.closeIncidentBtn}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Assigning Multiple Response Staff */}
      {selectedIncidentForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-teal-700 to-sky-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{t.assignResponderPrompt}</h3>
                <p className="text-[11px] text-teal-100">{selectedIncidentForAssign.id}</p>
              </div>
              <button
                onClick={() => setSelectedIncidentForAssign(null)}
                className="p-1 rounded-lg text-teal-200 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              <span className="text-xs text-slate-500 block">
                {isThai
                  ? 'เลือกรองรับเจ้าหน้าที่ได้หลายคนพร้อมกันสำหรับเหตุฉุกเฉินที่ต้องการทีมช่วยเหลือ:'
                  : 'Select one or more response personnel to dispatch:'}
              </span>

              <div className="space-y-2">
                {staff
                  .filter((s) => s.role === 'responder' || s.role === 'security')
                  .map((staffMember) => {
                    const isSelected = selectedStaffIds.includes(staffMember.id);
                    return (
                      <div
                        key={staffMember.id}
                        onClick={() => toggleStaffSelection(staffMember.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-50 border-teal-300 ring-2 ring-teal-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                            {staffMember.name[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {isThai ? staffMember.nameTh : staffMember.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {isThai ? staffMember.roleTitleTh : staffMember.roleTitleEn}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            isSelected ? 'bg-teal-600 text-white font-bold' : 'border border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedIncidentForAssign(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmAssignment}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm"
              >
                {t.confirm} ({selectedStaffIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
