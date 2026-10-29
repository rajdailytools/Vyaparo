import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../lib/formatters';
import { PaymentMethod } from '../../types';
import { X, Check, IndianRupee, UserPlus, PackagePlus, Wallet } from 'lucide-react';

// 1. PAYMENT MODAL (Udhaar Collection / Bill Settlement)
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultCustomerId,
}) => {
  const { customers, recordPayment } = useApp();
  const [partyId, setPartyId] = useState(defaultCustomerId || (customers[0]?.id || ''));
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedCustomer = customers.find((c) => c.id === partyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    recordPayment({
      partyType: 'customer',
      partyId,
      partyName: selectedCustomer?.name || 'Customer',
      amount: numAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      transactionRef: transactionRef || undefined,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE9E1] overflow-hidden">
        <div className="bg-[#0B2E26] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#A7F432]" />
            <h3 className="font-extrabold text-base">Record Payment Received</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#61736A] mb-1">Customer *</label>
            <select
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Pending Udhaar: {formatINR(c.currentBalance)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#61736A] mb-1">Amount Received (₹) *</label>
            <input
              type="number"
              required
              min="1"
              step="any"
              placeholder="e.g. 1200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs font-bold text-[#0B2E26] focus:outline-none focus:border-[#0F8F5F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#61736A] mb-1">Payment Channel</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
              <option value="cash">Cash Counter</option>
              <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#61736A] mb-1">UPI Ref / UTR (Optional)</label>
            <input
              type="text"
              placeholder="e.g. UPI-20261029-983"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#DCE9E1] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DCE9E1] text-xs font-bold text-[#61736A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. CUSTOMER MODAL
interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState('5000');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomer({
      name: name.trim(),
      phone: phone.trim() || '+91 98765 00000',
      creditLimit: parseFloat(creditLimit) || 5000,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE9E1] overflow-hidden">
        <div className="bg-[#0B2E26] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#A7F432]" />
            <h3 className="font-extrabold text-base">Add New Customer</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#61736A] mb-1">Customer Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Patel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#61736A] mb-1">Mobile / WhatsApp Number *</label>
            <input
              type="tel"
              required
              placeholder="+91 98200 12345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#61736A] mb-1">Maximum Udhaar Credit Limit (₹)</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={creditLimit}
              onChange={(e) => setCreditLimit(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#61736A] mb-1">Delivery Address</label>
            <input
              type="text"
              placeholder="Flat / Shop No., Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
            />
          </div>

          <div className="pt-3 border-t border-[#DCE9E1] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DCE9E1] text-xs font-bold text-[#61736A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. PRODUCT MODAL (Add / Edit Stock)
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [unit, setUnit] = useState('pcs');
  const [purchasePrice, setPurchasePrice] = useState('20');
  const [sellingPrice, setSellingPrice] = useState('30');
  const [currentStock, setCurrentStock] = useState('50');
  const [minStockAlert, setMinStockAlert] = useState('15');
  const [taxRate, setTaxRate] = useState('12');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name: name.trim(),
      category,
      unit,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      currentStock: parseFloat(currentStock) || 0,
      minStockAlert: parseFloat(minStockAlert) || 10,
      taxRate: parseFloat(taxRate) || 18,
      isActive: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE9E1] overflow-hidden">
        <div className="bg-[#0B2E26] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-[#A7F432]" />
            <h3 className="font-extrabold text-base">Add Product to Inventory</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#61736A] mb-1">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Parle-G Biscuit 100g"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="packet">Packet</option>
                <option value="bottle">Bottle</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="box">Box</option>
                <option value="ltr">Liter</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Purchase Cost (₹)</label>
              <input
                type="number"
                min="0"
                step="any"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="any"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs font-bold text-[#0B2E26] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Current Stock Qty</label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#61736A] mb-1">Low-Stock Alert Qty</label>
              <input
                type="number"
                min="1"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(e.target.value)}
                className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#DCE9E1] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DCE9E1] text-xs font-bold text-[#61736A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. EXPENSE MODAL
interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense } = useApp();
  const [category, setCategory] = useState('Shop Rent');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    addExpense({
      category,
      amount: num,
      expenseDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
      description: description.trim() || category,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE9E1] overflow-hidden">
        <div className="bg-[#0B2E26] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#A7F432]" />
            <h3 className="font-extrabold text-base">Record Business Expense</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#61736A] mb-1">Expense Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              <option value="Shop Rent">Shop Rent</option>
              <option value="Electricity">Electricity & Water</option>
              <option value="Transport">Transport & Auto Carriage</option>
              <option value="Salaries">Staff Salaries & Wages</option>
              <option value="Packaging">Packaging Bags & Boxes</option>
              <option value="Repairs">Repairs & Maintenance</option>
              <option value="Marketing">Marketing & Signs</option>
              <option value="Office & Tea">Tea, Snacks & Supplies</option>
              <option value="Other">Other Operational Cost</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#61736A] mb-1">Amount (₹) *</label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 1500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs font-bold text-[#0B2E26] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#61736A] mb-1">Paid Via</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
            >
              <option value="cash">Cash Counter</option>
              <option value="upi">UPI / GPay / PhonePe</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#61736A] mb-1">Description / Bill Notes</label>
            <input
              type="text"
              placeholder="e.g. October electricity bill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#DCE9E1] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#DCE9E1] text-xs font-bold text-[#61736A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-colors"
            >
              Record Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
