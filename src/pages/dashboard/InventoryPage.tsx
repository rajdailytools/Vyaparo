import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, exportToCSV } from '../../lib/formatters';
import {
  Package,
  Search,
  Plus,
  Download,
  AlertTriangle,
  ArrowUpDown,
  History,
  TrendingDown,
  TrendingUp,
  X,
  Check,
} from 'lucide-react';
import { Product } from '../../types';

interface InventoryPageProps {
  onOpenProductModal: () => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({ onOpenProductModal }) => {
  const { products, adjustStock } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');

  // Stock Adjustment Quick Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState('10');
  const [adjustType, setAdjustType] = useState<'adjustment_add' | 'adjustment_sub'>('adjustment_add');
  const [adjustNotes, setAdjustNotes] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    if (filterStatus === 'low') {
      return matchesSearch && p.currentStock > 0 && p.currentStock <= p.minStockAlert;
    }
    if (filterStatus === 'out') {
      return matchesSearch && p.currentStock === 0;
    }
    return matchesSearch;
  });

  const totalItemsCount = products.length;
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStockAlert).length;
  const totalValuation = products.reduce((acc, p) => acc + (p.purchasePrice * p.currentStock), 0);

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    const qty = parseFloat(adjustQty);
    if (!qty || qty <= 0) return;

    adjustStock(adjustingProduct.id, qty, adjustType, adjustNotes || 'Manual stock update');
    setAdjustingProduct(null);
  };

  const handleExport = () => {
    const rows = products.map((p) => ({
      ProductName: p.name,
      Category: p.category,
      SKU: p.sku || '',
      Unit: p.unit,
      PurchasePrice: p.purchasePrice,
      SellingPrice: p.sellingPrice,
      CurrentStock: p.currentStock,
      MinAlert: p.minStockAlert,
      Status: p.currentStock === 0 ? 'Out of Stock' : p.currentStock <= p.minStockAlert ? 'Low Stock' : 'In Stock',
    }));
    exportToCSV(`Vyaparo_Inventory_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCE9E1]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2E26]">Inventory & Stock Management</h1>
          <p className="text-xs text-[#61736A] mt-1">
            Real-time stock quantities, automatic sales deductions, and low-inventory warnings.
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
            onClick={onOpenProductModal}
            className="flex items-center gap-1.5 bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs">
          <span className="text-xs font-bold text-[#61736A] uppercase tracking-wide">Total Products</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#0B2E26]">{totalItemsCount}</div>
          <span className="text-[11px] text-[#61736A] mt-1 block">Active SKU catalog</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#DCE9E1] shadow-xs">
          <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wide">Low / Out of Stock</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#DC2626]">{lowStockCount}</div>
          <span className="text-[11px] text-[#DC2626] font-bold mt-1 block">Need immediate supplier reorder</span>
        </div>

        <div className="bg-[#E8F9F0] p-5 rounded-3xl border border-[#0F8F5F]/40 shadow-xs">
          <span className="text-xs font-bold text-[#0F8F5F] uppercase tracking-wide">Stock Valuation (Cost)</span>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-[#0B2E26]">{formatINR(totalValuation)}</div>
          <span className="text-[11px] text-[#61736A] mt-1 block">Based on purchase cost</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#61736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product name, category or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#DCE9E1] rounded-2xl pl-10 pr-3.5 py-2 text-xs focus:outline-none focus:border-[#0F8F5F]"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#DCE9E1] text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'all' ? 'bg-[#0F8F5F] text-white' : 'text-[#61736A]'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setFilterStatus('low')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'low' ? 'bg-[#D97706] text-white' : 'text-[#61736A]'
            }`}
          >
            Low Stock
          </button>
          <button
            onClick={() => setFilterStatus('out')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterStatus === 'out' ? 'bg-[#DC2626] text-white' : 'text-[#61736A]'
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#DCE9E1] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FFF9] text-[#61736A] font-bold border-b border-[#DCE9E1]">
              <tr>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Purchase Cost</th>
                <th className="p-3.5 text-right">Selling Price</th>
                <th className="p-3.5 text-center">Current Stock</th>
                <th className="p-3.5 text-center">Stock Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE9E1]">
              {filteredProducts.map((p) => {
                const isOut = p.currentStock === 0;
                const isLow = !isOut && p.currentStock <= p.minStockAlert;

                return (
                  <tr key={p.id} className="hover:bg-[#F8FFF9] transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-[#0B2E26] block">{p.name}</span>
                      <span className="text-[10px] text-[#61736A] font-mono">{p.sku || 'SKU-AUTO'}</span>
                    </td>
                    <td className="p-3.5 text-[#61736A]">{p.category}</td>
                    <td className="p-3.5 text-right font-mono text-[#61736A]">
                      {formatINR(p.purchasePrice)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#0B2E26]">
                      {formatINR(p.sellingPrice)}
                    </td>
                    <td className="p-3.5 text-center font-bold text-sm">
                      {p.currentStock} {p.unit}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isOut
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : isLow
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#DCFCE7] text-[#15803D]'
                        }`}
                      >
                        ● {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setAdjustingProduct(p)}
                        className="bg-[#E8F9F0] hover:bg-[#0F8F5F] hover:text-white text-[#0F8F5F] px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-[#DCE9E1] overflow-hidden">
            <div className="bg-[#0B2E26] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Adjust Stock: {adjustingProduct.name}</h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleApplyAdjustment} className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[#61736A] block">Current Stock:</span>
                <span className="font-bold text-base text-[#0B2E26]">
                  {adjustingProduct.currentStock} {adjustingProduct.unit}
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#61736A] mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjustment_add')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      adjustType === 'adjustment_add' ? 'bg-[#0F8F5F] text-white' : 'bg-gray-100 text-[#61736A]'
                    }`}
                  >
                    + Add Inward Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('adjustment_sub')}
                    className={`py-2 rounded-xl font-bold transition-all ${
                      adjustType === 'adjustment_sub' ? 'bg-[#DC2626] text-white' : 'bg-gray-100 text-[#61736A]'
                    }`}
                  >
                    - Deduct / Damage
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#61736A] mb-1">Quantity ({adjustingProduct.unit})</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs font-bold text-[#0B2E26] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#61736A] mb-1">Reason / Note</label>
                <input
                  type="text"
                  placeholder="e.g. New wholesale delivery, damaged packaging"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full bg-[#F8FFF9] border border-[#DCE9E1] rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-3 py-2 rounded-xl border border-[#DCE9E1] font-bold text-[#61736A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0F8F5F] hover:bg-[#0B2E26] text-white px-5 py-2 rounded-xl font-bold transition-colors"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
