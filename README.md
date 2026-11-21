# ResQHome — Advanced Interactive Prototype
> **Smart Residential Emergency Assistance System for High-Rise Residential Buildings**  
> *ระบบช่วยเหลือฉุกเฉินอัจฉริยะสำหรับอาคารพักอาศัยสูง*

- **Public Live Deployment URL**: [https://alwaysbt.github.io/resqhome/](https://alwaysbt.github.io/resqhome/)
- **GitHub Repository**: [https://github.com/alwaysbt/resqhome](https://github.com/alwaysbt/resqhome)

---

## 1. Project Overview & Architectural Improvements

**ResQHome** is a bilingual (Thai / English), fully interactive life-safety and emergency response platform designed for high-rise residential condominiums. 

### Recent UX & Senior Accessibility Updates:
1. **Senior-Centric UI/UX**: Soft pastel color palette (calm mint `#eaf8ee`, diagnostics blue `#eaf4fc`, warm yellow `#fefce8`), large legible typography, high contrast, and an optional **Senior Font Size Switcher** (`Text: M` / `Text: L`).
2. **2-Step Accidental-Proof SOS Workflow**:
   - Tapping the Emergency button on Home or the bottom dock redirects to the SOS menu without triggering an immediate alarm.
   - **Step 1**: The resident chooses an emergency reason (*Medical Emergency, Fall / Injury, Accident in Unit, Evacuation Help, Other Urgent Distress*).
   - **Step 2**: The resident slides the tactile **"Slide to Confirm Emergency SOS"** track (*similar to sliding to pick up an incoming phone call*) to dispatch the distress call.
3. **Streamlined 6-Tab Management Dashboard**:
   - **1. Dashboard**: High-level overview, top metrics, and 20-floor skyscraper status matrix.
   - **2. Assistance Requests**: **Merged with Live Incidents** into a unified command triage center with multi-staff responder assignment and live tracking.
   - **3. Evacuation Monitoring**: Floor-by-floor evacuation progress, assembly point head count, and official building evacuation broadcast orders.
   - **4. Residential**: Resident directory showing declared assistance requirements, check-in status, and **integrated wearable user data** (*handling both residents with smartwatches and residents with mobile-only access*).
   - **5. Staff Management**: On-duty roster for Administrator, Security, and Emergency Responders.
   - **6. Building Map**: 2D architectural CAD floor plan inspector for all 20 floors with environmental telemetry and corridor blockage overrides.

---

## 2. Demo Credentials & Operational Roles

| Role | Name & Title | Demo Access Path | Key Permissions |
|---|---|---|---|
| **Resident** | **Somchai Prasert**<br>*(สมชาย ประเสริฐสุข)*<br>Unit 1204, Floor 12 | Select **Resident App** from Portal | Select emergency reason, slide to confirm SOS, edit profile, automatic age calculation, view evacuation route to Refuge 12-R, Safety Check-in, PDPA controls |
| **Building Administrator** | **Preecha Suksabai**<br>*(ผู้จัดการนิติบุคคลอาคารชุด)* | Select **Administrator** in Dashboard | Full administrative access, building sensor configuration, resident directory, incident logs, system reset |
| **Security / Control Room** | **Somkid Jaidee**<br>*(หัวหน้าฝ่ายความปลอดภัย / คอนโทรลรูม)* | Select **Security Lead** in Dashboard | Live incident triage, dispatch coordination, corridor blockage controls, route verification, evacuation orders |
| **Emergency Response Staff** | **Wichai Thongdee**<br>*(เจ้าหน้าที่กู้ภัยและเก้าอี้อพยพ)* | Select **Responder** in Dashboard | Assigned distress calls, confidential medical summaries, on-scene status updates, assistance completion confirmation |

---

## 3. Evaluator Guide: 6 Demonstration Scenarios

Launch any demonstration in 1-click using the floating **Demo Control Panel** (or test them manually):

### Demo 1: Normal Resident Experience & 2-Step SOS Flow
1. Open **Resident Mobile App**.
2. Review the **Privacy & Technology Onboarding Modal** (covers PDPA, IP terms, sensor usage, and granular consent checkboxes).
3. On Home, tap the large red **Emergency SOS** card:
   - Notice it safely navigates to the SOS screen **without** triggering false alarms.
   - **Select Reason**: Tap **"Fall / Injury"** or **"Medical Emergency"**.
   - **Slide to Confirm**: Drag the phone knob to the right on the **"Slide to Confirm Emergency SOS"** track to dispatch the call!
4. Tap **My Profile** > **Personal Info**:
   - Change the Date of Birth (DOB) and observe the **Calculated Age** updating automatically.
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
   - Open **Assistance Requests** to triage incoming calls and verify routes.
   - Open **Residential** to view resident profiles and wearable vitals.
   - Click **Dossier** to open the resident's **Confidential Medical Dossier** (displays drug allergies and clinical instructions).
   - Every medical file inspection generates an immutable entry in the **History & PDPA Audit Trail**.

### Demo 6: Cross-Interface Real-Time Synchronization (Split View)
1. Open **Split View (Resident + Dashboard)**.
2. In the mobile window on the left, tap the emergency button, select **"Medical Emergency"**, and slide the track to confirm.
3. Observe on the right dashboard screen with **zero manual refresh**:
   - The distress call appears immediately in the **Assistance Requests** triage queue.
   - Staff clicks **Acknowledge** and assigns responder **Wichai Thongdee**.
   - The resident mobile app instantly updates from *"Reported"* to *"Acknowledged"* to *"Responders En Route"* with the assigned officer's name and contact!

---

## 4. Technology Stack & Architecture

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8 + `@tailwindcss/vite`
- **Styling**: Tailwind CSS 4 with custom keyframe animations (`animate-emergency-pulse`, `animate-earthquake`)
- **Icons**: Lucide React
- **Synchronization**: `BroadcastChannel` + `localStorage` for cross-tab real-time reactivity

---

## 5. How to Run Locally

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
