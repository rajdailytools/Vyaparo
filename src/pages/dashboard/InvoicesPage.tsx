import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../lib/formatters';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Plus,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  Eye,
  IndianRupee,
} from 'lucide-react';
import { Invoice } from '../../types';

interface InvoicesPageProps {
  onOpenInvoiceModal: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onRecordPayment: (customerId?: string) => void;
}

export const InvoicesPage: React.FC<InvoicesPageProps> = ({
  onOpenInvoiceModal,
  onViewInvoice,
  onRecordPayment,
}) => {
  const { invoices, currentBusiness } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerPhone && inv.customerPhone.includes(search));
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const rows = filteredInvoices.map((inv) => ({
      InvoiceNumber: inv.invoiceNumber,
      Customer: inv.customerName,
      Phone: inv.customerPhone || '',
      Date: inv.invoiceDate,
      Subtotal: inv.subtotal,
      Tax: inv.taxAmount,
      GrandTotal: inv.grandTotal,
      AmountPaid: inv.amountPaid,
      BalanceDue: inv.balanceDue,
      PaymentStatus: inv.paymentStatus,
    }));
    exportToCSV(`Vyaparo_Invoices_${new Date().toISOString().split('T')[0]}`, rows);
  };

  const handleWhatsAppShare = (inv: Invoice) => {
    const text = `Namaste ${inv.customerName}! Your invoice #${inv.invoiceNumber} from ${currentBusiness?.name || 'Vyaparo Store'} for ${formatINR(inv.grandTotal)} is available.\nAmount Paid: ${formatINR(inv.amountPaid)}\nBalance Due: ${formatINR(inv.balanceDue)}\nThank you!`;
    const url = `https://wa.me/${inv.customerPhone ? inv.customerPhone.replace(/\D/g, '') : ''}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE9E1]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Invoices & Billing</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Manage GST and retail tax invoices, print receipts, and track collection.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-[#DCE9E1] hover:bg-[#F8FFF9] px-3.5 py-2 rounded-xl text-xs font-bold text-[#15251F] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenInvoiceModal}
            className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Bill</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#61736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice # or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#DCE9E1] rounded-2xl pl-10 pr-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#DCE9E1] text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'all' ? 'bg-[#0F8F5F] text-white' : 'text-[#61736A]'
            }`}
          >
            All ({invoices.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'paid' ? 'bg-[#15803D] text-white' : 'text-[#61736A]'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'partial' ? 'bg-[#F59E0B] text-white' : 'text-[#61736A]'
            }`}
          >
            Partial
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'unpaid' ? 'bg-[#DC2626] text-white' : 'text-[#61736A]'
            }`}
          >
            Udhaar (Unpaid)
          </button>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white rounded-3xl border border-[#DCE9E1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FFF9] text-[#61736A] font-bold border-b border-[#DCE9E1]">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5 text-right">Grand Total</th>
                <th className="p-3.5 text-right">Balance Due</th>
                <th className="p-3.5 text-center">Payment Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE9E1]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8FFF9] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#0F8F5F]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3.5 text-[#61736A]">{formatDate(inv.invoiceDate)}</td>
                  <td className="p-3.5 font-bold text-[#0B2E26]">
                    <div>{inv.customerName}</div>
                    {inv.customerPhone && (
                      <span className="text-[10px] text-[#61736A] font-normal">{inv.customerPhone}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-[#61736A]">
                    {inv.items.length} item{inv.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#0B2E26]">
                    {formatINR(inv.grandTotal)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold">
                    {inv.balanceDue > 0 ? (
                      <span className="text-[#DC2626]">{formatINR(inv.balanceDue)}</span>
                    ) : (
                      <span className="text-[#15803D]">₹0.00</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
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
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        title="View / Print"
                        className="p-1.5 rounded-lg text-[#0F8F5F] hover:bg-[#E8F9F0] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleWhatsAppShare(inv)}
                        title="Share on WhatsApp"
                        className="p-1.5 rounded-lg text-[#25D366] hover:bg-[#DCFCE7] transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => onRecordPayment(inv.customerId)}
                          title="Record Payment"
                          className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-2 py-1 rounded text-[10px] font-bold transition-colors"
                        >
                          Collect
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-xs text-[#61736A]">
                    No invoices found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
