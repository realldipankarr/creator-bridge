import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Instagram,
  Sparkles,
  Edit3,
} from 'lucide-react';
import type { CreatorProfile } from '../../types.ts';

interface ApplicationStatusViewProps {
  profile: CreatorProfile;
  onInitiatePayment: () => void;
  onRefreshStatus: () => void;
  onEditProfile: () => void;
  onOpenAdminPortal?: () => void;
}

export const ApplicationStatusView: React.FC<ApplicationStatusViewProps> = ({
  profile,
  onInitiatePayment,
  onRefreshStatus,
  onEditProfile,
  onOpenAdminPortal,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-poll status periodically so if webhook activates or admin approves, UI updates immediately
  useEffect(() => {
    if (profile.isActivated) return;
    const interval = setInterval(() => {
      onRefreshStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [profile.isActivated, onRefreshStatus]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const status = profile.applicationStatus;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Status Header Badge & Icon */}
        <div className="text-center space-y-3">
          {status === 'Pending' && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
          )}
          {status === 'Approved' && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          )}
          {status === 'Rejected' && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-2">
              <XCircle className="w-8 h-8" />
            </div>
          )}

          {/* Exact PRD Status Titles */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            {status === 'Pending' && 'Application Under Review'}
            {status === 'Approved' && 'Application Approved'}
            {status === 'Rejected' && 'Application Not Approved'}
          </h1>

          {/* Exact PRD Supporting Texts */}
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {status === 'Pending' &&
              'Your submitted information will be manually reviewed by the admin.'}
            {status === 'Approved' &&
              'Your creator application has been verified and approved. Complete the one-time ₹49 platform activation fee to unlock your Creator Dashboard and brand opportunities.'}
            {status === 'Rejected' &&
              'Your application was not approved at this time.'}
          </p>

          {/* Admin feedback note if provided */}
          {profile.adminFeedback && (
            <div className="inline-block mt-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-300">
              <span className="text-slate-400 font-medium">Review Note:</span> {profile.adminFeedback}
            </div>
          )}
        </div>

        {/* Submitted Application Snapshot Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Submitted Profile Overview
            </span>
            <button
              onClick={onEditProfile}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <p className="text-slate-500">Creator</p>
              <p className="text-slate-200 font-medium truncate">{profile.fullName}</p>
            </div>
            <div>
              <p className="text-slate-500">Instagram</p>
              <a
                href={profile.instagramProfileLink}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline flex items-center gap-1 font-medium truncate"
              >
                @{profile.instagramUsername}
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
            <div>
              <p className="text-slate-500">Followers</p>
              <p className="text-slate-200 font-medium">
                {profile.followerCount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Category</p>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                {profile.category}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Action Section based on Pipeline State */}
        {status === 'Approved' && (
          /* Step 5: Approved Application & Activation */
          <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-800 to-indigo-950/30 border border-indigo-500/40 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
                  <Sparkles className="w-3 h-3" />
                  Activation Unlocked
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  Activate Creator Account
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  One-time platform verification fee. Direct brand campaign discovery access.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl sm:text-3xl font-black text-slate-100">₹49</span>
                <span className="block text-[10px] text-slate-400">One-time fee</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="btn-pay-49-activation"
                onClick={onInitiatePayment}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30 active:scale-[0.99]"
              >
                <span>Pay ₹49 & Activate Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Secure Razorpay Checkout
              </span>
              <span>•</span>
              <span>UPI / Card / NetBanking</span>
            </div>
          </div>
        )}

        {status === 'Pending' && (
          /* Step 3: Application Under Review - Hard Constraint: Payment LOCKED */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-200">
                  ₹49 Activation Payment Locked
                </p>
                <p className="text-slate-400 leading-relaxed">
                  In compliance with platform integrity rules, payment is strictly locked and cannot be accessed until our admin team completes verification and changes your status to Approved.
                </p>
              </div>
            </div>

            {/* Test Helper / Fast track for reviewers */}
            {onOpenAdminPortal && (
              <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-300 text-center sm:text-left">
                  Testing Creator Bridge? Switch to the Admin Portal to review and approve this profile.
                </span>
                <button
                  id="btn-status-open-admin"
                  onClick={onOpenAdminPortal}
                  className="w-full sm:w-auto px-4 py-2 min-h-[40px] rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shrink-0 transition flex items-center justify-center"
                >
                  Go to Admin Review
                </button>
              </div>
            )}
          </div>
        )}

        {status === 'Rejected' && (
          /* Step 7: Rejected State - Payment strictly blocked */
          <div className="space-y-4">
            {/* Rejection Reason clean callout */}
            {profile.rejectionReason && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-red-500/40 text-xs space-y-1.5 shadow-inner">
                <div className="flex items-center gap-1.5 text-red-400 font-semibold text-[11px] uppercase tracking-wide">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Reason for Rejection</span>
                </div>
                <p className="text-slate-200 text-sm font-medium leading-relaxed pl-5">
                  "{profile.rejectionReason}"
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-xs text-red-300">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Payment Access Prohibited</p>
                <p className="text-red-300/80 mt-0.5 leading-relaxed">
                  As your application was not approved, payment gateways are disabled at both the interface and server API levels. You may update your public profile details and re-apply.
                </p>
              </div>
            </div>

            <button
              id="btn-reapply-profile"
              onClick={onEditProfile}
              className="w-full py-3 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium text-sm transition flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Profile & Re-Submit</span>
            </button>
          </div>
        )}

        {/* Footer controls: Refresh status button */}
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Server API Verified
          </span>

          <button
            id="btn-refresh-status"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition py-1 px-2 rounded"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Check Latest Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};
