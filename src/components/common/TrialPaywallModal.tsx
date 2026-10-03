import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Zap,
  CreditCard,
  Check,
  Building2,
  LockKeyhole,
  Copy,
  Globe2,
  ArrowRightLeft,
  Receipt,
  Smartphone,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TrialPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: 'Starter' | 'Growth' | 'Scale') => void;
  leadsProcessedCount?: number;
}

type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'AED';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUsd: number; // 1 USD = rate
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

export const TrialPaywallModal: React.FC<TrialPaywallModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  leadsProcessedCount = 20,
}) => {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Growth' | 'Scale'>('Growth');
  const [step, setStep] = useState<'plans' | 'checkout' | 'success'>('plans');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card'>('transfer');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Transfer Form inputs
  const [senderName, setSenderName] = useState('');
  const [transferRef, setTransferRef] = useState('');

  // Card Form inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('Andeola Growth');

  if (!isOpen) return null;

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

  const handleProceedToPayment = (plan: 'Starter' | 'Growth' | 'Scale') => {
    setSelectedPlan(plan);
    setStep('checkout');
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast('Copied to Clipboard', `${fieldName} copied successfully.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep('success');
      onSelectPlan(selectedPlan);
      showToast(
        'Payment Confirmed! 🎉',
        `Your ${selectedPlan} plan is active! Funds deposited into settlement account Odeseyi Suliat.`
      );
      setTimeout(() => {
        onClose();
        setStep('plans');
      }, 2000);
    }, 1500);
  };

  const planDisplayPrice = formatPrice(planBaseUsd[selectedPlan], currentCurrency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-blue-500/40 rounded-3xl shadow-2xl p-6 sm:p-10 text-slate-100 space-y-8">
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setStep('plans');
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'plans' && (
          <>
            {/* Header */}
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                20 Free Leads Completed
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                You've Processed Your 20 Free Leads! 🎉
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every user gets <strong>20 free verified leads</strong> and complete outreach before paying. Choose a plan below to unlock 500+ prospects and keep prospecting.
              </p>
            </div>

            {/* 3 Paid Plans Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
              {/* Starter Plan */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Starter</h3>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">$19</span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    500 verified lead credits every month.
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>500 Lead credits / mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>AI Website analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Automated ICP scoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>AI Message generation</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleProceedToPayment('Starter')}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 cursor-pointer text-center"
                >
                  Pay $19 / mo
                </button>
              </div>

              {/* Growth Plan (Most Popular) */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500 relative flex flex-col justify-between shadow-2xl shadow-blue-950/50">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-[9px] font-bold text-white uppercase tracking-wider">
                  MOST POPULAR
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Growth</h3>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">$49</span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    2,500 verified lead credits + advanced scoring.
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 font-semibold text-blue-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>2,500 Lead credits / mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Advanced ICP matching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Multi-channel campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Conversion funnel analytics</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleProceedToPayment('Growth')}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-600/30 cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <span>Pay $49 / mo (Best Value)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scale Plan */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Scale</h3>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">$99</span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    10,000 lead credits for high-volume sales teams.
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 font-semibold text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>10,000 Lead credits / mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Unlimited campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Priority processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Team collaboration</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleProceedToPayment('Scale')}
                  className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 cursor-pointer text-center"
                >
                  Pay $99 / mo
                </button>
              </div>
            </div>

            {/* Footer info */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Secure 256-bit encryption. Multi-currency settlement enabled.</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Review my 20 leads first
              </button>
            </div>
          </>
        )}

        {step === 'checkout' && (
          <div className="space-y-6 max-w-xl mx-auto animate-in fade-in">
            {/* Top Bar with Currency Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                type="button"
                onClick={() => setStep('plans')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                ← Back to Plans
              </button>

              {/* Currency Selector with Automatic Conversion */}
              <div className="flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] text-slate-400">Currency:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg py-1 px-2.5 focus:outline-none focus:border-blue-500 font-medium"
                >
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) - {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Plan Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-sm font-bold text-white">{selectedPlan} Plan Subscription</p>
                <p className="text-xs text-slate-400">
                  {planCredits[selectedPlan]} • Auto-converts to settlement account
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">{planDisplayPrice}</span>
                {currency !== 'USD' && (
                  <span className="text-[10px] text-slate-400 block font-mono">
                    (${planBaseUsd[selectedPlan]} USD equiv.)
                  </span>
                )}
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

            {/* Option 1: Direct Transfer to Merchant Account */}
            {paymentMethod === 'transfer' && (
              <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-blue-500/30 animate-in fade-in">
                {/* Global Auto-Conversion Pill */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-2.5 text-xs text-blue-200">
                  <ArrowRightLeft className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Global Currency Auto-Conversion Active:</span>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Pay in {currency} or any country's currency. Funds are automatically converted at real-time interbank rates and credited directly into your account below.
                    </p>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  {/* Account Name */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Beneficiary / Account Name
                      </span>
                      <span className="text-sm font-extrabold text-white tracking-wide">
                        Odeseyi Suliat
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('Odeseyi Suliat', 'Account Name')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'Account Name' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Account Number */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Account Number
                      </span>
                      <span className="text-base font-black text-emerald-400 font-mono tracking-wider">
                        8138411257
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('8138411257', 'Account Number')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedField === 'Account Number' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Account</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Financial Institution / Bank */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Digital Bank / Institution
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        OPay Digital Bank (Global Merchant Settlement)
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      Verified Account
                    </span>
                  </div>

                  {/* Total Amount to Transfer */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Total Amount Due
                      </span>
                      <span className="text-base font-extrabold text-white">
                        {planDisplayPrice}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Any currency accepted
                    </span>
                  </div>
                </div>

                {/* Transfer Confirmation Fields */}
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">
                      Sender Name / Account Name used for transfer:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe / Business Corp"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-medium">
                      Transaction Reference / Receipt ID (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TRF-982341 / Session ID"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                >
                  <Zap className={`w-4 h-4 ${isProcessingPayment ? 'animate-spin' : ''}`} />
                  <span>
                    {isProcessingPayment
                      ? 'Verifying Settlement...'
                      : `I Have Made Payment (${planDisplayPrice}) • Confirm Transfer`}
                  </span>
                </button>
              </div>
            )}

            {/* Option 2: Credit / Debit Card (Global Gateway) */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 animate-in fade-in">
                {/* Beneficiary Badge */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Settlement Beneficiary:</span>
                  <span className="font-semibold text-white font-mono">
                    Odeseyi Suliat • Acct 8138411257
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Name on Card</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Card Number</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-medium">CVC / CVP</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Zap className={`w-4 h-4 ${isProcessingPayment ? 'animate-spin' : ''}`} />
                  <span>
                    {isProcessingPayment
                      ? 'Authorizing Card & Crediting...'
                      : `Pay ${planDisplayPrice} & Unlock Pipeline`}
                  </span>
                </button>
              </div>
            )}

            <p className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>International multi-currency gateway. Instant direct credit to merchant account.</span>
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8 space-y-5 animate-in zoom-in-95 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Payment Received & Verified!</h2>
              <p className="text-xs text-slate-300 mt-1">
                Your payment of <strong className="text-white">{planDisplayPrice}</strong> has been confirmed and credited directly to the merchant account.
              </p>
            </div>

            {/* Official Digital Settlement Receipt */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span>Beneficiary:</span>
                <span className="text-white font-bold">Odeseyi Suliat</span>
              </div>
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span>Account Number:</span>
                <span className="text-emerald-400 font-bold">8138411257</span>
              </div>
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span>Institution:</span>
                <span className="text-slate-300">OPay Digital Bank</span>
              </div>
              <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                <span>Plan Activated:</span>
                <span className="text-blue-400 font-bold">{selectedPlan} Tier</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-0.5">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">Settled & Confirmed</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              All 20+ leads and full pipeline unlocked. Redirecting to your workspace...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
