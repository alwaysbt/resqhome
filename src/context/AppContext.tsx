import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  AuditLog,
  BuildingFloor,
  CheckInStatus,
  EmergencyCategory,
  Incident,
  IncidentStatus,
  Language,
  NotificationItem,
  Resident,
  ScenarioType,
  StaffMember,
  UserRole,
} from '../types';
import {
  initialAuditLogs,
  initialFloors,
  initialIncidents,
  initialNotifications,
  initialResidents,
  initialStaff,
} from '../data/mockData';
import { translations } from '../locales/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentView: 'welcome' | 'resident' | 'management' | 'split';
  setCurrentView: (view: 'welcome' | 'resident' | 'management' | 'split') => void;
  activeScenario: ScenarioType;
  setActiveScenario: (scenario: ScenarioType) => void;
  isOnboardingFlowOpen: boolean;
  setIsOnboardingFlowOpen: (open: boolean) => void;
  onboardingInitialStep: 'signup' | 'pdpa' | 'profiling';
  setOnboardingInitialStep: (step: 'signup' | 'pdpa' | 'profiling') => void;

  // Data
  resident: Resident;
  updateResident: (partial: Partial<Resident>) => void;
  residentsList: Resident[];
  updateResidentInList: (id: string, partial: Partial<Resident>) => void;
  floors: BuildingFloor[];
  updateFloor: (floorNum: number, partial: Partial<BuildingFloor>) => void;
  staff: StaffMember[];
  updateStaff: (staffId: string, partial: Partial<StaffMember>) => void;
  incidents: Incident[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  addAuditLog: (action: string, actionTh: string, details: string, actor?: string, role?: string) => void;

  // Incident & SOS operations
  activeSos: boolean;
  activeSosIncident: Incident | null;
  triggerResidentSos: (category?: EmergencyCategory, notes?: string) => void;
  cancelResidentSos: (reason?: string) => void;
  acknowledgeIncident: (incidentId: string) => void;
  assignStaffToIncident: (incidentId: string, staffIds: string[]) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  closeIncident: (incidentId: string) => void;

  // Check-In
  checkInResident: (status: CheckInStatus) => void;

  // Scenarios & Controls
  triggerEarthquakeScenario: () => void;
  triggerFireScenario: (floorNumber?: number) => void;
  simulateWearableSos: () => void;
  simulateFallDetection: () => void;
  simulateWearableDisconnect: () => void;
  simulateBatteryLevel: (level: number) => void;
  toggleCorridorBlockage: (floorNumber: number, corridorKey: string) => void;
  resetAllToNormal: () => void;

  // Notifications
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAllNotificationsRead: () => void;

  // Audio alerts
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  playEmergencyTone: () => void;
}

