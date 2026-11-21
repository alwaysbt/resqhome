import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EmergencyContact, Resident } from '../../types';
import {
  User,
  Heart,
  Phone,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Camera,
  Pencil,
  X,
  LogOut,
  MapPin,
  Shield,
  Activity,
  PhoneCall,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    language,
    t,
    resident,
    updateResident,
    setCurrentView,
    setCurrentRole,
    setIsOnboardingFlowOpen,
  } = useApp();
  const isThai = language === 'th';

  const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'contacts'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Resident>(resident);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    if (formData.emergencyContacts && formData.emergencyContacts.length > 0) score += 20;
    if (
      formData.medicalInfo?.conditions ||
      formData.medicalInfo?.allergies ||
      formData.medicalInfo?.mobilityLimitations
    ) {
      score += 15;
    }
    return Math.min(score, 100);
  };

  const completionScore = calculateCompletion();

  // Save changes handler (called from non-floating button at bottom of active card)
  const handleSave = () => {
    updateResident(formData);
    setIsEditing(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  // Cancel edit handler
  const handleCancel = () => {
    setFormData(resident);
    setIsEditing(false);
  };

  // Confirm logout
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    setCurrentRole('resident');
    setCurrentView('welcome');
    setIsOnboardingFlowOpen(false);
  };

  // Contacts operations
  const handleAddContact = () => {
    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: '',
      relationship: '',
      phone: '',
      isPrimary: (formData.emergencyContacts || []).length === 0,
      notifyPreference: 'call',
    };
    setFormData({
      ...formData,
      emergencyContacts: [...(formData.emergencyContacts || []), newContact],
    });
  };

  const handleUpdateContact = (id: string, partial: Partial<EmergencyContact>) => {
    setFormData({
      ...formData,
      emergencyContacts: (formData.emergencyContacts || []).map((c) =>
        c.id === id ? { ...c, ...partial } : c
      ),
    });
  };

  const handleDeleteContact = (id: string) => {
    setFormData({
      ...formData,
      emergencyContacts: (formData.emergencyContacts || []).filter((c) => c.id !== id),
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

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('personal');
              setIsEditing(false);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate">{t.profileTabPersonal}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('medical');
              setIsEditing(false);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'medical'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate">{t.profileTabMedical}</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('contacts');
              setIsEditing(false);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
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

      {/* ========================================================================= */}
      {/* Tab A: Personal Information */}
      {/* ========================================================================= */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-in fade-in duration-150">
          {/* Section Header with Edit Icon */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg overflow-hidden">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Resident" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(formData.nameTh || formData.name || 'R').charAt(0)}</span>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 p-1 bg-teal-600 text-white rounded-lg shadow-sm cursor-pointer"
                    title="Change Photo"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {formData.nameTh || formData.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {formData.name} • Unit {formData.unit} ({formData.tower})
                </p>
              </div>
            </div>

            {/* Edit Icon Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={isThai ? 'แก้ไขข้อมูลส่วนบุคคล' : 'Edit Personal Information'}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{isThai ? 'แก้ไข' : 'Edit'}</span>
              </button>
            ) : (
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
                {isThai ? 'กำลังแก้ไข...' : 'Editing...'}
              </span>
            )}
          </div>

          {/* VIEW MODE: Clean, senior-friendly display */}
          {!isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {t.fullName} (Thai)
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {formData.nameTh || '—'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {t.fullName} (English)
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {formData.name || '—'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-teal-600" />
                    <span>{t.birthDate}</span>
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {formData.birthDate || '—'} {calculatedAge > 0 && `(${calculatedAge} ${t.yearsOld})`}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {t.phone}
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">
                    {formData.phone || '—'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-[11px] font-semibold text-slate-400">
                  {t.email}
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {formData.email || '—'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">{t.tower}</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{formData.tower || '—'}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">{t.floorNumber}</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{formData.floor || '—'}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="block text-[10px] font-semibold text-slate-400">{t.apartmentNumber}</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{formData.unit || '—'}</span>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE: Form inputs with Save & Cancel at lowest part */
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.fullName} (Thai)</label>
                  <input
                    type="text"
                    value={formData.nameTh}
                    onChange={(e) => setFormData({ ...formData, nameTh: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    placeholder="สมชาย ประเสริฐสุข"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.fullName} (English)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    placeholder="Somchai Prasert"
                  />
                </div>

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
                    placeholder="08X-XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.email}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    placeholder="resident@resqhome.io"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t.tower}</label>
                    <input
                      type="text"
                      value={formData.tower}
                      onChange={(e) => setFormData({ ...formData, tower: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t.floorNumber}</label>
                    <input
                      type="number"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">{t.apartmentNumber}</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 text-center font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE & CANCEL BUTTONS AT THE LOWEST PART (STATIC INLINE, NOT FLOATING) */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{isThai ? 'ยกเลิก' : 'Cancel'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-3 px-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{isThai ? 'บันทึกข้อมูล' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab B: Medical & Life-Safety Information */}
      {/* ========================================================================= */}
      {activeTab === 'medical' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-in fade-in duration-150">
          {/* Section Header with Edit Icon */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>{t.profileTabMedical}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isThai ? 'ข้อมูลเพื่อการกู้ภัยและจัดทีมแพทย์' : 'Confidential Life-Safety Summary'}
              </p>
            </div>

            {/* Edit Icon Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={isThai ? 'แก้ไขข้อมูลสุขภาพ' : 'Edit Medical Information'}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{isThai ? 'แก้ไข' : 'Edit'}</span>
              </button>
            ) : (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                {isThai ? 'กำลังแก้ไข...' : 'Editing...'}
              </span>
            )}
          </div>

          {/* VIEW MODE: Clean, readable medical summary */}
          {!isEditing ? (
            <div className="space-y-3">
              {/* Assistance Status Badges */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">
                  {isThai ? 'ระดับความช่วยเหลือในการอพยพ' : 'Evacuation Assistance Category'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.medicalInfo?.wheelchairUser ? (
                    <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-600" />
                      <span>{t.wheelchairUser} (Wheelchair Required)</span>
                    </span>
                  ) : formData.assistanceCategory === 'elderly' ? (
                    <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 flex items-center gap-1.5">
                      <span>{isThai ? 'ผู้สูงอายุ / ไม้เท้า (Walker Support)' : 'Elderly / Walker Support'}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                      <span>{isThai ? 'ช่วยเหลือตนเองได้ (Independent)' : 'Fully Independent'}</span>
                    </span>
                  )}

                  {formData.medicalInfo?.hearingAssistance && (
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200">
                      {t.hearingAssistance}
                    </span>
                  )}
                  {formData.medicalInfo?.visualAssistance && (
                    <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
                      {t.visualAssistance}
                    </span>
                  )}
                </div>
              </div>

              {/* Blood Type & Conditions */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {t.bloodType}
                  </span>
                  <span className="text-xs font-black text-rose-700 font-mono mt-0.5 block">
                    {formData.medicalInfo?.bloodType || 'Unknown'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {t.medications}
                  </span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {formData.medicalInfo?.medications || 'None'}
                  </span>
                </div>
              </div>

              {/* Chronic Conditions */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-[11px] font-semibold text-slate-400">
                  {t.medicalConditions}
                </span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 leading-relaxed">
                  {formData.medicalInfo?.conditions || (isThai ? 'ไม่มีข้อมูลโรคประจำตัว' : 'None reported')}
                </p>
              </div>

              {/* Allergies Alert Box */}
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
                <span className="block text-[11px] font-bold text-rose-800">
                  {t.allergies} (Critical for First Aid)
                </span>
                <p className="text-xs font-bold text-rose-950 mt-0.5">
                  {formData.medicalInfo?.allergies || (isThai ? 'ไม่มีประวัติแพ้ยา' : 'No known drug allergies')}
                </p>
              </div>

              {/* Emergency Instructions */}
              {formData.medicalInfo?.emergencyInstructions && (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400">
                    {t.emergencyInstructions}
                  </span>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {formData.medicalInfo.emergencyInstructions}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* EDIT MODE: Inputs for medical profile */
            <div className="space-y-3 text-xs">
              {/* Assistance Requirements Checkboxes */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="font-bold text-slate-800 block">
                  {isThai ? 'ความต้องการความช่วยเหลือพิเศษ:' : 'Declared Assistance Requirements:'}
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalInfo?.wheelchairUser}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assistanceCategory: e.target.checked ? 'wheelchair' : 'standard',
                        medicalInfo: {
                          ...formData.medicalInfo,
                          wheelchairUser: e.target.checked,
                          mobilityLimitations: e.target.checked ? 'Wheelchair Required' : 'None',
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="font-semibold text-slate-800">{t.wheelchairUser}</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.medicalInfo?.hearingAssistance}
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
                    checked={formData.medicalInfo?.visualAssistance}
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
                  value={formData.medicalInfo?.conditions}
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
                  value={formData.medicalInfo?.allergies}
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
                    value={formData.medicalInfo?.medications}
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
                    value={formData.medicalInfo?.bloodType}
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
                  value={formData.medicalInfo?.emergencyInstructions}
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

              {/* SAVE & CANCEL BUTTONS AT THE LOWEST PART (STATIC INLINE, NOT FLOATING) */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{isThai ? 'ยกเลิก' : 'Cancel'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{isThai ? 'บันทึกข้อมูล' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Tab C: Emergency Contacts */}
      {/* ========================================================================= */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4 animate-in fade-in duration-150">
          {/* Section Header with Edit Icon */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600" />
                <span>{t.profileTabContacts}</span>
              </h3>
              <p className="text-xs text-slate-500">{t.tabContactsDesc}</p>
            </div>

            {/* Edit Icon Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={isThai ? 'แก้ไขผู้ติดต่อฉุกเฉิน' : 'Edit Emergency Contacts'}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{isThai ? 'แก้ไข' : 'Edit'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddContact}
                className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addContact}</span>
              </button>
            )}
          </div>

          {/* VIEW MODE: Clean contact cards with click-to-call */}
          {!isEditing ? (
            <div className="space-y-3">
              {(formData.emergencyContacts || []).length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  {isThai ? 'ยังไม่มีรายชื่อผู้ติดต่อฉุกเฉิน แตะปุ่มแก้ไขเพื่อเพิ่ม' : 'No emergency contacts added yet.'}
                </div>
              ) : (
                (formData.emergencyContacts || []).map((contact, index) => (
                  <div
                    key={contact.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                        {contact.isPrimary ? '★' : `#${index + 1}`}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{contact.name || '—'}</span>
                          {contact.isPrimary && (
                            <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.2 rounded-md font-bold">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {contact.relationship || (isThai ? 'ผู้ดูแล' : 'Caregiver')} •{' '}
                          <span className="font-mono">{contact.phone || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:border-teal-400 text-teal-700 shadow-2xs transition"
                        title="Call Contact"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* EDIT MODE: Contact editor form */
            <div className="space-y-3">
              {(formData.emergencyContacts || []).map((contact, index) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      #{index + 1} {contact.isPrimary ? '★ Primary Contact' : 'Secondary Contact'}
                    </span>
                    {(formData.emergencyContacts || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
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
                        placeholder="e.g. Somying Prasert"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">{t.relationship}</label>
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => handleUpdateContact(contact.id, { relationship: e.target.value })}
                        placeholder="e.g. Daughter, Son, Caregiver"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">{t.phone}</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleUpdateContact(contact.id, { phone: e.target.value })}
                        placeholder="08X-XXX-XXXX"
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

              {/* SAVE & CANCEL BUTTONS AT THE LOWEST PART (STATIC INLINE, NOT FLOATING) */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{isThai ? 'ยกเลิก' : 'Cancel'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-3 px-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/20"
                >
                  <Check className="w-4 h-4" />
                  <span>{isThai ? 'บันทึกข้อมูล' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOG OUT BUTTON: Below user data in the bottom right menu (Profile Tab) */}
      {/* ========================================================================= */}
      {!isEditing && (
        <div className="pt-2">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>{isThai ? 'ออกจากระบบ (Log Out)' : 'Log Out'}</span>
          </button>
        </div>
      )}

      {/* Confirmation Toast on Save */}
      {showSaveToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{isThai ? 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว' : t.saved}</span>
        </div>
      )}

      {/* Confirmation Modal on Log Out */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 space-y-3.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {isThai ? 'ยืนยันออกจากระบบ' : 'Confirm Log Out'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isThai
                  ? 'คุณต้องการออกจากระบบและกลับสู่หน้าหลักใช่หรือไม่?'
                  : 'Are you sure you want to log out of your resident account?'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                {isThai ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-rose-600/20"
              >
                {isThai ? 'ออกจากระบบ' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
