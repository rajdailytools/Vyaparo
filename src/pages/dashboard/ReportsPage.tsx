import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../lib/formatters';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Receipt,
  Users,
  Package,
  Wallet,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { invoices, expenses, customers, products, metrics } = useApp();
  const [reportType, setReportType] = useState<'pnl' | 'sales' | 'expenses' | 'udhaar' | 'inventory'>('pnl');

  const handleExportCurrentReport = () => {
    let rows: any[] = [];
    let filename = `Vyaparo_${reportType.toUpperCase()}_Report`;

    if (reportType === 'sales') {
      rows = invoices.map((i) => ({
        InvoiceNumber: i.invoiceNumber,
        Customer: i.customerName,
        Date: i.invoiceDate,
        Total: i.grandTotal,
        Paid: i.amountPaid,
        Due: i.balanceDue,
        Status: i.paymentStatus,
      }));
    } else if (reportType === 'expenses') {
      rows = expenses.map((e) => ({
        Date: e.expenseDate,
        Category: e.category,
        Amount: e.amount,
        Description: e.description,
        PaymentMethod: e.paymentMethod,
      }));
    } else if (reportType === 'udhaar') {
      rows = customers.filter((c) => c.currentBalance > 0).map((c) => ({
        CustomerName: c.name,
        Phone: c.phone,
        PendingBalance: c.currentBalance,
        CreditLimit: c.creditLimit,
      }));
    } else if (reportType === 'inventory') {
      rows = products.map((p) => ({
        ProductName: p.name,
        Category: p.category,
        Stock: p.currentStock,
        Unit: p.unit,
        PurchaseCost: p.purchasePrice,
        SellingPrice: p.sellingPrice,
      }));
    } else {
      // P&L summary
      rows = [
        { Metric: 'Total Recorded Sales', Value: metrics.totalSales },
        { Metric: 'Cash Collected', Value: metrics.cashCollected },
        { Metric: 'Outstanding Udhaar (Receivables)', Value: metrics.outstandingCredit },
        { Metric: 'Total Operating Expenses', Value: metrics.totalExpenses },
        { Metric: 'Estimated Gross Profit', Value: metrics.estimatedProfit },
      ];
    }

    exportToCSV(filename, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCE9E1] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Financial & Business Reports</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Auditable business analytics, Profit & Loss estimates, and exportable CA ledgers.
          </p>
        </div>

        <button
          onClick={handleExportCurrentReport}
          className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Current Report (CSV)</span>
        </button>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setReportType('pnl')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            reportType === 'pnl' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'bg-white border border-[#DCE9E1] text-[#61736A]'
          }`}
        >
          Profit & Loss Summary
        </button>
        <button
          onClick={() => setReportType('sales')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            reportType === 'sales' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'bg-white border border-[#DCE9E1] text-[#61736A]'
          }`}
        >
          Sales Ledger
        </button>
        <button
          onClick={() => setReportType('expenses')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            reportType === 'expenses' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'bg-white border border-[#DCE9E1] text-[#61736A]'
          }`}
        >
          Expenses Breakdown
        </button>
        <button
          onClick={() => setReportType('udhaar')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            reportType === 'udhaar' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'bg-white border border-[#DCE9E1] text-[#61736A]'
          }`}
        >
          Udhaar Credit Aging
        </button>
        <button
          onClick={() => setReportType('inventory')}
          className={`px-4 py-2 rounded-xl transition-all shrink-0 ${
            reportType === 'inventory' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'bg-white border border-[#DCE9E1] text-[#61736A]'
          }`}
        >
          Inventory Valuation
        </button>
      </div>

      {/* Render Active Report */}
      {reportType === 'pnl' && (
        <div className="bg-white rounded-3xl border border-[#DCE9E1] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-[#DCE9E1] pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-[#0B2E26]">Estimated Profit & Loss Statement</h2>
              <p className="text-xs text-[#61736A]">Accounting breakdown distinguishing cash, credit, and costs.</p>
            </div>
            <span className="text-xs font-bold text-[#0F8F5F] bg-[#E8F9F0] px-3 py-1 rounded-full">
              FY 2026-27
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Sales Section */}
            <div className="p-4 bg-[#F8FFF9] rounded-2xl border border-[#DCE9E1] space-y-2">
              <span className="font-extrabold text-sm text-[#0B2E26] block">A. Revenue & Inflow</span>
              <div className="flex justify-between text-[#61736A]">
                <span>Total Recorded Invoiced Sales:</span>
                <span className="font-mono font-bold text-[#0B2E26]">{formatINR(metrics.totalSales)}</span>
              </div>
              <div className="flex justify-between text-[#15803D]">
                <span>• Cash / UPI Actual Received:</span>
                <span className="font-mono font-bold">{formatINR(metrics.cashCollected)}</span>
              </div>
              <div className="flex justify-between text-[#DC2626]">
                <span>• Accounts Receivable (Customer Udhaar pending):</span>
                <span className="font-mono font-bold">{formatINR(metrics.outstandingCredit)}</span>
              </div>
            </div>

            {/* Operating Expenses Section */}
            <div className="p-4 bg-[#F8FFF9] rounded-2xl border border-[#DCE9E1] space-y-2">
              <span className="font-extrabold text-sm text-[#0B2E26] block">B. Operating Expenses</span>
              {expenses.map((e) => (
                <div key={e.id} className="flex justify-between text-[#61736A]">
                  <span>{e.category} ({e.description}):</span>
                  <span className="font-mono font-bold text-[#DC2626]">- {formatINR(e.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t border-[#DCE9E1] text-[#0B2E26]">
                <span>Total Operating Burn:</span>
                <span className="font-mono text-[#DC2626]">- {formatINR(metrics.totalExpenses)}</span>
              </div>
            </div>

            {/* Gross Profit Conclusion */}
            <div className="p-5 bg-[#E8F9F0] rounded-2xl border border-[#0F8F5F]/40 flex items-center justify-between">
              <div>
                <span className="font-black text-base text-[#0B2E26] block">Estimated Gross Profit Margin</span>
                <span className="text-[11px] text-[#61736A]">Sales minus estimated cost of merchandise sold.</span>
              </div>
              <span className="text-2xl font-black text-[#0F8F5F] font-mono">
                {formatINR(metrics.estimatedProfit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {reportType !== 'pnl' && (
        <div className="bg-white rounded-3xl border border-[#DCE9E1] p-6 shadow-xs text-xs space-y-4">
          <h3 className="font-bold text-sm text-[#0B2E26] uppercase tracking-wider">
            {reportType.toUpperCase()} Report Detailed Records
          </h3>
          <p className="text-[#61736A]">
            Use the "Export Current Report" button to download these records into an Excel-ready CSV spreadsheet.
          </p>
          <div className="p-4 bg-[#F8FFF9] rounded-2xl border border-[#DCE9E1] font-mono">
            Ready to export {reportType} dataset with full customer, product, and financial attributes.
          </div>
        </div>
      )}
    </div>
  );
};
