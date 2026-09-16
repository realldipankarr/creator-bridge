import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  User as UserIcon,
  LogOut,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  Layers,
} from 'lucide-react';
import type { CreatorProfile, User } from '../../types.ts';

interface NavbarProps {
  currentUser: User | null;
  currentProfile: CreatorProfile | null;
  activeRole: 'creator' | 'admin';
  onSwitchRole: (role: 'creator' | 'admin') => void;
  onSignOut: () => void;
  onResetDemo: () => void;
  onSelectQuickAccount?: (type: 'approved' | 'pending' | 'rejected' | 'activated' | 'new' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentProfile,
  activeRole,
  onSwitchRole,
  onSignOut,
  onResetDemo,
  onSelectQuickAccount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-indigo-500/20">
            CB
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-slate-100 text-base sm:text-lg tracking-tight whitespace-nowrap">
                Creator Bridge
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                GATED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Verified Creator Brand Opportunities</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* RBAC: Hide top Admin Portal button unless currentUser?.role === 'admin' */}
          {currentUser?.role === 'admin' && (
            <div className="flex items-center bg-slate-800/90 border border-slate-700 p-0.5 sm:p-1 rounded-lg">
              <button
                id="nav-role-creator"
                onClick={() => onSwitchRole('creator')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 min-h-[36px] sm:min-h-0 ${
                  activeRole === 'creator'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator</span>
              </button>
              <button
                id="nav-role-admin"
                onClick={() => onSwitchRole('admin')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 min-h-[36px] sm:min-h-0 ${
                  activeRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin<span className="hidden sm:inline">&nbsp;Portal</span></span>
              </button>
            </div>
          )}

          {/* Quick Demo State Switcher */}
          {onSelectQuickAccount && (
            <div className="relative">
              <button
                id="btn-quick-states"
                onClick={() => setSwitchAccountOpen(!switchAccountOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition min-h-[36px] sm:min-h-0"
                title="Switch test persona to preview any pipeline stage"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">States</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {switchAccountOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50 text-xs"
                  onClick={() => setSwitchAccountOpen(false)}
                >
                  <p className="px-2 py-1 font-semibold text-slate-400 uppercase text-[10px]">
                    Instant Persona Switcher
                  </p>
                  <button
                    onClick={() => onSelectQuickAccount('approved')}
                    className="w-full text-left px-2.5 py-2.5 rounded-lg hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-medium">Rohan (Approved)</p>
                      <p className="text-[11px] text-slate-400">Ready for ₹49 Payment Test</p>
                    </div>
                  </button>
                  <button
                    onClick={() => onSelectQuickAccount('pending')}
                    className="w-full text-left px-2.5 py-2.5 rounded-lg hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-medium">Priya (Under Review)</p>
                      <p className="text-[11px] text-slate-400">Payment strictly locked</p>
                    </div>
                  </button>
                  <button
                    onClick={() => onSelectQuickAccount('rejected')}
                    className="w-full text-left px-2.5 py-2.5 rounded-lg hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <p className="font-medium">Vikram (Not Approved)</p>
                      <p className="text-[11px] text-slate-400">Payment strictly blocked</p>
                    </div>
                  </button>
                  <button
                    onClick={() => onSelectQuickAccount('activated')}
                    className="w-full text-left px-2.5 py-2.5 rounded-lg hover:bg-slate-700 text-slate-200 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <p className="font-medium">Ananya (Activated)</p>
                      <p className="text-[11px] text-slate-400">Full opportunities unlocked</p>
                    </div>
                  </button>
                  <div className="border-t border-slate-700 my-1"></div>
                  <button
                    onClick={() => onSelectQuickAccount('admin')}
                    className="w-full text-left px-2.5 py-2.5 rounded-lg hover:bg-slate-700 text-amber-300 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-medium">Admin Team (admin@creatorbridge.in)</p>
                      <p className="text-[11px] text-slate-400">RBAC Administrator Role</p>
                    </div>
                  </button>
                  <button
                    onClick={() => onSelectQuickAccount('new')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-700 text-indigo-300 font-medium"
                  >
                    + New Google Sign-In / Blank
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Account / Profile Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition min-h-[36px] sm:min-h-0"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-600 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-24px)] rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-2 z-50 text-xs"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-700">
                    <p className="font-medium text-slate-100 truncate">{currentUser.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                    {currentProfile && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            currentProfile.isActivated
                              ? 'bg-emerald-400'
                              : currentProfile.applicationStatus === 'Approved'
                              ? 'bg-indigo-400'
                              : currentProfile.applicationStatus === 'Pending'
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                          }`}
                        />
                        <span className="text-[11px] text-slate-300">
                          {currentProfile.isActivated
                            ? 'Account Active'
                            : `Status: ${currentProfile.applicationStatus}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    id="btn-reset-demo-action"
                    onClick={onResetDemo}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-700 text-slate-300 flex items-center gap-2 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Demo Data</span>
                  </button>

                  <button
                    id="btn-signout-action"
                    onClick={onSignOut}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="nav-btn-join-creator"
              onClick={() => onSwitchRole('creator')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm whitespace-nowrap min-h-[36px] flex items-center"
            >
              Join as Creator
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