const STORAGE_KEY = 'resqhome_state_v1';
const BROADCAST_CHANNEL_NAME = 'resqhome_broadcast_channel';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('resqhome_lang');
    return (saved as Language) || 'th';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('resident');
  const [currentView, setCurrentView] = useState<'welcome' | 'resident' | 'management' | 'split'>('welcome');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('normal');
  const [isOnboardingFlowOpen, setIsOnboardingFlowOpen] = useState(false);
  const [onboardingInitialStep, setOnboardingInitialStep] = useState<'signup' | 'pdpa' | 'profiling'>('signup');

  // Core Data States
  const [resident, setResident] = useState<Resident>(initialResidents[0]);
  const [residentsList, setResidentsList] = useState<Resident[]>(initialResidents);
  const [floors, setFloors] = useState<BuildingFloor[]>(initialFloors);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Broadcast channel ref for zero-latency cross-tab sync
  const channelRef = useRef<BroadcastChannel | null>(null);

  // Audio tone synthesizer using Web Audio API (no external asset needed)
  const playEmergencyTone = useCallback(() => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3); // A4 siren chirp

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignore audio policy errors
    }
  }, [isAudioMuted]);

  const toggleAudioMute = useCallback(() => {
    setIsAudioMuted((prev) => !prev);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('resqhome_lang', lang);
  }, []);

  // Broadcast sync helper
  const broadcastSync = useCallback((type: string, payload: unknown) => {
    try {
      if (channelRef.current) {
        channelRef.current.postMessage({ type, payload, timestamp: Date.now() });
      }
    } catch (e) {
      console.warn('Broadcast sync error:', e);
    }
  }, []);

  // Initialize Broadcast Channel & LocalStorage
  useEffect(() => {
    // Attempt to load saved state from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.resident) setResident(parsed.resident);
        if (parsed.residentsList) setResidentsList(parsed.residentsList);
        if (parsed.floors) setFloors(parsed.floors);
        if (parsed.staff) setStaff(parsed.staff);
        if (parsed.incidents) setIncidents(parsed.incidents);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.activeScenario) setActiveScenario(parsed.activeScenario);
      }
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'STATE_SYNC') {
          const p = payload as {
            resident?: Resident;
            residentsList?: Resident[];
            floors?: BuildingFloor[];
            staff?: StaffMember[];
            incidents?: Incident[];
            notifications?: NotificationItem[];
            auditLogs?: AuditLog[];
            activeScenario?: ScenarioType;
          };
          if (p.resident) setResident(p.resident);
          if (p.residentsList) setResidentsList(p.residentsList);
          if (p.floors) setFloors(p.floors);
          if (p.staff) setStaff(p.staff);
          if (p.incidents) setIncidents(p.incidents);
          if (p.notifications) setNotifications(p.notifications);
          if (p.auditLogs) setAuditLogs(p.auditLogs);
          if (p.activeScenario) setActiveScenario(p.activeScenario);
        } else if (type === 'EMERGENCY_TONE') {
          playEmergencyTone();
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [playEmergencyTone]);

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        resident,
        residentsList,
        floors,
        staff,
        incidents,
        notifications,
        auditLogs,
    addAuditLog,
        activeScenario,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Storage quota or private mode
    }
  }, [resident, residentsList, floors, staff, incidents, notifications, auditLogs, activeScenario]);

  // Add audit log helper
  const addAuditLog = useCallback(
    (action: string, actionTh: string, details: string, actor = 'System', role = 'System') => {
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor,
        role,
        action,
        actionTh,
        details,
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    },
    []
  );

  // Add notification helper
  const addNotification = useCallback(
    (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: NotificationItem = {
        ...notif,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      playEmergencyTone();
      broadcastSync('EMERGENCY_TONE', {});
    },
    [broadcastSync, playEmergencyTone]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Update primary resident
  const updateResident = useCallback(
    (partial: Partial<Resident>) => {
      setResident((prev) => {
        const updated = { ...prev, ...partial };
        // also sync with residentsList
        setResidentsList((list) => list.map((r) => (r.id === updated.id ? updated : r)));
        broadcastSync('STATE_SYNC', { resident: updated });
        return updated;
      });
      addAuditLog('Resident Profile Updated', 'ปรับปรุงข้อมูลลูกบ้าน', `Updated fields for ${resident.name} (Unit ${resident.unit})`, resident.name, 'Resident');
    },
    [addAuditLog, broadcastSync, resident.name, resident.unit]
  );

  // Update resident in list
  const updateResidentInList = useCallback(
    (id: string, partial: Partial<Resident>) => {
      setResidentsList((prev) => {
        const updated = prev.map((r) => (r.id === id ? { ...r, ...partial } : r));
        if (id === resident.id) {
          setResident((curr) => ({ ...curr, ...partial }));
        }
        broadcastSync('STATE_SYNC', { residentsList: updated });
        return updated;
      });
    },
    [broadcastSync, resident.id]
  );

  // Update building floor
  const updateFloor = useCallback(
    (floorNum: number, partial: Partial<BuildingFloor>) => {
      setFloors((prev) => {
        const updated = prev.map((f) => (f.floorNumber === floorNum ? { ...f, ...partial } : f));
        broadcastSync('STATE_SYNC', { floors: updated });
        return updated;
      });
    },
    [broadcastSync]
  );

  // Update staff member
  const updateStaff = useCallback(
    (staffId: string, partial: Partial<StaffMember>) => {
      setStaff((prev) => {
        const updated = prev.map((s) => (s.id === staffId ? { ...s, ...partial } : s));
        broadcastSync('STATE_SYNC', { staff: updated });
        return updated;
      });
    },
    [broadcastSync]
  );

  // Find active SOS incident for current resident
  const activeSosIncident =
    incidents.find((inc) => inc.residentId === resident.id && inc.status !== 'resolved') || null;
  const activeSos = !!activeSosIncident;

  // Trigger Resident SOS
  const triggerResidentSos = useCallback(
    (category: EmergencyCategory = 'other', notes = '') => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const incidentId = `INC-${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const categoryTitlesEn: Record<EmergencyCategory, string> = {
        medical: 'Medical Emergency Alert',
        fall: 'Resident Fall / Injury Alert',
        accident: 'Accident in Unit',
        evacuation: 'Evacuation Assistance Request',
        other: 'Emergency SOS Distress Call',
      };
      const categoryTitlesTh: Record<EmergencyCategory, string> = {
        medical: 'แจ้งเหตุฉุกเฉินทางการแพทย์',
        fall: 'แจ้งเหตุหกล้ม / ได้รับบาดเจ็บ',
        accident: 'อุบัติเหตุในห้องชุด',
        evacuation: 'ขอความช่วยเหลือในการอพยพ',
        other: 'สัญญาณขอความช่วยเหลือฉุกเฉิน (SOS)',
      };

      const newIncident: Incident = {
        id: incidentId,
        type: category,
        titleEn: `${categoryTitlesEn[category]} — Unit ${resident.unit}`,
        titleTh: `${categoryTitlesTh[category]} — ห้อง ${resident.unit}`,
        floor: resident.floor,
        unit: resident.unit,
        residentId: resident.id,
        reportedAt: timeStr,
        severity: 'critical',
        status: 'reported',
        assignedStaffIds: [],
        locationNote: `Estimated: Floor ${resident.floor}, Unit ${resident.unit} (Simulated via BLE Anchor #12-04)`,
        notes: notes || `Resident ${resident.name} requested emergency response. Declared needs: ${resident.assistanceCategory.toUpperCase()}`,
        updatedAt: timeStr,
      };

      setIncidents((prev) => [newIncident, ...prev]);

      // Update resident checkInStatus
      setResident((r) => ({ ...r, checkInStatus: 'needs_help' }));

      // Update floor stats
      setFloors((prev) =>
        prev.map((f) => (f.floorNumber === resident.floor ? { ...f, assistancePending: f.assistancePending + 1 } : f))
      );

      // Notification broadcast
      addNotification({
        titleEn: `🚨 CRITICAL SOS: Unit ${resident.unit} (${resident.name})`,
        titleTh: `🚨 สัญญาณฉุกเฉิน SOS: ห้อง ${resident.unit} (${resident.nameTh})`,
        messageEn: `Distress signal received from Floor ${resident.floor}. Category: ${category.toUpperCase()}. Responders notified!`,
        messageTh: `ได้รับสัญญาณขอความช่วยเหลือจากชั้น ${resident.floor} ประเภท: ${categoryTitlesTh[category]} แจ้งทีมกู้ภัยแล้ว`,
        severity: 'critical',
        category: 'emergency',
        floorTarget: resident.floor,
      });

      addAuditLog(
        'Emergency SOS Activated',
        'เปิดใช้งานสัญญาณขอความช่วยเหลือ SOS',
        `Incident ${incidentId} created by Resident ${resident.name} (Unit ${resident.unit}, Category: ${category})`,
        resident.name,
        'Resident'
      );

      broadcastSync('STATE_SYNC', { incidents: [newIncident, ...incidents] });
    },
    [addAuditLog, addNotification, broadcastSync, incidents, resident]
  );

  // Cancel Resident SOS
  const cancelResidentSos = useCallback(
    (reason = 'Cancelled by resident') => {
      if (!activeSosIncident) return;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === activeSosIncident.id
            ? { ...inc, status: 'resolved', notes: `${inc.notes} | Cancelled: ${reason}`, resolvedAt: timeStr }
            : inc
        )
      );

      setResident((r) => ({ ...r, checkInStatus: 'safe' }));

      setFloors((prev) =>
        prev.map((f) =>
          f.floorNumber === resident.floor
            ? { ...f, assistancePending: Math.max(0, f.assistancePending - 1) }
            : f
        )
      );

      addAuditLog(
        'SOS Cancelled / Resolved',
        'ยกเลิกสัญญาณ SOS / คลี่คลาย',
        `Incident ${activeSosIncident.id} marked resolved: ${reason}`,
        resident.name,
        'Resident'
      );
    },
    [activeSosIncident, addAuditLog, resident.floor, resident.name]
  );

  // Staff triage: Acknowledge incident
  const acknowledgeIncident = useCallback(
    (incidentId: string) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setIncidents((prev) =>
        prev.map((inc) => (inc.id === incidentId ? { ...inc, status: 'acknowledged', acknowledgedAt: timeStr } : inc))
      );

      addNotification({
        titleEn: `Incident Acknowledged: ${incidentId}`,
        titleTh: `ศูนย์ควบคุมรับทราบเหตุแล้ว: ${incidentId}`,
        messageEn: 'Building Security Control has acknowledged the distress call. Responders are being coordinated.',
        messageTh: 'ห้องควบคุมความปลอดภัยรับเรื่องเรียบร้อยแล้ว กำลังจัดส่งเจ้าหน้าที่เข้าพื้นที่',
        severity: 'info',
        category: 'emergency',
      });

      addAuditLog(
        'Incident Acknowledged',
        'รับทราบเหตุฉุกเฉิน',
        `Incident ${incidentId} acknowledged by Security Lead Somkid Jaidee`,
        'Somkid Jaidee',
        'Security'
      );
    },
    [addAuditLog, addNotification]
  );

  // Assign staff to incident
  const assignStaffToIncident = useCallback(
    (incidentId: string, staffIds: string[]) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === incidentId
            ? { ...inc, assignedStaffIds: staffIds, status: 'dispatched', updatedAt: timeStr }
            : inc
        )
      );

      // update staff assignments
      setStaff((prev) =>
        prev.map((s) =>
          staffIds.includes(s.id)
            ? { ...s, assignedIncidents: [...new Set([...s.assignedIncidents, incidentId])] }
            : s
        )
      );

      const assignedNames = staff
        .filter((s) => staffIds.includes(s.id))
        .map((s) => s.name)
        .join(', ');

      addNotification({
        titleEn: `Responders Dispatched: ${assignedNames}`,
        titleTh: `ส่งทีมช่วยเหลือแล้ว: ${assignedNames}`,
        messageEn: `Emergency staff members ${assignedNames} are en route to provide assistance.`,
        messageTh: `เจ้าหน้าที่ ${assignedNames} กำลังเดินทางไปยังตำแหน่งของท่าน`,
        severity: 'warning',
        category: 'emergency',
      });

      addAuditLog(
        'Staff Dispatched to Incident',
        'มอบหมายเจ้าหน้าที่เข้าช่วยเหลือ',
        `Assigned ${assignedNames} to incident ${incidentId}`,
        'Somkid Jaidee',
        'Security'
      );
    },
    [addAuditLog, addNotification, staff]
  );

  // Update status (e.g. Arrived on Scene, Resolved)
  const updateIncidentStatus = useCallback(
    (incidentId: string, status: IncidentStatus) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === incidentId
            ? {
                ...inc,
                status,
                updatedAt: timeStr,
                resolvedAt: status === 'resolved' ? timeStr : inc.resolvedAt,
              }
            : inc
        )
      );

      if (status === 'resolved') {
        // free staff
        setStaff((prev) =>
          prev.map((s) => ({
            ...s,
            assignedIncidents: s.assignedIncidents.filter((id) => id !== incidentId),
          }))
        );
      }

      addAuditLog(
        `Incident Status Changed: ${status.toUpperCase()}`,
        `เปลี่ยนสถานะเหตุการณ์: ${status}`,
        `Incident ${incidentId} updated to ${status}`,
        'Control Room',
        'Security'
      );
    },
    [addAuditLog]
  );

  // Close incident
  const closeIncident = useCallback(
    (incidentId: string) => {
      updateIncidentStatus(incidentId, 'resolved');
    },
    [updateIncidentStatus]
  );

  // Resident Safety Check-In
  const checkInResident = useCallback(
    (status: CheckInStatus) => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setResident((r) => ({ ...r, checkInStatus: status, checkInTimestamp: now }));

      // update in residents list
      setResidentsList((list) =>
        list.map((r) => (r.id === resident.id ? { ...r, checkInStatus: status, checkInTimestamp: now } : r))
      );

      // update floor statistics
      setFloors((prev) =>
        prev.map((f) => {
          if (f.floorNumber === resident.floor) {
            const isSafe = status === 'safe';
            return {
              ...f,
              evacuatedResidents: isSafe ? Math.min(f.totalResidents, f.evacuatedResidents + 1) : f.evacuatedResidents,
              assistancePending: status === 'needs_help' ? f.assistancePending + 1 : f.assistancePending,
            };
          }
          return f;
        })
      );

      addAuditLog(
        `Resident Check-In: ${status.toUpperCase()}`,
        `ลูกบ้านรายงานตัว: ${status}`,
        `Resident ${resident.name} (Unit ${resident.unit}) marked status as ${status}`,
        resident.name,
        'Resident'
      );

      if (status === 'safe') {
        addNotification({
          titleEn: `Safety Check-in Confirmed: Unit ${resident.unit}`,
          titleTh: `ยืนยันการเช็คอินความปลอดภัย: ห้อง ${resident.unit}`,
          messageEn: `Thank you, ${resident.name}. Building control and your emergency contacts have been notified that you are safe.`,
          messageTh: `ขอบคุณ คุณ ${resident.nameTh} ศูนย์ควบคุมอาคารและผู้ติดต่อฉุกเฉินได้รับแจ้งว่าท่านปลอดภัยแล้ว`,
          severity: 'info',
          category: 'safety',
        });
      }
    },
    [addAuditLog, addNotification, resident.floor, resident.id, resident.name, resident.nameTh, resident.unit]
  );

  // Scenario A: Earthquake
  const triggerEarthquakeScenario = useCallback(() => {
    setActiveScenario('earthquake');

    // halt elevators across all 20 floors
    setFloors((prev) =>
      prev.map((f) => ({
        ...f,
        hazards: {
          ...f.hazards,
          structuralDamage: f.floorNumber === 18, // simulated minor crack on top floor
        },
      }))
    );

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const quakeIncident: Incident = {
      id: `INC-EQ-${Date.now()}`,
      type: 'earthquake',
      titleEn: 'Seismic Tremor Detected (Magnitude 6.2 Off-Coast)',
      titleTh: 'ตรวจพบแรงสั่นสะเทือนแผ่นดินไหว (ขนาด 6.2)',
      floor: 0, // building-wide
      reportedAt: now,
      severity: 'critical',
      status: 'acknowledged',
      assignedStaffIds: ['staff-sec-1', 'staff-admin-1'],
      locationNote: 'Entire Condominium Structure — Tower A',
      notes: 'Automated seismic shutoff engaged on all 4 passenger elevator banks. Structural sensors scanning.',
      updatedAt: now,
    };

    setIncidents((prev) => [quakeIncident, ...prev]);

    addNotification({
      titleEn: '⚠️ EARTHQUAKE ALERT: DROP, COVER, HOLD ON',
      titleTh: '⚠️ สัญญาณเตือนภัยแผ่นดินไหว: หมอบ กำบัง ยึดแน่น',
      messageEn: 'Seismic tremors detected. Protect your head. Elevators are paused. Do not rush to exits until shaking stops.',
      messageTh: 'ตรวจพบแรงสั่นสะเทือน หมอบกำบังศีรษะใต้โต๊ะแข็งแรง ลิฟต์หยุดทำงานอัตโนมัติ รอจนแรงสั่นสงบ',
      severity: 'critical',
      category: 'emergency',
    });

    addAuditLog(
      'Earthquake Scenario Triggered',
      'เริ่มสถานการณ์แผ่นดินไหวจำลอง',
      'Seismic safety protocol active. All elevators paused at nearest floor with doors open.',
      'Demo Control Panel',
      'Evaluator'
    );
  }, [addAuditLog, addNotification]);

  // Scenario B: Fire on Floor 12
  const triggerFireScenario = useCallback(
    (targetFloor = 12) => {
      setActiveScenario('fire');

      // Set target floor hazards: high smoke PPM, high temperature, block corridor north
      setFloors((prev) =>
        prev.map((f) =>
          f.floorNumber === targetFloor
            ? {
                ...f,
                hazards: {
                  fireDetected: true,
                  smokePpm: 420,
                  tempCelsius: 68,
                  structuralDamage: false,
                },
                blockedCorridors: ['corridor_north', 'stair_a'],
                assistancePending: f.assistancePending + 1,
              }
            : f
        )
      );

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fireIncident: Incident = {
        id: `INC-FIRE-${Date.now()}`,
        type: 'fire',
        titleEn: `Confirmed Fire & Smoke Hazard — Floor ${targetFloor}`,
        titleTh: `สัญญาณเพลิงไหม้และกลุ่มควัน — ชั้น ${targetFloor}`,
        floor: targetFloor,
        reportedAt: now,
        severity: 'critical',
        status: 'acknowledged',
        assignedStaffIds: ['staff-resp-1', 'staff-resp-2'],
        locationNote: `Floor ${targetFloor}, North Corridor (Smoke Detector #12-N04 Triggered)`,
        notes: `Smoke sensor #12-N04 reading 420 PPM. Staircase A pressurization engaged. Dynamic rerouting to Staircase B activated.`,
        updatedAt: now,
      };

      setIncidents((prev) => [fireIncident, ...prev]);

      // Assign Responder 1 to Somchai (Wheelchair in Unit 1204)
      updateStaff('staff-resp-1', {
        assignedIncidents: [fireIncident.id],
      });

      addNotification({
        titleEn: `🔥 FIRE EMERGENCY ALERT: FLOOR ${targetFloor}`,
        titleTh: `🔥 สัญญาณแจ้งเหตุเพลิงไหม้: ชั้น ${targetFloor}`,
        messageEn: `Smoke detected on Floor ${targetFloor} North Corridor. Elevators disabled. Evacuate via Staircase B. Wheelchair residents proceed to Refuge 12-R!`,
        messageTh: `พบกลุ่มควันบริเวณโถงทิศเหนือ ชั้น ${targetFloor} ลิฟต์หยุดทำงาน อพยพทางบันไดหนีไฟ B ผู้ใช้วีลแชร์เข้าห้องพักคอย 12-R ทันที!`,
        severity: 'critical',
        category: 'emergency',
        floorTarget: targetFloor,
      });

      addAuditLog(
        `Fire Scenario Triggered on Floor ${targetFloor}`,
        `เริ่มสถานการณ์เพลิงไหม้บนชั้น ${targetFloor}`,
        `Floor ${targetFloor} smoke detector tripped (420 PPM). North corridor blocked. Dynamic rerouting active.`,
        'Demo Control Panel',
        'Evaluator'
      );
    },
    [addAuditLog, addNotification, updateStaff]
  );

  // Toggle corridor blockage
  const toggleCorridorBlockage = useCallback(
    (floorNum: number, corridorKey: string) => {
      setFloors((prev) =>
        prev.map((f) => {
          if (f.floorNumber === floorNum) {
            const isBlocked = f.blockedCorridors.includes(corridorKey);
            const newBlocked = isBlocked
              ? f.blockedCorridors.filter((c) => c !== corridorKey)
              : [...f.blockedCorridors, corridorKey];
            return { ...f, blockedCorridors: newBlocked };
          }
          return f;
        })
      );

      addAuditLog(
        `Corridor Hazard Toggled: Floor ${floorNum} [${corridorKey}]`,
        `ปรับเปลี่ยนสิ่งกีดขวางโถงทางเดิน: ชั้น ${floorNum} [${corridorKey}]`,
        `Corridor ${corridorKey} status toggled on floor ${floorNum}`,
        'Security Lead Somkid Jaidee',
        'Security'
      );
    },
    [addAuditLog]
  );

  // Simulate Wearable SOS
  const simulateWearableSos = useCallback(() => {
    setResident((r) => ({
      ...r,
      wearable: { ...r.wearable, sosActive: true },
    }));
    triggerResidentSos('medical', 'Triggered directly via Smartwatch SOS button hardware hold.');
  }, [triggerResidentSos]);

  // Simulate Fall Detection
  const simulateFallDetection = useCallback(() => {
    setResident((r) => ({
      ...r,
      wearable: { ...r.wearable, fallDetected: true, heartRate: 118 },
    }));
    triggerResidentSos('fall', 'Automated High-G Fall Impact detected by Smartwatch accelerometer.');
  }, [triggerResidentSos]);

  // Simulate Wearable Disconnect
  const simulateWearableDisconnect = useCallback(() => {
    setResident((r) => {
      const newStatus = !r.wearable.connected;
      return {
        ...r,
        wearable: { ...r.wearable, connected: newStatus },
      };
    });
  }, []);

  // Simulate Battery Level
  const simulateBatteryLevel = useCallback((level: number) => {
    setResident((r) => ({
      ...r,
      wearable: { ...r.wearable, batteryLevel: level },
    }));
  }, []);

  // Reset demo to normal conditions
  const resetAllToNormal = useCallback(() => {
    setResident(initialResidents[0]);
    setResidentsList(initialResidents);
    setFloors(initialFloors);
    setStaff(initialStaff);
    setIncidents([]);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
    setActiveScenario('normal');

    localStorage.removeItem(STORAGE_KEY);

    broadcastSync('STATE_SYNC', {
      resident: initialResidents[0],
      residentsList: initialResidents,
      floors: initialFloors,
      staff: initialStaff,
      incidents: [],
      notifications: initialNotifications,
      auditLogs: initialAuditLogs,
      activeScenario: 'normal',
    });

    addAuditLog(
      'System Reset to Normal',
      'รีเซ็ตระบบทั้งหมดสู่สภาวะปกติ',
      'All 20 floors cleared of hazards, active incidents resolved, default resident data restored.',
      'Demo Control Panel',
      'Evaluator'
    );
  }, [addAuditLog, broadcastSync]);

  const value: AppContextType = {
    language,
    setLanguage,
    t: translations[language],
    currentRole,
    setCurrentRole,
    currentView,
    setCurrentView,
    activeScenario,
    setActiveScenario,
    isOnboardingFlowOpen,
    setIsOnboardingFlowOpen,
    onboardingInitialStep,
    setOnboardingInitialStep,
    resident,
    updateResident,
    residentsList,
    updateResidentInList,
    floors,
    updateFloor,
    staff,
    updateStaff,
    incidents,
    notifications,
    auditLogs,
    addAuditLog,
    activeSos,
    activeSosIncident,
    triggerResidentSos,
    cancelResidentSos,
    acknowledgeIncident,
    assignStaffToIncident,
    updateIncidentStatus,
    closeIncident,
    checkInResident,
    triggerEarthquakeScenario,
    triggerFireScenario,
    simulateWearableSos,
    simulateFallDetection,
    simulateWearableDisconnect,
    simulateBatteryLevel,
    toggleCorridorBlockage,
    resetAllToNormal,
    addNotification,
    markAllNotificationsRead,
    isAudioMuted,
    toggleAudioMute,
    playEmergencyTone,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
