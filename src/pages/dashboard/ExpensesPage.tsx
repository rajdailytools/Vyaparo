import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../lib/formatters';
import { Wallet, Plus, Download, Search, Tag, TrendingDown } from 'lucide-react';

interface ExpensesPageProps {
  onOpenExpenseModal: () => void;
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ onOpenExpenseModal }) => {
  const { expenses, metrics } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(expenses.map((e) => e.category)));

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleExport = () => {
    const rows = filteredExpenses.map((e) => ({
      Date: e.expenseDate,
      Category: e.category,
      Amount: e.amount,
      PaymentMethod: e.paymentMethod,
      Description: e.description,
    }));
    exportToCSV(`Vyaparo_Expenses_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE9E1]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Expense Management</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Track daily operating expenses, shop rent, transport, salaries, and electricity bills.
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
            onClick={onOpenExpenseModal}
            className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Expense Summary & Category breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs">
          <span className="text-xs font-bold text-[#61736A] uppercase tracking-wide">Total Expenses</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#DC2626]">
            {formatINR(metrics.totalExpenses)}
          </div>
          <span className="text-[11px] text-[#61736A] mt-1 block">Recorded operational burn</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs sm:col-span-2 flex flex-col justify-between">
          <span className="text-xs font-bold text-[#0B2E26] uppercase tracking-wide mb-2 block">
            Category Breakdown
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const catTotal = expenses
                .filter((e) => e.category === cat)
                .reduce((acc, e) => acc + e.amount, 0);
              return (
                <div
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0B2E26] text-white border-[#0B2E26]'
                      : 'bg-[#F8FFF9] border-[#DCE9E1] text-[#0B2E26] hover:bg-[#E8F9F0]'
                  }`}
                >
                  <span className="font-bold block">{cat}</span>
                  <span className="text-[11px] font-mono">{formatINR(catTotal)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-3xl border border-[#DCE9E1] overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F8FFF9] border-b border-[#DCE9E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#61736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses by note or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#DCE9E1] rounded-xl pl-10 pr-3.5 py-1.5 text-xs focus:outline-none"
            />
          </div>

          <div className="text-xs text-[#61736A]">
            Showing <strong>{filteredExpenses.length}</strong> recorded expense entries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FFF9] text-[#61736A] font-bold border-b border-[#DCE9E1]">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE9E1]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#F8FFF9] transition-colors">
                  <td className="p-3.5 text-[#61736A]">{formatDate(exp.expenseDate)}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-[#0B2E26] bg-[#E8F9F0] px-2.5 py-1 rounded-lg">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#15251F] font-medium">{exp.description}</td>
                  <td className="p-3.5 text-[#61736A] uppercase font-mono text-[11px]">
                    {exp.paymentMethod}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#DC2626]">
                    {formatINR(exp.amount)}
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-[#61736A]">
                    No expense records found.
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
