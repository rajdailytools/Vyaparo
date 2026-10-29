import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../lib/formatters';
import { InvoiceItem, PaymentMethod } from '../../types';
import { X, Plus, Trash2, Receipt, Check, ArrowRight, UserPlus } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessInvoice?: (invoice: any) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSuccessInvoice,
}) => {
  const { customers, products, createInvoice, currentBusiness, addCustomer } = useApp();

  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>('paid');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Line items state
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: `item_${Date.now()}`,
      productId: products[0]?.id || '',
      productName: products[0]?.name || 'Standard Product',
      quantity: 1,
      unit: products[0]?.unit || 'pcs',
      unitPrice: products[0]?.sellingPrice || 100,
      discountRate: 0,
      taxRate: products[0]?.taxRate || currentBusiness?.defaultTaxRate || 18,
      totalAmount: products[0]?.sellingPrice || 100,
    },
  ]);

  if (!isOpen) return null;

  const handleProductSelect = (index: number, prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    const newItems = [...items];
    const qty = newItems[index].quantity || 1;
    const price = prod.sellingPrice;
    const disc = newItems[index].discountRate || 0;
    const tax = prod.taxRate || 0;

    const baseAmount = price * qty;
    const discounted = baseAmount * (1 - disc / 100);
    const taxed = discounted * (1 + tax / 100);

    newItems[index] = {
      ...newItems[index],
      productId: prod.id,
      productName: prod.name,
      unit: prod.unit,
      unitPrice: price,
      taxRate: tax,
      totalAmount: Math.round(taxed * 100) / 100,
    };
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const current = { ...newItems[index], [field]: value };
    const qty = Number(current.quantity) || 1;
    const price = Number(current.unitPrice) || 0;
    const disc = Number(current.discountRate) || 0;
    const tax = Number(current.taxRate) || 0;

    const base = price * qty;
    const afterDisc = base * (1 - disc / 100);
    const total = afterDisc * (1 + tax / 100);

    current.totalAmount = Math.round(total * 100) / 100;
    newItems[index] = current;
    setItems(newItems);
  };

  const addItemRow = () => {
    const defaultProd = products[0];
    setItems([
      ...items,
      {
        id: `item_${Date.now()}_${items.length}`,
        productId: defaultProd?.id || '',
        productName: defaultProd?.name || 'Custom Item',
        quantity: 1,
        unit: defaultProd?.unit || 'pcs',
        unitPrice: defaultProd?.sellingPrice || 50,
        discountRate: 0,
        taxRate: defaultProd?.taxRate || 18,
        totalAmount: defaultProd?.sellingPrice || 50,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);
  const totalDiscount = items.reduce((acc, it) => acc + (it.unitPrice * it.quantity * (it.discountRate / 100)), 0);
  const totalTax = items.reduce((acc, it) => {
    const discounted = (it.unitPrice * it.quantity) * (1 - it.discountRate / 100);
    return acc + (discounted * (it.taxRate / 100));
  }, 0);
  const grandTotal = Math.round((subtotal - totalDiscount + totalTax) * 100) / 100;

  const calculatedAmountPaid =
    paymentStatus === 'paid'
      ? grandTotal
      : paymentStatus === 'unpaid'
      ? 0
      : Math.min(grandTotal, Number(amountPaidInput) || 0);

  const balanceDue = Math.max(0, grandTotal - calculatedAmountPaid);

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    let targetCustomerId = customerId;
    let targetCustomerName = customerName;
    let targetCustomerPhone = customerPhone;

    // Handle instant new customer creation if selected
    if (showNewCustomer && newCustName.trim()) {
      const created = addCustomer({
        name: newCustName.trim(),
        phone: newCustPhone.trim() || '9876543210',
        creditLimit: 10000,
      });
      targetCustomerId = created.id;
      targetCustomerName = created.name;
      targetCustomerPhone = created.phone;
    }

    const created = createInvoice({
      customerId: targetCustomerId || undefined,
      customerName: targetCustomerName || 'Walk-in Customer',
      customerPhone: targetCustomerPhone || undefined,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: balanceDue > 0 ? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] : undefined,
      items,
      subtotal,
      discountAmount: totalDiscount,
      taxAmount: totalTax,
      grandTotal,
      amountPaid: calculatedAmountPaid,
      balanceDue,
      paymentStatus: balanceDue === 0 ? 'paid' : calculatedAmountPaid > 0 ? 'partial' : 'unpaid',
      status: 'finalized',
      paymentMethod: calculatedAmountPaid > 0 ? paymentMethod : undefined,
      notes,
    });

    if (onSuccessInvoice) {
      onSuccessInvoice(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-[#DCE9E1] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B2E26] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F8F5F] flex items-center justify-center text-[#A7F432]">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Create New Bill / Invoice</h3>
              <p className="text-[11px] text-[#A7F432]">Fast GST & Retail POS Counter</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSaveInvoice} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Customer Selection */}
          <div className="bg-[#F8FFF9] p-4 rounded-2xl border border-[#DCE9E1] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#0B2E26]">Customer Details</span>
              <button
                type="button"
                onClick={() => setShowNewCustomer(!showNewCustomer)}
                className="text-xs font-bold text-[#0F8F5F] flex items-center gap-1 hover:underline"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{showNewCustomer ? 'Select Existing' : '+ New Customer'}</span>
              </button>
            </div>

            {showNewCustomer ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Customer Full Name *"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="bg-white border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Mobile Number *"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="bg-white border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    const selected = customers.find((c) => c.id === e.target.value);
                    if (selected) {
                      setCustomerName(selected.name);
                      setCustomerPhone(selected.phone);
                    } else {
                      setCustomerName('Walk-in Customer');
                      setCustomerPhone('');
                    }
                  }}
                  className="bg-white border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
                >
                  <option value="">Walk-in Customer (Cash / Counter)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.currentBalance > 0 ? `(Pending Udhaar: ₹${c.currentBalance})` : ''}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  placeholder="Customer Phone (for WhatsApp receipt)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-white border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
                />
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#0B2E26]">Itemized Bill Items</span>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-bold text-[#0F8F5F] hover:bg-[#E8F9F0] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="border border-[#DCE9E1] rounded-2xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#E8F9F0] text-[#0B2E26] font-bold border-b border-[#DCE9E1]">
                    <tr>
                      <th className="p-2.5">Product / Service</th>
                      <th className="p-2.5 w-16">Qty</th>
                      <th className="p-2.5 w-20">Price (₹)</th>
                      <th className="p-2.5 w-16">Tax %</th>
                      <th className="p-2.5 w-24 text-right">Total (₹)</th>
                      <th className="p-2.5 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE9E1]">
                    {items.map((it, idx) => (
                      <tr key={it.id}>
                        <td className="p-2">
                          <select
                            value={it.productId || ''}
                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                            className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                          >
                            <option value="">Custom Product</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} (₹{p.sellingPrice} - Stock: {p.currentStock})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0.1"
                            step="any"
                            value={it.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={it.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={it.taxRate}
                            onChange={(e) => handleItemChange(idx, 'taxRate', e.target.value)}
                            className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none"
                          />
                        </td>
                        <td className="p-2 text-right font-bold text-[#0B2E26]">
                          ₹{it.totalAmount.toFixed(2)}
                        </td>
                        <td className="p-2 text-center">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItemRow(idx)}
                              className="text-[#DC2626] hover:bg-[#FEE2E2] p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Totals & Payment Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Method & Status */}
            <div className="bg-[#F8FFF9] p-4 rounded-2xl border border-[#DCE9E1] space-y-3">
              <span className="font-bold text-xs text-[#0B2E26] block">Payment Collection</span>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentStatus('paid')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    paymentStatus === 'paid' ? 'bg-[#0F8F5F] text-white shadow-xs' : 'bg-white border text-[#61736A]'
                  }`}
                >
                  Fully Paid
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('partial')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    paymentStatus === 'partial' ? 'bg-[#F59E0B] text-white shadow-xs' : 'bg-white border text-[#61736A]'
                  }`}
                >
                  Partial
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus('unpaid')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    paymentStatus === 'unpaid' ? 'bg-[#DC2626] text-white shadow-xs' : 'bg-white border text-[#61736A]'
                  }`}
                >
                  Udhaar (Credit)
                </button>
              </div>

              {paymentStatus === 'partial' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#61736A] mb-1">Cash / UPI Paid Now (₹)</label>
                  <input
                    type="number"
                    value={amountPaidInput}
                    onChange={(e) => setAmountPaidInput(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-white border border-[#DCE9E1] rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              )}

              {paymentStatus !== 'unpaid' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#61736A] mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-white border border-[#DCE9E1] rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                  >
                    <option value="upi">UPI / QR (PhonePe / GPay / Paytm)</option>
                    <option value="cash">Cash Counter</option>
                    <option value="card">Card / POS</option>
                    <option value="bank_transfer">Net Banking / NEFT</option>
                  </select>
                </div>
              )}
            </div>

            {/* Calculations Box */}
            <div className="bg-white p-4 rounded-2xl border border-[#DCE9E1] space-y-2 text-xs">
              <div className="flex justify-between text-[#61736A]">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#61736A]">
                <span>GST Tax:</span>
                <span>₹{totalTax.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-[#DC2626]">
                  <span>Discount:</span>
                  <span>-₹{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[#DCE9E1] font-extrabold text-sm text-[#0B2E26]">
                <span>Grand Total:</span>
                <span className="text-[#0F8F5F]">₹{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#61736A]">
                <span>Amount Collected:</span>
                <span className="font-bold text-[#15803D]">₹{calculatedAmountPaid.toFixed(2)}</span>
              </div>
              {balanceDue > 0 && (
                <div className="flex justify-between text-[11px] font-bold text-[#DC2626] bg-[#FEE2E2] p-1.5 rounded-lg">
                  <span>Added to Customer Udhaar:</span>
                  <span>₹{balanceDue.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Notes or terms (e.g. Items sold once cannot be returned)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#DCE9E1] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#DCE9E1] text-xs font-bold text-[#61736A] hover:bg-[#F8FFF9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save & Finalize Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
