import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Target,
  Search,
  BookmarkCheck,
  Send,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  X,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { NavigationTab, UserProfile } from '../../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  user: UserProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSignOut: () => void;
  onOpenPaywall?: () => void;
  unreadRepliesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  isOpenMobile,
  onCloseMobile,
  onSignOut,
  onOpenPaywall,
  unreadRepliesCount = 0,
}) => {
  const isFreeTrial = user.plan === 'Free Trial';
  const trialUsedAll = isFreeTrial && user.freeTrialLeadsUsed >= user.freeTrialLeadsMax;
  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Website Analyzer', icon: Globe },
    { id: 'icp', label: 'Ideal Customer Profile', icon: Target },
    { id: 'find-leads', label: 'Find Leads', icon: Search, badge: 'New' },
    { id: 'saved-leads', label: 'Lead Lists', icon: BookmarkCheck },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    {
      id: 'inbox',
      label: 'Buyer Replies',
      icon: Inbox,
      badge: unreadRepliesCount > 0 ? `${unreadRepliesCount} New` : undefined,
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800/80 text-slate-300 w-64 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <BrandLogo size="md" />
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Intelligence Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (isOpenMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-900/20'
                  : 'hover:bg-slate-900 hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quota / Credit Pill */}
      <div className="px-4 py-3 mx-3 mb-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {isFreeTrial ? 'Free Trial Leads' : 'Lead Credits'}
          </span>
          <span className="font-mono font-semibold text-white">
            {isFreeTrial
              ? `${user.freeTrialLeadsUsed} / ${user.freeTrialLeadsMax}`
              : `${user.leadCredits} / ${user.leadCreditsMax}`}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              trialUsedAll
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}
            style={{
              width: `${
                isFreeTrial
                  ? Math.min(100, (user.freeTrialLeadsUsed / user.freeTrialLeadsMax) * 100)
                  : (user.leadCredits / user.leadCreditsMax) * 100
              }%`,
            }}
          />
        </div>

        {isFreeTrial && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              {trialUsedAll ? 'Trial finished (20/20)' : `${user.freeTrialLeadsMax - user.freeTrialLeadsUsed} free leads left`}
            </span>
            {onOpenPaywall && (
              <button
                type="button"
                onClick={onOpenPaywall}
                className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                {trialUsedAll ? 'Upgrade to Pay →' : 'View Plans'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Profile & Utilities */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <button
          onClick={() => {
            onSelectTab('settings');
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </button>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 mt-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <span className="text-[10px] text-emerald-400 font-medium">
                {user.plan} Plan
              </span>
            </div>
          </div>
          <button
            onClick={onSignOut}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          />
          <div className="relative z-10 w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
