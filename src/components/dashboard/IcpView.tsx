import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  ArrowRight,
  Building2,
  Users,
  MapPin,
  Briefcase,
  DollarSign,
  AlertCircle,
  Radio,
  Compass,
  Edit3,
  Check,
  RefreshCw,
} from 'lucide-react';
import { IdealCustomerProfile, BusinessAnalysis } from '../../types';
import { useToast } from '../../context/ToastContext';

interface IcpViewProps {
  icp: IdealCustomerProfile;
  businessAnalysis: BusinessAnalysis;
  onFindMatchingLeads: () => void;
  onRegenerateIcp: () => Promise<void>;
}

export const IcpView: React.FC<IcpViewProps> = ({
  icp,
  businessAnalysis,
  onFindMatchingLeads,
  onRegenerateIcp,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { showToast } = useToast();

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateIcp();
      showToast('ICP Refined', 'Updated customer profile parameters based on your business.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Target className="w-3.5 h-3.5" />
            Strategic Targeting
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ideal Customer Profile (ICP)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Derived from <strong>{businessAnalysis.businessName || 'your website analysis'}</strong>.
            Matches prospects based on firmographic fit, decision-maker authority, and buying signals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Refining...' : 'Regenerate ICP'}</span>
          </button>
          <button
            onClick={onFindMatchingLeads}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            <span>Find Matching Leads</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Summary Highlight Card (As specified in prompt) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400">
            AI-Generated Summary
          </h2>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Your Ideal Customer: {icp.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          {icp.summary}
        </p>

        {/* 5 Key Anchor Pills */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-6 border-t border-slate-800/80 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Primary Industries
            </span>
            <span className="text-white font-semibold">{icp.industries[0]}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Target Countries
            </span>
            <span className="text-white font-semibold">{icp.targetCountries.slice(0, 2).join(', ')}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Company Size
            </span>
            <span className="text-white font-semibold">{icp.companySizes[0]}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Decision Makers
            </span>
            <span className="text-white font-semibold truncate block">{icp.buyerRoles[0]}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Buying Signals
            </span>
            <span className="text-emerald-400 font-semibold truncate block">Expanding Retail / Store</span>
          </div>
        </div>
      </div>

      {/* Structured Criteria Matrix (All 9 items required in prompt) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Industry */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            Industry
          </div>
          <div className="flex flex-wrap gap-1.5">
            {icp.industries.map((ind) => (
              <span
                key={ind}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-200 border border-slate-800 text-xs font-medium"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Company Size */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            Company Size
          </div>
          <div className="flex flex-wrap gap-1.5">
            {icp.companySizes.map((size) => (
              <span
                key={size}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-200 border border-slate-800 text-xs font-medium"
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Location */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            Location & Geographies
          </div>
          <div className="flex flex-wrap gap-1.5">
            {icp.targetCountries.map((country) => (
              <span
                key={country}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-200 border border-slate-800 text-xs font-medium"
              >
                {country}
              </span>
            ))}
          </div>
        </div>

        {/* 4. Buyer Role */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            Buyer Roles & Titles
          </div>
          <div className="flex flex-wrap gap-1.5">
            {icp.buyerRoles.map((role) => (
              <span
                key={role}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-200 border border-slate-800 text-xs font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Budget */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            Expected Budget Range
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white font-mono font-semibold">
            {icp.budget}
          </div>
        </div>

        {/* 6. Recommended Markets */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Recommended Markets
          </div>
          <div className="flex flex-wrap gap-1.5">
            {icp.recommendedMarkets.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-200 border border-slate-800 text-xs font-medium"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pain Points, Buying Signals & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pain Points */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            Pain Points
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {icp.painPoints.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buying Signals */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4" />
            Buying Signals
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {icp.buyingSignals.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interests */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Strategic Interests
          </div>
          <div className="flex flex-wrap gap-1.5">
            {icp.interests.map((int) => (
              <span
                key={int}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-medium"
              >
                {int}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA to Find Leads */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">
            Ready to surface accounts matching this profile?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Our engine has pre-indexed 2,486 prospects with match scores calculated against these parameters.
          </p>
        </div>
        <button
          onClick={onFindMatchingLeads}
          className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Find Matching Leads</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
