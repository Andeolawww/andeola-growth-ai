import {
  BusinessAnalysis,
  IdealCustomerProfile,
  Lead,
  OutreachMessage,
  Campaign,
  AnalyticsData,
  LeadFilters,
} from '../types';
import {
  DEFAULT_BUSINESS_ANALYSIS,
  DEFAULT_ICP,
  MOCK_LEADS,
  MOCK_CAMPAIGNS,
  MOCK_ANALYTICS,
} from './mockData';

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeWebsite(url: string): Promise<BusinessAnalysis> {
  try {
    const res = await fetch('/api/analyze-website', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('API error during website analysis, falling back to local heuristic:', err);
  }

  // Graceful client fallback
  await delay(1200);
  return {
    ...DEFAULT_BUSINESS_ANALYSIS,
    url: url || 'https://examplefashionstore.com',
  };
}

export async function generateICP(businessOverview: BusinessAnalysis): Promise<IdealCustomerProfile> {
  try {
    const res = await fetch('/api/generate-icp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessOverview }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('API error during ICP generation, falling back:', err);
  }

  await delay(1000);
  return DEFAULT_ICP;
}

export async function findLeads(filters: Partial<LeadFilters>): Promise<Lead[]> {
  await delay(600);
  let results = [...MOCK_LEADS];

  if (filters.industry && filters.industry !== 'All') {
    results = results.filter((l) =>
      l.industry.toLowerCase().includes(filters.industry!.toLowerCase())
    );
  }

  if (filters.country && filters.country !== 'All') {
    results = results.filter((l) =>
      l.country.toLowerCase() === filters.country!.toLowerCase()
    );
  }

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    results = results.filter(
      (l) =>
        l.company.toLowerCase().includes(kw) ||
        l.contact.toLowerCase().includes(kw) ||
        l.role.toLowerCase().includes(kw) ||
        l.description.toLowerCase().includes(kw)
    );
  }

  if (filters.minScore) {
    results = results.filter((l) => l.matchScore >= filters.minScore!);
  }

  return results;
}

export function scoreLead(lead: Lead, icp?: IdealCustomerProfile): number {
  if (!icp) return lead.matchScore;
  let score = 75;
  if (icp.targetCountries.some((c) => lead.country.toLowerCase().includes(c.toLowerCase()))) {
    score += 10;
  }
  if (icp.industries.some((i) => lead.industry.toLowerCase().includes(i.toLowerCase()))) {
    score += 8;
  }
  if (icp.buyerRoles.some((r) => lead.role.toLowerCase().includes(r.toLowerCase()))) {
    score += 5;
  }
  return Math.min(score, 99);
}

export async function generateOutreach(params: {
  lead: Lead;
  channel: 'email' | 'linkedin' | 'dm';
  tone: 'professional' | 'friendly' | 'direct' | 'consultative';
  senderCompany?: string;
  valueProposition?: string;
}): Promise<OutreachMessage> {
  try {
    const res = await fetch('/api/generate-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: 'msg-' + Date.now(),
        leadId: params.lead.id,
        leadName: params.lead.contact,
        company: params.lead.company,
        role: params.lead.role,
        channel: params.channel,
        tone: params.tone,
        subject: data.subject,
        opening: data.opening,
        observation: data.observation,
        valueProp: data.valueProp,
        callToAction: data.callToAction,
        fullText: data.fullText,
        createdAt: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('API error during outreach generation, falling back:', err);
  }

  await delay(800);
  const firstName = params.lead.contact.split(' ')[0];
  const subject = `${firstName} — question regarding ${params.lead.company}'s customer growth`;
  const opening = `Hi ${firstName}, noticed your impactful work driving ${params.lead.company}'s market expansion.`;
  const observation = `Given the rapid shifts in ${params.lead.industry}, ensuring a predictable stream of qualified buyers is essential.`;
  const valueProp = `We help teams discover verified high-intent prospects and craft laser-targeted outreach that turns cold lists into warm pipeline.`;
  const callToAction = `Are you open to a quick 12-minute conversation next week?`;

  return {
    id: 'msg-' + Date.now(),
    leadId: params.lead.id,
    leadName: params.lead.contact,
    company: params.lead.company,
    role: params.lead.role,
    channel: params.channel,
    tone: params.tone,
    subject,
    opening,
    observation,
    valueProp,
    callToAction,
    fullText: `${subject}\n\n${opening}\n\n${observation}\n\n${valueProp}\n\n${callToAction}\n\nBest,\nAndeola Team`,
    createdAt: new Date().toISOString(),
  };
}

export async function createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
  await delay(500);
  const newCamp: Campaign = {
    id: 'camp-' + Date.now(),
    name: campaignData.name || 'New AI Outreach Campaign',
    channel: campaignData.channel || 'email',
    status: 'Active',
    leadsCount: campaignData.leadsCount || 12,
    messagesGenerated: campaignData.messagesGenerated || 12,
    messagesSent: campaignData.messagesSent || 0,
    replies: 0,
    interested: 0,
    meetings: 0,
    createdAt: new Date().toISOString().split('T')[0],
    targetIndustry: campaignData.targetIndustry || 'Targeted Prospects',
    leadIds: campaignData.leadIds || [],
  };
  return newCamp;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  await delay(300);
  return MOCK_ANALYTICS;
}

export async function askAiAssistant(message: string, context?: any): Promise<string> {
  try {
    const res = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch (err) {
    console.warn('API error in AI assistant:', err);
  }

  await delay(600);
  return `I'm **Andeola AI**, your outbound sales copilot. Based on your current workspace, you have **1,124 qualified prospects** ready for personalized outreach. I recommend testing an email sequence with a consultative tone for your European retail segment!`;
}
