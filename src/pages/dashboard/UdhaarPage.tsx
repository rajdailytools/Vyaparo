import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../lib/formatters';
import { useLanguage } from '../../lib/i18n';
import {
  BookOpen,
  IndianRupee,
  Share2,
  Bell,
  Search,
  Plus,
  ArrowRight,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface UdhaarPageProps {
  onRecordPayment: (customerId?: string) => void;
  onOpenCustomerModal: () => void;
}

export const UdhaarPage: React.FC<UdhaarPageProps> = ({
  onRecordPayment,
  onOpenCustomerModal,
}) => {
  const { language } = useLanguage();
  const { customers, currentBusiness, metrics } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const pendingCustomers = customers
    .filter((c) => c.currentBalance > 0)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const settledCustomers = customers.filter((c) => c.currentBalance <= 0);

  const handleCopyReminder = (c: any) => {
    const text = `Namaste ${c.name} ji,\nAapka ${currentBusiness?.name || 'Vyaparo Store'} mein ₹${c.currentBalance.toLocaleString('en-IN')} ka udhaar hisaab pending hai.\nKripya UPI se payment karein: ${currentBusiness?.upiId || 'rajstore@okhdfcbank'}\nDhanyawaad!`;
    navigator.clipboard.writeText(text);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppSend = (c: any) => {
    const text = `Namaste ${c.name} ji,\nAapka ${currentBusiness?.name || 'Vyaparo Store'} mein ₹${c.currentBalance.toLocaleString('en-IN')} ka udhaar hisaab pending hai.\nKripya UPI se payment karein: ${currentBusiness?.upiId || 'rajstore@okhdfcbank'}\nDhanyawaad!`;
    const cleanPhone = c.phone.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleExport = () => {
    const rows = pendingCustomers.map((c) => ({
      CustomerName: c.name,
      Phone: c.phone,
      PendingBalance: c.currentBalance,
      CreditLimit: c.creditLimit,
      Notes: c.notes || '',
    }));
    exportToCSV(`Vyaparo_Udhaar_Ledger_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#0B2E26]">Udhaar & Customer Credit Ledger</h1>
            <span className="bg-[#FEE2E2] text-[#DC2626] font-bold text-[10px] px-2 py-0.5 rounded-full">
              Khata Book
            </span>
          </div>
          <p className="text-xs text-[#61736A] mt-1">
            {language === 'hi'
              ? 'Kaun kitna lena hai, kab dena hai – sab track kare, 1-click WhatsApp reminder ke saath.'
              : 'Track outstanding balances, set credit limits, and send polite WhatsApp reminders.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-[#DCE9E1] hover:bg-[#F8FFF9] px-3.5 py-2 rounded-xl text-xs font-bold text-[#15251F]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Khata</span>
          </button>
          <button
            onClick={() => onRecordPayment()}
            className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>+ Record Collection</span>
          </button>
        </div>
      </div>

      {/* 2. Udhaar Metrics Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#E8F9F0] p-5 rounded-3xl border border-[#0F8F5F]/40 shadow-xs">
          <span className="text-xs font-bold text-[#0F8F5F] uppercase tracking-wide">
            Kul Udhaar Baki (Total To Collect)
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#0B2E26]">
            {formatINR(metrics.outstandingCredit)}
          </div>
          <span className="text-[11px] text-[#61736A] mt-1 block">
            Across {pendingCustomers.length} active customer accounts
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-wide">
            Overdue Followups Needed
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#0B2E26]">
            {pendingCustomers.filter((c) => c.currentBalance >= 1000).length}
          </div>
          <span className="text-[11px] text-[#61736A] mt-1 block">
            Accounts with pending balances &gt; ₹1,000
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-[#15803D] uppercase tracking-wide">
            Fully Settled Customers
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#15803D]">
            {settledCustomers.length}
          </div>
          <span className="text-[11px] text-[#15803D] font-bold mt-1 block">
            Zero pending credit accounts
          </span>
        </div>
      </div>

      {/* 3. Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#61736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#DCE9E1] rounded-2xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
          />
        </div>

        <button
          onClick={onOpenCustomerModal}
          className="text-xs font-bold text-[#0F8F5F] hover:bg-[#E8F9F0] px-3 py-2 rounded-xl border border-[#0F8F5F]/40"
        >
          + Add New Customer
        </button>
      </div>

      {/* 4. Active Udhaar List matching exact image reference */}
      <div className="bg-white rounded-3xl border border-[#DCE9E1] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8FFF9] border-b border-[#DCE9E1] font-bold text-xs text-[#0B2E26] flex items-center justify-between">
          <span>Pending Customer Accounts ({pendingCustomers.length})</span>
          <span className="text-[11px] text-[#61736A]">1-Click WhatsApp Reminders Enabled</span>
        </div>

        <div className="divide-y divide-[#DCE9E1]">
          {pendingCustomers.map((cust, idx) => {
            const isHigh = cust.currentBalance >= 1200;
            const isMedium = cust.currentBalance >= 800;

            const overdueTag = isHigh
              ? { text: '7 din se baki', bg: 'bg-[#FEE2E2] text-[#DC2626]' }
              : isMedium
              ? { text: '3 din se baki', bg: 'bg-[#FEF3C7] text-[#D97706]' }
              : { text: 'Due soon', bg: 'bg-[#E0F2FE] text-[#0284C7]' };

            return (
              <div
                key={cust.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FFF9] transition-colors"
              >
                {/* Customer Details */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F8F5F] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                    {cust.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#0B2E26]">{cust.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${overdueTag.bg}`}>
                        {overdueTag.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#61736A] mt-0.5">
                      <span>Phone: {cust.phone}</span>
                      <span>•</span>
                      <span>Credit Limit: {formatINR(cust.creditLimit)}</span>
                    </div>
                  </div>
                </div>

                {/* Balance & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#DCE9E1]">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold text-[#61736A] uppercase block">Lena Baki</span>
                    <span className="text-base sm:text-lg font-black text-[#DC2626]">
                      {formatINR(cust.currentBalance)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy message */}
                    <button
                      onClick={() => handleCopyReminder(cust)}
                      title="Copy reminder message"
                      className="p-2 rounded-xl border border-[#DCE9E1] hover:bg-gray-50 text-[#61736A] transition-colors"
                    >
                      {copiedId === cust.id ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* WhatsApp Click to Chat */}
                    <button
                      onClick={() => handleWhatsAppSend(cust)}
                      className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebd59] text-white px-3 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Reminder</span>
                    </button>

                    {/* Record Payment */}
                    <button
                      onClick={() => onRecordPayment(cust.id)}
                      className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors"
                    >
                      Receive Payment
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {pendingCustomers.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#15803D] mx-auto" />
              <h4 className="font-bold text-base text-[#0B2E26]">No Pending Udhaar!</h4>
              <p className="text-xs text-[#61736A]">All customers have settled their balances.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
