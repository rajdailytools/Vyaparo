import React, { useState } from 'react';
import { useLanguage } from '../../lib/i18n';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate } from '../../lib/formatters';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Receipt,
  Users,
  Package,
  Wallet,
  ArrowRight,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  Calendar,
  Share2,
  Printer,
  CheckCircle2,
} from 'lucide-react';

interface MainDashboardProps {
  onNavigate: (path: string) => void;
  onOpenInvoiceModal: () => void;
  onOpenPaymentModal: (customerId?: string) => void;
  onOpenProductModal: () => void;
  onOpenExpenseModal: () => void;
  onViewInvoice: (invoice: any) => void;
  dateFilter: string;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  onNavigate,
  onOpenInvoiceModal,
  onOpenPaymentModal,
  onOpenProductModal,
  onOpenExpenseModal,
  onViewInvoice,
  dateFilter,
}) => {
  const { language, t } = useLanguage();
  const {
    user,
    currentBusiness,
    metrics,
    invoices,
    products,
    customers,
    reminders,
    toggleReminder,
  } = useApp();

  const [activeChartTab, setActiveChartTab] = useState<'sales' | 'profit'>('sales');

  // Filtered recent invoices
  const recentInvoices = invoices.slice(0, 5);

  // Low stock products
  const lowStockItems = products.filter((p) => p.currentStock <= p.minStockAlert);

  // Top products
  const topProducts = [...products]
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 5);

  // Unsettled Udhaar customers
  const pendingCustomers = customers
    .filter((c) => c.currentBalance > 0)
    .sort((a, b) => b.currentBalance - a.currentBalance)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Quick Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2E26]">
              Namaste, {user?.fullName || 'Raj'} <span className="inline-block animate-wave">👋</span>
            </h1>
            <span className="bg-[#E8F9F0] text-[#0F8F5F] font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#0F8F5F]/30">
              {currentBusiness?.name || 'Store'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#61736A] mt-1">
            {language === 'hi'
              ? 'Yahan hai aapke business ka aaj ka pura hisaab-kitab.'
              : 'Here is your real-time verified business summary today.'}
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenInvoiceModal}
            className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>+ Create Bill</span>
          </button>
          <button
            onClick={() => onOpenPaymentModal()}
            className="flex items-center gap-1.5 bg-[#E8F9F0] hover:bg-[#d6f5e3] text-[#0F8F5F] border border-[#0F8F5F]/30 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors"
          >
            <span>+ Collect Udhaar</span>
          </button>
          <button
            onClick={onOpenExpenseModal}
            className="flex items-center gap-1.5 border border-[#DCE9E1] hover:bg-[#F8FFF9] text-[#15251F] px-3 py-2.5 rounded-xl font-bold text-xs transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-[#61736A]" />
            <span>+ Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Four Key Business Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs hover:border-[#0F8F5F] transition-all">
          <div className="flex items-center justify-between text-[#61736A] text-xs">
            <span className="font-bold">{t('totalSales')}</span>
            <div className="w-7 h-7 rounded-xl bg-[#E8F9F0] text-[#0F8F5F] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-[#0B2E26]">
            {formatINR(metrics.totalSales)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#15803D]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% from last week</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs hover:border-[#0F8F5F] transition-all">
          <div className="flex items-center justify-between text-[#61736A] text-xs">
            <span className="font-bold">{t('totalExpenses')}</span>
            <div className="w-7 h-7 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-[#0B2E26]">
            {formatINR(metrics.totalExpenses)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#15803D]">
            <TrendingDown className="w-3.5 h-3.5 text-[#15803D]" />
            <span>-5% operational cost</span>
          </div>
        </div>

        {/* Outstanding Udhaar */}
        <div
          onClick={() => onNavigate('/dashboard/udhaar')}
          className="bg-[#E8F9F0] p-5 rounded-3xl border border-[#0F8F5F]/40 shadow-xs hover:border-[#0F8F5F] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#0F8F5F] text-xs">
            <span className="font-bold">{t('outstandingCredit')}</span>
            <div className="w-7 h-7 rounded-xl bg-[#0F8F5F] text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-[#0B2E26]">
            {formatINR(metrics.outstandingCredit)}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-[#D97706]">
            <span>{pendingCustomers.length} customers pending</span>
            <span className="underline">Send Reminder →</span>
          </div>
        </div>

        {/* Estimated Gross Profit */}
        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs hover:border-[#0F8F5F] transition-all">
          <div className="flex items-center justify-between text-[#61736A] text-xs">
            <span className="font-bold">{t('estimatedProfit')}</span>
            <div className="w-7 h-7 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-[#0B2E26]">
            {formatINR(metrics.estimatedProfit)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#15803D]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+15% margin estimate</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Sales Trend Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart Box */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0B2E26]">Weekly Sales Trend</h3>
              <p className="text-xs text-[#61736A]">Revenue generated over the past 7 days.</p>
            </div>
            <div className="flex items-center gap-1 bg-[#F8FFF9] border border-[#DCE9E1] p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveChartTab('sales')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeChartTab === 'sales' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'text-[#61736A]'
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setActiveChartTab('profit')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeChartTab === 'profit' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'text-[#61736A]'
                }`}
              >
                Profit
              </button>
            </div>
          </div>

          {/* Interactive SVG Chart Wave */}
          <div className="w-full h-44 relative flex items-end pt-4">
            <svg className="w-full h-full" viewBox="0 0 350 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mainDashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F8F5F" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0F8F5F" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 90 C50 95, 75 40, 130 65 C185 90, 230 30, 280 45 C320 55, 340 20, 350 15 L350 120 L0 120 Z"
                fill="url(#mainDashGrad)"
              />
              <path
                d="M0 90 C50 95, 75 40, 130 65 C185 90, 230 30, 280 45 C320 55, 340 20, 350 15"
                fill="none"
                stroke="#0F8F5F"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="130" cy="65" r="5" fill="#0F8F5F" />
              <circle cx="280" cy="45" r="5" fill="#0F8F5F" />
              <circle cx="350" cy="15" r="6" fill="#A7F432" stroke="#0B2E26" strokeWidth="2.5" />
            </svg>
          </div>

          <div className="flex justify-between text-xs text-[#61736A] pt-3 border-t border-[#DCE9E1] font-semibold">
            <span>Mon (₹1.8k)</span>
            <span>Tue (₹2.2k)</span>
            <span>Wed (₹1.4k)</span>
            <span>Thu (₹2.9k)</span>
            <span>Fri (₹1.9k)</span>
            <span>Sat (₹3.1k)</span>
            <span className="text-[#0F8F5F] font-bold">Today (₹12.4k)</span>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-base text-[#0B2E26]">{t('topProducts')}</h3>
            <button
              onClick={() => onNavigate('/dashboard/inventory')}
              className="text-xs font-bold text-[#0F8F5F] hover:underline"
            >
              All Items →
            </button>
          </div>

          <div className="space-y-2.5">
            {topProducts.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1] hover:bg-[#E8F9F0] transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[#E8F9F0] text-[#0F8F5F] font-extrabold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-[#0B2E26] block truncate">{p.name}</span>
                    <span className="text-[11px] text-[#61736A]">₹{p.sellingPrice} / {p.unit}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-[#0F8F5F] block">{p.currentStock} {p.unit}</span>
                  <span className={`text-[10px] font-bold ${p.currentStock <= p.minStockAlert ? 'text-[#DC2626]' : 'text-[#15803D]'}`}>
                    {p.currentStock <= p.minStockAlert ? '● Low Stock' : '● In Stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenProductModal}
            className="mt-4 w-full flex items-center justify-center gap-1.5 border border-dashed border-[#0F8F5F] text-[#0F8F5F] py-2 rounded-xl text-xs font-bold hover:bg-[#E8F9F0]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Invoices & Udhaar Followup Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Invoices Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#0B2E26]">Recent Invoices</h3>
              <p className="text-xs text-[#61736A]">Latest billed transactions & payment status.</p>
            </div>
            <button
              onClick={() => onNavigate('/dashboard/invoices')}
              className="text-xs font-bold text-[#0F8F5F] hover:underline"
            >
              View All Invoices →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FFF9] text-[#61736A] font-bold border-b border-[#DCE9E1]">
                <tr>
                  <th className="p-2.5">Invoice #</th>
                  <th className="p-2.5">Customer</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5 text-right">Amount</th>
                  <th className="p-2.5 text-center">Status</th>
                  <th className="p-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE9E1]">
                {recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F8FFF9] transition-colors">
                    <td className="p-2.5 font-mono font-bold text-[#0F8F5F]">{inv.invoiceNumber}</td>
                    <td className="p-2.5 font-semibold text-[#0B2E26]">{inv.customerName}</td>
                    <td className="p-2.5 text-[#61736A]">{formatDate(inv.invoiceDate)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#0B2E26]">{formatINR(inv.grandTotal)}</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : inv.paymentStatus === 'partial'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#FEE2E2] text-[#DC2626]'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="text-[#0F8F5F] hover:bg-[#E8F9F0] px-2 py-1 rounded font-bold text-[11px]"
                      >
                        Print / View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Udhaar Recovery Box */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center font-bold">
                  ₹
                </div>
                <h3 className="font-extrabold text-base text-[#0B2E26]">Udhaar Collection</h3>
              </div>
              <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-full">
                Attention
              </span>
            </div>
            <p className="text-xs text-[#61736A] mb-3">
              Follow up with customers holding overdue credits.
            </p>

            <div className="space-y-2">
              {pendingCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="p-2.5 rounded-xl bg-[#F8FFF9] border border-[#DCE9E1] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#0B2E26] block">{cust.name}</span>
                    <span className="text-[11px] font-bold text-[#DC2626]">{formatINR(cust.currentBalance)} baki</span>
                  </div>
                  <button
                    onClick={() => onOpenPaymentModal(cust.id)}
                    className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    Receive
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/dashboard/udhaar')}
            className="mt-4 w-full flex items-center justify-center gap-1.5 bg-[#E8F9F0] text-[#0F8F5F] hover:bg-[#d6f5e3] py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            <span>Open Complete Udhaar Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
