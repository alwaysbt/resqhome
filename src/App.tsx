import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { WelcomePage } from './components/welcome/WelcomePage';
import { ResidentApp } from './components/resident/ResidentApp';
import { ManagementDashboard } from './components/management/ManagementDashboard';
import { SplitView } from './components/split/SplitView';
import { DemoControlPanelModal } from './components/common/DemoControlPanelModal';
import { OnboardingModal } from './components/resident/OnboardingModal';

const AppContent: React.FC = () => {
  const { currentView, activeScenario } = useApp();
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all duration-300 ${
        activeScenario === 'earthquake' ? 'animate-earthquake' : ''
      }`}
    >
      {/* Top Main Navigation Header */}
      <Header onOpenDemoPanel={() => setIsDemoPanelOpen(true)} />

      {/* Main View Portals */}
      <main className="flex-1 flex flex-col">
        {currentView === 'welcome' && (
          <WelcomePage
            onOpenDemoPanel={() => setIsDemoPanelOpen(true)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}
        {currentView === 'resident' && <ResidentApp />}
        {currentView === 'management' && (
          <ManagementDashboard onOpenDemoPanel={() => setIsDemoPanelOpen(true)} />
        )}
        {currentView === 'split' && (
          <SplitView onOpenDemoPanel={() => setIsDemoPanelOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>ResQHome © 2026 — Smart Residential Emergency Assistance System</span>
          <span className="font-mono text-[11px] text-teal-700 font-semibold">
            Bilingual TH / EN • PDPA Ready Prototype • High-Rise Life-Safety
          </span>
        </div>
      </footer>

      {/* Global Interactive Simulation Modals */}
      <DemoControlPanelModal
        isOpen={isDemoPanelOpen}
        onClose={() => setIsDemoPanelOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
