import React, { useState } from 'react';
import { useLanguage } from '../../lib/i18n';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../lib/formatters';
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Receipt,
  Users,
  Package,
  Brain,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Share2,
  Printer,
  Bell,
  Clock,
  IndianRupee,
  Store,
  Check,
  Play,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { metrics, products, customers } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'Today' | 'This Week' | 'This Month'>('Today');

  const faqs = [
    {
      q: language === 'hi' ? 'Kya Vyaparo mere mobile phone par chalega?' : 'Does Vyaparo work on mobile phones?',
      a: language === 'hi'
        ? 'Haan, bilkul! Vyaparo 100% responsive hai. Aap apne smartphone, tablet ya laptop kisi par bhi bina kisi download ke asani se use kar sakte hain.'
        : 'Yes, absolutely! Vyaparo is fully responsive and optimized for touchscreens. Access your store data on Android, iOS, tablets, or PC browsers seamlessly.',
    },
    {
      q: language === 'hi' ? 'Kya mujhe GST registration zaroori hai use karne ke liye?' : 'Do I need a GST number to use Vyaparo?',
      a: language === 'hi'
        ? 'Nahi! Agar aap non-GST dukan ya chota business chalate hain toh bina GST ke seedha bill aur udhaar hisaab bana sakte hain. GST registered vyapariyo ke liye CGST/SGST automated option uplabdh hai.'
        : 'No! If you run a non-GST kirana or small shop, you can generate clean retail estimates and bills. If you are GST registered, you can enable GSTIN, HSN codes, and tax breakdowns with one toggle.',
    },
    {
      q: language === 'hi' ? 'Udhaar payment reminder WhatsApp par kaise jata hai?' : 'How do WhatsApp payment reminders work?',
      a: language === 'hi'
        ? 'Ek click mein Vyaparo customer ke naam, baki rakam aur aapke UPI QR/ID ke saath ek polite reminder message generate karta hai, jise aap direct WhatsApp par bhej sakte hain.'
        : 'With a single click, Vyaparo crafts a polite payment reminder with the exact outstanding balance, invoice number, and your UPI ID, opening ready to send on WhatsApp.',
    },
    {
      q: language === 'hi' ? 'Mera vyapar data kitna surakshit hai?' : 'How secure is my business data?',
      a: language === 'hi'
        ? 'Aapka hisaab-kitab 256-bit bank-level SSL encryption aur Row-Level-Security ke saath secured cloud database mein save hota hai. Koi doosra vyapari aapka data kabhi nahi dekh sakta.'
        : 'Your financial books and customer ledgers are stored in an enterprise PostgreSQL cloud database protected by Row Level Security (RLS) policies and HTTPS encryption.',
    },
  ];

  return (
    <div className="bg-[#F8FFF9] min-h-screen text-[#15251F]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#DCE9E1]/60">
        {/* Soft radial background glow matching brand palette */}
        <div className="absolute top-0 right-0 -mr-48 -mt-48 w-96 h-96 rounded-full bg-[#E8F9F0] blur-3xl pointer-events-none opacity-80" />
        <div className="absolute top-1/2 left-0 -ml-40 w-80 h-80 rounded-full bg-[#A7F432]/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F9F0] border border-[#0F8F5F]/30 text-xs font-bold text-[#0F8F5F] shadow-xs">
                <Brain className="w-4 h-4 text-[#0F8F5F]" />
                <span>AI-Powered Business Management</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B2E26] leading-[1.15]">
                {language === 'hi' ? (
                  <>
                    Dukan ka pura <span className="text-[#0F8F5F]">hisaab</span>, ab aur bhi <span className="underline decoration-[#A7F432] decoration-4">aasaan</span>.
                  </>
                ) : (
                  <>
                    Run Your Business Smarter.{' '}
                    <span className="text-[#0F8F5F] block sm:inline">Grow With Confidence.</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-[#61736A] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                {language === 'hi'
                  ? 'Billing, stock, udhaar, kharcha, profit – sab kuch ab ek hi jagah. AI ke saath, aapke business ke liye.'
                  : 'Manage billing, inventory, expenses, customer credit and business performance from one simple, powerful platform.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#A7F432] hover:bg-[#95e41e] text-[#0B2E26] px-8 py-4 rounded-full font-extrabold text-base shadow-lg shadow-[#A7F432]/25 hover:scale-102 active:scale-98 transition-all"
                >
                  <span>{language === 'hi' ? 'Start Free Now' : 'Start Free Now'}</span>
                  <ArrowRight className="w-5 h-5 text-[#0B2E26]" />
                </button>

                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E8F9F0] hover:bg-[#d6f4e3] border border-[#0F8F5F]/40 text-[#0F8F5F] px-6 py-4 rounded-full font-bold text-base transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{language === 'hi' ? 'Watch Demo' : 'Live Dashboard Demo'}</span>
                </button>
              </div>

              {/* Trust micro-badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-semibold text-[#0B2E26]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F8F5F]" />
                  <span>{t('noCardRequired')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F8F5F]" />
                  <span>{t('easyToUse')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0F8F5F]" />
                  <span>{t('madeForIndia')}</span>
                </div>
              </div>
            </div>

            {/* Right Live Interactive Mockup (Exact layout from user image!) */}
            <div className="lg:col-span-6">
              <div className="bg-[#0B2E26] rounded-3xl p-3 sm:p-5 shadow-2xl border border-[#0F8F5F]/40 transition-transform duration-300 hover:scale-[1.01]">
                {/* Mockup Frame Header */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-[#0F8F5F]/30 text-white text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                    <div className="w-3 h-3 rounded-full bg-[#15803D]" />
                    <span className="font-bold tracking-wide ml-2 text-xs text-[#E8F9F0]">app.vyaparo.com/dashboard</span>
                  </div>
                  <span className="bg-[#A7F432] text-[#0B2E26] px-2 py-0.5 rounded text-[10px] font-extrabold">LIVE DEMO</span>
                </div>

                {/* Internal App Canvas */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 mt-3 space-y-4 text-[#15251F]">
                  {/* Greeting & Time selector */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#0B2E26] flex items-center gap-1.5">
                        Namaste, Raj <span className="inline-block animate-wave">👋</span>
                      </h3>
                      <p className="text-xs text-[#61736A]">
                        {language === 'hi' ? 'Yahan hai aapke business ka aaj ka summary.' : 'Here is your verified business summary today.'}
                      </p>
                    </div>

                    <div className="bg-[#F8FFF9] border border-[#DCE9E1] rounded-lg px-2.5 py-1 text-xs font-bold text-[#0F8F5F] flex items-center gap-1">
                      <span>Today</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-[#F8FFF9] border border-[#DCE9E1] p-3 rounded-xl">
                      <span className="text-[11px] font-semibold text-[#61736A] block">Total Sales</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#0B2E26] block mt-0.5">
                        {formatINR(metrics.totalSales || 12450)}
                      </span>
                      <span className="text-[10px] font-bold text-[#15803D] flex items-center gap-0.5 mt-1">
                        <TrendingUp className="w-3 h-3" /> +12%
                      </span>
                    </div>

                    <div className="bg-[#F8FFF9] border border-[#DCE9E1] p-3 rounded-xl">
                      <span className="text-[11px] font-semibold text-[#61736A] block">Expenses</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#0B2E26] block mt-0.5">
                        {formatINR(metrics.totalExpenses || 3200)}
                      </span>
                      <span className="text-[10px] font-bold text-[#15803D] flex items-center gap-0.5 mt-1">
                        <TrendingDown className="w-3 h-3 text-[#15803D]" /> -5%
                      </span>
                    </div>

                    <div className="bg-[#E8F9F0] border border-[#0F8F5F]/30 p-3 rounded-xl">
                      <span className="text-[11px] font-semibold text-[#0F8F5F] block">Udhaar (Pending)</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#0B2E26] block mt-0.5">
                        {formatINR(metrics.outstandingCredit || 8750)}
                      </span>
                      <span className="text-[10px] font-bold text-[#F59E0B] flex items-center gap-0.5 mt-1">
                        ↗ 8 pending
                      </span>
                    </div>

                    <div className="bg-[#F8FFF9] border border-[#DCE9E1] p-3 rounded-xl">
                      <span className="text-[11px] font-semibold text-[#61736A] block">Est. Profit</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#0B2E26] block mt-0.5">
                        {formatINR(metrics.estimatedProfit || 9250)}
                      </span>
                      <span className="text-[10px] font-bold text-[#15803D] flex items-center gap-0.5 mt-1">
                        <TrendingUp className="w-3 h-3" /> +15%
                      </span>
                    </div>
                  </div>

                  {/* Two Columns: Sales Chart & Top Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                    {/* Visual Sales Wave Curve */}
                    <div className="sm:col-span-7 bg-[#F8FFF9] border border-[#DCE9E1] p-3 rounded-xl flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-[#0B2E26]">Sales Overview</span>
                        <span className="text-[10px] bg-[#E8F9F0] text-[#0F8F5F] font-bold px-2 py-0.5 rounded">This Week</span>
                      </div>
                      
                      {/* SVG Line Chart */}
                      <div className="w-full h-24 relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0F8F5F" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#0F8F5F" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0 45 C30 50, 45 20, 75 35 C105 50, 130 15, 160 25 C180 30, 195 10, 200 8 L200 60 L0 60 Z"
                            fill="url(#chartGrad)"
                          />
                          <path
                            d="M0 45 C30 50, 45 20, 75 35 C105 50, 130 15, 160 25 C180 30, 195 10, 200 8"
                            fill="none"
                            stroke="#0F8F5F"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="160" cy="25" r="3.5" fill="#0F8F5F" />
                          <circle cx="200" cy="8" r="4" fill="#A7F432" stroke="#0B2E26" strokeWidth="2" />
                        </svg>
                      </div>

                      <div className="flex justify-between text-[9px] text-[#61736A] pt-1 border-t border-[#DCE9E1]">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>

                    {/* Top Products */}
                    <div className="sm:col-span-5 bg-[#F8FFF9] border border-[#DCE9E1] p-3 rounded-xl space-y-1.5">
                      <span className="text-xs font-bold text-[#0B2E26] block mb-1">Top Products</span>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between p-1 rounded hover:bg-[#E8F9F0]">
                          <span className="font-medium text-[#15251F] truncate">🍟 Chips Packet</span>
                          <span className="font-bold text-[#0F8F5F] text-[11px]">120 sold</span>
                        </div>
                        <div className="flex items-center justify-between p-1 rounded hover:bg-[#E8F9F0]">
                          <span className="font-medium text-[#15251F] truncate">🥤 Cold Drink</span>
                          <span className="font-bold text-[#0F8F5F] text-[11px]">86 sold</span>
                        </div>
                        <div className="flex items-center justify-between p-1 rounded hover:bg-[#E8F9F0]">
                          <span className="font-medium text-[#15251F] truncate">🍪 Biscuit</span>
                          <span className="font-bold text-[#0F8F5F] text-[11px]">75 sold</span>
                        </div>
                        <div className="flex items-center justify-between p-1 rounded hover:bg-[#E8F9F0]">
                          <span className="font-medium text-[#15251F] truncate">🍜 Maggi</span>
                          <span className="font-bold text-[#0F8F5F] text-[11px]">60 sold</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS (Matching bottom row of the image) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F8F5F] bg-[#E8F9F0] px-3 py-1 rounded-full">
            Smart Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2E26] mt-3">
            {language === 'hi' ? 'Vyapar badhane ke 3 sabse bade hathiyar' : 'Everything you need to run daily store operations'}
          </h2>
          <p className="text-[#61736A] mt-2 text-base">
            Designed specifically for Kirana, retail counters, mobile shops, and wholesalers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Smart Billing */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE9E1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F9F0] flex items-center justify-center text-[#0F8F5F] mb-5">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#0F8F5F] uppercase tracking-wide">Smart Billing</span>
              <h3 className="text-2xl font-extrabold text-[#0B2E26] mt-1 mb-2">
                {language === 'hi' ? 'Bill banao seconds mein.' : 'Generate Bills in Seconds'}
              </h3>
              <p className="text-sm text-[#61736A] mb-6">
                Professional bills, GST option ke saath. Mobile se bhi, computer se bhi. Share on WhatsApp or print.
              </p>

              {/* Mini Invoice Preview */}
              <div className="bg-[#F8FFF9] rounded-2xl p-4 border border-[#DCE9E1] text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#DCE9E1]">
                  <span className="font-extrabold text-[#0F8F5F] tracking-tight">Vyaparo</span>
                  <span className="font-bold text-[#61736A]">INVOICE #001</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-[#61736A]">
                    <span>Chips Packet (5x)</span>
                    <span className="font-semibold text-[#15251F]">₹100</span>
                  </div>
                  <div className="flex justify-between text-[#61736A]">
                    <span>Cold Drink (3x)</span>
                    <span className="font-semibold text-[#15251F]">₹90</span>
                  </div>
                  <div className="flex justify-between text-[#61736A]">
                    <span>Biscuit (2x)</span>
                    <span className="font-semibold text-[#15251F]">₹50</span>
                  </div>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#DCE9E1] font-extrabold text-sm text-[#0B2E26]">
                  <span>Total Amount</span>
                  <span>₹240</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                onClick={() => onNavigate('/dashboard/invoices')}
                className="flex items-center justify-center gap-1.5 bg-[#E8F9F0] text-[#0F8F5F] hover:bg-[#d5f3e2] py-2.5 rounded-xl font-bold text-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Bill</span>
              </button>
              <button
                onClick={() => onNavigate('/dashboard/invoices')}
                className="flex items-center justify-center gap-1.5 border border-[#DCE9E1] text-[#0B2E26] hover:bg-[#F8FFF9] py-2.5 rounded-xl font-bold text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Card 2: Udhaar Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE9E1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F9F0] flex items-center justify-center text-[#0F8F5F] mb-5">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#0F8F5F] uppercase tracking-wide">Udhaar Management</span>
              <h3 className="text-2xl font-extrabold text-[#0B2E26] mt-1 mb-2">
                {language === 'hi' ? 'Udhaar ka poora hisaab.' : 'Zero Credit Losses'}
              </h3>
              <p className="text-sm text-[#61736A] mb-6">
                Kaun kitna lena hai, kab dena hai – sab track kare, 1-click WhatsApp payment reminder ke saath.
              </p>

              {/* Customer Udhaar Rows matching image */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F8F5F] text-white flex items-center justify-center font-bold text-xs">
                      RK
                    </div>
                    <div>
                      <span className="font-bold text-[#0B2E26] block">Ramesh Kumar</span>
                      <span className="text-[#61736A] text-[11px]">₹1,200</span>
                    </div>
                  </div>
                  <span className="bg-[#FEE2E2] text-[#DC2626] font-bold px-2 py-0.5 rounded text-[10px]">
                    7 din se baki
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F8F5F] text-white flex items-center justify-center font-bold text-xs">
                      SL
                    </div>
                    <div>
                      <span className="font-bold text-[#0B2E26] block">Sohan Lal</span>
                      <span className="text-[#61736A] text-[11px]">₹850</span>
                    </div>
                  </div>
                  <span className="bg-[#FEF3C7] text-[#D97706] font-bold px-2 py-0.5 rounded text-[10px]">
                    3 din se baki
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#0F8F5F] text-white flex items-center justify-center font-bold text-xs">
                      AV
                    </div>
                    <div>
                      <span className="font-bold text-[#0B2E26] block">Amit Verma</span>
                      <span className="text-[#61736A] text-[11px]">₹500</span>
                    </div>
                  </div>
                  <span className="bg-[#E0F2FE] text-[#0284C7] font-bold px-2 py-0.5 rounded text-[10px]">
                    Due soon
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/dashboard/udhaar')}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Send Reminders</span>
            </button>
          </div>

          {/* Card 3: Inventory & Stock */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCE9E1] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F9F0] flex items-center justify-center text-[#0F8F5F] mb-5">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-[#0F8F5F] uppercase tracking-wide">Inventory & Stock</span>
              <h3 className="text-2xl font-extrabold text-[#0B2E26] mt-1 mb-2">
                {language === 'hi' ? 'Stock kabhi khatam nahi hoga.' : 'Never Run Out of Stock'}
              </h3>
              <p className="text-sm text-[#61736A] mb-6">
                Real-time stock tracking, automatic low-stock warnings, and purchase cost tracking.
              </p>

              {/* Stock Items matching image */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍟</span>
                    <span className="font-semibold text-[#0B2E26]">Chips Packet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15251F]">120</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      ● In Stock
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥤</span>
                    <span className="font-semibold text-[#0B2E26]">Cold Drink</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15251F]">30</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                      ● Low Stock
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍪</span>
                    <span className="font-semibold text-[#0B2E26]">Biscuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15251F]">0</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                      ● Out of Stock
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1]">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍜</span>
                    <span className="font-semibold text-[#0B2E26]">Maggi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#15251F]">45</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      ● In Stock
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/dashboard/inventory')}
              className="mt-6 w-full flex items-center justify-center gap-2 border border-[#0F8F5F] text-[#0F8F5F] hover:bg-[#E8F9F0] py-3 rounded-xl font-bold text-xs transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Manage Stock</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. OLD NOTEBOOK VS VYAPARO COMPARISON */}
      <section className="py-16 bg-[#E8F9F0]/60 border-y border-[#DCE9E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-[#0B2E26]">
              {language === 'hi' ? 'Purani Diary / Notebooks chhodkar Vyaparo par aane ke faayde' : 'Why Switch From Paper Registers to Vyaparo'}
            </h2>
            <p className="text-sm text-[#61736A] mt-2">
              Save up to 3 hours every day and eliminate forgotten customer balances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Notebook Way */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCE9E1] opacity-80">
              <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider block mb-2">
                ❌ Purana Tareeka (Paper Notebooks)
              </span>
              <ul className="space-y-4 text-sm text-[#61736A] mt-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Diary fatne, khone ya paani girne ka hamesha dar rehta hai.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Customer se udhaar maangne mein sharam aati hai ya bhool jaate hain.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Kaunsa item dukan mein khatam ho gaya, customer ke aane ke baad pata chalta hai.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#DC2626] font-bold">✕</span>
                  <span>Mahine ke aakhri mein profit kitna hua, exact pata nahi chalta.</span>
                </li>
              </ul>
            </div>

            {/* The Vyaparo Way */}
            <div className="bg-[#0B2E26] text-white p-6 sm:p-8 rounded-3xl border-2 border-[#A7F432] shadow-xl relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-[#A7F432] text-[#0B2E26] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                RECOMMENDED
              </div>
              <span className="text-xs font-bold text-[#A7F432] uppercase tracking-wider block mb-2">
                ✓ Smart Vyaparo Digital Way
              </span>
              <ul className="space-y-4 text-sm text-[#E8F9F0] mt-4">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#A7F432] shrink-0" />
                  <span>Cloud backup ke saath 100% surakshit – phone badalne par bhi data safe.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#A7F432] shrink-0" />
                  <span>1-click WhatsApp reminder with UPI link – payment 3x jaldi aati hai.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#A7F432] shrink-0" />
                  <span>Stock alert automatic batata hai kaunsa saaman reorder karna hai.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#A7F432] shrink-0" />
                  <span>Bikri, kharcha aur estimated gross profit ka accurate daily hisaab.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRANSPARENT PRICING PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F8F5F] bg-[#E8F9F0] px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2E26] mt-3">
            {language === 'hi' ? 'Chhote vyapariyon ke budget mein' : 'Plans for Every Stage of Your Business'}
          </h2>
          <p className="text-sm text-[#61736A] mt-2">
            Start free, upgrade as your business expands. No hidden charges or cancellation lock-ins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#61736A] uppercase tracking-wide">Free Forever</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#0B2E26]">₹0</span>
                <span className="text-xs text-[#61736A]">/month</span>
              </div>
              <p className="text-xs text-[#61736A] mt-2">For single counter micro-shops getting started.</p>
              <div className="mt-6 space-y-2.5 text-xs text-[#15251F]">
                <div className="flex items-center gap-2">✓ 30 Invoices / month</div>
                <div className="flex items-center gap-2">✓ 50 Products inventory</div>
                <div className="flex items-center gap-2">✓ Customer Udhaar Ledger</div>
                <div className="flex items-center gap-2">✓ Mobile & PC Web</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/signup')}
              className="mt-8 w-full border border-[#0F8F5F] text-[#0F8F5F] py-2.5 rounded-xl font-bold text-xs hover:bg-[#E8F9F0]"
            >
              Start Free
            </button>
          </div>

          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#0F8F5F] uppercase tracking-wide">Starter</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#0B2E26]">₹99</span>
                <span className="text-xs text-[#61736A]">/month</span>
              </div>
              <p className="text-xs text-[#61736A] mt-2">For growing neighborhood stores.</p>
              <div className="mt-6 space-y-2.5 text-xs text-[#15251F]">
                <div className="flex items-center gap-2 font-bold text-[#0F8F5F]">✓ 200 Invoices / month</div>
                <div className="flex items-center gap-2">✓ 250 Products inventory</div>
                <div className="flex items-center gap-2">✓ WhatsApp Payment Links</div>
                <div className="flex items-center gap-2">✓ Low Stock Alerts</div>
                <div className="flex items-center gap-2">✓ CSV Reports Export</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/pricing')}
              className="mt-8 w-full bg-[#E8F9F0] text-[#0F8F5F] py-2.5 rounded-xl font-bold text-xs hover:bg-[#d4f2e0]"
            >
              Choose Starter
            </button>
          </div>

          {/* Growth Plan (Popular) */}
          <div className="bg-[#0B2E26] text-white rounded-3xl p-6 border-2 border-[#A7F432] shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A7F432] text-[#0B2E26] text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
              MOST POPULAR
            </div>
            <div>
              <span className="text-xs font-bold text-[#A7F432] uppercase tracking-wide">Growth</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">₹249</span>
                <span className="text-xs text-[#E8F9F0]/70">/month</span>
              </div>
              <p className="text-xs text-[#E8F9F0]/80 mt-2">For established shops with staff & higher volume.</p>
              <div className="mt-6 space-y-2.5 text-xs text-[#E8F9F0]">
                <div className="flex items-center gap-2 font-bold text-[#A7F432]">✓ 1,000 Invoices / month</div>
                <div className="flex items-center gap-2">✓ 1,500 Products</div>
                <div className="flex items-center gap-2">✓ 5 Staff Roles & Counters</div>
                <div className="flex items-center gap-2">✓ AI Business Assistant</div>
                <div className="flex items-center gap-2">✓ Automated P&L Reports</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/pricing')}
              className="mt-8 w-full bg-[#A7F432] text-[#0B2E26] py-2.5 rounded-xl font-extrabold text-xs hover:bg-[#92df1d]"
            >
              Upgrade to Growth
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#61736A] uppercase tracking-wide">Pro Business</span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#0B2E26]">₹499</span>
                <span className="text-xs text-[#61736A]">/month</span>
              </div>
              <p className="text-xs text-[#61736A] mt-2">For wholesalers & multi-branch distributors.</p>
              <div className="mt-6 space-y-2.5 text-xs text-[#15251F]">
                <div className="flex items-center gap-2 font-bold text-[#0F8F5F]">✓ Unlimited Invoices</div>
                <div className="flex items-center gap-2">✓ Unlimited Products</div>
                <div className="flex items-center gap-2">✓ 20 Staff Accounts</div>
                <div className="flex items-center gap-2">✓ Custom Invoice Branding</div>
                <div className="flex items-center gap-2">✓ Priority Support Manager</div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('/pricing')}
              className="mt-8 w-full border border-[#DCE9E1] text-[#0B2E26] py-2.5 rounded-xl font-bold text-xs hover:bg-[#F8FFF9]"
            >
              Choose Pro
            </button>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E26]">
            {language === 'hi' ? 'Aksar pooche jaane wale sawaal (FAQs)' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#DCE9E1] overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm sm:text-base text-[#0B2E26] flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#0F8F5F] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#61736A] shrink-0" />
                )}
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-[#61736A] leading-relaxed border-t border-[#DCE9E1]/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL BOTTOM CTA BANNER */}
      <section className="py-16 bg-[#0B2E26] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {language === 'hi' ? (
              <>Aaj hi shuru karein aur apne vyapar ko digital banayein.</>
            ) : (
              <>Join the New Era of Indian Retail Management.</>
            )}
          </h2>
          <p className="text-base sm:text-lg text-[#E8F9F0]/80 max-w-2xl mx-auto">
            Takes less than 2 minutes to set up your business workspace. No credit card required.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/signup')}
              className="inline-flex items-center gap-2 bg-[#A7F432] hover:bg-[#92df1d] text-[#0B2E26] px-8 py-4 rounded-full font-extrabold text-base shadow-xl transition-all"
            >
              <span>{t('startFreeNow')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
