import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  ShoppingBag,
  Target,
  AlertTriangle,
  Lightbulb,
  Users,
  Copy,
  Download,
  ExternalLink,
} from 'lucide-react';
import { BusinessAnalysis } from '../../types';
import { useToast } from '../../context/ToastContext';

interface WebsiteAnalyzerViewProps {
  analysis: BusinessAnalysis;
  onAnalyze: (url: string) => Promise<void>;
  onGoToIcp: () => void;
  onGoToFindLeads: () => void;
}

export const WebsiteAnalyzerView: React.FC<WebsiteAnalyzerViewProps> = ({
  analysis,
  onAnalyze,
  onGoToIcp,
  onGoToFindLeads,
}) => {
  const [urlInput, setUrlInput] = useState(analysis.url || 'https://examplefashionstore.com');
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { showToast } = useToast();

  const loadingSteps = [
    'Analyzing website...',
    'Understanding products...',
    'Identifying target market...',
    'Building customer profile...',
  ];

  const sampleUrls = [
    'https://examplefashionstore.com',
    'https://glowthreads-apparel.com',
    'https://saasmetrics-hq.io',
    'https://zenithlogistics.co',
  ];

  const handleStartAnalysis = async (urlToUse?: string) => {
    const targetUrl = urlToUse || urlInput;
    if (!targetUrl.trim()) return;

    setIsAnalyzing(true);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev === null) return 0;
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    try {
      await onAnalyze(targetUrl.trim());
      clearInterval(stepInterval);
      setLoadingStep(loadingSteps.length - 1);
      setTimeout(() => {
        setIsAnalyzing(false);
        setLoadingStep(null);
        showToast('Analysis Complete', `Successfully extracted intelligence for ${targetUrl}`);
      }, 400);
    } catch (err) {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setLoadingStep(null);
      showToast('Analysis Finished', 'Loaded business profile from intelligence engine.');
    }
  };

  const handleCopyAnalysis = () => {
    const text = `BUSINESS OVERVIEW\nBusiness Name: ${analysis.businessName}\nIndustry: ${analysis.industry}\nBusiness Model: ${analysis.businessModel}\nTarget Market: ${analysis.targetMarket}\nValue Proposition: ${analysis.valueProposition}\n\nWHAT IT SELLS: ${analysis.whatItSells}\nWHO BUYS IT: ${analysis.whoBuysIt}`;
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'Business overview summary ready to paste.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Website Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Website Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Input any business website or storefront. Our AI decomposes the product catalog, positioning, customer pain points, and buyer personas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAnalysis}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Brief</span>
          </button>
        </div>
      </div>

      {/* Input Box & Presets */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStartAnalysis();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://yourwebsite.com"
              disabled={isAnalyzing}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Website'}</span>
          </button>
        </form>

        {/* Quick presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-400">Quick Test Samples:</span>
          {sampleUrls.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setUrlInput(sample);
                handleStartAnalysis(sample);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 font-mono text-[11px] transition-colors cursor-pointer"
            >
              {sample.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Animation State */}
      {isAnalyzing && (
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-2xl text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-lg font-bold text-white">
              Deconstructing Business Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Examining site content, value propositions, and prospective B2B market overlap...
            </p>

            {/* Stepper display */}
            <div className="mt-6 space-y-2.5 text-left">
              {loadingSteps.map((step, idx) => {
                const isDone = loadingStep !== null && loadingStep > idx;
                const isCurrent = loadingStep === idx;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : isCurrent
                        ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 shadow-md animate-pulse'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isCurrent
                            ? 'border-blue-400 border-t-transparent animate-spin'
                            : 'border-slate-700'
                        }`}
                      />
                    )}
                    <span className="font-semibold">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {!isAnalyzing && (
        <div className="space-y-8">
          {/* SECTION 1: BUSINESS OVERVIEW */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide uppercase">
                    Business Overview
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    {analysis.url}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full self-start sm:self-auto">
                Verified Extraction
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Business Name */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Business Name
                </span>
                <p className="text-base font-bold text-white mt-1">
                  {analysis.businessName}
                </p>
              </div>

              {/* Industry */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Industry
                </span>
                <p className="text-base font-bold text-white mt-1">
                  {analysis.industry}
                </p>
              </div>

              {/* Business Model */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Business Model
                </span>
                <p className="text-base font-bold text-white mt-1">
                  {analysis.businessModel}
                </p>
              </div>
            </div>

            {/* Products / Services */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Products & Core Offerings
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.productsServices.map((prod) => (
                  <span
                    key={prod}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-medium"
                  >
                    {prod}
                  </span>
                ))}
              </div>
            </div>

            {/* Target Market & Value Proposition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Target Market
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {analysis.targetMarket}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Value Proposition
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {analysis.valueProposition}
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 2: AI INSIGHTS */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide uppercase">
                  AI Insights & Strategic Angles
                </h2>
                <p className="text-xs text-slate-400">
                  Derivations for outbound targeting and campaign messaging
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What the company sells */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-2">
                  <ShoppingBag className="w-4 h-4" />
                  What the company sells
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {analysis.whatItSells}
                </p>
              </div>

              {/* Who likely buys it */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-2">
                  <Target className="w-4 h-4" />
                  Who likely buys it
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {analysis.whoBuysIt}
                </p>
              </div>
            </div>

            {/* Pain Points */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-3">
                <AlertTriangle className="w-4 h-4" />
                Primary Customer Pain Points
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.customerPainPoints.map((pp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{pp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities & Prospect Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Opportunities */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-3">
                  <Lightbulb className="w-4 h-4" />
                  Potential Market Opportunities
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysis.marketOpportunities.map((op, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{op}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prospect types */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs mb-3">
                  <Users className="w-4 h-4" />
                  Recommended Prospect Types
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {analysis.recommendedProspectTypes.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Flow CTAs */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Ready to transform these insights into target criteria and live leads?
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onGoToIcp}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Target className="w-4 h-4 text-blue-400" />
                  <span>Generate ICP</span>
                </button>
                <button
                  onClick={onGoToFindLeads}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Find Matching Leads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
