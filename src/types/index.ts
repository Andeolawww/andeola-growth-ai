export type NavigationTab =
  | 'overview'
  | 'analyzer'
  | 'icp'
  | 'find-leads'
  | 'saved-leads'
  | 'campaigns'
  | 'inbox'
  | 'analytics'
  | 'billing'
  | 'settings';

export interface BusinessAnalysis {
  businessName: string;
  url: string;
  industry: string;
  businessModel: string;
  productsServices: string[];
  targetMarket: string;
  valueProposition: string;
  whatItSells: string;
  whoBuysIt: string;
  customerPainPoints: string[];
  marketOpportunities: string[];
  recommendedProspectTypes: string[];
  source?: string;
}

export interface IdealCustomerProfile {
  title: string;
  summary: string;
  industries: string[];
  companySizes: string[];
  targetCountries: string[];
  buyerRoles: string[];
  budget: string;
  painPoints: string[];
  buyingSignals: string[];
  interests: string[];
  recommendedMarkets: string[];
}

export interface Lead {
  id: string;
  company: string;
  contact: string;
  role: string;
  industry: string;
  country: string;
  matchScore: number;
  website: string;
  email: string;
  employees: string;
  revenue: string;
  techStack: string[];
  description: string;
  potentialPainPoints: string[];
  whyMatches: string;
  status: 'new' | 'saved' | 'contacted' | 'replied';
  avatar?: string;
  founded?: string;
}

export interface OutreachMessage {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  role: string;
  channel: 'email' | 'linkedin' | 'dm';
  tone: 'professional' | 'friendly' | 'direct' | 'consultative';
  subject?: string;
  opening: string;
  observation: string;
  valueProp: string;
  callToAction: string;
  fullText: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'email' | 'linkedin' | 'multichannel';
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  leadsCount: number;
  messagesGenerated: number;
  messagesSent: number;
  replies: number;
  interested: number;
  meetings: number;
  createdAt: string;
  targetIndustry: string;
  leadIds: string[];
}

export interface AnalyticsData {
  totalLeadsDiscovered: number;
  qualifiedLeads: number;
  messagesGenerated: number;
  messagesSent: number;
  replies: number;
  positiveReplies: number;
  meetings: number;
  conversionRate: number;
  replyRate: number;
  discoveryTimeline: { date: string; leads: number; contacted: number }[];
  campaignPerformance: { name: string; sent: number; replies: number; meetings: number }[];
  qualityDistribution: { tier: string; percentage: number; count: number; color: string }[];
  funnelStages: { stage: string; count: number; rate: string }[];
}

export interface LeadFilters {
  industry: string;
  country: string;
  companySize: string;
  jobRole: string;
  revenue: string;
  keyword: string;
  minScore: number;
}

export interface BuyerReply {
  id: string;
  leadId: string;
  contactName: string;
  companyName: string;
  contactEmail: string;
  contactRole: string;
  campaignName: string;
  channel: 'email' | 'linkedin';
  receivedAt: string;
  subject: string;
  snippet: string;
  fullMessage: string;
  sentMessageText?: string;
  sentiment: 'Interested' | 'Meeting Requested' | 'More Info' | 'Not Right Now';
  isRead: boolean;
  repliedBack?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  company: string;
  website: string;
  plan: 'Free Trial' | 'Starter' | 'Growth' | 'Scale';
  leadCredits: number;
  leadCreditsMax: number;
  freeTrialLeadsUsed: number;
  freeTrialLeadsMax: number;
  analysesCount: number;
  analysesMax: number;
  messagesGenerated: number;
  messagesMax: number;
  replyNotificationEmail?: string;
  emailNotificationsEnabled?: boolean;
}
