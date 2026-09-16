import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, ShieldCheck, LogIn } from 'lucide-react';
import type { User } from '../../types.ts';

interface UnauthorizedAdminAccessProps {
  currentUser: User | null;
  onReturnToHome: () => void;
  onSignInAsAdmin: () => void;
}

export const UnauthorizedAdminAccess: React.FC<UnauthorizedAdminAccessProps> = ({
  currentUser,
  onReturnToHome,
  onSignInAsAdmin,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div
        id="admin-unauthorized-guard"
        className="max-w-md w-full bg-slate-800/95 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center"
      >
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-red-500/20 text-red-300 border border-red-500/30">
            403 • Restricted Access
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Admin Access Denied
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The verification review console and admin endpoints are protected by Role-Based Access Control (RBAC). Only authenticated administrators may access this portal.
          </p>
        </div>

        {/* User Context Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/80 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span>Current Status:</span>
            <span className="font-semibold text-slate-200">
              {currentUser ? 'Authenticated' : 'Unauthenticated (Guest)'}
            </span>
          </div>
          {currentUser && (
            <>
              <div className="flex items-center justify-between text-slate-400">
                <span>Account:</span>
                <span className="font-medium text-slate-200 truncate max-w-[200px]">
                  {currentUser.email}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Assigned Role:</span>
                <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase text-[10px]">
                  {currentUser.role}
                </span>
              </div>
            </>
          )}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-red-400/90 flex items-start gap-1.5">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Missing required clearance: role='admin'</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          <button
            id="btn-return-home"
            onClick={onReturnToHome}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public / Creator Portal</span>
          </button>

          <button
            id="btn-switch-to-admin"
            onClick={onSignInAsAdmin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-xs transition border border-slate-600 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Sign in as Admin (admin@creatorbridge.in)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
