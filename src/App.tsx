import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { PublicResultsPage } from './pages/PublicResultsPage';
import { PublicFeesPage } from './pages/PublicFeesPage';
import { PublicNotificationsPage } from './pages/PublicNotificationsPage';
import { SchoolInfoPage } from './pages/SchoolInfoPage';
import { ContactPage } from './pages/ContactPage';
import { StaffPortalRoot } from './pages/staff/StaffPortalRoot';

function AppContent() {
  // Support both pathname detection and internal state
  const getInitialTab = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/staff')) return 'staff-portal';
      if (path.startsWith('/admissions')) return 'admissions';
      if (path.startsWith('/results')) return 'results';
      if (path.startsWith('/fees')) return 'fees';
      if (path.startsWith('/notifications')) return 'notifications';
      if (path.startsWith('/about')) return 'about';
      if (path.startsWith('/contact')) return 'contact';

      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      if (tabParam) return tabParam;
    }
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);

  // Sync browser URL history on navigation
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (tab === 'staff-portal') targetPath = '/staff';
      else if (tab === 'admissions') targetPath = '/admissions';
      else if (tab === 'results') targetPath = '/results';
      else if (tab === 'fees') targetPath = '/fees';
      else if (tab === 'notifications') targetPath = '/notifications';
      else if (tab === 'about') targetPath = '/about';
      else if (tab === 'contact') targetPath = '/contact';

      window.history.pushState({ tab }, '', targetPath);
    }
  };

  // Listen to popstate (back/forward browser buttons) and hidden keyboard shortcut
  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getInitialTab());
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl+Shift+S or Alt+S to toggle staff portal
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') || (e.altKey && e.key.toLowerCase() === 's')) {
        e.preventDefault();
        setCurrentTab((prev) => (prev === 'staff-portal' ? 'home' : 'staff-portal'));
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // If in Staff Portal, render isolated Staff Portal layout
  if (currentTab === 'staff-portal') {
    return <StaffPortalRoot onBackToPublic={() => handleNavigate('home')} />;
  }

  // Otherwise, render Public Student / Parent Portal
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-800">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentTab === 'admissions' && <AdmissionsPage />}
        {currentTab === 'results' && <PublicResultsPage />}
        {currentTab === 'fees' && <PublicFeesPage />}
        {currentTab === 'notifications' && <PublicNotificationsPage />}
        {currentTab === 'about' && <SchoolInfoPage onNavigate={handleNavigate} />}
        {currentTab === 'contact' && <ContactPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
