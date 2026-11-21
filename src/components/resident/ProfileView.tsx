import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EmergencyContact, Resident } from '../../types';
import {
  User,
  Heart,
  Phone,
  Save,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Calendar,
  ShieldCheck,
  Camera,
  UserPlus,
  Lock,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    language,
    t,
    resident,
    updateResident,
    setIsOnboardingFlowOpen,
    setOnboardingInitialStep,
  } = useApp();
  const isThai = language === 'th';

  const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'contacts'>('personal');
  const [formData, setFormData] = useState<Resident>(resident);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Sync formData with resident when resident changes
  useEffect(() => {
    setFormData(resident);
  }, [resident]);

  // Dynamic automatic age calculation from DOB
  const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return 0;
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const calculatedAge = calculateAge(formData.birthDate);

  // Profile completion calculation
  const calculateCompletion = () => {
    let score = 0;
    if (formData.name) score += 20;
    if (formData.phone) score += 15;
    if (formData.unit) score += 15;
    if (formData.birthDate) score += 15;
    if (formData.emergencyContacts.length > 0) score += 20;
    if (formData.medicalInfo.conditions || formData.medicalInfo.allergies || formData.medicalInfo.mobilityLimitations) score += 15;
    return Math.min(score, 100);
  };

  const completionScore = calculateCompletion();

  const handleSave = () => {
    updateResident(formData);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  // Contacts operations
  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: '',
      relationship: '',
      phone: '',
      isPrimary: formData.emergencyContacts.length === 0,
      notifyPreference: 'call',
    };
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, newContact],
    });
  };

  const handleUpdateContact = (id: string, partial: Partial<EmergencyContact>) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.map((c) =>
        c.id === id ? { ...c, ...partial } : c
      ),
    });
  };

  const handleDeleteContact = (id: string) => {
    setFormData({
      ...formData,
      emergencyContacts: formData.emergencyContacts.filter((c) => c.id !== id),
    });
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Header & Readiness Indicator */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.profileTitle}</h2>
            <p className="text-xs text-slate-500">{t.profileSubtitle}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
            {completionScore}% {t.profileCompletion}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-sky-500 h-2 transition-all duration-500 rounded-full"
            style={{ width: `${completionScore}%` }}
          ></div>
        </div>

        {/* Quick Actions: Sign Up & PDPA Flow */}
        <div className="mt-3.5 p-3 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="text-[11px] font-bold text-teal-950">
              {isThai ? 'ต้องการเริ่มขั้นตอนสมัครใหม่?' : 'New Resident Onboarding'}
            </span>
          </div>
          <button
            onClick={() => {
              setOnboardingInitialStep('signup');
              setIsOnboardingFlowOpen(true);
            }}
            className="text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1 rounded-xl shadow-xs transition cursor-pointer"
          >
            {isThai ? 'เริ่ม Sign Up & PDPA' : 'Launch Flow'}
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'personal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate">{t.profileTabPersonal}</span>
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'medical'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate">{t.profileTabMedical}</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'contacts'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span className="truncate">{t.profileTabContacts}</span>
          </button>
        </div>
      </div>

      {/* Tab A: Personal Information */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Resident" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 p-1 bg-teal-600 text-white rounded-lg shadow-sm"
                title="Change Photo (Optional)"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{formData.name}</h3>
              <p className="text-xs text-slate-500">Unit {formData.unit} • {formData.tower}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.fullName}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Date of Birth & Automatic Age Calculation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t.birthDate}</span>
                </label>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 text-[11px]">
                  {t.calculatedAge}: {calculatedAge} {t.yearsOld}
                </span>
              </div>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.phone}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.email}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.tower}</label>
              <input
                type="text"
                value={formData.tower}
                onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.floorNumber}</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.apartmentNumber}</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab B: Medical & Life-Safety Information */}
      {activeTab === 'medical' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-in fade-in duration-150">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {isThai ? 'ข้อมูลการแพทย์ใช้เพื่อการกู้ภัยเท่านั้น' : 'Confidential Life-Safety Information'}
              </span>
              <p className="text-[11px] text-rose-800 mt-0.5">
                {isThai
                  ? 'ข้อมูลในส่วนนี้จะถูกเปิดเผยต่อเจ้าหน้าที่รักษาความปลอดภัยและทีมกู้ภัยเฉพาะเมื่อมีการกด SOS เท่านั้น'
                  : 'Disclosed strictly to on-duty response personnel during active distress emergencies.'}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Assistance Need Checkboxes */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <label className="font-bold text-slate-800 block">
                {isThai ? 'ความต้องการความช่วยเหลือพิเศษ (Assistance Requirements):' : 'Declared Assistance Requirements:'}
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.medicalInfo.wheelchairUser}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assistanceCategory: e.target.checked ? 'wheelchair' : 'standard',
                      medicalInfo: { ...formData.medicalInfo, wheelchairUser: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">{t.wheelchairUser}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.medicalInfo.hearingAssistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalInfo: { ...formData.medicalInfo, hearingAssistance: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">{t.hearingAssistance}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.medicalInfo.visualAssistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalInfo: { ...formData.medicalInfo, visualAssistance: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-800">{t.visualAssistance}</span>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.medicalConditions}</label>
              <textarea
                rows={2}
                value={formData.medicalInfo.conditions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicalInfo: { ...formData.medicalInfo, conditions: e.target.value },
                  })
                }
                placeholder={t.medicalConditionsHint}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>{t.allergies}</span>
                <span className="text-rose-600 font-bold text-[10px]">Critical for First Aid</span>
              </label>
              <textarea
                rows={2}
                value={formData.medicalInfo.allergies}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicalInfo: { ...formData.medicalInfo, allergies: e.target.value },
                  })
                }
                placeholder={t.allergiesHint}
                className="w-full bg-slate-50 border border-rose-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.medications}</label>
                <input
                  type="text"
                  value={formData.medicalInfo.medications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalInfo: { ...formData.medicalInfo, medications: e.target.value },
                    })
                  }
                  placeholder={t.medicationsHint}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.bloodType}</label>
                <input
                  type="text"
                  value={formData.medicalInfo.bloodType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalInfo: { ...formData.medicalInfo, bloodType: e.target.value },
                    })
                  }
                  placeholder="e.g. O+, A+, B+"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.emergencyInstructions}</label>
              <textarea
                rows={2}
                value={formData.medicalInfo.emergencyInstructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicalInfo: { ...formData.medicalInfo, emergencyInstructions: e.target.value },
                  })
                }
                placeholder={t.emergencyInstructionsHint}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab C: Emergency Contacts */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">{t.profileTabContacts}</h3>
              <p className="text-xs text-slate-500">{t.tabContactsDesc}</p>
            </div>
            <button
              type="button"
              onClick={handleAddContact}
              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addContact}</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.emergencyContacts.map((contact, index) => (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    #{index + 1} {contact.isPrimary ? '★ Primary Contact' : 'Secondary Contact'}
                  </span>
                  {formData.emergencyContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1"
                      title={t.deleteContact}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">{t.contactName}</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleUpdateContact(contact.id, { name: e.target.value })}
                      placeholder="e.g. Somchai Jr."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">{t.relationship}</label>
                    <input
                      type="text"
                      value={contact.relationship}
                      onChange={(e) => handleUpdateContact(contact.id, { relationship: e.target.value })}
                      placeholder="e.g. Son, Daughter, Spouse"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">{t.phone}</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleUpdateContact(contact.id, { phone: e.target.value })}
                      placeholder="081-xxx-xxxx"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={contact.isPrimary}
                        onChange={(e) => handleUpdateContact(contact.id, { isPrimary: e.target.checked })}
                        className="w-4 h-4 rounded text-teal-600"
                      />
                      <span>{t.isPrimaryContact}</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button & Confirmation Toast */}
      <div className="sticky bottom-16 z-30 pt-2">
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{t.save}</span>
        </button>
      </div>

      {showSaveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{t.saved}</span>
        </div>
      )}
    </div>
  );
};
