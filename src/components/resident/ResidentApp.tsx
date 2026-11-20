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
import {
  Home,
  ShieldAlert,
  Map,
  Bell,
  User,
  Settings,
  ChevronLeft,
} from 'lucide-react';

export const ResidentApp: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const { language, t, activeSos, notifications, resident, setCurrentView } = useApp();
  const isThai = language === 'th';

  const [currentTab, setCurrentTab] = useState<'home' | 'emergency' | 'evacuation' | 'notifications' | 'profile' | 'settings'>('home');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isWearableOpen, setIsWearableOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`w-full flex justify-center ${isEmbedded ? 'p-0' : 'p-2 sm:p-6'}`}>
      {/* Mobile Device Frame Container */}
      <div className={`w-full max-w-[430px] bg-slate-100 rounded-[38px] shadow-2xl border-4 sm:border-8 border-slate-800 overflow-hidden flex flex-col relative min-h-[760px] max-h-[90vh]`}>
        {/* Mobile Status Bar Simulation */}
        <div className="bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs select-none shrink-0">
          <span className="font-mono font-semibold">09:41</span>
          <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto"></div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="bg-white px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!isEmbedded && (
              <button
                onClick={() => setCurrentView('welcome')}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Back to Welcome Portal"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                R
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                ResQHome
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSos && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                SOS ACTIVE
              </span>
            )}
            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              Unit {resident.unit}
            </span>
          </div>
        </div>

        {/* Scrollable View Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        </div>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shrink-0 select-none">
          {/* Home */}
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              currentTab === 'home' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">{t.navHome}</span>
          </button>

          {/* SOS Emergency (Prominent Center Button) */}
          <button
            onClick={() => setCurrentTab('emergency')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition relative ${
              currentTab === 'emergency'
                ? 'text-rose-600 font-bold'
                : activeSos
                ? 'text-rose-600 animate-emergency-pulse'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-full ${activeSos ? 'bg-rose-100 text-rose-600 ring-2 ring-rose-400' : ''}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px]">{t.navEmergency}</span>
          </button>

          {/* Evacuation Map */}
          <button
            onClick={() => setCurrentTab('evacuation')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              currentTab === 'evacuation' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px]">{t.navEvacuation}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setCurrentTab('notifications')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition relative ${
              currentTab === 'notifications' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">{t.navNotifications}</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              currentTab === 'profile' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">{t.navProfile}</span>
          </button>

          {/* Settings / PDPA */}
          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
              currentTab === 'settings' ? 'text-teal-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">{t.navSettings}</span>
          </button>
        </div>

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
