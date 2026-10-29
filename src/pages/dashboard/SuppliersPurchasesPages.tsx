import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, exportToCSV } from '../../lib/formatters';
import { Building2, Truck, Plus, Download, Search, Phone, Check, X } from 'lucide-react';

// 1. SUPPLIERS PAGE
export const SuppliersPage: React.FC = () => {
  const { suppliers, addSupplier } = useApp();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(search.toLowerCase())) ||
      s.phone.includes(search)
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSupplier({
      name: name.trim(),
      contactPerson: contactPerson.trim() || undefined,
      phone: phone.trim() || '9876543210',
      gstin: gstin.trim().toUpperCase() || undefined,
    });
    setShowAddModal(false);
    setName('');
    setContactPerson('');
    setPhone('');
    setGstin('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE9E1]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Suppliers & Wholesalers</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Manage vendor profiles, purchase costs, and payables.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F9F0] text-[#0F8F5F] font-bold flex items-center justify-center text-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0B2E26]">{s.name}</h3>
                  <span className="text-[11px] text-[#61736A] block">Contact: {s.contactPerson || 'Proprietor'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCE9E1] space-y-1.5 text-xs text-[#61736A]">
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-mono text-[#0B2E26]">{s.phone}</span>
              </div>
              {s.gstin && (
                <div className="flex justify-between">
                  <span>GSTIN:</span>
                  <span className="font-mono text-[#0B2E26]">{s.gstin}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Balance Payable:</span>
                <span className="text-[#DC2626] font-mono">{formatINR(s.balancePayable)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE9E1] overflow-hidden">
            <div className="bg-[#0B2E26] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add New Supplier</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#61736A] mb-1">Company / Wholesale Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  placeholder="e.g. Om Distributors"
                />
              </div>
              <div>
                <label className="block font-bold text-[#61736A] mb-1">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  placeholder="e.g. Satish Bhai"
                />
              </div>
              <div>
                <label className="block font-bold text-[#61736A] mb-1">Mobile / Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  placeholder="+91 98111 22334"
                />
              </div>
              <div>
                <label className="block font-bold text-[#61736A] mb-1">Supplier GSTIN</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs uppercase focus:outline-none"
                  placeholder="27AABCS1234F1Z8"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl border border-[#DCE9E1] text-[#61736A] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. PURCHASES PAGE
export const PurchasesPage: React.FC = () => {
  const { suppliers, products, adjustStock } = useApp();
  const [purchases, setPurchases] = useState<any[]>([
    {
      id: 'pur_1',
      supplierName: 'Shree Krishna FMCG Wholesalers',
      billNumber: 'BILL-OCT-981',
      date: '2026-10-18',
      grandTotal: 18400,
      paymentStatus: 'paid',
      itemsCount: 4,
    },
    {
      id: 'pur_2',
      supplierName: 'Om Beverages & Snacks Distributor',
      billNumber: 'INV-4412',
      date: '2026-10-24',
      grandTotal: 7200,
      paymentStatus: 'paid',
      itemsCount: 2,
    },
  ]);

  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [billNo, setBillNo] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState('20');
  const [unitCost, setUnitCost] = useState('15');

  const handleRecordPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const q = parseFloat(qty);
    const c = parseFloat(unitCost);
    if (!q || !c) return;

    const supplier = suppliers.find((s) => s.id === supplierId);
    const prod = products.find((p) => p.id === selectedProductId);

    const total = q * c;
    const newPur = {
      id: `pur_${Date.now()}`,
      supplierName: supplier?.name || 'Wholesale Supplier',
      billNumber: billNo || `PUR-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      grandTotal: total,
      paymentStatus: 'paid',
      itemsCount: 1,
    };

    setPurchases([newPur, ...purchases]);

    // Automatically increase inventory stock
    if (prod) {
      adjustStock(prod.id, q, 'purchase', `Inward purchase bill #${newPur.billNumber}`);
    }

    setShowAddPurchase(false);
    setBillNo('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE9E1]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Purchases & Inward Stock</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Record wholesale purchases, update inventory stock, and track supplier invoices.
          </p>
        </div>

        <button
          onClick={() => setShowAddPurchase(true)}
          className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Inward Purchase</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#DCE9E1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FFF9] text-[#61736A] font-bold border-b border-[#DCE9E1]">
              <tr>
                <th className="p-3.5">Bill #</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Supplier Name</th>
                <th className="p-3.5 text-center">Items</th>
                <th className="p-3.5 text-right">Total Cost</th>
                <th className="p-3.5 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE9E1]">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-[#F8FFF9] transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#0F8F5F]">{p.billNumber}</td>
                  <td className="p-3.5 text-[#61736A]">{formatDate(p.date)}</td>
                  <td className="p-3.5 font-bold text-[#0B2E26]">{p.supplierName}</td>
                  <td className="p-3.5 text-center text-[#61736A]">{p.itemsCount}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#0B2E26]">{formatINR(p.grandTotal)}</td>
                  <td className="p-3.5 text-center">
                    <span className="bg-[#DCFCE7] text-[#15803D] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddPurchase && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE9E1] overflow-hidden">
            <div className="bg-[#0B2E26] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Record Wholesale Purchase</h3>
              <button onClick={() => setShowAddPurchase(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPurchase} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#61736A] mb-1">Supplier</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#61736A] mb-1">Supplier Bill Number</label>
                <input
                  type="text"
                  placeholder="e.g. WH-2026-88"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#61736A] mb-1">Product Purchased (Stock will increase)</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (Current: {p.currentStock} {p.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#61736A] mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#61736A] mb-1">Unit Cost Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#E8F9F0] rounded-xl text-xs font-bold text-[#0F8F5F] flex justify-between">
                <span>Total Purchase Cost:</span>
                <span>₹{(Number(qty) * Number(unitCost) || 0).toFixed(2)}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPurchase(false)}
                  className="px-3 py-2 rounded-xl border border-[#DCE9E1] text-[#61736A] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold"
                >
                  Confirm & Inward Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
