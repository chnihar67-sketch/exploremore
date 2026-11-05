import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Compass, User as UserIcon, Sparkles, MapPin, Menu, X, ChevronDown, Check } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenAIAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenAuth,
  onOpenAIAssistant,
}) => {
  const { user, role, switchUserRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'marketplace', label: 'Local Marketplace' },
    { id: 'hiddengems', label: 'Beyond The Map' },
    { id: 'map', label: 'Interactive Map' },
    { id: 'itinerary', label: 'AI Itinerary' },
  ];

  const handleRoleSelect = (targetRole: UserRole) => {
    switchUserRole(targetRole);
    setRoleDropdownOpen(false);
  };

  const getDashboardLabel = () => {
    if (role === 'admin') return 'Admin Portal';
    if (role === 'business_owner') return 'Host Dashboard';
    return 'My Trips';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf7f2]/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2d5a43] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-[#1b4332] whitespace-nowrap">
                LOCALORA
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider uppercase text-stone-500 font-medium">
                Karnataka Local Tourism Portal
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`whitespace-nowrap transition-colors hover:text-[#1b4332] py-1 relative ${
                  currentTab === link.id
                    ? 'text-[#1b4332] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2d5a43]'
                    : 'text-stone-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions & Role Management */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Trip Concierge Trigger */}
            <button
              onClick={onOpenAIAssistant}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#1b4332] bg-[#e7efe9] hover:bg-[#d8e5dc] rounded-lg transition-colors border border-[#2d5a43]/20 shadow-xs"
              title="Open Trip Concierge"
            >
              <Compass className="w-4 h-4 text-[#2d5a43]" />
              <span className="whitespace-nowrap">Trip Concierge</span>
            </button>

            {/* Role Switcher Popover for Tester Convenience */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:border-stone-400 transition-colors shadow-xs"
                title="Switch active user role"
              >
                <span className="text-[11px] text-stone-400 font-normal">Role:</span>
                <span className="capitalize font-semibold text-[#2d5a43]">
                  {role === 'business_owner' ? 'Business Owner' : role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-100">
                    Switch Test Account
                  </div>
                  <button
                    onClick={() => handleRoleSelect('tourist')}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-stone-800">Tourist (Aditi Rao)</div>
                      <div className="text-[11px] text-stone-500">Book stays, guides & plan trips</div>
                    </div>
                    {role === 'tourist' && <Check className="w-4 h-4 text-[#2d5a43]" />}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('business_owner')}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-stone-800">Business Owner (Shridhar Bhat)</div>
                      <div className="text-[11px] text-stone-500">Manage bookings & listings</div>
                    </div>
                    {role === 'business_owner' && <Check className="w-4 h-4 text-[#2d5a43]" />}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-stone-800">Admin (Rajeshwar Hegde)</div>
                      <div className="text-[11px] text-stone-500">Verify listings & analytics</div>
                    </div>
                    {role === 'admin' && <Check className="w-4 h-4 text-[#2d5a43]" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard button */}
            {user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs ${
                  currentTab === 'dashboard'
                    ? 'bg-[#1b4332] text-white'
                    : 'bg-[#2d5a43] text-white hover:bg-[#234835]'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{getDashboardLabel()}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2d5a43] hover:bg-[#1b4332] rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#faf7f2] border-b border-stone-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? 'bg-[#e7efe9] text-[#1b4332] font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenAIAssistant();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium text-[#1b4332] bg-[#e7efe9]"
          >
            <Compass className="w-4 h-4 text-[#2d5a43]" />
            <span>Trip Concierge</span>
          </button>
        </div>
      )}
    </header>
  );
};
