import React from 'react';
import { useLanguage } from '../../lib/i18n';
import {
  Receipt,
  Users,
  Package,
  TrendingUp,
  Brain,
  ShieldCheck,
  Smartphone,
  Share2,
  Printer,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (path: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const featurePillars = [
    {
      icon: Receipt,
      tag: 'FAST BILLING & INVOICING',
      title: 'Generate GST & Retail Bills in Seconds',
      description:
        'Create professional itemized invoices with automated CGST/SGST/IGST tax splits, discount calculations, and payment tracking. Share bills instantly on WhatsApp or print via standard thermal or A4 printers.',
      highlights: [
        'Automatic invoice numbering sequence (customizable prefix)',
        'Supports both GST registered businesses and non-GST kiranas',
        'Direct 1-click WhatsApp bill sharing with payment link',
        'Line-item tax and discount customization',
      ],
    },
    {
      icon: Users,
      tag: 'UDHAAR & CREDIT LEDGER',
      title: 'Eliminate Unpaid Customer Credit',
      description:
        'Maintain a tamper-proof customer credit ledger. Record partial and full settlements, track overdue accounts with clear aging badges (e.g. "7 din se baki"), and send polite automated reminder notices.',
      highlights: [
        'Real-time customer balance calculations',
        'One-click WhatsApp payment reminders with your UPI ID',
        'Customer credit limits to prevent bad debts',
        'Full auditable payment settlement ledger',
      ],
    },
    {
      icon: Package,
      tag: 'REAL-TIME INVENTORY',
      title: 'Smart Stock & Low Inventory Alerts',
      description:
        'Every bill deducts stock automatically. Track opening stock, current levels, and purchase receipts in one place. Receive timely alerts before you run out of essential inventory.',
      highlights: [
        'Automatic stock deduction on finalized invoice generation',
        'Low-stock threshold triggers and reorder warnings',
        'Inventory valuation and cost of goods calculations',
        'Audit trail of every stock adjustment and inward purchase',
      ],
    },
    {
      icon: Brain,
      tag: 'AI BUSINESS ASSISTANT',
      title: 'Ask Questions About Your Business in Natural Hindi or English',
      description:
        'Powered by verified database records, the Vyaparo AI Assistant helps store owners understand sales trends, find which products have stalled, pinpoint overdue customers, and optimize profit margins.',
      highlights: [
        'Strictly grounded in your authenticated store records—never invents numbers',
        'Bilingual understanding (Ask in pure Hindi, English, or Hinglish)',
        'Analyzes largest expense categories and gross margins',
        'Provides actionable daily store improvement recommendations',
      ],
    },
    {
      icon: TrendingUp,
      tag: 'FINANCIAL REPORTS & P&L',
      title: 'Crystal Clear Profit, Expense & Cashflow Analytics',
      description:
        'No confusing accounting jargon. Vyaparo clearly separates actual revenue received, pending receivables (udhaar), operating expenses, and estimated gross profit so you always know your true earnings.',
      highlights: [
        'Daily, weekly, monthly, and custom date range filters',
        'Accurate Gross Profit estimates based on recorded purchase costs',
        'Category-wise expense breakdown (Rent, Transport, Salaries, Bills)',
        'Instant 1-click CSV data export for CA and tax preparation',
      ],
    },
  ];

  return (
    <div className="bg-[#F8FFF9] min-h-screen py-16 text-[#15251F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F8F5F] bg-[#E8F9F0] px-3.5 py-1.5 rounded-full">
            All Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B2E26] tracking-tight">
            Complete Toolkit Built for Indian Store Owners
          </h1>
          <p className="text-base sm:text-lg text-[#61736A]">
            Discover how Vyaparo combines billing, stock, udhaar, and smart AI insights into one intuitive platform.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-16">
          {featurePillars.map((feat, idx) => {
            const Icon = feat.icon;
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white p-8 sm:p-12 rounded-3xl border border-[#DCE9E1] shadow-xs`}
              >
                <div className={`lg:col-span-7 space-y-5 ${isReversed ? 'lg:order-2' : ''}`}>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F8F5F] bg-[#E8F9F0] px-3 py-1 rounded-full">
                    <Icon className="w-4 h-4" />
                    <span>{feat.tag}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E26] leading-tight">
                    {feat.title}
                  </h2>
                  <p className="text-[#61736A] text-sm sm:text-base leading-relaxed">
                    {feat.description}
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {feat.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#15251F]">
                        <span className="w-5 h-5 rounded-full bg-[#E8F9F0] text-[#0F8F5F] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <button
                      onClick={() => onNavigate('/signup')}
                      className="inline-flex items-center gap-2 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-6 py-3 rounded-full font-bold text-xs shadow-md transition-colors"
                    >
                      <span>Try This Feature Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className={`lg:col-span-5 bg-[#F8FFF9] rounded-2xl p-6 border border-[#DCE9E1] flex flex-col justify-center items-center text-center ${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="w-20 h-20 rounded-3xl bg-[#E8F9F0] flex items-center justify-center text-[#0F8F5F] mb-4 shadow-xs">
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-base text-[#0B2E26]">{feat.tag}</h3>
                  <p className="text-xs text-[#61736A] mt-1">100% synchronized with your live database records.</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center bg-[#0B2E26] text-white rounded-3xl p-10 space-y-5">
          <h2 className="text-3xl font-extrabold">Ready to take control of your store's finances?</h2>
          <p className="text-sm text-[#E8F9F0]/80 max-w-xl mx-auto">
            Get started in 2 minutes. No training or accounting degree required.
          </p>
          <button
            onClick={() => onNavigate('/signup')}
            className="inline-flex items-center gap-2 bg-[#A7F432] text-[#0B2E26] px-8 py-3.5 rounded-full font-extrabold text-sm shadow-lg hover:bg-[#96e620] transition-all"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
