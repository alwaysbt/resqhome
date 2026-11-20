import React from 'react';
import { EvacuationPlan, Language, Resident } from '../../types';

interface FloorPlanSvgProps {
  floorNumber: number;
  evacuationPlan: EvacuationPlan;
  resident: Resident;
  language: Language;
  onSelectNode?: (nodeId: string) => void;
  interactive?: boolean;
}

export const FloorPlanSvg: React.FC<FloorPlanSvgProps> = ({
  floorNumber,
  evacuationPlan,
  resident,
  language,
  onSelectNode,
  interactive = false,
}) => {
  const isThai = language === 'th';
  const isStairAHazard = evacuationPlan.stairAStatus === 'hazard';
  const isStairBHazard = evacuationPlan.stairBStatus === 'hazard';
  const isElevatorDisabled = evacuationPlan.elevatorsStatus !== 'operational';
  const isWheelchair = resident.medicalInfo.wheelchairUser || resident.assistanceCategory === 'wheelchair';
  const targetRoute = evacuationPlan.recommendedStair;

  // Compute animated route points based on target
  // Unit 1204 center: (200, 220)
  // Central Hallway: (350, 220)
  let routePath = 'M 200,220 L 350,220 L 350,110 L 150,110 L 120,80'; // default to Stair A
  if (targetRoute === 'stair_b') {
    routePath = 'M 200,220 L 350,220 L 350,290 L 580,290 L 580,320'; // to Stair B
  } else if (targetRoute === 'refuge_area') {
    routePath = 'M 200,220 L 350,220 L 450,220 L 580,220 L 580,130'; // to Refuge Room 12-R
  }

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-700/60 overflow-hidden relative select-none">
      {/* Top Header Information inside Map */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200 uppercase tracking-wider">
            {isThai ? `ผังอาคารสถาปัตยกรรม ชั้น ${floorNumber}` : `Architectural Floor Plan — Floor ${floorNumber}`}
          </span>
          <span className="bg-slate-800 text-teal-400 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">
            2D CAD Layout
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            {isThai ? 'เส้นทางปลอดภัย' : 'Safe Route'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            {isThai ? 'พื้นที่อันตราย/ควัน' : 'Hazard / Blocked'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            {isThai ? 'พื้นที่พักคอยทนไฟ' : 'Refuge Area'}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto flex justify-center py-1">
        <svg
          viewBox="0 0 720 420"
          className="w-full max-w-[720px] h-auto drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            {/* Pulsing Gradient for Hazard */}
            <radialGradient id="smokeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#dc2626" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.05" />
            </radialGradient>
            {/* Pulse Gradient for Resident Location */}
            <radialGradient id="residentBeacon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="720" height="420" fill="#0f172a" />
          <rect width="720" height="420" fill="url(#grid)" />

          {/* Building Boundary Walls */}
          <rect
            x="40"
            y="30"
            width="640"
            height="360"
            rx="12"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="3"
            opacity="0.8"
          />

          {/* Corridors Layout (T-Junction & Hallway wings) */}
          {/* Main Central Corridor */}
          <rect x="310" y="50" width="80" height="320" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          {/* West Wing Corridor */}
          <rect x="130" y="190" width="200" height="60" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          {/* East Wing Corridor */}
          <rect x="370" y="190" width="230" height="60" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

          {/* Apartment Units (West Side) */}
          {/* Unit 1201 */}
          <g
            className="cursor-pointer transition hover:opacity-85"
            onClick={() => interactive && onSelectNode && onSelectNode('1201')}
          >
            <rect x="60" y="50" width="100" height="110" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="110" y="105" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
              {floorNumber < 10 ? `0${floorNumber}01` : `${floorNumber}01`}
            </text>
            <text x="110" y="125" textAnchor="middle" fill="#64748b" fontSize="9">
              Unit
            </text>
          </g>

          {/* Unit 1202 */}
          <g
            className="cursor-pointer transition hover:opacity-85"
            onClick={() => interactive && onSelectNode && onSelectNode('1202')}
          >
            <rect x="180" y="50" width="100" height="110" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="230" y="105" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
              {floorNumber < 10 ? `0${floorNumber}02` : `${floorNumber}02`}
            </text>
            <text x="230" y="125" textAnchor="middle" fill="#64748b" fontSize="9">
              Emily Davis
            </text>
          </g>

          {/* Unit 1203 */}
          <g
            className="cursor-pointer transition hover:opacity-85"
            onClick={() => interactive && onSelectNode && onSelectNode('1203')}
          >
            <rect x="60" y="270" width="100" height="100" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="110" y="325" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
              {floorNumber < 10 ? `0${floorNumber}03` : `${floorNumber}03`}
            </text>
            <text x="110" y="343" textAnchor="middle" fill="#64748b" fontSize="9">
              Unit
            </text>
          </g>

          {/* Unit 1204 - PRIMARY RESIDENT UNIT */}
          <g
            className="cursor-pointer transition hover:opacity-90"
            onClick={() => interactive && onSelectNode && onSelectNode('1204')}
          >
            <rect
              x="180"
              y="270"
              width="110"
              height="100"
              rx="8"
              fill="#0f2b38"
              stroke="#0284c7"
              strokeWidth="2.5"
            />
            {/* Beacon Circle */}
            <circle cx="235" cy="315" r="24" fill="url(#residentBeacon)" className="animate-pulse" />
            <text x="235" y="315" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">
              {floorNumber < 10 ? `0${floorNumber}04` : `${floorNumber}04`}
            </text>
            <text x="235" y="333" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="semibold">
              ★ {resident.name.split(' ')[0]}
            </text>
            <text x="235" y="349" textAnchor="middle" fill="#38bdf8" fontSize="8.5">
              {isWheelchair ? '♿ Wheelchair User' : 'You are here'}
            </text>
          </g>

          {/* Apartment Units (East Side) */}
          {/* Unit 1205 */}
          <g
            className="cursor-pointer transition hover:opacity-85"
            onClick={() => interactive && onSelectNode && onSelectNode('1205')}
          >
            <rect x="420" y="50" width="100" height="110" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="470" y="105" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
              {floorNumber < 10 ? `0${floorNumber}05` : `${floorNumber}05`}
            </text>
            <text x="470" y="125" textAnchor="middle" fill="#64748b" fontSize="9">
              Unit
            </text>
          </g>

          {/* Unit 1206 */}
          <g
            className="cursor-pointer transition hover:opacity-85"
            onClick={() => interactive && onSelectNode && onSelectNode('1206')}
          >
            <rect x="420" y="270" width="100" height="100" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="470" y="325" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
              {floorNumber < 10 ? `0${floorNumber}06` : `${floorNumber}06`}
            </text>
            <text x="470" y="343" textAnchor="middle" fill="#64748b" fontSize="9">
              Apinya Chen
            </text>
          </g>

          {/* Unit 1207 */}
          <g
            className="cursor-pointer transition hover:opacity-85"
            onClick={() => interactive && onSelectNode && onSelectNode('1207')}
          >
            <rect x="540" y="270" width="100" height="100" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
            <text x="590" y="325" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
              {floorNumber < 10 ? `0${floorNumber}07` : `${floorNumber}07`}
            </text>
            <text x="590" y="343" textAnchor="middle" fill="#64748b" fontSize="9">
              Unit
            </text>
          </g>

          {/* Staircase A (West Core) */}
          <g>
            <rect
              x="60"
              y="40"
              width="90"
              height="80"
              rx="6"
              fill={isStairAHazard ? '#450a0a' : '#064e3b'}
              stroke={isStairAHazard ? '#ef4444' : '#10b981'}
              strokeWidth="2"
            />
            {/* Stair lines */}
            <line x1="70" y1="55" x2="140" y2="55" stroke={isStairAHazard ? '#ef4444' : '#34d399'} strokeWidth="1.5" />
            <line x1="70" y1="67" x2="140" y2="67" stroke={isStairAHazard ? '#ef4444' : '#34d399'} strokeWidth="1.5" />
            <line x1="70" y1="79" x2="140" y2="79" stroke={isStairAHazard ? '#ef4444' : '#34d399'} strokeWidth="1.5" />
            <text x="105" y="98" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="bold">
              STAIR A
            </text>
            {isStairAHazard && (
              <text x="105" y="112" textAnchor="middle" fill="#fca5a5" fontSize="8.5" fontWeight="bold">
                ⚠️ BLOCKED
              </text>
            )}
          </g>

          {/* Staircase B (East Core) */}
          <g>
            <rect
              x="550"
              y="300"
              width="90"
              height="80"
              rx="6"
              fill={isStairBHazard ? '#450a0a' : '#064e3b'}
              stroke={isStairBHazard ? '#ef4444' : '#10b981'}
              strokeWidth="2"
            />
            {/* Stair lines */}
            <line x1="560" y1="315" x2="630" y2="315" stroke={isStairBHazard ? '#ef4444' : '#34d399'} strokeWidth="1.5" />
            <line x1="560" y1="327" x2="630" y2="327" stroke={isStairBHazard ? '#ef4444' : '#34d399'} strokeWidth="1.5" />
            <line x1="560" y1="339" x2="630" y2="339" stroke={isStairBHazard ? '#ef4444' : '#34d399'} strokeWidth="1.5" />
            <text x="595" y="358" textAnchor="middle" fill="#f8fafc" fontSize="10.5" fontWeight="bold">
              STAIR B
            </text>
            {targetRoute === 'stair_b' && (
              <text x="595" y="372" textAnchor="middle" fill="#6ee7b7" fontSize="8.5" fontWeight="bold">
                ✓ RECOMMENDED
              </text>
            )}
          </g>

          {/* Passenger Elevators */}
          <g>
            <rect
              x="320"
              y="180"
              width="60"
              height="70"
              rx="6"
              fill={isElevatorDisabled ? '#292524' : '#1e293b'}
              stroke={isElevatorDisabled ? '#dc2626' : '#64748b'}
              strokeWidth="1.5"
            />
            <text x="350" y="210" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
              LIFT
            </text>
            {isElevatorDisabled ? (
              <>
                <line x1="325" y1="185" x2="375" y2="245" stroke="#ef4444" strokeWidth="2.5" />
                <line x1="375" y1="185" x2="325" y2="245" stroke="#ef4444" strokeWidth="2.5" />
                <text x="350" y="235" textAnchor="middle" fill="#f87171" fontSize="8" fontWeight="bold">
                  DO NOT USE
                </text>
              </>
            ) : (
              <text x="350" y="230" textAnchor="middle" fill="#10b981" fontSize="8">
                Operational
              </text>
            )}
          </g>

          {/* Assistance Refuge Area 12-R (Reinforced Fire Protected Room with 2-way Intercom) */}
          <g>
            <rect
              x="540"
              y="50"
              width="100"
              height="110"
              rx="8"
              fill={targetRoute === 'refuge_area' ? '#451a03' : '#1e293b'}
              stroke={targetRoute === 'refuge_area' ? '#f59e0b' : '#d97706'}
              strokeWidth="2"
            />
            <circle cx="590" cy="85" r="14" fill="#d97706" opacity="0.25" />
            <text x="590" y="90" textAnchor="middle" fill="#fbbf24" fontSize="16">
              ♿
            </text>
            <text x="590" y="118" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">
              REFUGE 12-R
            </text>
            <text x="590" y="132" textAnchor="middle" fill="#fde68a" fontSize="7.5">
              2-Hr Fire Door & Intercom
            </text>
            {targetRoute === 'refuge_area' && (
              <text x="590" y="148" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">
                ✓ DESIGNATED REFUGE
              </text>
            )}
          </g>

          {/* Hazard Smoke Overlay on North Corridor if active */}
          {isStairAHazard && (
            <g className="animate-pulse">
              <circle cx="350" cy="110" r="55" fill="url(#smokeGradient)" />
              <text x="350" y="105" textAnchor="middle" fill="#fecaca" fontSize="11" fontWeight="bold">
                🔥 SMOKE HAZARD
              </text>
              <text x="350" y="120" textAnchor="middle" fill="#fca5a5" fontSize="8.5">
                420 PPM CO / 68°C
              </text>
            </g>
          )}

          {/* Dynamic Evacuation Path (Green Animated Route) */}
          <path
            d={routePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="4.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-lg"
          >
            <animate attributeName="stroke-dashoffset" values="28;0" dur="1s" repeatCount="indefinite" />
          </path>

          {/* Resident Location Pin & Label */}
          <circle cx="200" cy="220" r="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="200" cy="220" r="16" fill="#38bdf8" opacity="0.3" className="animate-ping" />

          {/* Exit / Direction Arrows along the route */}
          {targetRoute === 'stair_b' && (
            <polygon points="575,310 585,310 580,320" fill="#10b981" />
          )}
          {targetRoute === 'refuge_area' && (
            <polygon points="575,140 585,140 580,130" fill="#f59e0b" />
          )}
        </svg>
      </div>

      {/* Dynamic Route Recommendation Banner */}
      <div className="mt-3 p-3 bg-slate-800/90 rounded-xl border border-slate-700 text-xs text-slate-200 flex items-start gap-3">
        <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm">
          {targetRoute === 'refuge_area' ? '♿' : '➔'}
        </span>
        <div className="flex-1">
          <div className="font-semibold text-emerald-400 mb-0.5 flex items-center justify-between">
            <span>
              {isThai ? 'การประเมินเส้นทางอพยพอัตโนมัติ:' : 'Dynamic Route Evaluation:'}{' '}
              {targetRoute === 'stair_b'
                ? isThai
                  ? 'บันไดหนีไฟ B (ทางเลือกสำรอง)'
                  : 'Staircase B (Alternative Path)'
                : targetRoute === 'refuge_area'
                ? isThai
                  ? 'ห้องพักคอยทนไฟ 12-R (เฉพาะบุคคล)'
                  : 'Refuge Area 12-R (Personalized)'
                : isThai
                ? 'บันไดหนีไฟ A (เส้นทางหลัก)'
                : 'Staircase A (Primary Path)'}
            </span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
              FACP Sync
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {isThai ? evacuationPlan.reasonTh : evacuationPlan.reasonEn}
          </p>
          <div className="mt-1 flex items-center gap-2 text-[10.5px] text-teal-400/90">
            <span>✓ {isThai ? 'ตรวจสอบแล้วโดย' : 'Verified by'}: {evacuationPlan.verifiedBy}</span>
            <span>•</span>
            <span className="text-amber-400">
              {isThai
                ? 'ห้ามใช้ลิฟต์โดยสารเด็ดขาดขณะเพลิงไหม้'
                : 'Passenger elevators locked out on fire sensors'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
