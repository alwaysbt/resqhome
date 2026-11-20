import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  FileText,
  Cpu,
  CheckSquare,
  Lock,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { language, t, resident, updateResident } = useApp();
  const isThai = language === 'th';

  const [activeTab, setActiveTab] = useState<'pdpa' | 'terms' | 'tech' | 'consents'>('pdpa');
  const [consents, setConsents] = useState({
    essentialAccepted: resident.pdpaConsents.essentialAccepted ?? true,
    locationSharing: resident.pdpaConsents.locationSharing ?? true,
    pushNotifications: resident.pdpaConsents.pushNotifications ?? true,
    healthTelemetry: resident.pdpaConsents.healthTelemetry ?? true,
  });

  if (!isOpen) return null;

  const handleSaveAndProceed = () => {
    updateResident({
      pdpaConsents: {
        ...consents,
        acceptedAt: new Date().toISOString(),
      },
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-sky-800 to-blue-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/20">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.onboardingTitle}</h2>
              <p className="text-xs text-teal-100 mt-0.5">{t.onboardingSubtitle}</p>
            </div>
          </div>

          {/* Legal Prototype Disclaimer Badge */}
          <div className="mt-4 p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-[11px] text-teal-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>{t.onboardingDisclaimer}</span>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-5">
            <button
              onClick={() => setActiveTab('pdpa')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'pdpa'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isThai ? '1. นโยบาย PDPA' : '1. PDPA Notice'}</span>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'terms'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isThai ? '2. ทรัพย์สินทางปัญญา' : '2. IP & Terms'}</span>
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'tech'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isThai ? '3. การใช้เทคโนโลยี' : '3. Tech & Sensors'}</span>
            </button>
            <button
              onClick={() => setActiveTab('consents')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'consents'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{isThai ? '4. สิทธิ์และการยินยอม' : '4. Consents'}</span>
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[58vh] overflow-y-auto text-slate-700 text-sm leading-relaxed space-y-4">
          {activeTab === 'pdpa' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <h3 className="font-bold text-teal-900 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" />
                  <span>{t.pdpaContentTitle}</span>
                </h3>
                <p className="text-teal-800 text-xs leading-relaxed">{t.pdpaContentP1}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ก. บุคคลผู้มีสิทธิ์เข้าถึงข้อมูลสุขภาพ' : 'A. Authorized Access & Staff Roles'}
                  </h4>
                  <p className="text-slate-600">{t.pdpaContentP2}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ข. การแชร์ข้อมูลระหว่างเกิดเหตุฉุกเฉิน' : 'B. Emergency Data Sharing Protocol'}
                  </h4>
                  <p className="text-slate-600">
                    {isThai
                      ? 'เมื่อมีการกด SOS ข้อมูลจำเป็น เช่น โรคประจำตัว การแพ้ยา และตำแหน่งห้องชุดจะถูกส่งตรงไปยังห้องควบคุมความปลอดภัย (Security Control Room) และเจ้าหน้าที่กู้ภัยที่ได้รับมอบหมาย โดยข้อมูลจะแสดงผลเฉพาะช่วงเวลาที่มีเหตุฉุกเฉินและจะถูกบันทึกประวัติ (Audit Log) ทุกครั้งที่มีการเปิดดู'
                      : 'Upon SOS activation, life-critical data (conditions, drug allergies, unit location) is instantly dispatched to on-duty Security Officers and assigned Response Staff. Every access is timestamped in the immutable audit trail.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ค. ระยะเวลาการจัดเก็บและการใช้สิทธิ์ของเจ้าของข้อมูล' : 'C. Data Retention & Exercising Privacy Rights'}
                  </h4>
                  <p className="text-slate-600">{t.pdpaContentP3}</p>
                  <p className="text-slate-600 mt-1">
                    {isThai
                      ? 'ผู้อยู่อาศัยสามารถแก้ไข ลบ หรือเพิกถอนความยินยอมข้อมูลที่ไม่จำเป็นได้ตลอดเวลาผ่านเมนู Settings > Privacy & Technology'
                      : 'Residents may inspect, update, or revoke non-essential consents anytime via Settings > Privacy & Technology.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <h3 className="font-bold text-sky-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-700" />
                  <span>{t.termsContentTitle}</span>
                </h3>
                <p className="text-sky-800 text-xs leading-relaxed">{t.termsContentP1}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ก. ความเป็นเจ้าของระบบและสิทธิ์การใช้งาน' : 'A. Software Ownership & Permitted Use'}
                  </h4>
                  <p className="text-slate-600">
                    {isThai
                      ? 'ระบบ ResQHome และอัลกอริทึมการคำนวณเส้นทางหลบหนีภัยฉุกเฉิน เป็นทรัพย์สินทางปัญญาที่ได้รับความคุ้มครอง ไม่อนุญาตให้คัดลอก ทำซ้ำ หรือดัดแปลงซอร์สโค้ดเพื่อประโยชน์เชิงพาณิชย์โดยไม่ได้รับอนุญาต'
                      : 'ResQHome software, algorithms, and interface designs are proprietary. Unlicensed commercial reproduction or reverse engineering is strictly prohibited.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ข. ผังอาคารและแผนที่ความปลอดภัย' : 'B. Architectural Floor Plans & Safety Maps'}
                  </h4>
                  <p className="text-slate-600">
                    {isThai
                      ? 'ผังอาคารสถาปัตยกรรม 2 มิติที่แสดงในระบบ เป็นลิขสิทธิ์ของนิติบุคคลอาคารชุด เซเรนิตี้ ไฮท์ส อนุญาตให้ผู้อยู่อาศัยใช้สำหรับการนำทางเพื่อความปลอดภัยและซ้อมหนีไฟเท่านั้น'
                      : 'The 2D architectural CAD layouts are copyrighted condominium assets licensed solely for resident emergency navigation and evacuation drills.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ค. การใช้งานที่เหมาะสมและข้อห้าม' : 'C. Appropriate Use & False Alarm Policy'}
                  </h4>
                  <p className="text-slate-600">{t.termsContentP2}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-700" />
                  <span>{t.techContentTitle}</span>
                </h3>
                <p className="text-indigo-800 text-xs leading-relaxed">{t.techContentP1}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ก. การระบุตำแหน่งภายในอาคาร (BLE / Wi-Fi Simulation)' : 'A. Indoor Positioning (BLE / Wi-Fi Simulation)'}
                  </h4>
                  <p className="text-slate-600">
                    {isThai
                      ? 'ระบบจำลองการทำงานของบีคอนบลูทูธพลังงานต่ำ (BLE Beacon) ประจำจุดตามโถงทางเดินและประตูห้องชุด เพื่อประเมินว่าลูกบ้านอยู่ใกล้บริเวณใด โดยไม่มีการเปิดเผยพิกัดนอกอาคาร'
                      : 'Estimates proximity using simulated corridor Bluetooth Low Energy (BLE) beacons and Wi-Fi RTT. Zero invasive outdoor GPS tracking.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ข. เซนเซอร์ควัน ความร้อน และระบบแจ้งเหตุเพลิงไหม้ (FACP)' : 'B. Building Fire Alarm Control Panel (FACP) Integration'}
                  </h4>
                  <p className="text-slate-600">{t.techContentP2}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    {isThai ? 'ค. อุปกรณ์สวมใส่อัจฉริยะ (Life-Safety Wearable)' : 'C. Smartwatch Telemetry & Fall Detection'}
                  </h4>
                  <p className="text-slate-600">{t.techContentP3}</p>
                  <p className="text-slate-500 mt-1 italic">
                    {isThai
                      ? '*หมายเหตุ: อุปกรณ์สวมใส่เป็นทางเลือกเสริม (Optional) ฟังค์ชันขอความช่วยเหลือหลักบนมือถือใช้งานได้สมบูรณ์โดยไม่ต้องมีนาฬิกา'
                      : '*Note: Wearable device integration is optional. All essential emergency SOS features operate without a smartwatch.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consents' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">
                  {isThai ? 'การยินยอมตามมาตรา PDPA:' : 'Granular PDPA Consent Configuration:'}
                </span>{' '}
                {isThai
                  ? 'ระบบแยกแยะการประมวลผลที่จำเป็นออกจากสิทธิ์ทางเลือก โดยไม่บังคับติ๊กถูกรวมกันทั้งหมด'
                  : 'Consents are granularly segmented according to PDPA principles. Essential safety processing is distinct from optional telemetry.'}
              </div>

              {/* Granular Checkboxes */}
              <div className="space-y-3">
                {/* 1. Essential (Required) */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.essentialAccepted}
                    disabled
                    className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                      <span>{t.consentEssential}</span>
                      <span className="text-[10px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded font-semibold">
                        {isThai ? 'จำเป็นตามกฎหมายความปลอดภัย' : 'Statutory Safety Base'}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-800 mt-0.5">
                      {isThai
                        ? 'อนุญาตให้นิติบุคคลและทีมตอบสนองเหตุฉุกเฉินประมวลผลชื่อ ห้องชุด และข้อมูลการช่วยเหลือเพื่อการช่วยชีวิต'
                        : 'Authorizes building staff to process name, unit, and life-safety needs during active emergency dispatch.'}
                    </p>
                  </div>
                </label>

                {/* 2. Optional Location */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.locationSharing}
                    onChange={(e) => setConsents({ ...consents, locationSharing: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{t.consentLocation}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        Optional
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isThai
                        ? 'อนุญาตให้แชร์พิกัดบีคอนในโถงทางเดินเมื่อกด SOS เพื่อให้เจ้าหน้าที่ค้นพบตำแหน่งได้เร็วขึ้น'
                        : 'Allows corridor beacon triangulation during active distress calls for rapid responder routing.'}
                    </p>
                  </div>
                </label>

                {/* 3. Push Notifications */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.pushNotifications}
                    onChange={(e) => setConsents({ ...consents, pushNotifications: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{t.consentNotifications}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isThai
                        ? 'รับการแจ้งเตือนคำสั่งอพยพ คำแนะนำการหนีไฟ และเสียงไซเรนฉุกเฉินความดังสูง'
                        : 'Receive critical building-wide evacuation broadcasts and acoustic sirens.'}
                    </p>
                  </div>
                </label>

                {/* 4. Optional Wearable Health */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.healthTelemetry}
                    onChange={(e) => setConsents({ ...consents, healthTelemetry: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{t.consentWearable}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        Optional
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isThai
                        ? 'รับส่งข้อมูลเซนเซอร์ตรวจจับการล้มกระแทก (Fall Detection) และระดับแบตเตอรี่จากนาฬิกาอัจฉริยะ'
                        : 'Sync accelerometer fall detection events and battery state from life-safety smartwatch.'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{t.consentAgreedNote}</span>
          </div>

          <div className="flex items-center gap-2">
            {activeTab !== 'consents' ? (
              <button
                onClick={() => {
                  if (activeTab === 'pdpa') setActiveTab('terms');
                  else if (activeTab === 'terms') setActiveTab('tech');
                  else if (activeTab === 'tech') setActiveTab('consents');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>{t.next}</span>
                <span>➔</span>
              </button>
            ) : (
              <button
                onClick={handleSaveAndProceed}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.proceedToApp}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
