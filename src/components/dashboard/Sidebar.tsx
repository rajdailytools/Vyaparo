import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useLanguage } from '../../lib/i18n';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  Truck,
  Wallet,
  Users,
  Building2,
  BookOpen,
  Package,
  BarChart3,
  Brain,
  Bell,
  Users2,
  Settings,
  CreditCard,
  History,
  FileSpreadsheet,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Store,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);
  const { language, t } = useLanguage();
  const {
    user,
    logout,
    businesses,
    currentBusiness,
    setCurrentBusiness,
    currentPlan,
    metrics,
    reminders,
  } = useApp();

  const pendingRemindersCount = reminders.filter((r) => !r.isCompleted).length;

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/dashboard/invoices', label: t('invoices'), icon: Receipt },
    { path: '/dashboard/sales', label: t('sales'), icon: ShoppingCart },
    { path: '/dashboard/udhaar', label: t('udhaar'), icon: BookOpen, badge: metrics.outstandingCredit > 0 ? 'Pending' : undefined, badgeColor: 'bg-[#F59E0B] text-[#0B2E26]' },
    { path: '/dashboard/inventory', label: t('inventory'), icon: Package, badge: metrics.lowStockCount > 0 ? `${metrics.lowStockCount} Low` : undefined, badgeColor: 'bg-[#DC2626] text-white' },
    { path: '/dashboard/expenses', label: t('expenses'), icon: Wallet },
    { path: '/dashboard/customers', label: t('customers'), icon: Users },
    { path: '/dashboard/purchases', label: t('purchases'), icon: Truck },
    { path: '/dashboard/suppliers', label: t('suppliers'), icon: Building2 },
    { path: '/dashboard/reports', label: t('reports'), icon: BarChart3 },
    { path: '/dashboard/ai-assistant', label: t('aiAssistant'), icon: Brain, badge: 'AI', badgeColor: 'bg-[#A7F432] text-[#0B2E26]' },
    { path: '/dashboard/reminders', label: t('reminders'), icon: Bell, badge: pendingRemindersCount > 0 ? String(pendingRemindersCount) : undefined, badgeColor: 'bg-[#DC2626] text-white' },
    { path: '/dashboard/team', label: t('team'), icon: Users2 },
    { path: '/dashboard/subscription', label: t('subscription'), icon: CreditCard },
    { path: '/dashboard/activity', label: t('activity'), icon: History },
    { path: '/dashboard/import-export', label: t('importExport'), icon: FileSpreadsheet },
    { path: '/dashboard/settings', label: t('settings'), icon: Settings },
  ];

  const handleNav = (path: string) => {
    setIsMobileOpen(false);
    onNavigate(path);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-[#0B2E26] text-white flex flex-col justify-between transition-all duration-300 border-r border-[#0F8F5F]/30 ${
          collapsed ? 'w-20' : 'w-68'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 flex items-center justify-between border-b border-[#0F8F5F]/20">
            {!collapsed ? (
              <div className="cursor-pointer" onClick={() => handleNav('/')}>
                <Logo variant="horizontal" theme="dark" size="sm" />
              </div>
            ) : (
              <div className="cursor-pointer mx-auto" onClick={() => handleNav('/')}>
                <Logo variant="icon" theme="dark" size="sm" />
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-[#E8F9F0]/60 hover:text-white hover:bg-[#0F8F5F]/30 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Business Switcher */}
          {!collapsed ? (
            <div className="p-3 border-b border-[#0F8F5F]/20">
              <div className="relative">
                <button
                  onClick={() => setBizDropdownOpen(!bizDropdownOpen)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0F8F5F]/20 border border-[#0F8F5F]/30 hover:bg-[#0F8F5F]/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#0F8F5F] flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4 text-[#A7F432]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-white block truncate">
                        {currentBusiness?.name || 'Vyaparo Store'}
                      </span>
                      <span className="text-[10px] text-[#A7F432] block">
                        {currentPlan.name} Plan
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#E8F9F0]/70 shrink-0" />
                </button>

                {bizDropdownOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-[#0B2E26] border border-[#0F8F5F]/40 rounded-xl shadow-2xl p-2 z-50 space-y-1"
                    onMouseLeave={() => setBizDropdownOpen(false)}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#A7F432] px-2 py-1">
                      Business Workspaces
                    </div>
                    {businesses.map((biz) => (
                      <button
                        key={biz.id}
                        onClick={() => {
                          setCurrentBusiness(biz);
                          setBizDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                          biz.id === currentBusiness?.id
                            ? 'bg-[#0F8F5F] text-white font-bold'
                            : 'hover:bg-[#0F8F5F]/20 text-[#E8F9F0]'
                        }`}
                      >
                        <span className="truncate">{biz.name}</span>
                        {biz.id === currentBusiness?.id && <span className="text-[10px]">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 text-center border-b border-[#0F8F5F]/20">
              <div className="w-8 h-8 rounded-lg bg-[#0F8F5F] flex items-center justify-center mx-auto text-xs font-bold text-[#A7F432]">
                🏪
              </div>
            </div>
          )}

          {/* Nav List */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#0F8F5F] text-white shadow-xs font-bold'
                      : 'text-[#E8F9F0]/80 hover:bg-[#0F8F5F]/20 hover:text-white'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#A7F432]' : 'text-[#E8F9F0]/70'}`} />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-[#A7F432] text-[#0B2E26]'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Sign Out */}
        <div className="p-3 border-t border-[#0F8F5F]/20 space-y-2">
          {!collapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#0F8F5F]/15">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#A7F432] text-[#0B2E26] font-bold flex items-center justify-center text-xs shrink-0">
                  {user?.fullName?.charAt(0) || 'R'}
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-white block truncate">
                    {user?.fullName || 'Raj Sharma'}
                  </span>
                  <span className="text-[10px] text-[#E8F9F0]/60 block truncate">
                    {user?.email || 'rajdailytools@gmail.com'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onNavigate('/');
                }}
                className="p-1.5 text-[#E8F9F0]/70 hover:text-[#DC2626] transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                logout();
                onNavigate('/');
              }}
              className="w-full flex justify-center p-2 text-[#E8F9F0]/70 hover:text-[#DC2626] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
