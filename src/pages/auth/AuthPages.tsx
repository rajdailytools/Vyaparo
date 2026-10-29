import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

interface AuthNavProp {
  onNavigate: (path: string) => void;
}

// 1. LOGIN PAGE
export const LoginPage: React.FC<AuthNavProp> = ({ onNavigate }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('rajdailytools@gmail.com');
  const [password, setPassword] = useState('vyaparo2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, 'Raj Sharma');
      setLoading(false);
      onNavigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FFF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="cursor-pointer inline-block" onClick={() => onNavigate('/')}>
          <Logo variant="full" size="md" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-[#0B2E26]">Sign in to your Business Account</h2>
        <p className="mt-2 text-xs text-[#61736A]">
          Manage billing, inventory, and customer udhaar.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#DCE9E1] rounded-3xl sm:px-10 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#61736A] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#61736A] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="name@business.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#61736A]">Password</label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-[11px] font-bold text-[#0F8F5F] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#61736A] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-[#DCE9E1]">
            <button
              type="button"
              onClick={() => {
                login('rajdailytools@gmail.com', 'Raj Sharma');
                onNavigate('/dashboard');
              }}
              className="w-full bg-[#E8F9F0] hover:bg-[#d7f5e3] text-[#0F8F5F] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>⚡ One-Click Demo Login (Raj Kirana)</span>
            </button>
          </div>

          <div className="text-center text-xs text-[#61736A]">
            Don't have an account yet?{' '}
            <button
              onClick={() => onNavigate('/signup')}
              className="font-bold text-[#0F8F5F] hover:underline"
            >
              Create free workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. SIGNUP PAGE
export const SignupPage: React.FC<AuthNavProp> = ({ onNavigate }) => {
  const { login } = useApp();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(formData.email, formData.fullName || 'Merchant');
      setLoading(false);
      onNavigate('/onboarding');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FFF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="cursor-pointer inline-block" onClick={() => onNavigate('/')}>
          <Logo variant="full" size="md" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-[#0B2E26]">Create Your Free Vyaparo Account</h2>
        <p className="mt-2 text-xs text-[#61736A]">
          Set up your store in 2 minutes. Free forever tier included.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#DCE9E1] rounded-3xl sm:px-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#61736A] mb-1">Your Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#61736A] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="e.g. Ramesh Patel"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#61736A] mb-1">Mobile / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                placeholder="+91 98200 12345"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#61736A] mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#61736A] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="name@business.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#61736A] mb-1">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#61736A] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#A7F432] hover:bg-[#93e01d] text-[#0B2E26] py-3 rounded-xl font-extrabold text-xs shadow-md transition-colors"
            >
              <span>{loading ? 'Creating Account...' : 'Continue to Store Setup'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#61736A]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('/login')}
              className="font-bold text-[#0F8F5F] hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. FORGOT PASSWORD
export const ForgotPasswordPage: React.FC<AuthNavProp> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FFF9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="cursor-pointer inline-block" onClick={() => onNavigate('/')}>
          <Logo variant="full" size="md" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-[#0B2E26]">Reset Your Password</h2>
        <p className="mt-2 text-xs text-[#61736A]">
          Enter your registered email to receive recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#DCE9E1] rounded-3xl sm:px-10 space-y-6">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="w-10 h-10 bg-[#E8F9F0] text-[#0F8F5F] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-[#0B2E26]">Recovery Email Dispatched</h4>
              <p className="text-xs text-[#61736A]">
                Check your inbox at <strong>{email}</strong> for instructions to set your new password.
              </p>
              <button
                onClick={() => onNavigate('/login')}
                className="mt-4 text-xs font-bold text-[#0F8F5F] hover:underline block mx-auto"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#61736A] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3.5 py-2.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
                  placeholder="name@business.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F8F5F] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#0B2E26] transition-colors"
              >
                Send Password Reset Link
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full text-center text-xs font-bold text-[#61736A] hover:text-[#0B2E26]"
              >
                Cancel and return to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
