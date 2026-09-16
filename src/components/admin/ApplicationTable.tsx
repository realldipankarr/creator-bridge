import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Instagram,
  Users,
  Zap,
  Sparkles,
} from 'lucide-react';
import type { ApplicationStatus, CreatorProfile } from '../../types.ts';
import { simulateRazorpayWebhook } from '../../lib/api.ts';

const CATEGORIES = [
  'All',
  'Gaming',
  'Technology',
  'Music',
  'Dance',
  'Education',
  'Entertainment',
  'Others',
];

const REJECTION_PRESETS = [
  'Engagement rate below minimum verification threshold',
  'Account contents do not meet creator platform guidelines',
  'Private or unverified Instagram profile handle',
  'Inconsistent niche or audience mismatch',
  'Duplicate creator application or suspect follower velocity',
];

interface ApplicationTableProps {
  applications: CreatorProfile[];
  onReview: (
    profileId: string,
    status: ApplicationStatus,
    feedback?: string,
    rejectionReason?: string
  ) => Promise<void>;
  isLoading: boolean;
  onRefresh?: () => Promise<void>;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onReview,
  isLoading,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Active'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Review modal state
  const [activeReviewModal, setActiveReviewModal] = useState<{
    profile: CreatorProfile;
    targetStatus: ApplicationStatus;
  } | null>(null);
  const [adminFeedback, setAdminFeedback] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.instagramUsername.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === 'All' || app.category.toLowerCase() === selectedCategory.toLowerCase();

