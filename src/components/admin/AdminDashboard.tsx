import React, { useState } from 'react';
import {
  Shield,
  Users,
  Briefcase,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import type { ApplicationStatus, CampaignOpportunity, ContentCategory, CreatorProfile } from '../../types.ts';
import { ApplicationTable } from './ApplicationTable.tsx';

const CATEGORIES: ContentCategory[] = [
  'Gaming',
  'Technology',
  'Music',
  'Dance',
  'Education',
  'Entertainment',
  'Others',
];

interface AdminDashboardProps {
  applications: CreatorProfile[];
  opportunities: CampaignOpportunity[];
  onReviewApplication: (
    profileId: string,
    status: ApplicationStatus,
    feedback?: string,
    rejectionReason?: string
  ) => Promise<void>;
  onCreateOpportunity: (opp: Partial<CampaignOpportunity>) => Promise<void>;
  onResetDemo: () => Promise<void>;
  onRefreshApplications?: () => Promise<void>;
  isLoading: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  applications,
  opportunities,
  onReviewApplication,
  onCreateOpportunity,
  onResetDemo,
  onRefreshApplications,
  isLoading,
}) => {
  const [adminTab, setAdminTab] = useState<'applications' | 'opportunities'>('applications');
  const [isResetting, setIsResetting] = useState(false);

  // New opportunity modal state
  const [isAddOppModalOpen, setIsAddOppModalOpen] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppBrand, setOppBrand] = useState('');
  const [oppCategory, setOppCategory] = useState<ContentCategory>('Technology');
  const [oppBudget, setOppBudget] = useState('₹30,000 - ₹60,000');
  const [oppDeliverables, setOppDeliverables] = useState('1 Dedicated Video / Reel');
  const [oppDesc, setOppDesc] = useState('');
  const [isSubmittingOpp, setIsSubmittingOpp] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await onResetDemo();
    setIsResetting(false);
  };

  const handleCreateOppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle || !oppBrand || !oppDesc) return;

    setIsSubmittingOpp(true);
    try {
      await onCreateOpportunity({
        title: oppTitle.trim(),
        brandName: oppBrand.trim(),
        category: oppCategory,
        budgetRange: oppBudget.trim(),
        deliverables: oppDeliverables.trim(),
        description: oppDesc.trim(),
      });
      setIsAddOppModalOpen(false);
      setOppTitle('');
      setOppBrand('');
      setOppDesc('');
    } finally {
      setIsSubmittingOpp(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-20">
      {/* Admin Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950/30 to-slate-800 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Internal Verification Team Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Admin Review & Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Evaluate incoming creator profile submissions, enforce server payment verification gates, and publish brand collaboration briefs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
          <button
            id="btn-admin-reset-data"
            onClick={handleReset}
            disabled={isResetting}
            className="px-3 py-2 min-h-[40px] rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>

          <button
            id="btn-admin-add-opp"
            onClick={() => setIsAddOppModalOpen(true)}
            className="px-3.5 py-2 min-h-[40px] rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Brand Opportunity</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          id="admin-tab-applications"
          onClick={() => setAdminTab('applications')}
          className={`px-3 sm:px-4 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
            adminTab === 'applications'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span><span className="hidden sm:inline">Creator </span>Applications ({applications.length})</span>
        </button>

        <button
          id="admin-tab-opportunities"
          onClick={() => setAdminTab('opportunities')}
          className={`px-3 sm:px-4 py-2 min-h-[40px] rounded-lg text-xs font-semibold transition flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
            adminTab === 'opportunities'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span><span className="hidden sm:inline">Manage Brand </span>Opportunities ({opportunities.length})</span>
        </button>
      </div>

      {/* Server Guard Security Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-200">Server-Side Payment Guard Architecture Active</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            POST /api/payment/create-order rigorously queries database state. If application_status != 'Approved', the server immediately terminates with HTTP 403 Forbidden. Approving an applicant here directly unlocks their payment clearance.
          </p>
        </div>
      </div>

      {/* Tab View */}
      {adminTab === 'applications' && (
        <ApplicationTable
          applications={applications}
          onReview={onReviewApplication}
          onRefresh={onRefreshApplications}
          isLoading={isLoading}
        />
      )}

      {adminTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Active Campaign Briefs</h3>
            <span className="text-xs text-slate-400">
              Visible to activated creators who completed ₹49 verification.
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-5 rounded-xl bg-slate-800 border border-slate-700/80 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase">
                      {opp.brandName}
                    </span>
                    <h4 className="text-base font-bold text-slate-100">{opp.title}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">
                    {opp.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{opp.description}</p>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget:</span>
                    <span className="font-bold text-emerald-400">{opp.budgetRange}</span>
                  </div>
                  {opp.deliverables && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Deliverables:</span>
                      <span className="text-slate-200">{opp.deliverables}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Opportunity Modal */}
      {isAddOppModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setIsAddOppModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-2xl space-y-4 text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Publish Brand Brief</h3>
                <p className="text-xs text-slate-400">Add an open opportunity for verified creators.</p>
              </div>
            </div>

            <form onSubmit={handleCreateOppSubmit} className="space-y-3.5 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    value={oppTitle}
                    onChange={(e) => setOppTitle(e.target.value)}
                    placeholder="e.g. Wireless Mic Launch"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={oppBrand}
                    onChange={(e) => setOppBrand(e.target.value)}
                    placeholder="e.g. Sennheiser India"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Category *</label>
                  <select
                    value={oppCategory}
                    onChange={(e) => setOppCategory(e.target.value as ContentCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Budget Range *</label>
                  <input
                    type="text"
                    required
                    value={oppBudget}
                    onChange={(e) => setOppBudget(e.target.value)}
                    placeholder="e.g. ₹20,000 - ₹50,000"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Deliverables</label>
                <input
                  type="text"
                  value={oppDeliverables}
                  onChange={(e) => setOppDeliverables(e.target.value)}
                  placeholder="e.g. 1 Instagram Reel + 1 Story Set"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Brief Description *</label>
                <textarea
                  rows={3}
                  required
                  value={oppDesc}
                  onChange={(e) => setOppDesc(e.target.value)}
                  placeholder="Describe campaign goals, creator requirements, and target deliverables..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddOppModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingOpp}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  {isSubmittingOpp ? 'Publishing...' : 'Publish Brief'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
