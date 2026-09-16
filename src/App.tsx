import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar.tsx';
import { Footer } from './components/navigation/Footer.tsx';
import { BottomNav, DashboardTab } from './components/navigation/BottomNav.tsx';
import { GoogleLoginView } from './components/auth/GoogleLoginView.tsx';
import { CreatorProfileSetup } from './components/creator/CreatorProfileSetup.tsx';
import { ApplicationStatusView } from './components/creator/ApplicationStatusView.tsx';
import { RazorpayPaymentModal } from './components/creator/RazorpayPaymentModal.tsx';
import { CreatorDashboard } from './components/dashboard/CreatorDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { LegalModal, LegalDocType } from './components/legal/LegalModal.tsx';
import type {
  CampaignOpportunity,
  ContentCategory,
  CreatorProfile,
  User,
} from './types.ts';
import {
  createOpportunity,
  fetchApplications,
  fetchOpportunities,
  fetchProfileByUserId,
  loginWithGoogle,
  resetDemoData,
  reviewApplication,
  submitProfile,
} from './lib/api.ts';

export default function App() {
  // Authentication & Profile state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentProfile, setCurrentProfile] = useState<CreatorProfile | null>(null);

  // Active view role: creator or admin
  const [activeRole, setActiveRole] = useState<'creator' | 'admin'>('creator');

  // Creator Dashboard active tab
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('home');

  // Edit profile mode toggle
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Razorpay payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Legal modal state
  const [activeLegalModal, setActiveLegalModal] = useState<LegalDocType | null>(null);

  // Global opportunities & admin applications state
  const [opportunities, setOpportunities] = useState<CampaignOpportunity[]>([]);
  const [allApplications, setAllApplications] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load: log in as default creator or load opportunities
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      await reloadOpportunities();
      await reloadApplications();
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reloadOpportunities = async () => {
    try {
      const data = await fetchOpportunities();
      setOpportunities(data.opportunities);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    }
  };

  const reloadApplications = async () => {
    try {
      const data = await fetchApplications();
      setAllApplications(data.applications);
    } catch (err) {
      console.error('Failed to load applications:', err);
    }
  };

  // Sync profile when user changes or status updates
  const refreshCurrentProfile = async () => {
    if (!currentUser) return;
    try {
      const res = await fetchProfileByUserId(currentUser.id);
      setCurrentProfile(res.profile);
      await reloadApplications();
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Google Sign-In Handler
  const handleGoogleLogin = async (email: string, name?: string, avatar?: string) => {
    const res = await loginWithGoogle(email, name, avatar, 'creator');
    setCurrentUser(res.user);
    setCurrentProfile(res.profile);
    setIsEditingProfile(false);
    await reloadApplications();
  };

  // Sign out
  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentProfile(null);
    setIsEditingProfile(false);
  };

  // Quick Persona Switcher (For rapid testing across all states)
  const handleSelectQuickAccount = async (
    type: 'approved' | 'pending' | 'rejected' | 'activated' | 'new'
  ) => {
    setIsLoading(true);
    try {
      if (type === 'approved') {
        const res = await loginWithGoogle('rohan.tech@gmail.com', 'Rohan Sharma');
        setCurrentUser(res.user);
        setCurrentProfile(res.profile);
      } else if (type === 'pending') {
        const res = await loginWithGoogle('priya.beats@gmail.com', 'Priya Nair');
        setCurrentUser(res.user);
        setCurrentProfile(res.profile);
      } else if (type === 'rejected') {
        const res = await loginWithGoogle('vikram.gamer@gmail.com', 'Vikram Joshi');
        setCurrentUser(res.user);
        setCurrentProfile(res.profile);
      } else if (type === 'activated') {
        const res = await loginWithGoogle('ananya.creates@gmail.com', 'Ananya Deshmukh');
        setCurrentUser(res.user);
        setCurrentProfile(res.profile);
      } else if (type === 'new') {
        // Blank account for testing Step 1 -> Step 2
        const randomId = Math.random().toString(36).substring(2, 6);
        const res = await loginWithGoogle(`new.creator.${randomId}@gmail.com`, 'New Creator');
        setCurrentUser(res.user);
        setCurrentProfile(null);
      }
      setIsEditingProfile(false);
      setActiveRole('creator');
      await reloadApplications();
    } finally {
      setIsLoading(false);
    }
  };

  // Submit profile (Step 2)
  const handleSubmitProfile = async (formData: {
    fullName: string;
    instagramUsername: string;
    instagramProfileLink: string;
    followerCount: number;
    category: ContentCategory;
  }) => {
    if (!currentUser) return;
    const res = await submitProfile({
      userId: currentUser.id,
      ...formData,
    });
    setCurrentProfile(res.profile);
    setIsEditingProfile(false);
    await reloadApplications();
  };

  // Admin Review Mutation (Step 4)
  const handleAdminReview = async (
    profileId: string,
    status: 'Approved' | 'Rejected' | 'Pending',
    feedback?: string,
    rejectionReason?: string,
  ) => {
    await reviewApplication(profileId, status, feedback, rejectionReason);
    await reloadApplications();
    // If the active user was the one reviewed, update current profile
    if (currentProfile && currentProfile.id === profileId) {
      await refreshCurrentProfile();
    }
  };

  // Admin Create Opportunity
  const handleCreateOpportunity = async (data: Partial<CampaignOpportunity>) => {
    await createOpportunity(data);
    await reloadOpportunities();
  };

  // Reset Demo Data
  const handleResetDemoData = async () => {
    await resetDemoData();
    await reloadApplications();
    await reloadOpportunities();
    if (currentUser) {
      await refreshCurrentProfile();
    }
  };

  // Payment Success callback from Razorpay modal
  const handlePaymentSuccess = (updatedProfile: CreatorProfile) => {
    setCurrentProfile(updatedProfile);
    setIsPaymentModalOpen(false);
    setDashboardTab('home');
    reloadApplications();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Persistent Navigation Header */}
      <Navbar
        currentUser={currentUser}
        currentProfile={currentProfile}
        activeRole={activeRole}
        onSwitchRole={setActiveRole}
        onSignOut={handleSignOut}
        onResetDemo={handleResetDemoData}
        onSelectQuickAccount={handleSelectQuickAccount}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Loading Creator Bridge...</p>
            </div>
          </div>
        ) : activeRole === 'admin' ? (
          /* ADMIN PORTAL */
          <AdminDashboard
            applications={allApplications}
            opportunities={opportunities}
            onReviewApplication={handleAdminReview}
            onCreateOpportunity={handleCreateOpportunity}
            onResetDemo={handleResetDemoData}
            onRefreshApplications={reloadApplications}
            isLoading={isLoading}
          />
        ) : (
          /* CREATOR FLOW */
          <div className="flex-1 flex flex-col">
            {/* Step 1: Not logged in */}
            {!currentUser && (
              <GoogleLoginView
                onLogin={handleGoogleLogin}
                onOpenLegal={setActiveLegalModal}
                onOpenAdminPortal={() => setActiveRole('admin')}
              />
            )}

            {/* Step 2: Logged in, profile not yet created */}
            {currentUser && !currentProfile && (
              <CreatorProfileSetup
                user={currentUser}
                onSubmit={handleSubmitProfile}
              />
            )}

            {/* Editing profile view */}
            {currentUser && currentProfile && isEditingProfile && (
              <CreatorProfileSetup
                user={currentUser}
                existingProfile={currentProfile}
                isEditing={true}
                onSubmit={handleSubmitProfile}
                onCancelEdit={() => setIsEditingProfile(false)}
              />
            )}

            {/* Steps 3, 5, 7: Profile exists but is not activated */}
            {currentUser && currentProfile && !isEditingProfile && !currentProfile.isActivated && (
              <ApplicationStatusView
                profile={currentProfile}
                onInitiatePayment={() => setIsPaymentModalOpen(true)}
                onRefreshStatus={refreshCurrentProfile}
                onEditProfile={() => setIsEditingProfile(true)}
                onOpenAdminPortal={() => setActiveRole('admin')}
              />
            )}

            {/* Step 6: Payment Success & Creator Dashboard Activated */}
            {currentUser && currentProfile && !isEditingProfile && currentProfile.isActivated && (
              <CreatorDashboard
                user={currentUser}
                profile={currentProfile}
                opportunities={opportunities}
                onEditProfile={() => setIsEditingProfile(true)}
                onOpenLegal={setActiveLegalModal}
                activeTab={dashboardTab}
                onChangeTab={setDashboardTab}
              />
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation for Activated Creator Dashboard */}
      {activeRole === 'creator' && currentUser && currentProfile?.isActivated && !isEditingProfile && (
        <BottomNav
          activeTab={dashboardTab}
          onChangeTab={setDashboardTab}
        />
      )}

      {/* Global Compliance Footer */}
      <Footer onOpenLegal={setActiveLegalModal} />

      {/* Razorpay Activation Payment Modal */}
      {currentProfile && (
        <RazorpayPaymentModal
          profile={currentProfile}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Compliance & Legal Documents Modal */}
      <LegalModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />
    </div>
  );
}
