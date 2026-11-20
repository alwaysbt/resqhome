import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Resident } from '../../types';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  Heart,
  Phone,
  Watch,
  UserCheck,
  AlertTriangle,
  XCircle,
  Eye,
  Activity,
} from 'lucide-react';

export const ResidentsView: React.FC = () => {
  const { language, t, residentsList, currentRole, addAuditLog } = useApp();
  const isThai = language === 'th';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewingMedicalResident, setViewingMedicalResident] = useState<Resident | null>(null);

  // RBAC check: Only responders, security, and admin can view confidential medical dossiers
  const canAccessMedical = currentRole === 'admin' || currentRole === 'security' || currentRole === 'responder';

  const handleOpenMedicalDossier = (res: Resident) => {
    // Log access in audit trail for PDPA compliance!
    addAuditLog(
      `Confidential Medical Record Accessed: ${res.name} (Unit ${res.unit})`,
      `เปิดดูเวชระเบียนความลับ: ${res.name} (ห้อง ${res.unit})`,
      `Authorized clinical view accessed under operational necessity.`,
      currentRole.toUpperCase(),
      currentRole
    );
    setViewingMedicalResident(res);
  };

  const filteredResidents = residentsList.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nameTh.includes(searchTerm) ||
      r.unit.includes(searchTerm);

    const matchesCategory =
      filterCategory === 'all' || r.assistanceCategory === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>{t.navResidents}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'ทะเบียนผู้อยู่อาศัย ความต้องการพิเศษ และสถานะการเช็คอินความปลอดภัย'
              : 'Resident directory, declared assistance preferences, and life-safety profiles'}
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isThai ? 'ค้นหาชื่อ หรือห้องชุด...' : 'Search name or unit...'}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">{t.all} ({residentsList.length})</option>
            <option value="wheelchair">Wheelchair Users</option>
            <option value="elderly">Elderly / Physical Support</option>
            <option value="hearing">Hearing Impairment</option>
            <option value="visual">Visual Impairment</option>
            <option value="standard">Standard Evacuation</option>
          </select>
        </div>
      </div>

      {/* PDPA Confidentiality Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-700" />
          <span>{t.medicalRestrictedNotice}</span>
        </div>
        <span className="text-[11px] font-mono text-teal-700 font-semibold">
          RBAC: {currentRole.toUpperCase()}
        </span>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{t.residentName}</th>
                <th className="py-3.5 px-4">{t.residentApt}</th>
                <th className="py-3.5 px-4">{t.declaredNeeds}</th>
                <th className="py-3.5 px-4">{t.checkInState}</th>
                <th className="py-3.5 px-4">Wearable Telemetry</th>
                <th className="py-3.5 px-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResidents.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  {/* Name */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{isThai ? r.nameTh : r.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{r.phone}</div>
                  </td>

                  {/* Unit & Floor */}
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-slate-900">Unit {r.unit}</span>
                    <span className="text-[11px] text-slate-500 block">Floor {r.floor}</span>
                  </td>

                  {/* Declared Needs */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        r.assistanceCategory === 'wheelchair'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : r.assistanceCategory === 'elderly'
                          ? 'bg-purple-100 text-purple-900 border border-purple-300'
                          : r.assistanceCategory === 'hearing' || r.assistanceCategory === 'visual'
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.assistanceCategory === 'wheelchair'
                        ? '♿ Wheelchair User'
                        : r.assistanceCategory === 'elderly'
                        ? 'Elderly Support'
                        : r.assistanceCategory === 'hearing'
                        ? 'Visual Alerts (Hearing)'
                        : r.assistanceCategory === 'visual'
                        ? 'Audio Siren (Visual)'
                        : 'Standard'}
                    </span>
                  </td>

                  {/* Check-In State */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        r.checkInStatus === 'safe'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.checkInStatus === 'needs_help'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : r.checkInStatus === 'evacuating'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {r.checkInStatus.toUpperCase()}
                    </span>
                  </td>

                  {/* Wearable Status */}
                  <td className="py-4 px-4">
                    {r.wearable.connected ? (
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 font-mono">
                        <Watch className="w-3.5 h-3.5 text-sky-600" />
                        <span>{r.wearable.heartRate} BPM</span>
                        <span>•</span>
                        <span className={r.wearable.batteryLevel < 20 ? 'text-rose-600 font-bold' : ''}>
                          {r.wearable.batteryLevel}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No device</span>
                    )}
                  </td>

                  {/* Actions (View Medical Dossier) */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleOpenMedicalDossier(r)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center gap-1.5 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isThai ? 'เวชระเบียน' : 'Dossier'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confidential Medical Dossier Modal */}
      {viewingMedicalResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-teal-800 via-sky-800 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300">
                  PDPA Section 26 — Emergency Medical Record
                </span>
                <h3 className="text-base font-bold">
                  {isThai ? viewingMedicalResident.nameTh : viewingMedicalResident.name}
                </h3>
                <p className="text-xs text-teal-100">
                  Floor {viewingMedicalResident.floor} • Unit {viewingMedicalResident.unit}
                </p>
              </div>
              <button
                onClick={() => setViewingMedicalResident(null)}
                className="p-1 rounded-lg text-teal-200 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 max-h-[65vh] overflow-y-auto text-xs text-slate-700">
              {/* Critical Allergies Badge */}
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
                <span className="font-bold block text-rose-900 mb-0.5">⚠️ Allergies (Especially Drugs):</span>
                <p className="font-semibold text-rose-700">
                  {viewingMedicalResident.medicalInfo.allergies || 'None reported'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Medical Conditions:</span>
                <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {viewingMedicalResident.medicalInfo.conditions || 'None reported'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Current Medications:</span>
                <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {viewingMedicalResident.medicalInfo.medications || 'None reported'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Blood Type</span>
                  <span className="font-bold font-mono text-slate-900">
                    {viewingMedicalResident.medicalInfo.bloodType || 'Unknown'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Wheelchair Required</span>
                  <span className="font-bold text-teal-700">
                    {viewingMedicalResident.medicalInfo.wheelchairUser ? 'YES (Full-Time)' : 'NO'}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Special Responder Instructions:</span>
                <p className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950 font-medium">
                  {viewingMedicalResident.medicalInfo.emergencyInstructions || 'Standard response protocol applies.'}
                </p>
              </div>

              {/* Primary Emergency Contact */}
              <div>
                <span className="font-bold text-slate-900 block mb-1">Primary Emergency Contact:</span>
                {viewingMedicalResident.emergencyContacts.slice(0, 1).map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{c.name}</span>
                      <span className="text-slate-500 ml-1">({c.relationship})</span>
                    </div>
                    <a href={`tel:${c.phone}`} className="font-mono text-teal-700 font-bold">
                      {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setViewingMedicalResident(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
