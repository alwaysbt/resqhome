import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Watch,
  X,
  Battery,
  Heart,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface WearableWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WearableWidget: React.FC<WearableWidgetProps> = ({ isOpen, onClose }) => {
  const {
    language,
    t,
    resident,
    simulateWearableSos,
    simulateFallDetection,
    simulateWearableDisconnect,
    simulateBatteryLevel,
  } = useApp();

  const isThai = language === 'th';
  const wearable = resident.wearable;

  // Fall detection 30s countdown simulation state
  const [fallCountdown, setFallCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (fallCountdown !== null && fallCountdown > 0) {
      timer = setTimeout(() => {
        setFallCountdown(fallCountdown - 1);
      }, 1000);
    } else if (fallCountdown === 0) {
      // Trigger actual SOS when countdown expires
      simulateFallDetection();
      setFallCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [fallCountdown, simulateFallDetection]);

  if (!isOpen) return null;

  const handleStartFallTest = () => {
    setFallCountdown(15); // 15-second simulation countdown
  };

  const handleCancelFall = () => {
    setFallCountdown(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{t.wearableModalTitle}</h3>
              <p className="text-[11px] text-slate-300">{wearable.model}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Smartwatch Virtual Display */}
        <div className="p-6 bg-slate-100 flex flex-col items-center">
          {/* Watch Body */}
          <div className="w-56 h-64 rounded-[40px] bg-slate-950 p-4 border-4 border-slate-800 shadow-2xl relative flex flex-col justify-between text-white overflow-hidden">
            {/* Watch Top Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="flex items-center gap-1 font-bold">
                <Battery className={`w-3.5 h-3.5 ${wearable.batteryLevel < 20 ? 'text-rose-500' : 'text-emerald-400'}`} />
                <span>{wearable.batteryLevel}%</span>
              </div>
            </div>

            {/* Watch Screen Core */}
            {fallCountdown !== null ? (
              <div className="text-center py-2 animate-pulse space-y-1">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-xs font-black text-amber-300">
                  {t.fallCountdownTitle}
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {fallCountdown}s
                </div>
                <button
                  onClick={handleCancelFall}
                  className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold border border-slate-700"
                >
                  {t.cancelFallAlert}
                </button>
              </div>
            ) : (
              <div className="text-center py-2 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-rose-500">
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                  <span className="text-2xl font-black font-mono tracking-tight text-white">
                    {wearable.heartRate}
                  </span>
                  <span className="text-[10px] text-slate-400">BPM</span>
                </div>
                <div className="text-[10px] text-teal-400 font-semibold">
                  {wearable.connected ? '● BLE Connected' : '○ Disconnected'}
                </div>
              </div>
            )}

            {/* Watch Bottom SOS Trigger */}
            <button
              onClick={() => {
                simulateWearableSos();
                onClose();
              }}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs tracking-wider shadow-lg shadow-rose-600/40 active:scale-95 transition"
            >
              HOLD SOS
            </button>
          </div>
        </div>

        {/* Simulator Controls */}
        <div className="p-5 space-y-4">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {isThai ? 'ฟังก์ชันทดสอบสัญญาณเซนเซอร์' : 'Sensor Event Triggers'}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleStartFallTest}
              className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 font-bold text-left transition flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{t.triggerFallDetection}</span>
            </button>

            <button
              onClick={simulateWearableDisconnect}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-left transition flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-slate-600" />
              <span>{wearable.connected ? 'Simulate Disconnect' : 'Reconnect Watch'}</span>
            </button>
          </div>

          {/* Battery Level Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>{t.batterySimulate}:</span>
              <span className="font-mono text-teal-700">{wearable.batteryLevel}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={wearable.batteryLevel}
              onChange={(e) => simulateBatteryLevel(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
