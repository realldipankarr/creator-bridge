import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import type { ApplicationStatus, CampaignOpportunity, ContentCategory, CreatorProfile, User } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

export interface OrderRecord {
  orderId: string;
  profileId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: string;
}

// In-memory persistent state
interface Database {
  users: Map<string, User>;
  profiles: Map<string, CreatorProfile>;
  opportunities: CampaignOpportunity[];
  orders: Map<string, OrderRecord>;
}

const db: Database = {
  users: new Map(),
  profiles: new Map(),
  orders: new Map(),
  opportunities: [
    {
      id: 'opp-1',
      title: 'Next-Gen Gaming Headset Showcase',
      brandName: 'Apex Audio Labs',
      category: 'Gaming',
      description: 'Seeking gaming creators with authentic community engagement to showcase our flagship wireless headset in dedicated gameplay reviews and stream highlights.',
      budgetRange: '₹25,000 - ₹50,000',
      status: 'Open',
      deliverables: '1 YouTube/Twitch Video + 1 Instagram Reel',
      deadline: '2026-10-15',
      createdAt: new Date('2026-09-10').toISOString(),
    },
    {
      id: 'opp-2',
      title: 'Smart Productivity App Launch Campaign',
      brandName: 'Flowstate AI',
      category: 'Technology',
      description: 'Promote our cross-platform workspace and note-taking suite. Looking for tech reviewers and productivity creators to demonstrate genuine workflows.',
      budgetRange: '₹30,000 - ₹70,000',
      status: 'Open',
      deliverables: '1 Instagram Carousel + 2 Dedicated Story Sets',
      deadline: '2026-10-25',
      createdAt: new Date('2026-09-12').toISOString(),
    },
    {
      id: 'opp-3',
      title: 'Urban Streetwear Monsoon Collection',
      brandName: 'Kult & Craft',
      category: 'Entertainment',
      description: 'Collab with fashion, dance, and lifestyle creators to model and style our newly dropped monsoon streetwear drop with aesthetic reels.',
      budgetRange: '₹20,000 - ₹45,000',
      status: 'Open',
      deliverables: '2 High-res Instagram Reels + Bio Link for 14 Days',
      deadline: '2026-10-20',
      createdAt: new Date('2026-09-14').toISOString(),
    },
  ],
};

