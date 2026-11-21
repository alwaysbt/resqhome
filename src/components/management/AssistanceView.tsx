import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident, IncidentStatus } from '../../types';
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
  Filter,
  Activity,
  AlertTriangle,
  Stethoscope,
  XCircle,
  Eye,
  Building,
} from 'lucide-react';

export const AssistanceView: React.FC = () => {
  const {
    language,
    t,
    incidents,
    residentsList,
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
  const [filterType, setFilterType] = useState<'all' | 'assistance' | 'hazards'>('all');

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

  const filteredIncidents = incidents.filter((incident) => {
    if (filterType === 'all') return true;
    if (filterType === 'assistance') {
      return ['medical', 'fall', 'accident', 'evacuation', 'other'].includes(incident.type);
    }
    if (filterType === 'hazards') {
      return ['fire', 'earthquake'].includes(incident.type);
    }
    return true;
  });

  const activeCount = incidents.filter((i) => i.status !== 'resolved').length;
  const reportedCount = incidents.filter((i) => i.status === 'reported').length;
  const dispatchedCount = incidents.filter((i) => i.status === 'dispatched' || i.status === 'arrived').length;

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'reported':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold border border-rose-300 flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>{isThai ? 'แจ้งใหม่ (รอดำเนินการ)' : 'Reported (Pending)'}</span>
          </span>
        );
      case 'acknowledged':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{isThai ? 'รับเรื่องแล้ว' : 'Acknowledged'}</span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-300 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-sky-600" />
            <span>{isThai ? 'ส่งทีมช่วยเหลือแล้ว' : 'Responders En Route'}</span>
          </span>
        );
      case 'arrived':
        return (
          <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold border border-teal-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-teal-600" />
            <span>{isThai ? 'ถึงจุดเกิดเหตุแล้ว' : 'On Scene'}</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{isThai ? 'เสร็จสิ้น / ปิดเคส' : 'Resolved'}</span>
          </span>
        );
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <Stethoscope className="w-4 h-4 text-rose-600" />;
      case 'fall':
        return <Activity className="w-4 h-4 text-amber-600" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-red-600" />;
      case 'earthquake':
        return <Activity className="w-4 h-4 text-amber-600" />;
      case 'evacuation':
        return <Accessibility className="w-4 h-4 text-orange-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isThai ? 'คำขอความช่วยเหลือและเหตุฉุกเฉิน' : 'Assistance Requests & Live Incidents'}
              </h2>
              <p className="text-xs text-slate-500">
                {isThai
                  ? 'ศูนย์รวมคำขอความช่วยเหลือจากลูกบ้าน และการจัดการเหตุฉุกเฉินอาคาร'
                  : 'Unified resident distress requests, dispatch triage, and active incident response'}
              </p>
            </div>
          </div>
        </div>

        {/* Triage Stats Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
            <span>Total Active: </span>
            <span className="font-mono font-bold text-slate-900">{activeCount}</span>
          </div>
          {reportedCount > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 font-bold animate-pulse">
              <span>Need Triage: </span>
              <span className="font-mono">{reportedCount}</span>
            </div>
          )}
          <div className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-800 border border-sky-300 font-semibold">
            <span>Dispatched: </span>
            <span className="font-mono font-bold">{dispatchedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-2 rounded-2xl border transition ${
            filterType === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isThai ? 'คำขอทั้งหมด' : 'All Requests & Incidents'} ({incidents.length})
        </button>

        <button
          onClick={() => setFilterType('assistance')}
          className={`px-3.5 py-2 rounded-2xl border transition flex items-center gap-1.5 ${
            filterType === 'assistance'
              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>{isThai ? 'คำขอช่วยเหลือลูกบ้าน (SOS / Medical / Fall)' : 'Resident Assistance & SOS'}</span>
        </button>

        <button
          onClick={() => setFilterType('hazards')}
          className={`px-3.5 py-2 rounded-2xl border transition flex items-center gap-1.5 ${
            filterType === 'hazards'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{isThai ? 'เหตุเตือนภัยอาคาร (ไฟไหม้ / แผ่นดินไหว)' : 'Building Hazards (Fire / Seismic)'}</span>
        </button>
      </div>

      {/* Unified Incident & Assistance List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              {isThai ? 'ไม่มีเหตุฉุกเฉินหรือคำขอความช่วยเหลือในขณะนี้' : 'No active assistance requests or building incidents.'}
            </p>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const resident = residentsList.find((r) => r.id === incident.residentId);
            const assignedStaffMembers = staff.filter((s) =>
              incident.assignedStaffIds?.includes(s.id)
            );
            const isResolved = incident.status === 'resolved';

            return (
              <div
                key={incident.id}
                className={`bg-white rounded-3xl p-5 border transition space-y-3.5 shadow-xs ${
                  !isResolved ? 'border-slate-200 hover:border-teal-300' : 'border-slate-100 opacity-70 bg-slate-50/50'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      {getIncidentIcon(incident.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {isThai ? incident.titleTh : incident.titleEn}
                        </span>
                        <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                          {incident.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Floor {incident.floor} {incident.unit ? `• Unit ${incident.unit}` : ''} • Reported at {incident.reportedAt}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(incident.status)}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Resident Info or Hazard Scope */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      {resident ? 'RESIDENT' : 'LOCATION SCOPE'}
                    </span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      {resident ? (isThai ? resident.nameTh : resident.name) : incident.locationNote}
                    </div>
                    <div className="text-[11px] text-teal-700 mt-0.5 truncate">
                      {resident ? `Unit ${resident.unit} • Tel: ${resident.phone}` : 'Building Facility'}
                    </div>
                  </div>

                  {/* Declared Need or Hazard Notes */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[10px] text-amber-800 block font-semibold uppercase">
                      {resident ? 'DECLARED ASSISTANCE NEED' : 'HAZARD DETAILS'}
                    </span>
                    <div className="font-bold text-amber-950 text-sm mt-0.5 flex items-center gap-1.5">
                      {resident?.medicalInfo.wheelchairUser && <Accessibility className="w-4 h-4 text-amber-600" />}
                      <span className="truncate">
                        {resident ? resident.assistanceCategory.toUpperCase() : incident.notes}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-800 mt-0.5 truncate">
                      {resident?.medicalInfo.mobilityLimitations || incident.notes}
                    </div>
                  </div>

                  {/* Assigned Staff */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      ASSIGNED RESPONSE PERSONNEL
                    </span>
                    <div className="mt-1 space-y-1">
                      {assignedStaffMembers.length > 0 ? (
                        assignedStaffMembers.map((s) => (
                          <div key={s.id} className="font-bold text-teal-800 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 truncate">
                              <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span className="truncate">{isThai ? s.nameTh : s.name}</span>
                            </span>
                            <a href={`tel:${s.phone}`} className="font-mono text-teal-700 hover:underline">
                              {s.phone}
                            </a>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">No responders assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {incident.locationNote}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Acknowledge Button */}
                    {incident.status === 'reported' && canTriage && (
                      <button
                        onClick={() => acknowledgeIncident(incident.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-xs"
                      >
                        {t.ackIncident}
                      </button>
                    )}

                    {/* Assign Staff Button */}
                    {!isResolved && canTriage && (
                      <button
                        onClick={() => handleOpenAssignModal(incident)}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{assignedStaffMembers.length > 0 ? 'Reassign Staff' : 'Assign Responders'}</span>
                      </button>
                    )}

                    {/* Mark Arrived Button */}
                    {incident.status === 'dispatched' && canUpdateStatus && (
                      <button
                        onClick={() => updateIncidentStatus(incident.id, 'arrived')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Mark On Scene</span>
                      </button>
                    )}

                    {/* Resolve / Close Button */}
                    {!isResolved && canUpdateStatus && (
                      <button
                        onClick={() => closeIncident(incident.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.closeIncidentBtn}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Staff Assignment Modal */}
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
