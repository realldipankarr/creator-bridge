import type {
  ApplicationStatus,
  CampaignOpportunity,
  ContentCategory,
  CreatorProfile,
  RazorpayOrderResponse,
  User,
} from '../types.ts';

let activeSessionToken: string | null = null;

export function setSessionToken(token: string | null): void {
  activeSessionToken = token;
  if (token) {
    try {
      localStorage.setItem('cb_session_token', token);
    } catch {}
  } else {
    try {
      localStorage.removeItem('cb_session_token');
    } catch {}
  }
}

export function getSessionToken(): string | null {
  if (activeSessionToken) return activeSessionToken;
  try {
    const saved = localStorage.getItem('cb_session_token');
    if (saved) {
      activeSessionToken = saved;
      return saved;
    }
  } catch {}
  return null;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginWithGoogle(
  email: string,
  name?: string,
  avatar?: string,
  role: 'creator' | 'admin' = 'creator',
): Promise<{ user: User; profile: CreatorProfile | null; token?: string }> {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, avatar, role }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to authenticate with Google');
  }
  const data = await res.json();
  if (data.token) {
    setSessionToken(data.token);
  } else if (data.user?.token) {
    setSessionToken(data.user.token);
  }
  return data;
}

export async function fetchUserById(
  userId: string,
): Promise<{ user: User; profile: CreatorProfile | null }> {
  const res = await fetch(`/api/users/${encodeURIComponent(userId)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
}

export async function fetchProfileByUserId(
  userId: string,
): Promise<{ profile: CreatorProfile | null }> {
  const res = await fetch(`/api/applications/user/${encodeURIComponent(userId)}`);
  if (res.status === 404) {
    return { profile: null };
  }
  if (!res.ok) {
    throw new Error('Failed to fetch creator profile');
  }
  return res.json();
}

export async function submitProfile(data: {
  userId: string;
  fullName: string;
  instagramUsername: string;
  instagramProfileLink: string;
  followerCount: number;
  category: ContentCategory;
}): Promise<{ profile: CreatorProfile }> {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit profile for review');
  }
  return res.json();
}

export async function fetchApplications(
  status?: string,
  category?: string,
  search?: string,
): Promise<{ applications: CreatorProfile[] }> {
  const params = new URLSearchParams();
  if (status && status !== 'All') params.set('status', status);
  if (category && category !== 'All') params.set('category', category);
  if (search) params.set('search', search);

  const res = await fetch(`/api/applications?${params.toString()}`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch applications (Admin access required)');
  }
  return res.json();
}

export async function reviewApplication(
  profileId: string,
  status: 'Approved' | 'Rejected' | 'Pending',
  adminFeedback?: string,
  rejectionReason?: string,
): Promise<{ success: boolean; profile: CreatorProfile }> {
  const res = await fetch('/api/admin/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ profileId, status, adminFeedback, rejectionReason }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to review application');
  }
  return res.json();
}

export async function simulateRazorpayWebhook(
  profileId: string,
  event: 'payment.captured' | 'order.paid' = 'payment.captured',
): Promise<{ success: boolean; message: string; profile: CreatorProfile }> {
  const res = await fetch('/api/payment/simulate-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ profileId, event }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to simulate Razorpay webhook');
  }
  return res.json();
}

export async function createPaymentOrder(
  userId?: string,
  profileId?: string,
): Promise<RazorpayOrderResponse> {
  const res = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, profileId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Server Guard: Payment locked (Status ${res.status})`);
  }
  return res.json();
}

export async function verifyPayment(
  userId: string,
  razorpayPaymentId?: string,
  razorpayOrderId?: string,
): Promise<{ success: boolean; profile: CreatorProfile }> {
  const res = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, razorpayPaymentId, razorpayOrderId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Payment verification failed');
  }
  return res.json();
}

export async function fetchOpportunities(
  category?: string,
  search?: string,
): Promise<{ opportunities: CampaignOpportunity[] }> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.set('category', category);
  if (search) params.set('search', search);

  const res = await fetch(`/api/opportunities?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch opportunities');
  }
  return res.json();
}

export async function createOpportunity(
  data: Partial<CampaignOpportunity>,
): Promise<{ success: boolean; opportunity: CampaignOpportunity }> {
  const res = await fetch('/api/opportunities', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create opportunity');
  }
  return res.json();
}

export async function resetDemoData(): Promise<void> {
  const res = await fetch('/api/admin/seed-demo', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to reset demo data');
  }
}
