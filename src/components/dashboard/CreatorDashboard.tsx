import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  Briefcase,
  UserCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  Instagram,
  ArrowRight,
  Zap,
} from 'lucide-react';
import type { CampaignOpportunity, CreatorProfile, User } from '../../types.ts';
import type { DashboardTab } from '../navigation/BottomNav.tsx';
import { OpportunitiesCard } from './OpportunitiesCard.tsx';
import { ProfileCard } from './ProfileCard.tsx';
import type { LegalDocType } from '../legal/LegalModal.tsx';

interface CreatorDashboardProps {
  user: User;
  profile: CreatorProfile;
  opportunities: CampaignOpportunity[];
  onEditProfile: () => void;
  onOpenLegal: (type: LegalDocType) => void;
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  user,
  profile,
  opportunities,
  onEditProfile,
  onOpenLegal,
  activeTab,
  onChangeTab,
}) => {
  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-24 md:pb-8">
      {/* 3.6 Welcome Banner */}
      <div
        id="dashboard-welcome-banner"
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950/40 to-slate-800 border border-slate-700 shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Creator Account Active | Payment: Activation Completed</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
              Welcome, {profile.fullName}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Manage your creator profile and discover available opportunities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
            <button
              id="btn-tab-opportunities"
              onClick={() => onChangeTab('opportunities')}
              className="px-4 py-2.5 min-h-[42px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse {opportunities.length} Briefs</span>
            </button>
            <button
              id="btn-tab-profile"
              onClick={() => onChangeTab('profile')}
              className="px-4 py-2.5 min-h-[42px] rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              <UserCircle className="w-4 h-4" />
              <span>My Profile</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Desktop Tabs Navigation (In addition to mobile BottomNav) */}
      <div className="hidden md:flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          id="desktop-tab-home"
          onClick={() => onChangeTab('home')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'home'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <span>Dashboard Overview</span>
        </button>
        <button
          id="desktop-tab-opportunities"
          onClick={() => onChangeTab('opportunities')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'opportunities'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <span>Brand Opportunities</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300">
            {opportunities.length}
          </span>
        </button>
        <button
          id="desktop-tab-profile"
          onClick={() => onChangeTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <span>Creator Profile</span>
        </button>
        <button
          id="desktop-tab-help"
          onClick={() => onChangeTab('help')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'help'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <span>Help & Guidelines</span>
        </button>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700/80">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Audience Reach
              </span>
              <p className="text-xl font-bold text-slate-100 mt-1">
                {profile.followerCount.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Verified Follower Base</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700/80">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Niche Focus
              </span>
              <p className="text-xl font-bold text-slate-100 mt-1">{profile.category}</p>
              <p className="text-[10px] text-indigo-400 mt-0.5">Target Content Vertical</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700/80">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Active Briefs
              </span>
              <p className="text-xl font-bold text-slate-100 mt-1">{opportunities.length}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Open For Submissions</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700/80">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Platform Badge
              </span>
              <p className="text-xl font-bold text-emerald-400 mt-1">Verified</p>
              <p className="text-[10px] text-slate-400 mt-0.5">One-time ₹49 Active</p>
            </div>
          </div>

          {/* Featured Brand Opportunities */}
          <OpportunitiesCard
            opportunities={opportunities}
            creatorCategory={profile.category}
          />
        </div>
      )}

      {activeTab === 'opportunities' && (
        <OpportunitiesCard
          opportunities={opportunities}
          creatorCategory={profile.category}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileCard
          user={user}
          profile={profile}
          onEditProfile={onEditProfile}
        />
      )}

      {activeTab === 'help' && (
        <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-100">Creator Resources & FAQ</h2>
            <p className="text-xs text-slate-400">
              Best practices for pitching and managing brand collaborations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/70 space-y-2">
              <p className="font-semibold text-slate-200">How do brands contact me?</p>
              <p className="text-slate-400 leading-relaxed">
                When you submit a pitch on any open brief, brand campaign managers receive your verified profile metrics, portfolio link, and pitch notes directly. They contact you via your registered email or official handle.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/70 space-y-2">
              <p className="font-semibold text-slate-200">Payment & Invoicing for Deals</p>
              <p className="text-slate-400 leading-relaxed">
                Campaign deals and sponsorship compensation are settled directly between you and the hiring brand according to the agreed brief deliverables and milestones.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/70 space-y-2">
              <p className="font-semibold text-slate-200">Anti-Guarantee Policy Clarification</p>
              <p className="text-slate-400 leading-relaxed">
                Creator Bridge provides creator verification and a curated portal of genuine briefs. We never promise guaranteed deals or financial earnings; selection is solely determined by brand partners.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/70 space-y-2">
              <p className="font-semibold text-slate-200">Need Assistance?</p>
              <p className="text-slate-400 leading-relaxed">
                Our support desk is always ready to assist creators. Reach out to{' '}
                <span className="text-indigo-400 font-medium">support@creatorbridge.in</span> for any help with brief applications or profile updates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onOpenLegal('terms')}
              className="text-xs text-indigo-400 hover:underline"
            >
              View Terms & Conditions
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="text-xs text-indigo-400 hover:underline"
            >
              View Privacy Policy
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => onOpenLegal('contact')}
              className="text-xs text-indigo-400 hover:underline"
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