// Seed demo users and profiles
function seedInitialData() {
  // Demo Admin
  const adminUser: User = {
    id: 'user-admin',
    email: 'admin@creatorbridge.in',
    name: 'Admin Verification Team',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
  };
  db.users.set(adminUser.id, adminUser);

  // Demo Approved Creator (ready to pay or already active)
  const approvedUser: User = {
    id: 'user-approved-rohan',
    email: 'rohan.tech@gmail.com',
    name: 'Rohan Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    role: 'creator',
  };
  db.users.set(approvedUser.id, approvedUser);
  db.profiles.set(approvedUser.id, {
    id: 'prof-approved-1',
    userId: approvedUser.id,
    fullName: 'Rohan Sharma',
    instagramUsername: 'rohan_techbytes',
    instagramProfileLink: 'https://instagram.com/rohan_techbytes',
    followerCount: 68500,
    category: 'Technology',
    applicationStatus: 'Approved',
    isActivated: false, // In approved stage: eligible for ₹49 payment!
    adminFeedback: 'High engagement rate and clean tech review content verified.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  });

  // Demo Pending Creator (Under Review - Payment LOCKED)
  const pendingUser: User = {
    id: 'user-pending-priya',
    email: 'priya.beats@gmail.com',
    name: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    role: 'creator',
  };
  db.users.set(pendingUser.id, pendingUser);
  db.profiles.set(pendingUser.id, {
    id: 'prof-pending-1',
    userId: pendingUser.id,
    fullName: 'Priya Nair',
    instagramUsername: 'priya_grooves',
    instagramProfileLink: 'https://instagram.com/priya_grooves',
    followerCount: 34200,
    category: 'Dance',
    applicationStatus: 'Pending',
    isActivated: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  });

  // Demo Rejected Creator (Not Approved - Payment strictly blocked)
  const rejectedUser: User = {
    id: 'user-rejected-vikram',
    email: 'vikram.gamer@gmail.com',
    name: 'Vikram Joshi',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    role: 'creator',
  };
  db.users.set(rejectedUser.id, rejectedUser);
  db.profiles.set(rejectedUser.id, {
    id: 'prof-rejected-1',
    userId: rejectedUser.id,
    fullName: 'Vikram Joshi',
    instagramUsername: 'vikram_clips',
    instagramProfileLink: 'https://instagram.com/vikram_clips',
    followerCount: 1200,
    category: 'Gaming',
    applicationStatus: 'Rejected',
    isActivated: false,
    adminFeedback: 'Account does not meet public original content requirements or minimum engagement baseline.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  });

  // Demo Activated Creator
  const activatedUser: User = {
    id: 'user-active-ananya',
    email: 'ananya.creates@gmail.com',
    name: 'Ananya Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    role: 'creator',
  };
  db.users.set(activatedUser.id, activatedUser);
  db.profiles.set(activatedUser.id, {
    id: 'prof-active-1',
    userId: activatedUser.id,
    fullName: 'Ananya Deshmukh',
    instagramUsername: 'ananya_vibes',
    instagramProfileLink: 'https://instagram.com/ananya_vibes',
    followerCount: 112000,
    category: 'Entertainment',
    applicationStatus: 'Approved',
    isActivated: true,
    paymentId: 'pay_rzp_CB789210',
    paidAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  });
}

seedInitialData();

// --- API ROUTES ---

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Google Sign-In Endpoint (No passwords, OAuth simulation)
app.post('/api/auth/google', (req, res) => {
  const { email, name, avatar, role = 'creator' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required from Google Auth.' });
  }

  // Find or create user
  let user: User | undefined;
  for (const existingUser of db.users.values()) {
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      user = existingUser;
      break;
    }
  }

  if (!user) {
    const newId = 'usr_' + Math.random().toString(36).substring(2, 9);
    user = {
      id: newId,
      email,
      name: name || email.split('@')[0],
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      role: role === 'admin' ? 'admin' : 'creator',
    };
    db.users.set(user.id, user);
  }

  const profile = db.profiles.get(user.id) || null;
  res.json({ user, profile });
});

// Switch role or get user
app.get('/api/users/:id', (req, res) => {
  const user = db.users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const profile = db.profiles.get(user.id) || null;
  res.json({ user, profile });
});

// Get profile by user ID
app.get('/api/applications/user/:userId', (req, res) => {
  const profile = db.profiles.get(req.params.userId);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found for this user.' });
  }
  res.json({ profile });
});

// Instagram validation helper
export function extractAndValidateInstagram(usernameInput: string, linkInput: string): {
  valid: boolean;
  cleanUsername: string;
  cleanLink: string;
  error?: string;
} {
  const cleanUsername = String(usernameInput || '').replace(/^@/, '').trim();
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
  if (!usernameRegex.test(cleanUsername)) {
    return {
      valid: false,
      cleanUsername,
      cleanLink: linkInput,
      error: 'Instagram username must be 1-30 characters containing only letters, numbers, periods, or underscores.',
    };
  }

  const cleanLink = String(linkInput || '').trim();
  const igLinkRegex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?(?:\?.*)?$/i;
  const match = cleanLink.match(igLinkRegex);
  if (!match) {
    return {
      valid: false,
      cleanUsername,
      cleanLink,
      error: `Invalid Instagram profile URL format. Must be formatted like: https://instagram.com/${cleanUsername}`,
    };
  }

  const extractedHandle = match[1];
  if (extractedHandle.toLowerCase() !== cleanUsername.toLowerCase()) {
    return {
      valid: false,
      cleanUsername,
      cleanLink,
      error: `Instagram Profile Link handle (@${extractedHandle}) does not match the entered Instagram Username (@${cleanUsername}). Both must match.`,
    };
  }

  return {
    valid: true,
    cleanUsername,
    cleanLink: `https://instagram.com/${cleanUsername}`,
  };
}

// List all applications (Admin)
app.get('/api/applications', (req, res) => {
  const { status, category, search } = req.query;
  let allProfiles = Array.from(db.profiles.values());

  // Status filtering: All, Pending, Approved, Rejected, Active
  if (status && typeof status === 'string' && status !== 'All') {
    if (status === 'Active') {
      allProfiles = allProfiles.filter((p) => p.isActivated === true);
    } else if (status === 'Approved') {
      // Approved profiles waiting for payment activation
      allProfiles = allProfiles.filter((p) => p.applicationStatus === 'Approved' && !p.isActivated);
    } else if (status === 'Pending') {
      allProfiles = allProfiles.filter((p) => p.applicationStatus === 'Pending');
    } else if (status === 'Rejected') {
      allProfiles = allProfiles.filter((p) => p.applicationStatus === 'Rejected');
    }
  }

  if (category && typeof category === 'string' && category !== 'All') {
    allProfiles = allProfiles.filter((p) => p.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    allProfiles = allProfiles.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.instagramUsername.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Sort by createdAt desc
  allProfiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ applications: allProfiles });
});

// Submit / Edit Creator Profile (Step 2)
app.post('/api/applications', (req, res) => {
  const {
    userId,
    fullName,
    instagramUsername,
    instagramProfileLink,
    followerCount,
    category,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }
  if (!fullName || !instagramUsername || !instagramProfileLink || followerCount === undefined || !category) {
    return res.status(400).json({ error: 'All profile fields are required.' });
  }

  const user = db.users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  // 1. Regex validation of Instagram handle and profile link
  const validation = extractAndValidateInstagram(instagramUsername, instagramProfileLink);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  // 2. Unique Instagram Username constraint
  for (const [pUserId, existingProf] of db.profiles.entries()) {
    if (pUserId !== userId && existingProf.instagramUsername.toLowerCase() === validation.cleanUsername.toLowerCase()) {
      return res.status(409).json({
        error: `The Instagram username '@${validation.cleanUsername}' is already registered with another application. Each creator must submit their unique profile.`,
      });
    }
  }

  // 3. Unique Email constraint
  for (const [pUserId, existingProf] of db.profiles.entries()) {
    if (pUserId !== userId) {
      const otherUser = db.users.get(pUserId);
      if (otherUser && otherUser.email.toLowerCase() === user.email.toLowerCase()) {
        return res.status(409).json({
          error: `An application has already been submitted under email ${user.email}. Duplicate submissions for the same email address are not permitted.`,
        });
      }
    }
  }

  const existing = db.profiles.get(userId);

  // If already activated, preserve activation and payment, but update profile details
  const isCurrentlyActivated = existing ? existing.isActivated : false;
  const currentPaymentId = existing?.paymentId;
  const currentPaidAt = existing?.paidAt;

  // New application or re-review
  const newProfile: CreatorProfile = {
    id: existing ? existing.id : 'prof_' + Math.random().toString(36).substring(2, 9),
    userId,
    fullName: String(fullName).trim(),
    instagramUsername: validation.cleanUsername,
    instagramProfileLink: validation.cleanLink,
    followerCount: Number(followerCount) || 0,
    category: category as ContentCategory,
    // If it was already activated, keep Approved; otherwise transition to Pending review
    applicationStatus: isCurrentlyActivated ? 'Approved' : 'Pending',
    isActivated: isCurrentlyActivated,
    paymentId: currentPaymentId,
    paidAt: currentPaidAt,
    adminFeedback: isCurrentlyActivated ? existing?.adminFeedback : undefined,
    rejectionReason: undefined,
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.profiles.set(userId, newProfile);
  res.json({ profile: newProfile });
});

// Admin Review Mutation (Step 4)
app.post('/api/admin/review', (req, res) => {
  const { profileId, status, adminFeedback, rejectionReason } = req.body;

  if (!profileId || !status) {
    return res.status(400).json({ error: 'profileId and status are required.' });
  }
  if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be Approved, Rejected, or Pending.' });
  }

  // Find profile
  let targetProfile: CreatorProfile | undefined;
  for (const prof of db.profiles.values()) {
    if (prof.id === profileId) {
      targetProfile = prof;
      break;
    }
  }

  if (!targetProfile) {
    return res.status(404).json({ error: 'Application profile not found.' });
  }

  targetProfile.applicationStatus = status as ApplicationStatus;
  targetProfile.updatedAt = new Date().toISOString();

  if (status === 'Rejected') {
    const finalReason = rejectionReason || adminFeedback || 'Application did not meet audience engagement or content quality criteria.';
    targetProfile.rejectionReason = finalReason;
    targetProfile.adminFeedback = finalReason;
    targetProfile.isActivated = false;
  } else if (status === 'Approved') {
    targetProfile.adminFeedback = adminFeedback || 'Application meets all community baselines and verification criteria.';
    targetProfile.rejectionReason = undefined;
  } else {
    targetProfile.adminFeedback = adminFeedback || 'Application is under verification review.';
    targetProfile.rejectionReason = undefined;
  }

  db.profiles.set(targetProfile.userId, targetProfile);

  res.json({ success: true, profile: targetProfile });
});

// --- HARD PAYMENT GUARD ARCHITECTURE ---
// POST /api/payment/create-order
// Fetch User Record from DB -> Is applicationStatus == 'Approved'?
// NO  -> Return HTTP 403 Forbidden ("Application not approved")
// YES -> Generate Razorpay Order ID (Amount: ₹49 / 4900 paise)
app.post('/api/payment/create-order', (req, res) => {
  const { userId, profileId } = req.body;

  let profile: CreatorProfile | undefined;
  if (userId) {
    profile = db.profiles.get(userId);
  } else if (profileId) {
    for (const p of db.profiles.values()) {
      if (p.id === profileId) {
        profile = p;
        break;
      }
    }
  }

  if (!profile) {
    return res.status(404).json({ error: 'Creator profile not found.' });
  }

  // HARD SECURITY GUARD:
  if (profile.applicationStatus !== 'Approved') {
    return res.status(403).json({
      error: 'Forbidden: Payment creation is strictly blocked. Application status must be "Approved". Current status is: ' + profile.applicationStatus,
      status: profile.applicationStatus,
    });
  }

  if (profile.isActivated) {
    return res.status(400).json({
      error: 'Profile is already activated. Payment was previously completed.',
    });
  }

  // Generate simulated Razorpay Order
  const orderId = 'order_' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Store order record in database for webhook reconciliation
  db.orders.set(orderId, {
    orderId,
    profileId: profile.id,
    userId: profile.userId,
    amount: 4900,
    currency: 'INR',
    status: 'created',
    createdAt: new Date().toISOString(),
  });

  res.json({
    orderId,
    amount: 4900, // 4900 paise = ₹49.00
    currency: 'INR',
    keyId: 'rzp_test_creatorbridge_live_preview',
    profileId: profile.id,
    creatorName: profile.fullName,
    description: 'Creator Bridge Platform One-Time Verification & Activation Fee',
  });
});

// POST /api/payment/verify
// Verifies order & marks profile as activated
app.post('/api/payment/verify', (req, res) => {
  const { userId, profileId, razorpayPaymentId, razorpayOrderId } = req.body;

  let profile: CreatorProfile | undefined;
  if (userId) {
    profile = db.profiles.get(userId);
  } else if (profileId) {
    for (const p of db.profiles.values()) {
      if (p.id === profileId) {
        profile = p;
        break;
      }
    }
  }

  if (!profile) {
    return res.status(404).json({ error: 'Creator profile not found.' });
  }

  // Server-side status check
  if (profile.applicationStatus !== 'Approved') {
    return res.status(403).json({
      error: 'Security Guard Violation: Cannot activate unapproved profile.',
    });
  }

  const paymentId = razorpayPaymentId || 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase();

  profile.isActivated = true;
  profile.paymentId = paymentId;
  profile.paidAt = new Date().toISOString();
  profile.updatedAt = new Date().toISOString();

  if (razorpayOrderId && db.orders.has(razorpayOrderId)) {
    const orderRecord = db.orders.get(razorpayOrderId)!;
    orderRecord.status = 'paid';
  }

  db.profiles.set(profile.userId, profile);

  res.json({
    success: true,
    message: 'Creator Account Activated Successfully!',
    profile,
  });
});

// --- RAZORPAY SERVER-SIDE WEBHOOK HANDLER ---
// Listens for payment.captured or order.paid events
// Automatically updates creator profile to "Active" (isActivated: true)
app.post('/api/payment/webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string | undefined;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Verify HMAC SHA256 signature if secret and signature are provided
  if (webhookSecret && signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid Razorpay webhook signature.' });
      }
    } catch {
      return res.status(400).json({ error: 'Webhook signature verification failed.' });
    }
  }

  const { event, payload } = req.body;
  if (!event) {
    return res.status(400).json({ error: 'Missing webhook event.' });
  }

  // Check supported events
  if (event !== 'payment.captured' && event !== 'order.paid') {
    return res.json({ status: 'ignored', message: `Event '${event}' is not actionable.` });
  }

  const paymentEntity = payload?.payment?.entity;
  const orderEntity = payload?.order?.entity;
  const orderId = paymentEntity?.order_id || orderEntity?.id;
  const paymentId = paymentEntity?.id || 'pay_wh_' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const notes = paymentEntity?.notes || orderEntity?.notes || {};

  // Locate target profile
  let targetProfile: CreatorProfile | undefined;

  // 1. Try order registry
  if (orderId && db.orders.has(orderId)) {
    const orderRecord = db.orders.get(orderId)!;
    targetProfile = db.profiles.get(orderRecord.userId);
    orderRecord.status = 'paid';
  }

  // 2. Try notes.profileId or notes.userId
  if (!targetProfile && notes.profileId) {
    for (const p of db.profiles.values()) {
      if (p.id === notes.profileId) {
        targetProfile = p;
        break;
      }
    }
  }

  if (!targetProfile && notes.userId) {
    targetProfile = db.profiles.get(notes.userId);
  }

  // 3. Fallback: if profileId was passed in payload directly
  if (!targetProfile && req.body.profileId) {
    for (const p of db.profiles.values()) {
      if (p.id === req.body.profileId) {
        targetProfile = p;
        break;
      }
    }
  }

  if (!targetProfile) {
    return res.status(404).json({ error: 'No matching creator profile found for this payment webhook event.' });
  }

  // Check creator status - must be Approved
  if (targetProfile.applicationStatus !== 'Approved') {
    return res.status(403).json({
      error: `Security Guard: Cannot activate creator with status '${targetProfile.applicationStatus}'.`,
      status: targetProfile.applicationStatus,
    });
  }

  // Automatically activate profile!
  targetProfile.isActivated = true;
  targetProfile.paymentId = paymentId;
  targetProfile.paidAt = new Date().toISOString();
  targetProfile.updatedAt = new Date().toISOString();
  db.profiles.set(targetProfile.userId, targetProfile);

  console.log(`[Razorpay Webhook] Successfully activated creator: ${targetProfile.fullName} (${targetProfile.id}) via ${event}`);

  res.json({
    status: 'ok',
    event,
    received: true,
    activatedProfileId: targetProfile.id,
    creatorName: targetProfile.fullName,
    paymentId,
    message: 'Creator status automatically updated to Active via Razorpay webhook.',
  });
});

