import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import type { LegalDocType } from '../legal/LegalModal.tsx';

interface FooterProps {
  onOpenLegal: (type: LegalDocType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer id="global-footer" className="border-t border-slate-800 bg-slate-900/80 mt-auto pt-8 pb-24 md:pb-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Anti-Guarantee Compliance Notice */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-indigo-400 font-medium shrink-0">
            <Info className="w-4 h-4 shrink-0" />
            <span>Platform Policy</span>
          </div>
          <p className="leading-relaxed">
            Creator Bridge is an invite & verification platform for digital creators. We do not provide or guarantee sponsorships, financial compensation, or brand contracts. All collaboration terms are negotiated and agreed independently between creators and participating brands.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              CB
            </div>
            <span className="text-slate-300 font-medium">Creator Bridge</span>
            <span className="text-slate-500">|</span>
            <span>Gated Creator Collaboration Network</span>
          </div>

          {/* Legal Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <button
              id="footer-link-terms"
              onClick={() => onOpenLegal('terms')}
              className="text-slate-400 hover:text-indigo-400 transition"
            >
              Terms & Conditions
            </button>
            <button
              id="footer-link-privacy"
              onClick={() => onOpenLegal('privacy')}
              className="text-slate-400 hover:text-indigo-400 transition"
            >
              Privacy Policy
            </button>
            <button
              id="footer-link-help"
              onClick={() => onOpenLegal('help')}
              className="text-slate-400 hover:text-indigo-400 transition"
            >
              Help & FAQ
            </button>
            <button
              id="footer-link-contact"
              onClick={() => onOpenLegal('contact')}
              className="text-slate-400 hover:text-indigo-400 transition"
            >
              Contact Us
            </button>
          </nav>

          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Creator Bridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
