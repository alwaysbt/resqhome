import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FloorPlanSvg } from '../floorplan/FloorPlanSvg';
import { calculateEvacuationRoute } from '../../utils/evacuationRouter';
import {
  Building,
  Flame,
  AlertTriangle,
  Wind,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const BuildingMapView: React.FC<{ initialFloor?: number }> = ({ initialFloor = 12 }) => {
  const {
    language,
    t,
    floors,
    updateFloor,
    toggleCorridorBlockage,
    activeScenario,
    resident,
    residentsList,
    currentRole,
  } = useApp();

  const isThai = language === 'th';
  const [selectedFloorNum, setSelectedFloorNum] = useState<number>(initialFloor);

  const currentFloor = floors.find((f) => f.floorNumber === selectedFloorNum) || floors[11];
  const evacuationPlan = calculateEvacuationRoute(currentFloor, resident, activeScenario);

  const floorResidents = residentsList.filter((r) => r.floor === selectedFloorNum);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Controls & Floor Selector */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-600" />
            <span>{t.navBuildingMap}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'ระบบวิเคราะห์สถาปัตยกรรม 2 มิติ และสถานะเซนเซอร์สิ่งแวดล้อมแบบเรียลไทม์'
              : 'Interactive 2D architectural CAD inspector & environmental sensor telemetry'}
          </p>
        </div>

        {/* Floor Dropdown Selector */}
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-bold text-slate-700">{t.mapFloorSelector}</label>
          <select
            value={selectedFloorNum}
            onChange={(e) => setSelectedFloorNum(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono"
          >
            {floors.map((f) => (
              <option key={f.floorNumber} value={f.floorNumber}>
                Floor {f.floorNumber} {f.hazards.fireDetected ? '🔥 (Fire)' : ''} {f.hasRefugeArea ? '♿' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: SVG Map on Left, Sensor & Hazard Control on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Floor Map (2 Columns on large screens) */}
        <div className="lg:col-span-2 space-y-3">
          <FloorPlanSvg
            floorNumber={selectedFloorNum}
            evacuationPlan={evacuationPlan}
            resident={resident}
            language={language}
            interactive={true}
          />
        </div>

        {/* Floor Telemetry & Simulation Controls (1 Column) */}
        <div className="space-y-4">
          {/* Environmental Telemetry Panel */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-teal-600" />
              <span>{t.hazardsAndSensors} (Floor {selectedFloorNum})</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">{t.smokeSensorLabel}</span>
                <span className={`text-base font-extrabold font-mono ${currentFloor.hazards.smokePpm > 100 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                  {currentFloor.hazards.smokePpm} PPM
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Threshold: 100 PPM</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 block">{t.tempSensorLabel}</span>
                <span className={`text-base font-extrabold font-mono ${currentFloor.hazards.tempCelsius > 50 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {currentFloor.hazards.tempCelsius}°C
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Threshold: 55°C</span>
              </div>
            </div>

            {/* Simulated Path Blockage Controls */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                {isThai ? 'ควบคุมสิ่งกีดขวางเส้นทาง (Security Override):' : 'Emergency Path Blockage Overrides:'}
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'corridor_north', label: t.corridorNorth },
                  { key: 'corridor_south', label: t.corridorSouth },
                  { key: 'stair_a', label: t.stairA },
                  { key: 'stair_b', label: t.stairB },
                ].map((item) => {
                  const isBlocked = currentFloor.blockedCorridors.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleCorridorBlockage(selectedFloorNum, item.key)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition text-left ${
                        isBlocked
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span className="truncate">{item.label}</span>
                        <span>{isBlocked ? '⚠️' : '✓'}</span>
                      </div>
                      <span className="text-[10px] opacity-75 font-mono">
                        {isBlocked ? 'Blocked / Hazard' : 'Open / Clear'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Floor Resident Roster Summary */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isThai ? 'ผู้อยู่อาศัยบนชั้นนี้' : 'Residents on this floor'}
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {floorResidents.length} Registered
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {floorResidents.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {isThai ? r.nameTh : r.name}
                    </span>
                    <span className="text-[10.5px] text-teal-700 font-medium">
                      Unit {r.unit} • {r.assistanceCategory.toUpperCase()}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      r.checkInStatus === 'safe'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.checkInStatus === 'needs_help'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {r.checkInStatus.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