// Test/Simulation endpoint for Razorpay Webhook
app.post('/api/payment/simulate-webhook', (req, res) => {
  const { profileId, event = 'payment.captured' } = req.body;

  if (!profileId) {
    return res.status(400).json({ error: 'profileId is required to simulate webhook.' });
  }

  let profile: CreatorProfile | undefined;
  for (const p of db.profiles.values()) {
    if (p.id === profileId) {
      profile = p;
      break;
    }
  }

  if (!profile) {
    return res.status(404).json({ error: 'Creator profile not found.' });
  }

  if (profile.applicationStatus !== 'Approved') {
    return res.status(403).json({
      error: `Security Guard Violation: Cannot activate creator with status '${profile.applicationStatus}'. Creator must be in Approved state.`,
    });
  }

  const simOrderId = 'order_wh_' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const simPaymentId = 'pay_wh_' + Math.random().toString(36).substring(2, 12).toUpperCase();

  profile.isActivated = true;
  profile.paymentId = simPaymentId;
  profile.paidAt = new Date().toISOString();
  profile.updatedAt = new Date().toISOString();
  db.profiles.set(profile.userId, profile);

  res.json({
    success: true,
    message: `Razorpay Webhook event '${event}' simulated and processed successfully! Creator ${profile.fullName} is now Active.`,
    profile,
    webhookPayload: {
      event,
      payload: {
        payment: {
          entity: {
            id: simPaymentId,
            order_id: simOrderId,
            amount: 4900,
            status: 'captured',
            notes: { profileId: profile.id, userId: profile.userId },
          },
        },
      },
    },
  });
});

