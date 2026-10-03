import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Send,
  MessageSquare,
  Calendar,
  Sparkles,
  Download,
  Filter,
} from 'lucide-react';
import { AnalyticsData } from '../../types';
import { useToast } from '../../context/ToastContext';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const { showToast } = useToast();

  const handleExport = () => {
    showToast('Report Exported', 'Downloaded pipeline conversion report (CSV/PDF)');
  };

  const statBoxes = [
    { label: 'Leads Discovered', value: analytics.totalLeadsDiscovered.toLocaleString(), change: '+18.4%', icon: Users },
    { label: 'Qualified Leads', value: analytics.qualifiedLeads.toLocaleString(), change: '+24.1%', icon: Target },
    { label: 'Messages Generated', value: analytics.messagesGenerated.toLocaleString(), change: '+41.2%', icon: Sparkles },
    { label: 'Messages Sent', value: analytics.messagesSent.toLocaleString(), change: '+32.0%', icon: Send },
    { label: 'Replies Received', value: analytics.replies.toString(), change: '+12.5%', icon: MessageSquare },
    { label: 'Positive Replies', value: analytics.positiveReplies.toString(), change: '+15.8%', icon: TrendingUp },
    { label: 'Meetings Booked', value: analytics.meetings.toString(), change: '+8.3%', icon: Calendar },
    { label: 'Conversion Rate', value: `${analytics.conversionRate}%`, change: '+3.2%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Performance Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Outreach Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time pipeline diagnostics, channel conversion rates, and response metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            {(['7d', '30d', '90d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`py-1.5 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                  timeRange === r ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 8 Primary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {statBoxes.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] uppercase font-semibold tracking-wider truncate">
                  {s.label}
                </span>
                <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {s.value}
                </span>
                <span className="block text-[10px] text-emerald-400 font-medium">
                  {s.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid: Lead Growth & Campaign Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Growth Trend Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Lead Growth & Discovery Volume
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily prospect identification volume against targeted criteria
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              +28% Net Growth
            </div>
          </div>

          <div className="mt-6 h-56 w-full flex items-end gap-3 sm:gap-6 justify-between pt-4">
            {[
              { day: 'Week 1', height: '40%', val: 320 },
              { day: 'Week 2', height: '58%', val: 510 },
              { day: 'Week 3', height: '75%', val: 780 },
              { day: 'Week 4', height: '90%', val: 876 },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-400 transition-colors">
                  {bar.val}
                </span>
                <div className="w-full bg-slate-800/80 rounded-t-xl h-44 flex items-end p-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 via-indigo-600 to-blue-400 rounded-t-lg transition-all group-hover:brightness-110"
                    style={{ height: bar.height }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Quality Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Lead Quality Distribution
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Scored against verified ICP firmographics</p>
            </div>

            <div className="mt-5 space-y-4">
              {analytics.qualityDistribution.map((q) => (
                <div key={q.tier} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{q.tier}</span>
                    <span className="font-mono font-bold text-white">{q.count}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${q.percentage}%`, backgroundColor: q.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
            High intent tiers demonstrate a <strong>3.2x higher reply rate</strong> on first touches.
          </div>
        </div>
      </div>

      {/* Conversion Funnel & Channel Response Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversion Funnel */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Outbound Conversion Funnel
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Drop-off telemetry at each sales milestone</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {analytics.funnelStages.map((stage, idx) => (
              <div key={stage.stage} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{stage.count.toLocaleString()}</span>
                    <span className="text-[11px] text-blue-400 font-mono font-semibold">({stage.rate})</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                    style={{
                      width: `${Math.max(10, 100 - idx * 20)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Rate by Channel */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Response Rate by Channel
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Performance across outreach formats</p>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Email Sequences</span>
                  <span className="text-emerald-400 font-mono font-bold">19.4% Reply</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  482 sent • 93 replies • 26 meetings booked
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">LinkedIn Messages</span>
                  <span className="text-blue-400 font-mono font-bold">22.8% Reply</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  140 sent • 32 replies • 12 meetings booked
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Short DMs</span>
                  <span className="text-indigo-400 font-mono font-bold">14.1% Reply</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  58 sent • 8 replies • 2 meetings booked
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