    let matchesStatus = true;
    if (selectedStatus === 'Active') {
      matchesStatus = !!app.isActivated;
    } else if (selectedStatus === 'Approved') {
      matchesStatus = app.applicationStatus === 'Approved' && !app.isActivated;
    } else if (selectedStatus === 'Pending') {
      matchesStatus = app.applicationStatus === 'Pending';
    } else if (selectedStatus === 'Rejected') {
      matchesStatus = app.applicationStatus === 'Rejected';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenReview = (profile: CreatorProfile, targetStatus: ApplicationStatus) => {
    setActiveReviewModal({ profile, targetStatus });
    if (targetStatus === 'Approved') {
      setAdminFeedback('Profile and audience engagement verified. Approved for creator activation.');
      setRejectionReason('');
    } else {
      setAdminFeedback('Application could not be approved due to platform eligibility criteria.');
      setRejectionReason(profile.rejectionReason || 'Engagement rate below minimum verification threshold');
    }
  };

  const handleConfirmReview = async () => {
    if (!activeReviewModal) return;
    setReviewingId(activeReviewModal.profile.id);
    try {
      await onReview(
        activeReviewModal.profile.id,
        activeReviewModal.targetStatus,
        adminFeedback.trim() || undefined,
        activeReviewModal.targetStatus === 'Rejected' ? rejectionReason.trim() || undefined : undefined
      );
      setActiveReviewModal(null);
      setAdminFeedback('');
      setRejectionReason('');
      setNotification({
        message: `Successfully updated ${activeReviewModal.profile.fullName}'s status to ${activeReviewModal.targetStatus}.`,
        type: 'success',
      });
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to update review status',
        type: 'error',
      });
    } finally {
      setReviewingId(null);
    }
  };

  const handleSimulateWebhook = async (profile: CreatorProfile) => {
    setIsSimulatingWebhook(profile.id);
    try {
      const res = await simulateRazorpayWebhook(profile.id, 'payment.captured');
      setNotification({
        message: `Webhook received: ${profile.fullName} automatically activated to Active Creator!`,
        type: 'success',
      });
      setTimeout(() => setNotification(null), 5000);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err: any) {
      setNotification({
        message: err.message || 'Failed to simulate Razorpay webhook',
        type: 'error',
      });
    } finally {
      setIsSimulatingWebhook(null);
    }
  };

  const pendingCount = applications.filter((a) => a.applicationStatus === 'Pending').length;
  const approvedCount = applications.filter((a) => a.applicationStatus === 'Approved' && !a.isActivated).length;
  const activeCount = applications.filter((a) => a.isActivated).length;
  const rejectedCount = applications.filter((a) => a.applicationStatus === 'Rejected').length;

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/40 border-red-500/50 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-200 text-xs px-1 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Filter and Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {/* Total */}
        <button
          id="filter-status-all"
          onClick={() => setSelectedStatus('All')}
          className={`p-2.5 sm:p-3 rounded-xl border text-left transition ${
            selectedStatus === 'All'
              ? 'bg-indigo-950/40 border-indigo-500 text-slate-100 ring-1 ring-indigo-500'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-medium uppercase">All ({applications.length})</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-100">{applications.length}</p>
        </button>

        {/* Pending */}
        <button
          id="filter-status-pending"
          onClick={() => setSelectedStatus('Pending')}
          className={`p-2.5 sm:p-3 rounded-xl border text-left transition ${
            selectedStatus === 'Pending'
              ? 'bg-amber-950/30 border-amber-500 text-amber-200 ring-1 ring-amber-500'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-amber-400 font-medium uppercase">Pending ({pendingCount})</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-amber-400">{pendingCount}</p>
        </button>

        {/* Approved (Awaiting Payment) */}
        <button
          id="filter-status-approved"
          onClick={() => setSelectedStatus('Approved')}
          className={`p-2.5 sm:p-3 rounded-xl border text-left transition ${
            selectedStatus === 'Approved'
              ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium uppercase">Approved ({approvedCount})</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-emerald-400">{approvedCount}</p>
        </button>

        {/* Active (Paid & Activated) */}
        <button
          id="filter-status-active"
          onClick={() => setSelectedStatus('Active')}
          className={`p-2.5 sm:p-3 rounded-xl border text-left transition ${
            selectedStatus === 'Active'
              ? 'bg-indigo-950/40 border-indigo-400 text-indigo-200 ring-1 ring-indigo-400'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-indigo-300 font-medium uppercase">Active ({activeCount})</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-indigo-400">{activeCount}</p>
        </button>

        {/* Rejected */}
        <button
          id="filter-status-rejected"
          onClick={() => setSelectedStatus('Rejected')}
          className={`p-2.5 sm:p-3 rounded-xl border text-left transition ${
            selectedStatus === 'Rejected'
              ? 'bg-red-950/30 border-red-500 text-red-200 ring-1 ring-red-500'
              : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] text-red-400 font-medium uppercase">Rejected ({rejectedCount})</span>
            <XCircle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-red-400">{rejectedCount}</p>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="input-admin-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Instagram username, creator name, or niche..."
            className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-lg bg-slate-900/60 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="relative sm:w-56 shrink-0">
          <select
            id="select-admin-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg bg-slate-900/60 border border-slate-700 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800 text-slate-100">
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MOBILE CARD VIEW (Visible on mobile screens < md) */}
      <div className="block md:hidden space-y-3">
        {filteredApplications.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-800 border border-slate-700 text-center text-slate-400 text-xs">
            No creator applications found matching your filter criteria.
          </div>
        ) : (
          filteredApplications.map((app) => {
            const isPending = app.applicationStatus === 'Pending';
            const isApproved = app.applicationStatus === 'Approved' && !app.isActivated;
            const isActive = !!app.isActivated;
            const isRejected = app.applicationStatus === 'Rejected';

            return (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-slate-800 border border-slate-700 shadow-md space-y-3"
              >
                {/* Header: Name + Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm">{app.fullName}</h3>
                    <p className="text-[10px] text-slate-400">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        <Sparkles className="w-3 h-3" />
                        Active (Paid)
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                        <XCircle className="w-3 h-3" />
                        Not Approved
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Instagram</span>
                    <a
                      href={app.instagramProfileLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium truncate max-w-[140px]"
                    >
                      @{app.instagramUsername}
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Followers</span>
                    <span className="font-mono text-slate-200 font-semibold">
                      {app.followerCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400">Category</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                      {app.category}
                    </span>
                  </div>
                  {app.rejectionReason && (
                    <div className="col-span-2 pt-1 border-t border-slate-800 text-[11px] text-red-400">
                      <strong>Rejection Reason:</strong> {app.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Mobile Action Buttons */}
                <div className="pt-1">
                  {isPending && (
                    <div className="flex gap-2">
                      <button
                        id={`btn-mobile-approve-${app.id}`}
                        onClick={() => handleOpenReview(app, 'Approved')}
                        disabled={reviewingId === app.id}
                        className="flex-1 min-h-[44px] py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        id={`btn-mobile-reject-${app.id}`}
                        onClick={() => handleOpenReview(app, 'Rejected')}
                        disabled={reviewingId === app.id}
                        className="flex-1 min-h-[44px] py-2.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 active:scale-[0.99] text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {isApproved && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-emerald-400 font-medium">
                          ✓ Payment Gateway Unlocked
                        </span>
                        <button
                          onClick={() => handleOpenReview(app, 'Rejected')}
                          disabled={reviewingId === app.id}
                          className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-red-900/30 text-slate-300 hover:text-red-300 text-xs transition"
                        >
                          Revoke to Reject
                        </button>
                      </div>
                      {/* Webhook Simulator Button */}
                      <button
                        id={`btn-mobile-webhook-${app.id}`}
                        onClick={() => handleSimulateWebhook(app)}
                        disabled={isSimulatingWebhook === app.id}
                        className="w-full min-h-[40px] py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{isSimulatingWebhook === app.id ? 'Simulating Webhook...' : 'Simulate Razorpay Webhook'}</span>
                      </button>
                    </div>
                  )}

                  {isActive && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded bg-indigo-950/20 border border-indigo-500/20">
                      <span className="text-[11px] text-indigo-300 font-medium flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Active & Verified
                      </span>
                      <button
                        onClick={() => handleOpenReview(app, 'Rejected')}
                        disabled={reviewingId === app.id}
                        className="min-h-[36px] px-2.5 py-1 rounded bg-slate-700 hover:bg-red-900/30 text-slate-300 hover:text-red-300 text-xs transition"
                      >
                        Suspend / Reject
                      </button>
                    </div>
                  )}

                  {isRejected && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-red-400 font-medium">
                        ✗ Payment Access Blocked
                      </span>
                      <button
                        onClick={() => handleOpenReview(app, 'Approved')}
                        disabled={reviewingId === app.id}
                        className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-emerald-900/30 text-slate-300 hover:text-emerald-300 text-xs transition"
                      >
                        Re-Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible on md and larger) */}
      <div className="hidden md:block rounded-xl border border-slate-700 bg-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Instagram Username</th>
                <th className="py-3 px-4">Instagram Profile Link</th>
                <th className="py-3 px-4">Follower Count</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Application Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No creator applications found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const isPending = app.applicationStatus === 'Pending';
                  const isApproved = app.applicationStatus === 'Approved' && !app.isActivated;
                  const isActive = !!app.isActivated;
                  const isRejected = app.applicationStatus === 'Rejected';

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-700/30 transition-colors group"
                    >
                      {/* Full Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-100">
                        <div>{app.fullName}</div>
                        <div className="text-[10px] text-slate-400">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Instagram Username */}
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        @{app.instagramUsername}
                      </td>

                      {/* Instagram Profile Link */}
                      <td className="py-3.5 px-4">
                        <a
                          href={app.instagramProfileLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium group-hover:underline max-w-[200px] truncate"
                          title={app.instagramProfileLink}
                        >
                          <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{app.instagramProfileLink}</span>
                        </a>
                      </td>

                      {/* Follower Count */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                        {app.followerCount.toLocaleString()}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-900 border border-slate-700 text-slate-300">
                          {app.category}
                        </span>
                      </td>

                      {/* Application Status Tag */}
                      <td className="py-3.5 px-4">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {isActive && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            <Sparkles className="w-3 h-3" />
                            Active (Paid)
                          </span>
                        )}
                        {isRejected && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                              <XCircle className="w-3 h-3" />
                              Not Approved
                            </span>
                            {app.rejectionReason && (
                              <p className="text-[10px] text-red-400/90 mt-1 max-w-[160px] truncate" title={app.rejectionReason}>
                                Reason: {app.rejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Admin Mutate Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                id={`btn-approve-${app.id}`}
                                onClick={() => handleOpenReview(app, 'Approved')}
                                disabled={reviewingId === app.id}
                                className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                id={`btn-reject-${app.id}`}
                                onClick={() => handleOpenReview(app, 'Rejected')}
                                disabled={reviewingId === app.id}
                                className="px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-[11px] font-medium transition cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <div className="flex items-center gap-1.5">
                              {/* Webhook trigger button */}
                              <button
                                id={`btn-webhook-simulate-${app.id}`}
                                onClick={() => handleSimulateWebhook(app)}
                                disabled={isSimulatingWebhook === app.id}
                                title="Simulate Razorpay payment.captured webhook to automatically activate creator"
                                className="px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold transition flex items-center gap-1"
                              >
                                <Zap className="w-3 h-3 text-indigo-400" />
                                <span>{isSimulatingWebhook === app.id ? 'Simulating...' : 'Test Webhook'}</span>
                              </button>
                              <button
                                onClick={() => handleOpenReview(app, 'Rejected')}
                                disabled={reviewingId === app.id}
                                className="px-2 py-1 rounded bg-slate-700 hover:bg-red-900/30 text-slate-300 hover:text-red-300 text-[10px] transition"
                              >
                                Revoke to Reject
                              </button>
                            </div>
                          )}

                          {isActive && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-emerald-400 font-medium">
                                ✓ Live Creator
                              </span>
                              <button
                                onClick={() => handleOpenReview(app, 'Rejected')}
                                disabled={reviewingId === app.id}
                                className="px-2 py-1 rounded bg-slate-700 hover:bg-red-900/30 text-slate-300 hover:text-red-300 text-[10px] transition"
                              >
                                Suspend
                              </button>
                            </div>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleOpenReview(app, 'Approved')}
                              disabled={reviewingId === app.id}
                              className="px-2 py-1 rounded bg-slate-700 hover:bg-emerald-900/30 text-slate-300 hover:text-emerald-300 text-[10px] transition cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Confirmation Modal with Rejection Reason */}
      {activeReviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setActiveReviewModal(null)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-800 border border-slate-700 p-5 sm:p-6 shadow-2xl space-y-4 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeReviewModal.targetStatus === 'Approved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {activeReviewModal.targetStatus === 'Approved' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {activeReviewModal.targetStatus === 'Approved'
                    ? 'Approve Application'
                    : 'Reject Application'}
                </h3>
                <p className="text-xs text-slate-400">
                  Creator: <span className="text-slate-200">{activeReviewModal.profile.fullName}</span> (@{activeReviewModal.profile.instagramUsername})
                </p>
              </div>
            </div>

            <div className="text-xs space-y-2 text-slate-300">
              <p>
                {activeReviewModal.targetStatus === 'Approved'
                  ? 'Approving this application unlocks the one-time ₹49 platform activation payment for this creator on their status screen.'
                  : 'Rejecting this application will inform the creator that their application is Not Approved and keep ₹49 payment strictly blocked.'}
              </p>
            </div>

            {/* Rejection Reason specific field (Only shown for rejection) */}
            {activeReviewModal.targetStatus === 'Rejected' && (
              <div className="space-y-2.5 pt-1">
                <label htmlFor="input-rejection-reason" className="block text-xs font-semibold text-slate-300">
                  Rejection Reason <span className="text-slate-400 font-normal">(displayed to creator)</span>:
                </label>

                {/* Quick preset suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">Quick Preset Reasons:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {REJECTION_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setRejectionReason(preset)}
                        className={`text-[10px] px-2 py-1 rounded-md text-left transition border ${
                          rejectionReason === preset
                            ? 'bg-red-950/40 border-red-500/50 text-red-200'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  id="input-rejection-reason"
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Account does not meet engagement criteria or handle is private..."
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="input-admin-feedback" className="block text-xs font-medium text-slate-400 mb-1.5">
                Internal Audit Note / Feedback:
              </label>
              <textarea
                id="input-admin-feedback"
                rows={2}
                value={adminFeedback}
                onChange={(e) => setAdminFeedback(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Optional feedback..."
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveReviewModal(null)}
                className="flex-1 min-h-[44px] py-2.5 px-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition flex items-center justify-center cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-review-action"
                onClick={handleConfirmReview}
                disabled={reviewingId !== null}
                className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-lg text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                  activeReviewModal.targetStatus === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {reviewingId ? (
                  <span>Saving...</span>
                ) : (
                  <span>
                    Confirm {activeReviewModal.targetStatus === 'Approved' ? 'Approval' : 'Rejection'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
