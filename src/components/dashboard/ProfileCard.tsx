import React from 'react';
import {
  Instagram,
  Users,
  ShieldCheck,
  Edit3,
  ExternalLink,
  Receipt,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import type { CreatorProfile, User } from '../../types.ts';

interface ProfileCardProps {
  user: User;
  profile: CreatorProfile;
  onEditProfile: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  profile,
  onEditProfile,
}) => {
  return (
    <div id="profile-card-section" className="space-y-6">
      {/* Profile Header & Edit CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={profile.fullName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-800 flex items-center justify-center text-white text-[10px]">
              ✓
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">{profile.fullName}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                VERIFIED CREATOR
              </span>
            </div>
            <a
              href={profile.instagramProfileLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-0.5"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@{profile.instagramUsername}</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        <button
          id="btn-profile-edit"
          onClick={onEditProfile}
          className="w-full sm:w-auto px-4 py-2.5 min-h-[42px] rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile Details</span>
        </button>
      </div>

      {/* Profile Details Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Creator Portfolio Overview */}
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700/80 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Portfolio & Audience Metrics
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Content Category</span>
              <span className="font-semibold text-slate-200">{profile.category}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Audience / Followers</span>
              <span className="font-semibold text-slate-200">
                {profile.followerCount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Instagram Handle</span>
              <span className="font-semibold text-slate-200">@{profile.instagramUsername}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Google Auth Account</span>
              <span className="font-semibold text-slate-200 truncate max-w-[180px]">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Activation & Payment Receipt */}
        <div className="p-5 rounded-xl bg-slate-800 border border-slate-700/80 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            Verification & Platform Fee Receipt
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Activation Status</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active & Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Platform Fee</span>
              <span className="font-semibold text-slate-200">₹49.00 (One-Time Paid)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Payment Reference</span>
              <span className="font-mono text-slate-300 text-[11px] truncate max-w-[160px]">
                {profile.paymentId || 'pay_rzp_CBVerified'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
              <span className="text-slate-400">Activation Date</span>
              <span className="text-slate-300">
                {profile.paidAt
                  ? new Date(profile.paidAt).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Zero Password Security Confirmation */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-slate-300">Security & Privacy Standard</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            Creator Bridge maintains zero credential access. Your Instagram account is linked strictly via public handle matching and manual admin portfolio audits. No passwords or private tokens are stored.
          </p>
        </div>
      </div>
    </div>
  );
};
