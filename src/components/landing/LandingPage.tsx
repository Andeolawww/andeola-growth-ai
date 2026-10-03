import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Globe,
  Users,
  Target,
  Send,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Layers,
  Search,
  MessageSquare,
  Shield,
  Zap,
  Building2,
  Store,
  Briefcase,
  Cpu,
  LineChart,
  Check,
  TrendingUp,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onAnalyzeUrl: (url: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onAnalyzeUrl,
}) => {
  const [heroUrl, setHeroUrl] = useState('examplefashionstore.com');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroUrl.trim()) {
      onAnalyzeUrl(heroUrl.trim());
    } else {
      onGetStarted();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    {
      name: 'Ecommerce',
      icon: Store,
      desc: 'Boutique retailers, direct-to-consumer labels, and modern retail suppliers.',
      example: 'Discover retail buyers & European boutique concept stores.',
    },
    {
      name: 'Agencies',
      icon: Layers,
      desc: 'Performance marketing, creative studios, and specialized dev shops.',
      example: 'Pinpoint scale-ups needing dedicated retainer services.',
    },
    {
      name: 'Consultants',
      icon: Briefcase,
      desc: 'Strategic management, financial advisors, and operational specialists.',
      example: 'Identify mid-market CEOs seeking operational transformation.',
    },
    {
      name: 'SaaS',
      icon: Cpu,
      desc: 'B2B subscription products, developer platforms, and cloud utilities.',
      example: 'Target decision-makers with verifiable buying signals.',
    },
    {
      name: 'Professional Services',
      icon: Building2,
      desc: 'Legal, accounting, logistics, and enterprise corporate partners.',
      example: 'Find high-intent commercial clients without cold database spam.',
    },
    {
      name: 'B2B Businesses',
      icon: LineChart,
      desc: 'Wholesale distributors, manufacturing suppliers, and corporate vendors.',
      example: 'Connect with active procurement directors across key regions.',
    },
  ];

  const features = [
    {
      title: 'AI Website Analysis',
      icon: Globe,
      desc: 'Understands your exact business model, products, pricing positioning, and market focus in seconds.',
    },
    {
      title: 'Ideal Customer Profile',
      icon: Target,
      desc: 'Generates deep ICP parameters including company size, decision-maker roles, budgets, and trigger buying signals.',
    },
    {
      title: 'Lead Discovery',
      icon: Search,
      desc: 'Surfaces verified business prospects pre-aligned with your specific product offerings and industry criteria.',
    },
    {
      title: 'Lead Scoring',
      icon: Sparkles,
      desc: 'Calculates dynamic relevance percentages (e.g. 96%, 93%) so your sales reps focus solely on highest-conviction accounts.',
    },
    {
      title: 'AI Personalization',
      icon: MessageSquare,
      desc: 'Drafts bespoke multi-channel copy for email, LinkedIn, and DMs tailored to each prospect’s observable challenges.',
    },
    {
      title: 'Campaign Management',
      icon: Send,
      desc: 'Organize prospects into multi-stage outreach campaigns with live delivery simulations and stage tracking.',
    },
    {
      title: 'Analytics Dashboard',
      icon: BarChart3,
      desc: 'Monitor prospect conversion rates, pipeline velocity, channel effectiveness, and booked meeting metrics.',
    },
    {
      title: 'Saved Prospects',
      icon: Users,
      desc: 'Curate custom target account lists, tag high-priority stakeholders, and export prospect segments effortlessly.',
    },
  ];

  const faqs = [
    {
      q: 'What is Andeola Growth AI?',
      a: 'Andeola Growth AI is an autonomous customer prospecting and outreach platform. By simply entering your website URL, our intelligence engine analyzes what you sell, crafts an Ideal Customer Profile (ICP), matches relevant business leads, scores them for buying intent, and creates personalized multi-channel outreach copy.',
    },
    {
      q: 'How does the website analysis work?',
      a: 'Our intelligence layer examines your publicly accessible digital positioning, product catalog, value propositions, and market tone. It categorizes your business model (e.g., DTC Shopify Store, B2B SaaS, Agency Retainer) and derives the exact profile of accounts most likely to buy.',
    },
    {
      q: 'Where does lead information come from?',
      a: 'In this prototype version, demonstration lead data is provided to showcase the complete workflow end-to-end. The platform is architected with a modular service layer ready to connect directly to enterprise B2B data providers (such as Apollo, Clearbit, Clay, or LinkedIn Sales Navigator) without altering your workflows.',
    },
    {
      q: 'Can I connect my own lead database?',
      a: 'Yes! The architecture is decoupled so you can connect custom CRM databases, CSV lists, or API webhooks into your Saved Leads and Campaigns tabs.',
    },
    {
      q: 'Can I send emails directly from the platform?',
      a: 'Andeola Growth AI generates the copy and organizes campaigns. In this MVP, launching simulates outreach performance. You can copy or export messages directly, or later hook up providers like SendGrid, Resend, Instantly, or Smartlead via the Settings tab.',
    },
    {
      q: 'How are credits calculated?',
      a: 'Each lead discovery record costs 1 credit. Deep AI website analyses and personalized multi-channel message generations draw from your monthly quota. Unused credits rollover on active paid subscriptions.',
    },
    {
      q: 'Can I cancel my subscription?',
      a: 'Yes, subscriptions can be paused or cancelled at any time from the Billing page with zero penalties. You retain access to your saved prospects and campaign history.',
    },
    {
      q: 'Is my business data secure?',
      a: 'Absolutely. We only inspect public domain information. Your proprietary lead lists, personalized message templates, and campaign telemetry remain private to your workspace.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <BrandLogo size="md" />

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:shadow-blue-600/40 cursor-pointer flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-violet-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Autonomous Prospecting & Outreach
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Turn Your Website Into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
              Customer-Finding Machine.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Analyze your business, discover your first <strong>20 verified leads for free</strong>, and dispatch personalized outreach before you pay a dime.
          </p>

          {/* URL Input Form Teaser */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form
              onSubmit={handleHeroSubmit}
              className="p-1.5 sm:p-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-4" />
                <input
                  type="text"
                  value={heroUrl}
                  onChange={(e) => setHeroUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full bg-transparent pl-12 pr-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Start With 20 Free Leads</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                20 Free Leads Per User
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Send outreach before you pay
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                No credit card required
              </span>
            </div>
          </div>

          {/* Interactive Visual Product Mockup */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl p-4 sm:p-6 text-left">
              {/* Window controls bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">
                    andeolagrowth.ai/workspace/analyzer
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Engine Active
                  </span>
                </div>
              </div>

              {/* Mockup Content Requested in Prompt */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Card: Input & Analysis */}
                <div className="md:col-span-5 bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Analyzed Domain
                    </span>
                    <span className="text-[11px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                      examplefashionstore.com
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">AI Analysis:</span>
                      <span className="font-semibold text-slate-200">Fashion Ecommerce</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Market:</span>
                      <span className="font-semibold text-slate-200">European consumers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ideal Customers:</span>
                      <span className="font-semibold text-slate-200">18–35</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Business Type:</span>
                      <span className="font-semibold text-slate-200">DTC Shopify Store</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>1,248 potential prospects identified</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Scored against boutique wholesale & department store buyers across UK, Germany, and France.
                    </p>
                  </div>
                </div>

                {/* Right Card: Live Prospect Feed Sample */}
                <div className="md:col-span-7 bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-semibold text-white">
                        High-Conviction Leads (Demonstration)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Sorted by match score</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">Northstar Commerce</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                            United Kingdom
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Sarah Mitchell • Founder & Managing Director
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          96% Match
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">Atlas Digital</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                            Germany
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Daniel Carter • CEO & Head of Partnerships
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          93% Match
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">Nova Retail</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                            France
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Emma Wilson • Founder & Chief Buyer
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          91% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Personalized multi-channel outreach ready to launch
                    </span>
                    <button
                      onClick={onGetStarted}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      Open Live Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section (Neutral categories as instructed) */}
      <section className="py-16 border-y border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            Target Audience Focus
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Built for teams that want smarter prospecting
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
            Tailored outbound intelligence adapted to the commercial dynamics of modern businesses.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-left transition-all hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                  <div className="mt-3 pt-3 border-t border-slate-800/70 text-[11px] font-medium text-blue-300/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {cat.example}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (4-Step section as requested) */}
      <section id="how-it-works" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Workflow Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto mt-3">
            Four simple steps to transform your online presence into targeted pipeline.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-6 text-left relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-3">
                  Step 1
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Connect Your Website</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Enter your business website URL. No complex scripts or tag manager installations needed.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Takes 5 seconds
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-3">
                  Step 2
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Let AI Understand Your Business</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  AI analyzes your products, services, positioning, audience, and market value proposition.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Deep ICP synthesized
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-3">
                  Step 3
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Discover Relevant Prospects</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Find verified prospects that match your ideal customer profile with transparent match scores.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Relevance-first matching
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-3">
                  Step 4
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Personalize Your Outreach</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Generate relevant, authentic messages based on each prospect's verifiable company context.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Multi-channel ready
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <button
              onClick={onGetStarted}
              className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 inline-flex items-center gap-2 cursor-pointer"
            >
              Start With Your Website
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Comprehensive Platform
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Precision Outbound
            </h2>
            <p className="text-slate-400 text-base mt-3">
              Everything high-growth teams need to scale authentic business conversations without the noise.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Predictable Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Plans for Every Growth Stage
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mt-3">
            Start free with our prototype and unlock advanced scoring as your pipeline demands increase.
          </p>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left max-w-7xl mx-auto">
            {/* Free Trial: 20 Leads First */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/30 to-slate-900 border border-blue-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-wide">FREE TRIAL</h3>
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    20 Leads Free
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400">/first 20 leads</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Try 20 verified leads and dispatch personalized outreach before paying.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-semibold text-blue-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>20 Free lead credits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI website analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Full ICP generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Outreach for all 20 leads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Simulated campaign dispatch</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer text-center shadow-md shadow-blue-600/30"
                >
                  Start With 20 Free Leads
                </button>
              </div>
            </div>

            {/* Starter Plan */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-wide">STARTER</h3>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$19</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Ideal for solo founders testing new markets and customer angles.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>500 lead credits / mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI website analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ICP generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Lead discovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI message generation</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer border border-slate-700 text-center"
                >
                  Start Starter ($19)
                </button>
              </div>
            </div>

            {/* Growth Plan (Most Popular) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500 relative flex flex-col justify-between shadow-2xl shadow-blue-950/50">
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                MOST POPULAR
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-wide">GROWTH</h3>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$49</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Best for growing companies scaling regular outbound pipeline.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-semibold text-blue-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>2,500 lead credits / mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Everything in Starter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Advanced lead scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Campaign management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Personalized outreach</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-blue-600/30 text-center"
                >
                  Start Growth ($49)
                </button>
              </div>
            </div>

            {/* Scale Plan */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-wide">SCALE</h3>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$99</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  For sales teams requiring maximum volume and priority.
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-semibold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>10,000 lead credits / mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Everything in Growth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Advanced campaigns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Team features</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer border border-slate-700 text-center"
                >
                  Start Scale ($99)
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-8 italic">
            * Pricing is a prototype and can be changed later.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm mt-2">
              Everything you need to know about the platform, data handling, and integrations.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="border border-slate-800 rounded-xl bg-slate-900/80 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left font-semibold text-sm text-slate-200 flex items-center justify-between gap-4 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Conversion CTA Banner */}
      <section className="py-16 md:py-20 border-t border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to find the right customers with AI?
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mt-3">
            Connect your website today. Experience how autonomous business analysis powers higher-converting outbound pipeline.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              Start Finding Leads Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onSignIn}
              className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700 cursor-pointer w-full sm:w-auto"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <BrandLogo size="sm" />
            <p className="mt-1 text-slate-400">
              Find the right customers. Reach them with relevance. Grow with AI.
            </p>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white">
              How It Works
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-white">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white">
              Pricing
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white">
              FAQ
            </button>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500 font-mono text-[10px]">MVP Prototype v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
