import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe,
  Plus,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { OverviewView } from './OverviewView';
import { WebsiteAnalyzerView } from './WebsiteAnalyzerView';
import { IcpView } from './IcpView';
import { FindLeadsView } from './FindLeadsView';
import { SavedLeadsView } from './SavedLeadsView';
import { CampaignsView } from './CampaignsView';
import { AnalyticsView } from './AnalyticsView';
import { BillingView } from './BillingView';
import { SettingsView } from './SettingsView';
import { InboxView } from './InboxView';
import { LeadDetailModal } from './LeadDetailModal';
import { OutreachGeneratorModal } from './OutreachGeneratorModal';
import { TrialPaywallModal } from '../common/TrialPaywallModal';
import { AiAssistantDrawer } from '../assistant/AiAssistantDrawer';
import {
  NavigationTab,
  BusinessAnalysis,
  IdealCustomerProfile,
  Lead,
  Campaign,
  AnalyticsData,
  UserProfile,
  OutreachMessage,
  BuyerReply,
} from '../../types';
import { useToast } from '../../context/ToastContext';

interface DashboardLayoutProps {
  user: UserProfile;
  businessAnalysis: BusinessAnalysis;
  icp: IdealCustomerProfile;
  leads: Lead[];
  savedLeads: Lead[];
  campaigns: Campaign[];
  analytics: AnalyticsData;
  replies: BuyerReply[];
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onAnalyzeWebsite: (url: string) => Promise<void>;
  onRegenerateIcp: () => Promise<void>;
  onSaveLead: (lead: Lead) => void;
  onRemoveSavedLead: (id: string) => void;
  onCreateCampaign: (campaign: Partial<Campaign>) => void;
  onToggleCampaignStatus: (id: string) => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onMarkReplyAsRead: (replyId: string) => void;
  onSendReplyBack: (replyId: string, text: string) => void;
  onSimulateNewReply: () => void;
  onSignOut: () => void;
  onViewLanding: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  businessAnalysis,
  icp,
  leads,
  savedLeads,
  campaigns,
  analytics,
  replies,
  activeTab,
  onSelectTab,
  onAnalyzeWebsite,
  onRegenerateIcp,
  onSaveLead,
  onRemoveSavedLead,
  onCreateCampaign,
  onToggleCampaignStatus,
  onUpdateUser,
  onMarkReplyAsRead,
  onSendReplyBack,
  onSimulateNewReply,
  onSignOut,
  onViewLanding,
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);
  const [selectedLeadForOutreach, setSelectedLeadForOutreach] = useState<Lead | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { showToast } = useToast();

  const isFreeTrial = user.plan === 'Free Trial';
  const trialLimitReached = isFreeTrial && user.freeTrialLeadsUsed >= user.freeTrialLeadsMax;
  const unreadRepliesCount = replies.filter((r) => !r.isRead).length;

  const handleOpenLeadDetail = (lead: Lead) => {
    setSelectedLeadForDetail(lead);
  };

  const handleOpenOutreach = (lead: Lead) => {
    if (trialLimitReached) {
      setIsPaywallOpen(true);
      return;
    }
    setSelectedLeadForDetail(null);
    setSelectedLeadForOutreach(lead);
  };

  const handleSendEverythingTo20Leads = () => {
    const top20 = leads.slice(0, 20);
    // Add all 20 to saved leads
    top20.forEach((l) => onSaveLead(l));

    // Create a 20-lead campaign and dispatch
    onCreateCampaign({
      name: 'First 20 Prospects AI Outreach',
      channel: 'email',
      status: 'Active',
      leadsCount: 20,
      messagesGenerated: 20,
      messagesSent: 20,
      targetIndustry: top20[0]?.industry || 'Retail & Ecommerce',
      leadIds: top20.map((l) => l.id),
    });

    onUpdateUser({
      freeTrialLeadsUsed: 20,
      leadCredits: 0,
      messagesGenerated: user.messagesGenerated + 20,
    });

    showToast(
      'Outreach Sent to All 20 Leads! 🎉',
      'Personalized messages dispatched. All 20 free trial leads processed.'
    );

    // Open paywall dialog so user can upgrade
    setTimeout(() => {
      setIsPaywallOpen(true);
    }, 1000);
  };

  const handleAddToCampaignFromOutreach = (lead: Lead, msg: OutreachMessage) => {
    if (trialLimitReached) {
      setIsPaywallOpen(true);
      return;
    }
    onCreateCampaign({
      name: `${lead.company} Outreach Sequence`,
      channel: msg.channel === 'dm' ? 'email' : msg.channel,
      status: 'Active',
      leadsCount: 1,
      messagesGenerated: 1,
      messagesSent: 1,
      targetIndustry: lead.industry,
      leadIds: [lead.id],
    });

    if (isFreeTrial) {
      onUpdateUser({
        freeTrialLeadsUsed: Math.min(20, user.freeTrialLeadsUsed + 1),
        leadCredits: Math.max(0, user.leadCredits - 1),
      });
    }

    showToast('Added to Campaign', `Launched sequence for ${lead.contact} at ${lead.company}`);
  };

  const handleBatchAddToCampaign = (batchLeads: Lead[]) => {
    onCreateCampaign({
      name: `Multi-Account Sequence (${batchLeads.length} leads)`,
      channel: 'email',
      status: 'Active',
      leadsCount: batchLeads.length,
      messagesGenerated: batchLeads.length,
      messagesSent: 1,
      targetIndustry: batchLeads[0]?.industry || 'Targeted Accounts',
      leadIds: batchLeads.map((l) => l.id),
    });
    showToast('Campaign Created', `Enrolled ${batchLeads.length} accounts into new outreach sequence.`);
  };

  const pageTitles: Record<NavigationTab, string> = {
    overview: 'Workspace Overview',
    analyzer: 'AI Website Analyzer',
    icp: 'Ideal Customer Profile',
    'find-leads': 'Find Leads',
    'saved-leads': 'Saved Lead Lists',
    campaigns: 'Campaigns & Cadence',
    inbox: 'Buyer Replies & Inbound Inbox',
    analytics: 'Analytics & Insights',
    billing: 'Billing & Quotas',
    settings: 'Settings & Integrations',
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        user={user}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onSignOut={onSignOut}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        unreadRepliesCount={unreadRepliesCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpenMobile(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-semibold">{pageTitles[activeTab]}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Free Trial Status & Upgrade Button */}
            {isFreeTrial && (
              <button
                onClick={() => setIsPaywallOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 text-xs text-blue-300 font-semibold cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Trial: <strong className="text-white font-mono">{user.freeTrialLeadsUsed}/20</strong> leads
                </span>
                {trialLimitReached ? (
                  <span className="ml-1 text-[10px] uppercase font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded shadow-sm">
                    Upgrade to Pay
                  </span>
                ) : (
                  <span className="ml-1 text-[10px] text-emerald-400 font-bold">
                    Free
                  </span>
                )}
              </button>
            )}

            {/* Quick Website Switcher Shortcut */}
            <button
              onClick={() => onSelectTab('analyzer')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-[11px] truncate max-w-[140px]">
                {businessAnalysis.url.replace('https://', '')}
              </span>
            </button>

            {/* View landing page preview */}
            <button
              onClick={onViewLanding}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* Interactive Live Buyer Reply Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors relative cursor-pointer"
                title="Buyer Reply Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadRepliesCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center animate-pulse shadow-md shadow-rose-950">
                    {unreadRepliesCount}
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Buyer Reply Alerts
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Routed to: {user.replyNotificationEmail || 'webhubtech299@gmail.com'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onSelectTab('inbox');
                        setIsNotificationsOpen(false);
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      View Inbox →
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {replies.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        onClick={() => {
                          onMarkReplyAsRead(r.id);
                          onSelectTab('inbox');
                          setIsNotificationsOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          !r.isRead
                            ? 'bg-blue-950/30 border-blue-500/40 hover:bg-blue-950/50'
                            : 'bg-slate-950 border-slate-800/80 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            {!r.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                            {r.contactName} ({r.companyName})
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{r.receivedAt}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-1">{r.snippet}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        onSimulateNewReply();
                        setIsNotificationsOpen(false);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      + Simulate New Buyer Reply
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Viewport Content with Scroll */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewView
              analytics={analytics}
              recentLeads={leads}
              activeCampaigns={campaigns}
              user={user}
              onSendEverythingTo20Leads={handleSendEverythingTo20Leads}
              onOpenPaywall={() => setIsPaywallOpen(true)}
              onNavigate={onSelectTab}
              onSelectLead={handleOpenLeadDetail}
              onAnalyzeUrl={async (url) => {
                await onAnalyzeWebsite(url);
                onSelectTab('analyzer');
              }}
            />
          )}

          {activeTab === 'analyzer' && (
            <WebsiteAnalyzerView
              analysis={businessAnalysis}
              onAnalyze={onAnalyzeWebsite}
              onGoToIcp={() => onSelectTab('icp')}
              onGoToFindLeads={() => onSelectTab('find-leads')}
            />
          )}

          {activeTab === 'icp' && (
            <IcpView
              icp={icp}
              businessAnalysis={businessAnalysis}
              onFindMatchingLeads={() => onSelectTab('find-leads')}
              onRegenerateIcp={onRegenerateIcp}
            />
          )}

          {activeTab === 'find-leads' && (
            <FindLeadsView
              leads={leads}
              savedLeadIds={savedLeads.map((l) => l.id)}
              user={user}
              onSelectLead={handleOpenLeadDetail}
              onSaveLead={onSaveLead}
              onGenerateMessage={handleOpenOutreach}
              onAddToCampaign={(lead) => handleOpenOutreach(lead)}
              onBatchAddToCampaign={handleBatchAddToCampaign}
              onSendEverythingTo20Leads={handleSendEverythingTo20Leads}
              onOpenPaywall={() => setIsPaywallOpen(true)}
            />
          )}

          {activeTab === 'saved-leads' && (
            <SavedLeadsView
              savedLeads={savedLeads}
              onRemoveSavedLead={onRemoveSavedLead}
              onSelectLead={handleOpenLeadDetail}
              onGenerateMessage={handleOpenOutreach}
              onAddToCampaign={(lead) => handleOpenOutreach(lead)}
              onNavigateToFindLeads={() => onSelectTab('find-leads')}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsView
              campaigns={campaigns}
              savedLeads={savedLeads}
              onCreateCampaign={onCreateCampaign}
              onToggleCampaignStatus={onToggleCampaignStatus}
            />
          )}

          {activeTab === 'inbox' && (
            <InboxView
              replies={replies}
              user={user}
              onUpdateUser={onUpdateUser}
              onMarkAsRead={onMarkReplyAsRead}
              onSendReplyBack={onSendReplyBack}
              onSimulateNewReply={onSimulateNewReply}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView analytics={analytics} />}

          {activeTab === 'billing' && (
            <BillingView
              user={user}
              onUpdatePlan={(plan) => {
                onUpdateUser({
                  plan,
                  leadCredits: plan === 'Starter' ? 500 : plan === 'Growth' ? 2500 : 10000,
                  leadCreditsMax: plan === 'Starter' ? 500 : plan === 'Growth' ? 2500 : 10000,
                });
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView user={user} onUpdateUser={onUpdateUser} />
          )}
        </main>
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLeadForDetail}
        isOpen={!!selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        onSaveLead={onSaveLead}
        onGenerateOutreach={handleOpenOutreach}
        isSaved={selectedLeadForDetail ? savedLeads.some((l) => l.id === selectedLeadForDetail.id) : false}
        isLocked={
          selectedLeadForDetail
            ? isFreeTrial && (leads.findIndex((l) => l.id === selectedLeadForDetail.id) >= 20 || trialLimitReached)
            : false
        }
        onOpenPaywall={() => setIsPaywallOpen(true)}
      />

      {/* AI Outreach Generator Modal */}
      <OutreachGeneratorModal
        lead={selectedLeadForOutreach}
        isOpen={!!selectedLeadForOutreach}
        onClose={() => setSelectedLeadForOutreach(null)}
        onAddToCampaign={handleAddToCampaignFromOutreach}
      />

      {/* Trial Paywall Modal (20 Leads Limit & Upgrade) */}
      <TrialPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSelectPlan={(plan) => {
          onUpdateUser({
            plan,
            leadCredits: plan === 'Starter' ? 500 : plan === 'Growth' ? 2500 : 10000,
            leadCreditsMax: plan === 'Starter' ? 500 : plan === 'Growth' ? 2500 : 10000,
          });
        }}
        leadsProcessedCount={user.freeTrialLeadsUsed}
      />

      {/* Floating Context-Aware AI Assistant */}
      <AiAssistantDrawer
        businessAnalysis={businessAnalysis}
        leadsCount={leads.length}
        onNavigateAction={(action) => {
          if (action.includes('analyzer')) onSelectTab('analyzer');
          if (action.includes('icp')) onSelectTab('icp');
          if (action.includes('lead')) onSelectTab('find-leads');
          if (action.includes('campaign')) onSelectTab('campaigns');
        }}
      />
    </div>
  );
};
