export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export type ContentCategory =
  | 'Gaming'
  | 'Technology'
  | 'Music'
  | 'Dance'
  | 'Education'
  | 'Entertainment'
  | 'Others';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'creator' | 'admin';
}

export interface CreatorProfile {
  id: string;
  userId: string;
  fullName: string;
  instagramUsername: string;
  instagramProfileLink: string;
  followerCount: number;
  category: ContentCategory;
  applicationStatus: ApplicationStatus;
  isActivated: boolean;
  paymentId?: string;
  paidAt?: string;
  adminFeedback?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignOpportunity {
  id: string;
  title: string;
  brandName: string;
  category: ContentCategory;
  description: string;
  budgetRange: string;
  status: 'Open' | 'Closed';
  deliverables?: string;
  deadline?: string;
  createdAt: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  profileId: string;
}
