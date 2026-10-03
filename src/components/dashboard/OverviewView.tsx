import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Users,
  Send,
  MessageSquare,
  TrendingUp,
  Calendar,
  ArrowRight,
  Target,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { AnalyticsData, Lead, Campaign, NavigationTab, UserProfile } from '../../types';
import { Zap, Lock } from 'lucide-react';

interface OverviewViewProps {
  analytics: AnalyticsData;
  recentLeads: Lead[];
  activeCampaigns: Campaign[];
  user?: UserProfile;
  onSendEverythingTo20Leads?: () => void;
  onOpenPaywall?: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onSelectLead: (lead: Lead) => void;
  onAnalyzeUrl: (url: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  analytics,
  recentLeads,
  activeCampaigns,
  user,
  onSendEverythingTo20Leads,
  onOpenPaywall,
  onNavigate,
  onSelectLead,
  onAnalyzeUrl,
}) => {
  const [quickUrl, setQuickUrl] = useState('');
  const isFreeTrial = user?.plan === 'Free Trial';
  const trialUsedAll = isFreeTrial && (user?.freeTrialLeadsUsed ?? 0) >= (user?.freeTrialLeadsMax ?? 20);

  const handleQuickAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickUrl.trim()) {
      onAnalyzeUrl(quickUrl.trim());
    } else {
      onNavigate('analyzer');
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: analytics.totalLeadsDiscovered.toLocaleString(),
      change: '+14.2%',
      isPositive: true,
      icon: Users,
      color: 'blue',
      sub: 'Discovered via web analysis',
    },
    {
      title: 'Qualified Leads',
      value: analytics.qualifiedLeads.toLocaleString(),
      change: '+22.5%',
      isPositive: true,
      icon: Target,
      color: 'indigo',
      sub: 'Scored 85%+ ICP match',
    },
    {
      title: 'Active Campaigns',
      value: '4',
      change: '+2 this month',
      isPositive: true,
      icon: Send,
      color: 'violet',
      sub: 'Simulated multi-touch cadence',
    },
    {
      title: 'Messages Generated',
      value: analytics.messagesGenerated.toLocaleString(),
      change: '+38.4%',
      isPositive: true,
      icon: MessageSquare,
      color: 'cyan',
      sub: 'Multi-channel personalized copy',
    },
    {
      title: 'Reply Rate',
      value: `${analytics.replyRate}%`,
      change: '+4.1%',
      isPositive: true,
      icon: TrendingUp,
      color: 'emerald',
      sub: 'Industry benchmark: 8.5%',
    },
    {
      title: 'Meetings Booked',
      value: analytics.meetings.toString(),
      change: '+12 this week',
      isPositive: true,
      icon: Calendar,
      color: 'emerald',
      sub: 'High intent prospect calls',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Autonomous Prospecting Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, Andeola 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Your intelligence engine analyzed <strong>examplefashionstore.com</strong>. You have{' '}
            <span className="text-emerald-400 font-semibold">1,124 high-conviction leads</span> ready for targeted multi-channel outreach.
          </p>
        </div>

        {/* Quick URL Analyzer Form in Banner */}
        <div className="w-full lg:w-auto relative z-10 shrink-0">
          <form
            onSubmit={handleQuickAnalyze}
            className="flex flex-col sm:flex-row gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-700/80 shadow-inner"
          >
            <div className="relative flex items-center min-w-[240px]">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full bg-transparent pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze a Website</span>
            </button>
          </form>
        </div>
      </div>

      {/* 20 Free Leads Progress Banner for Users */}
      {isFreeTrial && user && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold border border-blue-500/30">
                Free Trial Guarantee
              </span>
              <h2 className="text-sm font-bold text-white">
                20 Free Leads Per User • Complete AI Outreach Included
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every user receives 20 verified leads with custom messaging. Test everything before paying a single dollar.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-48 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    trialUsedAll ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-emerald-400'
                  }`}
                  style={{
                    width: `${Math.min(100, (user.freeTrialLeadsUsed / user.freeTrialLeadsMax) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-mono font-semibold text-white">
                {user.freeTrialLeadsUsed} / {user.freeTrialLeadsMax} Leads Processed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            {trialUsedAll ? (
              <button
                type="button"
                onClick={onOpenPaywall}
                className="w-full md:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>20 Free Leads Sent • Upgrade to Pay ($19/mo)</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('find-leads')}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  View 20 Leads
                </button>
                {onSendEverythingTo20Leads && (
                  <button
                    type="button"
                    onClick={onSendEverythingTo20Leads}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>⚡ Send Everything to 20 Leads Free</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 6 Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/90 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  {c.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-300">
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {c.value}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-1">
                  <span>{c.change}</span>
                  <span className="text-slate-400 font-normal truncate">• {c.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Polished Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Lead Discovery & Contact Velocity (Area Chart) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Lead Discovery & Outreach Velocity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                New accounts identified vs personalized outreach dispatched (past 7 days)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-300">Leads Discovered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Contacted</span>
              </div>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="mt-6 h-64 w-full flex flex-col justify-end">
            <div className="relative w-full h-48">
              <svg viewBox="0 0 600 180" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#1E293B" strokeDasharray="3 3" />

                {/* Area 1: Leads */}
                <path
                  d="M 0 130 C 90 90, 180 30, 270 50 C 360 70, 450 15, 540 100 L 600 80 L 600 180 L 0 180 Z"
                  fill="url(#blueGradient)"
                />
                <path
                  d="M 0 130 C 90 90, 180 30, 270 50 C 360 70, 450 15, 540 100 L 600 80"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                />

                {/* Area 2: Contacted */}
                <path
                  d="M 0 160 C 90 140, 180 120, 270 130 C 360 115, 450 95, 540 120 L 600 110 L 600 180 L 0 180 Z"
                  fill="url(#emeraldGradient)"
                />
                <path
                  d="M 0 160 C 90 140, 180 120, 270 130 C 360 115, 450 95, 540 120 L 600 110"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />

                {/* Data Points on top curve */}
                {[
                  { cx: 0, cy: 130 },
                  { cx: 100, cy: 80 },
                  { cx: 200, cy: 40 },
                  { cx: 300, cy: 60 },
                  { cx: 400, cy: 25 },
                  { cx: 500, cy: 90 },
                  { cx: 600, cy: 80 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4"
                    fill="#3B82F6"
                    stroke="#0F172A"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
              {analytics.discoveryTimeline.map((item) => (
                <span key={item.date} className="font-mono">
                  {item.date} ({item.leads})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Lead Quality & Intent Distribution */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Lead Quality Score
              </h2>
              <span className="text-xs text-blue-400 font-semibold">ICP Alignment</span>
            </div>

            <div className="mt-5 space-y-4">
              {analytics.qualityDistribution.map((q) => (
                <div key={q.tier} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{q.tier}</span>
                    <span className="font-mono font-bold text-white">
                      {q.count} ({q.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${q.percentage}%`,
                        backgroundColor: q.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Automated AI Scoring
            </div>
            Leads with 90%+ match score have generated an average <strong>24.6% reply rate</strong> on email sequences.
          </div>
        </div>
      </div>

      {/* Chart 3 & 4: Campaign Activity & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Campaign Activity Performance */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Campaign Activity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sent messages vs positive replies per active sequence
              </p>
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              All Campaigns <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {analytics.campaignPerformance.map((c) => (
              <div key={c.name} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">{c.sent} sent</span>
                    <span className="text-blue-400 font-semibold">{c.replies} replies</span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {c.meetings} meetings
                    </span>
                  </div>
                </div>
                {/* Visual stacked bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${(c.replies / c.sent) * 100 * 2.5}%` }}
                  />
                  <div
                    className="bg-emerald-400 h-full"
                    style={{ width: `${(c.meetings / c.sent) * 100 * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outreach Conversion Funnel */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Outreach Performance Funnel
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Conversion stages from discovery to qualified meeting
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              18.4% Conv.
            </span>
          </div>

          <div className="mt-5 space-y-2.5">
            {analytics.funnelStages.map((st, idx) => {
              const widths = ['100%', '78%', '58%', '38%', '22%'];
              return (
                <div key={st.stage} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 text-[10px] w-4">
                      0{idx + 1}
                    </span>
                    <span className="font-medium text-slate-200">{st.stage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white">{st.count.toLocaleString()}</span>
                    <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 w-16 text-center">
                      {st.rate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Inbound Buyer Replies Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-blue-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">
                Live Inbound Activity
              </span>
              <span className="text-xs text-slate-400">
                Alerts forwarded to: <strong className="text-white">{user?.replyNotificationEmail || 'webhubtech299@gmail.com'}</strong>
              </span>
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Buyer Replies & Meetings
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('inbox')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View All in Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            onClick={() => onNavigate('inbox')}
            className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 hover:border-blue-400/60 transition-all cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Emma Wilson (Nova Retail Paris)</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Meeting Requested
              </span>
            </div>
            <p className="text-[11px] text-slate-300 italic line-clamp-2">
              "We love the minimalist streetwear line! Could you send over wholesale lookbook and pricing? Open for 15-min call this Thursday at 2pm..."
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>Received 12 mins ago</span>
              <span className="text-blue-400 font-semibold">Click to reply →</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('inbox')}
            className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Sarah Mitchell (Northstar Commerce UK)</span>
              <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Interested in Wholesale
              </span>
            </div>
            <p className="text-[11px] text-slate-300 italic line-clamp-2">
              "Actively onboarding 2 new European apparel brands for our 3 flagship UK stores. What are your minimum order quantities?"
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
              <span>Received 2 hours ago</span>
              <span className="text-blue-400 font-semibold">Click to reply →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent High-Scoring Leads Quick Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/90">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Top ICP Matched Prospects
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any prospect to inspect full details or draft custom AI outreach
            </p>
          </div>
          <button
            onClick={() => onNavigate('find-leads')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
          >
            Explore all 2,486 leads <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3 text-center">Match Score</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentLeads.slice(0, 5).map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3 font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {lead.company}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-medium">
                    {lead.contact}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">
                    {lead.role}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">
                    {lead.industry}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">
                    {lead.country}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      {lead.matchScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                      View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
