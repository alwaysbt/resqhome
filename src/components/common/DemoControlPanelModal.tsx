import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sliders,
  Flame,
  Activity,
  Watch,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building,
  UserCheck,
  Zap,
} from 'lucide-react';

interface DemoControlPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoControlPanelModal: React.FC<DemoControlPanelModalProps> = ({ isOpen, onClose }) => {
  const {
    language,
    t,
    activeScenario,
    floors,
    updateFloor,
    triggerEarthquakeScenario,
    triggerFireScenario,
    simulateWearableSos,
    simulateFallDetection,
    simulateWearableDisconnect,
    simulateBatteryLevel,
    toggleCorridorBlockage,
    resetAllToNormal,
    setCurrentView,
    setCurrentRole,
    triggerResidentSos,
  } = useApp();

  const isThai = language === 'th';
  const [selectedFloorNum, setSelectedFloorNum] = useState<number>(12);

  if (!isOpen) return null;

  const currentFloor = floors.find((f) => f.floorNumber === selectedFloorNum) || floors[11];

  // Quick Demo Run Handlers
  const handleRunDemo = (demoNumber: number) => {
    switch (demoNumber) {
      case 1: // Normal resident experience
        resetAllToNormal();
        setCurrentView('resident');
        onClose();
        break;
      case 2: // Earthquake
        triggerEarthquakeScenario();
        setCurrentView('resident');
        onClose();
        break;
      case 3: // Fire & Dynamic Reroute
        triggerFireScenario(12);
        setCurrentView('resident');
        onClose();
        break;
      case 4: // Personalized Assistance
        triggerFireScenario(12);
        triggerResidentSos('evacuation', 'Wheelchair resident in Unit 1204 needs evacuation assistance to Refuge Area.');
        setCurrentView('management');
        setCurrentRole('responder');
        onClose();
        break;
      case 5: // Staff Coordination
        triggerFireScenario(12);
        setCurrentView('management');
        setCurrentRole('admin');
        onClose();
        break;
      case 6: // Cross-Interface Sync (Split View)
        triggerResidentSos('medical', 'Chest discomfort reported via mobile app.');
        setCurrentView('split');
        onClose();
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>{t.simPanelTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                  Interactive Master Controller
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">{t.simPanelDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Demo Scenario Shortcuts (Demo 1 to 6) */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{isThai ? 'แบบทดสอบตามข้อกำหนด (6 Demo Scenarios)' : 'Evaluator Demo Scenarios (1-Click Run)'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleRunDemo(1)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-start gap-2.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                  1
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">{t.quickDemo1}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {isThai ? 'เข้าแอปผู้อยู่อาศัย คำนวณอายุอัตโนมัติ' : 'Resident App, Onboarding & Profile'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRunDemo(2)}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-left transition flex items-start gap-2.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
                  2
                </span>
                <div>
                  <div className="text-xs font-bold text-amber-950">{t.quickDemo2}</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    {isThai ? 'แผ่นดินไหว ลิฟต์หยุด เช็คอิน' : 'Seismic Alert & Check-in'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRunDemo(3)}
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100/70 border border-rose-200 text-left transition flex items-start gap-2.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-rose-200 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
                  3
                </span>
                <div>
                  <div className="text-xs font-bold text-rose-950">{t.quickDemo3}</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    {isThai ? 'ไฟไหม้ชั้น 12 ทางเดินปิด คำนวณเส้นทางใหม่' : 'Fire on Fl.12 & Dynamic Reroute'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRunDemo(4)}
                className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-left transition flex items-start gap-2.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                  4
                </span>
                <div>
                  <div className="text-xs font-bold text-blue-950">{t.quickDemo4}</div>
                  <div className="text-[11px] text-blue-700 mt-0.5">
                    {isThai ? 'วีลแชร์ ขอความช่วยเหลือ มอบหมายทีม' : 'Wheelchair Route & Dispatch'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRunDemo(5)}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/70 border border-purple-200 text-left transition flex items-start gap-2.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
                  5
                </span>
                <div>
                  <div className="text-xs font-bold text-purple-950">{t.quickDemo5}</div>
                  <div className="text-[11px] text-purple-700 mt-0.5">
                    {isThai ? 'เปลี่ยนบทบาท Admin/Security/Responder' : 'Admin, Security & Responder RBAC'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRunDemo(6)}
                className="p-3 rounded-2xl bg-teal-50 hover:bg-teal-100/70 border border-teal-200 text-left transition flex items-start gap-2.5 group"
              >
                <span className="w-6 h-6 rounded-full bg-teal-200 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition">
                  6
                </span>
                <div>
                  <div className="text-xs font-bold text-teal-950">{t.quickDemo6}</div>
                  <div className="text-[11px] text-teal-700 mt-0.5">
                    {isThai ? 'สองหน้าจอ ซิงค์เหตุการณ์เรียลไทม์' : 'Split View Live Synchronization'}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 1: Major Building Scenarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fire Scenario Card */}
            <div className={`p-4 rounded-2xl border transition ${
              activeScenario === 'fire'
                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-rose-500 text-white">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t.scenarioFire}</h4>
                  <span className="text-[11px] text-rose-700 font-medium">
                    {activeScenario === 'fire' ? '● ACTIVE NOW' : 'Simulate Smoke & Heat Alarms'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">{t.scenarioFireDesc}</p>
              <button
                onClick={() => triggerFireScenario(selectedFloorNum)}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
              >
                {t.triggerFireBtn} (Floor {selectedFloorNum})
              </button>
            </div>

            {/* Earthquake Scenario Card */}
            <div className={`p-4 rounded-2xl border transition ${
              activeScenario === 'earthquake'
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400'
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-xl bg-amber-500 text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{t.scenarioEarthquake}</h4>
                  <span className="text-[11px] text-amber-700 font-medium">
                    {activeScenario === 'earthquake' ? '● ACTIVE NOW' : 'Simulate Seismic Tremors'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mb-3">{t.scenarioEarthquakeDesc}</p>
              <button
                onClick={triggerEarthquakeScenario}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition"
              >
                {t.triggerEarthquakeBtn}
              </button>
            </div>
          </div>

          {/* Section 2: Granular Floor & Sensor Simulator */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-sm text-slate-800">
                  {isThai ? 'การปรับแต่งเซนเซอร์รายชั้น (1-20)' : 'Granular Floor & Sensor Controller'}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600 font-medium">
                  {isThai ? 'เลือกชั้น:' : 'Select Floor:'}
                </label>
                <select
                  value={selectedFloorNum}
                  onChange={(e) => setSelectedFloorNum(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  {floors.map((f) => (
                    <option key={f.floorNumber} value={f.floorNumber}>
                      Floor {f.floorNumber} {f.hazards.fireDetected ? '🔥' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sensor Sliders for currentFloor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{isThai ? 'ระดับควัน (Smoke Concentration):' : 'Smoke Concentration (PPM):'}</span>
                  <span className="font-mono text-teal-700">{currentFloor.hazards.smokePpm} PPM</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={currentFloor.hazards.smokePpm}
                  onChange={(e) =>
                    updateFloor(selectedFloorNum, {
                      hazards: { ...currentFloor.hazards, smokePpm: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0 (Clear)</span>
                  <span>100 (Threshold)</span>
                  <span>600 (Hazard)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>{isThai ? 'อุณหภูมิแวดล้อม (Ambient Temp):' : 'Ambient Temperature (°C):'}</span>
                  <span className="font-mono text-teal-700">{currentFloor.hazards.tempCelsius} °C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="1"
                  value={currentFloor.hazards.tempCelsius}
                  onChange={(e) =>
                    updateFloor(selectedFloorNum, {
                      hazards: { ...currentFloor.hazards, tempCelsius: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>25°C (Normal)</span>
                  <span>55°C (Alert)</span>
                  <span>90°C (Fire)</span>
                </div>
              </div>
            </div>

            {/* Block Corridors / Stairwells Toggles */}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">
                {isThai ? 'จำลองสิ่งกีดขวางบนเส้นทางอพยพ (ชั้น ' + selectedFloorNum + '):' : 'Simulate Blocked Path Segments (Floor ' + selectedFloorNum + '):'}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'corridor_north', label: isThai ? 'โถงทิศเหนือ' : 'North Corridor' },
                  { key: 'corridor_south', label: isThai ? 'โถงทิศใต้' : 'South Corridor' },
                  { key: 'stair_a', label: isThai ? 'บันไดหนีไฟ A' : 'Staircase A' },
                  { key: 'stair_b', label: isThai ? 'บันไดหนีไฟ B' : 'Staircase B' },
                ].map((item) => {
                  const isBlocked = currentFloor.blockedCorridors.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      onClick={() => toggleCorridorBlockage(selectedFloorNum, item.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                        isBlocked
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isBlocked ? <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{item.label}</span>
                      <span className="text-[10px] font-mono opacity-80">
                        {isBlocked ? '(Blocked)' : '(Clear)'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Wearable Device Simulator */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Watch className="w-4 h-4 text-sky-600" />
              <h4 className="font-bold text-sm text-slate-800">
                {isThai ? 'จำลองอุปกรณ์สวมใส่อัจฉริยะ (Smartwatch Simulation)' : 'Life-Safety Wearable Simulator'}
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <button
                onClick={simulateWearableSos}
                className="p-2.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-left transition"
              >
                <div className="text-xs font-bold text-rose-700">🔴 Wearable SOS</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isThai ? 'กดปุ่มฉุกเฉินบนนาฬิกา' : 'Trigger SOS hardware hold'}
                </div>
              </button>

              <button
                onClick={simulateFallDetection}
                className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition"
              >
                <div className="text-xs font-bold text-amber-700">⚠️ Fall Detection</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isThai ? 'จำลองการล้มกระแทกแรง' : 'High-G impact trigger'}
                </div>
              </button>

              <button
                onClick={simulateWearableDisconnect}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <div className="text-xs font-bold text-slate-700">📡 Disconnect Toggle</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isThai ? 'ตัด/ต่อสัญญาณบลูทูธ' : 'Toggle BLE connection'}
                </div>
              </button>

              <button
                onClick={() => simulateBatteryLevel(12)}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left transition"
              >
                <div className="text-xs font-bold text-slate-700">🪫 Low Battery (12%)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isThai ? 'ส่งเตือนแบตเตอรี่ต่ำ' : 'Trigger low battery warning'}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              resetAllToNormal();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.restoreNormalBtn}</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
