import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string }) => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [name, setName] = useState('Andeola');
  const [email, setEmail] = useState('andeola@growthflow.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'forgot') {
        showToast('Password reset link sent', `A recovery link has been dispatched to ${email}`, 'info');
        setMode('signin');
      } else {
        showToast(
          mode === 'signup' ? 'Account created successfully' : 'Signed in successfully',
          `Welcome to Andeola Growth AI, ${name || 'Andeola'}!`
        );
        onSuccess({ name: name || 'Andeola', email });
        onClose();
      }
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Signed in with Demo Profile', 'Loaded sample website data and 2,486 prospects.');
      onSuccess({ name: 'Andeola', email: 'andeola@growthflow.io' });
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <BrandLogo size="lg" className="mb-3" />
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            {mode === 'signin' && 'Sign in to your workspace'}
            {mode === 'signup' && 'Create your Growth AI account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {mode === 'signin' && 'Access your business intelligence, qualified leads, and outreach campaigns.'}
            {mode === 'signup' && 'Start finding verified prospects with autonomous AI analysis.'}
            {mode === 'forgot' && 'Enter your registered email to receive a recovery token.'}
          </p>
        </div>

        {/* Quick Demo Sign In Box */}
        {mode !== 'forgot' && (
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Instant Prototype Access
              </span>
              <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded">
                Pre-filled Demo
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-1 mb-2.5">
              Skip typing and explore the full live workspace immediately.
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-900/30 cursor-pointer"
            >
              {isLoading ? 'Loading workspace...' : 'Continue as Andeola (Demo Lead)'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Mitchell"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600/80 text-white font-semibold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : (
              <>
                {mode === 'signin' && 'Sign In to Workspace'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          {mode === 'signin' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-blue-400 hover:text-blue-300 ml-1"
              >
                Sign up free
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-semibold text-blue-400 hover:text-blue-300 ml-1"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-semibold text-blue-400 hover:text-blue-300 ml-1"
              >
                Back to Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
