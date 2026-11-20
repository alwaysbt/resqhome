export type Language = 'th' | 'en';

export type UserRole = 'resident' | 'admin' | 'security' | 'responder';

export type AssistanceCategory = 'standard' | 'wheelchair' | 'elderly' | 'hearing' | 'visual';

export type EmergencyCategory =
  | 'medical'
  | 'fall'
  | 'accident'
  | 'evacuation'
  | 'other';

export type IncidentStatus =
  | 'reported'
  | 'acknowledged'
  | 'dispatched'
  | 'arrived'
  | 'resolved';

export type IncidentSeverity = 'info' | 'warning' | 'critical';

export type ScenarioType = 'normal' | 'earthquake' | 'fire';

export type CheckInStatus = 'safe' | 'needs_help' | 'evacuating' | 'pending';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  notifyPreference: 'sms' | 'call' | 'app';
}

export interface MedicalInfo {
  conditions: string;
  allergies: string;
  medications: string;
  bloodType: string;
  relevantHistory: string;
  mobilityLimitations: string;
  wheelchairUser: boolean;
  hearingAssistance: boolean;
  visualAssistance: boolean;
  communicationPreference: string;
  emergencyInstructions: string;
  additionalNotes: string;
}

export interface WearableDevice {
  connected: boolean;
  batteryLevel: number;
  heartRate: number;
  fallDetected: boolean;
  sosActive: boolean;
  lastSync: string;
  model: string;
  firmwareVersion: string;
}

export interface PdpaConsents {
  essentialAccepted: boolean;
  locationSharing: boolean;
  pushNotifications: boolean;
  healthTelemetry: boolean;
  acceptedAt?: string;
}

export interface Resident {
  id: string;
  name: string;
  nameTh: string;
  unit: string;
  floor: number;
  tower: string;
  phone: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  photoUrl?: string;
  assistanceCategory: AssistanceCategory;
  medicalInfo: MedicalInfo;
  emergencyContacts: EmergencyContact[];
  wearable: WearableDevice;
  checkInStatus: CheckInStatus;
  checkInTimestamp?: string;
  pdpaConsents: PdpaConsents;
}

export interface StaffMember {
  id: string;
  name: string;
  nameTh: string;
  role: 'admin' | 'security' | 'responder';
  roleTitleEn: string;
  roleTitleTh: string;
  phone: string;
  onDuty: boolean;
  assignedIncidents: string[];
  avatar?: string;
  location?: string;
}

export interface Incident {
  id: string;
  type: EmergencyCategory | 'earthquake' | 'fire';
  titleEn: string;
  titleTh: string;
  floor: number;
  unit?: string;
  residentId?: string;
  reportedAt: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedStaffIds: string[];
  locationNote: string;
  notes: string;
  updatedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface NotificationItem {
  id: string;
  titleEn: string;
  titleTh: string;
  messageEn: string;
  messageTh: string;
  severity: IncidentSeverity;
  timestamp: string;
  read: boolean;
  category: 'emergency' | 'system' | 'safety' | 'wearable';
  floorTarget?: number;
}

export interface FloorHazard {
  fireDetected: boolean;
  smokePpm: number; // normal 0-50, warning 51-200, danger 200+
  tempCelsius: number; // normal 25-30, danger 60+
  structuralDamage: boolean;
}

export interface BuildingFloor {
  floorNumber: number;
  nameEn: string;
  nameTh: string;
  units: string[];
  hazards: FloorHazard;
  blockedCorridors: string[]; // e.g. ['corridor_north', 'stair_a']
  totalResidents: number;
  evacuatedResidents: number;
  assistancePending: number;
  hasRefugeArea: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  actionTh: string;
  details: string;
}

export interface EvacuationStep {
  stepNumber: number;
  titleEn: string;
  titleTh: string;
  descriptionEn: string;
  descriptionTh: string;
  iconName: string;
  isCompleted: boolean;
  cautionEn?: string;
  cautionTh?: string;
}

export interface RouteSegment {
  fromNode: string;
  toNode: string;
  descriptionEn: string;
  descriptionTh: string;
  accessible: boolean;
  isSafe: boolean;
}

export interface EvacuationPlan {
  floorNumber: number;
  recommendedStair: 'stair_a' | 'stair_b' | 'refuge_area';
  stairAStatus: 'open' | 'blocked' | 'hazard';
  stairBStatus: 'open' | 'blocked' | 'hazard';
  elevatorsStatus: 'disabled_fire' | 'disabled_quake' | 'operational';
  refugeAreaAvailable: boolean;
  reasonEn: string;
  reasonTh: string;
  staffVerified: boolean;
  verifiedBy?: string;
  steps: EvacuationStep[];
}
