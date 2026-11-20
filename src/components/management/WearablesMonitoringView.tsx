import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Watch,
  Heart,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const WearablesMonitoringView: React.FC = () => {
  const { language, t, residentsList } = useApp();
  const isThai = language === 'th';

  const residentsWithWearables = residentsList.filter((r) => r.wearable.connected);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Watch className="w-5 h-5 text-sky-600" />
            <span>{t.navWearableMonitor}</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isThai
              ? 'การตรวจวัดสัญญาณชีพ อัตราการเต้นหัวใจ การตรวจจับการล้มกระแทก และระดับแบตเตอรี่'
              : 'Real-time telemetry stream: accelerometer impact, pulse vitals, and device battery'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>Connected Wearables:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-mono font-bold">
            {residentsWithWearables.length}
          </span>
        </div>
      </div>

      {/* Grid of Wearable Stream Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {residentsWithWearables.map((resident) => {
          const w = resident.wearable;
          const isLowBattery = w.batteryLevel < 20;

          return (
            <div
              key={resident.id}
              className={`p-5 rounded-3xl border transition shadow-xs space-y-3.5 ${
                w.fallDetected
                  ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                  : isLowBattery
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Resident & Unit */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {isThai ? resident.nameTh : resident.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Floor {resident.floor} • Unit {resident.unit}
                  </span>
                </div>

                {w.fallDetected ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                    FALL DETECTED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                )}
              </div>

              {/* Vitals Telemetry */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">HEART RATE</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
                    <span className="text-xl font-black font-mono text-slate-900">{w.heartRate}</span>
                    <span className="text-[10px] text-slate-400">BPM</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">BATTERY LEVEL</span>
                  <div className="flex items-center gap-1.5 mt-1 font-mono">
                    <Battery className={`w-4 h-4 ${isLowBattery ? 'text-rose-500' : 'text-emerald-500'}`} />
                    <span className={`text-xl font-black ${isLowBattery ? 'text-rose-600' : 'text-slate-900'}`}>
                      {w.batteryLevel}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Device metadata */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>{w.model}</span>
                <span>Sync: {w.lastSync}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