// Brand Opportunities endpoints
app.get('/api/opportunities', (req, res) => {
  const { category, search } = req.query;
  let opps = [...db.opportunities];

  if (category && typeof category === 'string' && category !== 'All') {
    opps = opps.filter((o) => o.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    opps = opps.filter((o) => o.title.toLowerCase().includes(q) || o.brandName.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
  }

  res.json({ opportunities: opps });
});

app.post('/api/opportunities', (req, res) => {
  const { title, brandName, category, description, budgetRange, deliverables, deadline } = req.body;

  if (!title || !brandName || !category || !description || !budgetRange) {
    return res.status(400).json({ error: 'Required opportunity fields missing.' });
  }

  const newOpp: CampaignOpportunity = {
    id: 'opp-' + Math.random().toString(36).substring(2, 9),
    title: String(title).trim(),
    brandName: String(brandName).trim(),
    category: category as ContentCategory,
    description: String(description).trim(),
    budgetRange: String(budgetRange).trim(),
    deliverables: deliverables ? String(deliverables).trim() : '1 Dedicated Video + 1 Story Set',
    deadline: deadline ? String(deadline).trim() : '2026-11-30',
    status: 'Open',
    createdAt: new Date().toISOString(),
  };

  db.opportunities.unshift(newOpp);
  res.json({ success: true, opportunity: newOpp });
});

// Seed/Reset test data
app.post('/api/admin/seed-demo', (req, res) => {
  seedInitialData();
  res.json({
    success: true,
    message: 'Demo dataset reset with Pending, Approved, Rejected, and Activated profiles.',
  });
});

// --- VITE & STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Creator Bridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
