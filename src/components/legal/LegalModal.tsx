import React from 'react';
import { X, ShieldAlert, FileText, HelpCircle, Mail, ExternalLink } from 'lucide-react';

export type LegalDocType = 'terms' | 'privacy' | 'help' | 'contact';

interface LegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="legal-modal-card"
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-4 sm:p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-legal"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-50">Terms & Conditions</h3>
                <p className="text-xs text-slate-400">Last updated: September 2026</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                <strong>Strict Non-Guarantee Notice:</strong> Creator Bridge provides creator profile verification and an open directory of brand briefs. We do NOT guarantee commercial sponsorships, deal closures, or financial earnings. All brand collaboration selections are at the independent discretion of partnering brands.
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <h4 className="font-semibold text-slate-100">1. Verification & Onboarding</h4>
              <p>
                Submission of a creator profile initiates manual administrative review by Creator Bridge. Submission does not constitute automatic approval.
              </p>

              <h4 className="font-semibold text-slate-100">2. One-Time Verification Fee</h4>
              <p>
                Approved creators may optionally activate their creator dashboard via a one-time ₹49 platform verification fee. This fee covers administrative credential checks, profile badging, and active directory maintenance. It does not represent a fee for securing deals.
              </p>

              <h4 className="font-semibold text-slate-100">3. Authentication & Passwords</h4>
              <p>
                Creator Bridge uses Google OAuth exclusively. Under no circumstance will Creator Bridge ever request or store your Instagram or third-party passwords.
              </p>

              <h4 className="font-semibold text-slate-100">4. Community Integrity</h4>
              <p>
                Accounts suspected of artificial engagement inflation, automated follower purchasing, or deceptive content representations are subject to immediate removal without platform fee refund.
              </p>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-50">Privacy Policy</h3>
                <p className="text-xs text-slate-400">Your privacy and data safety commitments</p>
              </div>
            </div>

            {/* Platform Policy & Scope Notice */}
            <div className="bg-slate-900/70 border border-slate-700/80 rounded-lg p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
              <div>
                <p className="font-semibold text-slate-100 mb-0.5">Platform Policy</p>
                <p className="text-slate-400 leading-relaxed">
                  Creator Bridge is an invite &amp; verification platform for digital creators. We do not provide or guarantee sponsorships, financial compensation, or brand contracts. All collaboration terms are negotiated and agreed independently between creators and participating brands.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <h4 className="font-semibold text-slate-100">1. Information We Collect</h4>
              <p>
                We only collect your Google profile information (name, email address, avatar) and your voluntarily submitted public social handle, follower count, and primary content category.
              </p>

              <h4 className="font-semibold text-slate-100">2. Zero Sensitive Password Storage</h4>
              <p>
                We will never request, scrape, or store passwords, private messages, or payment credentials. All payment processing is conducted through PCI-DSS compliant payment gateways (Razorpay).
              </p>

              <h4 className="font-semibold text-slate-100">3. How Your Information Is Used</h4>
              <p>
                Your public profile details are used strictly by our internal review team to audit creator suitability and, once activated, made visible to verified brand partners seeking collaboration in your content niche.
              </p>

              <h4 className="font-semibold text-slate-100">4. Platform Scope & Independent Engagement</h4>
              <p>
                Creator Bridge is strictly a verification and discovery directory. We do not provide or guarantee sponsorships, financial compensation, or brand contracts. All collaboration terms are negotiated and agreed independently between creators and participating brands.
              </p>

              <h4 className="font-semibold text-slate-100">5. Data Erasure Rights</h4>
              <p>
                You may request complete erasure of your submitted creator profile and account records at any time by contacting our privacy officer at privacy@creatorbridge.in.
              </p>
            </div>
          </div>
        )}

        {type === 'help' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-50">Creator Help & Verification FAQ</h3>
                <p className="text-xs text-slate-400">Everything you need to know about the onboarding pipeline</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                <p className="font-semibold text-slate-100 mb-1">What is the application review criteria?</p>
                <p className="text-slate-400 text-xs">
                  Our admin team audits submitted accounts for authentic engagement, original creative output, clear niche alignment, and adherence to community guidelines.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                <p className="font-semibold text-slate-100 mb-1">Why is the ₹49 activation locked until approval?</p>
                <p className="text-slate-400 text-xs">
                  Creator Bridge enforces strict quality verification. Creators cannot pay unless an admin manually verifies and approves the application. This prevents unverified profiles from paying unnecessarily.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                <p className="font-semibold text-slate-100 mb-1">How long does the review process take?</p>
                <p className="text-slate-400 text-xs">
                  Applications are typically evaluated within 12–24 business hours. You can refresh your status anytime on your Creator Bridge status page.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                <p className="font-semibold text-slate-100 mb-1">Are deals guaranteed once activated?</p>
                <p className="text-slate-400 text-xs">
                  No. We maintain a strict Anti-Guarantee Policy. Activation unlocks access to browse and pitch for brand campaign briefs directly, but brands make independent partnership selections.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-50">Contact Creator Bridge</h3>
                <p className="text-xs text-slate-400">We are here to assist creators and brand managers</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/60 space-y-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Creator Support</p>
                <p className="text-slate-100 font-medium">support@creatorbridge.in</p>
                <p className="text-xs text-slate-400">Resolution SLA: Under 24 hours</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/60 space-y-1">
                <p className="text-xs text-slate-400 uppercase font-semibold">Brand Inquiries</p>
                <p className="text-slate-100 font-medium">brands@creatorbridge.in</p>
                <p className="text-xs text-slate-400">Campaign listings & briefs</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-slate-200">Corporate & Grievance Address:</p>
              <p className="text-slate-400">
                Creator Bridge Technologies Pvt. Ltd.<br />
                Level 4, Innov8 Hub, Koramangala 5th Block,<br />
                Bengaluru, Karnataka 560034, India
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-700/70 flex justify-end">
          <button
            id="btn-dismiss-legal"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
