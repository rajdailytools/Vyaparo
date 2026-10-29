import React, { useState } from 'react';
import { useLanguage } from '../../lib/i18n';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  Plus,
  Receipt,
  Package,
  Globe,
  HelpCircle,
  ExternalLink,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface TopNavProps {
  onToggleMobileSidebar: () => void;
  onOpenInvoiceModal: () => void;
  onNavigate: (path: string) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleMobileSidebar,
  onOpenInvoiceModal,
  onNavigate,
  selectedDateFilter,
  setSelectedDateFilter,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { isDemoMode, toggleDemoMode, products, reminders } = useApp();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const lowStockItems = products.filter((p) => p.currentStock <= p.minStockAlert);
  const pendingReminders = reminders.filter((r) => !r.isCompleted);
  const totalAlerts = lowStockItems.length + pendingReminders.length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DCE9E1] px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-[#0B2E26] hover:bg-[#E8F9F0] rounded-xl transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 text-[#61736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bills, customers, stock items..."
            className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-full pl-10 pr-4 py-1.5 text-xs text-[#15251F] focus:outline-none focus:border-[#0F8F5F]"
          />
        </div>
      </div>

      {/* Right: Date Filter, Demo Toggle, Notifications, Create Bill CTA */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Filter */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#F8FFF9] border border-[#DCE9E1] rounded-full px-3 py-1 text-xs text-[#15251F]">
          <Calendar className="w-3.5 h-3.5 text-[#0F8F5F]" />
          <select
            value={selectedDateFilter}
            onChange={(e) => setSelectedDateFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="quarter">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Demo Mode Badge */}
        <button
          onClick={() => toggleDemoMode()}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
            isDemoMode
              ? 'bg-[#E8F9F0] text-[#0F8F5F] border border-[#0F8F5F]/30 hover:bg-[#DCFCE7]'
              : 'bg-gray-100 text-[#61736A] border border-gray-200'
          }`}
          title="Click to toggle between loaded demo store and clean empty state"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F8F5F] animate-pulse" />
          <span>{isDemoMode ? 'Demo Data' : 'Clean State'}</span>
        </button>

        {/* Language Selector */}
        <div className="flex items-center bg-[#E8F9F0] rounded-full p-0.5 text-xs font-bold text-[#0B2E26]">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded-full ${language === 'en' ? 'bg-[#0F8F5F] text-white' : 'text-[#61736A]'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded-full ${language === 'hi' ? 'bg-[#0F8F5F] text-white' : 'text-[#61736A]'}`}
          >
            हिं
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full text-[#61736A] hover:text-[#0B2E26] hover:bg-[#E8F9F0] relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9px] font-black flex items-center justify-center">
                {totalAlerts}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#DCE9E1] p-3 z-50 space-y-2"
              onMouseLeave={() => setNotificationsOpen(false)}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#DCE9E1]">
                <span className="font-bold text-xs text-[#0B2E26]">Alerts & Reminders</span>
                <span className="text-[10px] bg-[#E8F9F0] text-[#0F8F5F] font-bold px-2 py-0.5 rounded-full">
                  {totalAlerts} pending
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5 text-xs">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      onNavigate('/dashboard/inventory');
                    }}
                    className="p-2 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-start gap-2 cursor-pointer hover:bg-[#fde68a]"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706] mt-0.5" />
                    <div>
                      <span className="font-bold block">Low Stock: {item.name}</span>
                      <span className="text-[11px]">Only {item.currentStock} {item.unit} left. Reorder soon.</span>
                    </div>
                  </div>
                ))}

                {pendingReminders.map((rem) => (
                  <div
                    key={rem.id}
                    onClick={() => {
                      setNotificationsOpen(false);
                      onNavigate('/dashboard/udhaar');
                    }}
                    className="p-2 rounded-xl bg-[#FEE2E2] text-[#991B1B] flex items-start gap-2 cursor-pointer hover:bg-[#fecaca]"
                  >
                    <Clock className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
                    <div>
                      <span className="font-bold block">{rem.title}</span>
                      <span className="text-[11px]">Due: {rem.dueDate}</span>
                    </div>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <div className="p-4 text-center text-xs text-[#61736A]">
                    ✓ All accounts settled and stock levels healthy!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: + Create Bill */}
        <button
          onClick={onOpenInvoiceModal}
          className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-3.5 sm:px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all duration-150"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('createInvoice')}</span>
          <span className="sm:hidden">Bill</span>
        </button>
      </div>
    </header>
  );
};
