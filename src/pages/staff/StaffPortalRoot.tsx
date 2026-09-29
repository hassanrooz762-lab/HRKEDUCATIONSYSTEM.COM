import React, { useEffect, useState } from 'react';
import { Crest } from '../../components/Crest';
import { StaffUser } from '../../types';
import { StaffLoginPage } from './StaffLoginPage';
import { StaffDashboard } from './StaffDashboard';
import { StaffStudentsPage } from './StaffStudentsPage';
import { StaffResultsPage } from './StaffResultsPage';
import { StaffFeesPage } from './StaffFeesPage';
import { StaffNotificationsPage } from './StaffNotificationsPage';
import { StaffAdmissionsPage } from './StaffAdmissionsPage';
import { StaffSettingsPage } from './StaffSettingsPage';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Globe,
  Menu,
  X,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';

interface StaffPortalRootProps {
  onBackToPublic: () => void;
}

export const StaffPortalRoot: React.FC<StaffPortalRootProps> = ({ onBackToPublic }) => {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'admissions' | 'students' | 'results' | 'fees' | 'notifications' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkCurrentAuth();
  }, []);

  const checkCurrentAuth = async () => {
    setCheckingAuth(true);
    try {
      const token = localStorage.getItem('hrk_staff_token');
      const res = await fetch('/api/staff/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success && json.user) {
        setCurrentUser(json.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (user: StaffUser, token: string) => {
    localStorage.setItem('hrk_staff_token', token);
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('hrk_staff_token');
      await fetch('/api/staff/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('hrk_staff_token');
      setCurrentUser(null);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-stone-600 text-sm font-semibold">Verifying staff credentials...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> Show Login Page
  if (!currentUser) {
    return (
      <StaffLoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToPublic={onBackToPublic}
      />
    );
  }

  const staffNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admissions', label: 'Admissions', icon: UserPlus },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'results', label: 'Results & Marks', icon: FileText },
    { id: 'fees', label: 'Monthly Fees', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Audit & Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Staff Navigation Header */}
      <header className="bg-stone-900 text-white sticky top-0 z-40 shadow-md border-b-2 border-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
              <Crest size="sm" variant="dark" />
              <div className="hidden sm:block">
                <span className="text-xs uppercase font-bold tracking-wider text-yellow-400 block">
                  Staff Control Center
                </span>
                <span className="text-xs text-stone-400">
                  HRK Education System • Peshawar Cantt
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {staffNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-red-700 text-white shadow-sm'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: User Badge & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 text-xs">
                <User className="w-3.5 h-3.5 text-yellow-400" />
                <span className="font-semibold text-white">{currentUser.displayName || currentUser.username}</span>
                <span className="text-[10px] text-red-400 font-mono uppercase bg-red-950/80 px-1.5 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>

              {/* Public Portal Switcher */}
              <button
                onClick={onBackToPublic}
                title="View Public School Website"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Public Portal</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                title="Sign Out of Staff Portal"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-800/80 hover:bg-red-800 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-yellow-300" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900 border-t border-stone-800 px-4 py-3 space-y-1">
            <div className="p-2 mb-2 bg-stone-800 rounded-lg text-xs text-stone-300 flex items-center justify-between">
              <span>Logged in as: <strong className="text-white">{currentUser.displayName}</strong></span>
              <span className="text-[10px] uppercase font-mono bg-red-900 text-yellow-300 px-1.5 py-0.5 rounded">{currentUser.role}</span>
            </div>
            {staffNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left ${
                    isActive ? 'bg-red-700 text-white' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-stone-800">
              <button
                onClick={onBackToPublic}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-blue-400 hover:bg-stone-800 text-left"
              >
                <Globe className="w-4 h-4" />
                <span>Return to Public School Website</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <StaffDashboard
            currentUser={currentUser}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}
        {activeTab === 'admissions' && <StaffAdmissionsPage />}
        {activeTab === 'students' && <StaffStudentsPage />}
        {activeTab === 'results' && <StaffResultsPage />}
        {activeTab === 'fees' && <StaffFeesPage />}
        {activeTab === 'notifications' && <StaffNotificationsPage />}
        {activeTab === 'settings' && <StaffSettingsPage currentUser={currentUser} />}
      </main>

      {/* Staff Portal Footer */}
      <footer className="bg-stone-900 text-stone-500 text-xs py-4 border-t border-stone-800 text-center">
        <p>HRK Education System • Staff Management Portal • Session 2025–2026 • Principal Hassan Rooz</p>
      </footer>
    </div>
  );
};
