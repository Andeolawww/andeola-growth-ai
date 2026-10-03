import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  BookmarkCheck,
  Send,
  MessageSquare,
  ArrowUpDown,
  Check,
  SlidersHorizontal,
  Info,
  ChevronRight,
  ShieldAlert,
  Zap,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Lead, LeadFilters, UserProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface FindLeadsViewProps {
  leads: Lead[];
  savedLeadIds: string[];
  user: UserProfile;
  onSelectLead: (lead: Lead) => void;
  onSaveLead: (lead: Lead) => void;
  onGenerateMessage: (lead: Lead) => void;
  onAddToCampaign: (lead: Lead) => void;
  onBatchAddToCampaign: (leads: Lead[]) => void;
  onSendEverythingTo20Leads: () => void;
  onOpenPaywall: () => void;
}

export const FindLeadsView: React.FC<FindLeadsViewProps> = ({
  leads,
  savedLeadIds,
  user,
  onSelectLead,
  onSaveLead,
  onGenerateMessage,
  onAddToCampaign,
  onBatchAddToCampaign,
  onSendEverythingTo20Leads,
  onOpenPaywall,
}) => {
  const { showToast } = useToast();

  // Filters State
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCompanySize, setSelectedCompanySize] = useState<string>('All');
  const [selectedJobRole, setSelectedJobRole] = useState<string>('All');
  const [selectedRevenue, setSelectedRevenue] = useState<string>('All');
  const [keyword, setKeyword] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [minScore, setMinScore] = useState<number>(80);

  // Sorting & Selection
  const [sortBy, setSortBy] = useState<'matchScore' | 'company' | 'country'>('matchScore');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(true);
  const [isQuickSending20, setIsQuickSending20] = useState<boolean>(false);

  const isFreeTrial = user.plan === 'Free Trial';
  const trialLimitReached = isFreeTrial && user.freeTrialLeadsUsed >= user.freeTrialLeadsMax;

  // Options
  const industries = ['All', 'Ecommerce & Retail', 'Marketing & Retail Innovation', 'Fashion & Retail', 'Fashion & Apparel', 'Sustainable Retail', 'Agencies & Growth', 'B2B Businesses & Trade'];
  const countries = ['All', 'United Kingdom', 'Germany', 'France', 'Sweden', 'Netherlands', 'Belgium'];
  const companySizes = ['All', '10–25', '25–50', '50–100', '75–150'];
  const jobRoles = ['All', 'Founder', 'CEO', 'Director', 'Chief Buyer', 'VP Strategy'];
  const revenues = ['All', '$1M–$3M', '$3M–$5M', '$5M–$10M', '$10M+'];
  const techOptions = ['All', 'Shopify Plus', 'Shopify', 'HubSpot', 'Centra', 'Magento 2'];

  // Filtered and Sorted Leads
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (selectedIndustry !== 'All') {
      result = result.filter((l) => l.industry.toLowerCase().includes(selectedIndustry.toLowerCase()));
    }
    if (selectedCountry !== 'All') {
      result = result.filter((l) => l.country === selectedCountry);
    }
    if (selectedCompanySize !== 'All') {
      result = result.filter((l) => l.employees.includes(selectedCompanySize));
    }
    if (selectedJobRole !== 'All') {
      result = result.filter((l) => l.role.toLowerCase().includes(selectedJobRole.toLowerCase()));
    }
    if (selectedTech !== 'All') {
      result = result.filter((l) => l.techStack.includes(selectedTech));
    }
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      result = result.filter(
        (l) =>
          l.company.toLowerCase().includes(kw) ||
          l.contact.toLowerCase().includes(kw) ||
          l.role.toLowerCase().includes(kw) ||
          l.description.toLowerCase().includes(kw)
      );
    }
    result = result.filter((l) => l.matchScore >= minScore);

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'matchScore') {
        return sortOrder === 'desc' ? b.matchScore - a.matchScore : a.matchScore - b.matchScore;
      }
      if (sortBy === 'company') {
        return sortOrder === 'desc'
          ? b.company.localeCompare(a.company)
          : a.company.localeCompare(b.company);
      }
      if (sortBy === 'country') {
        return sortOrder === 'desc'
          ? b.country.localeCompare(a.country)
          : a.country.localeCompare(b.country);
      }
      return 0;
    });

    return result;
  }, [
    leads,
    selectedIndustry,
    selectedCountry,
    selectedCompanySize,
    selectedJobRole,
    selectedTech,
    keyword,
    minScore,
    sortBy,
    sortOrder,
  ]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const toggleSelectLead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchCampaign = () => {
    handleActionGuard(() => {
      const selectedLeads = leads.filter((l) => selectedIds.includes(l.id));
      if (selectedLeads.length === 0) return;
      onBatchAddToCampaign(selectedLeads);
    });
  };

  const resetFilters = () => {
    setSelectedIndustry('All');
    setSelectedCountry('All');
    setSelectedCompanySize('All');
    setSelectedJobRole('All');
    setSelectedRevenue('All');
    setSelectedTech('All');
    setKeyword('');
    setMinScore(80);
    showToast('Filters Reset', 'Showing all discovered demonstration accounts.');
  };

  const handleSelectFirst20 = () => {
    const first20 = filteredLeads.slice(0, 20).map((l) => l.id);
    setSelectedIds(first20);
    showToast('20 Leads Selected', 'Shortlisted top 20 ICP-matched prospects.');
  };

  const handleQuickSendEverything = async () => {
    setIsQuickSending20(true);
    showToast('Synthesizing Outreach', 'Generating personalized messages for all 20 leads...', 'info');
    
    // Select top 20
    const top20 = filteredLeads.slice(0, 20);
    setSelectedIds(top20.map((l) => l.id));

    setTimeout(() => {
      setIsQuickSending20(false);
      onSendEverythingTo20Leads();
    }, 1200);
  };

  const handleActionGuard = (action: () => void) => {
    if (trialLimitReached) {
      onOpenPaywall();
      return;
    }
    action();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" />
            Lead Discovery Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Your Next Customers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Intelligent prospect discovery matching your ICP criteria. Scored in real-time for buying signals and outreach suitability.
          </p>
        </div>

        {/* Prototype demo notice banner badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-[11px]">
            Realistic demonstration leads. External API integration ready.
          </span>
        </div>
      </div>

      {/* 20 Free Leads per User Offer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold border border-blue-500/30">
              Free Trial Quota
            </span>
            <h2 className="text-sm font-bold text-white">
              20 Free Leads Per User — Generate & Send Everything
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            {isFreeTrial ? (
              <>
                You've used{' '}
                <strong className="text-white font-mono">{user.freeTrialLeadsUsed}</strong> of{' '}
                <strong className="text-white font-mono">{user.freeTrialLeadsMax}</strong> free leads.
                {trialLimitReached ? ' Free limit reached! Upgrade to unlock up to 10,000 leads.' : ' Process all 20 leads with full AI personalization before paying!'}
              </>
            ) : (
              <>Active plan: <strong className="text-emerald-400">{user.plan}</strong> with unlimited campaign capabilities.</>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {trialLimitReached ? (
            <button
              onClick={onOpenPaywall}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Free 20 Leads Used • Upgrade to Pay ($19/mo)</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSelectFirst20}
                className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Select 20 Leads</span>
              </button>

              <button
                type="button"
                onClick={handleQuickSendEverything}
                disabled={isQuickSending20}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Zap className={`w-3.5 h-3.5 ${isQuickSending20 ? 'animate-spin' : ''}`} />
                <span>{isQuickSending20 ? 'Dispatching 20 Leads...' : '⚡ Send Everything to 20 Leads Free'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Keyword Search */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search company, contact, or keywords..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              <span>{isFiltersExpanded ? 'Hide Filters' : 'Filter Criteria'}</span>
            </button>
            <button
              onClick={resetFilters}
              className="py-2 px-3 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Detailed Filters (All 8 filters required) */}
        {isFiltersExpanded && (
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs animate-in fade-in">
            {/* 1. Industry */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Industry
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Country */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Company Size */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Company Size
              </label>
              <select
                value={selectedCompanySize}
                onChange={(e) => setSelectedCompanySize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                {companySizes.map((s) => (
                  <option key={s} value={s}>
                    {s} employees
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Job Role */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Job Role
              </label>
              <select
                value={selectedJobRole}
                onChange={(e) => setSelectedJobRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                {jobRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Company Revenue */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Revenue
              </label>
              <select
                value={selectedRevenue}
                onChange={(e) => setSelectedRevenue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                {revenues.map((rev) => (
                  <option key={rev} value={rev}>
                    {rev}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Technology */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Technology
              </label>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              >
                {techOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* 7. Lead Quality (Min Score) */}
            <div className="col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">
                  Min Match Score
                </label>
                <span className="font-mono text-emerald-400 font-bold">{minScore}%+</span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                step="1"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Batch Actions Bar (when leads selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">
              {selectedIds.length}
            </span>
            <span className="text-white font-semibold">
              prospect{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const selectedLeads = leads.filter((l) => selectedIds.includes(l.id));
                selectedLeads.forEach((l) => onSaveLead(l));
                showToast('Batch Saved', `${selectedLeads.length} leads saved to your list.`);
              }}
              className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Save Leads</span>
            </button>
            <button
              onClick={handleBatchCampaign}
              className="py-1.5 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Add to Campaign ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Table View */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Discovered Prospects
            </span>
            <span className="text-xs text-slate-400 ml-2">
              Showing {filteredLeads.length} accounts
            </span>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-slate-200 text-xs focus:outline-none"
            >
              <option value="matchScore">Match Score</option>
              <option value="company">Company</option>
              <option value="country">Country</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredLeads.length > 0 &&
                      selectedIds.length === filteredLeads.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 bg-slate-950 accent-blue-600"
                  />
                </th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3">Country</th>
                <th className="py-3 px-3 text-center">Match Score</th>
                <th className="py-3 px-3">Website</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.map((lead, idx) => {
                const isSelected = selectedIds.includes(lead.id);
                const isSaved = savedLeadIds.includes(lead.id);
                const isFreeLead = idx < 20;
                const isLocked = isFreeTrial && (!isFreeLead || trialLimitReached);

                return (
                  <React.Fragment key={lead.id}>
                    {/* Visual divider after lead #20 on free trial */}
                    {isFreeTrial && idx === 20 && (
                      <tr className="bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-950 border-y border-blue-500/30">
                        <td colSpan={9} className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300">
                            <Lock className="w-3.5 h-3.5 text-blue-400" />
                            <span>
                              You've reached the <strong>20 Free Leads</strong> limit included for all users.
                            </span>
                            <button
                              type="button"
                              onClick={onOpenPaywall}
                              className="ml-2 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                            >
                              Upgrade to Pay & Unlock Remaining Leads →
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    <tr
                      onClick={() => {
                        if (isLocked) {
                          onOpenPaywall();
                        } else {
                          onSelectLead(lead);
                        }
                      }}
                      className={`transition-colors cursor-pointer group ${
                        isLocked
                          ? 'opacity-85 hover:bg-slate-900/80 bg-slate-950/40'
                          : isSelected
                          ? 'bg-blue-950/20 hover:bg-blue-950/30'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td
                        className="py-3.5 px-3"
                        onClick={(e) => {
                          if (isLocked) {
                            e.stopPropagation();
                            onOpenPaywall();
                          } else {
                            toggleSelectLead(lead.id, e);
                          }
                        }}
                      >
                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                        ) : (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded border-slate-700 bg-slate-950 accent-blue-600 cursor-pointer"
                          />
                        )}
                      </td>

                      {/* Company & Free Lead Tag */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {lead.company}
                          </span>
                          {isFreeTrial && (
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                                isFreeLead && !trialLimitReached
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}
                            >
                              {isFreeLead && !trialLimitReached ? `Free #${idx + 1}` : 'Pro'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          {lead.employees} emp • {lead.revenue}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-3 text-slate-200 font-medium">
                        {isLocked ? (
                          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-400" />
                            {lead.contact.split(' ')[0]} ••••••
                          </span>
                        ) : (
                          lead.contact
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-3 text-slate-300">
                        {lead.role}
                      </td>

                      {/* Industry */}
                      <td className="py-3.5 px-3 text-slate-400">
                        {lead.industry}
                      </td>

                      {/* Country */}
                      <td className="py-3.5 px-3 text-slate-400">
                        {lead.country}
                      </td>

                      {/* Match Score Badge */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                            lead.matchScore >= 90
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : lead.matchScore >= 85
                              ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                              : 'text-slate-300 bg-slate-800 border-slate-700'
                          }`}
                        >
                          {lead.matchScore}%
                        </span>
                      </td>

                      {/* Website */}
                      <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                        {isLocked ? (
                          <span className="text-slate-500 text-[11px] font-mono">
                            locked.co
                          </span>
                        ) : (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-mono text-[11px]"
                          >
                            visit <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        {isLocked ? (
                          <button
                            type="button"
                            onClick={onOpenPaywall}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Unlock</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                handleActionGuard(() => {
                                  onSaveLead(lead);
                                  showToast(
                                    isSaved ? 'Already saved' : 'Lead Saved',
                                    `${lead.company} stored in your Lead List`
                                  );
                                });
                              }}
                              title={isSaved ? 'Lead already saved' : 'Save Lead'}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isSaved
                                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              <BookmarkCheck className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleActionGuard(() => onGenerateMessage(lead))}
                              title="Generate Personalized Outreach"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleActionGuard(() => onAddToCampaign(lead))}
                              title="Add to Campaign"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <Filter className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">
                No matching leads found for these filter settings
              </p>
              <button
                onClick={resetFilters}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
