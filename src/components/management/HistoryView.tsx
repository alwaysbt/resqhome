import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  ShieldAlert,
  Lock,
  UserCheck,
  Clock,
  FileSpreadsheet,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { language, t, auditLogs } = useApp();
  const isThai = language === 'th';

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" />
            <span>{t.historyTitle}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'บันทึกประวัติการดำเนินการ การเข้าถึงข้อมูลตามมาตรา PDPA และประวัติเหตุฉุกเฉิน'
              : 'Immutable event log, statutory PDPA medical access records, and dispatch audit history'}
          </p>
        </div>

        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-bold">
          {auditLogs.length} Records Logged
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{t.timestamp}</th>
                <th className="py-3.5 px-4">{t.actor}</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">{t.actionDetails}</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => {
                const isMedicalAccess = log.action.includes('Medical');
                const isSos = log.action.includes('SOS') || log.action.includes('Emergency');

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {log.actor}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold flex items-center gap-1.5">
                        {isMedicalAccess ? (
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                        ) : isSos ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        ) : null}
                        <span className={isMedicalAccess ? 'text-amber-900' : isSos ? 'text-rose-900' : 'text-slate-800'}>
                          {isThai ? log.actionTh : log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
