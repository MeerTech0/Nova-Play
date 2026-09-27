import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/common/ScrollToTop';
import { NovaIntro } from '../components/ui/NovaIntro';
import { NovaCursor } from '../components/ui/NovaCursor';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--nova-bg)] text-[#F8FAFC]">
      {/* Cinematic Startup Experience (Session-based, first open only) */}
      <NovaIntro />

      {/* Hardware-accelerated Desktop Custom Cursor */}
      <NovaCursor />

      {/* Real-time Settings Panel Drawer / Mobile Sheet */}
      <SettingsPanel />

      {/* Route change scroll reset */}
      <ScrollToTop />

      {/* Fixed responsive navigation */}
      <Navbar />

      {/* Main content body */}
      <main className="flex-1 w-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Premium dark footer */}
      <Footer />
    </div>
  );
};
