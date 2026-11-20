# ResQHome — Advanced Interactive Prototype
> **Smart Residential Emergency Assistance System for High-Rise Residential Buildings**  
> *ระบบช่วยเหลือฉุกเฉินอัจฉริยะสำหรับอาคารพักอาศัยสูง*

- **Public Live Deployment URL**: [https://alwaysbt.github.io/resqhome/](https://alwaysbt.github.io/resqhome/)
- **GitHub Repository**: [https://github.com/alwaysbt/resqhome](https://github.com/alwaysbt/resqhome)

---

## 1. Project Overview & Concept

**ResQHome** is a bilingual (Thai / English), fully interactive life-safety and emergency response platform designed for high-rise residential condominiums. In emergencies such as high-rise fires or earthquakes, traditional alarms treat all occupants identically and lack real-time coordination. ResQHome connects **residents**, **building management**, **security control rooms**, and **emergency response personnel** into an integrated, life-critical network.

### Two Connected Interfaces:
1. **Resident Mobile Application (`ResidentApp`)**:
   - Mobile-first interface for residents.
   - 1-Tap Emergency SOS with immediate triage & tracking.
   - Comprehensive Personal Emergency Profile with automatic age calculation from DOB.
   - Personalized assistance settings (Wheelchair, Elderly, Hearing Impairment, Visual Impairment).
   - Dynamic 2D architectural evacuation floor plan with real-time hazard rerouting.
   - Emergency notification center & life-safety wearable simulation.
   - Granular PDPA privacy consent controls and technology usage disclosures.

2. **Building Management Dashboard (`ManagementDashboard`)**:
   - Desktop-first operations hub for building staff.
   - 20-Floor visual status matrix and floor-by-floor inspector.
   - Live Incident Triage with multi-staff responder assignment.
   - Dynamic graph-based evacuation path verification.
   - Role-Based Access Control (RBAC) protecting confidential medical dossiers.
   - Assistance request dispatch queue.
   - Wearable telemetry stream (accelerometer fall detection & vitals).
   - Immutable audit trail logging all actions and PDPA data access.

3. **Interactive Split-View Mode (`SplitView`)**:
   - Displays both Resident App (left) and Management Dashboard (right) side-by-side.
   - Powered by `BroadcastChannel` and `localStorage` for zero-latency, cross-tab, cross-interface real-time synchronization.

---

## 2. Demo Credentials & Operational Roles

| Role | Name & Title | Demo Access Path | Key Permissions |
|---|---|---|---|
| **Resident** | **Somchai Prasert**<br>*(สมชาย ประเสริฐสุข)*<br>Unit 1204, Floor 12 | Select **Resident App** from Portal | 1-Tap SOS, edit profile, automatic age calculation, view evacuation route to Refuge 12-R, Safety Check-in, PDPA controls |
| **Building Administrator** | **Preecha Suksabai**<br>*(ผู้จัดการนิติบุคคลอาคารชุด)* | Select **Administrator** in Dashboard | Full administrative access, building sensor configuration, resident directory, incident logs, system reset |
| **Security / Control Room** | **Somkid Jaidee**<br>*(หัวหน้าฝ่ายความปลอดภัย / คอนโทรลรูม)* | Select **Security Lead** in Dashboard | Real-time incident triage, route verification, corridor blockage controls, building-wide evacuation broadcast |
| **Emergency Response Staff** | **Wichai Thongdee**<br>*(เจ้าหน้าที่กู้ภัยและเก้าอี้อพยพ)* | Select **Responder** in Dashboard | Assigned distress calls, confidential medical summaries, on-scene status updates, assistance completion confirmation |

---

## 3. Evaluator Guide: 6 Demonstration Scenarios

Launch any demonstration in 1-click using the floating **Demo Control Panel** (or test them manually):

### Demo 1: Normal Resident Experience
1. Open **Resident Mobile App**.
2. Review the **Privacy & Technology Onboarding Modal** (covers PDPA, IP terms, sensor usage, and granular consent checkboxes).
3. Tap **My Profile** > **Personal Info**:
   - Change the Date of Birth (DOB) and observe the **Calculated Age** updating automatically.
4. Tap **Medical & Life-Safety**:
   - Review wheelchair usage, hypertension, and penicillin allergy badges.
5. Tap **Life-Safety Watch** widget on Home:
   - Inspect connected battery (84%), pulse telemetry (74 BPM), and simulated Bluetooth Low Energy (BLE) link.

### Demo 2: Earthquake Scenario
1. Open **Demo Control Panel** and tap **Trigger Earthquake Scenario** (or click Demo 2 shortcut).
2. The entire application simulates seismic tremors (`animate-earthquake`).
3. Notice:
   - All passenger elevators across all 20 floors are automatically paused in safety mode.
   - Critical Earthquake alert notification is broadcast.
   - Resident Evacuation tab displays: *"Drop, Cover, and Hold On"* immediate guidance.
   - Resident submits **Safety Check-in** (*"I Am Safe at Assembly Point"*).
   - Management Dashboard updates floor statistics in real time.

### Demo 3: Fire & Dynamic Route Rerouting
1. Open **Demo Control Panel** and tap **Trigger Fire Scenario (Floor 12)** (or click Demo 3 shortcut).
2. Observe building conditions:
   - Floor 12 smoke sensor trips to **420 PPM** (Hazard), temperature spikes to **68°C**.
   - Corridor North and Staircase A are flagged as hazardous.
   - Passenger elevators are locked out with red warning: *"CRITICAL: DO NOT USE ELEVATORS DURING FIRE"*.
3. Open **Evacuation Map** in Resident App:
   - Dynamic routing engine detects Corridor North smoke.
   - Automatically reroutes resident south toward **Staircase B (East Core)** with clear rationale displayed:
     *"Dynamic Reroute: Corridor North / Staircase A has smoke hazard. Rerouted via South Corridor to Staircase B."*

### Demo 4: Personalized Assistance for Vulnerable Residents
1. Resident Somchai Prasert is a declared **Wheelchair User**.
2. During the fire alarm, the routing engine calculates that ordinary fire stairwells without staff assistance are hazardous.
3. The evacuation route directs Somchai directly to **Refuge Area 12-R** (reinforced room with 2-hour fire door and 2-way intercom).
4. Incident dispatch assigns **Officer Wichai (Team Alpha Evac-Chair Specialist)**.
5. Officer marks status as *Dispatched* -> *Arrived on Scene* -> *Assistance Complete*.

### Demo 5: Staff Coordination & Role-Based Access Control (RBAC)
1. In the **Building Management Dashboard**, switch roles between **Administrator**, **Security Lead**, and **Responder**:
   - **Security Lead** triages incoming SOS calls and verifies routes.
   - **Responder** sees assigned cases and opens the **Confidential Medical Dossier** (displays drug allergies and critical history under statutory operational necessity).
   - Every medical file inspection generates an immutable entry in the **History & PDPA Audit Trail**.

### Demo 6: Cross-Interface Real-Time Synchronization (Split View)
1. Open **Split View (Resident + Dashboard)**.
2. In the mobile window on the left, press the large red **Emergency SOS** button.
3. Observe with **zero manual refresh**:
   - The distress call appears immediately in the Management Dashboard triage queue on the right.
   - Staff clicks **Acknowledge** and assigns responder **Wichai Thongdee**.
   - The resident mobile app instantly updates from *"Reported"* to *"Acknowledged"* to *"Responders En Route"* with the assigned officer's name and contact!

---

## 4. Simulated Features vs. Actual Integrations

To ensure transparency, the prototype distinguishes simulated sensor hardware from operational software:

| Capability | Implementation in Prototype | Real-World Hardware Integration |
|---|---|---|
| **Cross-Interface Synchronization** | **Actual Live Implementation** (BroadcastChannel + LocalStorage) | WebSockets / MQTT / Cloud PubSub Broker |
| **Dynamic Routing Algorithm** | **Actual Graph Calculation** (Dijkstra/A* variant evaluating safety & accessibility) | Building BIM model / IoT occupancy sensors |
| **Age Auto-Calculation** | **Actual Real-Time JS Math** from ISO-8601 Date of Birth | User Profile Database |
| **Audio Siren Chime** | **Actual Web Audio API Synthesis** | In-app push sirens & corridor sounders |
| **Indoor Positioning (BLE / Wi-Fi)** | **Simulated** via floor and unit beacon anchors | Physical BLE iBeacon anchors & Wi-Fi RTT routers |
| **Smoke & Heat Sensors** | **Simulated** via granular control sliders (0–600 PPM, 20–90°C) | Building Fire Alarm Control Panel (FACP / BACnet / Modbus) |
| **Smartwatch Accelerometer** | **Simulated** via virtual wearable widget & 15-second fall countdown | Apple Watch / Wear OS CoreMotion & HealthKit API |
| **Passenger Elevator Lockout** | **Simulated** state transition to fire recall mode | Elevator Controller Relay (Dry contact / CAN bus) |

---

## 5. Technology Stack & Architecture

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8 + `@tailwindcss/vite`
- **Styling**: Tailwind CSS 4 with custom keyframe animations (`animate-emergency-pulse`, `animate-earthquake`)
- **Icons**: Lucide React
- **Architecture**:
  - `src/types/index.ts`: Type definitions for Residents, Floors, Hazards, Incidents, Staff, PDPA Consents.
  - `src/locales/translations.ts`: Complete bilingual dictionary (Thai & English).
  - `src/context/AppContext.tsx`: Central state management, LocalStorage persistence, BroadcastChannel synchronization.
  - `src/utils/evacuationRouter.ts`: Graph-based dynamic routing engine considering hazards & accessibility.
  - `src/components/floorplan/FloorPlanSvg.tsx`: 2D Architectural CAD SVG diagram with animated route paths.
  - `src/components/resident/`: Mobile Resident App views.
  - `src/components/management/`: Desktop Command & Control views.
  - `src/components/split/`: Dual-screen synchronized testing view.

---

## 6. How to Run Locally

```bash
# Clone repository
git clone https://github.com/alwaysbt/resqhome.git
cd resqhome

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
