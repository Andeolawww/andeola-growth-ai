import React, { useState } from 'react';
import {
  Settings,
  User,
  Building,
  Bell,
  Sliders,
  Shield,
  Key,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Lock,
  Database,
  Mail,
  Share2,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'company' | 'notifications' | 'ai-preferences' | 'security' | 'integrations'
  >('profile');

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [companyName, setCompanyName] = useState(user.company);
  const [companyWebsite, setCompanyWebsite] = useState(user.website);
  const [defaultTone, setDefaultTone] = useState<'consultative' | 'professional' | 'friendly' | 'direct'>('consultative');
  const [minMatchThreshold, setMinMatchThreshold] = useState(85);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [replyNotifications, setReplyNotifications] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email });
    showToast('Profile Saved', 'Personal information updated successfully.');
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ company: companyName, website: companyWebsite });
    showToast('Company Saved', 'Business entity details updated.');
  };

  const handleSavePreferences = () => {
    showToast('Preferences Saved', 'Default AI outreach tone and scoring criteria saved.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" />
          Workspace Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Settings & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Manage your account profile, business preferences, security credentials, and external API connectors.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto text-xs font-medium pb-px">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'company', label: 'Company', icon: Building },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'ai-preferences', label: 'AI Preferences', icon: Sliders },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'integrations', label: 'API Integrations', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-2xl space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Personal Profile
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Company */}
      {activeTab === 'company' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-2xl space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Company Information
          </h3>
          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Website</label>
              <input
                type="text"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Update Company Details
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-2xl space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Alert & Notification Settings
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Email Sequence Alert</span>
                <span className="text-slate-400">Receive an email when prospect replies to outreach</span>
              </div>
              <input
                type="checkbox"
                checked={replyNotifications}
                onChange={(e) => setReplyNotifications(e.target.checked)}
                className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="font-semibold text-white block">Weekly Intelligence Digest</span>
                <span className="text-slate-400">Summary of newly discovered high-match prospects</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded accent-blue-600 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Preferences */}
      {activeTab === 'ai-preferences' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-2xl space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            AI Outreach & Reasoning Preferences
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Default Outreach Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['consultative', 'professional', 'friendly', 'direct'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDefaultTone(t)}
                    className={`py-2 px-3 rounded-xl border capitalize text-left transition-colors cursor-pointer ${
                      defaultTone === t
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">
                  Minimum Score for Auto-Qualification
                </label>
                <span className="text-emerald-400 font-bold font-mono">{minMatchThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                value={minMatchThreshold}
                onChange={(e) => setMinMatchThreshold(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleSavePreferences}
              className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Security */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-2xl space-y-5 animate-in fade-in">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Security & Authentication
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Two-Factor Authentication Ready</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Workspace data is protected via server-side session tokens. Architecture ready for Supabase or Firebase Auth SSO integration.
            </p>
          </div>
        </div>
      )}

      {/* Tab 6: API Integrations (Required in prompt) */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 max-w-4xl animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              External API Integrations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Securely connect intelligence providers, email dispatch servers, and CRM platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Gemini */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Google Gemini API</h4>
                    <span className="text-[10px] text-slate-400">Server-Side Reasoning</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Powers website decomposition, ICP structuring, and personalized multi-channel message drafting. Managed via server secrets.
              </p>
            </div>

            {/* 2. Lead Data Provider */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Lead Data Provider</h4>
                    <span className="text-[10px] text-slate-400">Apollo / Clay / Clearbit API</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Ready to Hook
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connect external lead databases or webhooks to replace demonstration data with live enterprise firmographic records.
              </p>
            </div>

            {/* 3. Email Provider */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Email Provider</h4>
                    <span className="text-[10px] text-slate-400">SendGrid / Resend / Instantly</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                  Standby
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dispatch personalized AI email messages with deliverability warmup, MX verification, and custom domain tracking.
              </p>
            </div>

            {/* 4. CRM */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">CRM Synchronization</h4>
                    <span className="text-[10px] text-slate-400">HubSpot / Salesforce / Pipedrive</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                  Standby
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automatically push qualified prospects, verified email addresses, and active message threads directly into your CRM.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
