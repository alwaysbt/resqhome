import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OverviewView } from './OverviewView';
import { IncidentsView } from './IncidentsView';
import { BuildingMapView } from './BuildingMapView';
import { ResidentsView } from './ResidentsView';
import { AssistanceView } from './AssistanceView';
import { EvacuationMonitoringView } from './EvacuationMonitoringView';
import { StaffView } from './StaffView';
import { WearablesMonitoringView } from './WearablesMonitoringView';
import { HistoryView } from './HistoryView';
import { ReportsSettingsView } from './ReportsSettingsView';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  ShieldAlert,
  Building,
  Users,
  LifeBuoy,
  Footprints,
  Shield,
  Watch,
  History,
  FileText,
  UserCheck,
  Flame,
  Activity,
  Sliders,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface ManagementDashboardProps {
  onOpenDemoPanel?: () => void;
  isEmbedded?: boolean;
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  onOpenDemoPanel,
  isEmbedded = false,
}) => {
  const {
    language,
    t,
    currentRole,
    setCurrentRole,
    activeScenario,
    incidents,
  } = useApp();

  const isThai = language === 'th';
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedFloorForMap, setSelectedFloorForMap] = useState<number>(12);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  const navigationItems = [
    { key: 'overview', label: t.navOverview, icon: LayoutDashboard },
    { key: 'incidents', label: t.navIncidents, icon: ShieldAlert, badge: activeIncidents.length },
    { key: 'map', label: t.navBuildingMap, icon: Building },
    { key: 'residents', label: t.navResidents, icon: Users },
    { key: 'assistance', label: t.navAssistance, icon: LifeBuoy },
    { key: 'evacuation', label: t.navEvacuationMgmt, icon: Footprints },
    { key: 'staff', label: t.navStaff, icon: Shield },
    { key: 'wearables', label: t.navWearableMonitor, icon: Watch },
    { key: 'history', label: t.navHistory, icon: History },
    { key: 'reports', label: t.navReports, icon: FileText },
  ];

  const handleSelectFloorFromOverview = (floorNum: number) => {
    setSelectedFloorForMap(floorNum);
    setActiveTab('map');
  };

  return (
    <div className={`w-full min-h-[820px] bg-slate-50 flex flex-col ${isEmbedded ? 'rounded-2xl overflow-hidden' : ''}`}>
      {/* Top Incident / Emergency Ticker Banner if Active */}
      {activeIncidents.length > 0 && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-pulse shrink-0">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4" />
            <span>
              {isThai ? 'สัญญาณฉุกเฉินในอาคาร:' : 'ACTIVE EMERGENCY ALERT:'}{' '}
              {activeIncidents.length} {isThai ? 'เหตุการณ์กำลังดำเนินการ' : 'incident(s) active'}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('incidents')}
            className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold transition"
          >
            {isThai ? 'เปิดดูรายการเหตุ' : 'View Incident Triage ➔'}
          </button>
        </div>
      )}

      {/* Operations Header & Role Switcher */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>{t.mgmtTitle}</span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full font-mono">
                OPS-CONSOLE
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 hidden md:block">{t.mgmtSubtitle}</p>
          </div>
        </div>

        {/* Operational Role Switcher (Admin / Security / Responder) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            {t.activeRoleBadge}
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setCurrentRole('admin')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Administrator
            </button>
            <button
              onClick={() => setCurrentRole('security')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentRole === 'security'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security Lead
            </button>
            <button
              onClick={() => setCurrentRole('responder')}
              className={`px-3 py-1.5 rounded-lg transition ${
                currentRole === 'responder'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Responder
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Navigation + Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside
          className={`w-64 bg-slate-900 text-slate-300 p-4 shrink-0 flex flex-col justify-between select-none ${
            isSidebarOpenMobile ? 'block fixed inset-y-0 left-0 z-40 w-64' : 'hidden lg:flex'
          }`}
        >
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-2 font-bold">
              Operations Center
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveTab(item.key);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Role Info Footer */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 text-xs text-slate-300">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Active Station</div>
            <div className="font-bold text-teal-400 mt-0.5 capitalize">{currentRole} Station</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {currentRole === 'admin'
                ? t.roleAdminDesc
                : currentRole === 'security'
                ? t.roleSecurityDesc
                : t.roleResponderDesc}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'overview' && (
            <OverviewView onSelectFloor={handleSelectFloorFromOverview} />
          )}
          {activeTab === 'incidents' && <IncidentsView />}
          {activeTab === 'map' && (
            <BuildingMapView initialFloor={selectedFloorForMap} />
          )}
          {activeTab === 'residents' && <ResidentsView />}
          {activeTab === 'assistance' && <AssistanceView />}
          {activeTab === 'evacuation' && <EvacuationMonitoringView />}
          {activeTab === 'staff' && <StaffView />}
          {activeTab === 'wearables' && <WearablesMonitoringView />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'reports' && <ReportsSettingsView />}
        </main>
      </div>
    </div>
  );
};
