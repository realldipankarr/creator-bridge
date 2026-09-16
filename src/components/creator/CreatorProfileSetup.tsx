import React, { useState, useMemo } from 'react';
import { Instagram, Users, Sparkles, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { ContentCategory, CreatorProfile, User } from '../../types.ts';

const CATEGORIES: ContentCategory[] = [
  'Gaming',
  'Technology',
  'Music',
  'Dance',
  'Education',
  'Entertainment',
  'Others',
];

const IG_LINK_REGEX = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?(?:\?.*)?$/i;
const USERNAME_REGEX = /^[a-zA-Z0-9._]{1,30}$/;

interface CreatorProfileSetupProps {
  user: User;
  existingProfile?: CreatorProfile | null;
  isEditing?: boolean;
  onSubmit: (data: {
    fullName: string;
    instagramUsername: string;
    instagramProfileLink: string;
    followerCount: number;
    category: ContentCategory;
  }) => Promise<void>;
  onCancelEdit?: () => void;
}

export const CreatorProfileSetup: React.FC<CreatorProfileSetupProps> = ({
  user,
  existingProfile,
  isEditing = false,
  onSubmit,
  onCancelEdit,
}) => {
  const [fullName, setFullName] = useState(existingProfile?.fullName || user.name || '');
  const [instagramUsername, setInstagramUsername] = useState(existingProfile?.instagramUsername || '');
  const [instagramProfileLink, setInstagramProfileLink] = useState(
    existingProfile?.instagramProfileLink || (existingProfile?.instagramUsername ? `https://instagram.com/${existingProfile.instagramUsername}` : '')
  );
  const [followerCount, setFollowerCount] = useState<string>(
    existingProfile?.followerCount ? String(existingProfile.followerCount) : ''
  );
  const [category, setCategory] = useState<ContentCategory>(
    existingProfile?.category || 'Technology'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill link when username changes if user hasn't typed an unrelated link
  const handleUsernameChange = (val: string) => {
    const cleanUsername = val.replace(/^@/, '').trim();
    setInstagramUsername(cleanUsername);
    if (!instagramProfileLink || instagramProfileLink.includes('instagram.com/')) {
      setInstagramProfileLink(`https://instagram.com/${cleanUsername}`);
    }
  };

  // Real-time Instagram Link & Handle Match Validation
  const validationStatus = useMemo(() => {
    const cleanUser = instagramUsername.replace(/^@/, '').trim();
    const cleanLink = instagramProfileLink.trim();

    if (!cleanUser && !cleanLink) {
      return { status: 'idle', message: '' };
    }

    if (!USERNAME_REGEX.test(cleanUser)) {
      return {
        status: 'error',
        message: 'Username must be 1-30 characters with letters, numbers, periods, or underscores.',
      };
    }

    if (!cleanLink) {
      return { status: 'idle', message: '' };
    }

    const match = cleanLink.match(IG_LINK_REGEX);
    if (!match) {
      return {
        status: 'error',
        message: `Profile link must be formatted as https://instagram.com/${cleanUser}`,
      };
    }

    const linkHandle = match[1].toLowerCase();
    if (linkHandle !== cleanUser.toLowerCase()) {
      return {
        status: 'error',
        message: `Link handle (@${linkHandle}) does not match entered username (@${cleanUser}).`,
      };
    }

    return {
      status: 'success',
      message: `Verified: Link matches @${cleanUser}`,
    };
  }, [instagramUsername, instagramProfileLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = fullName.trim();
    const cleanUsername = instagramUsername.replace(/^@/, '').trim();
    const trimmedLink = instagramProfileLink.trim();
    const numFollowers = parseInt(followerCount.replace(/,/g, ''), 10);

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanUsername) {
      setErrorMessage('Please enter your Instagram username.');
      return;
    }
    if (!USERNAME_REGEX.test(cleanUsername)) {
      setErrorMessage('Instagram username must be 1-30 characters containing only letters, numbers, periods, or underscores.');
      return;
    }

    const linkMatch = trimmedLink.match(IG_LINK_REGEX);
    if (!linkMatch) {
      setErrorMessage(`Please provide a valid Instagram profile URL (e.g. https://instagram.com/${cleanUsername}).`);
      return;
    }

    const extractedHandle = linkMatch[1];
    if (extractedHandle.toLowerCase() !== cleanUsername.toLowerCase()) {
      setErrorMessage(`Validation Error: The Instagram profile link (@${extractedHandle}) must match the entered username (@${cleanUsername}).`);
      return;
    }

    if (isNaN(numFollowers) || numFollowers < 0) {
      setErrorMessage('Please enter a valid follower count number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        fullName: trimmedName,
        instagramUsername: cleanUsername,
        instagramProfileLink: `https://instagram.com/${cleanUsername}`,
        followerCount: numFollowers,
        category,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit profile.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full px-4 py-8">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Profile Management' : 'Step 2 of Onboarding'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">
            {isEditing ? 'Edit Creator Profile' : 'Creator Profile Setup'}
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            {isEditing
              ? 'Update your public creator presence and audience niche. Passwords are never collected.'
              : 'Submit your creator profile details for manual admin evaluation and verification.'}
          </p>
        </div>

        {/* Security assurance banner */}
        <div className="mb-6 p-3 rounded-lg bg-slate-900/60 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Zero Password Collection:</strong> We audit public creator portfolios only. We will never ask for your Instagram password, two-factor codes, or private credentials.
          </span>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Field 1: Full Name */}
          <div>
            <label htmlFor="input-fullname" className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="input-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Nair"
              className="w-full px-4 py-3 min-h-[48px] rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Field 2: Instagram Username */}
          <div>
            <label htmlFor="input-instagram-username" className="block text-xs font-medium text-slate-300 mb-1.5">
              Instagram Username <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-base sm:text-sm font-medium">
                @
              </span>
              <input
                id="input-instagram-username"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={instagramUsername}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="priya_grooves"
                className="w-full pl-8 pr-4 py-3 min-h-[48px] rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Enter your public handle without the @ symbol.</p>
          </div>

          {/* Field 3: Instagram Profile Link */}
          <div>
            <label htmlFor="input-instagram-link" className="block text-xs font-medium text-slate-300 mb-1.5">
              Instagram Profile Link <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Instagram className="w-4 h-4" />
              </span>
              <input
                id="input-instagram-link"
                type="url"
                inputMode="url"
                required
                value={instagramProfileLink}
                onChange={(e) => setInstagramProfileLink(e.target.value)}
                placeholder="https://instagram.com/priya_grooves"
                className="w-full pl-10 pr-4 py-3 min-h-[48px] rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            {/* Real-time Match Validation Feedback */}
            {validationStatus.status === 'success' && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{validationStatus.message}</span>
              </div>
            )}
            {validationStatus.status === 'error' && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-amber-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{validationStatus.message}</span>
              </div>
            )}
            {validationStatus.status === 'idle' && (
              <p className="text-[11px] text-slate-400 mt-1">
                Link format: https://instagram.com/your_handle (must match the username above).
              </p>
            )}
          </div>

          {/* Field 4: Follower Count */}
          <div>
            <label htmlFor="input-follower-count" className="block text-xs font-medium text-slate-300 mb-1.5">
              Follower Count <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Users className="w-4 h-4" />
              </span>
              <input
                id="input-follower-count"
                type="number"
                inputMode="numeric"
                min="0"
                required
                value={followerCount}
                onChange={(e) => setFollowerCount(e.target.value)}
                placeholder="e.g. 35000"
                className="w-full pl-10 pr-4 py-3 min-h-[48px] rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Approximate count of your genuine active followers.</p>
          </div>

          {/* Field 5: Content Category Dropdown */}
          <div>
            <label htmlFor="select-category" className="block text-xs font-medium text-slate-300 mb-1.5">
              Content Category <span className="text-red-400">*</span>
            </label>
            <select
              id="select-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ContentCategory)}
              className="w-full px-4 py-3 min-h-[48px] rounded-lg bg-slate-900/50 border border-slate-700 text-slate-100 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800 text-slate-100">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            {isEditing && onCancelEdit && (
              <button
                type="button"
                id="btn-cancel-edit-profile"
                onClick={onCancelEdit}
                className="w-full sm:w-1/3 min-h-[48px] py-3 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-base sm:text-sm transition flex items-center justify-center"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              id="btn-submit-review"
              disabled={isSubmitting}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-70 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span>Submitting Profile...</span>
              ) : (
                <>
                  <span>{isEditing ? 'Save Profile Changes' : 'Submit for Review'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
