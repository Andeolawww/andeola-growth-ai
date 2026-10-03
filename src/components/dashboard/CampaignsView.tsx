import React, { useState } from 'react';
import {
  Send,
  Plus,
  Play,
  Pause,
  Mail,
  Linkedin,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { Campaign, Lead } from '../../types';
import { useToast } from '../../context/ToastContext';

interface CampaignsViewProps {
  campaigns: Campaign[];
  savedLeads: Lead[];
  onCreateCampaign: (campaign: Partial<Campaign>) => void;
  onToggleCampaignStatus: (id: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  savedLeads,
  onCreateCampaign,
  onToggleCampaignStatus,
}) => {
  const { showToast } = useToast();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Wizard Form State (6 steps as specified)
  const [campName, setCampName] = useState('DACH Sustainable Retail Q4');
  const [selectedList, setSelectedList] = useState('All Saved Prospects (5)');
  const [channel, setChannel] = useState<'email' | 'linkedin' | 'multichannel'>('email');
  const [toneStyle, setToneStyle] = useState<'professional' | 'consultative' | 'friendly' | 'direct'>('consultative');
  const [isLaunching, setIsLaunching] = useState(false);

  const resetWizard = () => {
    setIsWizardOpen(false);
    setWizardStep(1);
    setCampName('');
  };

  const handleLaunch = () => {
    setIsLaunching(true);

    setTimeout(() => {
      setIsLaunching(false);
      onCreateCampaign({
        name: campName || 'New Targeted Sequence',
        channel: channel,
        status: 'Active',
        leadsCount: savedLeads.length || 24,
        messagesGenerated: savedLeads.length || 24,
        messagesSent: 1,
        replies: 0,
        interested: 0,
        meetings: 0,
        targetIndustry: 'European Retail & Boutiques',
      });
      showToast('Campaign Launched', `Simulating outreach cadence for "${campName}"`);
      resetWizard();
    }, 700);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Send className="w-3.5 h-3.5" />
            Outreach Cadence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campaign Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Coordinate multi-touch outreach sequences. Track deliverability, open rates, positive replies, and booked appointments.
          </p>
        </div>

        <button
          onClick={() => setIsWizardOpen(true)}
          className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-xl group"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        camp.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : camp.status === 'Paused'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {camp.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {camp.channel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {camp.name}
                  </h3>
                </div>

                <button
                  onClick={() => onToggleCampaignStatus(camp.id)}
                  title={camp.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {camp.status === 'Active' ? (
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400 mb-5">
                Target: {camp.targetIndustry}
              </p>

              {/* Campaign Key Metrics (Cards required in prompt) */}
              <div className="grid grid-cols-3 gap-2.5 text-center p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Leads
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    {camp.leadsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Sent
                  </span>
                  <span className="text-sm font-bold text-blue-400 font-mono">
                    {camp.messagesSent}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Replies
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {camp.replies}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <span>Interested:</span>
                  <strong className="text-white font-mono">{camp.interested}</strong>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                  <span>Meetings:</span>
                  <strong className="text-emerald-400 font-mono">{camp.meetings}</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Created {camp.createdAt}</span>
              <span className="font-semibold text-blue-400 group-hover:underline">
                View Log →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Creation Flow Modal (6 Steps required in prompt) */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
            {/* Close */}
            <button
              onClick={resetWizard}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stepper Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-blue-400">
                  Step {wizardStep} of 6
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {wizardStep === 1 && '1. Campaign Name'}
                  {wizardStep === 2 && '2. Select Lead List'}
                  {wizardStep === 3 && '3. Select Outreach Channel'}
                  {wizardStep === 4 && '4. Choose Message Style'}
                  {wizardStep === 5 && '5. Review & Settings'}
                  {wizardStep === 6 && '6. Launch Simulation'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">Create New Outreach Sequence</h2>
            </div>

            {/* Step 1: Campaign name */}
            {wizardStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    placeholder="e.g. European Boutique Buyers Q4"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  A descriptive name helps you track open rates and responses across different target audiences.
                </p>
              </div>
            )}

            {/* Step 2: Select lead list */}
            {wizardStep === 2 && (
              <div className="space-y-3 animate-in fade-in">
                <label className="block text-xs font-medium text-slate-300">
                  Select Lead List or Segment
                </label>
                {[
                  { name: 'All Saved Prospects (5 leads)', desc: 'Pre-vetted boutique retail accounts' },
                  { name: 'High-Match ICP Cohort (90%+)', desc: '142 auto-discovered high-conviction accounts' },
                  { name: 'Nordic & DACH Regional Segment', desc: '68 retail concept stores in Germany & Sweden' },
                ].map((l) => (
                  <div
                    key={l.name}
                    onClick={() => setSelectedList(l.name)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedList === l.name
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-semibold text-white">{l.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{l.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Select outreach channel */}
            {wizardStep === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <label className="block text-xs font-medium text-slate-300">
                  Select Primary Outreach Channel
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      channel === 'email'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Mail className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-xs font-semibold block">Email Sequence</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('linkedin')}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      channel === 'linkedin'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Linkedin className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-xs font-semibold block">LinkedIn Connection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('multichannel')}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      channel === 'multichannel'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Layers className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-xs font-semibold block">Multi-Channel</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Choose message style */}
            {wizardStep === 4 && (
              <div className="space-y-3 animate-in fade-in">
                <label className="block text-xs font-medium text-slate-300">
                  Select AI Message Style & Angle
                </label>
                {(['consultative', 'professional', 'friendly', 'direct'] as const).map((style) => (
                  <div
                    key={style}
                    onClick={() => setToneStyle(style)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer capitalize transition-all ${
                      toneStyle === style
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-semibold text-white block capitalize">{style} Tone</span>
                    <span className="text-[11px] text-slate-400">
                      {style === 'consultative' && 'Leads with industry trends and mutual business value'}
                      {style === 'professional' && 'Formal, concise corporate partnership proposition'}
                      {style === 'friendly' && 'Warm, conversational peer-to-peer exchange'}
                      {style === 'direct' && 'Immediate bottom-line question asking for 10 min sync'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Review */}
            {wizardStep === 5 && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in fade-in">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Campaign Configuration Review
                </h4>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Name:</span>
                    <span className="text-slate-200 font-semibold">{campName || 'Untitled'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lead List:</span>
                    <span className="text-slate-200 font-semibold">{selectedList}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Channel:</span>
                    <span className="text-blue-400 font-semibold uppercase">{channel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tone Style:</span>
                    <span className="text-indigo-400 font-semibold capitalize">{toneStyle}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Launch */}
            {wizardStep === 6 && (
              <div className="text-center space-y-4 py-4 animate-in fade-in">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ready for Outreach Simulation</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Clicking launch simulates sending personalized messages to your selected list and initializes tracking telemetry.
                  </p>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="py-2 px-4 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Back
                </button>
              ) : (
                <span />
              )}

              {wizardStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunch}
                  disabled={isLaunching}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isLaunching ? 'Launching Simulation...' : 'Launch Campaign'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
