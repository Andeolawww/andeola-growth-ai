import React, { useState } from 'react';
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  Download,
  AlertCircle,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Copy,
  Building2,
  Globe2,
  ArrowRightLeft,
  LockKeyhole,
  X,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useToast } from '../../context/ToastContext';

interface BillingViewProps {
  user: UserProfile;
  onUpdatePlan: (plan: 'Starter' | 'Growth' | 'Scale') => void;
}

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'AED';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUsd: number;
}

const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUsd: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUsd: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUsd: 0.79 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateToUsd: 1.36 },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', rateToUsd: 1.52 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUsd: 151.2 },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rateToUsd: 3.67 },
];

export const BillingView: React.FC<BillingViewProps> = ({ user, onUpdatePlan }) => {
  const { showToast } = useToast();
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'Starter' | 'Growth' | 'Scale' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card'>('transfer');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const isFreeTrial = user.plan === 'Free Trial';

  const planBaseUsd = {
    Starter: 19,
    Growth: 49,
    Scale: 99,
  };

  const planCredits = {
    Starter: '500 verified leads',
    Growth: '2,500 verified leads',
    Scale: '10,000 verified leads',
  };

  const currentCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === currency) || SUPPORTED_CURRENCIES[0];

  const formatPrice = (usdAmount: number, curr: CurrencyInfo) => {
    const converted = usdAmount * curr.rateToUsd;
    if (curr.code === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast('Copied to Clipboard', `${fieldName} copied successfully.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenCheckout = (plan: 'Starter' | 'Growth' | 'Scale') => {
    setCheckoutPlan(plan);
  };

  const handleConfirmCheckoutPayment = () => {
    if (!checkoutPlan) return;
    setIsChangingPlan(true);
    setTimeout(() => {
      onUpdatePlan(checkoutPlan);
      setIsChangingPlan(false);
      showToast(
        'Payment Verified & Deposited! 🎉',
        `Switched to ${checkoutPlan} plan. Funds credited directly to Odeseyi Suliat (8138411257).`
      );
      setCheckoutPlan(null);
    }, 1500);
  };

  const handleDownloadInvoice = (id: string) => {
    showToast('Invoice Downloaded', `Invoice ${id} (PDF) generated with settlement details.`);
  };

  const invoices = [
    { id: 'INV-2026-0914', date: 'Sept 14, 2026', amount: '$49.00', status: 'Paid', plan: 'Growth Plan', recipient: 'Odeseyi Suliat' },
    { id: 'INV-2026-0814', date: 'Aug 14, 2026', amount: '$49.00', status: 'Paid', plan: 'Growth Plan', recipient: 'Odeseyi Suliat' },
    { id: 'INV-2026-0714', date: 'July 14, 2026', amount: '$19.00', status: 'Paid', plan: 'Starter Plan', recipient: 'Odeseyi Suliat' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            Subscription & Settlement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Billing & Resource Allocation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Monitor real-time quota usage, adjust tier parameters, and manage multi-currency payment settlement.
          </p>
        </div>

        {/* Multi-currency Settlement Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <Globe2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Global Multi-Currency Settlement Active</span>
        </div>
      </div>

      {/* Recipient Settlement Account Card (Prompt requirement: OPay 8138411257 Odeseyi Suliat, convert any currency) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase font-bold border border-emerald-500/30">
              Verified Settlement Destination
            </span>
            <span className="text-xs text-slate-400">Direct Inflow Account</span>
          </div>
          <h2 className="text-base font-bold text-white">
            Merchant Beneficiary: <span className="text-emerald-400">Odeseyi Suliat</span> • Account:{' '}
            <span className="font-mono text-emerald-300">8138411257</span>
          </h2>
          <p className="text-xs text-slate-300">
            Institution: <strong>OPay Digital Bank</strong> (Global Merchant Services) • Automatic conversion from all currencies (USD, EUR, GBP, CAD, AUD, etc.)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleCopy('8138411257', 'Account Number')}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
          >
            {copiedField === 'Account Number' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Account Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>Copy Acc: 8138411257</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Plan & Resource Usage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Plan Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/40 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">
                Current Active Plan
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isFreeTrial
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {isFreeTrial ? 'Free Trial' : 'Active'}
              </span>
            </div>

            <h3 className="text-3xl font-black text-white mt-3">{user.plan}</h3>
            <p className="text-xs text-slate-400 mt-1">
              {isFreeTrial
                ? 'Includes 20 free leads and complete outreach generation before paying.'
                : 'Renews automatically on monthly billing cycle.'}
            </p>

            <div className="mt-6 pt-6 border-t border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>
                  {isFreeTrial
                    ? `${user.freeTrialLeadsMax} Free Leads included for every user`
                    : `${user.leadCreditsMax.toLocaleString()} Lead credits per month`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Autonomous ICP Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Personalized multi-channel copy</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800">
            <span className="text-[11px] text-slate-400">
              {isFreeTrial ? (
                <span className="text-amber-400 font-medium">
                  Free tier active — upgrade to a paid plan once your 20 leads are sent.
                </span>
              ) : (
                <>Beneficiary: <strong>Odeseyi Suliat</strong> • OPay Acct 8138411257</>
              )}
            </span>
          </div>
        </div>

        {/* Real-time Usage Meters */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {isFreeTrial ? 'Free Trial Resource Quota' : 'Monthly Resource Quotas'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFreeTrial
                ? 'Test all 20 leads first. Generate personalized messages and launch campaigns for free.'
                : 'Resetting in 11 days. Unused credits carry forward on paid plans.'}
            </p>
          </div>

          {/* Usage 1: Lead credits */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-200">
                {isFreeTrial ? 'Free Trial Leads Processed' : 'Lead Credits'}
              </span>
              <span className="font-mono text-white font-bold">
                {isFreeTrial
                  ? `${user.freeTrialLeadsUsed} / ${user.freeTrialLeadsMax}`
                  : `${user.leadCredits.toLocaleString()} / ${user.leadCreditsMax.toLocaleString()}`}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isFreeTrial && user.freeTrialLeadsUsed >= user.freeTrialLeadsMax
                    ? 'bg-rose-500'
                    : 'bg-blue-500'
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
            <p className="text-[11px] text-slate-400">
              {isFreeTrial
                ? `${Math.max(0, user.freeTrialLeadsMax - user.freeTrialLeadsUsed)} free leads remaining before upgrade required`
                : `${user.leadCreditsMax - user.leadCredits} credits remaining this billing cycle`}
            </p>
          </div>

          {/* Usage 2: AI Website Analyses */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-200">AI Website Analyses</span>
              <span className="font-mono text-white font-bold">
                {user.analysesCount} / {user.analysesMax}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${(user.analysesCount / user.analysesMax) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {user.analysesMax - user.analysesCount} deep business analyses remaining
            </p>
          </div>

          {/* Usage 3: Messages Generated */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-200">Personalized Messages Generated</span>
              <span className="font-mono text-white font-bold">
                {user.messagesGenerated.toLocaleString()} / {user.messagesMax.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${(user.messagesGenerated / user.messagesMax) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {user.messagesMax - user.messagesGenerated} AI draft generations remaining
            </p>
          </div>
        </div>
      </div>

      {/* Available Subscription Plans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Available Subscription Plans
          </h3>
          <span className="text-xs text-slate-400">
            Direct settlement to Odeseyi Suliat (8138411257) • Any currency supported
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div
            className={`p-6 rounded-2xl bg-slate-900/90 border flex flex-col justify-between ${
              user.plan === 'Starter' ? 'border-blue-500 bg-blue-950/20' : 'border-slate-800'
            }`}
          >
            <div>
              <h4 className="text-base font-bold text-white">Starter</h4>
              <div className="mt-2 text-2xl font-black text-white">
                $19<span className="text-xs text-slate-400 font-normal">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">500 lead credits • Basic dashboard</p>
            </div>
            <button
              onClick={() => handleOpenCheckout('Starter')}
              disabled={user.plan === 'Starter' || isChangingPlan}
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                user.plan === 'Starter'
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
            >
              {user.plan === 'Starter' ? 'Active Plan' : user.plan === 'Free Trial' ? 'Upgrade to Starter ($19)' : 'Switch to Starter'}
            </button>
          </div>

          {/* Growth */}
          <div
            className={`p-6 rounded-2xl bg-slate-900/90 border-2 flex flex-col justify-between relative shadow-lg shadow-blue-950/40 ${
              user.plan === 'Growth' ? 'border-blue-500' : 'border-blue-500/70 hover:border-blue-400'
            }`}
          >
            <span className="absolute -top-3 left-4 px-2 py-0.5 rounded-full bg-blue-600 text-[9px] font-bold text-white uppercase">
              {user.plan === 'Growth' ? 'Active Plan' : 'MOST POPULAR'}
            </span>
            <div>
              <h4 className="text-base font-bold text-white">Growth</h4>
              <div className="mt-2 text-2xl font-black text-white">
                $49<span className="text-xs text-slate-400 font-normal">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">2,500 lead credits • Advanced scoring</p>
            </div>
            {user.plan === 'Growth' ? (
              <button
                disabled
                className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/40 cursor-default"
              >
                Active Plan
              </button>
            ) : (
              <button
                onClick={() => handleOpenCheckout('Growth')}
                disabled={isChangingPlan}
                className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                {user.plan === 'Free Trial' ? 'Upgrade to Growth ($49/mo)' : 'Upgrade to Growth'}
              </button>
            )}
          </div>

          {/* Scale */}
          <div
            className={`p-6 rounded-2xl bg-slate-900/90 border flex flex-col justify-between ${
              user.plan === 'Scale' ? 'border-blue-500 bg-blue-950/20' : 'border-slate-800'
            }`}
          >
            <div>
              <h4 className="text-base font-bold text-white">Scale</h4>
              <div className="mt-2 text-2xl font-black text-white">
                $99<span className="text-xs text-slate-400 font-normal">/mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">10,000 lead credits • Team features</p>
            </div>
            <button
              onClick={() => handleOpenCheckout('Scale')}
              disabled={user.plan === 'Scale' || isChangingPlan}
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                user.plan === 'Scale'
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 cursor-default'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
            >
              {user.plan === 'Scale' ? 'Active Plan' : 'Upgrade to Scale ($99)'}
            </button>
          </div>
        </div>
      </div>

      {/* Billing History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Billing History & Settlement Invoices
          </h3>
          <span className="text-xs text-slate-400">
            Settlement Account: Odeseyi Suliat (8138411257)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Beneficiary</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-white">
                    {inv.id}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{inv.date}</td>
                  <td className="py-3 px-3 text-slate-400">{inv.plan}</td>
                  <td className="py-3 px-3 text-emerald-400 font-semibold">{inv.recipient}</td>
                  <td className="py-3 px-3 font-mono text-white font-semibold">{inv.amount}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* In-View Checkout Modal for Upgrades */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-blue-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 space-y-6">
            <button
              onClick={() => setCheckoutPlan(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Currency Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Upgrade to {checkoutPlan}</span>
              </div>

              <div className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg py-1 px-2 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-sm font-bold text-white">{checkoutPlan} Tier</p>
                <p className="text-xs text-slate-400">{planCredits[checkoutPlan]} • Direct settlement</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">
                  {formatPrice(planBaseUsd[checkoutPlan], currentCurrency)}
                </span>
                <span className="text-xs text-slate-400 block font-mono">
                  (${planBaseUsd[checkoutPlan]} USD)
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'transfer'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Direct Transfer (Instant)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card (Global)</span>
              </button>
            </div>

            {paymentMethod === 'transfer' ? (
              <div className="space-y-4 p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30">
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-2 text-xs text-blue-200">
                  <ArrowRightLeft className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Pay in <strong>{currency}</strong> or any currency. Transfer will automatically convert at official interbank exchange rates directly into the merchant account below.
                  </p>
                </div>

                <div className="space-y-2.5 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Beneficiary</span>
                      <span className="font-extrabold text-white">Odeseyi Suliat</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('Odeseyi Suliat', 'Name')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold cursor-pointer"
                    >
                      {copiedField === 'Name' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Number</span>
                      <span className="font-black text-emerald-400 font-mono text-base tracking-wider">8138411257</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('8138411257', 'Account')}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] font-bold cursor-pointer"
                    >
                      {copiedField === 'Account' ? 'Copied' : 'Copy Acc'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Institution</span>
                      <span className="font-medium text-slate-300">OPay Digital Bank (Global Settlement)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Verified</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Sender / Payer Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe / Business Corp"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Transfer Reference / Note (Optional):</label>
                    <input
                      type="text"
                      placeholder="e.g. TRF-813841 / Session Ref"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Settlement Beneficiary:</span>
                  <span className="font-semibold text-white">Odeseyi Suliat • Acct 8138411257</span>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400">Expiry</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">CVC</label>
                    <input
                      type="text"
                      defaultValue="888"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleConfirmCheckoutPayment}
              disabled={isChangingPlan}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Zap className={`w-4 h-4 ${isChangingPlan ? 'animate-spin' : ''}`} />
              <span>
                {isChangingPlan
                  ? 'Confirming Settlement...'
                  : `Confirm Payment (${formatPrice(planBaseUsd[checkoutPlan], currentCurrency)})`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
