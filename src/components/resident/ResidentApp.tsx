import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HomeView } from './HomeView';
import { SosView } from './SosView';
import { EvacuationView } from './EvacuationView';
import { NotificationsView } from './NotificationsView';
import { ProfileView } from './ProfileView';
import { SettingsView } from './SettingsView';
import { OnboardingModal } from './OnboardingModal';
import { WearableWidget } from './WearableWidget';
import { ResidentOnboardingFlow } from './ResidentOnboardingFlow';
import {
  Home,
  ShieldAlert,
  Map,
  Bell,
  User,
  Settings,
  ChevronLeft,
  Type,
  UserPlus,
} from 'lucide-react';

export const ResidentApp: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const {
    language,
    t,
    activeSos,
    notifications,
    resident,
    setCurrentView,
    isOnboardingFlowOpen,
    setIsOnboardingFlowOpen,
    onboardingInitialStep,
    setOnboardingInitialStep,
  } = useApp();
  const isThai = language === 'th';

  const [currentTab, setCurrentTab] = useState<'home' | 'emergency' | 'evacuation' | 'notifications' | 'profile' | 'settings'>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isWearableOpen, setIsWearableOpen] = useState(false);
  const [largeFontMode, setLargeFontMode] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`w-full flex justify-center ${isEmbedded ? 'p-0' : 'p-2 sm:p-6'}`}>
      {/* Mobile Device Frame Container (Modern iPhone-style frame with smooth curvature) */}
      <div className={`w-full max-w-[430px] bg-[#f8f9fa] rounded-[44px] shadow-2xl border-4 sm:border-8 border-slate-900 overflow-hidden flex flex-col relative min-h-[780px] max-h-[92vh] ${
        largeFontMode ? 'text-base' : 'text-sm'
      }`}>
        {/* Dynamic Island Status Bar */}
        <div className="bg-slate-950 text-white px-7 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0">
          <span className="font-semibold text-xs tracking-tight">09:41</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-800"></span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-slate-300 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-300 rounded-xs"></div>
            </div>
          </div>
        </div>

        {/* Top App Bar with Elderly Font Size Toggle & Back Button */}
        <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!isEmbedded && (
              <button
                onClick={() => setCurrentView('welcome')}
                className="p-1 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Back to Welcome Portal"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                R
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                ResQHome
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sign Up / New Resident Onboarding Button */}
            <button
              onClick={() => {
                setOnboardingInitialStep('signup');
                setIsOnboardingFlowOpen(!isOnboardingFlowOpen);
              }}
              className={`px-2 py-1 rounded-xl text-[10.5px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                isOnboardingFlowOpen
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
              }`}
              title="Sign Up / New Resident Registration"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-600" />
              <span>{isThai ? 'สมัครใหม่' : 'Sign Up'}</span>
            </button>

            {/* Elderly Friendly Large Text Toggle */}
            <button
              onClick={() => setLargeFontMode(!largeFontMode)}
              className={`px-2 py-1 rounded-xl text-[10.5px] font-bold border transition flex items-center gap-1 ${
                largeFontMode
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle Large Text for Seniors"
            >
              <Type className="w-3.5 h-3.5" />
              <span>{largeFontMode ? 'Text: L' : 'Text: M'}</span>
            </button>

            {activeSos && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                SOS
              </span>
            )}
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              {resident.unit}
            </span>
          </div>
        </div>

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto px-5 pt-3 pb-24 space-y-4">
          {isOnboardingFlowOpen ? (
            <ResidentOnboardingFlow
              initialStep={onboardingInitialStep}
              onComplete={() => {
                setIsOnboardingFlowOpen(false);
                setCurrentTab('home');
              }}
              onCancel={() => setIsOnboardingFlowOpen(false)}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeView
                  onNavigate={(tab) => setCurrentTab(tab)}
                  onOpenWearableModal={() => setIsWearableOpen(true)}
                />
              )}
              {currentTab === 'emergency' && <SosView />}
              {currentTab === 'evacuation' && <EvacuationView />}
              {currentTab === 'notifications' && <NotificationsView />}
              {currentTab === 'profile' && <ProfileView />}
              {currentTab === 'settings' && (
                <SettingsView onOpenOnboarding={() => setIsOnboardingOpen(true)} />
              )}
            </>
          )}
        </div>

        {/* Floating Dock Navigation Bar (Clean Pill Dock inspired by Image 1 and Image 2) */}
        {!isOnboardingFlowOpen && (
          <div className="absolute bottom-4 left-4 right-4 z-30 select-none animate-in fade-in duration-150">
            <nav className="bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-slate-200/90 px-3 py-2 flex items-center justify-around">
            {/* Home */}
            <button
              onClick={() => setCurrentTab('home')}
              className={`p-2.5 rounded-full transition flex flex-col items-center relative ${
                currentTab === 'home'
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label={t.navHome}
            >
              <Home className="w-5 h-5" />
              {currentTab === 'home' && (
                <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1"></span>
              )}
            </button>

            {/* Evacuation Map */}
            <button
              onClick={() => setCurrentTab('evacuation')}
              className={`p-2.5 rounded-full transition flex flex-col items-center relative ${
                currentTab === 'evacuation'
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label={t.navEvacuation}
            >
              <Map className="w-5 h-5" />
              {currentTab === 'evacuation' && (
                <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1"></span>
              )}
            </button>

            {/* Center Elevated Action Button: Emergency SOS (Prominent circular button like Image 1 & 2) */}
            <button
              onClick={() => setCurrentTab('emergency')}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all transform shadow-md -translate-y-2 active:scale-95 ${
                activeSos
                  ? 'bg-rose-600 animate-emergency-pulse shadow-rose-500/40 ring-4 ring-rose-200'
                  : 'bg-slate-950 hover:bg-slate-900 shadow-slate-900/30 ring-4 ring-white'
              }`}
              aria-label={t.navEmergency}
            >
              <ShieldAlert className="w-6 h-6 text-white" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setCurrentTab('notifications')}
              className={`p-2.5 rounded-full transition flex flex-col items-center relative ${
                currentTab === 'notifications'
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label={t.navNotifications}
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </div>
              {currentTab === 'notifications' && (
                <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1"></span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`p-2.5 rounded-full transition flex flex-col items-center relative ${
                currentTab === 'profile'
                  ? 'text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label={t.navProfile}
            >
              <User className="w-5 h-5" />
              {currentTab === 'profile' && (
                <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1"></span>
              )}
            </button>
          </nav>
        </div>
        )}

        {/* Modals */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={() => setIsOnboardingOpen(false)}
        />

        <WearableWidget
          isOpen={isWearableOpen}
          onClose={() => setIsWearableOpen(false)}
        />
      </div>
    </div>
  );
};
