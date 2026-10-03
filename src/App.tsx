/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { AuthModal } from './components/auth/AuthModal';
import { ToastProvider, useToast } from './context/ToastContext';
import {
  INITIAL_USER,
  DEFAULT_BUSINESS_ANALYSIS,
  DEFAULT_ICP,
  MOCK_LEADS,
  MOCK_CAMPAIGNS,
  MOCK_ANALYTICS,
  MOCK_BUYER_REPLIES,
} from './services/mockData';
import {
  analyzeWebsite,
  generateICP,
} from './services/growthApi';
import {
  NavigationTab,
  BusinessAnalysis,
  IdealCustomerProfile,
  Lead,
  Campaign,
  AnalyticsData,
  UserProfile,
  BuyerReply,
} from './types';

function MainApp() {
  const { showToast } = useToast();

  // App View Mode
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Data Store
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [businessAnalysis, setBusinessAnalysis] = useState<BusinessAnalysis>(DEFAULT_BUSINESS_ANALYSIS);
  const [icp, setIcp] = useState<IdealCustomerProfile>(DEFAULT_ICP);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([MOCK_LEADS[0], MOCK_LEADS[2]]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [analytics, setAnalytics] = useState<AnalyticsData>(MOCK_ANALYTICS);
  const [replies, setReplies] = useState<BuyerReply[]>(MOCK_BUYER_REPLIES);

  // Handlers
  const handleOpenSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (userInfo: { name: string; email: string }) => {
    setUser((prev) => ({
      ...prev,
      name: userInfo.name,
      email: userInfo.email,
    }));
    setViewMode('dashboard');
    setActiveTab('overview');
  };

  const handleAnalyzeFromLanding = async (url: string) => {
    setViewMode('dashboard');
    setActiveTab('analyzer');
    try {
      const result = await analyzeWebsite(url);
      setBusinessAnalysis(result);
      const newIcp = await generateICP(result);
      setIcp(newIcp);
      showToast('Website Analyzed', `Extracted business model and ICP for ${result.businessName}`);
    } catch (err) {
      showToast('Loaded Analysis', 'Populated intelligence profile');
    }
  };

  const handleAnalyzeWebsite = async (url: string) => {
    const result = await analyzeWebsite(url);
    setBusinessAnalysis(result);
    setUser((prev) => ({ ...prev, analysesCount: Math.min(prev.analysesMax, prev.analysesCount + 1) }));
    const newIcp = await generateICP(result);
    setIcp(newIcp);
  };

  const handleRegenerateIcp = async () => {
    const newIcp = await generateICP(businessAnalysis);
    setIcp(newIcp);
  };

  const handleSaveLead = (lead: Lead) => {
    if (!savedLeads.some((l) => l.id === lead.id)) {
      setSavedLeads((prev) => [...prev, lead]);
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: 'saved' } : l))
      );
    }
  };

  const handleRemoveSavedLead = (id: string) => {
    setSavedLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCreateCampaign = (campData: Partial<Campaign>) => {
    const newCampaign: Campaign = {
      id: 'camp-' + Date.now(),
      name: campData.name || 'Targeted Outbound Sequence',
      channel: campData.channel || 'email',
      status: 'Active',
      leadsCount: campData.leadsCount || 15,
      messagesGenerated: campData.messagesGenerated || 15,
      messagesSent: campData.messagesSent || 1,
      replies: 0,
      interested: 0,
      meetings: 0,
      createdAt: new Date().toISOString().split('T')[0],
      targetIndustry: campData.targetIndustry || 'European Retail & Boutiques',
      leadIds: campData.leadIds || [],
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setUser((prev) => ({
      ...prev,
      messagesGenerated: Math.min(prev.messagesMax, prev.messagesGenerated + (campData.messagesGenerated || 15)),
    }));
  };

  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
          showToast(
            nextStatus === 'Active' ? 'Campaign Resumed' : 'Campaign Paused',
            `Sequence "${c.name}" is now ${nextStatus.toLowerCase()}`
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const handleMarkReplyAsRead = (replyId: string) => {
    setReplies((prev) =>
      prev.map((r) => (r.id === replyId ? { ...r, isRead: true } : r))
    );
  };

  const handleSendReplyBack = (replyId: string, text: string) => {
    setReplies((prev) =>
      prev.map((r) =>
        r.id === replyId ? { ...r, repliedBack: true, isRead: true } : r
      )
    );
  };

  const handleSimulateNewReply = () => {
    const demoSenders = [
      {
        name: 'Jessica Taylor',
        company: 'Brighton Shore Goods',
        role: 'Owner & Buyer',
        email: 'jessica@brightonshore.co.uk',
        leadId: 'lead-23',
        campaign: 'UK Independent Fashion Outlets',
        snippet: 'Hi Andeola, we love your sustainable organic collection! Can you ship 200 units to Brighton?',
        full: 'Hi Andeola,\n\nWe received your outreach note and reviewed your catalog with our merchandising team. We love the minimalist aesthetic and verified organic cotton certifications!\n\nCould we order a trial batch of 200 units for our Brighton coastal flagship before the bank holiday? What are your delivery lead times?\n\nWarm regards,\nJessica Taylor\nOwner & Buyer, Brighton Shore Goods',
        sentiment: 'Interested' as const,
      },
      {
        name: 'Felix Becker',
        company: 'Koppen Collective',
        role: 'Founder',
        email: 'felix@koppencollective.de',
        leadId: 'lead-22',
        campaign: 'DACH Retail Partners',
        snippet: 'Hey Andeola, thanks for the intro! Let us schedule a 15-min call this week.',
        full: 'Hey Andeola,\n\nThanks for reaching out! We are currently stocking our autumn concept showroom in Cologne and your ethical outerwear looks like an ideal fit.\n\nLet’s do a quick 15-minute call on Wednesday at 11:00 AM CET. Does that work for you?\n\nBest,\nFelix Becker\nFounder, Koppen Collective',
        sentiment: 'Meeting Requested' as const,
      },
    ];

    const pick = demoSenders[Math.floor(Math.random() * demoSenders.length)];
    const newReply: BuyerReply = {
      id: 'reply-' + Date.now(),
      leadId: pick.leadId,
      contactName: pick.name,
      companyName: pick.company,
      contactEmail: pick.email,
      contactRole: pick.role,
      campaignName: pick.campaign,
      channel: 'email',
      receivedAt: 'Just now',
      subject: `Re: Partnership inquiry regarding ${pick.company}`,
      snippet: pick.snippet,
      fullMessage: pick.full,
      sentMessageText: `Hi ${pick.name}, reaching out to explore wholesale collaboration with ${pick.company}.`,
      sentiment: pick.sentiment,
      isRead: false,
      repliedBack: false,
    };

    setReplies((prev) => [newReply, ...prev]);

    // Live In-Website Toast and Notification Alert
    showToast(
      `🔔 New Buyer Reply from ${pick.name}!`,
      `"${pick.snippet.slice(0, 70)}..." • Alert dispatched to: ${user.replyNotificationEmail || user.email || 'webhubtech299@gmail.com'}`
    );
  };

  const handleSignOut = () => {
    setViewMode('landing');
    showToast('Signed Out', 'You have been safely returned to the landing page.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {viewMode === 'landing' ? (
        <LandingPage
          onGetStarted={handleOpenSignUp}
          onSignIn={handleOpenSignIn}
          onAnalyzeUrl={handleAnalyzeFromLanding}
        />
      ) : (
        <DashboardLayout
          user={user}
          businessAnalysis={businessAnalysis}
          icp={icp}
          leads={leads}
          savedLeads={savedLeads}
          campaigns={campaigns}
          analytics={analytics}
          replies={replies}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onAnalyzeWebsite={handleAnalyzeWebsite}
          onRegenerateIcp={handleRegenerateIcp}
          onSaveLead={handleSaveLead}
          onRemoveSavedLead={handleRemoveSavedLead}
          onCreateCampaign={handleCreateCampaign}
          onToggleCampaignStatus={handleToggleCampaignStatus}
          onUpdateUser={handleUpdateUser}
          onMarkReplyAsRead={handleMarkReplyAsRead}
          onSendReplyBack={handleSendReplyBack}
          onSimulateNewReply={handleSimulateNewReply}
          onSignOut={handleSignOut}
          onViewLanding={() => setViewMode('landing')}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
