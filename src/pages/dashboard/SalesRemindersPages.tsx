import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate } from '../../lib/formatters';
import { ShoppingCart, Bell, Plus, Check, CheckCircle2, Clock, Calendar, X } from 'lucide-react';

// 1. SALES PAGE
interface SalesPageProps {
  onOpenInvoiceModal: () => void;
  onViewInvoice: (inv: any) => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onOpenInvoiceModal, onViewInvoice }) => {
  const { invoices, metrics } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Sales Counter Register</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Complete daily sales transactions, POS counter slips, and receipts.
          </p>
        </div>

        <button
          onClick={onOpenInvoiceModal}
          className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Counter Sale</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#E8F9F0] p-5 rounded-3xl border border-[#0F8F5F]/40 shadow-xs">
          <span className="text-xs font-bold text-[#0F8F5F] uppercase">Gross Revenue</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#0B2E26]">{formatINR(metrics.totalSales)}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs">
          <span className="text-xs font-bold text-[#15803D] uppercase">Cash & UPI Settled</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#15803D]">{formatINR(metrics.cashCollected)}</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs">
          <span className="text-xs font-bold text-[#DC2626] uppercase">Credit Sales (Udhaar)</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#DC2626]">{formatINR(metrics.outstandingCredit)}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#DCE9E1] overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F8FFF9] border-b border-[#DCE9E1] font-bold text-xs text-[#0B2E26]">
          All Recorded Counter Sales
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FFF9] text-[#61736A] font-bold border-b border-[#DCE9E1]">
              <tr>
                <th className="p-3.5">Bill #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE9E1]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F8FFF9] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#0F8F5F]">{inv.invoiceNumber}</td>
                  <td className="p-3.5 text-[#61736A]">{formatDate(inv.invoiceDate)}</td>
                  <td className="p-3.5 font-bold text-[#0B2E26]">{inv.customerName}</td>
                  <td className="p-3.5 text-[#61736A] uppercase font-mono">{inv.paymentMethod || 'Credit'}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#0B2E26]">{formatINR(inv.grandTotal)}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        inv.paymentStatus === 'paid' ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#DC2626]'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onViewInvoice(inv)}
                      className="text-[#0F8F5F] font-bold text-xs hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. REMINDERS PAGE
export const RemindersPage: React.FC = () => {
  const { reminders, toggleReminder, addReminder } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'udhaar_followup' | 'tax_due' | 'stock_reorder' | 'general'>('udhaar_followup');
  const [amount, setAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title: title.trim(),
      dueDate,
      type,
      amount: amount ? parseFloat(amount) : undefined,
    });
    setShowAdd(false);
    setTitle('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Task & Payment Reminders</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Keep track of customer payment dues, GST return deadlines, and stock reorders.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#DCE9E1] p-6 shadow-xs divide-y divide-[#DCE9E1]">
        {reminders.map((rem) => (
          <div key={rem.id} className="py-4 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleReminder(rem.id)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  rem.isCompleted
                    ? 'bg-[#15803D] border-[#15803D] text-white'
                    : 'border-[#DCE9E1] hover:border-[#0F8F5F]'
                }`}
              >
                {rem.isCompleted && <Check className="w-4 h-4" />}
              </button>

              <div>
                <span className={`font-bold block ${rem.isCompleted ? 'line-through text-[#61736A]' : 'text-[#0B2E26]'}`}>
                  {rem.title}
                </span>
                <span className="text-[11px] text-[#61736A] flex items-center gap-2 mt-0.5">
                  <Clock className="w-3 h-3 text-[#0F8F5F]" />
                  Due Date: {formatDate(rem.dueDate)}
                  {rem.amount && <span>• Amount: {formatINR(rem.amount)}</span>}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-[#E8F9F0] text-[#0F8F5F]">
              {rem.type.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE9E1] overflow-hidden">
            <div className="bg-[#0B2E26] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Reminder</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#61736A] mb-1">Reminder Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Followup with Ramesh for pending ₹1,200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#61736A] mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#61736A] mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="udhaar_followup">Udhaar Followup</option>
                    <option value="stock_reorder">Stock Reorder</option>
                    <option value="tax_due">Tax / GST Due</option>
                    <option value="general">General Task</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#61736A] mb-1">Amount (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 1200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-2 rounded-xl border border-[#DCE9E1] text-[#61736A] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
