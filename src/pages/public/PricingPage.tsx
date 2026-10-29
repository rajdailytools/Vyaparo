import React, { useState } from 'react';
import { useLanguage } from '../../lib/i18n';
import { useApp, SUBSCRIPTION_PLANS } from '../../context/AppContext';
import { Check, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (path: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const { currentPlan, upgradePlan, user } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      onNavigate('/signup');
      return;
    }
    upgradePlan(planId);
    onNavigate('/dashboard/subscription');
  };

  const discountMultiplier = billingCycle === 'yearly' ? 0.8 : 1.0; // 20% discount on yearly

  return (
    <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F8F5F] bg-[#E8F9F0] px-3.5 py-1.5 rounded-full">
            Transparent Subscription Plans
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B2E26] tracking-tight">
            Simple, Affordable Pricing for Every Business
          </h1>
          <p className="text-base text-[#61736A]">
            No long-term contracts. Cancel or upgrade anytime directly from your dashboard.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center gap-3 bg-[#E8F9F0] p-1.5 rounded-full border border-[#DCE9E1] mt-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-[#0F8F5F] text-white shadow-sm' : 'text-[#61736A] hover:text-[#0B2E26]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-[#0F8F5F] text-white shadow-sm' : 'text-[#61736A] hover:text-[#0B2E26]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-[#A7F432] text-[#0B2E26] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentPlan.id === plan.id;
            const isPopular = plan.id === 'growth';
            const price = Math.round(plan.priceInr * discountMultiplier);

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? 'bg-[#0B2E26] text-white border-2 border-[#A7F432] shadow-2xl scale-102'
                    : 'bg-white text-[#15251F] border border-[#DCE9E1] shadow-xs hover:shadow-lg'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#A7F432] text-[#0B2E26] text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold uppercase tracking-wide ${isPopular ? 'text-[#A7F432]' : 'text-[#0F8F5F]'}`}>
                      {plan.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-[#E8F9F0] text-[#0F8F5F] px-2 py-0.5 rounded-full">
                        ACTIVE PLAN
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-4xl font-extrabold ${isPopular ? 'text-white' : 'text-[#0B2E26]'}`}>
                      ₹{price}
                    </span>
                    <span className={`text-xs ${isPopular ? 'text-[#E8F9F0]/70' : 'text-[#61736A]'}`}>
                      /{billingCycle === 'yearly' ? 'mo (billed annually)' : 'month'}
                    </span>
                  </div>

                  <p className={`text-xs mt-3 ${isPopular ? 'text-[#E8F9F0]/80' : 'text-[#61736A]'}`}>
                    {plan.id === 'free' && 'For single counter shops starting out.'}
                    {plan.id === 'starter' && 'For established neighborhood retailers.'}
                    {plan.id === 'growth' && 'For busy stores with staff & high invoice volume.'}
                    {plan.id === 'pro' && 'For high-volume wholesalers & distributors.'}
                  </p>

                  {/* Usage Quotas */}
                  <div className={`mt-6 pt-6 border-t ${isPopular ? 'border-[#0F8F5F]/40' : 'border-[#DCE9E1]'} space-y-2.5 text-xs`}>
                    <div className="flex justify-between">
                      <span className={isPopular ? 'text-[#E8F9F0]/70' : 'text-[#61736A]'}>Monthly Invoices:</span>
                      <span className="font-bold">{plan.invoiceLimit > 9999 ? 'Unlimited' : `${plan.invoiceLimit} bills`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isPopular ? 'text-[#E8F9F0]/70' : 'text-[#61736A]'}>Inventory Products:</span>
                      <span className="font-bold">{plan.productLimit > 9999 ? 'Unlimited' : `${plan.productLimit} items`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isPopular ? 'text-[#E8F9F0]/70' : 'text-[#61736A]'}>Team Staff Accounts:</span>
                      <span className="font-bold">{plan.teamLimit} user{plan.teamLimit > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isPopular ? 'text-[#E8F9F0]/70' : 'text-[#61736A]'}>AI Queries / Month:</span>
                      <span className="font-bold">{plan.aiQueriesLimit} queries</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-2.5 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className={`w-4 h-4 shrink-0 ${isPopular ? 'text-[#A7F432]' : 'text-[#0F8F5F]'}`} />
                        <span className={isPopular ? 'text-[#E8F9F0]' : 'text-[#15251F]'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-[#A7F432] text-[#0B2E26] hover:bg-[#94e320] shadow-md'
                        : isCurrent
                        ? 'bg-[#E8F9F0] text-[#0F8F5F] cursor-default'
                        : 'border border-[#0F8F5F] text-[#0F8F5F] hover:bg-[#E8F9F0]'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Plan' : plan.priceInr === 0 ? 'Start Free' : `Upgrade to ${plan.name}`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & FAQ Trust */}
        <div className="mt-16 bg-[#E8F9F0]/70 rounded-3xl p-8 border border-[#DCE9E1] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0F8F5F] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-[#0B2E26]">100% Risk-Free Guarantee</h4>
              <p className="text-xs text-[#61736A] mt-0.5">
                Every paid plan comes with a 14-day no-questions-asked refund policy. Payments are verified securely.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/contact')}
            className="text-xs font-bold text-[#0F8F5F] hover:underline shrink-0"
          >
            Have enterprise or wholesale needs? Contact sales →
          </button>
        </div>
      </div>
    </div>
  );
};
