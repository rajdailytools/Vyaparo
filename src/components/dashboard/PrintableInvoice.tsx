import React from 'react';
import { Invoice } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters';
import { Logo } from '../common/Logo';
import { Printer, Share2, X, Download, QrCode } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PrintableInvoiceProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice, onClose }) => {
  const { currentBusiness } = useApp();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `Namaste ${invoice.customerName}! Here is your invoice #${invoice.invoiceNumber} from ${currentBusiness?.name || 'Vyaparo Store'} for ${formatINR(invoice.grandTotal)}.\nStatus: ${invoice.paymentStatus.toUpperCase()}\nThank you for shopping with us!`;
    const url = `https://wa.me/${invoice.customerPhone ? invoice.customerPhone.replace(/\D/g, '') : ''}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-[#DCE9E1] overflow-hidden my-6 flex flex-col max-h-[95vh]">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-[#0B2E26] text-white p-4 flex items-center justify-between border-b border-[#0F8F5F]/30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Invoice #{invoice.invoiceNumber}</span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                invoice.paymentStatus === 'paid'
                  ? 'bg-[#A7F432] text-[#0B2E26]'
                  : invoice.paymentStatus === 'partial'
                  ? 'bg-[#F59E0B] text-[#0B2E26]'
                  : 'bg-[#DC2626] text-white'
              }`}
            >
              {invoice.paymentStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebd59] text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-3 py-1.5 rounded-xl font-bold text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Bill Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#15251F] font-sans text-xs print:p-0 print:space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-[#0B2E26]">
            <div>
              <Logo variant="horizontal" size="sm" />
              <div className="mt-2 space-y-0.5 text-xs text-[#61736A]">
                <h4 className="font-extrabold text-sm text-[#0B2E26]">{currentBusiness?.name}</h4>
                <p>{currentBusiness?.addressLine1}, {currentBusiness?.city}, {currentBusiness?.state} - {currentBusiness?.pincode}</p>
                <p>Phone: {currentBusiness?.phone} {currentBusiness?.gstin ? `| GSTIN: ${currentBusiness.gstin}` : ''}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <h2 className="text-lg font-black text-[#0B2E26] uppercase tracking-wider">
                {currentBusiness?.isGstRegistered ? 'TAX INVOICE' : 'RETAIL INVOICE'}
              </h2>
              <div className="text-xs">
                <span className="font-bold">Invoice No: </span>
                <span className="font-mono font-bold text-[#0F8F5F]">{invoice.invoiceNumber}</span>
              </div>
              <div className="text-xs text-[#61736A]">
                <span>Date: </span>
                <span>{formatDate(invoice.invoiceDate)}</span>
              </div>
              {invoice.dueDate && (
                <div className="text-xs text-[#DC2626] font-semibold">
                  <span>Due Date: </span>
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Billed To */}
          <div className="bg-[#F8FFF9] p-4 rounded-xl border border-[#DCE9E1] flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#61736A] uppercase tracking-wider block">Billed To</span>
              <h4 className="font-bold text-sm text-[#0B2E26] mt-0.5">{invoice.customerName}</h4>
              {invoice.customerPhone && <p className="text-xs text-[#61736A]">Phone: {invoice.customerPhone}</p>}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[#61736A] uppercase tracking-wider block">Payment Terms</span>
              <span className="font-bold text-xs uppercase text-[#0B2E26]">
                {invoice.paymentStatus === 'paid' ? 'Paid in Full' : 'Due on Delivery / Udhaar'}
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#DCE9E1] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B2E26] text-white">
                <tr>
                  <th className="p-2.5 w-10 text-center">#</th>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center w-16">Qty</th>
                  <th className="p-2.5 text-right w-24">Unit Rate</th>
                  <th className="p-2.5 text-center w-16">Tax %</th>
                  <th className="p-2.5 text-right w-24">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE9E1]">
                {invoice.items.map((it, idx) => (
                  <tr key={it.id || idx}>
                    <td className="p-2.5 text-center text-[#61736A]">{idx + 1}</td>
                    <td className="p-2.5 font-semibold text-[#0B2E26]">{it.productName}</td>
                    <td className="p-2.5 text-center">{it.quantity} {it.unit}</td>
                    <td className="p-2.5 text-right font-mono">₹{it.unitPrice.toFixed(2)}</td>
                    <td className="p-2.5 text-center">{it.taxRate}%</td>
                    <td className="p-2.5 text-right font-mono font-bold">₹{it.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & UPI Payment QR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            {/* UPI QR & Bank Details */}
            <div className="p-3.5 bg-[#E8F9F0] border border-[#0F8F5F]/30 rounded-2xl flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-[#DCE9E1] flex items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-[#0B2E26]" />
              </div>
              <div className="space-y-0.5 text-[11px]">
                <span className="font-bold text-[#0B2E26] block">Scan & Pay via UPI</span>
                <span className="text-[#0F8F5F] font-mono font-bold block">{currentBusiness?.upiId || 'rajstore@okhdfcbank'}</span>
                <span className="text-[#61736A] text-[10px] block">Bank: {currentBusiness?.bankName || 'HDFC Bank'} | A/C: {currentBusiness?.bankAccountNo || '•••••••1032'}</span>
              </div>
            </div>

            {/* Totals Box */}
            <div className="space-y-1.5 text-xs bg-[#F8FFF9] p-4 rounded-2xl border border-[#DCE9E1]">
              <div className="flex justify-between text-[#61736A]">
                <span>Subtotal:</span>
                <span className="font-mono">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#61736A]">
                <span>Estimated GST Tax:</span>
                <span className="font-mono">₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-[#DC2626]">
                  <span>Discount:</span>
                  <span className="font-mono">-₹{invoice.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-[#0B2E26] pt-1.5 border-t border-[#DCE9E1]">
                <span>Grand Total:</span>
                <span className="font-mono text-[#0F8F5F]">{formatINR(invoice.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-[#15803D] font-bold text-[11px]">
                <span>Amount Paid:</span>
                <span className="font-mono">{formatINR(invoice.amountPaid)}</span>
              </div>
              {invoice.balanceDue > 0 && (
                <div className="flex justify-between text-[#DC2626] font-bold text-[11px] pt-1 border-t border-dashed border-[#DCE9E1]">
                  <span>Udhaar Balance Due:</span>
                  <span className="font-mono">{formatINR(invoice.balanceDue)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-4 border-t border-[#DCE9E1] text-[10px] text-[#61736A] flex justify-between items-center">
            <span>Terms: Computer generated invoice by Vyaparo SaaS. Subject to Mumbai Jurisdiction.</span>
            <span className="font-bold text-[#0F8F5F]">Thank you! Phir Milenge.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
