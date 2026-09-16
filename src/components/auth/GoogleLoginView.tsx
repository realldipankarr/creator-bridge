import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Lock,
  AlertCircle,
  Users,
  Instagram,
  Briefcase,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { LegalDocType } from '../legal/LegalModal.tsx';
import type { User } from '../../types.ts';

interface GoogleLoginViewProps {
  onLogin: (email: string, name?: string, avatar?: string) => Promise<void>;
  onOpenLegal: (type: LegalDocType) => void;
  onOpenAdminPortal?: () => void;
  currentUser?: User | null;
  defaultEmail?: string;
  autoOpenJoinModal?: boolean;
}

export const GoogleLoginView: React.FC<GoogleLoginViewProps> = ({
  onLogin,
  onOpenLegal,
  onOpenAdminPortal,
  currentUser,
  defaultEmail = 'exposeg16@gmail.com',
  autoOpenJoinModal = false,
}) => {
  // Step 1 Flow state: when user clicks "Join as Creator", show "Continue with Google"
  const [showGooglePrompt, setShowGooglePrompt] = useState(autoOpenJoinModal);
  const [customEmail, setCustomEmail] = useState(defaultEmail);
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onLogin(
        customEmail.trim() || defaultEmail,
        customName.trim() || undefined,
        undefined
      );
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-16">
      {/* If Google prompt is active, display "Continue with Google" card */}
      {showGooglePrompt ? (
        <div
          id="google-signin-step"
          className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Subtle accent glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Back button */}
          <button
            id="btn-back-to-landing"
            onClick={() => setShowGooglePrompt(false)}
            className="text-xs text-slate-400 hover:text-slate-200 mb-4 inline-flex items-center gap-1 transition"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-3 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              Join as Creator
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Authenticate your Google account to start your creator profile verification.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action: Continue with Google */}
          <div className="space-y-4">
            <button
              id="btn-continue-google"
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition flex items-center justify-center gap-3 shadow-md active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {/* Google SVG Logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            {/* Test Helper: Custom Email Toggle */}
            <div className="text-center pt-1">
              <button
                id="btn-toggle-custom-google"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                {isCustomMode
                  ? 'Use default Google Account'
                  : `Signed in as ${customEmail} (Change)`}
              </button>
            </div>

            {isCustomMode && (
              <div className="space-y-3 pt-3 border-t border-slate-700/80 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Google Account Email
                  </label>
                  <input
                    id="input-google-email"
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    id="input-google-name"
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security & Strict Compliance Notice */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero Passwords: We never request or store social passwords.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Anti-Guarantee Policy: No deal or revenue promises.</span>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed pt-2">
              By continuing, you agree to Creator Bridge's{' '}
              <button
                onClick={() => onOpenLegal('terms')}
                className="text-slate-400 hover:text-indigo-400 underline underline-offset-2"
              >
                Terms & Conditions
              </button>{' '}
              and{' '}
              <button
                onClick={() => onOpenLegal('privacy')}
                className="text-slate-400 hover:text-indigo-400 underline underline-offset-2"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      ) : (
        /* STEP 1 Initial Presentation: Clear "Join as Creator" landing */
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gated Creator & Brand Collaboration Platform</span>
          </div>

          {/* Headline & Subhead */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-50 leading-tight">
              Direct Brand Opportunities for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">
                Verified Creators
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect your verified creator portfolio with authentic brand collaboration briefs.
              Audited manually by our admin team with zero password collection.
            </p>
          </div>

          {/* Primary CTA: When the user clicks “Join as Creator”, show “Continue with Google” */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="btn-join-as-creator"
              onClick={() => setShowGooglePrompt(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base transition shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              <span>Join as Creator</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentUser?.role === 'admin' && onOpenAdminPortal && (
              <button
                id="btn-landing-admin"
                onClick={onOpenAdminPortal}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition border border-slate-700 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Admin Review Console</span>
              </button>
            )}
          </div>

          {/* Transparent Process Overview */}
          <div className="pt-8 border-t border-slate-800 grid sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
                1
              </div>
              <p className="text-xs font-bold text-slate-100">Submit Profile</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Provide public Instagram handle and metrics. We never ask for your password or credentials.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                2
              </div>
              <p className="text-xs font-bold text-slate-100">Manual Admin Review</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Our verification team audits audience engagement and content quality to protect platform standards.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                3
              </div>
              <p className="text-xs font-bold text-slate-100">₹49 Gated Activation</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Only approved creators unlock the one-time ₹49 platform fee to access verified campaign briefs.
              </p>
            </div>
          </div>

          {/* Compliance & Security Guarantee Assurance */}
          <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 max-w-xl mx-auto flex items-center justify-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Zero Passwords • Manual Human Review • Independent Brand Terms
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
