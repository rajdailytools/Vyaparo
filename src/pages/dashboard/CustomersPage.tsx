import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../lib/formatters';
import { Users, Search, Plus, Download, IndianRupee, Phone, Mail, MapPin } from 'lucide-react';

interface CustomersPageProps {
  onOpenCustomerModal: () => void;
  onRecordPayment: (customerId: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  onOpenCustomerModal,
  onRecordPayment,
}) => {
  const { customers, invoices } = useApp();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleExport = () => {
    const rows = customers.map((c) => ({
      Name: c.name,
      Phone: c.phone,
      Email: c.email || '',
      CreditLimit: c.creditLimit,
      CurrentUdhaar: c.currentBalance,
      Address: c.address || '',
    }));
    exportToCSV(`Vyaparo_Customers_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE9E1]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Customer Directory</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Maintain customer contacts, credit limits, and purchase histories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-[#DCE9E1] hover:bg-[#F8FFF9] px-3.5 py-2 rounded-xl text-xs font-bold text-[#15251F]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenCustomerModal}
            className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-[#61736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name, phone or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#DCE9E1] rounded-2xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const custInvoicesCount = invoices.filter((i) => i.customerId === c.id).length;

          return (
            <div
              key={c.id}
              className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs hover:border-[#0F8F5F] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E8F9F0] text-[#0F8F5F] font-extrabold flex items-center justify-center text-sm">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0B2E26]">{c.name}</h3>
                      <span className="text-[11px] text-[#61736A] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.currentBalance > 0
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : 'bg-[#DCFCE7] text-[#15803D]'
                    }`}
                  >
                    {c.currentBalance > 0 ? 'Pending Udhaar' : 'Settled'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCE9E1] space-y-1.5 text-xs text-[#61736A]">
                  <div className="flex justify-between">
                    <span>Credit Limit:</span>
                    <span className="font-mono font-bold text-[#0B2E26]">{formatINR(c.creditLimit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Udhaar:</span>
                    <span className="font-mono font-bold text-[#DC2626]">{formatINR(c.currentBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Invoices Billed:</span>
                    <span className="font-bold text-[#0B2E26]">{custInvoicesCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DCE9E1] flex gap-2">
                {c.currentBalance > 0 ? (
                  <button
                    onClick={() => onRecordPayment(c.id)}
                    className="w-full bg-[#0F8F5F] hover:bg-[#0B2E26] text-white py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Collect {formatINR(c.currentBalance)}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-50 text-[#61736A] py-2 rounded-xl text-xs font-medium cursor-default"
                  >
                    All Dues Clear
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
