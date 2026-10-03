import React from 'react';
import {
  X,
  ExternalLink,
  Target,
  Sparkles,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  AlertCircle,
  Cpu,
  BookmarkCheck,
  Send,
  MessageSquare,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Lead } from '../../types';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen?: boolean;
  onClose: () => void;
  onSaveLead: (lead: Lead) => void;
  onGenerateOutreach: (lead: Lead) => void;
  isSaved?: boolean;
  isLocked?: boolean;
  onOpenPaywall?: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onSaveLead,
  onGenerateOutreach,
  isSaved = false,
  isLocked = false,
  onOpenPaywall,
}) => {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pr-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                {lead.industry}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {lead.country}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {lead.company}
            </h2>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
              <a
                href={lead.website}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 font-mono inline-flex items-center gap-1"
              >
                {lead.website.replace('https://', '')}
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <span>Founded {lead.founded || '2019'}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-flex flex-col items-start sm:items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Relevance Score
              </span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {lead.matchScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Decision Maker Contact Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
              {lead.contact.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {isLocked ? `${lead.contact.split(' ')[0]} ••••••` : lead.contact}
              </p>
              <p className="text-xs text-slate-400 font-medium">{lead.role}</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400 font-mono">
              {isLocked ? '••••••@' + lead.website.replace('https://', '').replace('http://', '') : lead.email}
            </span>
          </div>
        </div>

        {isLocked && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Pro Database Lead (Beyond 20 Free Leads)</p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Every user gets their first 20 leads 100% free with full outreach. Upgrade to a paid plan ($19/mo Starter or $49/mo Growth) to unlock full verified email & phone credentials.
              </p>
            </div>
          </div>
        )}

        {/* Company Overview & Firmographics */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Company Overview
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
            {lead.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Headcount
              </span>
              <span className="text-white font-semibold">{lead.employees}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Est. Revenue
              </span>
              <span className="text-white font-semibold">{lead.revenue}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 col-span-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                Detected Tech Stack
              </span>
              <span className="text-blue-300 font-mono text-[11px] truncate block">
                {lead.techStack.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Why this lead matches (Requested in prompt) */}
        <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Sparkles className="w-4 h-4" />
            Why This Lead Matches Your ICP
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lead.whyMatches}
          </p>
        </div>

        {/* Potential Pain Points (Requested in prompt) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <AlertCircle className="w-4 h-4" />
            Potential Pain Points
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {lead.potentialPainPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Outreach Opportunity Box (Requested in prompt) */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/40 to-slate-950 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                AI Outreach Opportunity
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Ready to draft</span>
          </div>
          <p className="text-xs text-slate-300">
            Leverage {lead.company}'s recent growth moves and role as {lead.role} to propose a value-driven conversation.
          </p>
          {isLocked ? (
            <button
              onClick={() => {
                onClose();
                if (onOpenPaywall) onOpenPaywall();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Upgrade Plan to Contact This Lead ($19/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => onGenerateOutreach(lead)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Personalized Outreach</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => onSaveLead(lead)}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer border border-slate-700"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSaved ? 'Saved in List' : 'Save Lead'}</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
